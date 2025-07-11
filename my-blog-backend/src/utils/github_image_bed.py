"""
GitHub图床上传工具类
用于将图片上传到GitHub仓库作为图床
"""

import os
import base64
import hashlib
import mimetypes
from datetime import datetime
from typing import Optional, Dict, Any
import httpx
from fastapi import HTTPException
from src.utils.logger import log


class GitHubImageBed:
    """GitHub图床上传工具"""
    
    def __init__(self):
        self.token = os.getenv('GITHUB_TOKEN')
        self.repo = os.getenv('GITHUB_REPO')
        self.branch = os.getenv('GITHUB_BRANCH', 'main')
        self.path = os.getenv('GITHUB_PATH', 'images')

        # CDN配置
        self.use_cdn = os.getenv('USE_CDN', 'false').lower() == 'true'
        self.cdn_provider = os.getenv('CDN_PROVIDER', 'jsdelivr')

        if not self.token or not self.repo:
            raise ValueError("GitHub配置不完整，请检查GITHUB_TOKEN和GITHUB_REPO环境变量")

        self.api_base = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "MyBlog-ImageBed/1.0"
        }
    
    def _generate_filename(self, original_filename: str, content: bytes) -> str:
        """生成唯一的文件名"""
        # 获取文件扩展名
        _, ext = os.path.splitext(original_filename)
        if not ext:
            ext = '.jpg'  # 默认扩展名
        
        # 使用时间戳和内容哈希生成唯一文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        content_hash = hashlib.md5(content).hexdigest()[:8]
        
        return f"{timestamp}_{content_hash}{ext}"
    
    def _get_file_info(self, file_path: str) -> Optional[Dict[str, Any]]:
        """获取GitHub仓库中文件的信息"""
        url = f"{self.api_base}/repos/{self.repo}/contents/{file_path}"
        
        try:
            with httpx.Client() as client:
                response = client.get(url, headers=self.headers)
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 404:
                    return None
                else:
                    log.error(f"获取文件信息失败: {response.status_code} - {response.text}")
                    return None
        except Exception as e:
            log.error(f"获取文件信息异常: {str(e)}")
            return None
    
    async def upload_image(self, file_content: bytes, filename: str) -> Dict[str, str]:
        """
        上传图片到GitHub仓库
        
        Args:
            file_content: 图片文件内容
            filename: 原始文件名
            
        Returns:
            包含上传结果的字典，包括url、download_url等信息
        """
        try:
            # 验证文件类型
            mime_type, _ = mimetypes.guess_type(filename)
            if not mime_type or not mime_type.startswith('image/'):
                raise HTTPException(status_code=400, detail="只支持图片文件")
            
            # 生成唯一文件名
            unique_filename = self._generate_filename(filename, file_content)
            file_path = f"{self.path}/{unique_filename}"
            
            # 检查文件是否已存在
            existing_file = self._get_file_info(file_path)
            if existing_file:
                log.warning(f"文件已存在: {file_path}")
                return {
                    "url": existing_file["html_url"],
                    "download_url": existing_file["download_url"],
                    "filename": unique_filename,
                    "path": file_path,
                    "size": existing_file["size"]
                }
            
            # 将文件内容编码为base64
            content_base64 = base64.b64encode(file_content).decode('utf-8')
            
            # 准备上传数据
            upload_data = {
                "message": f"Upload image: {unique_filename}",
                "content": content_base64,
                "branch": self.branch
            }
            
            # 上传文件到GitHub
            url = f"{self.api_base}/repos/{self.repo}/contents/{file_path}"
            
            async with httpx.AsyncClient() as client:
                response = await client.put(
                    url,
                    json=upload_data,
                    headers=self.headers,
                    timeout=30.0
                )
                
                if response.status_code in [200, 201]:
                    result = response.json()
                    content_info = result["content"]
                    
                    log.info(f"图片上传成功: {file_path}")

                    # 根据配置返回CDN URL或原始URL
                    if self.use_cdn:
                        access_url = self._get_cdn_url(unique_filename)
                    else:
                        access_url = content_info["download_url"]

                    return {
                        "url": content_info["html_url"],
                        "download_url": access_url,  # 使用CDN URL或原始URL
                        "cdn_url": self._get_cdn_url(unique_filename),  # 总是提供CDN URL选项
                        "raw_url": content_info["download_url"],  # 原始GitHub URL
                        "filename": unique_filename,
                        "path": file_path,
                        "size": content_info["size"],
                        "sha": content_info["sha"]
                    }
                else:
                    error_msg = f"上传失败: {response.status_code} - {response.text}"
                    log.error(error_msg)
                    raise HTTPException(status_code=500, detail=error_msg)
                    
        except HTTPException:
            raise
        except Exception as e:
            error_msg = f"上传图片时发生异常: {str(e)}"
            log.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
    
    async def delete_image(self, file_path: str) -> bool:
        """
        删除GitHub仓库中的图片

        Args:
            file_path: 文件路径

        Returns:
            删除是否成功
        """
        try:
            # URL解码文件路径
            import urllib.parse
            decoded_path = urllib.parse.unquote(file_path)
            log.info(f"删除图片: 原始路径={file_path}, 解码路径={decoded_path}")

            # 获取文件信息以获取SHA
            file_info = self._get_file_info(decoded_path)
            if not file_info:
                log.warning(f"文件不存在: {decoded_path}")
                return False
            
            # 准备删除数据
            delete_data = {
                "message": f"Delete image: {os.path.basename(decoded_path)}",
                "sha": file_info["sha"],
                "branch": self.branch
            }

            # 删除文件 - 使用解码后的路径
            url = f"{self.api_base}/repos/{self.repo}/contents/{decoded_path}"
            
            async with httpx.AsyncClient() as client:
                response = await client.request(
                    method="DELETE",
                    url=url,
                    json=delete_data,
                    headers=self.headers,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    log.info(f"图片删除成功: {decoded_path}")
                    return True
                else:
                    error_msg = f"删除失败: {response.status_code} - {response.text}"
                    log.error(error_msg)
                    return False
                    
        except Exception as e:
            log.error(f"删除图片时发生异常: {str(e)}")
            return False
    
    async def list_images(self, page: int = 1, limit: int = 20) -> Dict[str, Any]:
        """
        获取GitHub仓库中的图片列表

        Args:
            page: 页码
            limit: 每页数量

        Returns:
            包含图片列表和分页信息的字典
        """
        try:
            # 获取目录内容
            url = f"{self.api_base}/repos/{self.repo}/contents/{self.path}"

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=self.headers, timeout=30.0)

                if response.status_code == 200:
                    contents = response.json()

                    # 过滤出图片文件
                    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'}
                    images = []

                    for item in contents:
                        if item['type'] == 'file':
                            name = item['name'].lower()
                            if any(name.endswith(ext) for ext in image_extensions):
                                # 根据配置提供CDN URL或原始URL
                                if self.use_cdn:
                                    access_url = self._get_cdn_url(item['name'])
                                else:
                                    access_url = item['download_url']

                                images.append({
                                    'name': item['name'],
                                    'path': item['path'],
                                    'size': item['size'],
                                    'url': item['html_url'],
                                    'download_url': access_url,  # 使用CDN URL或原始URL
                                    'cdn_url': self._get_cdn_url(item['name']),  # 总是提供CDN URL选项
                                    'raw_url': item['download_url'],  # 原始GitHub URL
                                    'sha': item['sha'],
                                    'created_at': self._extract_date_from_filename(item['name'])
                                })

                    # 按创建时间排序（最新的在前）
                    images.sort(key=lambda x: x['created_at'] or '', reverse=True)

                    # 分页处理
                    total = len(images)
                    start_idx = (page - 1) * limit
                    end_idx = start_idx + limit
                    page_images = images[start_idx:end_idx]

                    log.info(f"获取图片列表成功: 总数 {total}, 当前页 {len(page_images)} 张")

                    return {
                        'images': page_images,
                        'total': total,
                        'page': page,
                        'limit': limit,
                        'total_pages': (total + limit - 1) // limit
                    }

                elif response.status_code == 404:
                    # 目录不存在，返回空列表
                    log.warning(f"图片目录不存在: {self.path}")
                    return {
                        'images': [],
                        'total': 0,
                        'page': page,
                        'limit': limit,
                        'total_pages': 0
                    }
                else:
                    error_msg = f"获取目录内容失败: {response.status_code} - {response.text}"
                    log.error(error_msg)
                    raise HTTPException(status_code=500, detail=error_msg)

        except Exception as e:
            error_msg = f"获取图片列表时发生异常: {str(e)}"
            log.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)

    def _extract_date_from_filename(self, filename: str) -> Optional[str]:
        """
        从文件名中提取日期信息

        Args:
            filename: 文件名

        Returns:
            日期字符串或None
        """
        import re
        # 匹配格式：20250709_091601_xxx.jpg
        match = re.match(r'(\d{8}_\d{6})_', filename)
        if match:
            return match.group(1)
        return None

    def get_image_url(self, filename: str) -> str:
        """
        获取图片的访问URL

        Args:
            filename: 文件名

        Returns:
            图片的访问URL
        """
        if self.use_cdn:
            return self._get_cdn_url(filename)
        else:
            return f"https://raw.githubusercontent.com/{self.repo}/{self.branch}/{self.path}/{filename}"

    def _get_cdn_url(self, filename: str) -> str:
        """
        获取CDN加速的图片URL

        Args:
            filename: 文件名

        Returns:
            CDN加速的图片URL
        """
        if self.cdn_provider == 'jsdelivr':
            # jsDelivr CDN格式: https://cdn.jsdelivr.net/gh/用户名/仓库名@分支名/路径/文件名
            return f"https://cdn.jsdelivr.net/gh/{self.repo}@{self.branch}/{self.path}/{filename}"
        elif self.cdn_provider == 'statically':
            # Statically CDN格式: https://cdn.statically.io/gh/用户名/仓库名/分支名/路径/文件名
            return f"https://cdn.statically.io/gh/{self.repo}/{self.branch}/{self.path}/{filename}"
        elif self.cdn_provider == 'githack':
            # GitHack CDN格式: https://raw.githack.com/用户名/仓库名/分支名/路径/文件名
            return f"https://raw.githack.com/{self.repo}/{self.branch}/{self.path}/{filename}"
        else:
            # 默认使用GitHub原始链接
            return f"https://raw.githubusercontent.com/{self.repo}/{self.branch}/{self.path}/{filename}"


# 创建全局实例
try:
    github_image_bed = GitHubImageBed()
except ValueError as e:
    log.warning(f"GitHub图床初始化失败: {e}")
    github_image_bed = None
