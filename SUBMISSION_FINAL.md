# AI Travel Planner - 作业提交文档

## GitHub 仓库

**仓库地址**: https://github.com/liangyuRen/WEB-AI-TRAVELLER

---

## 项目运行方法

### 方法1：Docker Compose 运行（推荐）

```bash
# 克隆仓库
git clone https://github.com/liangyuRen/WEB-AI-TRAVELLER.git
cd WEB-AI-TRAVELLER

# 启动应用
docker-compose up --build

# 应用地址：
# 前端: http://localhost:3000
# 后端API: http://localhost:5000
```

### 方法2：本地开发运行

**启动后端**（终端1）:
```bash
cd backend
npm install
npm run dev
```

**启动前端**（终端2）:
```bash
cd frontend
npm install
npm start
```

---

## API密钥配置（重要）

### 配置步骤

1. 启动应用后，打开 http://localhost:3000
2. 进入右上角的 **Settings** 页面
3. 在 "LLM Configuration" 部分选择 LLM 提供商：
   - **Alibaba Bailian**（推荐 - 助教提供）
   - OpenAI GPT
   - Hugging Face
   - 本地LLM
4. 输入对应的 API 密钥
5. 点击保存

**注意**：密钥只保存在本地浏览器存储中，不会发送到服务器。

### 获取API密钥

#### 阿里云百炼（推荐）
- 提供方：课程助教
- 有效期：3个月免费额度
- 获取方法：联系课程助教获取

#### OpenAI GPT
- 获取地址：https://platform.openai.com/api-keys
- 格式：sk-xxx...

#### Hugging Face
- 获取地址：https://huggingface.co/settings/tokens

---

## 项目功能

### 1. 智能行程规划
- AI驱动的行程自动生成
- 支持自定义旅行偏好
- 实时预算估算

### 2. 费用预算管理
- 支出记录与分类统计
- AI驱动的预算分析
- 费用超额预警

### 3. 用户系统
- 用户注册与登录
- 旅行计划保存管理
- 云端数据同步

### 4. 现代化设计
- Golden Luxury 主题
- 响应式布局
- 流畅的用户交互

---

## 技术栈

**前端**：React 18 + TypeScript + Tailwind CSS + Zustand  
**后端**：Express.js + TypeScript + Supabase  
**部署**：Docker + Docker Compose + GitHub Actions

---

## 项目结构

```
WEB-AI-TRAVELLER/
├── frontend/           # React前端应用
├── backend/            # Express后端API
├── .github/workflows/  # GitHub Actions CI/CD
├── docker-compose.yml  # Docker编排配置
├── Dockerfile.backend  # 后端镜像配置
├── Dockerfile.frontend # 前端镜像配置
└── README.md          # 完整项目文档
```

---

## 快速验证

### 健康检查
```bash
curl http://localhost:5000/health
```

应返回：
```json
{
  "status": "ok",
  "message": "AI Travel Planner Backend is running"
}
```

### 功能测试
1. 访问 http://localhost:3000
2. 进入 Settings 配置 LLM 密钥
3. 进入 Travel Planner 输入旅行参数
4. 点击"Generate Travel Plan"生成行程
5. 在 Budget Manager 中记录开支

---

## 提交清单

- ✅ GitHub 仓库已创建并配置
- ✅ 项目代码完整上传
- ✅ Dockerfile 已创建（前端和后端）
- ✅ Docker Compose 配置完整
- ✅ GitHub Actions CI/CD 已设置
- ✅ README 文档详细（见 README.md）
- ✅ 快速开始指南已提供
- ✅ API 密钥配置说明已完整
- ✅ Git 提交历史详细清晰

---

## 最后更新

**时间**: 2025年11月12日  
**项目状态**: 生产就绪 🚀

---

完整文档请参考：https://github.com/liangyuRen/WEB-AI-TRAVELLER/blob/main/README.md
