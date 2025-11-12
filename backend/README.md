# AI Travel Planner Backend

## 环境变量配置

创建 `.env` 文件（不要提交到版本控制）：

```env
PORT=5000
CLIENT_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# LLM API Configuration (Optional - can be set in frontend settings)
# LLM_API_KEY=your_api_key
# LLM_PROVIDER=openai|alibaba|huggingface
```

## 构建和运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 运行生产版本
npm start
```

## API 端点

- `GET /health` - 健康检查
- `POST /api/llm/chat` - LLM 聊天接口
- `POST /api/llm/generate-itinerary` - 生成行程
- `POST /api/travel/plan` - 创建旅行计划
- `POST /api/budget/expense` - 记录费用
