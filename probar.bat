@echo off
REM Abre la trivia en el navegador por defecto, sin Electron y sin instalar nada.
REM Sirve para probar cambios de placas o de quiz.js al instante.
REM Con ?debug=1 se pintan de rosa las zonas tactiles.
cd /d "%~dp0"
start "" "%~dp0index.html"
