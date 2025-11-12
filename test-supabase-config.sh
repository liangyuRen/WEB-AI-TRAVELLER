#!/bin/bash
# Supabase 连接测试脚本

echo "🔍 WEB-AI-TRAVELLER Supabase 连接测试"
echo "========================================"
echo ""

# 检查 .env 文件
echo "1️⃣  检查后端 .env 文件..."
if [ -f "backend/.env" ]; then
  if grep -q "SUPABASE_URL" backend/.env && grep -q "SUPABASE_KEY" backend/.env; then
    echo "✅ 后端 .env 文件配置完成"
    echo "   - SUPABASE_URL 已配置"
    echo "   - SUPABASE_KEY 已配置"
  else
    echo "❌ 后端 .env 文件不完整，请添加 SUPABASE_URL 和 SUPABASE_KEY"
    exit 1
  fi
else
  echo "❌ 后端 .env 文件不存在，请创建"
  exit 1
fi
echo ""

echo "2️⃣  检查前端 .env.local 文件..."
if [ -f "frontend/.env.local" ]; then
  if grep -q "REACT_APP_SUPABASE_URL" frontend/.env.local; then
    echo "✅ 前端 .env.local 文件配置完成"
    echo "   - REACT_APP_SUPABASE_URL 已配置"
  else
    echo "❌ 前端 .env.local 文件不完整"
    exit 1
  fi
else
  echo "❌ 前端 .env.local 文件不存在"
  exit 1
fi
echo ""

echo "3️⃣  测试后端依赖..."
if [ -d "backend/node_modules" ]; then
  echo "✅ 后端依赖已安装"
else
  echo "⚠️  后端依赖未安装，运行: cd backend && npm install"
fi
echo ""

echo "4️⃣  测试前端依赖..."
if [ -d "frontend/node_modules" ]; then
  echo "✅ 前端依赖已安装"
else
  echo "⚠️  前端依赖未安装，运行: cd frontend && npm install"
fi
echo ""

echo "========================================"
echo "✅ 配置检查完成！"
echo ""
echo "📝 后续步骤:"
echo "1. 确保你已在 Supabase SQL Editor 中运行了 SUPABASE_SETUP.md 中的 SQL 脚本"
echo "2. 运行: npm install (在 backend 和 frontend 目录)"
echo "3. 启动后端: cd backend && npm run dev"
echo "4. 启动前端: cd frontend && npm start"
echo "5. 访问: http://localhost:3000"
echo ""
echo "🔗 Supabase 项目: https://iwtqkpxiyawxlufduxrw.supabase.co"
echo ""
