/**
 * 获取访问记录
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const getVisitorLogs = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/visitor-logs`, {
      params,
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * 获取访问统计数据
 * @param {Number} days - 统计天数
 * @returns {Promise}
 */
export const getVisitorStats = async (days = 7) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/visitor-stats`, {
      params: { days },
      headers: getAuthHeaders()
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * 获取IP地理位置信息
 * @param {String} ip - IP地址
 * @returns {Promise}
 */
export const getIpGeolocation = async (ip) => {
  // 已禁用IP地理位置查询，直接返回未知信息
  return {
    ip: ip,
    country: "未知",
    region: "未知",
    city: "未知",
    isp: "未知"
  };
};

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  withCredentials: true, // 跨域请求时发送cookies
  headers: {
    'Content-Type': 'application/json'
  }
}); 