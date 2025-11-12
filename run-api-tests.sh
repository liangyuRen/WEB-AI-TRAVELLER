#!/bin/bash

# WEB-AI-TRAVELLER 后端 API 自动化测试脚本
# 用于快速验证所有 API 端点是否正常工作

set -e

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试统计
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# 配置
API_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:3000"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}WEB-AI-TRAVELLER 后端 API 自动化测试${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 测试函数
test_endpoint() {
  local name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected_code=$5

  TESTS_RUN=$((TESTS_RUN + 1))

  echo -e "${YELLOW}测试 $TESTS_RUN: $name${NC}"
  echo "  方法: $method $endpoint"

  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" == "$expected_code" ]; then
    echo -e "  ${GREEN}✓ 通过 (HTTP $http_code)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "  ${RED}✗ 失败 (期望: $expected_code, 实际: $http_code)${NC}"
    echo "  响应: $body"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
  echo ""
}

# ===== 第 1 部分: 基础检查 =====
echo -e "${BLUE}第 1 部分: 基础检查${NC}"
echo -e "${BLUE}---${NC}"

# 检查后端服务
echo "检查后端服务是否运行..."
if curl -s -f "$API_URL/health" > /dev/null 2>&1; then
  echo -e "${GREEN}✓ 后端服务运行正常${NC}"
else
  echo -e "${RED}✗ 后端服务未运行${NC}"
  echo "  请先运行: npm run dev (在 backend 目录)"
  exit 1
fi
echo ""

# 检查前端
echo "检查前端应用是否运行..."
if curl -s -f "$FRONTEND_URL" > /dev/null 2>&1; then
  echo -e "${GREEN}✓ 前端应用运行正常${NC}"
else
  echo -e "${RED}⚠ 前端应用未运行${NC}"
  echo "  请先运行: npm start (在 frontend 目录)"
fi
echo ""

# ===== 第 2 部分: API 端点测试 =====
echo -e "${BLUE}第 2 部分: API 端点测试${NC}"
echo -e "${BLUE}---${NC}"

# Health Check
test_endpoint "Health Check" "GET" "/health" "" "200"

# Travel API
echo -e "${BLUE}Travel API 端点:${NC}"

test_endpoint "生成行程 (POST /api/travel/plan)" "POST" "/api/travel/plan" \
  '{
    "destination": "日本",
    "startDate": "2024-12-01",
    "days": 5,
    "budget": 10000,
    "people": 2,
    "preferences": "美食和动漫",
    "userId": "test-user-123",
    "provider": "alibaba",
    "apiKey": "sk-34f44781c41a4ac2808dfc10180d651d"
  }' "200"

# Budget API
echo -e "${BLUE}Budget API 端点:${NC}"

test_endpoint "记录开支 (POST /api/budget/expense)" "POST" "/api/budget/expense" \
  '{
    "planId": "test-plan-123",
    "category": "food",
    "amount": 500,
    "description": "午餐",
    "userId": "test-user-123"
  }' "200"

# LLM API
echo -e "${BLUE}LLM API 端点:${NC}"

test_endpoint "通用聊天 (POST /api/llm/chat)" "POST" "/api/llm/chat" \
  '{
    "prompt": "推荐一些日本的景点",
    "provider": "alibaba",
    "apiKey": "sk-34f44781c41a4ac2808dfc10180d651d"
  }' "200"

# Speech API
echo -e "${BLUE}Speech API 端点:${NC}"

test_endpoint "获取语音认证 (GET /api/speech/auth)" "GET" "/api/speech/auth" "" "200"

# ===== 第 3 部分: 测试总结 =====
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}测试总结${NC}"
echo -e "${BLUE}========================================${NC}"

TOTAL_TESTS=$TESTS_RUN
SUCCESS_RATE=$((TESTS_PASSED * 100 / TESTS_RUN))

echo "总测试数:  $TOTAL_TESTS"
echo -e "通过:     ${GREEN}$TESTS_PASSED${NC}"
echo -e "失败:     ${RED}$TESTS_FAILED${NC}"
echo "成功率:   $SUCCESS_RATE%"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ 所有测试通过！${NC}"
  exit 0
else
  echo -e "${RED}✗ 有 $TESTS_FAILED 个测试失败${NC}"
  exit 1
fi
