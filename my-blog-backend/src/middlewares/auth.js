const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { JWT_SECRET } = require('../config');

// 验证JWT令牌
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未授权，请先登录' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: '令牌无效或已过期' });
  }
};

// 验证是否为管理员
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '未授权，请先登录' });
  }
  
  // 简单验证：用户ID为1的为管理员
  if (req.user.id !== 1) {
    return res.status(403).json({ message: '权限不足，需要管理员权限' });
  }
  
  next();
};

module.exports = {
  verifyToken,
  isAdmin
}; 