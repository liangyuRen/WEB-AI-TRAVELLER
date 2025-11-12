# 🐛 本地开发、调试和 Docker 打包指南

## 📋 当前情况说明

### 数据库状态

✅ **Supabase 数据库**:
- 表结构已创建 (travel_plans, expenses)
- RLS 策略已配置
- **但没有预置数据** - 完全空表

✅ **应用状态**:
- 代码 100% 完成
- 功能完整
- 配置已就绪

📝 **你的需求**:
1. 在本地运行看效果
2. 发现并修复 bug
3. 最后打包 Docker image

---

## 🚀 第 1 步: 本地快速启动（5 分钟）

### Windows 用户（最简单）

```bash
# 直接双击
start-and-test.bat
```

或者手动启动：

```bash
# 终端 1：启动后端 (端口 5000)
cd backend
npm install
npm run dev

# 终端 2：启动前端 (端口 3000)
cd frontend
npm install
npm start
```

### Mac/Linux 用户

```bash
# 终端 1
cd backend && npm install && npm run dev

# 终端 2
cd frontend && npm install && npm start
```

---

## 🌐 第 2 步: 访问应用

打开浏览器访问：**http://localhost:3000**

### 预期见到的页面

1. **Login/Signup 页面**
   - Email 和 Password 输入框
   - Sign Up 和 Login 按钮

2. **注册一个测试用户**
   ```
   Email: test@example.com
   Password: TestPassword123
   Name: Test User
   ```

3. **进入 Dashboard**
   - 应该看到欢迎消息
   - 导航菜单可用

---

## 🔍 第 3 步: 调试和查看日志

### 查看前端日志

**打开浏览器开发者工具**：
- Windows/Linux: `F12`
- Mac: `Cmd + Option + I`

**查看日志**：
- Console 标签：JavaScript 错误和日志
- Network 标签：API 请求/响应
- Application/Storage 标签：localStorage 和 cookies

### 查看后端日志

**在后端启动的终端窗口中**：
```
✓ Server running at http://localhost:5000
POST /api/auth/register
GET /api/travel/plans/user-123
...
```

### 常见的日志位置

| 类别 | 位置 | 查看方法 |
|------|------|----------|
| 前端错误 | 浏览器控制台 | F12 → Console |
| API 请求 | 浏览器控制台 | F12 → Network |
| 后端日志 | 后端终端窗口 | 看启动的那个终端 |
| 数据库错误 | 后端终端 + 浏览器控制台 | 两处都看 |

---

## 🧪 第 4 步: 测试各个功能（发现 bug）

### 测试场景 1: 用户注册和登录

```
步骤：
1. 访问 http://localhost:3000
2. 点击 "Sign Up"
3. 填写：
   - Email: test@example.com
   - Password: TestPassword123
   - Name: Test User
4. 点击 "Create Account"

期望结果：
✅ 显示成功消息
✅ 重定向到 Dashboard
✅ 显示 "Welcome, Test User"
✅ localStorage 包含用户信息

如果失败：
❌ 检查浏览器控制台是否有错误
❌ 检查后端日志
❌ 验证 Supabase 连接是否正常
```

### 测试场景 2: 生成行程计划

```
步骤：
1. 登录后进入 Travel Planner
2. 填写表单：
   - Destination: 日本
   - Days: 5
   - Budget: 10000
   - People: 2
   - Preferences: 美食和动漫
3. 点击 "Generate Plan"

期望结果：
✅ 显示加载动画
✅ 5-15 秒后显示生成的行程
✅ 行程包含日期、活动、成本估算

如果失败：
❌ 检查后端日志中的 LLM API 错误
❌ 验证 Bailian API Key 是否正确
❌ 检查网络连接
```

### 测试场景 3: 添加和管理开支

```
步骤：
1. 进入 Budget Manager
2. 添加开支：
   - Category: food
   - Amount: 500
   - Description: 午餐
3. 点击 "Record Expense"

期望结果：
✅ 开支立即显示在列表中
✅ 摘要更新（已支出增加）
✅ 刷新页面后数据仍存在

如果失败：
❌ 检查数据库中是否真的存储了数据
❌ 查看网络请求是否成功
❌ 检查 Supabase 权限设置
```

---

## 🐛 第 5 步: 发现 bug 时的处理方法

### 常见 bug 和解决方案

#### Bug 1: "无法连接到后端" 或 CORS 错误

```
症状：
- 浏览器控制台显示 CORS 错误
- Network 标签显示 API 请求失败

原因：
- 后端没有运行
- CORS 配置不正确

解决方案：
1. 检查后端是否运行
   $ curl http://localhost:5000/health

2. 检查 backend/.env 中的 CORS_ORIGIN
   CORS_ORIGIN=http://localhost:3000

3. 重启后端
   Ctrl+C 停止，重新运行 npm run dev
```

#### Bug 2: "Database connection failed"

```
症状：
- 应用显示数据库连接错误
- 后端日志显示 Supabase 连接失败

原因：
- Supabase 凭证不正确
- 网络问题
- Supabase 服务下线

解决方案：
1. 验证凭证
   cat backend/.env
   # 检查 SUPABASE_URL 和 SUPABASE_KEY

2. 测试 Supabase 连接
   curl -X GET "https://iwtqkpxiyawxlufduxrw.supabase.co/rest/v1/" \
     -H "apikey: YOUR_ANON_KEY"

3. 检查 Supabase 状态
   https://status.supabase.com/
```

#### Bug 3: "API Key invalid" 或 LLM 错误

```
症状：
- 生成行程时显示 API 错误
- 后端日志显示 LLM API 失败

原因：
- Bailian API Key 不正确
- API Key 已过期
- 网络问题

解决方案：
1. 验证 API Key
   cat backend/.env | grep BAILIAN_API_KEY
   # 应该是: sk-34f44781c41a4ac2808dfc10180d651d

2. 测试 API Key 是否有效
   # 访问 Alibaba Bailian 官网测试 key

3. 在前端 Settings 页面手动配置
   Settings → LLM Configuration
   Provider: alibaba
   API Key: sk-34f44781c41a4ac2808dfc10180d651d
```

#### Bug 4: "数据未保存" 或 RLS 错误

```
症状：
- 添加数据后刷新页面数据消失
- 获取数据时显示权限错误

原因：
- RLS 策略配置不正确
- 用户未登录
- Supabase 表未创建

解决方案：
1. 确保已登录
   检查 localStorage 中是否有 userId

2. 验证表是否存在
   Supabase Dashboard → Tables
   # 应该看到 travel_plans 和 expenses

3. 验证 RLS 策略
   Supabase Dashboard → RLS
   # 应该有 4 个 travel_plans 策略和 4 个 expenses 策略
```

---

## 📝 如何记录和报告 bug

当你发现 bug 时，请记录以下信息：

### Bug 报告模板

```markdown
## Bug 标题
[简短描述，例如：用户登录后无法加载行程列表]

## 重现步骤
1. 步骤 1
2. 步骤 2
3. 步骤 3

## 期望行为
应该显示...

## 实际行为
实际显示...

## 截图或错误信息
（粘贴浏览器控制台的错误或后端日志）

## 环境信息
- 浏览器：Chrome v120
- 操作系统：Windows 11
- 后端：http://localhost:5000
- 前端：http://localhost:3000
- 数据库：Supabase
```

---

## 🔧 第 6 步: 修复 bug 和测试

### 修复流程

1. **定位 bug**
   - 浏览器控制台看前端错误
   - 后端日志看服务器错误
   - 检查网络请求 (Network 标签)

2. **找到源代码**
   ```
   前端代码：frontend/src/
   后端代码：backend/src/
   ```

3. **修改代码**
   - 编辑相应的文件
   - 保存文件
   - 前端会自动热加载
   - 后端需要重启 (Ctrl+C, npm run dev)

4. **测试修复**
   - 重新测试相同的场景
   - 确保修复有效
   - 检查没有引入新 bug

### 快速重启

```bash
# 重启后端
# 在后端终端按 Ctrl+C，然后运行
npm run dev

# 前端通常自动刷新，如果没有刷新
# 按 Ctrl+Shift+R (硬刷新)
```

---

## 📊 第 7 步: 清空测试数据

如果想重新开始测试（清除所有用户和数据）：

### 方法 1: 在 Supabase 中删除数据

```sql
-- 进入 Supabase Dashboard → SQL Editor
-- 执行以下 SQL

-- 删除所有开支
DELETE FROM public.expenses;

-- 删除所有行程计划
DELETE FROM public.travel_plans;

-- 删除所有用户（注意：删除 auth.users 需要特殊权限）
-- 通常通过 Supabase Dashboard 的 Auth 页面手动删除用户
```

### 方法 2: 通过应用重新注册

```
1. 使用不同的邮箱重新注册
   test2@example.com / TestPassword123
2. 新用户将有空的数据
3. 可以从头开始测试
```

---

## 🐳 第 8 步: 准备 Docker 打包

确认所有 bug 已修复后，就可以打包 Docker 了。

### 检查清单

在打包前，确保：

- [ ] 应用在本地完全运行无错误
- [ ] 所有主要功能已测试
- [ ] 没有明显的 bug
- [ ] 代码已提交到 Git
- [ ] 所有依赖已在 package.json 中
- [ ] .env 文件已被 .gitignore 忽略
- [ ] Dockerfile 已创建并测试

### 快速测试 Docker 构建（本地）

```bash
# 构建 Docker 镜像（前端）
docker build -f frontend/Dockerfile -t travel-planner-frontend:latest frontend/

# 构建 Docker 镜像（后端）
docker build -f backend/Dockerfile -t travel-planner-backend:latest backend/

# 运行容器测试
docker run -p 3000:3000 travel-planner-frontend:latest
docker run -p 5000:5000 travel-planner-backend:latest
```

### 上传到阿里云镜像仓库

```bash
# 1. 登录阿里云
docker login --username=YOUR_USERNAME registry.cn-hangzhou.aliyuncs.com

# 2. 标记镜像
docker tag travel-planner-frontend:latest registry.cn-hangzhou.aliyuncs.com/YOUR_NAMESPACE/travel-planner-frontend:latest
docker tag travel-planner-backend:latest registry.cn-hangzhou.aliyuncs.com/YOUR_NAMESPACE/travel-planner-backend:latest

# 3. 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/YOUR_NAMESPACE/travel-planner-frontend:latest
docker push registry.cn-hangzhou.aliyuncs.com/YOUR_NAMESPACE/travel-planner-backend:latest
```

---

## 📚 完整的本地开发工作流

```
1. 启动应用 (5 分钟)
   ├─ npm run dev (后端)
   └─ npm start (前端)

2. 打开浏览器 (http://localhost:3000)
   ├─ 注册账户
   ├─ 测试功能
   └─ 检查日志

3. 发现 bug (如有)
   ├─ 浏览器控制台看错误
   ├─ 后端日志看日志
   └─ Network 标签看请求

4. 修复 bug
   ├─ 编辑源代码
   ├─ 保存并重新加载
   └─ 重新测试

5. 重复 2-4 直到完美

6. 打包 Docker
   ├─ docker build
   ├─ docker run (测试)
   └─ docker push (上传)
```

---

## 🎯 快速命令速查表

```bash
# 启动应用
npm run dev          # 后端
npm start            # 前端

# 查看日志
curl http://localhost:5000/health          # 检查后端
curl http://localhost:3000                 # 检查前端

# 调试工具
F12                  # 浏览器开发者工具
Ctrl+Shift+R         # 硬刷新浏览器

# 重启
Ctrl+C               # 停止运行
npm run dev          # 重新启动

# Docker
docker build -t image:tag .
docker run -p 3000:3000 image:tag
docker push registry/image:tag
```

---

## ✅ 现在就开始！

### 立即执行：

1. **打开终端，启动应用**
   ```bash
   # 终端 1
   cd backend && npm run dev

   # 终端 2
   cd frontend && npm start
   ```

2. **打开浏览器**
   ```
   http://localhost:3000
   ```

3. **注册测试账户并测试功能**
   ```
   Email: test@example.com
   Password: TestPassword123
   ```

4. **打开开发者工具 (F12) 查看日志**

5. **根据需要修复 bug**

6. **确认没问题后打包 Docker**

---

**预计耗时**:
- 本地启动: 5 分钟
- 功能测试: 30 分钟
- Bug 修复: 取决于发现的问题
- Docker 打包: 10 分钟

**祝你测试顺利！如发现任何问题，都可以快速修复。** 🚀

