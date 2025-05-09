-- 访问记录表
CREATE TABLE IF NOT EXISTS visitor_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  path VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  user_agent TEXT,
  status_code INT NOT NULL,
  request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  process_time FLOAT DEFAULT 0,
  referrer VARCHAR(255),
  INDEX idx_ip (ip_address),
  INDEX idx_path (path),
  INDEX idx_request_time (request_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- IP地理位置缓存表
CREATE TABLE IF NOT EXISTS ip_geolocation (
  ip VARCHAR(45) PRIMARY KEY,
  country VARCHAR(50),
  region VARCHAR(50),
  city VARCHAR(50),
  isp VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 