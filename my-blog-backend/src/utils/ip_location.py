import requests
import json
from typing import Dict, Optional, List, Tuple
import time
import os
import re
import ipaddress
from functools import lru_cache

class IPLocationService:
    """IP地址地理位置查询服务"""
    
    def __init__(self):
        # 缓存文件路径
        self.cache_dir = os.path.join(os.path.dirname(__file__), '../../data')
        self.cache_file = os.path.join(self.cache_dir, 'ip_cache.json')
        self.ip_db_file = os.path.join(self.cache_dir, 'ip_data.json')
        
        # 确保缓存目录存在
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
            
        # 加载缓存
        self.ip_cache = self._load_cache()
        
        # 加载IP数据库
        self.ip_data = self._load_ip_database()
        
        # 初始化内部IP数据
        self._init_internal_ips()
    
    def _load_cache(self) -> Dict[str, Dict]:
        """加载IP地址缓存"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return {}
        return {}
    
    def _save_cache(self):
        """保存IP地址缓存"""
        with open(self.cache_file, 'w', encoding='utf-8') as f:
            json.dump(self.ip_cache, f, ensure_ascii=False)
    
    def _load_ip_database(self) -> List[Dict]:
        """加载IP地址数据库"""
        if not os.path.exists(self.ip_db_file):
            # 创建一个基本的数据库，包含一些常见的IP段
            self._create_basic_ip_database()
        
        try:
            with open(self.ip_db_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    
    def _create_basic_ip_database(self):
        """创建基本的IP数据库，包含一些主要的中国IP段和省份信息"""
        basic_data = [
            {"start_ip": "1.0.0.0", "end_ip": "1.255.255.255", "province": "北京市", "city": "北京市", "isp": "电信"},
            {"start_ip": "14.0.0.0", "end_ip": "14.255.255.255", "province": "广东省", "city": "广州市", "isp": "电信"},
            {"start_ip": "27.0.0.0", "end_ip": "27.255.255.255", "province": "上海市", "city": "上海市", "isp": "联通"},
            {"start_ip": "36.0.0.0", "end_ip": "36.255.255.255", "province": "浙江省", "city": "杭州市", "isp": "移动"},
            {"start_ip": "42.0.0.0", "end_ip": "42.255.255.255", "province": "江苏省", "city": "南京市", "isp": "联通"},
            {"start_ip": "58.0.0.0", "end_ip": "58.255.255.255", "province": "福建省", "city": "福州市", "isp": "电信"},
            {"start_ip": "60.0.0.0", "end_ip": "60.255.255.255", "province": "四川省", "city": "成都市", "isp": "电信"},
            {"start_ip": "101.0.0.0", "end_ip": "101.255.255.255", "province": "河南省", "city": "郑州市", "isp": "移动"},
            {"start_ip": "106.0.0.0", "end_ip": "106.255.255.255", "province": "广西", "city": "南宁市", "isp": "电信"},
            {"start_ip": "110.0.0.0", "end_ip": "110.255.255.255", "province": "湖北省", "city": "武汉市", "isp": "电信"},
            {"start_ip": "111.0.0.0", "end_ip": "111.255.255.255", "province": "安徽省", "city": "合肥市", "isp": "移动"},
            {"start_ip": "112.0.0.0", "end_ip": "112.255.255.255", "province": "重庆市", "city": "重庆市", "isp": "联通"},
            {"start_ip": "113.0.0.0", "end_ip": "113.255.255.255", "province": "天津市", "city": "天津市", "isp": "电信"},
            {"start_ip": "114.0.0.0", "end_ip": "114.255.255.255", "province": "河北省", "city": "石家庄市", "isp": "联通"},
            {"start_ip": "115.0.0.0", "end_ip": "115.255.255.255", "province": "山东省", "city": "济南市", "isp": "移动"},
            {"start_ip": "116.0.0.0", "end_ip": "116.255.255.255", "province": "辽宁省", "city": "沈阳市", "isp": "电信"},
            {"start_ip": "117.0.0.0", "end_ip": "117.255.255.255", "province": "吉林省", "city": "长春市", "isp": "联通"},
            {"start_ip": "118.0.0.0", "end_ip": "118.255.255.255", "province": "黑龙江省", "city": "哈尔滨市", "isp": "移动"},
            {"start_ip": "119.0.0.0", "end_ip": "119.255.255.255", "province": "山西省", "city": "太原市", "isp": "电信"},
            {"start_ip": "120.0.0.0", "end_ip": "120.255.255.255", "province": "云南省", "city": "昆明市", "isp": "联通"},
            {"start_ip": "121.0.0.0", "end_ip": "121.255.255.255", "province": "贵州省", "city": "贵阳市", "isp": "移动"},
            {"start_ip": "122.0.0.0", "end_ip": "122.255.255.255", "province": "西藏", "city": "拉萨市", "isp": "电信"},
            {"start_ip": "123.0.0.0", "end_ip": "123.255.255.255", "province": "青海省", "city": "西宁市", "isp": "联通"},
            {"start_ip": "124.0.0.0", "end_ip": "124.255.255.255", "province": "宁夏", "city": "银川市", "isp": "移动"},
            {"start_ip": "125.0.0.0", "end_ip": "125.255.255.255", "province": "甘肃省", "city": "兰州市", "isp": "电信"},
            {"start_ip": "175.0.0.0", "end_ip": "175.255.255.255", "province": "新疆", "city": "乌鲁木齐市", "isp": "联通"},
            {"start_ip": "180.0.0.0", "end_ip": "180.255.255.255", "province": "广东省", "city": "深圳市", "isp": "电信"},
            {"start_ip": "183.0.0.0", "end_ip": "183.255.255.255", "province": "江西省", "city": "南昌市", "isp": "移动"},
            {"start_ip": "192.168.0.0", "end_ip": "192.168.255.255", "province": "本地网络", "city": "内网IP", "isp": "局域网"},
            {"start_ip": "127.0.0.0", "end_ip": "127.255.255.255", "province": "本地环回", "city": "localhost", "isp": "本地"}
        ]
        
        with open(self.ip_db_file, 'w', encoding='utf-8') as f:
            json.dump(basic_data, f, ensure_ascii=False, indent=2)
        
        return basic_data
    
    def _init_internal_ips(self):
        """初始化内部IP映射，用于快速查询"""
        self.ip_ranges = []
        
        for item in self.ip_data:
            try:
                start_ip = int(ipaddress.IPv4Address(item["start_ip"]))
                end_ip = int(ipaddress.IPv4Address(item["end_ip"]))
                self.ip_ranges.append((
                    start_ip, 
                    end_ip, 
                    {
                        "province": item["province"], 
                        "city": item["city"], 
                        "isp": item["isp"]
                    }
                ))
            except Exception as e:
                print(f"初始化IP范围错误: {e}")
    
    @lru_cache(maxsize=1000)
    def get_location_cached(self, ip: str) -> Dict:
        """获取IP地址的地理位置信息（内存缓存）"""
        return self.get_location(ip)
    
    def get_location(self, ip: str) -> Dict:
        """获取IP地址的地理位置信息"""
        # 检查是否是合法IP地址
        if not self._is_valid_ip(ip):
            return {"province": "未知", "city": "未知", "isp": "未知"}
        
        # 检查缓存
        if ip in self.ip_cache:
            return self.ip_cache[ip]
        
        # 先尝试使用本地数据库查询
        location_info = self._query_local_database(ip)
        
        # 如果本地数据库没有找到，则尝试在线API
        if location_info["province"] == "未知":
            location_info = self._query_ip_location(ip)
        
        # 更新缓存
        if location_info and location_info["province"] != "未知":
            self.ip_cache[ip] = location_info
            # 定期保存缓存
            if len(self.ip_cache) % 10 == 0:
                self._save_cache()
        
        return location_info
    
    def _query_local_database(self, ip: str) -> Dict:
        """使用本地数据库查询IP地址"""
        try:
            # 将IP转换为整数进行比较
            ip_int = int(ipaddress.IPv4Address(ip))
            
            # 遍历IP范围查找匹配项
            for start_ip, end_ip, location in self.ip_ranges:
                if start_ip <= ip_int <= end_ip:
                    return location
        except:
            pass
        
        return {"province": "未知", "city": "未知", "isp": "未知"}
    
    def _is_valid_ip(self, ip: str) -> bool:
        """检查是否是有效的IP地址"""
        # 简单的IP地址格式验证
        if not ip:
            return False
        
        # IPv4格式验证
        ipv4_pattern = r"^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$"
        if re.match(ipv4_pattern, ip):
            return True
        
        # IPv6格式验证（简化）
        if ":" in ip:
            return True
        
        return False
    
    def _query_ip_location(self, ip: str) -> Dict:
        """从在线API查询IP地址的地理位置信息"""
        default_result = {"province": "未知", "city": "未知", "isp": "未知", "country": "未知"}
        
        try:
            ip_obj = ipaddress.ip_address(ip)
            if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_reserved:
                return {
                    "province": "内网IP" if ip_obj.is_private else "保留地址",
                    "city": "局域网" if ip_obj.is_private else "保留地址",
                    "isp": "本地网络",
                    "country": "中国"  # 添加国家信息
                }
        except:
            return default_result
            
        # 添加重试和超时机制
        retry_count = 3
        api_url = "https://ip.011102.xyz/"  # 不带IP参数的请求URL
        
        # 创建安全的请求会话
        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "application/json",
            "X-Real-IP": ip,  # 添加X-Real-IP头以指定要查询的IP
            "X-Forwarded-For": ip  # 添加X-Forwarded-For头作为备用
        })
        
        for attempt in range(retry_count):
            try:
                response = session.get(api_url, timeout=(3, 5))  # 连接超时3秒，读取超时5秒
                if response.status_code == 200:
                    try:
                        data = response.json()
                        # 检查返回的数据格式
                        if "IP" in data and isinstance(data["IP"], dict):
                            ip_info = data["IP"]
                            result = {
                                "province": ip_info.get("Region", "未知"),
                                "city": ip_info.get("City", "未知"),
                                "isp": ip_info.get("ASOrganization", "未知"),
                                "country": ip_info.get("Country", "未知"),
                                "country_code": ip_info.get("Country", "")
                            }
                            
                            # 如果是中国IP，确保显示中文国家名称
                            if result.get("country_code") == "CN" or result.get("country") == "CN":
                                result["country"] = "中国"
                            
                            # 验证结果有效性
                            if result["province"] != "未知" or result["city"] != "未知":
                                self.ip_cache[ip] = result  # 缓存结果
                                return result
                    except (ValueError, KeyError) as e:
                        print(f"解析IP数据错误: {str(e)}, 数据: {response.text[:200]}")
                
                # 如果请求受限，等待一秒后重试
                if response.status_code == 429:
                    time.sleep(1)
                    continue
                    
            except (requests.RequestException, ValueError, KeyError) as e:
                if attempt == retry_count - 1:
                    print(f"IP查询失败(尝试{attempt+1}/{retry_count}): {str(e)}")
        
        # 如果在线API查询失败，尝试使用本地数据库
        local_result = self._query_local_database(ip)
        if local_result["province"] != "未知":
            # 添加国家信息
            local_result["country"] = "中国"
            return local_result
            
        return default_result

# 单例模式
ip_location_service = IPLocationService()

def get_ip_location(ip: str) -> Dict:
    """获取IP地址的地理位置信息"""
    try:
        # 检查IP是否为None或空字符串
        if not ip:
            return {"province": "未知", "city": "未知", "isp": "未知"}
            
        return ip_location_service.get_location_cached(ip)
    except Exception as e:
        print(f"获取IP位置失败: {str(e)}")
        return {"province": "未知", "city": "未知", "isp": "未知"} 