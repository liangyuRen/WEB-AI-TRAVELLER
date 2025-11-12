#!/bin/bash

# AI Travel Planner - 本地测试脚本
# 测试后端API端点

BASE_URL="http://localhost:5000/api"

echo "========================================="
echo "AI Travel Planner API 测试"
echo "========================================="

# 1. 健康检查
echo ""
echo "1. 健康检查 (Health Check)..."
curl -X GET http://localhost:5000/health
echo ""

# 2. 生成旅行计划
echo ""
echo "2. 生成旅行计划 (Generate Travel Plan)..."
curl -X POST "$BASE_URL/travel/plan" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "日本",
    "days": 5,
    "budget": 10000,
    "people": 2,
    "preferences": "美食和动漫"
  }'
echo ""

# 3. 记录开支
echo ""
echo "3. 记录开支 (Record Expense)..."
curl -X POST "$BASE_URL/budget/expense" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan-1",
    "category": "food",
    "amount": 500,
    "description": "午餐"
  }'
echo ""

# 4. LLM 聊天 (需要配置API密钥)
echo ""
echo "4. LLM 聊天 (Chat - 需要API密钥)..."
curl -X POST "$BASE_URL/llm/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "我想去日本旅游，有什么建议吗？",
    "provider": "alibaba",
    "apiKey": "YOUR_API_KEY_HERE"
  }'
echo ""

# 5. 生成行程 (使用LLM)
echo ""
echo "5. 生成行程 (Generate Itinerary - 需要API密钥)..."
curl -X POST "$BASE_URL/llm/generate-itinerary" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "巴黎",
    "days": 3,
    "budget": 5000,
    "travelers": 2,
    "preferences": "艺术和文化",
    "provider": "alibaba",
    "apiKey": "YOUR_API_KEY_HERE"
  }'
echo ""

echo "========================================="
echo "测试完成"
echo "========================================="
