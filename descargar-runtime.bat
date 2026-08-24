@echo off
REM ---------------------------------------------------------------------------
REM  Vuelve a bajar el runtime de Electron (carpeta runtime\).
REM  Solo hace falta si la carpeta runtime\ no vino con el proyecto o se borro.
REM  Necesita internet una sola vez. NO necesita Node.js ni npm.
REM
REM  La version esta fija a proposito: el brief pide que Electron quede
REM  congelado en la version con la que se probo. No cambiarla sin volver a
REM  probar la trivia entera en el totem.
REM ---------------------------------------------------------------------------
setlocal
cd /d "%~dp0"

set VERSION=v43.4.1
set ARCHIVO=electron-%VERSION%-win32-x64.zip
set URL=https://github.com/electron/electron/releases/download/%VERSION%/%ARCHIVO%
set SHA256=c2ef9a5f65472c34d14bd3e67b7d14e66b0c01f124aba45263d6a4232160e13a

if exist "runtime\electron.exe" (
  echo El runtime ya esta. Si lo queres rehacer, borra la carpeta runtime\ y volve a correr esto.
  pause
  exit /b 0
)

echo Bajando Electron %VERSION% (143 MB)...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "Invoke-WebRequest -Uri '%URL%' -OutFile '%TEMP%\%ARCHIVO%' -UseBasicParsing;" ^
  "$h=(Get-FileHash '%TEMP%\%ARCHIVO%' -Algorithm SHA256).Hash.ToLower();" ^
  "if ($h -ne '%SHA256%') { Remove-Item '%TEMP%\%ARCHIVO%' -Force; throw 'El archivo bajado no coincide con el hash oficial.' };" ^
  "Write-Host 'SHA256 verificado. Descomprimiendo...';" ^
  "Expand-Archive -Path '%TEMP%\%ARCHIVO%' -DestinationPath 'runtime' -Force;" ^
  "Remove-Item '%TEMP%\%ARCHIVO%' -Force"

if errorlevel 1 (
  echo.
  echo  Fallo la descarga. Revisa la conexion a internet.
  echo.
  pause
  exit /b 1
)

echo.
echo  Listo. Ya podes correr start.bat.
echo.
pause
