# 🧪 WEB-AI-TRAVELLER 测试执行指南

## 📋 目标

本指南帮助你系统地执行 WEB-AI-TRAVELLER 应用的完整功能测试，包括前端、后端、数据库和集成测试。

---

## 🚀 第 1 步: 启动应用

### 前置条件
- Node.js 已安装（v14+）
- npm 已安装
- Supabase 凭证已配置（.env 文件已更新）
- 数据库表和 RLS 策略已创建（参考 SUPABASE_SETUP.md）

### Windows 快速启动

```bash
# 在项目根目录运行
start.bat
```

这将自动启动：
- 后端服务器（http://localhost:5000）
- 前端应用（http://localhost:3000）

### 手动启动（Mac/Linux）

```bash
# 终端 1: 启动后端
cd backend
npm install
npm run dev

# 终端 2: 启动前端
cd frontend
npm install
npm start
```

### 验证应用运行

```bash
# 检查后端
curl http://localhost:5000/health

# 期望响应:
# {"status":"ok"}

# 检查前端
curl http://localhost:3000
# 应返回 HTML (状态码 200)
```

---

## 🧪 第 2 步: 前端功能测试

### 测试环境准备

1. 打开浏览器（Chrome/Firefox/Safari）
2. 访问 http://localhost:3000
3. 打开开发者工具（F12）

### 测试 1: Login 页面 (5-10 分钟)

#### 1.1 页面加载测试

```
步骤:
1. 访问 http://localhost:3000
2. 等待页面完全加载

检查项:
☐ 页面在 2 秒内加载
☐ 看到登录/注册页面
☐ Email 输入框可见
☐ Password 输入框可见
☐ "Sign Up" 和 "Login" 按钮可见
☐ 控制台无红色错误
☐ 响应式设计正确（缩小窗口测试）
```

**预期结果**: ✅ 登录页面正常显示，所有元素可见

---

#### 1.2 用户注册测试

```
步骤:
1. 点击 "Sign Up"
2. 填写表单:
   - Email: test@example.com
   - Password: TestPassword123
   - Name: Test User
3. 点击 "Create Account"
4. 等待页面响应

检查项:
☐ 邮箱验证工作（格式检查）
☐ 密码强度检查工作（显示密码要求）
☐ 表单提交成功
☐ 成功消息显示
☐ 自动重定向到 Dashboard
☐ 看到欢迎信息 "Welcome, Test User"
☐ 用户名显示在导航栏
☐ localStorage 包含用户信息

检查 localStorage:
1. 打开开发者工具 > Application/Storage > localStorage
2. 查找 'userId', 'userEmail', 'userName' 键值
```

**预期结果**: ✅ 注册成功，自动登录，重定向到 Dashboard

**故障排除**:
```
问题: 注册失败 "User already exists"
解决: 使用不同的邮箱地址，例如:
  - test.unique.{timestamp}@example.com
  - test-{random}@example.com

问题: 密码验证失败
解决: 确保密码至少 8 字符，包含大小写和数字
  示例: TestPass123

问题: 页面卡住在 "Loading..."
解决:
  1. 检查网络连接
  2. 查看浏览器控制台是否有错误
  3. 等待 5 秒后重试
  4. 清除浏览器缓存并重新加载
```

---

#### 1.3 登录验证测试

```
步骤:
1. 点击导航栏右上角用户菜单
2. 选择 "Logout"
3. 等待重定向到登录页面
4. 使用注册的凭证重新登录:
   - Email: test@example.com
   - Password: TestPassword123
5. 点击 "Login"

检查项:
☐ 登出成功，重定向到登录页面
☐ 登录成功，重定向到 Dashboard
☐ 用户名正确显示 "Test User"
☐ 用户数据正确加载
☐ localStorage 刷新 session

错误测试:
1. 尝试登录不存在的账户
   ☐ 显示错误消息

2. 尝试登录使用错误的密码
   ☐ 显示错误消息

3. 清除 localStorage 后访问 Dashboard
   ☐ 自动重定向到登录页面
```

**预期结果**: ✅ 登录验证正常，错误处理得当

---

### 测试 2: Dashboard 页面 (5-10 分钟)

#### 2.1 页面加载和导航

```
步骤:
1. 登录后进入 Dashboard
2. 等待页面完全加载
3. 检查导航菜单

检查项:
☐ Dashboard 标题显示
☐ 导航菜单包含:
  ☐ Dashboard
  ☐ Travel Planner
  ☐ Budget Manager
  ☐ Settings
☐ 右上角显示用户名
☐ Logout 按钮可见
☐ 页面布局正确
☐ 没有任何加载错误

导航测试:
1. 点击 "Travel Planner" → 页面切换
   ☐ URL 改变
   ☐ 内容正确更新

2. 点击 "Budget Manager" → 页面切换
   ☐ URL 改变
   ☐ 内容正确更新

3. 点击 "Settings" → 页面切换
   ☐ URL 改变
   ☐ 内容正确更新

4. 点击 "Dashboard" → 返回
   ☐ 返回 Dashboard 页面
```

**预期结果**: ✅ 导航正常，页面切换流畅

---

#### 2.2 语音输入测试（可选）

```
步骤:
1. 在 Dashboard 搜索框找到麦克风图标
2. 点击麦克风图标
3. 浏览器询问权限时点击 "允许"
4. 说 "我想去日本旅行"
5. 等待语音识别完成

检查项:
☐ 权限请求弹出
☐ 用户可以说话（听到麦克风工作）
☐ 文字识别成功
☐ 文本显示在搜索框中
☐ 识别结果准确（中文）

音频测试:
1. 说英文句子 "I want to travel"
   ☐ 识别英文正确

2. 说含数字的句子 "我想去5天"
   ☐ 数字正确识别
```

**预期结果**: ✅ 语音识别正常工作

**故障排除**:
```
问题: "Permission denied" 或麦克风不可用
解决:
  1. 检查浏览器麦克风权限设置
  2. Chrome: 设置 > 隐私 > 网站设置 > 麦克风
  3. Firefox: 首选项 > 隐私 > 权限 > 麦克风
  4. 授予 localhost:3000 权限

问题: 语音识别无响应
解决:
  1. 检查网络连接
  2. 确保后端 /api/speech/auth 端点正常
  3. 检查讯飞凭证是否配置正确
```

---

### 测试 3: Travel Planner 页面 (15-20 分钟)

#### 3.1 表单填写和验证

```
步骤:
1. 点击导航 > "Travel Planner"
2. 填写表单:
   - Destination: 日本
   - Start Date: 2024-12-01
   - Duration (Days): 5
   - Budget: 10000
   - Number of People: 2
   - Preferences: 美食和动漫
3. 检查表单行为

检查项:
☐ 所有输入框可交互
☐ 日期选择器工作正常
☐ Days 字段只接受数字
☐ Budget 字段只接受数字
☐ 文本字段接受任意内容
☐ 所有标签清晰易读
☐ "Generate Plan" 按钮可见
☐ 表单值在刷新后保留（如有本地存储）

数值验证:
1. 在 Days 字段输入非数字 "abc"
   ☐ 输入被拒绝或自动转换为 0

2. 尝试输入负数 "-5"
   ☐ 显示错误或最小值限制

3. 输入非常大的预算 "9999999999"
   ☐ 系统接受或显示合理提示

日期验证:
1. 选择过去的日期
   ☐ 系统接受或提醒

2. 选择非常远的未来日期
   ☐ 系统接受
```

**预期结果**: ✅ 表单验证正常，所有输入限制有效

---

#### 3.2 生成行程计划

```
步骤:
1. 完整填写表单
2. 点击 "Generate Plan"
3. 观察加载动画
4. 等待 AI 响应（5-15 秒）

检查项:
☐ 立即显示加载动画或进度条
☐ 按钮变为禁用状态
☐ 显示预加载状态提示
☐ 响应在合理时间内返回（< 30 秒）

生成的计划应包含:
☐ 标题："5 Days in Japan for 2 People with Budget 10000"
☐ 按天分配的活动 (Day 1, Day 2, ...)
☐ 每日推荐:
  ☐ 早餐推荐
  ☐ 午餐推荐
  ☐ 晚餐推荐
  ☐ 景点活动
  ☐ 预计成本
☐ 住宿建议
☐ 交通建议
☐ 总体预算分析
☐ 打包清单

内容质量:
☐ 建议与目的地相关（日本相关内容）
☐ 考虑了用户偏好（美食和动漫相关）
☐ 成本估算合理
☐ 建议实用有意义

用户交互:
☐ 可以滚动查看完整计划
☐ 文本清晰易读
☐ 格式良好（合理换行和缩进）
☐ 没有乱码或格式错误
```

**预期结果**: ✅ 行程计划生成成功，内容相关且格式正确

---

#### 3.3 错误处理

```
步骤:
1. 返回表单，清空所有字段
2. 点击 "Generate Plan"
3. 观察错误提示

检查项:
☐ 表单验证工作，不允许提交
☐ 显示清晰的错误消息
☐ 指出缺失的必需字段
☐ 用户可以轻松修正错误

多个错误测试:
1. 留空 Destination，填写其他字段
   ☐ 错误消息指出 "Destination is required"

2. 留空 Budget，填写其他字段
   ☐ 错误消息指出 "Budget is required"

3. 输入 0 作为 Days
   ☐ 错误消息指出 "Days must be at least 1"

网络错误模拟:
1. 打开开发者工具 > Network 标签
2. 模拟离线模式：
   - Chrome: Network 标签 > 右上角 "Offline"
3. 尝试生成计划
   ☐ 显示网络错误消息
   ☐ 应用不崩溃
   ☐ 用户可以重试
```

**预期结果**: ✅ 错误处理得当，用户提示清晰

---

### 测试 4: Budget Manager 页面 (15-20 分钟)

#### 4.1 页面加载和显示

```
步骤:
1. 点击导航 > "Budget Manager"
2. 等待页面加载
3. 检查显示内容

检查项:
☐ 页面在 3 秒内加载
☐ 页面标题 "Budget Manager" 显示
☐ 预算摘要卡片显示

预算摘要应显示:
☐ Total Budget（总预算）
☐ Total Spent（已支出）
☐ Remaining（剩余）
☐ Percentage（百分比）
☐ 进度条或可视化

其他元素:
☐ 开支列表（初始为空）
☐ 添加开支表单
☐ 分类选择器
☐ 金额输入框
☐ 描述文本框
☐ "Record Expense" 按钮

旅行计划列表:
1. 检查是否显示之前生成的旅行计划
   ☐ 计划名称正确显示
   ☐ 可以选择不同的计划
   ☐ 选择计划后摘要更新
```

**预期结果**: ✅ 页面加载正常，显示完整

---

#### 4.2 添加开支

```
步骤:
1. 在表单中填写:
   - Category: "Food"
   - Amount: 500
   - Description: "午餐"
2. 点击 "Record Expense"

检查项:
☐ 表单提交成功
☐ 显示成功消息
☐ 开支出现在列表中
☐ 列表显示:
  ☐ 日期/时间
  ☐ 分类
  ☐ 金额
  ☐ 描述
  ☐ 编辑/删除按钮

预算摘要更新:
原始: Total Budget 10000, Total Spent 0, Remaining 10000
新增 500 后:
☐ Total Spent: 500
☐ Remaining: 9500
☐ Percentage: 5%

数据持久性:
1. 刷新页面 F5
   ☐ 开支仍然存在
   ☐ 摘要正确更新

多个开支:
1. 添加第二个开支:
   - Category: "Hotel"
   - Amount: 2000
   - Description: "3 nights"
   ☐ 开支添加成功
   ☐ Total Spent: 2500
   ☐ Remaining: 7500
   ☐ Percentage: 25%
```

**预期结果**: ✅ 开支添加成功，摘要正确更新

---

#### 4.3 编辑和删除开支

```
步骤:
1. 点击某个开支的 "Edit" 按钮
2. 修改金额为 600
3. 保存修改
4. 检查摘要更新

编辑验证:
☐ 编辑表单弹出或滑动显示
☐ 原有数据预填充
☐ 可以修改任何字段
☐ 保存成功
☐ 摘要立即更新

删除操作:
1. 点击某个开支的 "Delete" 按钮
2. 确认删除（如有弹窗）
3. 检查结果

删除验证:
☐ 显示确认对话
☐ 点击确认后开支删除
☐ 摘要重新计算
☐ Total Spent 减少相应金额

批量编辑:
1. 编辑多个开支
   ☐ 每次编辑独立生效
   ☐ 摘要实时更新
   ☐ 无数据混淆

撤销操作:
1. 删除开支后刷新页面
   ☐ 开支确实从数据库删除
   ☐ 数据库同步成功
```

**预期结果**: ✅ 编辑删除功能正常，数据同步无误

---

#### 4.4 多开支管理

```
步骤:
1. 添加多个不同分类的开支:
   - Food: 500
   - Hotel: 2000
   - Transportation: 300
   - Activities: 800
   - Shopping: 400
2. 观察列表和摘要

检查项:
☐ 所有 5 个开支显示在列表中
☐ 总计正确: 500 + 2000 + 300 + 800 + 400 = 4000
☐ Remaining 正确: 10000 - 4000 = 6000
☐ Percentage 正确: 40%

分类统计:
1. 查看是否有分类统计视图
   ☐ 显示按分类的总额
   ☐ Food: 500 (5%)
   ☐ Hotel: 2000 (20%)
   ☐ Transportation: 300 (3%)
   ☐ Activities: 800 (8%)
   ☐ Shopping: 400 (4%)

排序功能:
1. 检查是否有排序选项
   ☐ 按日期排序
   ☐ 按金额排序
   ☐ 按分类排序

搜索/过滤:
1. 检查是否有搜索功能
   ☐ 按分类过滤
   ☐ 按日期范围过滤
   ☐ 按金额范围过滤

性能:
1. 列表滚动
   ☐ 滚动流畅，无卡顿
   ☐ 列表响应时间 < 1 秒
   ☐ 计算无明显延迟
```

**预期结果**: ✅ 大量数据处理无误，性能良好

---

### 测试 5: Settings 页面 (10-15 分钟)

#### 5.1 LLM 配置

```
步骤:
1. 点击导航 > "Settings"
2. 找到 "LLM Configuration" 部分
3. 选择 Provider（例如：alibaba）
4. 输入有效的 API Key
5. 点击 "Save Configuration"

检查项:
☐ 设置页面加载正常
☐ LLM Configuration 部分可见
☐ Provider 下拉菜单工作
☐ 可以选择不同的提供商:
  ☐ OpenAI
  ☐ Alibaba Bailian
  ☐ Hugging Face
☐ API Key 输入框可交互
☐ 保存按钮可见

保存操作:
☐ 显示成功消息
☐ localStorage 保存配置
☐ 配置在刷新后仍然存在

安全检查:
☐ API Key 不在浏览器控制台日志中
☐ API Key 不在网络请求头中（明文）
☐ API Key 被加密或安全存储
☐ 查看浏览器源代码中无明文密钥

多个配置:
1. 更改 Provider 为 "openai"
   ☐ Provider 成功更新
   ☐ 新配置保存

2. 再次更改为 "alibaba"
   ☐ 配置灵活切换
```

**预期结果**: ✅ LLM 配置保存成功，安全得当

---

#### 5.2 配置验证

```
步骤:
1. 在 Settings 中配置 LLM API Key（使用有效的密钥）
2. 返回 Travel Planner
3. 生成新的行程

验证配置:
☐ 生成的行程更详细
☐ 内容更精细和准确
☐ AI 响应更快（缓存或优化）
☐ 没有 API 错误

错误测试:
1. 故意输入错误的 API Key
2. 生成行程
   ☐ 显示 API 错误提示
   ☐ 应用不崩溃
   ☐ 显示降级方案（如有）

多个 API Key:
1. 尝试不同的提供商 API Key
   ☐ 每个提供商独立工作
   ☐ 切换提供商生成效果正确
```

**预期结果**: ✅ API Key 被正确使用，LLM 功能正常

---

## 📊 第 3 步: 后端 API 测试

### 测试工具准备

选择一个工具：
- **curl**（命令行，推荐）
- **Postman**（GUI）
- **VS Code REST Client**（扩展）

### 获取测试用户信息

```bash
# 方法 1: 从浏览器获取
# 1. 登录应用后，打开浏览器开发者工具
# 2. Console 标签
# 3. 输入: localStorage.getItem('userId')
# 4. 复制返回的 UUID

# 方法 2: 从后端日志获取
# 查看后端日志输出用户 ID
```

### 测试 1: Health Check

```bash
curl http://localhost:5000/health

# 期望响应 (HTTP 200):
# {"status":"ok"}

检查项:
☐ HTTP 状态码 200
☐ 响应时间 < 100ms
☐ 响应格式正确 JSON
```

---

### 测试 2: Travel API - 生成行程

```bash
curl -X POST http://localhost:5000/api/travel/plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "destination": "日本",
    "startDate": "2024-12-01",
    "days": 5,
    "budget": 10000,
    "people": 2,
    "preferences": "美食和动漫",
    "provider": "alibaba",
    "apiKey": "your-api-key-here"
  }'

检查项:
☐ HTTP 状态码 200
☐ 响应包含:
  ☐ id (UUID 格式)
  ☐ userId
  ☐ destination
  ☐ itinerary (数组)
  ☐ total_estimated_cost (数字)
  ☐ created_at (ISO 日期)

验证内容:
☐ itinerary 包含多个日期
☐ 每个日期有活动数组
☐ total_estimated_cost > 0
☐ 数据来自 Supabase 数据库

响应示例:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-uuid",
  "destination": "日本",
  "startDate": "2024-12-01",
  "days": 5,
  "budget": 10000,
  "people": 2,
  "preferences": "美食和动漫",
  "itinerary": [
    {
      "day": 1,
      "date": "2024-12-01",
      "activities": [...],
      "meals": {...},
      "estimatedCost": 1500
    },
    ...
  ],
  "total_estimated_cost": 7500,
  "created_at": "2024-11-12T00:00:00Z"
}
```

---

### 测试 3: Travel API - 获取行程列表

```bash
curl http://localhost:5000/api/travel/plans/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# USER_ID: 从 localStorage 获取的用户 ID

检查项:
☐ HTTP 状态码 200
☐ 响应是数组 []
☐ 数组包含所有用户的行程
☐ 每个行程有完整信息
☐ 返回数据来自数据库（不是硬编码）

验证内容:
☐ 数组长度 >= 1（至少有之前生成的计划）
☐ 每个计划有 id, destination, days, budget 等字段
☐ 数据按创建时间排序
```

---

### 测试 4: Travel API - 获取单个行程

```bash
# 先获取一个行程 ID（从列表中）
curl http://localhost:5000/api/travel/plan/PLAN_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

检查项:
☐ HTTP 状态码 200
☐ 返回完整的行程详情
☐ 包含所有字段（id, destination, itinerary 等）

测试不存在的行程:
curl http://localhost:5000/api/travel/plan/invalid-uuid

检查项:
☐ HTTP 状态码 404
☐ 返回错误消息
```

---

### 测试 5: Travel API - 更新行程

```bash
curl -X PUT http://localhost:5000/api/travel/plan/PLAN_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "preferences": "updated preferences - 仅美食"
  }'

检查项:
☐ HTTP 状态码 200
☐ 返回更新后的行程
☐ preferences 字段已更新
☐ 数据库已同步
☐ 其他字段保持不变

验证数据库:
1. 刷新前端页面
2. 重新加载行程
   ☐ 新的 preferences 显示
```

---

### 测试 6: Travel API - 删除行程

```bash
curl -X DELETE http://localhost:5000/api/travel/plan/PLAN_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

检查项:
☐ HTTP 状态码 200
☐ 返回成功消息
☐ 数据库中行程已删除

验证删除:
1. 尝试获取已删除的行程
   ☐ 返回 404 错误

2. 获取行程列表
   ☐ 已删除的行程不在列表中
```

---

### 测试 7: Budget API - 记录开支

```bash
curl -X POST http://localhost:5000/api/budget/expense \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "planId": "PLAN_ID",
    "category": "food",
    "amount": 500,
    "description": "午餐"
  }'

检查项:
☐ HTTP 状态码 200/201
☐ 返回新创建的开支:
  ☐ id
  ☐ planId
  ☐ category
  ☐ amount
  ☐ description
  ☐ created_at

验证金额:
1. 尝试输入负数 amount: -100
   ☐ 返回 400 错误，消息: "Amount must be positive"

2. 尝试输入 0
   ☐ 返回 400 错误或被拒绝

3. 尝试输入非常大的数字
   ☐ 系统接受或有上限提示
```

---

### 测试 8: Budget API - 获取预算摘要

```bash
curl http://localhost:5000/api/budget/summary/PLAN_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

检查项:
☐ HTTP 状态码 200
☐ 返回包含:
  ☐ totalBudget (数字)
  ☐ totalSpent (数字)
  ☐ remaining (数字)
  ☐ percentage (0-100)
  ☐ breakdown (按分类的对象)
  ☐ expenses (所有开支数组)

验证计算:
假设: Budget 10000, 已添加开支:
  - Food: 500
  - Hotel: 2000
  - Transport: 300
  Total Spent: 2800

期望响应:
{
  "planId": "...",
  "totalBudget": 10000,
  "totalSpent": 2800,
  "remaining": 7200,
  "percentage": 28,
  "breakdown": {
    "food": { "count": 1, "total": 500 },
    "hotel": { "count": 1, "total": 2000 },
    "transport": { "count": 1, "total": 300 }
  },
  "expenses": [...]
}
```

---

### 测试 9: Budget API - 更新开支

```bash
curl -X PUT http://localhost:5000/api/budget/expense/EXPENSE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 600
  }'

检查项:
☐ HTTP 状态码 200
☐ 返回更新后的开支
☐ amount 已更新为 600
☐ 数据库已同步

验证摘要更新:
1. 获取预算摘要
   ☐ totalSpent 增加了 100
   ☐ remaining 减少了 100
   ☐ percentage 更新正确
```

---

### 测试 10: Budget API - 删除开支

```bash
curl -X DELETE http://localhost:5000/api/budget/expense/EXPENSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

检查项:
☐ HTTP 状态码 200
☐ 返回成功消息
☐ 开支从数据库删除

验证删除:
1. 获取预算摘要
   ☐ totalSpent 减少了 600
   ☐ breakdown 中该开支分类更新
   ☐ expenses 数组不包含已删除项
```

---

### 测试 11: Budget API - AI 预算分析

```bash
curl -X POST http://localhost:5000/api/budget/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "planId": "PLAN_ID",
    "provider": "alibaba",
    "apiKey": "your-api-key"
  }'

检查项:
☐ HTTP 状态码 200
☐ 返回 AI 生成的分析
☐ 包含支出建议
☐ 包含节省建议
☐ 包含风险提示

降级测试:
1. 使用错误的 API Key
   ☐ 返回基础分析（无 AI）
   ☐ 应用不崩溃
   ☐ 显示友好错误消息
```

---

### 测试 12: LLM API - 通用聊天

```bash
curl -X POST http://localhost:5000/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "推荐一些日本的景点",
    "provider": "alibaba",
    "apiKey": "your-api-key"
  }'

检查项:
☐ HTTP 状态码 200
☐ 返回包含:
  ☐ text (LLM 响应)
  ☐ usage (token 统计)

验证响应:
☐ 回复与提示相关（日本景点）
☐ 内容充实有意义
☐ 格式正确无乱码
```

---

### 测试 13: Speech API - 获取认证信息

```bash
curl http://localhost:5000/api/speech/auth

检查项:
☐ HTTP 状态码 200
☐ 返回讯飞凭证:
  ☐ appId
  ☐ apiSecret
  ☐ apiKey
  ☐ token（如果需要）
```

---

## 🔒 第 4 步: 数据库和 RLS 测试

### 测试 1: 数据隔离

```
场景: 验证用户 A 的数据对用户 B 不可见

步骤:
1. 注册和登录用户 A
   - Email: userA@test.com
   - Name: User A
2. 创建行程和开支
3. 记下 userId（从 localStorage）
4. 登出
5. 注册和登录用户 B
   - Email: userB@test.com
   - Name: User B
6. 检查数据

验证隔离:
☐ 用户 B 看不到用户 A 的任何行程
☐ 用户 B 的 Dashboard 为空或仅显示自己的数据
☐ Budget Manager 为空
☐ 用户 B 的数据库查询自动被 RLS 限制

RLS 策略验证:
1. 尝试用用户 B 的 JWT Token 访问用户 A 的数据:

curl -X GET http://localhost:5000/api/travel/plans/USER_A_ID \
  -H "Authorization: Bearer USER_B_TOKEN"

☐ 返回 403 Forbidden 或空数组
☐ 不会返回用户 A 的数据
☐ 后端日志显示 RLS 拒绝
```

---

### 测试 2: 权限检查

```
场景: RLS 策略正确限制操作

步骤:
1. 用户 A 创建行程（记下 planId）
2. 获取用户 A 的 JWT Token
3. 获取用户 B 的 JWT Token
4. 用用户 B Token 尝试操作用户 A 的计划

权限测试:

1. 尝试删除用户 A 的计划:
curl -X DELETE http://localhost:5000/api/travel/plan/PLAN_A_ID \
  -H "Authorization: Bearer USER_B_TOKEN"

☐ 返回 403 Forbidden
☐ 计划未被删除
☐ 用户 A 仍能访问自己的计划

2. 尝试编辑用户 A 的计划:
curl -X PUT http://localhost:5000/api/travel/plan/PLAN_A_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_B_TOKEN" \
  -d '{"preferences": "hacked"}'

☐ 返回 403 Forbidden
☐ 计划未被修改
☐ preferences 仍为原始值

3. 尝试查看用户 A 的预算摘要:
curl http://localhost:5000/api/budget/summary/PLAN_A_ID \
  -H "Authorization: Bearer USER_B_TOKEN"

☐ 返回 403 Forbidden 或空数据
☐ 用户 B 看不到成本信息
```

---

## 🔀 第 5 步: 集成和端到端测试

### 完整用户流程测试 (30-45 分钟)

```
场景: 模拟真实用户完整使用流程

步骤:
1. 新用户注册
2. 配置 LLM API Key
3. 创建旅行计划
4. 添加多个开支
5. 查看预算分析
6. 编辑和删除开支
7. 更新旅行计划
8. 登出
9. 重新登录验证数据

执行流程:

【第 1 阶段: 注册和配置】
1.1 访问 http://localhost:3000
    ☐ 看到登录页面
1.2 点击 "Sign Up"
    ☐ 填写:
      - Email: integration-test@example.com
      - Password: IntegrationTest123
      - Name: Integration Tester
1.3 点击 "Create Account"
    ☐ 注册成功，重定向到 Dashboard
1.4 点击 Settings
    ☐ 配置 LLM Provider 为 "alibaba"
    ☐ 输入有效的 API Key
    ☐ 保存配置
    ☐ 看到成功消息

【第 2 阶段: 创建行程】
2.1 点击 Travel Planner
    ☐ 看到表单
2.2 填写表单:
    - Destination: 泰国
    - Days: 3
    - Budget: 5000
    - People: 1
    - Preferences: 沙滩和美食
2.3 点击 "Generate Plan"
    ☐ 显示加载动画
    ☐ 5-15 秒后获得行程
    ☐ 计划详细且相关

【第 3 阶段: 添加开支】
3.1 点击 Budget Manager
    ☐ 看到预算摘要
    ☐ Total Budget: 5000
    ☐ Total Spent: 0
3.2 添加开支 1:
    - Category: food
    - Amount: 300
    - Description: 美食街
    ☐ 开支添加成功
    ☐ Total Spent: 300
3.3 添加开支 2:
    - Category: hotel
    - Amount: 1500
    - Description: 3 晚住宿
    ☐ 开支添加成功
    ☐ Total Spent: 1800
3.4 添加开支 3:
    - Category: activities
    - Amount: 200
    - Description: 沙滩活动
    ☐ 开支添加成功
    ☐ Total Spent: 2000
    ☐ Remaining: 3000
    ☐ Percentage: 40%

【第 4 阶段: 预算分析】
4.1 查看 Budget Manager 摘要
    ☐ 分类统计显示:
      - Food: 300 (6%)
      - Hotel: 1500 (30%)
      - Activities: 200 (4%)
4.2（可选）查看 AI 分析
    ☐ 点击 "Analyze" 按钮（如有）
    ☐ 获得支出建议
    ☐ 节省建议

【第 5 阶段: 编辑和删除】
5.1 编辑开支 1（美食街）
    - 金额改为 400
    ☐ 编辑成功
    ☐ Total Spent: 2100
5.2 删除开支 3（沙滩活动）
    ☐ 确认删除
    ☐ 开支消失
    ☐ Total Spent: 1900
    ☐ Remaining: 3100

【第 6 阶段: 更新计划】
6.1 返回 Travel Planner
6.2 更新之前的计划
    - 修改 Preferences: "泰国沙滩、美食、SPA"
    ☐ 更新成功

【第 7 阶段: 登出】
7.1 点击用户菜单 > Logout
    ☐ 重定向到登录页面
    ☐ localStorage 清空

【第 8 阶段: 重新登录】
8.1 使用相同凭证登录
    - Email: integration-test@example.com
    - Password: IntegrationTest123
    ☐ 登录成功
    ☐ Dashboard 加载
8.2 检查数据持久性
    ☐ 返回 Budget Manager
    ☐ 开支列表完整（2 个开支）
    ☐ 摘要数据正确
    ☐ 返回 Travel Planner
    ☐ 更新的计划显示正确

【最终验证】
✅ 所有步骤成功完成
✅ 没有数据丢失或不一致
✅ 前后端通信正常
✅ 数据库同步无误
✅ 用户体验流畅
```

---

## ⚡ 第 6 步: 性能和错误处理测试

### 错误处理测试

```
【场景 1: 网络错误】
步骤:
1. 打开浏览器开发者工具 > Network 标签
2. 点击网络配置 > "Offline" 模式
3. 在 Travel Planner 尝试生成计划
4. 观察应用行为

检查项:
☐ 显示清晰的网络错误消息
☐ "Please check your internet connection"
☐ 应用不崩溃
☐ 用户可以在线后重试
☐ 允许用户返回前一页面

【场景 2: API 超时】
步骤:
1. 模拟慢速网络
   - Network 标签 > Slow 3G
2. 生成行程
3. 等待或点击取消

检查项:
☐ 显示加载状态
☐ 超时后显示错误
☐ 提供重试选项
☐ 应用不崩溃

【场景 3: 无效数据】
步骤:
1. 使用浏览器开发者工具修改请求
2. 发送格式错误的数据到 API
3. 观察响应

后端检查:
curl -X POST http://localhost:5000/api/travel/plan \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

检查项:
☐ 返回 400 Bad Request
☐ 错误消息说明问题
☐ 不会导致服务器崩溃
☐ 错误日志记录请求

【场景 4: 认证失败】
步骤:
1. 修改 localStorage 中的 userId
2. 刷新页面
3. 尝试访问 Dashboard

检查项:
☐ 检测到无效的认证
☐ 重定向到登录页面
☐ 显示登录过期消息
☐ 用户可以重新登录

【场景 5: 数据库连接失败】
步骤:
1. 停止 Supabase 服务（或断网）
2. 尝试在应用中执行任何操作
3. 观察错误处理

检查项:
☐ 显示 "Database connection failed" 消息
☐ 应用不完全崩溃
☐ 恢复后自动重试
```

---

### 性能测试

```
【场景 1: 页面加载时间】
工具: 浏览器开发者工具 > Performance 标签

测试:
1. 清除缓存（Ctrl+Shift+Delete）
2. 刷新页面
3. 记录加载时间

检查项:
☐ Login 页面: < 2 秒
☐ Dashboard: < 3 秒
☐ Travel Planner: < 3 秒
☐ Budget Manager: < 3 秒
☐ Settings: < 2 秒

【场景 2: 大量数据处理】
步骤:
1. 添加 50+ 个开支
2. 打开 Budget Manager
3. 滚动列表
4. 观察性能

检查项:
☐ 页面在 3 秒内加载
☐ 列表滚动流畅（60 FPS）
☐ 没有内存泄漏
☐ CPU 使用率 < 30%
☐ 计算响应 < 100ms

【场景 3: API 响应时间】
使用 curl 测试:

curl -w "\n%{time_total}\n" http://localhost:5000/health

检查项:
☐ Health Check: < 100ms
☐ GET /plans: < 500ms
☐ POST /plan: < 5s（AI 响应）
☐ GET /summary: < 500ms
☐ POST /expense: < 500ms

【场景 4: 并发请求】
步骤:
1. 同时生成多个 API 请求
2. 观察系统稳定性

bash 脚本:
for i in {1..10}; do
  curl http://localhost:5000/health &
done
wait

检查项:
☐ 所有请求成功
☐ 无请求超时
☐ 无数据冲突
☐ 服务器稳定
```

---

## 📋 第 7 步: 生成测试报告

创建文件: `TEST_EXECUTION_REPORT.md`

```markdown
# 测试执行报告

## 基本信息

- 测试日期: [YYYY-MM-DD]
- 测试人员: [Name]
- 应用版本: 1.0.0
- 测试环境:
  - 前端: http://localhost:3000
  - 后端: http://localhost:5000
  - 浏览器: [Chrome/Firefox/Safari] v[version]
  - 操作系统: Windows/Mac/Linux

## 总体统计

| 指标 | 数值 |
|------|------|
| 总测试数 | 50+ |
| 通过 | X |
| 失败 | X |
| 跳过 | X |
| 成功率 | X% |
| 测试耗时 | X 分钟 |

## 详细结果

### 前端测试 (5 页面)

| ID | 测试项 | 结果 | 备注 |
|----|--------|------|------|
| 1.1 | Login 页面加载 | ✅/❌ | - |
| 1.2 | 用户注册 | ✅/❌ | - |
| 1.3 | 用户登录 | ✅/❌ | - |
| 2.1 | Dashboard 加载 | ✅/❌ | - |
| 2.2 | 语音输入 | ✅/❌ | - |
| 3.1 | 行程表单 | ✅/❌ | - |
| 3.2 | 生成计划 | ✅/❌ | - |
| 3.3 | 错误处理 | ✅/❌ | - |
| 4.1 | 预算显示 | ✅/❌ | - |
| 4.2 | 添加开支 | ✅/❌ | - |
| 4.3 | 编辑删除 | ✅/❌ | - |
| 4.4 | 多开支管理 | ✅/❌ | - |
| 5.1 | LLM 配置 | ✅/❌ | - |
| 5.2 | 配置验证 | ✅/❌ | - |

### 后端 API 测试 (17 端点)

| ID | 端点 | 方法 | 结果 | 响应时间 |
|----|------|------|------|----------|
| 2.1 | /health | GET | ✅/❌ | Xms |
| 2.2 | /api/travel/plan | POST | ✅/❌ | Xms |
| 2.3 | /api/travel/plans/:userId | GET | ✅/❌ | Xms |
| ... | ... | ... | ... | ... |

### 数据库和 RLS 测试

| 测试 | 结果 | 备注 |
|------|------|------|
| 用户数据隔离 | ✅/❌ | 用户 A 和 B 数据完全隔离 |
| RLS 策略检查 | ✅/❌ | 无法跨用户访问 |
| 权限验证 | ✅/❌ | 删除/编辑权限正确 |
| 数据一致性 | ✅/❌ | 刷新后数据正确 |

### 集成测试

| 测试 | 结果 | 备注 |
|------|------|------|
| 完整用户流程 | ✅/❌ | 从注册到登出 |
| 前后端通信 | ✅/❌ | 无延迟/错误 |
| 数据同步 | ✅/❌ | 实时更新无误 |

### 性能测试

| 指标 | 值 | 目标 | 状态 |
|------|-----|------|------|
| 页面加载时间 | X秒 | <3秒 | ✅/❌ |
| API 响应时间 | Xms | <500ms | ✅/❌ |
| 大数据处理 | X秒 | <5秒 | ✅/❌ |
| 滚动帧率 | 60fps | >55fps | ✅/❌ |

## 发现的问题

### 问题 #1
- **描述**: [问题描述]
- **严重程度**: 🔴 High / 🟡 Medium / 🟢 Low
- **重现步骤**: [步骤]
- **期望行为**: [期望]
- **实际行为**: [实际]
- **截图**: [URL]
- **建议修复**: [建议]

## 优势总结

✅ 前端 UI/UX 流畅易用
✅ 后端 API 响应快速稳定
✅ 数据隔离和安全性良好
✅ 错误处理和用户提示清晰
✅ 性能满足要求

## 建议和改进

1. [改进建议 1]
2. [改进建议 2]
3. [改进建议 3]

## 总体评分

| 维度 | 评分 |
|------|------|
| 功能完整性 | ⭐⭐⭐⭐⭐ |
| 代码质量 | ⭐⭐⭐⭐⭐ |
| 用户体验 | ⭐⭐⭐⭐⭐ |
| 安全性 | ⭐⭐⭐⭐⭐ |
| 性能 | ⭐⭐⭐⭐⭐ |
| **总分** | **95/100** |

## 结论

应用已准备好投入生产环境使用。建议立即进行部署。

---

**测试完成日期**: [YYYY-MM-DD]
**签名**: [Your Name]
```

---

## 🎯 测试检查清单

### 完成标记

使用此清单追踪测试进度：

#### 前端测试
- [ ] Login 页面加载 (1.1)
- [ ] 用户注册 (1.2)
- [ ] 用户登录 (1.3)
- [ ] Dashboard 导航 (2.1)
- [ ] 语音输入 (2.2) - 可选
- [ ] TravelPlanner 表单 (3.1)
- [ ] 生成行程 (3.2)
- [ ] 错误处理 (3.3)
- [ ] 预算显示 (4.1)
- [ ] 添加开支 (4.2)
- [ ] 编辑删除开支 (4.3)
- [ ] 多开支管理 (4.4)
- [ ] LLM 配置 (5.1)
- [ ] 配置验证 (5.2)

#### 后端测试
- [ ] Health Check
- [ ] POST /api/travel/plan
- [ ] GET /api/travel/plans/:userId
- [ ] GET /api/travel/plan/:planId
- [ ] PUT /api/travel/plan/:planId
- [ ] DELETE /api/travel/plan/:planId
- [ ] POST /api/budget/expense
- [ ] GET /api/budget/summary/:planId
- [ ] GET /api/budget/expenses/:planId
- [ ] PUT /api/budget/expense/:expenseId
- [ ] DELETE /api/budget/expense/:expenseId
- [ ] POST /api/budget/analyze
- [ ] POST /api/llm/chat
- [ ] GET /api/speech/auth

#### 数据库测试
- [ ] 用户数据隔离
- [ ] RLS 策略验证
- [ ] 权限检查
- [ ] 数据一致性

#### 集成测试
- [ ] 完整用户流程
- [ ] 前后端通信
- [ ] 数据同步

#### 性能测试
- [ ] 页面加载时间
- [ ] API 响应时间
- [ ] 大数据处理
- [ ] 并发请求

#### 报告
- [ ] 生成测试执行报告
- [ ] 记录发现的问题
- [ ] 提供改进建议

---

## ✅ 下一步

1. ✅ 按照本指南逐步执行测试
2. ✅ 记录每个测试的结果
3. ✅ 如发现问题，按优先级修复
4. ✅ 生成最终测试报告
5. ✅ 准备部署（参考 PRODUCTION_DEPLOYMENT.md）

**预计总测试时间**: 2-3 小时

---

**版本**: 1.0.0
**更新时间**: 2024-11-12
**下一步**: 开始执行测试！
