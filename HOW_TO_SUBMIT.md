# 作业提交指南

## 📝 提交内容

根据课程要求，本项目的提交包括：

### 1. **GitHub仓库** (✅ 已完成)
- 仓库地址: https://github.com/liangyuRen/WEB-AI-TRAVELLER
- 所有源代码已上传
- 详细的Git提交历史已保留
- README文档已编写

### 2. **Docker镜像** (✅ 已完成)
- `Dockerfile.backend` - 后端镜像
- `Dockerfile.frontend` - 前端镜像
- `docker-compose.yml` - 编排配置
- 可直接使用 `docker-compose up --build` 运行

### 3. **提交PDF文件** (✅ 已准备好)

本项目提供了多种格式的提交文档，选择以下任意一种作为PDF提交：

#### 选项A: 使用HTML版本（推荐）
1. 打开 `SUBMISSION_PDF_CONTENT.html` 文件
2. 在浏览器中右键 → 打印 → 保存为PDF
3. 或使用 `Ctrl+P` 快捷键打印

#### 选项B: 使用Markdown版本
1. 打开 `SUBMISSION.md` 文件
2. 使用在线Markdown转PDF工具（如 pandoc）
3. 或复制内容到支持PDF导出的应用（如Google Docs）

#### 选项C: 查看提交总结
- 文件: `SUBMISSION_SUMMARY.txt`
- 包含完整的提交清单和说明

---

## 🚀 快速验证项目

### 方式1: 使用Docker Compose（最简单）
```bash
git clone https://github.com/liangyuRen/WEB-AI-TRAVELLER.git
cd WEB-AI-TRAVELLER
docker-compose up --build
```

应用将在以下地址可用：
- 前端: http://localhost:3000
- 后端API: http://localhost:5000

### 方式2: 本地开发环境运行

**后端**:
```bash
cd backend
npm install
npm run dev
# 后端运行在 http://localhost:5000
```

**前端** (新终端):
```bash
cd frontend
npm install
npm start
# 前端运行在 http://localhost:3000
```

---

## 🔑 API密钥配置

### 使用阿里云百炼（推荐）

1. 启动应用后，进入 Settings 页面
2. 在 "LLM Configuration" 部分选择 "Alibaba Bailian"
3. 输入API密钥（助教提供）
4. 点击保存
5. 密钥将保存在本地浏览器存储中

注意：
- 密钥不会被发送到服务器
- 支持多种LLM提供商（OpenAI, Hugging Face等）
- 密钥可以随时在Settings中修改

---

## 📋 项目文件说明

### 核心文档
- **README.md** - 完整的项目文档（技术栈、功能、部署指南等）
- **SUBMISSION.md** - 作业提交说明（Markdown格式）
- **SUBMISSION_PDF_CONTENT.html** - 提交内容（HTML/PDF格式）
- **SUBMISSION_SUMMARY.txt** - 提交总结清单

### 应用代码
- **frontend/** - React前端应用
- **backend/** - Express.js后端API
- **.github/workflows/** - GitHub Actions CI/CD配置

### 部署配置
- **Dockerfile.backend** - 后端镜像
- **Dockerfile.frontend** - 前端镜像
- **docker-compose.yml** - Docker编排

---

## ✅ 提交前检查清单

在提交作业前，请确认以下项目：

### 1. GitHub仓库
- [ ] 仓库地址可访问
- [ ] 源代码完整上传
- [ ] README文档详细
- [ ] Git提交历史清晰

### 2. Docker支持
- [ ] Dockerfile.backend 存在且正确
- [ ] Dockerfile.frontend 存在且正确
- [ ] docker-compose.yml 配置正确
- [ ] 可成功执行 `docker-compose up --build`

### 3. 功能验证
- [ ] 前端可访问 (http://localhost:3000)
- [ ] 后端API可访问 (http://localhost:5000)
- [ ] Settings页面可配置LLM密钥
- [ ] Travel Planner页面可生成行程
- [ ] Budget Manager可记录开支

### 4. 文档完整
- [ ] README.md 包含项目说明
- [ ] 提交文档（PDF格式）已准备
- [ ] 快速开始指南已提供
- [ ] API端点说明已完整

---

## 📁 PDF提交格式

### 建议内容
PDF文件应包含以下信息：

1. **项目信息**
   - 项目名称：AI Travel Planner
   - GitHub地址：https://github.com/liangyuRen/WEB-AI-TRAVELLER
   - 提交日期：2025年11月12日

2. **快速开始**
   ```bash
   docker-compose up --build
   ```

3. **技术栈**
   - 前端：React 18 + TypeScript + Tailwind CSS
   - 后端：Express.js + TypeScript + Supabase
   - 部署：Docker + GitHub Actions

4. **核心功能**
   - 智能行程规划
   - 费用预算管理
   - 用户认证系统
   - LLM集成

5. **提交清单**
   - ✓ GitHub仓库
   - ✓ Docker镜像
   - ✓ CI/CD配置
   - ✓ 详细文档

---

## 🆘 常见问题

### Q: 如何生成PDF文件？
A: 打开 `SUBMISSION_PDF_CONTENT.html`，在浏览器中使用 Ctrl+P 或 Cmd+P 打印为PDF。

### Q: 如果没有API密钥怎么办？
A: 
- 向助教咨询阿里云百炼API密钥
- 或使用OpenAI/其他LLM提供商的密钥
- 在Settings页面配置即可

### Q: Docker运行失败怎么办？
A: 
1. 检查Docker是否已安装：`docker --version`
2. 确保Docker daemon正在运行
3. 查看docker-compose日志：`docker-compose logs`
4. 清理并重新构建：`docker-compose down && docker-compose up --build`

### Q: 前端和后端无法通信？
A: 
1. 确保后端运行在port 5000
2. 检查CORS配置
3. 在浏览器开发者工具中检查Network标签
4. 查看后端日志了解错误信息

---

## 📞 支持

如遇到任何问题，请：

1. 查看 [README.md](./README.md) 中的完整文档
2. 查看 [SUBMISSION_SUMMARY.txt](./SUBMISSION_SUMMARY.txt) 中的故障排除部分
3. 访问GitHub仓库查看Issues
4. 检查后端和前端的运行日志

---

## 🎉 最后

项目已完全准备好进行提交：

✅ 完整的源代码在GitHub上
✅ Docker镜像已配置，可直接运行
✅ CI/CD流程已设置
✅ 文档详细完整
✅ 功能完整可用
✅ 提交文件已生成

**现在可以提交作业了！** 🚀

---

最后更新：2025年11月12日
