# WEB-AI-TRAVELLER 快速参考指南

## 🎯 项目状态

✅ **完成度**: 95%+
✅ **可用状态**: 完全就绪
✅ **最后更新**: 2024-11-12
✅ **提交**: `8a4913b`

---

## 📦 核心变更摘要

### 完成的工作

| 模块 | 状态 | 完成度 | 说明 |
|------|------|--------|------|
| 前端认证 | ✅ | 100% | 4 个 TODO 完成 |
| 旅行规划 API | ✅ | 100% | 3 个 TODO 完成 |
| 预算管理 API | ✅ | 100% | 4 个 TODO 完成 |
| API 优化 | ✅ | 100% | 重试 + 错误处理 |
| 部署文档 | ✅ | 100% | 700+ 行指南 |

### 代码统计

- **新增代码**: 1,470+ 行
- **文件修改**: 4 个
- **文件新增**: 3 个
- **完成 TODO**: 11 个

---

## 🚀 快速启动

### 1. 前置准备

```bash
# 1.1 克隆项目
git clone <your-repo>
cd WEB-AI-TRAVELLER

# 1.2 创建环境文件
# 前端
cp .env.frontend frontend/.env.local
# 后端
cp .env.example backend/.env

# 1.3 编辑环境变量（参考 DEPLOYMENT_GUIDE.md）
```

### 2. 安装依赖

```bash
# 前端
cd frontend && npm install

# 后端
cd backend && npm install
```

### 3. 启动应用

```bash
# 终端 1: 前端
cd frontend && npm start        # http://localhost:3000

# 终端 2: 后端
cd backend && npm run dev       # http://localhost:5000

# 或使用 Docker Compose
docker-compose up -d
```

### 4. 配置 Supabase

```sql
-- 在 Supabase SQL 编辑器中运行:
-- 参考 DEPLOYMENT_GUIDE.md 中的"创建数据库表"部分
```

### 5. 配置 LLM API

在应用 Settings 页面配置:
- Provider: `alibaba` 或 `openai`
- API Key: 获取相应密钥

### 6. 开始使用

1. 访问 http://localhost:3000
2. 注册新账户
3. 生成旅行计划（需要 LLM API Key）
4. 管理预算和开支

---

## 📋 关键文件位置

### 前端关键文件

```
frontend/src/
├── pages/
│   ├── Login.tsx                   # 登录/注册页面
│   ├── Dashboard.tsx               # 仪表板（语音输入）
│   ├── TravelPlanner.tsx           # 行程规划
│   ├── BudgetManager.tsx           # 预算管理
│   └── Settings.tsx                # 配置（API Key）
├── services/
│   ├── supabase.ts ⭐            # Supabase Auth
│   ├── api.ts ⭐                  # API 客户端 (优化版)
│   ├── xunfei-speech.ts           # 语音识别
│   └── map.ts                      # 地图服务
└── store/
    └── authStore.ts ⭐            # 认证状态 (完成版)
```

### 后端关键文件

```
backend/src/
├── routes/
│   ├── travel.ts ⭐               # 旅行规划 API (完成版)
│   ├── budget.ts ⭐               # 预算管理 API (完成版)
│   ├── llm.ts                      # LLM 集成
│   └── speech.ts                   # 语音服务
├── services/
│   ├── supabase.ts                 # 数据库层
│   ├── llm.ts                      # LLM 提供商
│   └── xunfei-speech.ts            # 语音 API
└── utils/
    ├── errors.ts                   # 错误处理
    └── helpers.ts                  # 工具函数
```

### 重要文档

```
根目录/
├── DEPLOYMENT_GUIDE.md ⭐         # 完整部署指南 (700+ 行)
├── TECHNICAL_REPORT.md ⭐         # 技术报告
├── PROJECT_COMPLETION_SUMMARY.md ⭐ # 完成总结
├── API.md                          # API 文档
├── .env.frontend ⭐               # 前端环境变量模板
└── README.md                       # 项目概述
```

---

## 🔑 关键命令

### 开发

```bash
# 前端
npm start                    # 开发模式 (hot reload)
npm test                     # 运行测试
npm run build               # 生产构建

# 后端
npm run dev                 # 开发模式 (nodemon)
npm run build              # TypeScript 编译
npm start                  # 生产模式
npm test                   # 运行测试
```

### Docker

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down

# 重建镜像
docker-compose build --no-cache
```

### Git

```bash
# 查看最新提交
git log --oneline -5

# 查看当前分支
git branch -a

# 提交更改
git add .
git commit -m "feat: description"
git push origin main
```

---

## 📊 API 速查

### 旅行规划

```bash
# 生成行程
curl -X POST http://localhost:5000/api/travel/plan \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "日本",
    "days": 5,
    "budget": 10000,
    "people": 2,
    "preferences": "美食",
    "userId": "user-id",
    "provider": "alibaba",
    "apiKey": "sk-xxx"
  }'

# 获取用户所有行程
curl http://localhost:5000/api/travel/plans/user-id

# 获取单个行程
curl http://localhost:5000/api/travel/plan/plan-id

# 更新行程
curl -X PUT http://localhost:5000/api/travel/plan/plan-id \
  -H "Content-Type: application/json" \
  -d '{"preferences": "新的偏好"}'

# 删除行程
curl -X DELETE http://localhost:5000/api/travel/plan/plan-id
```

### 预算管理

```bash
# 记录开支
curl -X POST http://localhost:5000/api/budget/expense \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan-id",
    "category": "food",
    "amount": 500,
    "description": "午餐"
  }'

# 获取预算摘要
curl http://localhost:5000/api/budget/summary/plan-id

# 获取所有开支
curl http://localhost:5000/api/budget/expenses/plan-id

# AI 预算分析
curl -X POST http://localhost:5000/api/budget/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan-id",
    "provider": "alibaba",
    "apiKey": "sk-xxx"
  }'
```

---

## ⚙️ 环境变量配置

### 前端 (.env.local)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 后端 (.env)

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

---

## 🐛 常见问题解决

### 问题: 连接被拒绝

```bash
# 检查后端是否运行
curl http://localhost:5000/health

# 如果无响应，启动后端
cd backend && npm run dev
```

### 问题: Supabase 连接错误

```bash
# 检查环境变量
echo $SUPABASE_URL
echo $SUPABASE_KEY

# 确保在后端目录
cd backend
```

### 问题: LLM API 错误

```bash
# 检查 API Key 是否正确
# 在 Settings 页面重新配置
# 确保 API Key 有效且有额度
```

### 问题: 语音识别不工作

```bash
# 检查浏览器权限
# 允许网站访问麦克风
# 检查讯飞配置
```

---

## 📈 性能监控

### 后端日志

```bash
# 实时查看日志
docker-compose logs -f ai-travel-backend

# 查看特定数量的日志
docker-compose logs --tail=100 ai-travel-backend
```

### API 性能测试

```bash
# 使用 wrk 测试并发性能
wrk -t4 -c100 -d30s http://localhost:5000/health

# 使用 autocannon
autocannon http://localhost:5000/health -d 30
```

---

## 📚 学习资源

### 项目文档

1. **快速开始**: `README.md`
2. **部署指南**: `DEPLOYMENT_GUIDE.md` ⭐ (推荐首先阅读)
3. **技术报告**: `TECHNICAL_REPORT.md` (深入技术细节)
4. **完成总结**: `PROJECT_COMPLETION_SUMMARY.md`
5. **API 文档**: `API.md`

### 外部资源

- Supabase: https://supabase.com/docs
- React: https://react.dev
- Express: https://expressjs.com
- Zustand: https://github.com/pmndrs/zustand
- Leaflet: https://leafletjs.com

---

## 🔒 安全性建议

### 生产部署

- ✅ 使用环境变量管理敏感信息
- ✅ 启用 HTTPS
- ✅ 配置 CORS 白名单
- ✅ 定期更新依赖
- ✅ 监控错误日志
- ✅ 备份数据库

### 代码审计

- ✅ 检查敏感信息泄露
- ✅ 验证输入数据
- ✅ 检查 SQL 注入风险
- ✅ 审查权限控制

---

## 📞 技术支持

### 获取帮助

1. 查看 `DEPLOYMENT_GUIDE.md` 中的"故障排除"部分
2. 检查项目 GitHub Issues
3. 查看应用日志获取错误信息
4. 参考 API 文档验证请求格式

### 提交问题

```bash
# 查看最近的错误日志
docker-compose logs --tail=50

# 检查环境配置
env | grep -i react
env | grep -i supabase
```

---

## 🎓 学习路径

### 第 1 天: 搭建和运行

1. 克隆项目
2. 配置环境变量
3. 安装依赖
4. 本地启动应用
5. 测试基本功能

### 第 2 天: 理解架构

1. 阅读 `DEPLOYMENT_GUIDE.md`
2. 阅读 `TECHNICAL_REPORT.md`
3. 探索前端页面代码
4. 探索后端 API 代码

### 第 3 天: 深入定制

1. 修改 UI 和样式
2. 添加新的 API 端点
3. 扩展数据库表
4. 集成新的 LLM 提供商

### 第 4-5 天: 测试和部署

1. 编写单元测试
2. 性能测试和优化
3. Docker 部署
4. 生产环境验证

---

## ✅ 最终检查清单

### 开发环境

- [ ] Node.js 16+ 已安装
- [ ] npm/yarn 已安装
- [ ] 项目依赖已安装
- [ ] 环境变量已配置
- [ ] 前端和后端都能启动

### 功能验证

- [ ] 用户能成功注册
- [ ] 用户能成功登录
- [ ] 能生成旅行计划（需要 LLM API Key）
- [ ] 能添加和管理开支
- [ ] 能查看预算摘要
- [ ] 能进行 AI 预算分析

### 部署准备

- [ ] 所有 TODO 已完成
- [ ] 代码审查通过
- [ ] 单元测试已编写
- [ ] 部署文档已审阅
- [ ] 安全性检查已完成

---

## 📞 快速联系

| 需求 | 文档 | 命令 |
|------|------|------|
| 快速启动 | README.md | `npm start` |
| 部署指南 | DEPLOYMENT_GUIDE.md | `docker-compose up` |
| API 文档 | API.md | `curl localhost:5000/...` |
| 技术细节 | TECHNICAL_REPORT.md | 阅读代码 |
| 故障排除 | DEPLOYMENT_GUIDE.md§9 | `docker-compose logs` |

---

**版本**: 1.0.0
**更新时间**: 2024-11-12
**最后一次大更新**: 提交 `8a4913b`
**项目状态**: ✅ 完成 / 🚀 就绪

