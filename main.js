/* Trivia Totem TAI — envoltorio Electron
   ------------------------------------------------------------------------
   Electron es solo la cáscara para el tótem. Toda la trivia vive en
   index.html + js/app.js + quiz.js y funciona igual abierta en un navegador.

   Por qué Electron y no Chrome en modo kiosco (decidido en BRIEF.md §5):
     - Chrome, después de un corte de luz, reabre con el cartel "Restaurar
       páginas" encima de todo y el tótem queda muerto hasta que alguien lo
       toque a mano.
     - Chrome se autoactualiza y un día cambia el comportamiento.
     - Acá se controla de verdad la ventana: sin barra, sin cursor, sin
       Alt+F4, siempre encima. */

const { app, BrowserWindow, screen, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

const LIENZO = { ancho: 1081, alto: 1920 };

// Trampa de Windows: sin esto, el escalado DPI del sistema (125%, 150%) hace
// que 1080x1920 no sean píxeles físicos y la placa entra recortada o chica.
// Tiene que ir ANTES de que la app esté lista.
app.commandLine.appendSwitch('force-device-scale-factor', '1');
app.commandLine.appendSwitch('high-dpi-support', '1');
// El touch de Windows manda gestos de pinch que hacen zoom sobre la placa.
app.commandLine.appendSwitch('disable-pinch');

let ventana = null;
let permitirSalir = false;

// Modo prueba: ventana chica, con marco y cerrable, para revisar cambios en una
// máquina de escritorio sin que la trivia se adueñe de la pantalla. En el tótem
// nunca se usa. Se activa con: runtime\electron.exe . --ventana
const modoVentana = process.argv.includes('--ventana');

function opciones() {
  const porDefecto = { monitor: 'auto', siempreEncima: true, abrirDevTools: false };
  try {
    const p = path.join(__dirname, 'ventana.json');
    if (fs.existsSync(p)) {
      return Object.assign(porDefecto, JSON.parse(fs.readFileSync(p, 'utf8')));
    }
  } catch (e) {
    console.warn('ventana.json ilegible, uso los valores por defecto:', e.message);
  }
  return porDefecto;
}

function elegirPantalla(cfg) {
  const pantallas = screen.getAllDisplays();
  if (typeof cfg.monitor === 'number' && pantallas[cfg.monitor]) return pantallas[cfg.monitor];
  // "auto": la primera pantalla vertical (el tótem). Si no hay, la principal.
  const vertical = pantallas.find(d => d.bounds.height > d.bounds.width);
  return vertical || screen.getPrimaryDisplay();
}

function crearVentana() {
  const cfg = opciones();
  const destino = elegirPantalla(cfg);

  ventana = new BrowserWindow({
    // Trampa de Windows: NO se pasan x/y acá. En monitores secundarios la
    // ventana termina en la pantalla equivocada. Se posiciona con setBounds()
    // una vez creada (más abajo).
    width: modoVentana ? 540 : LIENZO.ancho,
    height: modoVentana ? 960 : LIENZO.alto,
    show: false,
    frame: modoVentana,
    resizable: modoVentana,
    movable: modoVentana,
    minimizable: modoVentana,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: !modoVentana,
    autoHideMenuBar: true,
    backgroundColor: '#0a58f0',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
      backgroundThrottling: false   // el contador no puede frenarse si pierde foco
    }
  });

  ventana.removeMenu();

  if (!modoVentana) {
    // Trampa de Windows: NO se usa el fullscreen nativo de Electron. En
    // monitores secundarios abre en la pantalla equivocada y no tapa la barra
    // de tareas. Se estiran los bounds del display destino a mano.
    ventana.setBounds(destino.bounds);
    if (cfg.siempreEncima !== false) {
      ventana.setAlwaysOnTop(true, 'screen-saver');
    }
  }

  // En modo prueba se le avisa al renderer para que muestre el cursor: sin esto
  // la ventana queda usable pero sin puntero, y no se puede probar con mouse.
  ventana.loadFile(path.join(__dirname, 'index.html'),
    modoVentana ? { query: { ventana: '1' } } : undefined);

  ventana.once('ready-to-show', () => {
    // De nuevo: Windows a veces corre la ventana al mostrarla.
    if (!modoVentana) ventana.setBounds(destino.bounds);
    ventana.show();
    ventana.focus();
    if (cfg.abrirDevTools) ventana.webContents.openDevTools({ mode: 'detach' });
  });

  // Alt+F4 llega como pedido de cierre de ventana. Se rechaza salvo que la
  // salida haya sido pedida por el atajo secreto. En modo prueba se cierra
  // normal, que para eso está.
  ventana.on('close', (e) => {
    if (!permitirSalir && !modoVentana) e.preventDefault();
  });

  // Atajos que romperían el kiosco.
  ventana.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (modoVentana) return;
    const k = (input.key || '').toLowerCase();
    const ctrl = input.control, alt = input.alt, shift = input.shift;

    if (alt && k === 'f4') return e.preventDefault();
    if (ctrl && (k === 'w' || k === 'r' || k === 'q' || k === 'p' || k === 'f')) {
      if (!(ctrl && shift && alt && k === 'q')) return e.preventDefault();
    }
    if (k === 'f5' || k === 'f11' || k === 'f12') return e.preventDefault();
    if (ctrl && ['+', '-', '=', '0'].includes(input.key)) return e.preventDefault();

    // Atajo secreto de salida (documentado en el README).
    if (ctrl && shift && alt && k === 'q') salir();
  });

  // Nada de ventanas nuevas ni de navegar afuera de la app.
  ventana.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  ventana.webContents.on('will-navigate', (e) => e.preventDefault());

  // Si el renderer se cae después de días prendido, se recarga solo en vez de
  // dejar la pantalla en blanco.
  ventana.webContents.on('render-process-gone', (e, detalle) => {
    console.error('El renderer se cayó:', detalle && detalle.reason, '— recargando');
    if (ventana && !ventana.isDestroyed()) ventana.reload();
  });
  ventana.webContents.on('unresponsive', () => {
    console.error('Renderer sin responder — recargando');
    if (ventana && !ventana.isDestroyed()) ventana.reload();
  });
}

function salir() {
  permitirSalir = true;
  app.quit();
}

// El tótem arranca solo: si por lo que sea se lanza dos veces, la segunda se
// cierra y le devuelve el foco a la que ya está corriendo.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (ventana && !ventana.isDestroyed()) { ventana.show(); ventana.focus(); }
  });

  app.whenReady().then(() => {
    // Salida por toques: el tótem no tiene teclado. app.js detecta 5 toques
    // seguidos en la esquina superior derecha y avisa por acá.
    ipcMain.on('totem:salir', salir);

    // Atajo GLOBAL de salida. Va acá y no solo en el before-input-event de la
    // ventana porque ese depende de que la ventana tenga el foco: si el foco se
    // pierde (o Windows se lo da a otra cosa), la ventana queda arriba de todo,
    // sin marco y sin forma de cerrarla. Registrado global anda siempre.
    if (!globalShortcut.register('Control+Shift+Alt+Q', salir)) {
      console.warn('No pude registrar Ctrl+Shift+Alt+Q. Queda la salida por toques y cerrar.bat.');
    }

    crearVentana();
  });

  app.on('will-quit', () => globalShortcut.unregisterAll());
  app.on('window-all-closed', () => app.quit());
}
