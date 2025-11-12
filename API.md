# API Integration Guide

## 核心API端点

### 旅行规划 API

#### 1. 生成旅行计划
```
POST /api/travel/plan
Content-Type: application/json

{
  "destination": "日本",
  "days": 5,
  "budget": 10000,
  "people": 2,
  "preferences": "美食和动漫"
}

Response:
{
  "success": true,
  "data": {
    "destination": "日本",
    "days": 5,
    "budget": 10000,
    "people": 2,
    "itinerary": [...]
  }
}
```

#### 2. 获取已保存的计划
```
GET /api/travel/plans/:userId

Response:
{
  "success": true,
  "data": [...]
}
```

#### 3. 更新计划
```
PUT /api/travel/plan/:planId
Content-Type: application/json

{
  "itinerary": [...],
  "preferences": "updated preferences"
}

Response:
{
  "success": true,
  "data": {...}
}
```

### 预算管理 API

#### 1. 记录开支
```
POST /api/budget/expense
Content-Type: application/json

{
  "planId": "plan-1",
  "category": "food",
  "amount": 500,
  "description": "午餐"
}

Response:
{
  "success": true,
  "data": {
    "id": "expense-1",
    "planId": "plan-1",
    "category": "food",
    "amount": 500,
    "date": "2024-11-12"
  }
}
```

#### 2. 获取预算摘要
```
GET /api/budget/summary/:planId

Response:
{
  "success": true,
  "data": {
    "totalBudget": 10000,
    "totalSpent": 1500,
    "remaining": 8500,
    "breakdown": {
      "accommodation": 5000,
      "food": 1500,
      "transportation": 0,
      "activities": 0,
      "other": 0
    }
  }
}
```

#### 3. 更新开支
```
PUT /api/budget/expense/:expenseId
Content-Type: application/json

{
  "amount": 600,
  "description": "updated description"
}
```

#### 4. 删除开支
```
DELETE /api/budget/expense/:expenseId

Response:
{
  "success": true,
  "message": "Expense deleted"
}
```

### LLM API (AI服务)

#### 1. 通用聊天
```
POST /api/llm/chat
Content-Type: application/json

{
  "prompt": "推荐一些日本的景点",
  "provider": "alibaba",
  "apiKey": "sk-xxx",
  "temperature": 0.7,
  "maxTokens": 1000
}

Response:
{
  "success": true,
  "data": {
    "text": "富士山是日本最著名的景点...",
    "usage": {
      "promptTokens": 50,
      "completionTokens": 150,
      "totalTokens": 200
    }
  }
}
```

#### 2. 生成行程 (使用AI)
```
POST /api/llm/generate-itinerary
Content-Type: application/json

{
  "destination": "日本",
  "days": 5,
  "budget": 10000,
  "travelers": 2,
  "preferences": "美食和动漫",
  "provider": "alibaba",
  "apiKey": "sk-xxx"
}

Response:
{
  "success": true,
  "data": {
    "text": "...",  // 包含详细行程的AI生成文本
    "usage": {...}
  }
}
```

#### 3. 预算分析 (使用AI)
```
POST /api/llm/analyze-budget
Content-Type: application/json

{
  "expenses": [
    {"category": "food", "amount": 500},
    {"category": "accommodation", "amount": 2000}
  ],
  "totalBudget": 5000,
  "provider": "alibaba",
  "apiKey": "sk-xxx"
}

Response:
{
  "success": true,
  "data": {
    "text": "您的支出分析...",
    "usage": {...}
  }
}
```

### 语音识别 API

#### 1. 获取认证信息
```
GET /api/speech/auth

Response:
{
  "success": true,
  "data": {
    "appId": "0db047fe",
    "apiKey": "9bcfb98849bcc8a4c29015205722a4af",
    "apiSecret": "MzE1ZTA3YWZhODU1YjJhMWQ1Mjk4OWI2",
    "wsUrl": "wss://ws-api.xfyun.cn/v1/private/s2t?..."
  }
}
```

#### 2. 获取WebSocket URL
```
GET /api/speech/ws-url

Response:
{
  "success": true,
  "data": {
    "wsUrl": "wss://ws-api.xfyun.cn/v1/private/s2t?...",
    "appId": "0db047fe"
  }
}
```

## 错误处理

所有API端点返回标准错误响应：

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### HTTP状态码
- 200: 成功
- 400: 请求格式错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

## 认证

目前API不需要认证（演示模式），但生产环境应添加：
- JWT Token认证
- API Key验证
- Rate limiting

## 速率限制

建议添加速率限制：
- 普通API：100请求/分钟
- LLM API：10请求/分钟
- 语音API：5请求/分钟

## 跨域 (CORS)

已配置CORS允许来自前端的跨域请求：
```
GET /health - CORS: ✓
/api/* - CORS: ✓
```

## 测试工具

### 使用cURL
```bash
curl -X GET http://localhost:5000/health
curl -X POST http://localhost:5000/api/travel/plan \
  -H "Content-Type: application/json" \
  -d '{"destination":"Japan","days":5}'
```

### 使用Postman
1. 导入 `test-api.sh` 中的请求
2. 设置环境变量 `baseUrl=http://localhost:5000`
3. 导入API集合运行测试

### 使用JavaScript/TypeScript
```typescript
import { apiClient, travelService, llmService } from '@/services/api';

// 测试API
const response = await travelService.generatePlan(
  'Japan', 5, 10000, 2, 'food'
);

// 测试LLM
const llmResponse = await llmService.chat('推荐景点');
```

## WebSocket (语音识别)

使用WebSocket进行实时语音转文本：

```javascript
const ws = new WebSocket(wsUrl);

// 发送配置
ws.send(JSON.stringify({
  audio: {
    audio_format: 'raw',
    encoding: 'raw',
    sample_rate: 16000
  }
}));

// 发送音频数据
ws.send(audioBuffer);

// 接收结果
ws.onmessage = (event) => {
  const result = JSON.parse(event.data);
  console.log('Recognition result:', result);
};
```

---

API文档最后更新: 2024年11月12日
