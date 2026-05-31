@echo off
cd /d C:\jain-jwellers
call npm.cmd --workspace apps/admin run build
node serve-admin.js
