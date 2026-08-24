/* Puente mínimo entre la trivia y Electron.
   Lo único que necesita el renderer es poder pedir la salida por el atajo
   secreto de toques: el tótem no tiene teclado. Todo lo demás queda aislado
   (contextIsolation activo, sin nodeIntegration). */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('totem', {
  salir: () => ipcRenderer.send('totem:salir')
});
