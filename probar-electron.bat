@echo off
REM ---------------------------------------------------------------------------
REM  Abre la trivia en una ventana chica, con marco y cerrable con la X.
REM  Sirve para probar cambios en una maquina de escritorio sin que la trivia
REM  tome la pantalla entera. En el totem se usa start.bat, no esto.
REM  (Sin acentos ni enies a proposito: los .bat se leen con la codepage de la
REM  consola y los caracteres raros salen mal.)
REM ---------------------------------------------------------------------------
cd /d "%~dp0"

if not exist "runtime\electron.exe" (
  echo.
  echo  Falta el runtime de Electron ^(carpeta runtime\^).
  echo  Corre descargar-runtime.bat una vez, con internet.
  echo.
  pause
  exit /b 1
)

"%~dp0runtime\electron.exe" "%~dp0." --ventana
