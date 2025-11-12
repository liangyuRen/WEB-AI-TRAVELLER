@echo off
REM WEB-AI-TRAVELLER 应用启动和测试脚本
REM 用于 Windows 系统

setlocal enabledelayedexpansion

cls
echo ========================================
echo WEB-AI-TRAVELLER 启动和测试
echo ========================================
echo.

REM 检查 Node.js 安装
echo 检查 Node.js 安装...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)
echo ✓ Node.js 已安装
echo.

REM 检查目录结构
echo 检查目录结构...
if not exist "backend" (
    echo ✗ backend 目录不存在
    pause
    exit /b 1
)
if not exist "frontend" (
    echo ✗ frontend 目录不存在
    pause
    exit /b 1
)
echo ✓ 目录结构正确
echo.

REM 启动后端服务
echo ========================================
echo 第 1 步: 启动后端服务 (http://localhost:5000)
echo ========================================
echo.

cd backend
echo 安装后端依赖...
call npm install >nul 2>&1
if errorlevel 1 (
    echo ✗ 后端依赖安装失败
    cd ..
    pause
    exit /b 1
)
echo ✓ 后端依赖安装成功
echo.

echo 启动后端服务...
start "WEB-AI-TRAVELLER Backend" cmd /k "npm run dev"
echo ✓ 后端服务已启动 (新窗口)
echo.

cd ..
timeout /t 3 /nobreak

REM 启动前端应用
echo ========================================
echo 第 2 步: 启动前端应用 (http://localhost:3000)
echo ========================================
echo.

cd frontend
echo 安装前端依赖...
call npm install >nul 2>&1
if errorlevel 1 (
    echo ✗ 前端依赖安装失败
    cd ..
    pause
    exit /b 1
)
echo ✓ 前端依赖安装成功
echo.

echo 启动前端应用...
start "WEB-AI-TRAVELLER Frontend" cmd /k "npm start"
echo ✓ 前端应用已启动 (新窗口)
echo.

cd ..
timeout /t 3 /nobreak

REM 提示用户
echo ========================================
echo ✓ 应用启动完成！
echo ========================================
echo.
echo 访问应用: http://localhost:3000
echo.
echo 建议步骤:
echo 1. 等待 5-10 秒让应用完全启动
echo 2. 浏览器会自动打开前端应用
echo 3. 如未自动打开，手动访问 http://localhost:3000
echo 4. 注册新用户账户进行测试
echo 5. 参考 TEST_EXECUTION_GUIDE.md 进行完整测试
echo.
echo 测试文档: TEST_EXECUTION_GUIDE.md
echo 后端日志: 后端窗口中显示
echo 前端日志: 前端窗口中显示
echo.
pause
