# WEB-AI-TRAVELLER 项目完整部署指南

## 项目概述

WEB-AI-TRAVELLER 是一个 AI 辅助旅行规划应用，融合了以下功能：
- 智能行程规划（使用 LLM）
- 实时预算管理
- 语音识别（讯飞）
- 地图集成（Leaflet + OpenStreetMap）
- 用户认证（Supabase）
- 云端数据存储（Supabase）

---

## 快速开始

### 前置条件

- Node.js 16+
- npm 或 yarn
- Docker & Docker Compose (可选，用于容器化部署)
- Supabase 账号
- LLM API Key (阿里百炼或 OpenAI)

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd WEB-AI-TRAVELLER
```

### 2. 配置环境变量

#### 前端配置

在 `frontend/` 目录下创建 `.env.local`：

```bash
# .env.local
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 后端配置

在 `backend/` 目录下创建 `.env`：

```bash
# .env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key-here

# LLM (Optional - can be provided via API)
# ALIBABA_API_KEY=your-alibaba-key
# OPENAI_API_KEY=your-openai-key

# Cors
CORS_ORIGIN=http://localhost:3000

# Server
LOG_LEVEL=info
```

### 3. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 4. 配置 Supabase

#### 创建 Supabase 项目

1. 访问 https://supabase.com
2. 创建新项目，获取 URL 和 Anon Key

#### 创建数据库表

在 Supabase SQL 编辑器中执行以下 SQL：

```sql
-- Travel Plans Table
CREATE TABLE IF NOT EXISTS travel_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC NOT NULL,
  travelers INTEGER NOT NULL,
  preferences TEXT,
  itinerary JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES travel_plans(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_travel_plans_user_id ON travel_plans(user_id);
CREATE INDEX idx_expenses_plan_id ON expenses(plan_id);
CREATE INDEX idx_expenses_date ON expenses(date);

-- Enable Row Level Security (RLS)
ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for travel_plans
CREATE POLICY "Users can view their own travel plans"
  ON travel_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own travel plans"
  ON travel_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own travel plans"
  ON travel_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own travel plans"
  ON travel_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for expenses
CREATE POLICY "Users can view expenses of their own plans"
  ON expenses FOR SELECT
  USING (
    plan_id IN (
      SELECT id FROM travel_plans WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert expenses for their own plans"
  ON expenses FOR INSERT
  WITH CHECK (
    plan_id IN (
      SELECT id FROM travel_plans WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update expenses of their own plans"
  ON expenses FOR UPDATE
  USING (
    plan_id IN (
      SELECT id FROM travel_plans WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete expenses of their own plans"
  ON expenses FOR DELETE
  USING (
    plan_id IN (
      SELECT id FROM travel_plans WHERE user_id = auth.uid()
    )
  );
```

---

## 本地开发

### 启动前端服务

```bash
cd frontend
npm start
```

应用将在 http://localhost:3000 打开

### 启动后端服务

```bash
cd backend
npm run dev
```

后端服务运行在 http://localhost:5000

### 完整的本地开发环境

使用 Docker Compose 启动所有服务：

```bash
docker-compose up -d
```

停止服务：

```bash
docker-compose down
```

---

## 功能配置

### 1. LLM 服务配置

#### 使用阿里百炼（Alibaba Bailian）

1. 注册 https://www.aliyun.com/
2. 开通 DashScope 服务
3. 获取 API Key
4. 在应用 Settings 页面配置或环境变量

#### 使用 OpenAI

1. 注册 https://platform.openai.com/
2. 创建 API Key
3. 在应用 Settings 页面配置或环境变量

#### 在应用中配置

在前端 Settings 页面：
1. 选择 LLM Provider (alibaba 或 openai)
2. 输入 API Key
3. 点击保存

配置会被保存到 localStorage，自动发送到后端请求

### 2. 讯飞语音识别配置

后端已集成讯飞 WebSocket API，需要配置：

```bash
# backend/.env
XUNFEI_APP_ID=your-app-id
XUNFEI_API_KEY=your-api-key
XUNFEI_API_SECRET=your-api-secret
```

获取方式：
1. 访问 https://www.xfyun.cn/
2. 注册开发者账号
3. 创建应用获取凭证

### 3. 地图服务

应用使用 Leaflet + OpenStreetMap，无需额外配置。
支持的功能：
- 目的地地图显示
- 地点标记
- 距离计算
- 城市坐标库

---

## API 端点文档

### 旅行规划 API

#### 生成行程计划
```
POST /api/travel/plan
Request:
{
  "destination": "日本",
  "days": 5,
  "budget": 10000,
  "people": 2,
  "preferences": "美食和动漫",
  "userId": "user-id",
  "provider": "alibaba",
  "apiKey": "sk-xxx"
}

Response:
{
  "success": true,
  "data": {
    "id": "plan-id",
    "destination": "日本",
    "itinerary": [...],
    "total_estimated_cost": 10000
  }
}
```

#### 获取用户的所有行程
```
GET /api/travel/plans/:userId
Response:
{
  "success": true,
  "data": [...]
}
```

#### 获取单个行程
```
GET /api/travel/plan/:planId
Response:
{
  "success": true,
  "data": {...}
}
```

#### 更新行程
```
PUT /api/travel/plan/:planId
Request: { "preferences": "updated" }
Response:
{
  "success": true,
  "data": {...}
}
```

#### 删除行程
```
DELETE /api/travel/plan/:planId
Response:
{
  "success": true,
  "message": "Travel plan deleted successfully"
}
```

### 预算管理 API

#### 记录开支
```
POST /api/budget/expense
Request:
{
  "planId": "plan-id",
  "category": "food",
  "amount": 500,
  "description": "午餐"
}
Response:
{
  "success": true,
  "data": {...}
}
```

#### 获取预算摘要
```
GET /api/budget/summary/:planId
Response:
{
  "success": true,
  "data": {
    "totalBudget": 10000,
    "totalSpent": 1500,
    "remaining": 8500,
    "percentage": 15,
    "breakdown": {...},
    "expenses": [...]
  }
}
```

#### 获取所有开支
```
GET /api/budget/expenses/:planId
Response:
{
  "success": true,
  "data": [...]
}
```

#### 更新开支
```
PUT /api/budget/expense/:expenseId
Request: { "amount": 600 }
Response:
{
  "success": true,
  "data": {...}
}
```

#### 删除开支
```
DELETE /api/budget/expense/:expenseId
Response:
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

#### AI 预算分析
```
POST /api/budget/analyze
Request: { "planId": "plan-id", "provider": "alibaba", "apiKey": "sk-xxx" }
Response:
{
  "success": true,
  "data": {
    "analysis": "...",
    "totalBudget": 10000,
    "totalSpent": 1500
  }
}
```

### LLM API

#### 通用聊天
```
POST /api/llm/chat
Request:
{
  "prompt": "推荐一些日本的景点",
  "provider": "alibaba",
  "apiKey": "sk-xxx"
}
Response:
{
  "success": true,
  "data": {
    "text": "...",
    "usage": {...}
  }
}
```

#### 生成行程（直接调用）
```
POST /api/llm/generate-itinerary
Request:
{
  "destination": "日本",
  "days": 5,
  "budget": 10000,
  "travelers": 2,
  "preferences": "美食",
  "provider": "alibaba",
  "apiKey": "sk-xxx"
}
```

#### 预算分析（直接调用）
```
POST /api/llm/analyze-budget
Request:
{
  "expenses": [...],
  "totalBudget": 10000,
  "provider": "alibaba",
  "apiKey": "sk-xxx"
}
```

### 语音识别 API

#### 获取认证信息
```
GET /api/speech/auth
Response:
{
  "success": true,
  "data": {
    "appId": "...",
    "wsUrl": "wss://..."
  }
}
```

#### 获取 WebSocket URL
```
GET /api/speech/ws-url
Response:
{
  "success": true,
  "data": {
    "wsUrl": "wss://...",
    "appId": "..."
  }
}
```

---

## 错误处理

所有 API 端点都支持标准的错误响应格式：

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### 常见状态码
- 200: 成功
- 400: 请求格式错误或参数不正确
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 408/429/500/502/503/504: 自动重试
- 其他: 服务器错误

### 客户端重试机制

前端 API 客户端自动处理可重试的错误：
- 最多重试 3 次
- 使用指数退避策略
- 可重试的状态码: 408, 429, 500, 502, 503, 504

---

## 部署到生产环境

### Docker 部署

```bash
# 构建 Docker 镜像
docker build -f frontend/Dockerfile -t ai-travel-frontend .
docker build -f backend/Dockerfile -t ai-travel-backend .

# 运行容器
docker run -p 3000:3000 ai-travel-frontend
docker run -p 5000:5000 ai-travel-backend
```

### 使用 Docker Compose

```bash
# 启动所有服务（包括 Nginx 反向代理）
docker-compose -f docker-compose.yml up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 环境变量配置（生产）

确保以下环境变量正确设置：

**前端：**
- `REACT_APP_API_URL`: 后端 API 地址（生产 URL）
- `REACT_APP_SUPABASE_URL`: Supabase 项目 URL
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase Anon Key

**后端：**
- `PORT`: 应用端口（默认 5000）
- `NODE_ENV`: 生产环境应设置为 `production`
- `SUPABASE_URL`: Supabase URL
- `SUPABASE_KEY`: Supabase Service Role Key（应使用 Service Role 而非 Anon Key）
- `CORS_ORIGIN`: 允许的前端域名
- `LOG_LEVEL`: 日志级别（production 建议 `warn` 或 `error`）

### 使用 Nginx 反向代理

```nginx
upstream frontend {
  server localhost:3000;
}

upstream backend {
  server localhost:5000;
}

server {
  listen 80;
  server_name yourdomain.com;

  # 前端
  location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # 后端 API
  location /api {
    proxy_pass http://backend/api;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## 测试

### 前端测试

```bash
cd frontend
npm test
npm run build
```

### 后端测试

```bash
cd backend
npm test
npm run build
```

### 端到端测试

使用 Postman 或 cURL 测试 API 端点：

```bash
# 生成行程计划
curl -X POST http://localhost:5000/api/travel/plan \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "日本",
    "days": 5,
    "budget": 10000,
    "people": 2,
    "preferences": "美食",
    "userId": "test-user-id",
    "provider": "alibaba",
    "apiKey": "your-api-key"
  }'

# 获取行程
curl -X GET http://localhost:5000/api/travel/plans/test-user-id
```

---

## 故障排除

### 连接问题

**问题**: 前端无法连接到后端
**解决**:
1. 检查后端是否运行: `curl http://localhost:5000/health`
2. 检查 `REACT_APP_API_URL` 是否正确
3. 检查 CORS 配置

### Supabase 连接错误

**问题**: "Missing Supabase credentials"
**解决**:
1. 检查 `.env` 文件中的 `SUPABASE_URL` 和 `SUPABASE_KEY`
2. 确保 Key 是有效的
3. 检查网络连接

### LLM API 错误

**问题**: "LLM Error: 401 Unauthorized"
**解决**:
1. 检查 API Key 是否正确
2. 检查 API Key 是否有效期内
3. 检查网络连接

### 语音识别不工作

**问题**: 语音识别功能无法使用
**解决**:
1. 检查讯飞配置是否正确
2. 检查浏览器是否允许麦克风权限
3. 检查 WebSocket 连接是否建立

---

## 生产检查清单

- [ ] 所有环境变量已配置
- [ ] Supabase 数据库表已创建
- [ ] RLS 策略已正确配置
- [ ] LLM API Key 已配置
- [ ] 讯飞 API 凭证已配置
- [ ] CORS 设置正确
- [ ] 日志级别适合生产环境
- [ ] 错误处理和日志记录完整
- [ ] 前端已构建优化版本
- [ ] 后端已测试完整功能
- [ ] HTTPS 已配置（生产环境）
- [ ] 备份和恢复计划已制定

---

## 监控和维护

### 日志管理

```bash
# 查看后端日志
docker logs -f ai-travel-backend

# 查看前端日志
docker logs -f ai-travel-frontend
```

### 性能监控

- 监控 API 响应时间
- 监控数据库查询性能
- 监控错误率和异常

### 定期维护

- 更新依赖包: `npm update`
- 备份 Supabase 数据
- 清理日志文件
- 监控磁盘空间使用

---

## 支持和反馈

如有问题，请：
1. 检查这份文档
2. 查看应用日志
3. 访问项目 GitHub Issues: https://github.com/anthropics/claude-code/issues

---

**最后更新**: 2024 年 11 月 12 日
**版本**: 1.0.0
