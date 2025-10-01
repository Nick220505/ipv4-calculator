@echo off
REM Script para Windows - Crear paquete de despliegue
REM Redes de Datos 1 - 246827

echo Construyendo proyecto...
call npm run build

if %errorlevel% neq 0 (
    echo Error en el build
    exit /b %errorlevel%
)

echo.
echo Creando archivo comprimido...

REM Necesitas 7-Zip o WinRAR instalado
REM Ajusta la ruta si es necesario
set SEVENZIP="C:\Program Files\7-Zip\7z.exe"

if not exist %SEVENZIP% (
    echo.
    echo Por favor, instala 7-Zip desde: https://www.7-zip.org/
    echo O usa WinRAR para comprimir manualmente estas carpetas:
    echo   - .next
    echo   - public
    echo   - package.json
    echo   - package-lock.json
    echo   - next.config.ts
    echo   - tsconfig.json
    echo   - postcss.config.mjs
    echo   - DEPLOYMENT.md
    pause
    exit /b 1
)

REM Crear nombre con fecha
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set FILENAME=ipv4-calculator-%mydate%-%mytime%.zip

%SEVENZIP% a -tzip %FILENAME% .next public package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs DEPLOYMENT.md

echo.
echo Paquete creado: %FILENAME%
echo.
echo Sube este archivo a tu servidor Rocky Linux 9
echo Lee DEPLOYMENT.md para instrucciones de instalacion
echo.
pause

