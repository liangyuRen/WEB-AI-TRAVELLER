# AI Travel Planner 课程作业提交

## 📍 GitHub 仓库

**仓库地址**: https://github.com/liangyuRen/WEB-AI-TRAVELLER

---

## 📋 项目介绍

AI Travel Planner 是一个基于 Web 的智能旅行规划应用，通过 AI 帮助用户快速生成个性化的旅行计划。

### 核心功能
- **智能行程规划**：AI自动生成个性化行程
- **费用预算管理**：记录开支，AI优化建议
- **用户认证系统**：完整的用户管理
- **现代化设计**：Golden Luxury 主题UI

---

## 🚀 项目运行方法（重要）

### 快速启动（推荐）

```bash
# 克隆仓库
git clone https://github.com/liangyuRen/WEB-AI-TRAVELLER.git
cd WEB-AI-TRAVELLER

# 使用 Docker Compose 启动
docker-compose up --build

# 应用地址
# 前端: http://localhost:3000
# 后端: http://localhost:5000
```

### 使用预编译 Docker 镜像

项目支持下载预编译的Docker镜像，在GitHub Release页面可获取：

**x86_64 架构**:
```bash
# 下载镜像
wget https://github.com/liangyuRen/WEB-AI-TRAVELLER/releases/download/v1.0.0/ai-travel-backend_v1.0.0_amd64.tar.gz
wget https://github.com/liangyuRen/WEB-AI-TRAVELLER/releases/download/v1.0.0/ai-travel-frontend_v1.0.0_amd64.tar.gz

# 加载镜像
docker load -i ai-travel-backend_v1.0.0_amd64.tar.gz
docker load -i ai-travel-frontend_v1.0.0_amd64.tar.gz

# 运行
docker run -d --name ai-travel-backend -p 5000:5000 ai-travel-backend:v1.0.0-amd64
docker run -d --name ai-travel-frontend -p 3000:80 ai-travel-frontend:v1.0.0-amd64
```

**ARM64 架构** (Mac M系列、树莓派等):
```bash
# 下载镜像
wget https://github.com/liangyuRen/WEB-AI-TRAVELLER/releases/download/v1.0.0/ai-travel-backend_v1.0.0_arm64.tar.gz
wget https://github.com/liangyuRen/WEB-AI-TRAVELLER/releases/download/v1.0.0/ai-travel-frontend_v1.0.0_arm64.tar.gz

# 加载镜像
docker load -i ai-travel-backend_v1.0.0_arm64.tar.gz
docker load -i ai-travel-frontend_v1.0.0_arm64.tar.gz

# 运行
docker run -d --name ai-travel-backend -p 5000:5000 ai-travel-backend:v1.0.0-arm64
docker run -d --name ai-travel-frontend -p 3000:80 ai-travel-frontend:v1.0.0-arm64
```

### 本地开发运行

```bash
# 后端 (终端1)
cd backend
npm install
npm run dev

# 前端 (终端2)
cd frontend
npm install
npm start
```

---

## 🔑 API 密钥配置（重要）

### 配置步骤

1. **启动应用** → 访问 `http://localhost:3000`
2. **进入 Settings** → 点击右上角 Settings 按钮
3. **选择 LLM 提供商**：
   - **阿里云百炼**（推荐 - 助教提供）
   - OpenAI GPT
   - Hugging Face
   - 本地 LLM
4. **输入 API 密钥** → 粘贴获取的密钥
5. **保存配置** → 点击保存按钮

### API 密钥获取

#### 阿里云百炼（推荐）
- **提供方**：课程助教
- **有效期**：3个月免费额度
- **操作**：联系助教获取密钥，粘贴到Settings页面即可

#### OpenAI
- **地址**：https://platform.openai.com/api-keys
- **格式**：sk-xxx...

#### Hugging Face
- **地址**：https://huggingface.co/settings/tokens

---

## 🛠️ 技术栈

| 部分 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Tailwind CSS |
| 后端 | Express.js + TypeScript + Supabase |
| 部署 | Docker + Docker Compose + GitHub Actions |

---

## 📁 项目结构

```
WEB-AI-TRAVELLER/
├── frontend/              # React 前端
│   └── src/             # 源代码
├── backend/               # Express 后端
│   └── src/             # 源代码
├── .github/workflows/     # GitHub Actions
├── docker-compose.yml     # Docker 编排
├── Dockerfile.backend     # 后端镜像配置
├── Dockerfile.frontend    # 前端镜像配置
└── README.md             # 完整文档
```

---

## 🧪 快速验证

### 健康检查
```bash
curl http://localhost:5000/health
```

### 功能测试
1. 访问 http://localhost:3000
2. Settings 页面配置 LLM 密钥
3. Travel Planner 输入旅行参数
4. 点击生成行程
5. Budget Manager 记录开支

---

## 📦 Docker 镜像构建

GitHub Actions 已配置自动构建和发布Docker镜像到Release。

### 手动构建

```bash
# 构建镜像
docker build -f Dockerfile.backend -t ai-travel-backend:v1.0.0 .
docker build -f Dockerfile.frontend -t ai-travel-frontend:v1.0.0 .

# 保存为 tar 文件
docker save ai-travel-backend:v1.0.0 | gzip > ai-travel-backend.tar.gz
docker save ai-travel-frontend:v1.0.0 | gzip > ai-travel-frontend.tar.gz
```

---

## ✅ 提交完成清单

- ✅ GitHub 仓库已建立：https://github.com/liangyuRen/WEB-AI-TRAVELLER
- ✅ 项目代码完整上传
- ✅ Dockerfile 已配置（前端和后端）
- ✅ Docker Compose 已配置
- ✅ 可下载的 Docker 镜像文件
- ✅ 详细的 README 文档
- ✅ API 密钥配置说明
- ✅ 快速开始指南
- ✅ Git 提交历史清晰（26+ 提交）

---

## 📚 完整文档

更详细的文档请参考 GitHub 仓库的 README.md：

https://github.com/liangyuRen/WEB-AI-TRAVELLER/blob/main/README.md

包含以下内容：
- 核心 API 端点说明
- 数据库架构设计
- 高级配置选项
- 故障排除指南
- 开发路线图

---

## 🎓 课程信息

- **课程**：大模型辅助软件工程
- **学校**：南京大学
- **作业类型**：AI Web应用开发
- **提交日期**：2025年11月12日

---

## 📞 支持

遇到问题请：
1. 查看 README.md 中的故障排除部分
2. 在 GitHub 上提交 Issue
3. 检查 Docker 日志：`docker-compose logs`

---

**项目状态**: 🚀 生产就绪，可直接运行

完整信息请访问 GitHub 仓库：https://github.com/liangyuRen/WEB-AI-TRAVELLER
