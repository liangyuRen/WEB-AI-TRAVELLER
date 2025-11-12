@echo off
REM Windows 快速启动脚本
REM WEB-AI-TRAVELLER 项目启动程序

echo.
echo ============================================
echo   WEB-AI-TRAVELLER 快速启动脚本
echo ============================================
echo.

REM 检查后端 .env
echo [1/5] 检查后端配置文件...
if exist "backend\.env" (
    echo ✓ 后端 .env 文件已存在
) else (
    echo ✗ 后端 .env 文件不存在
    echo 请参考 SUPABASE_SETUP.md 创建 .env 文件
    pause
    exit /b 1
)

REM 检查前端 .env.local
echo [2/5] 检查前端配置文件...
if exist "frontend\.env.local" (
    echo ✓ 前端 .env.local 文件已存在
) else (
    echo ✗ 前端 .env.local 文件不存在
    echo 请参考 SUPABASE_SETUP.md 创建 .env.local 文件
    pause
    exit /b 1
)

REM 检查后端依赖
echo [3/5] 检查后端依赖...
if exist "backend\node_modules" (
    echo ✓ 后端依赖已安装
) else (
    echo 正在安装后端依赖...
    cd backend
    call npm install
    cd ..
)

REM 检查前端依赖
echo [4/5] 检查前端依赖...
if exist "frontend\node_modules" (
    echo ✓ 前端依赖已安装
) else (
    echo 正在安装前端依赖...
    cd frontend
    call npm install
    cd ..
)

echo.
echo [5/5] 启动应用...
echo.
echo 后端服务启动在: http://localhost:5000
echo 前端应用启动在: http://localhost:3000
echo.
echo 按任意键继续启动...
pause

REM 启动后端（新窗口）
start "AI Travel Backend" cmd /k "cd backend && npm run dev"

REM 等待后端启动
timeout /t 3

REM 启动前端（新窗口）
start "AI Travel Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✓ 应用已启动！
echo.
echo 前端: http://localhost:3000
echo 后端: http://localhost:5000
echo.
echo 提示:
echo - 如果需要使用 LLM 功能，在 Settings 页面配置 API Key
echo - 确保已在 Supabase 中创建了表和 RLS 策略（参考 SUPABASE_SETUP.md）
echo.
pause
