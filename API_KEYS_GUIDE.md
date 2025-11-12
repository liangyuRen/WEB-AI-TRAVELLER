# 🔑 WEB-AI-TRAVELLER 完整密钥配置指南

## 概述
项目需要的 API Key 分为**必需**和**可选**两部分。

---

## 🔴 必需的密钥（必须配置）

### 1. Supabase 密钥 (必需 ✅)

**用途**: 用户认证和数据存储

**获取位置**: https://app.supabase.com > Settings > API

**需要的两个 Key**:

1. **SUPABASE_URL** ✅ (已配置)
   ```
   https://iwtqkpxiyawxlufduxrw.supabase.co
   ```

2. **SUPABASE_ANON_KEY** (需要获取)
   - 位置: Settings > API > Project API keys
   - 标签: "anon/public"
   - 用途: 前端认证
   - 放入: `frontend/.env.local`
   ```env
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. **SUPABASE_SERVICE_ROLE_KEY** (需要获取)
   - 位置: Settings > API > Project API keys
   - 标签: "service_role/secret"
   - ⚠️ 保密! 不要泄露
   - 用途: 后端数据库操作
   - 放入: `backend/.env`
   ```env
   SUPABASE_KEY=eyJhbGc...
   ```

---

## 🟡 可选密钥（根据功能需要）

### 2. LLM 密钥 (推荐配置)

**用途**: AI 生成旅行计划、预算分析

**可选择以下任意一个**:

#### 选项 A: 阿里百炼 (推荐)
- **获取地址**: https://bailian.aliyun.com/
- **步骤**:
  1. 注册阿里云账号
  2. 开通 DashScope 服务
  3. 创建 API Key
- **在应用中配置**:
  - 进入 http://localhost:3000/settings
  - Provider: `alibaba`
  - API Key: 你的 Key
  - 点击保存

#### 选项 B: OpenAI
- **获取地址**: https://platform.openai.com/api/keys
- **步骤**:
  1. 注册 OpenAI 账号
  2. 创建 API Key
  3. 确保账号有有效的付费方案
- **在应用中配置**:
  - 进入 http://localhost:3000/settings
  - Provider: `openai`
  - API Key: 你的 Key
  - 点击保存

#### 选项 C: 其他 LLM
- Claude API (来自 Anthropic)
- 讯飞大模型
- Google Gemini
- 其他支持的提供商

**配置方式**:
```
在应用 Settings 页面配置:
  - Provider 下拉菜单选择提供商
  - 输入相应的 API Key
  - 点击 "Save Configuration"
  - 系统会保存到 localStorage 和 Supabase
```

### 3. 讯飞语音识别 (可选)

**用途**: 语音输入识别

**获取地址**: https://console.xfyun.cn/

**需要的三个凭证**:
1. **APPID**
   ```
   应用管理 > 创建应用 > 获取 AppID
   ```

2. **API Key**
   ```
   应用详情 > API Key
   ```

3. **API Secret**
   ```
   应用详情 > API Secret
   ```

**放入文件**: `backend/.env`
```env
XUNFEI_APPID=your-appid
XUNFEI_API_KEY=your-api-key
XUNFEI_API_SECRET=your-api-secret
```

**注意**: 讯飞 API Secret 需要进行 Base64 编码

---

## 📋 配置清单

### 必需配置 (必须完成)
- [ ] **Supabase ANON KEY**
  - 位置: `frontend/.env.local` 中的 `REACT_APP_SUPABASE_ANON_KEY`
  - 来源: Supabase Settings > API > anon/public key

- [ ] **Supabase SERVICE ROLE KEY**
  - 位置: `backend/.env` 中的 `SUPABASE_KEY`
  - 来源: Supabase Settings > API > service_role key
  - ⚠️ 保密！不要提交到 Git

### 推荐配置 (强烈推荐)
- [ ] **LLM API Key** (选择一个)
  - [ ] 阿里百炼 (推荐): https://bailian.aliyun.com/
  - [ ] OpenAI: https://platform.openai.com/api/keys
  - [ ] 其他提供商
  - **配置方式**: 在应用 Settings 页面配置

### 可选配置
- [ ] **讯飞语音** (如需使用语音输入)
  - APPID, API Key, API Secret
  - 位置: `backend/.env`

---

## 🛠️ 分步骤获取 API Key

### 步骤 1: 获取 Supabase 密钥

```
1. 打开: https://app.supabase.com
2. 登录并选择你的项目
3. 左侧菜单 → Settings
4. 点击 "API" 标签
5. 在 "Project API keys" 部分找到:
   - anon/public (用于前端)
   - service_role (用于后端)
6. 分别复制粘贴到对应的 .env 文件
```

**文件更新**:

`backend/.env`:
```env
SUPABASE_URL=https://iwtqkpxiyawxlufduxrw.supabase.co
SUPABASE_KEY=<从 Settings > API 复制 service_role key>
```

`frontend/.env.local`:
```env
REACT_APP_SUPABASE_URL=https://iwtqkpxiyawxlufduxrw.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<从 Settings > API 复制 anon key>
```

### 步骤 2: 获取 LLM API Key (推荐)

#### 选项 A: 阿里百炼 (推荐 ✨)

```
1. 访问: https://bailian.aliyun.com/
2. 点击 "立即体验" 或 "控制台"
3. 登录/注册阿里云账号
4. 创建应用或 API Key
5. 复制 API Key
6. 进入应用 http://localhost:3000/settings
7. 在 "LLM Configuration" 部分:
   - Provider 选择: "alibaba"
   - API Key 粘贴
   - 点击 "Save Configuration"
```

#### 选项 B: OpenAI

```
1. 访问: https://platform.openai.com/api/keys
2. 登录 OpenAI 账号
3. 点击 "Create new secret key"
4. 复制 Key
5. 进入应用 http://localhost:3000/settings
6. 在 "LLM Configuration" 部分:
   - Provider 选择: "openai"
   - API Key 粘贴
   - 点击 "Save Configuration"
```

### 步骤 3: 获取讯飞语音 Key (可选)

```
1. 访问: https://console.xfyun.cn/
2. 登录/注册
3. 创建应用
4. 获取以下凭证:
   - APPID
   - API Key
   - API Secret
5. 打开 backend/.env，添加:
   XUNFEI_APPID=your-appid
   XUNFEI_API_KEY=your-api-key
   XUNFEI_API_SECRET=your-api-secret
```

---

## 📊 密钥配置总结表

| 密钥名称 | 用途 | 是否必需 | 获取渠道 | 配置位置 |
|---------|------|--------|---------|---------|
| SUPABASE_URL | 数据库连接 | ✅ 必需 | Supabase | backend/.env |
| SUPABASE_KEY | 后端 DB 操作 | ✅ 必需 | Supabase Settings > API | backend/.env |
| REACT_APP_SUPABASE_URL | 前端数据库 | ✅ 必需 | Supabase | frontend/.env.local |
| REACT_APP_SUPABASE_ANON_KEY | 前端认证 | ✅ 必需 | Supabase Settings > API | frontend/.env.local |
| LLM API Key | AI 功能 | 🟡 推荐 | 阿里百炼 / OpenAI | 应用 Settings |
| XUNFEI_APPID | 语音识别 | 🟢 可选 | 讯飞控制台 | backend/.env |
| XUNFEI_API_KEY | 语音识别 | 🟢 可选 | 讯飞控制台 | backend/.env |
| XUNFEI_API_SECRET | 语音识别 | 🟢 可选 | 讯飞控制台 | backend/.env |

---

## ⚠️ 安全注意事项

### 不要做的事

❌ **不要**在 Git 中提交 `.env` 文件
```bash
# .env 文件已经在 .gitignore 中
# 确保它不被 Git 追踪
```

❌ **不要**在代码中硬编码 API Key
```typescript
// 错误方式
const apiKey = "sk-xxx";

// 正确方式
const apiKey = process.env.LLM_API_KEY;
```

❌ **不要**在日志中输出敏感信息
```typescript
// 错误
console.log("API Key:", apiKey);

// 正确
console.log("API Key configured");
```

### 要做的事

✅ **要**使用环境变量管理密钥
```env
# .env 文件
SUPABASE_KEY=your-secret-key
```

✅ **要**定期轮换 API Key
```
1. 在提供商网站生成新 Key
2. 更新 .env 文件
3. 重启应用
4. 删除旧 Key
```

✅ **要**限制 API Key 权限
```
- 在 Supabase/OpenAI 控制台设置最小必需权限
- 为不同环境使用不同的 Key
- 为测试和生产分别创建 Key
```

---

## 🔄 环境变量流程

### 后端环境变量读取流程

```
backend/.env (本地文件)
    ↓
process.env.SUPABASE_KEY
    ↓
getSupabase() 函数
    ↓
createClient(url, key)
    ↓
Supabase 数据库连接
```

### 前端环境变量读取流程

```
frontend/.env.local (本地文件)
    ↓
process.env.REACT_APP_SUPABASE_ANON_KEY
    ↓
supabase.ts 服务
    ↓
Supabase 认证和数据库
```

### LLM Key 读取流程

```
Settings 页面 (用户输入)
    ↓
localStorage.setItem('apiKeys', {...})
    ↓
api.ts 请求拦截器
    ↓
自动添加到每个 LLM 请求
    ↓
后端 LLM 服务
```

---

## 🧪 验证配置是否正确

### 验证 1: 检查环境变量

```bash
# 后端
cd backend
node -e "require('dotenv').config(); console.log('SUPABASE_URL:', process.env.SUPABASE_URL);"

# 前端
cd frontend
echo $REACT_APP_SUPABASE_URL
```

### 验证 2: 测试 Supabase 连接

```bash
# 启动后端，访问
curl http://localhost:5000/health

# 输出应该是 200 OK
```

### 验证 3: 测试前端认证

```
1. 打开 http://localhost:3000
2. 尝试注册新账户
3. 应该能成功注册并重定向到 Dashboard
```

### 验证 4: 测试 LLM 功能

```
1. 在 Settings 页面配置 LLM API Key
2. 进入 TravelPlanner 页面
3. 填写信息并点击 "Generate Plan"
4. 应该能生成 AI 行程
```

---

## 🎯 最小配置（快速开始）

如果只想快速测试，最少需要：

1. ✅ Supabase ANON KEY
2. ✅ Supabase SERVICE ROLE KEY
3. 🟡 LLM API Key (推荐)

其他的都是可选的。

---

## 📝 配置文件模板

### backend/.env

```env
# Supabase (必需)
SUPABASE_URL=https://iwtqkpxiyawxlufduxrw.supabase.co
SUPABASE_KEY=<service_role_key>

# 服务器
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# 讯飞 (可选)
# XUNFEI_APPID=
# XUNFEI_API_KEY=
# XUNFEI_API_SECRET=
```

### frontend/.env.local

```env
# API
REACT_APP_API_URL=http://localhost:5000/api

# Supabase (必需)
REACT_APP_SUPABASE_URL=https://iwtqkpxiyawxlufduxrw.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<anon_key>
```

---

## ❓ 常见问题

### Q: 如果我暂时没有 LLM API Key 怎么办？

**A**: 没关系！你可以：
1. 先完成 Supabase 配置
2. 注册和登录功能可以正常使用
3. 生成行程时会返回基础模板（不调用 AI）
4. 后面配置了 API Key 再启用 AI 功能

### Q: 生产环境需要不同的 Key 吗？

**A**: 是的，建议：
1. 为开发环境创建一套 Key
2. 为生产环境创建另一套 Key
3. 这样可以确保隔离和安全

### Q: 如果 Key 泄露了怎么办？

**A**: 立即操作：
1. 进入提供商控制台 (Supabase/OpenAI)
2. 删除泄露的 Key
3. 创建新 Key
4. 更新 .env 文件
5. 重启应用

### Q: 能否通过 URL 参数传递 Key？

**A**: 不建议！因为：
- 不安全，会被记录在日志中
- 可能被浏览器历史记录保存
- 容易意外泄露
- 使用环境变量是正确做法

---

## 🚀 下一步

完成以下步骤：

1. ✅ 获取所有**必需** API Key
2. ✅ 更新 `.env` 文件
3. ✅ 启动应用测试
4. 🟡 (可选) 配置 LLM API Key

---

**版本**: 1.0.0
**更新时间**: 2024-11-12

