# AI Travel Planner - 智能旅行规划师

![GitHub License](https://img.shields.io/github/license/yourusername/ai-travel-planner)
![GitHub Stars](https://img.shields.io/github/stars/yourusername/ai-travel-planner)

一个Web版的AI辅助旅行规划应用，通过人工智能帮助用户简化旅行规划过程。用户可以通过语音或文字输入旅行需求，AI会自动生成个性化的行程计划、费用预算和旅行建议。

## 🌟 核心功能

### 1. 智能行程规划
- 通过语音（或文字）输入旅行目的地、日期、预算、同行人数和旅行偏好
- AI自动生成个性化旅行路线
- 包括交通、住宿、景点、餐厅等详细信息
- 支持行程修改和自定义

### 2. 费用预算与管理
- AI进行预算分析和优化建议
- 记录旅行开销（支持语音输入）
- 实时预算跟踪和分类统计
- 费用超额预警

### 3. 用户管理与数据存储
- 注册登录系统
- 保存和管理多份旅行计划
- 云端行程同步
- 多设备无缝访问

### 4. 语音功能
- 语音识别输入（Web Speech API）
- 语音命令控制
- 费用语音记录

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **HTTP客户端**: Axios
- **路由**: React Router v6

### 后端
- **运行时**: Node.js
- **框架**: Express.js
- **数据库**: Supabase (PostgreSQL)
- **认证**: Firebase 或 Supabase Auth
- **LLM集成**: 支持多种提供商
  - 阿里云百炼（推荐）
  - OpenAI GPT
  - Hugging Face
  - 本地LLM

### 部署
- **容器化**: Docker
- **编排**: Docker Compose
- **CI/CD**: GitHub Actions
- **镜像仓库**: Docker Hub / 阿里云镜像仓库

## 📦 项目结构

```
ai-travel-planner/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   ├── components/      # 可复用组件
│   │   ├── store/           # 状态管理
│   │   ├── services/        # API服务
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # Express后端API
│   ├── src/
│   │   ├── routes/          # API路由
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml        # Docker Compose配置
├── Dockerfile.frontend       # 前端Docker镜像
├── Dockerfile.backend        # 后端Docker镜像
├── nginx.conf               # Nginx反向代理配置
└── README.md

```

## 🚀 快速开始

### 前置要求
- Node.js 18.x 或更高版本
- Docker 和 Docker Compose
- Git

### 本地开发

#### 1. 克隆仓库
```bash
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner
```

#### 2. 后端设置
```bash
cd backend
npm install
cp .env.example .env
# 编辑 .env 文件，填入你的API密钥
npm run dev
```

#### 3. 前端设置（新终端）
```bash
cd frontend
npm install
npm start
```

访问 http://localhost:3000

### 使用Docker Compose快速启动

```bash
docker-compose up --build
```

应用将在以下地址可用：
- 前端: http://localhost:3000
- 后端API: http://localhost:5000

## ⚙️ 环境配置

### 后端环境变量 (backend/.env)

```env
# 服务器配置
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Supabase数据库 (可选)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...

# LLM API (在前端Settings页面配置，或这里设置)
# LLM_API_KEY=你的API密钥
# LLM_PROVIDER=openai|alibaba|huggingface
```

### 前端环境变量 (frontend/.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔐 API密钥配置

### ⚠️ 重要安全提示

**切勿在代码中硬编码API密钥！** 这是一个严重的安全风险。

本项目提供了两种安全的密钥管理方式：

#### 方式1: 通过Settings界面配置（推荐）
1. 登录应用后进入 `Settings` 页面
2. 选择你要使用的LLM提供商
3. 输入API密钥
4. 密钥会保存在本地浏览器存储中
5. 密钥不会被发送到服务器

#### 方式2: 环境变量配置（开发环境）
1. 创建 `.env` 文件
2. 填入密钥信息
3. 后端启动时读取环境变量
4. **生产环境应使用更安全的密钥管理方案**

### 获取API密钥

#### 阿里云百炼（推荐 - 助教提供）
- 联系课程助教获取阿里云百炼API密钥
- 提供3个月有效期的免费额度

#### OpenAI
- 访问 https://platform.openai.com/api-keys
- 创建新的API密钥
- 注意成本和速率限制

#### Supabase
- 访问 https://supabase.com
- 创建新项目
- 从项目设置中获取API URL和密钥

## 🎯 核心API端点

### 旅行规划
- `POST /api/travel/plan` - 生成旅行计划
- `GET /api/travel/plans/:userId` - 获取保存的计划
- `PUT /api/travel/plan/:planId` - 更新计划

### 预算管理
- `POST /api/budget/expense` - 记录开支
- `GET /api/budget/summary/:planId` - 获取预算摘要
- `DELETE /api/budget/expense/:expenseId` - 删除开支

### LLM服务
- `POST /api/llm/chat` - 通用聊天接口
- `POST /api/llm/generate-itinerary` - 生成行程
- `POST /api/llm/analyze-budget` - 预算分析

## 📱 特色功能

### 语音识别
- 使用Web Speech API（浏览器原生）
- 支持英文和中文
- 实时语音转文字

### 智能预算分析
- AI驱动的支出优化建议
- 按分类统计支出
- 成本预警

### 多设备同步
- 云端数据存储
- 实时同步
- 离线模式支持（计划中）

## 🐳 Docker部署

### 构建镜像

```bash
# 构建后端镜像
docker build -f Dockerfile.backend -t ai-travel-backend:latest .

# 构建前端镜像
docker build -f Dockerfile.frontend -t ai-travel-frontend:latest .
```

### 运行容器

```bash
# 使用Docker Compose
docker-compose up -d

# 或手动运行
docker run -p 5000:5000 --env-file .env ai-travel-backend:latest
docker run -p 3000:80 ai-travel-frontend:latest
```

### 推送到阿里云镜像仓库

```bash
# 登录阿里云
docker login -u <username> registry.aliyuncs.com

# 标记镜像
docker tag ai-travel-backend:latest registry.aliyuncs.com/<namespace>/ai-travel-backend:latest
docker tag ai-travel-frontend:latest registry.aliyuncs.com/<namespace>/ai-travel-frontend:latest

# 推送镜像
docker push registry.aliyuncs.com/<namespace>/ai-travel-backend:latest
docker push registry.aliyuncs.com/<namespace>/ai-travel-frontend:latest
```

## 🤖 LLM集成

### 支持的提供商

#### 1. 阿里云百炼（推荐）
```javascript
// 在Settings页面选择Alibaba Bailian
// 输入API密钥
// 应用会自动使用通义千问模型
```

#### 2. OpenAI
```javascript
// 选择OpenAI
// 输入sk-xxx格式的密钥
// 支持GPT-3.5 Turbo和GPT-4
```

#### 3. 本地LLM
```javascript
// 可集成Ollama或其他本地LLM服务
// 修改后端配置指向本地服务
```

## 📊 数据库架构

### Supabase表结构

```sql
-- 用户表（由Supabase Auth管理）
-- 旅行计划表
CREATE TABLE travel_plans (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  destination VARCHAR(255),
  start_date DATE,
  end_date DATE,
  budget DECIMAL,
  travelers INT,
  preferences TEXT,
  itinerary JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 开支记录表
CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  plan_id UUID REFERENCES travel_plans,
  category VARCHAR(50),
  amount DECIMAL,
  description TEXT,
  date DATE,
  created_at TIMESTAMP
);
```

## 🧪 测试

```bash
# 前端测试
cd frontend
npm test

# 后端测试
cd backend
npm test
```

## 📚 GitHub Actions CI/CD

项目已配置GitHub Actions自动化流程：

1. **代码检查** - 运行lint检查
2. **构建镜像** - 构建Docker镜像
3. **推送镜像** - 推送到Docker Hub或阿里云

### 配置Secrets

在GitHub仓库Settings中添加以下Secrets：

```
DOCKER_USERNAME: your_docker_username
DOCKER_PASSWORD: your_docker_password
ALIYUN_REGISTRY: registry.aliyuncs.com
ALIYUN_USERNAME: your_aliyun_username
ALIYUN_PASSWORD: your_aliyun_password
```

## 📝 提交说明

提交包含以下内容：

1. **GitHub仓库**: 这个README中的仓库链接
2. **Docker镜像**: 已推送到Docker Hub或阿里云
3. **运行说明**: 在README中详细说明如何运行项目
4. **API密钥**: 如使用非阿里云key，在README中提供密钥和有效期

## 🛣️ 开发路线图

- [ ] 用户认证系统（Supabase集成）
- [ ] 云端数据持久化
- [ ] 高德地图集成
- [ ] 实时天气API集成
- [ ] 机票和酒店预订API集成
- [ ] 离线模式
- [ ] PWA支持
- [ ] 多语言支持
- [ ] 社交分享功能
- [ ] AI图像生成（景点推荐）

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License - 详见LICENSE文件

## 👨‍💼 作者

课程作业 - 南京大学大模型辅助软件工程

## 📞 支持

如遇到问题，请：
1. 检查环境配置
2. 查看错误日志
3. 提交GitHub Issue

---

**最后更新**: 2024年11月
**项目状态**: 开发中 🚀
