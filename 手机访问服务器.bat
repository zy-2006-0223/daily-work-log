@echo off
chcp 65001 >nul
title 📋 工作日志 - 手机访问服务器
cd /d "%~dp0"

echo ================================================
echo         📋 工作日志 - 手机访问启动器
echo ================================================
echo.
echo  [1] 确保手机和电脑连接的是同一个 WiFi
echo.
echo  [2] 按任意键启动服务器...
echo.
pause >nul

echo.
echo ================================================
echo  ✅ 服务器已启动！
echo.
echo  请在手机浏览器中输入以下地址：
echo.

REM 获取本机IP地址
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R "IPv4 Address.*192\.168\."') do (
    set "IP=%%a"
    goto :found
)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R "IPv4.*10\."') do (
    set "IP=%%a"
    goto :found
)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set "IP=%%a"
    goto :found
)
:found
set IP=%IP: =%
echo     🌐  http://%IP%:8000
echo.
echo ================================================
echo  按 Ctrl+C 可以关闭服务器
echo ================================================

python -m http.server 8000
pause