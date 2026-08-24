@echo off
REM ---------------------------------------------------------------------------
REM  Salida de emergencia: cierra la trivia a la fuerza.
REM  Para cuando quedo arriba de todo y no responden ni el atajo ni los toques.
REM  Se puede correr desde Win+R escribiendo la ruta de este archivo.
REM ---------------------------------------------------------------------------
taskkill /F /IM electron.exe >nul 2>nul
if errorlevel 1 (
  echo No habia ninguna trivia corriendo.
) else (
  echo Trivia cerrada.
)
timeout /t 2 >nul
