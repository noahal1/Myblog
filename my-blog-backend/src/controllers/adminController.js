const { pool } = require('../db');
const axios = require('axios');

/**
 * 获取访问记录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getVisitorLogs = async (req, res) => {
  try {
    const { limit = 10, offset = 0, ip_address, path, status_code } = req.query;
    
    let query = 'SELECT * FROM visitor_logs WHERE 1=1';
    const params = [];
    
    // 添加筛选条件
    if (ip_address) {
      query += ' AND ip_address LIKE ?';
      params.push(`%${ip_address}%`);
    }
    
    if (path) {
      query += ' AND path LIKE ?';
      params.push(`%${path}%`);
    }
    
    if (status_code) {
      query += ' AND status_code = ?';
      params.push(parseInt(status_code));
    }
    
    // 获取总记录数
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0]?.total || 0;
    
    // 排序和分页
    query += ' ORDER BY request_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [logs] = await pool.query(query, params);
    
    res.json({ logs, total });
  } catch (error) {
    console.error('获取访问记录失败:', error);
    res.status(500).json({ message: '获取访问记录失败' });
  }
};

/**
 * 获取访问统计数据
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getVisitorStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysNum = parseInt(days);
    
    // 访问总数
    const [totalVisits] = await pool.query(
      'SELECT COUNT(*) as count FROM visitor_logs WHERE request_time >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [daysNum]
    );
    
    // 独立IP数
    const [uniqueIps] = await pool.query(
      'SELECT COUNT(DISTINCT ip_address) as count FROM visitor_logs WHERE request_time >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [daysNum]
    );
    
    // 平均响应时间
    const [avgTime] = await pool.query(
      'SELECT AVG(process_time) as avg_time FROM visitor_logs WHERE request_time >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [daysNum]
    );
    
    // 路径统计
    const [pathStats] = await pool.query(
      'SELECT path, COUNT(*) as count FROM visitor_logs WHERE request_time >= DATE_SUB(NOW(), INTERVAL ? DAY) GROUP BY path ORDER BY count DESC LIMIT 10',
      [daysNum]
    );
    
    // IP地址统计
    const [ipStats] = await pool.query(
      'SELECT ip_address, COUNT(*) as count FROM visitor_logs WHERE request_time >= DATE_SUB(NOW(), INTERVAL ? DAY) GROUP BY ip_address ORDER BY count DESC LIMIT 10',
      [daysNum]
    );
    
    // 格式化数据
    const pathStatsMap = {};
    pathStats.forEach(item => {
      pathStatsMap[item.path] = item.count;
    });
    
    const ipStatsMap = {};
    ipStats.forEach(item => {
      ipStatsMap[item.ip_address] = item.count;
    });
    
    res.json({
      total_visits: totalVisits[0]?.count || 0,
      unique_ips: uniqueIps[0]?.count || 0,
      average_response_time: avgTime[0]?.avg_time || 0,
      path_stats: pathStatsMap,
      ip_stats: ipStatsMap
    });
  } catch (error) {
    console.error('获取访问统计失败:', error);
    res.status(500).json({ message: '获取访问统计失败' });
  }
};

/**
 * 获取IP地理位置信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.getIpGeolocation = async (req, res) => {
  try {
    const { ip } = req.query;
    
    if (!ip) {
      return res.status(400).json({ message: 'IP地址不能为空' });
    }
    
    // 先查询缓存
    const [cached] = await pool.query(
      'SELECT * FROM ip_geolocation WHERE ip = ? AND updated_at > DATE_SUB(NOW(), INTERVAL 1 WEEK)',
      [ip]
    );
    
    if (cached && cached.length > 0) {
      return res.json({
        ip,
        country: cached[0].country,
        region: cached[0].region,
        city: cached[0].city,
        isp: cached[0].isp,
        cached: true
      });
    }
    
    // 调用第三方API获取地理位置
    // 这里使用的是IP-API的免费接口，生产环境建议更换为付费API
    const response = await axios.get(`http://ip-api.com/json/${ip}?lang=zh-CN`);
    
    if (response.data && response.data.status === 'success') {
      const { country, regionName, city, isp } = response.data;
      
      // 缓存结果
      await pool.query(
        `INSERT INTO ip_geolocation (ip, country, region, city, isp, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW()) 
         ON DUPLICATE KEY UPDATE 
         country = VALUES(country), 
         region = VALUES(region), 
         city = VALUES(city), 
         isp = VALUES(isp), 
         updated_at = NOW()`,
        [ip, country, regionName, city, isp]
      );
      
      return res.json({
        ip,
        country,
        region: regionName,
        city,
        isp,
        cached: false
      });
    }
    
    res.status(400).json({ message: '无法获取IP地理位置' });
  } catch (error) {
    console.error('获取IP地理位置失败:', error);
    res.status(500).json({ message: '获取IP地理位置失败' });
  }
}; 