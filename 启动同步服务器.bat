@echo off
chcp 65001 >nul
title 📋 工作日志 - 多设备同步服务器
cd /d "%~dp0"

echo ================================================
echo         📋 工作日志 - 多设备同步服务器
echo ================================================
echo.
echo  ✅ 手机和电脑数据自动同步！
echo  ✅ 确保手机和电脑连接同一个WiFi
echo.
echo  🚀 正在启动...
echo.

node server.js

pause