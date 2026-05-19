@echo off
chcp 65001 > nul
echo.
echo  ==========================================
echo   沈阳盛京医疗联盟 · 儿童心理健康服务系统
echo   演示模拟项目启动脚本
echo  ==========================================
echo.

:: 检查 node 是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo  ❌ 未检测到 Node.js，请先安装：https://nodejs.org
  pause
  exit /b 1
)

echo  🚀 正在启动服务...
echo  📡 浏览器将自动打开 http://127.0.0.1:8000
echo  ⏹  按 Ctrl+C 停止服务
echo.

npm start
pause
