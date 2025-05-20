# Noah的博客后端API

这是Noah博客的后端API服务，使用FastAPI和SQLAlchemy开发。

## 功能特点

- 文章发布和管理
- 用户认证和授权
- 评论系统
- 标签管理
- 访问者IP记录和统计

## 访问记录功能

系统现在会自动记录所有访问者的IP地址和相关信息，包括：

- IP地址
- 用户代理（浏览器/设备信息）
- 访问路径
- 请求方法（GET、POST等）
- 响应状态码
- 处理时间
- 引荐来源(Referer)
- 用户ID（如果已登录）

## 管理API

管理员可以通过以下API查看访问记录和统计信息：

- `/api/admin/visitor-logs` - 获取访问记录列表（支持分页和筛选）
- `/api/admin/visitor-stats` - 获取访问统计数据（独立IP数、访问量等）

## 数据库迁移

添加访问记录功能后，需要执行数据库迁移：

```bash
# 在项目根目录执行
python -m alembic upgrade head
```

## 环境变量

项目使用.env文件配置环境变量，包括：

- DB_USER - 数据库用户名
- DB_PASSWORD - 数据库密码
- DB_HOST - 数据库主机地址
- DB_PORT - 数据库端口
- DB_NAME - 数据库名称
- ADMIN_USERNAME - 管理员用户名
