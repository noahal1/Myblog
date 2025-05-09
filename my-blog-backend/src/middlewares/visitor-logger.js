const { pool } = require('../db');

/**
 * 访问日志记录中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const visitorLogger = (req, res, next) => {
  // 记录请求开始时间
  const startTime = process.hrtime();
  
  // 获取原始IP地址 (考虑代理后的真实IP)
  const ip = (req.headers['x-forwarded-for'] || '').split(',').shift() || 
             req.socket.remoteAddress;
  
  // 保存原始的end方法
  const originalEnd = res.end;
  
  // 重写end方法以捕获响应结束时间和状态码
  res.end = function(chunk, encoding) {
    // 恢复原始end方法
    res.end = originalEnd;
    
    // 调用原始方法完成响应
    res.end(chunk, encoding);
    
    // 计算处理时间（毫秒）
    const hrTime = process.hrtime(startTime);
    const processingTime = hrTime[0] * 1000 + hrTime[1] / 1000000;
    
    // 排除静态资源和特定路径
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i) ||
        req.path.includes('/api/admin/visitor-logs') ||
        req.path.includes('/api/admin/visitor-stats')) {
      return;
    }
    
    // 记录访问日志到数据库
    const logEntry = {
      ip_address: ip,
      path: req.path,
      method: req.method,
      user_agent: req.headers['user-agent'] || '',
      status_code: res.statusCode,
      process_time: processingTime,
      referrer: req.headers['referer'] || ''
    };
    
    pool.query(
      `INSERT INTO visitor_logs 
       (ip_address, path, method, user_agent, status_code, process_time, referrer) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        logEntry.ip_address,
        logEntry.path,
        logEntry.method,
        logEntry.user_agent,
        logEntry.status_code,
        logEntry.process_time,
        logEntry.referrer
      ]
    ).catch(err => {
      console.error('记录访问日志失败:', err);
    });
  };
  
  next();
};

module.exports = visitorLogger; 