@echo off
REM ---------------------------------------------------------------------------
REM  Trivia Totem TAI — arranque del totem.
REM  NO necesita Node.js ni npm ni internet: el runtime de Electron viene
REM  adentro de runtime\. Esto es lo que tiene que apuntar el acceso directo de
REM  la carpeta Inicio de Windows.
REM ---------------------------------------------------------------------------
cd /d "%~dp0"

if not exist "runtime\electron.exe" (
  echo.
  echo  Falta el runtime de Electron ^(carpeta runtime\^).
  echo  Corre descargar-runtime.bat una vez, con internet, y volve a intentar.
  echo.
  pause
  exit /b 1
)

REM El punto es la ruta de la app: Electron lee de ahi package.json y main.js.
start "" "%~dp0runtime\electron.exe" "%~dp0."
