# 快速启动指南 - AI Travel Planner

本文档提供了已配置API密钥的快速启动指南。

## 🚀 快速启动 (3分钟)

### 1. 使用Docker Compose（推荐）

```bash
# 克隆项目
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner

# 启动所有服务
docker-compose up --build

# 应用可在以下地址访问：
# 前端: http://localhost:3000
# 后端API: http://localhost:5000
# 健康检查: http://localhost:5000/health
```

### 2. 本地开发

#### 后端启动

```bash
cd backend

# 创建 .env 文件（使用提供的密钥）
cp .env.example .env

# 安装依赖
npm install

# 开发模式
npm run dev

# 或生产构建
npm run build
npm start
```

#### 前端启动（新终端）

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start

# 访问 http://localhost:3000
```

## 🔑 已配置的API密钥

项目已配置以下API密钥（在`.env.example`中）：

### 1. 阿里云百炼 (Alibaba Bailian)
- **模型**: Qwen (通义千问)
- **API Key**: `sk-9fc980b8529046899c926c7540516836`
- **用途**: LLM驱动的行程规划和预算分析
- **API文档**: https://bailian.aliyun.com/

### 2. 讯飞语音识别 (Xunfei Speech)
- **APPID**: `0db047fe`
- **API Key**: `9bcfb98849bcc8a4c29015205722a4af`
- **API Secret**: `MzE1ZTA3YWZhODU1YjJhMWQ1Mjk4OWI2`
- **用途**: 语音转文字输入
- **API文档**: https://console.xfyun.cn/

### 3. 地图服务
- **使用**: OpenStreetMap (免费开源)
- **库**: Leaflet.js
- **功能**: 景点位置、距离计算、路线规划

## 📝 使用配置

所有配置都在 `backend/.env` 中。如果需要修改，可复制 `.env.example`：

```bash
cd backend
cp .env.example .env
# 编辑 .env 根据需要修改
```

### 环境变量说明

```env
# 服务器
PORT=5000
CLIENT_URL=http://localhost:3000

# Alibaba Bailian LLM
LLM_API_KEY=sk-9fc980b8529046899c926c7540516836
LLM_PROVIDER=alibaba

# Xunfei Speech Recognition
XUNFEI_APPID=0db047fe
XUNFEI_API_SECRET=MzE1ZTA3YWZhODU1YjJhMWQ1Mjk4OWI2
XUNFEI_API_KEY=9bcfb98849bcc8a4c29015205722a4af
```

## 🧪 测试API

### 使用测试脚本

```bash
bash test-api.sh
```

### 手动测试

```bash
# 健康检查
curl http://localhost:5000/health

# 获取讯飞语音认证信息
curl http://localhost:5000/api/speech/auth

# 测试LLM聊天（需要API密钥）
curl -X POST http://localhost:5000/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "推荐一个5天的日本旅游计划",
    "provider": "alibaba",
    "apiKey": "sk-9fc980b8529046899c926c7540516836"
  }'

# 生成旅行行程
curl -X POST http://localhost:5000/api/llm/generate-itinerary \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "日本",
    "days": 5,
    "budget": 10000,
    "travelers": 2,
    "preferences": "美食和动漫",
    "provider": "alibaba",
    "apiKey": "sk-9fc980b8529046899c926c7540516836"
  }'
```

## 🌐 前端使用

### 1. 登录
- 首次访问需要登录或注册
- 目前为演示模式，可使用任意凭证

### 2. 配置API密钥 (Settings页面)
- 进入Settings页面
- 选择"Alibaba Bailian"作为LLM提供商
- 输入API密钥：`sk-9fc980b8529046899c926c7540516836`
- 点击Save（密钥保存在本地浏览器）

### 3. 使用功能
- **Dashboard**: 测试语音输入和AI聊天
- **Planner**: 生成个性化旅行计划
- **Budget**: 管理旅行预算和开支
- **Settings**: 配置API密钥和偏好

## 🐳 Docker部署

### 构建镜像

```bash
# 使用Docker Compose
docker-compose build

# 或单独构建
docker build -f Dockerfile.backend -t ai-travel-backend:latest .
docker build -f Dockerfile.frontend -t ai-travel-frontend:latest .
```

### 推送镜像

```bash
# 到Docker Hub
docker tag ai-travel-backend:latest yourusername/ai-travel-backend:latest
docker push yourusername/ai-travel-backend:latest

docker tag ai-travel-frontend:latest yourusername/ai-travel-frontend:latest
docker push yourusername/ai-travel-frontend:latest
```

## 📊 目录结构

```
ai-travel-planner/
├── frontend/              # React应用
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── components/   # UI组件
│   │   ├── services/     # API和功能服务
│   │   ├── store/        # 状态管理
│   │   └── App.tsx
│   └── package.json
├── backend/               # Express API
│   ├── src/
│   │   ├── routes/       # API路由
│   │   ├── services/     # 业务逻辑
│   │   └── index.ts
│   ├── .env.example      # 环境变量示例
│   └── package.json
├── docker-compose.yml    # Docker编排
├── Dockerfile.frontend   # 前端镜像
├── Dockerfile.backend    # 后端镜像
├── test-api.sh          # API测试脚本
└── README.md            # 完整文档
```

## 🔧 故障排查

### 问题1: 端口被占用
```bash
# 更改端口
# 后端：编辑 backend/.env 中的 PORT
# 前端：编辑 frontend/.env 中的 REACT_APP_API_URL
```

### 问题2: 讯飞语音不工作
- 确保 `XUNFEI_APPID`, `XUNFEI_API_KEY`, `XUNFEI_API_SECRET` 正确配置
- 检查网络连接（WebSocket连接需要开放）
- 查看浏览器控制台错误信息

### 问题3: LLM不返回结果
- 验证 `LLM_API_KEY` 是否正确
- 确保网络能访问阿里云服务
- 检查后端日志输出

### 问题4: 地图不显示
- OpenStreetMap依赖网络连接
- 可能需要配置代理或VPN（中国地区）
- 检查浏览器控制台是否有跨域错误

## 💡 功能说明

### 智能行程规划
1. 输入目的地、天数、预算、同行人数和偏好
2. AI生成详细行程表
3. 包括景点、餐厅、交通、住宿推荐
4. 自动计算预期成本

### 语音输入
- 支持讯飞WebSocket语音识别
- 实时转录中文/英文
- 在Dashboard和预算记录中使用

### 预算管理
- 记录每笔开支
- 按分类统计
- AI提供优化建议

### 地图展示
- OpenStreetMap显示目的地
- 搜索功能查找景点
- 计算两点间距离

## 📞 联系方式

- **问题报告**: GitHub Issues
- **建议反馈**: GitHub Discussions
- **邮件**: your-email@example.com

## 📚 更多信息

- [完整README](./README.md)
- [提交说明](./SUBMISSION.md)
- [API文档](./backend/README.md)
- [测试脚本](./test-api.sh)

---

**有效期**: 3个月（从课程开始日期）
**最后更新**: 2024年11月12日
**状态**: 🟢 生产就绪
