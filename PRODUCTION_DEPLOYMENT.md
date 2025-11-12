# 🚀 生产环境部署指南

## 📋 本步骤目标

将应用部署到生产环境，使用 Docker、Nginx 反向代理、SSL/HTTPS 和完整的监控系统。

---

## 第 1 部分: 前期准备

### ✅ 生产环境检查清单

- [ ] 应用已完整测试（所有功能正常）
- [ ] 所有 API Key 已配置
- [ ] 数据库备份计划已制定
- [ ] 域名已申请
- [ ] SSL 证书已获取
- [ ] 服务器已准备

---

## 第 2 部分: 使用 Docker 部署

### 创建生产 Dockerfile

**前端**: `frontend/Dockerfile.prod`

```dockerfile
# 构建阶段
FROM node:16-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY frontend/package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY frontend/ .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制 Nginx 配置
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/build /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**后端**: `backend/Dockerfile.prod`

```dockerfile
FROM node:16-alpine

WORKDIR /app

# 复制依赖文件
COPY backend/package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 复制源代码
COPY backend/src ./src
COPY backend/tsconfig.json .

# 构建 TypeScript
RUN npm run build

# 暴露端口
EXPOSE 5000

# 启动应用
CMD ["node", "dist/index.js"]
```

### 生产 Docker Compose 配置

**文件**: `docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile.prod
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=https://api.yourdomain.com/api
      - REACT_APP_SUPABASE_URL=${SUPABASE_URL}
      - REACT_APP_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    restart: unless-stopped
    networks:
      - app-network

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile.prod
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - CORS_ORIGIN=https://yourdomain.com
      - LOG_LEVEL=warn
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 启动生产环境

```bash
# 1. 设置环境变量
export SUPABASE_URL=https://iwtqkpxiyawxlufduxrw.supabase.co
export SUPABASE_ANON_KEY=your-anon-key
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 2. 构建 Docker 镜像
docker-compose -f docker-compose.prod.yml build

# 3. 启动容器
docker-compose -f docker-compose.prod.yml up -d

# 4. 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 5. 停止容器
docker-compose -f docker-compose.prod.yml down
```

---

## 第 3 部分: Nginx 反向代理配置

### Nginx 生产配置

**文件**: `nginx/nginx.prod.conf`

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss
               application/rss+xml font/truetype font/opentype
               application/vnd.ms-fontobject image/svg+xml;

    # 速率限制
    limit_req_zone $binary_remote_addr zone=general:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=1000r/m;

    # HTTP 到 HTTPS 重定向
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS 服务器
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL 证书
        ssl_certificate /etc/nginx/ssl/yourdomain.com.crt;
        ssl_certificate_key /etc/nginx/ssl/yourdomain.com.key;

        # SSL 安全配置
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # 安全头
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # 前端应用
        location / {
            proxy_pass http://frontend:80;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            limit_req zone=general burst=10 nodelay;
        }

        # 后端 API
        location /api/ {
            proxy_pass http://backend:5000/api/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_buffering off;
            proxy_request_buffering off;
            proxy_redirect off;

            # API 速率限制
            limit_req zone=api burst=100 nodelay;

            # 超时设置
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # 健康检查
        location /health {
            proxy_pass http://backend:5000/health;
            access_log off;
        }

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://frontend:80;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## 第 4 部分: SSL/HTTPS 配置

### 使用 Let's Encrypt 获取免费 SSL 证书

```bash
# 1. 安装 Certbot
apt-get update
apt-get install certbot python3-certbot-nginx

# 2. 获取证书
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# 3. 证书位置
# /etc/letsencrypt/live/yourdomain.com/

# 4. 自动续期（Cron 任务）
# 在 crontab 中添加:
0 3 * * * certbot renew --quiet

# 5. 复制证书到项目
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/yourdomain.com.crt
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/yourdomain.com.key
```

---

## 第 5 部分: 环境变量和安全

### 生产环境变量

**文件**: `.env.production`

```env
# Supabase (生产环境应使用单独的项目)
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_KEY=your-prod-service-role-key

# 前端
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_SUPABASE_URL=https://your-prod-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-prod-anon-key

# 服务器
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com

# 日志
LOG_LEVEL=warn
```

### 密钥管理最佳实践

```bash
# 1. 使用密钥管理服务
# - AWS Secrets Manager
# - HashiCorp Vault
# - Azure Key Vault

# 2. Docker 环境变量
docker run -e SUPABASE_KEY=${SUPABASE_KEY} myapp

# 3. 不要在 Docker 镜像中硬编码密钥
# 错误:
RUN export SECRET_KEY=xxx
# 正确:
# 使用 Docker Compose 或 Kubernetes secrets

# 4. 限制访问权限
chmod 600 nginx/ssl/*.key
chown root:root nginx/ssl/*

# 5. 定期轮换密钥
# - 每 90 天轮换一次
# - 立即轮换如有泄露
```

---

## 第 6 部分: 监控和日志

### Docker 日志

```bash
# 查看容器日志
docker-compose -f docker-compose.prod.yml logs -f backend

# 查看特定时间的日志
docker-compose -f docker-compose.prod.yml logs --since 1h backend

# 导出日志
docker-compose -f docker-compose.prod.yml logs > logs.txt
```

### 应用性能监控

```typescript
// backend/src/middleware/monitoring.ts

import { Request, Response, NextFunction } from 'express';

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    console.log(`
      [${new Date().toISOString()}] ${req.method} ${req.path}
      Status: ${res.statusCode}
      Duration: ${duration}ms
      IP: ${req.ip}
    `);

    // 发送到监控服务
    if (duration > 1000) {
      console.warn(`⚠️ Slow request: ${req.method} ${req.path} (${duration}ms)`);
    }
  });

  next();
};

// 在 index.ts 中使用
app.use(monitoringMiddleware);
```

### 错误跟踪

```bash
# 使用 Sentry 进行错误跟踪
# 1. 注册 Sentry 账号: https://sentry.io

# 2. 在应用中集成
npm install @sentry/node

# 3. 配置
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## 第 7 部分: 备份和恢复

### Supabase 备份

```bash
# 1. 自动备份（Supabase 默认每日）
# Settings > Backups

# 2. 手动导出数据
# Settings > Database > Export data

# 3. 本地备份脚本
#!/bin/bash
BACKUP_DIR="/backups/supabase"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump \
  --host=db.iwtqkpxiyawxlufduxrw.supabase.co \
  --username=postgres \
  --password \
  --dbname=postgres \
  > "${BACKUP_DIR}/backup_${DATE}.sql"

# 4. 恢复备份
psql -h localhost -U postgres -d myapp < backup_20240101_120000.sql
```

### 定期检查清单

- [ ] 每周检查数据库备份
- [ ] 每月验证备份可恢复
- [ ] 每月检查 SSL 证书有效期
- [ ] 每周查看应用日志
- [ ] 每天监控应用性能

---

## 第 8 部分: 生产环境检查清单

### 部署前

- [ ] 代码已提交到 Git
- [ ] 所有测试已通过
- [ ] 环境变量已配置
- [ ] SSL 证书已获取
- [ ] 数据库已备份
- [ ] CDN 已配置（可选）

### 部署时

- [ ] 构建 Docker 镜像
- [ ] 启动容器
- [ ] 检查所有容器运行状态
- [ ] 查看日志确认无错误
- [ ] 测试所有功能

### 部署后

- [ ] 监控应用性能
- [ ] 检查错误日志
- [ ] 验证备份正常工作
- [ ] 设置监控告警
- [ ] 文档更新

---

## 命令速查表

```bash
# 构建和启动
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# 查看状态
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f

# 重启服务
docker-compose -f docker-compose.prod.yml restart backend
docker-compose -f docker-compose.prod.yml restart frontend

# 更新镜像
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --force-recreate

# 清理资源
docker-compose -f docker-compose.prod.yml down
docker image prune -a
docker volume prune
```

---

## 💡 关键提示

```
🔐 安全第一
- 不要在代码中硬编码密钥
- 使用强密码和 HTTPS
- 定期更新依赖
- 监控异常活动

⚡ 性能优化
- 启用 Gzip 压缩
- 使用 CDN 分发静态资源
- 实现缓存策略
- 监控应用性能

🛡️ 可靠性
- 设置自动备份
- 配置健康检查
- 使用监控和告警
- 定期测试恢复过程

📊 可观测性
- 记录详细日志
- 使用性能监控
- 跟踪关键指标
- 设置告警规则
```

---

## 故障恢复

### 应用崩溃

```bash
# 1. 查看日志
docker-compose -f docker-compose.prod.yml logs backend

# 2. 重启应用
docker-compose -f docker-compose.prod.yml restart backend

# 3. 如果仍然失败，回滚到上一个版本
git revert HEAD
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### 数据库连接失败

```bash
# 1. 检查 Supabase 状态
# https://status.supabase.com/

# 2. 验证凭证
echo $SUPABASE_URL
echo $SUPABASE_KEY

# 3. 测试连接
curl -X GET "https://iwtqkpxiyawxlufduxrw.supabase.co/rest/v1/" \
  -H "apikey: $SUPABASE_ANON_KEY"

# 4. 如果需要，恢复数据库备份
```

---

**版本**: 1.0.0
**更新时间**: 2024-11-12
**推荐部署平台**:
- 虚拟主机: AWS EC2, DigitalOcean, Linode
- 容器: AWS ECS, Google Cloud Run
- Kubernetes: AWS EKS, Google GKE, Azure AKS

