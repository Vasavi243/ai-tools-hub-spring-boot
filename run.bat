@echo off
title AI Tools Hub - Spring Boot Launcher
echo ===================================================
echo   Starting AI Tools Hub Web Application...
echo ===================================================
echo.

echo Cleaning up any background process on port 8080...
powershell -Command "Get-Process -Name 'java' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue; Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo.
echo Launching Spring Boot Backend...
echo Access in browser when ready: http://localhost:8080
echo ===================================================
echo.

set MAVEN_CMD="C:\Users\vasav\.m2\apache-maven-3.9.6\bin\mvn.cmd"

if exist %MAVEN_CMD% (
    %MAVEN_CMD% spring-boot:run
) else (
    mvn spring-boot:run
)

pause
