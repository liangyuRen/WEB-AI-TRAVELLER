# 🚀 WEB-AI-TRAVELLER 快速启动指南

## 📊 项目状态
- ✅ 项目完成度: 95%+
- ✅ 所有模块已集成
- ✅ 已配置实际 Supabase 凭证
- 🚀 **准备就绪！**

---

## ⚡ 5 分钟快速启动

### 第 1 步: Supabase 数据库设置（3 分钟）

1. **访问 Supabase 控制台**
   - 打开: https://app.supabase.com
   - 登录并选择项目

2. **创建数据库表和 RLS 策略**
   - 左侧菜单 → SQL Editor
   - 点击 "New Query"
   - 打开 `SUPABASE_SETUP.md` 中的 SQL 脚本
   - 复制全部 SQL 并在编辑器中执行
   - 点击 "Run" 按钮

3. **验证表已创建**
   ```bash
   # 在 SQL Editor 中运行
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   ```
   应该看到: `travel_plans`, `expenses`

4. **获取 API Keys**
   - 左侧菜单 → Settings > API
   - 复制 "anon/public" key → 放入前端 `.env.local`
   - 复制 "service_role/secret" key → 放入后端 `.env`

### 第 2 步: 启动应用（1-2 分钟）

#### 选项 A: 使用启动脚本（推荐）

**Windows**:
```bash
# 直接双击运行
start.bat
```

**Mac/Linux**:
```bash
# 使用 Docker
docker-compose up -d

# 或手动启动
# 终端 1
cd backend && npm run dev

# 终端 2
cd frontend && npm start
```

#### 选项 B: 手动启动

```bash
# 1. 安装依赖
cd backend && npm install
cd ../frontend && npm install

# 2. 启动后端（终端 1）
cd backend
npm run dev
# 输出: Server running on http://localhost:5000

# 3. 启动前端（终端 2）
cd frontend
npm start
# 应用会自动打开: http://localhost:3000
```

### 第 3 步: 测试应用（1-2 分钟）

1. **前端应该在浏览器打开**
   - 地址: http://localhost:3000
   - 看到登录/注册页面 ✅

2. **注册新用户**
   - 输入: 邮箱和密码
   - 点击 "Sign Up"
   - 应该能成功注册 ✅

3. **生成行程计划**
   - 登录成功后进入 Dashboard
   - 在 Settings 页面配置 LLM API Key
     - Provider: `alibaba` 或 `openai`
     - API Key: 你的实际 API Key
   - 返回 TravelPlanner 页面
   - 输入目的地、天数等信息
   - 点击 "Generate Plan"
   - 应该能生成行程 ✅

4. **管理预算**
   - 进入 BudgetManager 页面
   - 添加开支
   - 查看预算摘要
   - 应该能显示统计信息 ✅

---

## 📁 项目文件结构

```
WEB-AI-TRAVELLER/
├── .env.frontend                    # 前端环境变量模板
├── SUPABASE_SETUP.md               # ⭐ Supabase 设置指南
├── QUICK_REFERENCE.md              # 快速参考
├── DEPLOYMENT_GUIDE.md             # 完整部署指南
├── TECHNICAL_REPORT.md             # 技术报告
├── start.bat                        # Windows 启动脚本
├── test-supabase-config.sh          # 配置检查脚本
│
├── frontend/
│   ├── .env.local                   # ⭐ 前端环境变量（需要配置）
│   ├── src/
│   │   ├── services/
│   │   │   ├── supabase.ts         # Supabase 认证
│   │   │   └── api.ts              # API 客户端（有重试）
│   │   ├── store/
│   │   │   └── authStore.ts        # 认证状态
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── TravelPlanner.tsx
│   │   │   ├── BudgetManager.tsx
│   │   │   └── Settings.tsx
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── .env                         # ⭐ 后端环境变量（需要配置）
│   ├── src/
│   │   ├── routes/
│   │   │   ├── travel.ts           # 旅行 API（LLM + DB）
│   │   │   ├── budget.ts           # 预算 API（DB + LLM 分析）
│   │   │   ├── llm.ts              # LLM 提供商
│   │   │   └── speech.ts           # 语音 API
│   │   ├── services/
│   │   │   ├── supabase.ts         # 数据库层
│   │   │   └── llm.ts              # LLM 工厂
│   │   └── ...
│   └── package.json
│
└── docker-compose.yml              # Docker 部署配置
```

---

## 🔑 环境变量配置

### 后端 (backend/.env)

```env
# 已创建，需要替换 SUPABASE_KEY
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://iwtqkpxiyawxlufduxrw.supabase.co
SUPABASE_KEY=<从 Supabase Settings > API 复制 service_role key>
CORS_ORIGIN=http://localhost:3000
```

### 前端 (frontend/.env.local)

```env
# 已创建，需要替换 REACT_APP_SUPABASE_ANON_KEY
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=https://iwtqkpxiyawxlufduxrw.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<从 Supabase Settings > API 复制 anon key>
```

---

## 🐛 故障排除

### 问题 1: "Missing Supabase credentials"

```
错误: Missing Supabase credentials
原因: SUPABASE_KEY 未设置或不正确
```

**解决**:
1. 打开 backend/.env
2. 在 Supabase Settings > API 找到 "service_role/secret" key
3. 复制粘贴到 SUPABASE_KEY
4. 重启后端服务

### 问题 2: "Cannot POST /api/travel/plan"

```
错误: 404 Not Found
原因: 后端未启动或路由未正确加载
```

**解决**:
1. 检查后端是否运行: `curl http://localhost:5000/health`
2. 如果没有响应，重启后端: `npm run dev`
3. 等待输出 "Server running on http://localhost:5000"

### 问题 3: "SUPABASE_URL mismatch"

```
错误: URL 与项目不匹配
原因: 前后端 SUPABASE_URL 不一致
```

**解决**:
1. 确认前后端都使用: `https://iwtqkpxiyawxlufduxrw.supabase.co`
2. 检查没有多余的空格或换行符
3. 重启两个服务

### 问题 4: "RLS policy violation"

```
错误: Policy violation
原因: 用户权限问题或 RLS 未正确配置
```

**解决**:
1. 确保已在 SQL Editor 中运行了完整的 SUPABASE_SETUP.md 脚本
2. 查看 Supabase SQL Editor 中的 "pg_policies" 表
3. 应该看到所有的 RLS 策略
4. 如果没有，重新运行 SQL 脚本

### 问题 5: "Cannot find module 'supabase'"

```
错误: Module not found
原因: 依赖未安装
```

**解决**:
```bash
# 重新安装依赖
cd backend
rm -rf node_modules package-lock.json
npm install

# 对前端执行相同操作
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 关键 API 测试

### 测试 1: 健康检查

```bash
curl http://localhost:5000/health
# 期望: 200 OK
```

### 测试 2: 生成旅行计划

```bash
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
```

### 测试 3: 记录开支

```bash
curl -X POST http://localhost:5000/api/budget/expense \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan-id",
    "category": "food",
    "amount": 500,
    "description": "午餐"
  }'
```

---

## 🎯 完整工作流程

### 用户使用流程

```
1. 打开 http://localhost:3000
   ↓
2. 注册新账户 (邮箱 + 密码)
   ↓
3. 登录
   ↓
4. 进入 Settings，配置 LLM API Key
   ↓
5. 进入 TravelPlanner，输入旅行信息
   ↓
6. 点击 "Generate Plan"，生成 AI 行程
   ↓
7. 进入 BudgetManager，添加开支
   ↓
8. 查看预算摘要和 AI 分析
   ↓
9. 修改/删除开支
```

---

## 📚 更多文档

| 文档 | 说明 |
|------|------|
| **SUPABASE_SETUP.md** ⭐ | Supabase 完整设置（必读） |
| **QUICK_REFERENCE.md** | 快速参考和常用命令 |
| **DEPLOYMENT_GUIDE.md** | 生产部署指南 |
| **TECHNICAL_REPORT.md** | 技术细节 |
| **API.md** | API 端点文档 |

---

## ✅ 检查清单

完成以下步骤：

- [ ] 已阅读 SUPABASE_SETUP.md
- [ ] 已在 Supabase SQL Editor 运行 SQL 脚本
- [ ] 已在 backend/.env 设置 SUPABASE_KEY
- [ ] 已在 frontend/.env.local 设置 REACT_APP_SUPABASE_ANON_KEY
- [ ] 后端启动成功（localhost:5000）
- [ ] 前端启动成功（localhost:3000）
- [ ] 能成功注册新用户
- [ ] 能生成旅行计划（需要 LLM API Key）
- [ ] 能管理预算开支

---

## 🚀 部署到生产

参考 `DEPLOYMENT_GUIDE.md` 了解：
- Docker 部署
- Nginx 反向代理
- HTTPS 配置
- 环境变量设置

---

## 📞 需要帮助？

1. **查看错误日志**
   ```bash
   # 后端日志
   docker-compose logs -f backend

   # 前端浏览器控制台 (F12)
   ```

2. **重新检查配置**
   ```bash
   # 运行配置检查脚本
   bash test-supabase-config.sh
   ```

3. **查看相关文档**
   - 快速参考: QUICK_REFERENCE.md
   - 完整指南: DEPLOYMENT_GUIDE.md
   - 技术细节: TECHNICAL_REPORT.md

---

**版本**: 1.0.0
**更新时间**: 2024-11-12
**Supabase 项目**: https://iwtqkpxiyawxlufduxrw.supabase.co

🎉 **项目已就绪，开始使用吧！**
