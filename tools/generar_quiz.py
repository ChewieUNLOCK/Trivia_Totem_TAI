# -*- coding: utf-8 -*-
"""
Regenera quiz.js leyendo la carpeta assets/.

Cuando diseno vuelve a entregar placas: se pisan los PNG dentro de assets/ y se
corre este script. Recalcula las zonas tactiles (bounding box de los pixeles no
transparentes de cada capa de opcion) y vuelve a detectar cual es la correcta a
partir del nombre de archivo (_Correcta / _Incorrecta).

    python tools/generar_quiz.py

Requiere Pillow (pip install pillow). La app NO lo necesita: en runtime solo lee
quiz.js.
"""
from PIL import Image
import json, os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(RAIZ, "assets")

# --- estructura de la trivia (lo unico escrito a mano) ---------------------
HOME_DIR = "01 MENU TRIVIA"
HOME_BOTONES = [("sports", "01_A.png"), ("entertainment", "02_B.png"), ("tai", "03_C.png")]

TEMAS = [
    {"id": "sports", "nombre": "Sports", "dir": "02 Sports",
     "menu": ("02 Menu Sports", "02"),
     "preguntas": [("03 Pregunta A Sports", "03"), ("04 Pregunta B Sports", "04"),
                   ("05 Pregunta C Sports", "05"), ("06 Pregunta D Sports", "06")]},
    {"id": "entertainment", "nombre": "Entertainment", "dir": "07 Entretenimiento",
     "menu": ("08 Menu Entertainment", "08"),
     "preguntas": [("09 Pregunta A Entretenimiento", "09"), ("10 Pregunta B Entretenimiento", "10"),
                   ("11 Pregunta C Entretenimiento", "11"), ("12 Pregunta D Entretenimiento", "12")]},
    {"id": "tai", "nombre": "TAI", "dir": "13 TAI",
     "menu": ("14 Menu Tai", "14"),
     "preguntas": [("15 Pregunta A Tai", "15"), ("16 Pregunta B Tai", "16"),
                   ("17 Pregunta C Tai", "17"), ("18 Pregunta D Tai", "18")]},
]

RESULTADOS = [("19 Genial Casi UPS/20 Genial", "20", "genial"),
              ("19 Genial Casi UPS/21 CASI", "21", "casi"),
              ("19 Genial Casi UPS/22 UPS", "22", "ups")]
CIERRE_DIR = "23 Cierre"
LETRAS = ["A", "B", "C", "D"]

# --- helpers ---------------------------------------------------------------

def indice(carpeta):
    """{nombre en minuscula: nombre real}. Diseno mezcla mayusculas y minusculas
    (03_A_incorrecta.png, 09_a.png), asi que nunca se busca por nombre exacto."""
    d = os.path.join(ASSETS, carpeta)
    return {f.lower(): f for f in os.listdir(d) if f.lower().endswith(".png")}

def ruta(carpeta, archivo):
    return "assets/" + carpeta.replace("\\", "/") + "/" + archivo

def buscar(idx, carpeta, *nombres):
    for n in nombres:
        real = idx.get(n.lower())
        if real:
            return ruta(carpeta, real)
    return None

def zona(carpeta, rel):
    """Bounding box de lo opaco. Es la zona tactil: cada boton vive en su propia
    banda vertical, asi que las cajas nunca se pisan entre si."""
    p = os.path.join(RAIZ, rel.replace("/", os.sep))
    im = Image.open(p).convert("RGBA")
    bb = im.getchannel("A").point(lambda a: 255 if a > 16 else 0).getbbox()
    if not bb:
        raise SystemExit("Capa totalmente transparente: " + rel)
    x0, y0, x1, y1 = bb
    return {"x": x0, "y": y0, "w": x1 - x0, "h": y1 - y0}

def capa_y_zona(idx, carpeta, archivo):
    r = buscar(idx, carpeta, archivo)
    if not r:
        raise SystemExit("Falta %s en %s" % (archivo, carpeta))
    return {"capa": r, "zona": zona(carpeta, r)}

# --- armado ----------------------------------------------------------------

def pregunta(carpeta, n):
    idx = indice(carpeta)
    fondo = buscar(idx, carpeta, "%s_Fondo.png" % n)
    home = capa_y_zona(idx, carpeta, "%s_E.png" % n)

    correcta = None
    opciones = {}
    for L in LETRAS:
        base = buscar(idx, carpeta, "%s_%s.png" % (n, L))
        if not base:
            raise SystemExit("Falta la opcion %s de %s" % (L, carpeta))
        ok = buscar(idx, carpeta, "%s_%s_Correcta.png" % (n, L))
        mal = buscar(idx, carpeta, "%s_%s_Incorrecta.png" % (n, L))
        info = buscar(idx, carpeta, "%s_%s_CorrectaInfo.png" % (n, L))
        if ok:
            correcta = L
            # 06_CorrectaInfo.png viene sin la letra; se la asigna a la correcta
            info = info or buscar(idx, carpeta, "%s_CorrectaInfo.png" % n)
        opciones[L] = {"capa": base, "zona": zona(carpeta, base),
                       "correcta": ok, "incorrecta": mal, "info": info}
    if not correcta:
        raise SystemExit("Ninguna opcion marcada _Correcta en " + carpeta)
    for L in LETRAS:
        if L != correcta and not opciones[L]["incorrecta"]:
            print("  AVISO: %s no tiene capa _Incorrecta en %s" % (L, carpeta))
    return {"fondo": fondo, "correcta": correcta, "opciones": opciones, "home": home}

def main():
    if not os.path.isdir(ASSETS):
        raise SystemExit("No encuentro " + ASSETS)

    idx = indice(HOME_DIR)
    home = {"fondo": buscar(idx, HOME_DIR, "01_Fondo.png"), "botones": []}
    for tema, arch in HOME_BOTONES:
        c = capa_y_zona(idx, HOME_DIR, arch)
        c["tema"] = tema
        home["botones"].append(c)

    temas = []
    for t in TEMAS:
        mdir = t["dir"] + "/" + t["menu"][0]
        mn = t["menu"][1]
        midx = indice(mdir)
        menu = {"fondo": buscar(midx, mdir, "%s_Fondo.png" % mn),
                "empezar": capa_y_zona(midx, mdir, "%s_A.png" % mn),
                "home": capa_y_zona(midx, mdir, "%s_B.png" % mn)}
        preguntas = [pregunta(t["dir"] + "/" + d, n) for d, n in t["preguntas"]]
        temas.append({"id": t["id"], "nombre": t["nombre"], "menu": menu, "preguntas": preguntas})
        print("%-14s %d preguntas, correctas: %s" %
              (t["id"], len(preguntas), " ".join(p["correcta"] for p in preguntas)))

    resultados = {}
    for d, n, clave in RESULTADOS:
        ridx = indice(d)
        resultados[clave] = {"fondo": buscar(ridx, d, "%s_Fondo.png" % n),
                             "home": capa_y_zona(ridx, d, "%s_A.png" % n)}

    cidx = indice(CIERRE_DIR)
    cierre = {"fondo": buscar(cidx, CIERRE_DIR, "23_Fondo.png")}

    quiz = {
        "_leeme": "Generado por tools/generar_quiz.py. Se puede editar a mano: es JSON comun. Las zonas estan en pixeles del lienzo de 1081x1920.",
        "config": {
            "lienzo": {"ancho": 1081, "alto": 1920},
            "segundosPorPregunta": 10,
            "segundosFeedback": 5,
            "segundosResultado": 7,
            "segundosCierre": 3,
            "opacidadDescartadas": 0.35,
            # Medidos sobre las placas de Referencia (ver README, "Los dos
            # textos que dibuja la app"). centroX/baseY son donde tiene que caer
            # la tinta: centro horizontal y linea de base.
            "contador": {"tamano": 160, "peso": 700, "color": "#B5FF00",
                         "espaciado": -4, "centroX": 542.5, "baseY": 508},
            "resultado": {"texto": "Acertaste {n}/{total}", "tamano": 74, "peso": 700,
                          "color": "#FFFFFF", "espaciado": -1.3,
                          "centroX": 539.5, "baseY": 1095},
            "umbrales": [{"desde": 4, "pantalla": "genial"},
                         {"desde": 2, "pantalla": "casi"},
                         {"desde": 0, "pantalla": "ups"}],
            # Animaciones. "activadas": false deja todo instantaneo, como en V1.
            # Los tiempos son en milisegundos. Ninguna animacion decide nada: si
            # no corre, la trivia avanza igual.
            "animaciones": {
                "activadas": True,
                "msTransicionPantalla": 260,
                "msRebotePulsacion": 110,
                "msEntradaOpcion": 320,
                "msEscalonOpciones": 60,
                "msApagarDescartadas": 300,
                "msPopCorrecta": 320,
                "msRetrasoPop": 140,
                "msPulsoContador": 180,
                "msConteoMarcador": 600,
                "latidoEmpezar": True
            }
        },
        "home": home,
        "temas": temas,
        "resultados": resultados,
        "cierre": cierre
    }

    # Se escribe como .js y no como .json a proposito: Chrome bloquea fetch()
    # sobre file://, y el proyecto pide poder abrir index.html a mano sin
    # levantar ningun servidor. Envuelto en "window.QUIZ =" entra por <script>
    # y funciona igual desde el disco, desde Electron y desde un servidor.
    destino = os.path.join(RAIZ, "quiz.js")
    with open(destino, "w", encoding="utf-8") as f:
        f.write("/* Configuracion de la trivia. Generado por tools/generar_quiz.py.\n")
        f.write("   Se puede editar a mano: de la primera llave en adelante es JSON comun. */\n")
        f.write("window.QUIZ = ")
        json.dump(quiz, f, indent=2, ensure_ascii=False)
        f.write(";\n")
    print("")
    print("Escrito " + destino)

if __name__ == "__main__":
    main()
