# 项目提交说明

## 项目信息

**项目名称**: AI Travel Planner (AI旅行规划师)
**课程**: 南京大学大模型辅助软件工程
**类型**: Web应用 (React + Node.js)

## GitHub仓库

本项目代码已提交到GitHub仓库：

```
https://github.com/yourusername/ai-travel-planner
```

*请替换 `yourusername` 为实际的GitHub用户名*

## 项目特性

### ✅ 已实现功能

1. **智能行程规划** ✓
   - 通过语音/文字输入旅行信息
   - AI生成个性化行程
   - Web Speech API语音识别

2. **费用预算管理** ✓
   - 记录和分类开支
   - 实时预算跟踪
   - AI预算分析

3. **用户界面** ✓
   - 响应式设计（Tailwind CSS）
   - 登录注册系统
   - Settings配置页面
   - 多页面导航

4. **API服务** ✓
   - Express后端API
   - LLM集成（Alibaba Bailian + OpenAI）
   - RESTful端点设计

5. **LLM集成** ✓
   - 支持阿里云百炼（推荐）
   - 支持OpenAI API
   - 可扩展的服务工厂模式
   - 运行时API密钥配置

6. **容器化部署** ✓
   - Docker镜像（前后端分离）
   - Docker Compose本地开发
   - 多阶段构建优化

7. **CI/CD流程** ✓
   - GitHub Actions自动构建
   - Docker镜像推送支持
   - 阿里云镜像仓库集成

## 快速开始

### 前提条件

- Node.js 18+
- Docker & Docker Compose
- Git
- 现代Web浏览器

### 开发环境运行

```bash
# 克隆仓库
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner

# 使用Docker Compose（推荐）
docker-compose up --build

# 或本地开发
# 终端1：后端
cd backend
npm install
npm run dev

# 终端2：前端
cd frontend
npm install
npm start
```

访问 http://localhost:3000

### 配置API密钥

#### 方式1：Settings UI（推荐）
1. 登录应用
2. 进入Settings页面
3. 选择LLM提供商
4. 输入API密钥
5. 点击Save

#### 方式2：环境变量
```bash
# 后端 backend/.env
PORT=5000
LLM_API_KEY=your_api_key_here
LLM_PROVIDER=alibaba|openai
```

## API文档

### 核心端点

#### 旅行规划
- `POST /api/travel/plan` - 生成旅行计划
- `GET /api/travel/plans/:userId` - 获取已保存计划
- `PUT /api/travel/plan/:planId` - 更新计划

#### 预算管理
- `POST /api/budget/expense` - 记录开支
- `GET /api/budget/summary/:planId` - 获取预算摘要
- `DELETE /api/budget/expense/:expenseId` - 删除开支

#### LLM服务
- `POST /api/llm/chat` - 通用聊天接口
- `POST /api/llm/generate-itinerary` - AI生成行程
- `POST /api/llm/analyze-budget` - AI预算分析

### 测试API

```bash
# 使用提供的测试脚本
bash test-api.sh

# 或使用curl手动测试
curl http://localhost:5000/health

# 测试LLM端点（需要API密钥）
curl -X POST http://localhost:5000/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "你好",
    "provider": "alibaba",
    "apiKey": "your_key_here"
  }'
```

## Docker部署

### 构建镜像

```bash
# 后端镜像
docker build -f Dockerfile.backend -t ai-travel-backend:latest .

# 前端镜像
docker build -f Dockerfile.frontend -t ai-travel-frontend:latest .

# 或使用Docker Compose
docker-compose build
```

### 运行容器

```bash
# 使用Docker Compose（推荐）
docker-compose up -d

# 或单独运行
docker run -p 5000:5000 --env-file .env ai-travel-backend:latest
docker run -p 3000:80 ai-travel-frontend:latest
```

## GitHub Actions配置

项目已配置GitHub Actions自动构建流程：

### 配置Secrets

在GitHub仓库Settings > Secrets添加：

```
DOCKER_USERNAME = your_docker_username
DOCKER_PASSWORD = your_docker_password

# 可选：阿里云镜像仓库
ALIYUN_REGISTRY = registry.aliyuncs.com
ALIYUN_USERNAME = your_aliyun_username
ALIYUN_PASSWORD = your_aliyun_password
```

### 工作流

- 推送到main分支自动触发
- 构建Docker镜像
- 推送到Docker Hub
- 可选推送到阿里云镜像仓库

## 提交内容

本项目包含以下文件和目录：

```
ai-travel-planner/
├── frontend/                          # React应用
│   ├── src/
│   │   ├── pages/                    # 页面组件
│   │   ├── components/               # UI组件
│   │   ├── store/                    # 状态管理
│   │   ├── services/                 # API服务
│   │   └── App.tsx
│   ├── tailwind.config.js            # Tailwind配置
│   ├── postcss.config.js             # PostCSS配置
│   └── package.json
├── backend/                           # Express API
│   ├── src/
│   │   ├── routes/                   # API路由
│   │   ├── services/                 # 业务逻辑（LLM服务）
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
├── .github/workflows/                 # GitHub Actions
│   └── docker-build.yml              # CI/CD配置
├── Dockerfile.frontend               # 前端Docker镜像
├── Dockerfile.backend                # 后端Docker镜像
├── docker-compose.yml                # Docker Compose配置
├── nginx.conf                        # 反向代理配置
├── test-api.sh                       # API测试脚本
├── README.md                         # 项目文档
└── .gitignore                        # Git忽略文件

# 核心提交
- Initial commit: 项目初始化和基础结构
- feat: Implement LLM API integration: LLM服务集成
```

## 技术亮点

1. **多LLM支持**
   - 工厂模式设计
   - 易于扩展新提供商
   - 运行时切换

2. **安全配置**
   - 无硬编码密钥
   - 本地存储API密钥
   - 环境变量支持

3. **现代开发栈**
   - TypeScript全栈
   - React Hooks + Zustand
   - Express.js最佳实践

4. **容器化部署**
   - 多阶段Docker构建
   - Docker Compose编排
   - CI/CD自动化

5. **响应式设计**
   - Tailwind CSS
   - 移动友好
   - 暗色主题准备

## 开发进程

### 已完成（2024年11月）
- [x] 项目架构设计
- [x] 前后端框架搭建
- [x] 核心API端点
- [x] LLM服务集成
- [x] Docker配置
- [x] GitHub Actions setup
- [x] 文档编写

### 进行中
- [ ] Supabase数据库集成
- [ ] 用户认证完善
- [ ] 地图功能集成
- [ ] 单元测试
- [ ] 端到端测试

### 计划中
- [ ] PWA支持
- [ ] 离线模式
- [ ] 国际化i18n
- [ ] 性能优化
- [ ] 安全审计

## 常见问题

### Q: 如何配置Alibaba Bailian API？
A:
1. 联系课程助教获取API密钥
2. 在Settings页面选择"Alibaba Bailian"
3. 输入API密钥
4. 点击Save

### Q: 可以使用其他LLM吗？
A: 可以！支持OpenAI、本地LLM等。修改Settings中的提供商选择。

### Q: Docker镜像多大？
A: 优化后约200MB（前端）和150MB（后端）

### Q: 如何在生产环境部署？
A: 参考README.md中的Docker部署部分。建议使用Kubernetes或云平台。

## 贡献指南

欢迎提交Issue和Pull Request！

```bash
# Fork & Clone
git clone https://github.com/yourfork/ai-travel-planner.git

# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git commit -am 'Add feature: description'

# Push to branch
git push origin feature/your-feature

# Create Pull Request
```

## 许可证

MIT License - 详见LICENSE文件

## 联系方式

- **项目负责人**: [Your Name]
- **邮箱**: [Your Email]
- **GitHub**: [Your GitHub]

---

**最后更新**: 2024年11月12日
**项目状态**: 🚀 开发进行中
**下一个里程碑**: Supabase集成和用户认证完善
