/* Trivia Totem TAI — V2
   ------------------------------------------------------------------------
   La app no dibuja la trivia: la muestra. Cada pantalla es una pila de PNG de
   1081x1920 entregados por diseño. Lo único que se dibuja por código son dos
   textos: el contador de segundos y el "Acertaste N/4".

   Flujo:  home -> menú del tema -> pregunta -> feedback -> ... -> resultado
           -> cierre -> vuelve al menú del tema (loop infinito)

   Novedad de V2: animaciones. Regla de oro —
   **ninguna animación decide nada.** Los tiempos y la máquina de estados mandan
   igual que en V1; si una animación no arranca, la trivia avanza lo mismo.
   Nunca se espera un `animationend` para cambiar de pantalla.

   Todo lo configurable vive en quiz.js. */

(function () {
  'use strict';

  var LIENZO = { ancho: 1081, alto: 1920 };
  var LETRAS = ['A', 'B', 'C', 'D'];

  var escenario = document.getElementById('escenario');
  var cajaError = document.getElementById('error');

  var quiz = null;
  var cfg = null;
  var anim = null;

  // Pantallas. La nueva aparece por encima de la anterior, que se queda opaca
  // debajo hasta que la de arriba terminó de entrar. Así el cruce nunca deja
  // ver el fondo pelado entre una y otra.
  var pantalla = null;
  var saliente = null;
  var tempSaliente = null;     // aparte de `pendientes`: no lo borra limpiarTiempos
  var pintura = null;          // canvas del contador / marcador

  // Estado de la ronda
  var tema = null;
  var nroPregunta = 0;
  var aciertos = 0;

  var pendientes = [];
  var raf = null;
  var bloqueado = false;       // evita que un doble toque dispare dos veces

  var depurando = /[?&]debug=1/.test(location.search);

  /* ----------------------------------------------------------------- utils */

  function avisar(msg) {
    if (window.console) console.warn('[trivia]', msg);
    if (depurando) {
      cajaError.hidden = false;
      cajaError.textContent = String(msg);
    }
  }

  function limpiarTiempos() {
    for (var i = 0; i < pendientes.length; i++) clearTimeout(pendientes[i]);
    pendientes = [];
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  function luego(ms, fn) {
    pendientes.push(setTimeout(function () { protegido(fn)(); }, ms));
  }

  // Regla del proyecto: un error nunca puede dejar la pantalla colgada. Si algo
  // explota, se sigue de largo al paso siguiente en vez de morir ahí.
  function protegido(fn) {
    return function () {
      try { fn.apply(null, arguments); }
      catch (e) {
        avisar('Error, sigo de largo: ' + (e && e.message ? e.message : e));
        try { seguirDespuesDeError(); } catch (e2) { location.reload(); }
      }
    };
  }

  function seguirDespuesDeError() {
    limpiarTiempos();
    if (tema && nroPregunta < tema.preguntas.length - 1) {
      nroPregunta++;
      mostrarPregunta();
    } else {
      mostrarHome();
    }
  }

  /* -------------------------------------------------------------- pantallas */

  function nuevaPantalla() {
    limpiarTiempos();
    bloqueado = false;
    pintura = null;

    // Si todavía quedaba una vieja dando vueltas (cambio muy rápido de
    // pantalla), se va ahora: nunca se acumulan más de dos.
    if (tempSaliente) { clearTimeout(tempSaliente); tempSaliente = null; }
    if (saliente && saliente.parentNode) saliente.parentNode.removeChild(saliente);

    saliente = pantalla;
    if (saliente) saliente.classList.add('saliendo');   // deja de recibir toques

    pantalla = document.createElement('div');
    pantalla.className = 'pantalla';
    if (anim.activadas) pantalla.classList.add('entrando');
    escenario.appendChild(pantalla);

    if (saliente) {
      var vieja = saliente;
      // Se borra por tiempo y no por `transitionend`: si el evento no llega
      // (pestaña sin foco, animación cancelada), la pantalla vieja quedaría
      // pegada para siempre.
      tempSaliente = setTimeout(function () {
        if (vieja.parentNode) vieja.parentNode.removeChild(vieja);
        if (saliente === vieja) saliente = null;
        tempSaliente = null;
      }, anim.activadas ? anim.msTransicionPantalla : 0);
    }
  }

  // Dispara el fundido de entrada. Se llama al final de cada mostrarX(), cuando
  // la pantalla ya tiene todas sus capas puestas.
  function revelar() {
    if (!anim.activadas) return;
    var p = pantalla;
    // Doble rAF: el primero deja que el navegador aplique opacity 0, el segundo
    // recién ahí saca la clase para que la transición tenga de dónde salir.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { p.classList.remove('entrando'); });
    });
  }

  /* ---------------------------------------------------------------- capas */

  /* opciones:
       zona     rectángulo del botón -> pone ahí el transform-origin, para que
                escalar la capa escale el botón y no la pantalla entera
       apagada  la deja al 35% (opción descartada en el feedback)
       entrada  índice 0..3 -> entra deslizándose, escalonada
       pop      aparece con un rebotito
       latido   pulso lento infinito (el ¡EMPEZÁ! del menú) */
  function capa(src, op) {
    if (!src) return null;
    op = op || {};
    var img = document.createElement('img');
    img.className = 'capa';
    img.draggable = false;
    // Los nombres de diseño traen espacios ("02 Sports"): hay que codificarlos.
    img.src = encodeURI(src);
    img.alt = '';
    img.addEventListener('error', function () { avisar('No cargó: ' + src); });

    if (op.zona) {
      img.style.transformOrigin =
        (op.zona.x + op.zona.w / 2) + 'px ' + (op.zona.y + op.zona.h / 2) + 'px';
    }
    if (op.apagada) img.classList.add('apagada');

    if (anim.activadas) {
      if (op.entrada != null) {
        // A y C están alineadas a la izquierda en las placas, B y D a la
        // derecha: cada una entra desde su lado.
        img.classList.add(op.entrada % 2 === 0 ? 'entra-izq' : 'entra-der');
        img.style.animationDelay = (op.entrada * anim.msEscalonOpciones) + 'ms';
      } else if (op.pop) {
        img.classList.add('pop');
        img.style.animationDelay = (op.retraso || 0) + 'ms';
      } else if (op.latido) {
        img.classList.add('latido');
      }
    }

    pantalla.appendChild(img);
    return img;
  }

  function zonaTactil(z, alTocar, capaAsociada) {
    if (!z) return;
    var d = document.createElement('div');
    d.className = 'zona';
    d.style.left = z.x + 'px';
    d.style.top = z.y + 'px';
    d.style.width = z.w + 'px';
    d.style.height = z.h + 'px';
    // pointerdown y no click: en el totem se nota la diferencia de latencia.
    d.addEventListener('pointerdown', protegido(function (ev) {
      ev.preventDefault();
      if (bloqueado) return;
      bloqueado = true;
      if (anim.activadas && capaAsociada) {
        // El botón se hunde y recién ahí se cambia de pantalla. Son ~110 ms:
        // no se perciben como demora, pero sin esto tocás y no pasa nada.
        capaAsociada.classList.add('apretada');
        luego(anim.msRebotePulsacion, alTocar);
      } else {
        alTocar();
      }
    }));
    pantalla.appendChild(d);
    return d;
  }

  /* --------------------------------------------------------------- textos */

  function lienzoPintura() {
    if (pintura && pintura.parentNode === pantalla) return pintura;
    pintura = document.createElement('canvas');
    pintura.className = 'pintura';
    pintura.width = LIENZO.ancho;
    pintura.height = LIENZO.alto;
    pantalla.appendChild(pintura);
    return pintura;
  }

  // Devuelve la caja de tinta dibujada, que sirve para centrar el pulso.
  function escribir(texto, e) {
    var ctx = lienzoPintura().getContext('2d');
    ctx.clearRect(0, 0, LIENZO.ancho, LIENZO.alto);
    ctx.font = e.peso + ' ' + e.tamano + 'px "Plus Jakarta Sans"';
    if ('letterSpacing' in ctx) ctx.letterSpacing = (e.espaciado || 0) + 'px';
    ctx.fillStyle = e.color;
    ctx.textBaseline = 'alphabetic';

    // Se centra la TINTA, no la caja de avance. Con textAlign:'center' el
    // letterSpacing negativo se cuenta también después del último carácter y el
    // texto queda corrido; además "10" y "9" quedarían centrados distinto y el
    // número saltaría de lugar al bajar de 10 a 9.
    ctx.textAlign = 'left';
    var m = ctx.measureText(texto);
    var x = e.centroX;
    var alto = e.tamano * 0.72;
    if (m.actualBoundingBoxLeft !== undefined) {
      x = e.centroX - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
      alto = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    } else {
      ctx.textAlign = 'center';   // navegador viejo: se conforma con centrar el avance
    }
    ctx.fillText(texto, x, e.baseY);
    return { centroX: e.centroX, centroY: e.baseY - alto / 2 };
  }

  function pulsar(caja, ms, escala) {
    if (!anim.activadas || !pintura || !pintura.animate) return;
    pintura.style.transformOrigin = caja.centroX + 'px ' + caja.centroY + 'px';
    pintura.animate(
      [{ transform: 'scale(' + escala + ')' }, { transform: 'scale(1)' }],
      { duration: ms, easing: 'ease-out' });
  }

  /* ------------------------------------------------------------- pantallas */

  function mostrarHome() {
    nuevaPantalla();
    capa(quiz.home.fondo);
    var botones = quiz.home.botones.map(function (b) {
      return capa(b.capa, { zona: b.zona });
    });
    quiz.home.botones.forEach(function (b, i) {
      zonaTactil(b.zona, function () { elegirTema(b.tema); }, botones[i]);
    });
    revelar();
  }

  function elegirTema(id) {
    var t = null;
    for (var i = 0; i < quiz.temas.length; i++) {
      if (quiz.temas[i].id === id) t = quiz.temas[i];
    }
    if (!t) { avisar('Tema desconocido: ' + id); mostrarHome(); return; }
    tema = t;
    mostrarMenuTema();
  }

  // Pantalla "¿Cuánto sabés de deportes? / ¡EMPEZÁ!". No tiene contador a
  // propósito: es donde la trivia espera al próximo participante. Por eso el
  // ¡EMPEZÁ! late: es lo único que se mueve cuando el totem está en reposo.
  function mostrarMenuTema() {
    nuevaPantalla();
    nroPregunta = 0;
    aciertos = 0;
    capa(tema.menu.fondo);
    var empezar = capa(tema.menu.empezar.capa,
      { zona: tema.menu.empezar.zona, latido: anim.latidoEmpezar });
    var home = capa(tema.menu.home.capa, { zona: tema.menu.home.zona });
    zonaTactil(tema.menu.empezar.zona, mostrarPregunta, empezar);
    zonaTactil(tema.menu.home.zona, mostrarHome, home);
    revelar();
  }

  function preguntaActual() { return tema.preguntas[nroPregunta]; }

  function mostrarPregunta() {
    nuevaPantalla();
    var p = preguntaActual();
    capa(p.fondo);

    var capas = {};
    LETRAS.forEach(function (L, i) {
      capas[L] = capa(p.opciones[L].capa, { zona: p.opciones[L].zona, entrada: i });
    });
    var home = capa(p.home.capa, { zona: p.home.zona });

    var conf = p.contador || cfg.contador;
    var caja = escribir(String(cfg.segundosPorPregunta), conf);

    // El contador arranca cuando terminó de entrar la última opción. Si no,
    // esos ~500 ms se los estaríamos comiendo a los 10 segundos que tiene la
    // persona para leer.
    var demora = anim.activadas
      ? anim.msEntradaOpcion + anim.msEscalonOpciones * (LETRAS.length - 1)
      : 0;

    luego(demora, function () {
      var total = cfg.segundosPorPregunta * 1000;
      var arranque = performance.now();
      var ultimo = cfg.segundosPorPregunta;

      function tick(ahora) {
        var resta = total - (ahora - arranque);
        var seg = Math.max(0, Math.ceil(resta / 1000));
        if (seg !== ultimo) {
          ultimo = seg;
          pulsar(escribir(String(seg), conf), anim.msPulsoContador, 1.08);
        }
        if (resta <= 0) { raf = null; responder(null); return; }
        raf = requestAnimationFrame(tick);
      }
      // requestAnimationFrame y no setInterval: setInterval se va corriendo y el
      // totem queda prendido días enteros.
      raf = requestAnimationFrame(tick);
    });

    LETRAS.forEach(function (L) {
      zonaTactil(p.opciones[L].zona, function () { responder(L); }, capas[L]);
    });
    zonaTactil(p.home.zona, mostrarHome, home);
    revelar();
  }

  // elegida = null cuando se agotó el tiempo. Cuenta como perdida igual.
  function responder(elegida) {
    var p = preguntaActual();
    if (elegida && elegida === p.correcta) aciertos++;
    mostrarFeedback(elegida);
  }

  function mostrarFeedback(elegida) {
    nuevaPantalla();
    var p = preguntaActual();
    capa(p.fondo);

    LETRAS.forEach(function (L) {
      if (L === p.correcta) return;                    // la correcta va al final, arriba de todo
      var o = p.opciones[L];
      if (L === elegida) {
        capa(o.incorrecta || o.capa, { zona: o.zona, pop: true });
      } else {
        // Se apagan con una transición, no de golpe.
        capa(o.capa, { zona: o.zona, apagada: true });
      }
    });

    // La correcta siempre se muestra, se haya respondido o no. Si diseño mandó
    // la versión con el dato extra, va esa: el panel baja y tapa parte de la
    // opción de abajo, por eso se dibuja última. El rebote sale del centro del
    // botón, así el panel se despliega desde ahí.
    var ok = p.opciones[p.correcta];
    capa(ok.info || ok.correcta || ok.capa,
      { zona: ok.zona, pop: true, retraso: anim.msRetrasoPop });

    var home = capa(p.home.capa, { zona: p.home.zona });
    zonaTactil(p.home.zona, mostrarHome, home);

    luego(cfg.segundosFeedback * 1000, function () {
      if (nroPregunta < tema.preguntas.length - 1) { nroPregunta++; mostrarPregunta(); }
      else mostrarResultado();
    });
    revelar();
  }

  function pantallaSegunPuntaje(n) {
    var u = cfg.umbrales;
    for (var i = 0; i < u.length; i++) if (n >= u[i].desde) return u[i].pantalla;
    return u[u.length - 1].pantalla;
  }

  function mostrarResultado() {
    nuevaPantalla();
    var total = tema.preguntas.length;
    var r = quiz.resultados[pantallaSegunPuntaje(aciertos)];
    capa(r.fondo);
    var home = capa(r.home.capa, { zona: r.home.zona });

    function pintarMarcador(n) {
      return escribir(cfg.resultado.texto.replace('{n}', n).replace('{total}', total),
                      cfg.resultado);
    }
    pintarMarcador(0);

    // El marcador sube de 0 al puntaje en vez de aparecer hecho.
    if (anim.activadas && aciertos > 0) {
      luego(anim.msTransicionPantalla, function () {
        var t0 = performance.now();
        function paso(ahora) {
          var avance = Math.min(1, (ahora - t0) / anim.msConteoMarcador);
          var suave = 1 - Math.pow(1 - avance, 3);            // ease-out cúbico
          pintarMarcador(Math.round(aciertos * suave));
          if (avance < 1) { raf = requestAnimationFrame(paso); }
          else { raf = null; pulsar(pintarMarcador(aciertos), anim.msPulsoContador, 1.06); }
        }
        raf = requestAnimationFrame(paso);
      });
    } else {
      pintarMarcador(aciertos);
    }

    zonaTactil(r.home.zona, mostrarHome, home);
    luego(cfg.segundosResultado * 1000, mostrarCierre);
    revelar();
  }

  function mostrarCierre() {
    nuevaPantalla();
    capa(quiz.cierre.fondo);
    // Sin botón Home: diseño lo definió así. Dura poco y vuelve al menú del tema.
    luego(cfg.segundosCierre * 1000, function () {
      aciertos = 0;
      nroPregunta = 0;
      mostrarMenuTema();
    });
    revelar();
  }

  /* ------------------------------------------------------------- arranque */

  function escalar() {
    var e = Math.min(window.innerWidth / LIENZO.ancho, window.innerHeight / LIENZO.alto);
    document.documentElement.style.setProperty('--escala', e);
  }

  function rutasDeImagenes() {
    var r = [];
    function add(x) { if (x) r.push(x); }
    add(quiz.home.fondo);
    quiz.home.botones.forEach(function (b) { add(b.capa); });
    quiz.temas.forEach(function (t) {
      add(t.menu.fondo); add(t.menu.empezar.capa); add(t.menu.home.capa);
      t.preguntas.forEach(function (p) {
        add(p.fondo); add(p.home.capa);
        LETRAS.forEach(function (L) {
          var o = p.opciones[L];
          add(o.capa); add(o.correcta); add(o.incorrecta); add(o.info);
        });
      });
    });
    Object.keys(quiz.resultados).forEach(function (k) {
      add(quiz.resultados[k].fondo); add(quiz.resultados[k].home.capa);
    });
    add(quiz.cierre.fondo);
    return r;
  }

  function precargar() {
    // Se cargan las 163 placas antes de arrancar (~6 MB). Si alguna falla no se
    // frena el arranque: se avisa y se sigue.
    var rutas = rutasDeImagenes();
    return Promise.all(rutas.map(function (src) {
      return new Promise(function (listo) {
        var im = new Image();
        im.onload = listo;
        im.onerror = function () { avisar('No pude precargar: ' + src); listo(); };
        im.src = encodeURI(src);
      });
    }));
  }

  function blindarKiosco() {
    // Nada de menú contextual, zoom, arrastrar imágenes ni gestos del touch.
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); });
    document.addEventListener('selectstart', function (e) { e.preventDefault(); });
    document.addEventListener('wheel', function (e) {
      if (e.ctrlKey) e.preventDefault();          // Ctrl+rueda hace zoom
    }, { passive: false });
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (g) {
      document.addEventListener(g, function (e) { e.preventDefault(); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && ['+', '-', '=', '0'].indexOf(e.key) >= 0) e.preventDefault();
      if (e.key === 'F5' || e.key === 'F11') e.preventDefault();
    });

    salidaSecreta();
  }

  // El tótem no tiene teclado, así que la salida de emergencia es por toques:
  // 5 toques seguidos en la esquina superior derecha, dentro de 3 segundos.
  // Está lejos de cualquier botón, así que nadie la dispara sin querer.
  // (El camino normal es Ctrl+Shift+Alt+Q, registrado global en main.js.)
  function salidaSecreta() {
    var toques = [];
    document.addEventListener('pointerdown', function (e) {
      var enEsquina = e.clientX > window.innerWidth - 120 && e.clientY < 120;
      var ahora = Date.now();
      toques = toques.filter(function (t) { return ahora - t < 3000; });
      if (!enEsquina) { toques = []; return; }
      toques.push(ahora);
      if (toques.length >= 5) {
        toques = [];
        if (window.totem && window.totem.salir) window.totem.salir();
        else avisar('Salida secreta: solo funciona dentro de Electron');
      }
    }, true);
  }

  function aplicarTiemposCSS() {
    var r = document.documentElement.style;
    r.setProperty('--opacidad-apagada', cfg.opacidadDescartadas);
    r.setProperty('--ms-pantalla', anim.msTransicionPantalla + 'ms');
    r.setProperty('--ms-rebote', anim.msRebotePulsacion + 'ms');
    r.setProperty('--ms-entrada', anim.msEntradaOpcion + 'ms');
    r.setProperty('--ms-apagar', anim.msApagarDescartadas + 'ms');
    r.setProperty('--ms-pop', anim.msPopCorrecta + 'ms');
  }

  function arrancar() {
    escalar();
    window.addEventListener('resize', escalar);
    blindarKiosco();
    if (depurando) document.body.classList.add('debug');

    // El cursor se esconde solo en el tótem de verdad: adentro de Electron
    // (window.totem lo pone preload.js) y sin el --ventana de prueba. Abierto en
    // el navegador el puntero se ve, si no es imposible probar sin táctil.
    var enVentanaDePrueba = /[?&]ventana=1/.test(location.search);
    if (window.totem && !enVentanaDePrueba) document.body.classList.add('kiosco');

    if (!window.QUIZ) {
      cajaError.hidden = false;
      cajaError.textContent = 'No cargó quiz.js — revisá que esté al lado del index.html.';
      return;
    }
    quiz = window.QUIZ;
    cfg = quiz.config;
    anim = cfg.animaciones || { activadas: false };
    aplicarTiemposCSS();

    // La fuente tiene que estar lista antes de dibujar en canvas: si no, el
    // primer "10" sale con la tipografía por defecto y recién al segundo
    // cambia. Se espera a que cargue, pero no se frena el arranque si falla.
    var fuentes = document.fonts
      ? document.fonts.load(cfg.contador.peso + ' ' + cfg.contador.tamano + 'px "Plus Jakarta Sans"')
          .catch(function () { avisar('No cargó la tipografía'); })
      : Promise.resolve();

    Promise.all([precargar(), fuentes])
      .then(function () { protegido(mostrarHome)(); })
      .catch(function (e) {
        avisar('No pude arrancar: ' + (e && e.message ? e.message : e));
        protegido(mostrarHome)();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
