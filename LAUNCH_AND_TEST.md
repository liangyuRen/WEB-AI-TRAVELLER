# 🚀 启动和测试清单

## 📋 本步骤目标

启动应用并完整测试所有功能模块，确保一切正常工作。

---

## 第 1 部分: 前置检查

### ✅ 检查 1: 验证所有文件已创建

```bash
# 检查必要的文件
ls backend/.env           # ✅ 应该存在
ls frontend/.env.local    # ✅ 应该存在
ls SUPABASE_SETUP.md      # ✅ 应该存在
```

### ✅ 检查 2: 验证环境变量配置

**后端 (backend/.env)**
```
✅ SUPABASE_URL 已配置
⚠️ SUPABASE_KEY 需要更新 (从 Supabase Settings 复制)
✅ PORT 设置为 5000
✅ CLIENT_URL 设置为 http://localhost:3000
```

**前端 (frontend/.env.local)**
```
✅ REACT_APP_SUPABASE_URL 已配置
⚠️ REACT_APP_SUPABASE_ANON_KEY 需要更新 (从 Supabase Settings 复制)
✅ REACT_APP_API_URL 设置为 http://localhost:5000/api
```

### ✅ 检查 3: 验证 Supabase 数据库配置

1. **打开** https://app.supabase.com
2. **进入** SQL Editor
3. **验证** 以下表已创建:
   ```sql
   -- 在 SQL Editor 中运行，应该看到输出
   SELECT tablename FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY tablename;

   -- 输出应该包含:
   -- travel_plans
   -- expenses
   ```

---

## 第 2 部分: 启动应用

### 选项 A: Windows 用户 (最简单)

```bash
# 直接在项目根目录运行
start.bat

# 脚本会:
# 1. 检查 .env 文件
# 2. 安装依赖（如果需要）
# 3. 启动后端（新窗口）
# 4. 启动前端（新窗口）
```

### 选项 B: Mac/Linux 用户 (使用 Docker)

```bash
# 启动所有服务
docker-compose up -d

# 等待输出:
# - ai-travel-frontend 启动在 localhost:3000
# - ai-travel-backend 启动在 localhost:5000

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 选项 C: 手动启动

```bash
# 终端 1: 安装和启动后端
cd backend
npm install  # 如果还没安装
npm run dev

# 等待输出: "Server running on http://localhost:5000"
```

```bash
# 终端 2: 安装和启动前端
cd frontend
npm install  # 如果还没安装
npm start

# 应该自动打开浏览器到 http://localhost:3000
```

---

## 第 3 部分: 功能测试

### 🧪 测试 1: 健康检查

**后端健康检查**:
```bash
# 在任何终端运行
curl http://localhost:5000/health

# 期望输出:
# HTTP/1.1 200 OK
```

**前端可访问**:
```
在浏览器访问: http://localhost:3000
期望: 看到登录/注册页面
```

### 🧪 测试 2: 用户注册和登录

**步骤**:
1. 访问 http://localhost:3000
2. 点击 "Sign Up"
3. 输入:
   - Email: test@example.com
   - Password: TestPassword123
   - Name: Test User
4. 点击 "Create Account"

**期望结果**:
- ✅ 注册成功
- ✅ 自动重定向到 Dashboard
- ✅ 看到欢迎信息 "Welcome, Test User"

### 🧪 测试 3: 导航功能

**步骤**:
1. 在 Dashboard 看到导航菜单
2. 点击各个菜单项：
   - Dashboard (首页)
   - TravelPlanner (行程规划)
   - BudgetManager (预算管理)
   - Settings (配置)

**期望结果**:
- ✅ 能访问所有页面
- ✅ 页面内容正确加载

### 🧪 测试 4: Settings 页面配置

**步骤**:
1. 点击导航菜单 → Settings
2. 看到 "LLM Configuration" 部分
3. 输入:
   - Provider: alibaba (或 openai)
   - API Key: (你的 API Key，或使用测试 Key)
4. 点击 "Save Configuration"

**期望结果**:
- ✅ 看到 "Configuration saved successfully" 消息
- ✅ 刷新页面后值仍然保存
- ✅ 值保存在 localStorage 和 Supabase

### 🧪 测试 5: 旅行规划功能

**步骤**:
1. 点击导航菜单 → TravelPlanner
2. 填写信息:
   - Destination: 日本
   - Days: 5
   - Budget: 10000
   - People: 2
   - Preferences: 美食和动漫
3. 点击 "Generate Plan"

**期望结果**:
- ✅ 看到加载动画
- ✅ 几秒后显示生成的行程
- ✅ 行程包含日程、预算估算等信息
- ✅ 数据保存到 Supabase (backend 日志中会显示)

**如果没有 LLM API Key**:
- ✅ 应该返回基础模板行程（不调用 AI）
- ✅ 数据仍然保存到数据库

### 🧪 测试 6: 预算管理功能

**步骤**:
1. 点击导航菜单 → BudgetManager
2. 看到当前的旅行计划
3. 点击计划或输入开支信息:
   - Category: food
   - Amount: 500
   - Description: 午餐
4. 点击 "Record Expense"

**期望结果**:
- ✅ 看到 "Expense recorded" 消息
- ✅ 预算摘要更新
   - Total Spent: 500
   - Remaining: 9500
   - Percentage: 5%
- ✅ 开支出现在列表中
- ✅ 数据保存到 Supabase

### 🧪 测试 7: 开支编辑和删除

**步骤**:
1. 在 BudgetManager 中找到刚创建的开支
2. 点击 "Edit" 按钮:
   - 修改金额为 600
   - 点击保存
3. 验证预算摘要更新
4. 点击 "Delete" 按钮
5. 验证开支被删除

**期望结果**:
- ✅ 编辑成功，值更新
- ✅ 删除成功，开支消失
- ✅ 预算摘要重新计算

### 🧪 测试 8: 登出功能

**步骤**:
1. 点击导航菜单右上角的 "Logout"
2. 确认登出

**期望结果**:
- ✅ 自动重定向到登录页面
- ✅ Session 被清除
- ✅ 无法访问需要认证的页面

### 🧪 测试 9: 数据持久化

**步骤**:
1. 登录用户 A
2. 创建几个行程和开支
3. 登出
4. 重新登录同一用户
5. 检查数据是否仍然存在

**期望结果**:
- ✅ 所有数据仍然存在
- ✅ 数据来自 Supabase 数据库
- ✅ 不同用户的数据完全隔离

---

## 第 4 部分: 浏览器控制台检查

### ✅ 检查 1: 打开 F12 开发者工具

按 `F12` 打开浏览器开发者工具

### ✅ 检查 2: 查看 Console 选项卡

**应该看到**:
- 应用初始化日志
- 应该 **没有** 明显的 JavaScript 错误

**应该 **不** 看到**:
- ❌ `TypeError: Cannot read property...`
- ❌ `Uncaught Error...`
- ❌ `Supabase connection failed`

### ✅ 检查 3: 查看 Network 选项卡

1. 在 BudgetManager 中添加一个开支
2. 在 Network 选项卡中查看请求

**应该看到**:
- POST http://localhost:5000/api/budget/expense
- Status: 200 (成功)
- Response: 包含创建的开支数据

### ✅ 检查 4: 查看 Application 选项卡

1. 进入 Application → Local Storage
2. 查看 http://localhost:3000 的存储

**应该看到**:
```
supabase.auth.token = {...}  // 用户认证 Token
apiKeys = {"llmProvider":"alibaba","llmApiKey":"..."}  // LLM 配置
```

---

## 第 5 部分: 后端日志检查

### ✅ 检查后端日志

查看启动后端的终端输出:

**正常日志示例**:
```
[info] TravelRoutes: Generating travel plan for user xxx: Japan, 5 days
[info] TravelRoutes: Travel plan created with ID: yyy
[info] BudgetRoutes: Recording expense for plan xxx: food - ¥500
[info] BudgetRoutes: Expense created with ID: zzz
```

**错误日志示例** (需要修复):
```
[error] Supabase Error: Missing credentials
[error] LLM Error: 401 Unauthorized
[error] Database Error: RLS policy violation
```

---

## 测试完整检查清单

### 前置检查
- [ ] backend/.env 文件存在
- [ ] frontend/.env.local 文件存在
- [ ] Supabase 数据库表已创建（travel_plans, expenses）
- [ ] Supabase API Keys 已配置

### 应用启动
- [ ] 后端启动成功 (localhost:5000)
- [ ] 前端启动成功 (localhost:3000)
- [ ] 浏览器可以访问前端

### 核心功能
- [ ] 用户可以注册新账户
- [ ] 用户可以登录
- [ ] 导航菜单全部可访问
- [ ] Settings 页面可以配置 LLM API Key
- [ ] TravelPlanner 可以生成行程
- [ ] BudgetManager 可以添加开支
- [ ] 可以编辑和删除开支
- [ ] 可以看到预算摘要
- [ ] 用户可以登出
- [ ] 重新登录后数据仍然存在

### 数据安全
- [ ] 用户 A 无法看到用户 B 的数据
- [ ] RLS 策略正常工作
- [ ] 用户隔离完整

### 错误处理
- [ ] 没有明显的 JavaScript 错误
- [ ] 网络请求都返回正确的状态码
- [ ] 错误消息清晰且有帮助

---

## 常见问题排除

### 问题: 后端无法启动

```
错误: ECONNREFUSED - Cannot connect to Supabase
原因: SUPABASE_KEY 未正确配置

解决:
1. 打开 backend/.env
2. 检查 SUPABASE_KEY 是否有值
3. 确保没有多余的空格或换行
4. 重启后端: npm run dev
```

### 问题: 注册时出错

```
错误: "Authentication failed"
原因: Supabase Auth 未启用或 Anon Key 不正确

解决:
1. 在 Supabase 控制台检查 Auth 是否启用
2. 确认 REACT_APP_SUPABASE_ANON_KEY 正确
3. 检查浏览器控制台的具体错误信息
```

### 问题: 数据无法保存

```
错误: "RLS policy violation" 或 "Permission denied"
原因: 用户未正确认证或 RLS 策略有问题

解决:
1. 确保用户已登录 (JWT Token 有效)
2. 在 Supabase SQL Editor 检查 RLS 策略
3. 查看后端日志中的错误详情
```

### 问题: 生成行程时出错

```
错误: "LLM Error: 401 Unauthorized"
原因: API Key 不正确或已过期

解决:
1. 确认 API Key 正确
2. 检查 API Key 是否有有效期
3. 如果没有配置 API Key，应该返回基础模板
```

---

## 🎯 完成标志

当你看到以下情况时，说明应用已成功启动和测试:

✅ **技术指标**:
- 后端运行在 http://localhost:5000
- 前端运行在 http://localhost:3000
- 所有数据库表已创建
- RLS 策略已配置

✅ **功能指标**:
- 用户可以完整注册和登录
- 可以生成旅行计划
- 可以管理预算
- 数据正确保存到数据库
- 用户数据完全隔离

✅ **错误指标**:
- 浏览器控制台没有 JavaScript 错误
- 网络请求都返回 200 或正确的状态码
- 后端日志显示正常的操作日志

---

**版本**: 1.0.0
**更新时间**: 2024-11-12

