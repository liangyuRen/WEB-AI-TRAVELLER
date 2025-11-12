# 🧪 单元测试和优化指南

## 📋 本步骤目标

添加单元测试、集成测试以及性能优化，提高代码质量和应用性能。

---

## 第 1 部分: 前端单元测试

### 设置测试框架

```bash
# 前端已经有 Jest 和 React Testing Library
# 验证依赖
cd frontend
npm install --save-dev @testing-library/jest-dom

# 检查 package.json 是否有:
# - jest
# - @testing-library/react
# - @testing-library/jest-dom
```

### 测试文件结构

```
frontend/src/
├── components/
│   ├── Navigation.tsx
│   └── Navigation.test.tsx        # ✨ 添加测试
├── services/
│   ├── api.ts
│   ├── api.test.ts                # ✨ 添加测试
│   ├── supabase.ts
│   └── supabase.test.ts            # ✨ 添加测试
├── store/
│   ├── authStore.ts
│   └── authStore.test.ts           # ✨ 添加测试
└── pages/
    ├── Login.tsx
    └── Login.test.tsx              # ✨ 添加测试
```

### 测试示例 1: API 服务测试

**文件**: `frontend/src/services/api.test.ts`

```typescript
import { APIError, retryWithBackoff } from './api';

describe('API Service', () => {
  // 测试 APIError 类
  describe('APIError', () => {
    it('should create an error with message and status code', () => {
      const error = new APIError('Test error', 400);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('APIError');
    });
  });

  // 测试重试机制
  describe('retryWithBackoff', () => {
    it('should return result on first success', async () => {
      const fn = jest.fn().mockResolvedValueOnce('success');
      const result = await retryWithBackoff(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on transient error', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new APIError('Timeout', 408))
        .mockResolvedValueOnce('success');

      const result = await retryWithBackoff(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not retry on permanent error (4xx)', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new APIError('Unauthorized', 401));

      await expect(retryWithBackoff(fn)).rejects.toThrow(APIError);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should throw after max retries', async () => {
      const fn = jest.fn()
        .mockRejectedValue(new APIError('Server Error', 500));

      await expect(retryWithBackoff(fn)).rejects.toThrow();
      // 应该重试 3 次 + 原始失败 = 4 次总调用
      expect(fn).toHaveBeenCalledTimes(4);
    });
  });
});
```

### 测试示例 2: 认证状态存储测试

**文件**: `frontend/src/store/authStore.test.ts`

```typescript
import { useAuthStore } from './authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // 重置存储状态
    useAuthStore.setState({
      user: null,
      loading: false,
      error: null
    });
  });

  it('should initialize with null user', () => {
    const store = useAuthStore.getState();
    expect(store.user).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should set loading state during login', () => {
    const store = useAuthStore.getState();
    // 模拟登录过程
    useAuthStore.setState({ loading: true });

    expect(useAuthStore.getState().loading).toBe(true);
  });

  it('should store user data after successful login', async () => {
    const store = useAuthStore.getState();
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User'
    };

    useAuthStore.setState({
      user: mockUser,
      loading: false,
      error: null
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  it('should clear user on logout', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User'
    };

    useAuthStore.setState({ user: mockUser });
    expect(useAuthStore.getState().user).not.toBeNull();

    useAuthStore.setState({ user: null });
    expect(useAuthStore.getState().user).toBeNull();
  });
});
```

### 测试示例 3: 组件测试

**文件**: `frontend/src/pages/Login.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

describe('Login Page', () => {
  it('should render login form', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show error on invalid email', async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should show error on wrong password', async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrong');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/incorrect password/i)).toBeInTheDocument();
    });
  });

  it('should navigate to dashboard on successful login', async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'correctPassword123');
    fireEvent.click(submitButton);

    // 应该重定向到 dashboard
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
```

### 运行前端测试

```bash
cd frontend

# 运行所有测试
npm test

# 运行特定测试文件
npm test -- api.test.ts

# 生成覆盖率报告
npm test -- --coverage

# 监听模式（开发时使用）
npm test -- --watch
```

---

## 第 2 部分: 后端单元测试

### 设置测试框架

```bash
cd backend

# 安装测试依赖
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest

# 创建 jest.config.js
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
EOF

# 更新 package.json 的 scripts
# "test": "jest"
# "test:watch": "jest --watch"
# "test:coverage": "jest --coverage"
```

### 测试文件结构

```
backend/src/
├── routes/
│   ├── travel.ts
│   ├── travel.test.ts              # ✨ 添加测试
│   ├── budget.ts
│   └── budget.test.ts              # ✨ 添加测试
├── services/
│   ├── llm.ts
│   ├── llm.test.ts                 # ✨ 添加测试
│   └── supabase.ts
│       └── supabase.test.ts         # ✨ 添加测试
└── utils/
    ├── helpers.test.ts             # ✨ 添加测试
    └── errors.test.ts              # ✨ 添加测试
```

### 测试示例 1: 工具函数测试

**文件**: `backend/src/utils/helpers.test.ts`

```typescript
import {
  formatCurrency,
  calculateBudgetPercentage,
  generateUUID,
  validateEmail
} from './helpers';

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('¥1,000.00');
      expect(formatCurrency(1000000)).toBe('¥1,000,000.00');
      expect(formatCurrency(0.5)).toBe('¥0.50');
    });
  });

  describe('calculateBudgetPercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculateBudgetPercentage(500, 1000)).toBe(50);
      expect(calculateBudgetPercentage(250, 1000)).toBe(25);
      expect(calculateBudgetPercentage(0, 1000)).toBe(0);
    });

    it('should handle zero budget', () => {
      expect(calculateBudgetPercentage(100, 0)).toBe(0);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('generateUUID', () => {
    it('should generate valid UUID', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });
});
```

### 测试示例 2: API 路由测试

**文件**: `backend/src/routes/travel.test.ts`

```typescript
import request from 'supertest';
import app from '../index';

describe('Travel Routes', () => {
  describe('POST /api/travel/plan', () => {
    it('should generate travel plan with valid input', async () => {
      const response = await request(app)
        .post('/api/travel/plan')
        .send({
          destination: 'Japan',
          days: 5,
          budget: 10000,
          people: 2,
          preferences: 'Food',
          userId: 'test-user-id',
          provider: 'alibaba',
          apiKey: 'test-key'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('destination', 'Japan');
      expect(response.body.data).toHaveProperty('itinerary');
    });

    it('should return error on missing required fields', async () => {
      const response = await request(app)
        .post('/api/travel/plan')
        .send({
          destination: 'Japan'
          // 缺少其他必需字段
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return error on missing API key', async () => {
      const response = await request(app)
        .post('/api/travel/plan')
        .send({
          destination: 'Japan',
          days: 5,
          budget: 10000,
          people: 2,
          preferences: 'Food',
          userId: 'test-user-id'
          // 缺少 apiKey
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('API Key');
    });
  });

  describe('GET /api/travel/plans/:userId', () => {
    it('should return user plans', async () => {
      const response = await request(app)
        .get('/api/travel/plans/test-user-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return error on missing userId', async () => {
      const response = await request(app)
        .get('/api/travel/plans/');

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
```

### 运行后端测试

```bash
cd backend

# 运行所有测试
npm test

# 运行特定测试文件
npm test -- travel.test.ts

# 生成覆盖率报告
npm test -- --coverage

# 监听模式
npm test -- --watch
```

---

## 第 3 部分: 集成测试

### E2E 测试（端到端）

**文件**: `frontend/src/__tests__/e2e.test.ts`

```typescript
/**
 * E2E 测试: 完整用户流程
 * 从注册 → 登录 → 创建行程 → 管理预算
 */

describe('E2E: Complete User Journey', () => {
  it('should complete full user workflow', async () => {
    // 1. 访问应用
    // 2. 注册新用户
    // 3. 验证邮箱
    // 4. 登录
    // 5. 进入 Dashboard
    // 6. 配置 LLM API Key
    // 7. 生成旅行计划
    // 8. 添加开支
    // 9. 查看预算摘要
    // 10. 编辑开支
    // 11. 删除开支
    // 12. 登出
    // 13. 重新登录验证数据持久化
  });
});
```

### API 集成测试

**文件**: `backend/src/__tests__/integration.test.ts`

```typescript
/**
 * 集成测试: API 端点间的交互
 */

describe('API Integration Tests', () => {
  it('should complete travel planning workflow', async () => {
    // 1. 生成旅行计划
    // 2. 验证计划已保存到数据库
    // 3. 获取计划列表
    // 4. 更新计划
    // 5. 添加开支
    // 6. 获取预算摘要
    // 7. 分析预算（调用 LLM）
    // 8. 删除计划
  });
});
```

---

## 第 4 部分: 性能优化

### 前端优化

#### 优化 1: 代码分割

```typescript
// App.tsx - 使用动态导入
import { Suspense, lazy } from 'react';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TravelPlanner = lazy(() => import('./pages/TravelPlanner'));
const BudgetManager = lazy(() => import('./pages/BudgetManager'));
const Settings = lazy(() => import('./pages/Settings'));

// 使用 Suspense 包装
<Routes>
  <Route path="/login" element={
    <Suspense fallback={<Loading />}>
      <Login />
    </Suspense>
  } />
</Routes>
```

#### 优化 2: 记忆化组件

```typescript
import { memo } from 'react';

// 防止不必要的重新渲染
const BudgetSummary = memo(({ plan }) => {
  return (
    <div>
      <h3>{plan.destination}</h3>
      <p>Budget: ¥{plan.budget}</p>
    </div>
  );
});

export default BudgetSummary;
```

#### 优化 3: 缓存 API 响应

```typescript
// api.ts - 添加缓存
const cache = new Map();

export const cachedFetch = async (key: string, fn: () => Promise<any>) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const result = await fn();
  cache.set(key, result);

  // 5 分钟后过期
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);

  return result;
};
```

### 后端优化

#### 优化 1: 数据库查询优化

```typescript
// 使用索引（已在 SUPABASE_SETUP.md 中配置）
CREATE INDEX idx_travel_plans_user_id ON travel_plans(user_id);
CREATE INDEX idx_expenses_plan_id ON expenses(plan_id);

// 只查询需要的列
const { data } = await supabase
  .from('travel_plans')
  .select('id,destination,budget,created_at')
  .eq('user_id', userId);
```

#### 优化 2: 响应压缩

```typescript
// index.ts
import compression from 'compression';

app.use(compression());
```

#### 优化 3: API 速率限制

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 每个 IP 最多 100 个请求
});

app.use('/api/', limiter);
```

---

## 测试覆盖率目标

| 类型 | 目标 | 优先级 |
|------|------|--------|
| 单元测试 | > 80% | 🔴 必须 |
| 集成测试 | > 60% | 🔴 必须 |
| E2E 测试 | > 50% | 🟡 推荐 |
| 代码覆盖率 | > 75% | 🔴 必须 |

---

## 持续集成 (CI)

### GitHub Actions 配置

**文件**: `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: |
          cd frontend && npm install
          cd ../backend && npm install

      - name: Run tests
        run: |
          cd frontend && npm test
          cd ../backend && npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## 完整检查清单

### 前端测试
- [ ] API 服务测试
- [ ] 认证存储测试
- [ ] 组件测试（Login, Dashboard 等）
- [ ] 工具函数测试
- [ ] 生成覆盖率报告 (> 80%)

### 后端测试
- [ ] 工具函数测试
- [ ] 服务层测试 (Supabase, LLM)
- [ ] 路由测试 (GET, POST, PUT, DELETE)
- [ ] 错误处理测试
- [ ] 生成覆盖率报告 (> 80%)

### 集成和 E2E 测试
- [ ] API 端点集成测试
- [ ] 完整用户流程 E2E 测试
- [ ] 数据库事务测试
- [ ] 错误恢复测试

### 性能优化
- [ ] 代码分割实现
- [ ] 组件记忆化
- [ ] API 缓存
- [ ] 数据库查询优化
- [ ] 响应压缩
- [ ] 速率限制

### 文档
- [ ] 测试文档编写
- [ ] CI/CD 配置
- [ ] 性能优化说明

---

**版本**: 1.0.0
**更新时间**: 2024-11-12

