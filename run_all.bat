@echo off
title Sistema IoT - Control Principal

REM Ejecutar procesos ocultos
echo Iniciando backend...
start /min "" cmd /c "start /min backend_hidden.bat"

echo Iniciando detección de movimiento...
start /min "" cmd /c "start /min motion_hidden.bat"

echo Iniciando frontend...
start /min "" cmd /c "start /min frontend_hidden.bat"

echo Esperando procesos... presiona Ctrl+C o cierra esta ventana para finalizar todo.
:waitloop
timeout /t 5 >nul
goto waitloop
