import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import visitorLogger from './middlewares/visitor-logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 访问日志记录中间件
app.use(visitorLogger);

// 路由
app.use(routes);

// 数据库连接
MYSQL_URI.connect(process.env.MYSQL_URI)
  .then(() => console.log('Mysql connected'))
  .catch(err => console.error(err));

// 测试路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});