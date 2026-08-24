# Trivia Totem TAI — V2

Trivia táctil para la recepción de TAI. Corre en modo kiosco sobre un tótem
vertical de **1080×1920**, desatendida: se prende y funciona sola todo el día.

La lógica del proyecto, las decisiones y por qué se tomaron están en
`..\BRIEF.md`. Las reglas de trabajo, en `..\AGENTS.md`. Este README es el
manual de esta versión.

---

## Probar sin instalar nada

Doble click en **`probar.bat`** (o abrir `index.html` en el navegador). Funciona
igual que en el tótem, en una ventana.

Agregando `?debug=1` a la URL se pintan de rosa las zonas táctiles, para
verificar que caen justo sobre los botones de las placas.

## Correr en el tótem

Doble click en **`start.bat`**.

**No necesita Node.js, ni npm, ni `npm install`, ni internet.** El runtime de
Electron viene descomprimido en `runtime\`: es Chromium entero adentro de la
carpeta. Se copia el proyecto a cualquier Windows x64 y arranca.

La versión de Electron está **congelada en la 43.4.1**, que es con la que se
probó. Es a propósito: el brief pide que no se actualice sola. Si algún día hay
que cambiarla, se toca `descargar-runtime.bat` y se vuelve a probar todo.

> **Al copiar el proyecto al tótem, la carpeta `runtime\` tiene que ir.** Pesa
> ~357 MB y es lo único que no está en el control de versiones. Si se perdió, se
> recupera con `descargar-runtime.bat` (necesita internet una vez, y verifica el
> SHA256 contra el oficial de Electron).

### Probarlo en una máquina de escritorio

Doble click en **`probar-electron.bat`**: abre la misma app en una ventana de
540×960 con marco, cerrable con la X y con el cursor visible. Es el mismo código
que corre en el tótem, solo que sin adueñarse de la pantalla.

### ⚠️ Salir del kiosco

`start.bat` abre la trivia **sin marco, sin barra de tareas y encima de todo**.
Alt+F4, Ctrl+W, Ctrl+R, F5, F11 y el zoom están bloqueados a propósito. Hay tres
formas de salir, en este orden:

1. **`Ctrl + Shift + Alt + Q`** — es un atajo **global**: anda aunque la ventana
   no tenga el foco. Es el camino normal. (Probado.)
2. **5 toques seguidos en la esquina superior derecha**, dentro de 3 segundos —
   para el tótem, que no tiene teclado.
3. **`cerrar.bat`** — salida de emergencia, mata el proceso a la fuerza. Se
   puede lanzar con `Win+R` escribiendo la ruta del archivo, sin necesidad de
   ver el escritorio.

> Si estás probando en tu computadora y no querés que te tome la pantalla, usá
> **`probar-electron.bat`** en lugar de `start.bat`: es la misma app en una
> ventana con marco, cerrable con la X.

---

## Cómo está armado

**La app no dibuja la trivia: la muestra.** Cada pantalla es una pila de PNG de
1081×1920 con transparencia, entregados por diseño, apilados en 0,0. Encima se
ponen zonas invisibles clickeables, y se dibujan por código **solo dos textos**:
el contador de segundos y el "Acertaste N/4".

Si diseño cambia una pregunta, se reemplaza el PNG y listo. No se toca código.

```
start.bat              arranca la trivia en el tótem (esto va en Inicio)
probar-electron.bat    la misma app en una ventana chica, para probar
probar.bat             la abre en el navegador, sin Electron
cerrar.bat             salida de emergencia si quedó trabada
descargar-runtime.bat  recupera runtime\ si falta

index.html             arma el escenario y carga todo
quiz.js                TODA la configuración: temáticas, orden, placas,
                       respuestas, tiempos y zonas táctiles
js/app.js              la máquina de estados de la trivia
css/estilos.css        encaja el lienzo en la pantalla y blinda el kiosco
assets/                las placas de diseño, tal cual las entregó, + las fuentes
main.js                envoltorio Electron (ventana, kiosco, trampas de Windows)
preload.js             puente mínimo para la salida secreta
ventana.json           en qué monitor abrir
runtime/               Electron 43.4.1 descomprimido (~357 MB, no se versiona)
tools/                 utilidades de desarrollo (no las necesita la app)
```

### Flujo

```
Home (3 temáticas)
  └─> Menú del tema ("¿Cuánto sabés de deportes? / ¡EMPEZÁ!")   ← espera acá
        └─> Pregunta 1..4   10 s de contador
              └─> Feedback  5 s
        └─> Resultado (Genial / Casi / Ups)  7 s
              └─> Cierre  3 s
                    └─> vuelve al Menú del tema, indefinidamente
```

El botón Home está en todas las pantallas menos en el Home y en el Cierre, y es
la única forma de cambiar de temática.

El loop **espera en el menú del tema**, no en la primera pregunta: si volviera a
la pregunta arrancaría el contador sin nadie adelante.

### Feedback

Al tocar una opción, o al agotarse los 10 segundos:

- la opción tocada se cambia por su capa `_Incorrecta` (o `_Correcta`),
- **la correcta siempre se muestra**, se haya respondido o no,
- las otras se dejan a `opacidadDescartadas` (0.35),
- si diseño entregó una capa `_CorrectaInfo` (la que trae el dato extra), se usa
  esa en lugar de la `_Correcta`. Ese panel baja y tapa parte de la opción de
  abajo: es así en el diseño, por eso se dibuja última.

---

## Animaciones (lo nuevo de V2)

V1 era correcta pero seca: todo pasaba en un solo cuadro. V2 agrega movimiento
**sin un asset nuevo**, aprovechando que cada elemento ya es una capa propia y
que en `quiz.js` está medido el rectángulo de cada botón.

| Dónde | Qué hace |
|---|---|
| **Al tocar un botón** | Se hunde a 0,96 y recién ahí cambia de pantalla (110 ms). Sin esto tocás y no pasa nada hasta que aparece el resultado. |
| **Entrada de la pregunta** | Las 4 opciones se deslizan desde su lado —A y C desde la izquierda, B y D desde la derecha, igual que su alineación en las placas— escalonadas cada 60 ms. |
| **Feedback** | Las descartadas se apagan con una transición en vez de saltar al 35%. La elegida y la correcta aparecen con un rebote corto. El panel de info se despliega desde el centro de su botón. |
| **Contador** | Pulso corto en cada segundo. El color queda verde, como lo definió diseño. |
| **Marcador** | Sube de 0 al puntaje en 600 ms en vez de aparecer hecho. |
| **Menú del tema** | El ¡EMPEZÁ! late lento e infinito. Es la pantalla donde el tótem descansa: que algo respire hace que de lejos se note que está vivo. |
| **Entre pantallas** | La nueva aparece por encima de la anterior, que se queda opaca debajo hasta que la de arriba terminó. Así el cruce nunca deja ver el fondo pelado. |

### Reglas que respetan

- **Ninguna animación decide nada.** Los tiempos y la máquina de estados mandan
  igual que en V1. Nunca se espera un `animationend` para cambiar de pantalla:
  si una animación no arranca, la trivia avanza lo mismo.
- **Solo `transform` y `opacity`**, que son las dos propiedades que Chromium
  resuelve en la placa de video. Nada de filtros ni sombras sobre imágenes de
  1081×1920.
- **El contador arranca cuando terminó de entrar la última opción** (~500 ms).
  Si no, ese tiempo se lo estaríamos comiendo a los 10 segundos que tiene la
  persona para leer.
- Se respeta `prefers-reduced-motion` del sistema operativo.

### Apagarlas o ajustarlas

Todo está en `quiz.js` → `config.animaciones`. Con `"activadas": false` la
trivia queda exactamente como V1, instantánea, sin tocar código:

```js
"animaciones": {
  "activadas": true,
  "msTransicionPantalla": 260,   "msRebotePulsacion": 110,
  "msEntradaOpcion": 320,        "msEscalonOpciones": 60,
  "msApagarDescartadas": 300,    "msPopCorrecta": 320,
  "msRetrasoPop": 140,           "msPulsoContador": 180,
  "msConteoMarcador": 600,       "latidoEmpezar": true
}
```

### Cómo está hecho por dentro

Cada pantalla es ahora un `<div class="pantalla">` propio, y las capas viven
adentro. Eso es lo único que cambió estructuralmente respecto de V1, y es lo que
permite cruzar de una pantalla a otra.

El truco que habilita el resto: las capas son PNG de 1081×1920, así que un
`scale()` normal escalaría alrededor del centro de la pantalla y el botón
saldría volando. `app.js` le pone a cada capa un **`transform-origin` en el
centro de su propio botón**, sacado de la zona táctil que ya estaba medida. A
partir de ahí cada capa se anima como si fuera un elemento suelto.

---

## Los dos textos que dibuja la app

Se dibujan en un `<canvas>` sobre las placas, con la tipografía de diseño
(Plus Jakarta Sans). Los valores salieron de medir los píxeles de las placas de
`Referencia` y están en `quiz.js` → `config`:

| | contador | resultado |
|---|---|---|
| texto | los segundos que quedan | `Acertaste {n}/{total}` |
| tamaño | 160 px | 74 px |
| peso | 700 | 700 |
| color | `#B5FF00` | `#FFFFFF` |
| espaciado | −4 px | −1,3 px |
| centro X / línea de base | 542,5 / 508 | 539,5 / 1095 |

Con estos valores el `10` cae exactamente en `x 462..623, y 386..509` y el
`Acertaste 9/10` en `x 283..796, y 1039..1103`: los mismos píxeles que las
placas de Referencia.

Se centra la **tinta** (el bounding box real, medido con `measureText`) y no la
caja de avance. Si se centrara el avance, el `letterSpacing` negativo cuenta
también después del último carácter y el texto queda corrido; además `10` y `9`
quedarían centrados distinto y el número saltaría de lugar al bajar de 10 a 9.

---

## Cambiar cosas

**Tiempos, umbrales, textos** → `quiz.js`, sección `config`:

```js
"segundosPorPregunta": 10,
"segundosFeedback": 5,
"segundosResultado": 7,
"segundosCierre": 3,
"opacidadDescartadas": 0.35,
"umbrales": [ {"desde": 4, "pantalla": "genial"},
              {"desde": 2, "pantalla": "casi"},
              {"desde": 0, "pantalla": "ups"} ]
```

**Una respuesta correcta** → el campo `correcta` de esa pregunta en `quiz.js`.

**Placas nuevas de diseño** → se pisan los PNG dentro de `assets\` respetando
los nombres, y se corre:

```bash
python tools/generar_quiz.py
```

Recalcula las zonas táctiles (el bounding box de lo opaco de cada capa) y vuelve
a detectar cuál es la correcta a partir del nombre del archivo. Necesita Pillow
(`pip install pillow`). **La app no lo necesita**: en runtime solo lee `quiz.js`.

### Por qué `quiz.js` y no `quiz.json`

Chrome bloquea `fetch()` sobre `file://`, y el proyecto pide poder abrir el
`index.html` a mano desde el disco sin levantar ningún servidor. Envuelto en
`window.QUIZ = {...}` entra por un `<script>` y funciona igual desde el disco,
desde Electron y desde un servidor. **De la primera llave en adelante es JSON
común** y se edita igual.

---

## Cosas del hardware ya resueltas (no volver a descubrirlas)

- `force-device-scale-factor 1`: sin esto, el escalado DPI de Windows hace que
  1080×1920 no sean píxeles físicos y la placa entra mal.
- **No se usa el fullscreen nativo de Electron**: en monitores secundarios abre
  en la pantalla equivocada y no tapa la barra de tareas. Se usa `setBounds()`
  sobre los bounds del display destino, más `alwaysOnTop`.
- `setBounds()` va **después** de crear la ventana, no pasando x/y al
  constructor, y se repite en `ready-to-show` porque Windows a veces la corre.
- `disable-pinch`: el touch de Windows manda gestos de pinch que hacen zoom
  sobre la placa.
- `backgroundThrottling: false`: si no, al perder foco Chromium frena los
  timers y el contador se atrasa.
- El contador usa `requestAnimationFrame` y no `setInterval`: `setInterval` se
  va corriendo y el tótem queda prendido días enteros.
- Si el renderer se cae o deja de responder, Electron lo recarga solo en vez de
  dejar la pantalla en blanco.

---

## Cosas para avisarle a diseño

1. **Las placas son 1081×1920, no 1080×1920.** Un píxel de más en el ancho. La
   app lo absorbe (el escenario mide 1081 y se escala para entrar), pero si en
   el próximo export sale a 1080 queda más prolijo.
2. **La pregunta de la paleta de TAI (`18 Pregunta D Tai`) tiene las opciones C
   y D idénticas**: las dos dicen "BLANCO + NEGRO + TURQUESA + AZUL +
   AMARILLO". La correcta es la A, así que el juego funciona, pero visualmente
   queda raro. Viene arrastrado del documento original. **Queda pendiente.**
3. Las placas de resultado se diseñaron con `/10` ("Acertaste 9/10") pero son
   4 preguntas por temática, así que en pantalla se lee `Acertaste 3/4`.
4. El contador de `18 Pregunta D Tai` está 10 px más abajo que en las otras 11
   placas. La app usa la misma posición para todas, para que no salte durante el
   loop.
5. Los nombres de archivo vienen con mayúsculas y minúsculas mezcladas
   (`03_A_incorrecta.png`, `09_a.png`) y uno sin la letra
   (`06_CorrectaInfo.png`). Está contemplado, pero conviene unificarlo.

---

## Pendiente para la prueba en el tótem

- Verificar el 1080×1920 físico y la latencia del touch.
- Confirmar que no aparece el cursor.
- Dejar el arranque automático al prender la máquina (acceso directo a
  `start.bat` en la carpeta Inicio de Windows).
- Probar el corte de luz: apagar de golpe y verificar que vuelve solo.
