# Supabase 数据库初始化指南

## 步骤 1: 访问 Supabase Dashboard

1. 访问: https://app.supabase.com
2. 登录你的账号
3. 选择项目 (URL: iwtqkpxiyawxlufduxrw)

## 步骤 2: 进入 SQL 编辑器

1. 左侧菜单 → SQL Editor
2. 点击 "New Query"
3. 复制下面的 SQL 脚本并执行

---

## SQL 脚本 - 创建表和配置 RLS

```sql
-- ===== 1. 创建 travel_plans 表 =====
CREATE TABLE IF NOT EXISTS public.travel_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC NOT NULL,
  travelers INTEGER NOT NULL DEFAULT 1,
  preferences TEXT,
  itinerary JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== 2. 创建 expenses 表 =====
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES public.travel_plans(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===== 3. 创建索引以提高性能 =====
CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON public.travel_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_plans_created_at ON public.travel_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_plan_id ON public.expenses(plan_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date DESC);

-- ===== 4. 启用行级安全 (RLS) =====
ALTER TABLE public.travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- ===== 5. 创建 travel_plans RLS 策略 =====
-- 策略: 用户只能看自己的行程
DROP POLICY IF EXISTS "Users can view their own travel plans" ON public.travel_plans;
CREATE POLICY "Users can view their own travel plans"
  ON public.travel_plans
  FOR SELECT
  USING (auth.uid() = user_id);

-- 策略: 用户只能创建自己的行程
DROP POLICY IF EXISTS "Users can insert their own travel plans" ON public.travel_plans;
CREATE POLICY "Users can insert their own travel plans"
  ON public.travel_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 策略: 用户只能更新自己的行程
DROP POLICY IF EXISTS "Users can update their own travel plans" ON public.travel_plans;
CREATE POLICY "Users can update their own travel plans"
  ON public.travel_plans
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 策略: 用户只能删除自己的行程
DROP POLICY IF EXISTS "Users can delete their own travel plans" ON public.travel_plans;
CREATE POLICY "Users can delete their own travel plans"
  ON public.travel_plans
  FOR DELETE
  USING (auth.uid() = user_id);

-- ===== 6. 创建 expenses RLS 策略 =====
-- 策略: 用户只能看自己行程的开支
DROP POLICY IF EXISTS "Users can view expenses of their own plans" ON public.expenses;
CREATE POLICY "Users can view expenses of their own plans"
  ON public.expenses
  FOR SELECT
  USING (
    plan_id IN (
      SELECT id FROM public.travel_plans WHERE user_id = auth.uid()
    )
  );

-- 策略: 用户只能为自己的行程添加开支
DROP POLICY IF EXISTS "Users can insert expenses for their own plans" ON public.expenses;
CREATE POLICY "Users can insert expenses for their own plans"
  ON public.expenses
  FOR INSERT
  WITH CHECK (
    plan_id IN (
      SELECT id FROM public.travel_plans WHERE user_id = auth.uid()
    )
  );

-- 策略: 用户只能更新自己行程的开支
DROP POLICY IF EXISTS "Users can update expenses of their own plans" ON public.expenses;
CREATE POLICY "Users can update expenses of their own plans"
  ON public.expenses
  FOR UPDATE
  USING (
    plan_id IN (
      SELECT id FROM public.travel_plans WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    plan_id IN (
      SELECT id FROM public.travel_plans WHERE user_id = auth.uid()
    )
  );

-- 策略: 用户只能删除自己行程的开支
DROP POLICY IF EXISTS "Users can delete expenses of their own plans" ON public.expenses;
CREATE POLICY "Users can delete expenses of their own plans"
  ON public.expenses
  FOR DELETE
  USING (
    plan_id IN (
      SELECT id FROM public.travel_plans WHERE user_id = auth.uid()
    )
  );

-- ===== 7. 验证表结构 =====
-- 查看 travel_plans 表
\d travel_plans

-- 查看 expenses 表
\d expenses

-- 查看 RLS 策略
SELECT schemaname, tablename, policyname FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 步骤 3: 获取 API Keys

1. 进入 Settings > API
2. 找到 "Project API keys"
3. 复制以下两个 key：
   - **anon/public**: 用于前端 (.env.local 中的 REACT_APP_SUPABASE_ANON_KEY)
   - **service_role/secret**: 用于后端 (.env 中的 SUPABASE_KEY)

## 步骤 4: 更新 .env 文件

### 后端 (backend/.env)
```env
SUPABASE_URL=https://iwtqkpxiyawxlufduxrw.supabase.co
SUPABASE_KEY=<你的 service_role key>
```

### 前端 (frontend/.env.local)
```env
REACT_APP_SUPABASE_URL=https://iwtqkpxiyawxlufduxrw.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<你的 anon key>
```

---

## 步骤 5: 验证连接

### 测试后端连接

```bash
cd backend
npm install
npm run dev
```

访问 http://localhost:5000/health 应该返回 200 OK

### 测试前端连接

```bash
cd frontend
npm install
npm start
```

访问 http://localhost:3000，尝试注册新用户

---

## 常见问题

### Q1: "Missing Supabase credentials"
**原因**: .env 文件中缺少 SUPABASE_URL 或 SUPABASE_KEY
**解决**:
1. 确保后端目录有 .env 文件
2. 检查 URL 和 Key 是否正确
3. 重启后端服务

### Q2: "RLS violation"
**原因**: 用户尝试访问不属于他们的数据
**解决**:
1. 这是正常行为，RLS 策略在工作
2. 确保请求中包含正确的 user_id
3. 检查 RLS 策略是否正确配置

### Q3: "Auth state not synced"
**原因**: 前端和后端的认证状态不一致
**解决**:
1. 清除浏览器 localStorage
2. 重新登录
3. 检查 Supabase Auth 是否已启用

### Q4: "Can't connect to Supabase"
**原因**: 网络问题或凭证错误
**解决**:
1. 检查网络连接
2. 验证 SUPABASE_URL 是否可访问
3. 确认凭证有效期（在 Supabase 控制台检查）

---

## 测试表和策略

### 测试 SQL

在 Supabase SQL Editor 中运行以下查询测试：

```sql
-- 测试: 创建测试用户的行程
-- (需要先创建一个用户，使用 Supabase Auth)

-- 列出所有表
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- 查看 travel_plans 表的行数
SELECT COUNT(*) FROM public.travel_plans;

-- 查看 expenses 表的行数
SELECT COUNT(*) FROM public.expenses;

-- 查看所有 RLS 策略
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 下一步

1. ✅ 运行 SQL 脚本创建表和策略
2. ✅ 获取 API Keys 并更新 .env 文件
3. ✅ 启动前后端应用
4. ✅ 在 UI 中注册新用户
5. ✅ 测试生成行程计划
6. ✅ 测试预算管理功能

---

**创建日期**: 2024-11-12
**Supabase Project URL**: https://iwtqkpxiyawxlufduxrw.supabase.co
**相关文档**: 参考 DEPLOYMENT_GUIDE.md 和 TECHNICAL_REPORT.md
