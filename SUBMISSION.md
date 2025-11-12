# AI Travel Planner - 作业提交说明

## 📝 项目信息

**项目名称**: AI Travel Planner - 智能旅行规划师
**项目类型**: Web应用 (React + Express.js + TypeScript)
**技术栈**: React 18, Express.js, TypeScript, Tailwind CSS, Supabase
**提交日期**: 2025年11月12日

---

## 🔗 GitHub仓库

**GitHub链接**: https://github.com/liangyuRen/WEB-AI-TRAVELLER

### 克隆和运行项目

```bash
# 克隆仓库
git clone https://github.com/liangyuRen/WEB-AI-TRAVELLER.git
cd WEB-AI-TRAVELLER

# 本地开发运行
## 后端
cd backend
npm install
npm run dev

## 前端（新终端）
cd frontend
npm install
npm start

# 或使用Docker Compose快速启动
docker-compose up --build
```

---

## 🐳 Docker镜像

### 构建Docker镜像

项目已配置完整的Docker支持，包括两个Dockerfile：

```bash
# 构建后端镜像
docker build -f Dockerfile.backend -t ai-travel-planner-backend:latest .

# 构建前端镜像
docker build -f Dockerfile.frontend -t ai-travel-planner-frontend:latest .
```

### 使用Docker Compose运行

```bash
docker-compose up --build
```

应用将在以下地址可用：
- **前端**: http://localhost:3000
- **后端API**: http://localhost:5000

---

## 🔑 API密钥配置

### 使用阿里云百炼API（推荐）

项目已配置支持阿里云百炼API。如果使用助教提供的API密钥：

1. 在应用启动后，进入 `Settings` 页面
2. 选择 `Alibaba Bailian` 作为LLM提供商
3. 输入提供的API密钥
4. 密钥保存在本地浏览器存储中

### 环境变量配置

如需在后端配置API密钥，编辑 `backend/.env` 文件：

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# 如果在后端配置（可选）
# LLM_API_KEY=your_alibaba_api_key
# LLM_PROVIDER=alibaba
```

---

## 📚 README文档

完整的README文档请参考GitHub仓库中的 `README.md` 文件：
https://github.com/liangyuRen/WEB-AI-TRAVELLER/blob/main/README.md

文档包含以下内容：
- 🌟 核心功能说明
- 🛠️ 技术栈详情
- 📦 项目结构
- 🚀 快速开始指南
- ⚙️ 环境配置
- 🔐 API密钥管理
- 🎯 核心API端点
- 🐳 Docker部署指南
- 🤖 LLM集成说明
- 📊 数据库架构
- 📚 GitHub Actions CI/CD

---

## ✨ 主要功能

### 1. 智能行程规划
- AI驱动的行程自动生成
- 支持自定义旅行偏好
- 实时预算估算

### 2. 费用预算管理
- 支出记录和分类统计
- AI驱动的预算分析
- 费用超额预警

### 3. 用户管理
- 用户注册和登录
- 旅行计划保存和管理
- 多设备数据同步（通过Supabase）

### 4. 交互特性
- 现代化的UI设计（Golden Luxury Theme）
- 响应式布局
- 实时数据更新

---

## 🧪 测试和验证

### 健康检查
```bash
curl http://localhost:5000/health
```

应返回：
```json
{
  "status": "ok",
  "message": "AI Travel Planner Backend is running"
}
```

### 数据库状态
```bash
curl http://localhost:5000/api/db-status
```

---

## 📁 项目结构

```
WEB-AI-TRAVELLER/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   ├── components/      # 可复用组件
│   │   ├── services/        # API服务
│   │   ├── store/           # Zustand状态管理
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
├── backend/                  # Express后端API
│   ├── src/
│   │   ├── routes/          # API路由
│   │   ├── services/        # 业务逻辑
│   │   └── index.ts
│   ├── package.json
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── docker-build.yml  # GitHub Actions
├── docker-compose.yml
└── README.md
```

---

## 🚀 部署到云服务

### 推送到Docker Hub
```bash
docker build -f Dockerfile.backend -t yourusername/ai-travel-backend:latest .
docker build -f Dockerfile.frontend -t yourusername/ai-travel-frontend:latest .

docker push yourusername/ai-travel-backend:latest
docker push yourusername/ai-travel-frontend:latest
```

### 推送到阿里云镜像仓库
```bash
docker login -u <username> registry.aliyuncs.com

docker tag ai-travel-backend:latest registry.aliyuncs.com/<namespace>/ai-travel-backend:latest
docker tag ai-travel-frontend:latest registry.aliyuncs.com/<namespace>/ai-travel-frontend:latest

docker push registry.aliyuncs.com/<namespace>/ai-travel-backend:latest
docker push registry.aliyuncs.com/<namespace>/ai-travel-frontend:latest
```

---

## ✅ 提交检查清单

- ✅ GitHub仓库已创建并配置
- ✅ 项目代码已上传到GitHub
- ✅ Dockerfile已创建（前端和后端）
- ✅ Docker Compose配置完整
- ✅ GitHub Actions CI/CD工作流已配置
- ✅ README文档详细完整
- ✅ 环境变量配置说明已提供
- ✅ 快速开始指南已编写
- ✅ 提交记录详细清晰

---

**最后更新**: 2025年11月12日
**项目状态**: 🚀 生产就绪
