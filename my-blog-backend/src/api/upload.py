"""
图片上传API接口
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List, Optional
import mimetypes
from src.utils.github_image_bed import github_image_bed
from src.utils.auth import get_current_user_id
from src.utils.logger import log, api_log

router = APIRouter()

# 支持的图片格式
ALLOWED_IMAGE_TYPES = {
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
    'image/webp', 'image/bmp', 'image/svg+xml'
}

# 最大文件大小 (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024


def validate_image_file(file: UploadFile) -> None:
    """验证上传的图片文件"""
    # 检查文件类型
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"不支持的文件类型: {file.content_type}。支持的格式: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
    
    # 检查文件扩展名
    if file.filename:
        mime_type, _ = mimetypes.guess_type(file.filename)
        if mime_type and mime_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"不支持的文件扩展名。文件: {file.filename}"
            )


@router.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user_id: int = Depends(get_current_user_id)
):
    """
    上传单张图片到GitHub图床
    
    Args:
        file: 上传的图片文件
        current_user_id: 当前用户ID
        
    Returns:
        包含图片URL等信息的响应
    """
    if not github_image_bed:
        raise HTTPException(
            status_code=503, 
            detail="GitHub图床服务未配置，请联系管理员"
        )
    
    try:
        # 验证文件
        validate_image_file(file)
        
        # 读取文件内容
        file_content = await file.read()
        
        # 检查文件大小
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"文件大小超过限制。最大允许: {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # 检查文件是否为空
        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="文件内容为空")
        
        # 记录上传日志
        api_log.info(f"用户 {current_user_id} 正在上传图片: {file.filename}, 大小: {len(file_content)} bytes")
        
        # 上传到GitHub
        result = await github_image_bed.upload_image(file_content, file.filename)
        
        # 记录成功日志
        api_log.info(f"用户 {current_user_id} 图片上传成功: {result['filename']}")
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "图片上传成功",
                "data": {
                    "url": result["download_url"],  # 直接访问URL
                    "filename": result["filename"],
                    "original_name": file.filename,
                    "size": result["size"],
                    "path": result["path"]
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"上传图片失败: {str(e)}"
        log.error(error_msg)
        api_log.error(f"用户 {current_user_id} 图片上传失败: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)


@router.post("/upload/images")
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    current_user_id: int = Depends(get_current_user_id)
):
    """
    批量上传图片到GitHub图床
    
    Args:
        files: 上传的图片文件列表
        current_user_id: 当前用户ID
        
    Returns:
        包含所有图片上传结果的响应
    """
    if not github_image_bed:
        raise HTTPException(
            status_code=503, 
            detail="GitHub图床服务未配置，请联系管理员"
        )
    
    if len(files) > 10:  # 限制批量上传数量
        raise HTTPException(status_code=400, detail="一次最多上传10张图片")
    
    results = []
    errors = []
    
    for i, file in enumerate(files):
        try:
            # 验证文件
            validate_image_file(file)
            
            # 读取文件内容
            file_content = await file.read()
            
            # 检查文件大小
            if len(file_content) > MAX_FILE_SIZE:
                errors.append({
                    "index": i,
                    "filename": file.filename,
                    "error": f"文件大小超过限制: {MAX_FILE_SIZE // (1024*1024)}MB"
                })
                continue
            
            # 检查文件是否为空
            if len(file_content) == 0:
                errors.append({
                    "index": i,
                    "filename": file.filename,
                    "error": "文件内容为空"
                })
                continue
            
            # 上传到GitHub
            result = await github_image_bed.upload_image(file_content, file.filename)
            
            results.append({
                "index": i,
                "success": True,
                "url": result["download_url"],
                "filename": result["filename"],
                "original_name": file.filename,
                "size": result["size"],
                "path": result["path"]
            })
            
        except Exception as e:
            errors.append({
                "index": i,
                "filename": file.filename,
                "error": str(e)
            })
    
    # 记录批量上传日志
    api_log.info(f"用户 {current_user_id} 批量上传图片: 成功 {len(results)} 张, 失败 {len(errors)} 张")
    
    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": f"批量上传完成: 成功 {len(results)} 张, 失败 {len(errors)} 张",
            "data": {
                "results": results,
                "errors": errors,
                "total": len(files),
                "success_count": len(results),
                "error_count": len(errors)
            }
        }
    )


@router.get("/upload/images")
async def list_images(
    page: int = 1,
    limit: int = 20,
    current_user_id: int = Depends(get_current_user_id)
):
    """
    获取GitHub图床中的图片列表

    Args:
        page: 页码
        limit: 每页数量
        current_user_id: 当前用户ID

    Returns:
        图片列表
    """
    if not github_image_bed:
        raise HTTPException(
            status_code=503,
            detail="GitHub图床服务未配置，请联系管理员"
        )

    try:
        # 记录访问日志
        api_log.info(f"用户 {current_user_id} 正在获取图片列表: page={page}, limit={limit}")

        # 获取图片列表
        result = await github_image_bed.list_images(page, limit)

        api_log.info(f"用户 {current_user_id} 获取图片列表成功: 共 {len(result.get('images', []))} 张")

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "获取图片列表成功",
                "data": result
            }
        )

    except Exception as e:
        error_msg = f"获取图片列表失败: {str(e)}"
        log.error(error_msg)
        api_log.error(f"用户 {current_user_id} 获取图片列表失败: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)


@router.delete("/upload/image")
async def delete_image(
    file_path: str,
    current_user_id: int = Depends(get_current_user_id)
):
    """
    删除GitHub图床中的图片

    Args:
        file_path: 图片在GitHub仓库中的路径
        current_user_id: 当前用户ID

    Returns:
        删除结果
    """
    if not github_image_bed:
        raise HTTPException(
            status_code=503,
            detail="GitHub图床服务未配置，请联系管理员"
        )

    try:
        # 记录删除日志
        api_log.info(f"用户 {current_user_id} 正在删除图片: {file_path}")
        log.info(f"删除图片API调用: file_path={file_path}")

        # 删除图片
        success = await github_image_bed.delete_image(file_path)

        if success:
            api_log.info(f"用户 {current_user_id} 图片删除成功: {file_path}")
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "图片删除成功"
                }
            )
        else:
            raise HTTPException(status_code=404, detail="图片不存在或删除失败")

    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"删除图片失败: {str(e)}"
        log.error(error_msg)
        api_log.error(f"用户 {current_user_id} 图片删除失败: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)
