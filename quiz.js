/* Configuracion de la trivia. Generado por tools/generar_quiz.py.
   Se puede editar a mano: de la primera llave en adelante es JSON comun. */
window.QUIZ = {
  "_leeme": "Generado por tools/generar_quiz.py. Se puede editar a mano: es JSON comun. Las zonas estan en pixeles del lienzo de 1081x1920.",
  "config": {
    "lienzo": {
      "ancho": 1081,
      "alto": 1920
    },
    "segundosPorPregunta": 10,
    "segundosFeedback": 5,
    "segundosResultado": 7,
    "segundosCierre": 3,
    "opacidadDescartadas": 0.35,
    "contador": {
      "tamano": 160,
      "peso": 700,
      "color": "#B5FF00",
      "espaciado": -4,
      "centroX": 542.5,
      "baseY": 508
    },
    "resultado": {
      "texto": "Acertaste {n}/{total}",
      "tamano": 74,
      "peso": 700,
      "color": "#FFFFFF",
      "espaciado": -1.3,
      "centroX": 539.5,
      "baseY": 1095
    },
    "umbrales": [
      {
        "desde": 4,
        "pantalla": "genial"
      },
      {
        "desde": 2,
        "pantalla": "casi"
      },
      {
        "desde": 0,
        "pantalla": "ups"
      }
    ],
    "animaciones": {
      "activadas": true,
      "msTransicionPantalla": 260,
      "msRebotePulsacion": 110,
      "msEntradaOpcion": 320,
      "msEscalonOpciones": 60,
      "msApagarDescartadas": 300,
      "msPopCorrecta": 320,
      "msRetrasoPop": 140,
      "msPulsoContador": 180,
      "msConteoMarcador": 600,
      "latidoEmpezar": true
    }
  },
  "home": {
    "fondo": "assets/01 MENU TRIVIA/01_Fondo.png",
    "botones": [
      {
        "capa": "assets/01 MENU TRIVIA/01_A.png",
        "zona": {
          "x": 127,
          "y": 637,
          "w": 841,
          "h": 210
        },
        "tema": "sports"
      },
      {
        "capa": "assets/01 MENU TRIVIA/02_B.png",
        "zona": {
          "x": 124,
          "y": 896,
          "w": 844,
          "h": 210
        },
        "tema": "entertainment"
      },
      {
        "capa": "assets/01 MENU TRIVIA/03_C.png",
        "zona": {
          "x": 121,
          "y": 1156,
          "w": 844,
          "h": 210
        },
        "tema": "tai"
      }
    ]
  },
  "temas": [
    {
      "id": "sports",
      "nombre": "Sports",
      "menu": {
        "fondo": "assets/02 Sports/02 Menu Sports/02_Fondo.png",
        "empezar": {
          "capa": "assets/02 Sports/02 Menu Sports/02_A.png",
          "zona": {
            "x": 123,
            "y": 917,
            "w": 834,
            "h": 261
          }
        },
        "home": {
          "capa": "assets/02 Sports/02 Menu Sports/02_B.png",
          "zona": {
            "x": 92,
            "y": 1436,
            "w": 90,
            "h": 90
          }
        }
      },
      "preguntas": [
        {
          "fondo": "assets/02 Sports/03 Pregunta A Sports/03_Fondo.png",
          "correcta": "B",
          "opciones": {
            "A": {
              "capa": "assets/02 Sports/03 Pregunta A Sports/03_A.png",
              "zona": {
                "x": 83,
                "y": 824,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/03 Pregunta A Sports/03_A_incorrecta.png",
              "info": null
            },
            "B": {
              "capa": "assets/02 Sports/03 Pregunta A Sports/03_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": "assets/02 Sports/03 Pregunta A Sports/03_B_Correcta.png",
              "incorrecta": null,
              "info": "assets/02 Sports/03 Pregunta A Sports/03_B_CorrectaInfo.png"
            },
            "C": {
              "capa": "assets/02 Sports/03 Pregunta A Sports/03_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/03 Pregunta A Sports/03_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/02 Sports/03 Pregunta A Sports/03_D.png",
              "zona": {
                "x": 480,
                "y": 1275,
                "w": 521,
                "h": 130
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/03 Pregunta A Sports/03_D_Incorrecta.png",
              "info": null
            }
          },
          "home": {
            "capa": "assets/02 Sports/03 Pregunta A Sports/03_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        },
        {
          "fondo": "assets/02 Sports/04 Pregunta B Sports/04_Fondo.png",
          "correcta": "B",
          "opciones": {
            "A": {
              "capa": "assets/02 Sports/04 Pregunta B Sports/04_A.png",
              "zona": {
                "x": 83,
                "y": 824,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/04 Pregunta B Sports/04_A_Incorrecta.png",
              "info": null
            },
            "B": {
              "capa": "assets/02 Sports/04 Pregunta B Sports/04_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": "assets/02 Sports/04 Pregunta B Sports/04_B_Correcta.png",
              "incorrecta": null,
              "info": "assets/02 Sports/04 Pregunta B Sports/04_B_CorrectaInfo.png"
            },
            "C": {
              "capa": "assets/02 Sports/04 Pregunta B Sports/04_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/04 Pregunta B Sports/04_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/02 Sports/04 Pregunta B Sports/04_D.png",
              "zona": {
                "x": 480,
                "y": 1275,
                "w": 521,
                "h": 130
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/04 Pregunta B Sports/04_D_Incorrecta.png",
              "info": null
            }
          },
          "home": {
            "capa": "assets/02 Sports/04 Pregunta B Sports/04_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        },
        {
          "fondo": "assets/02 Sports/05 Pregunta C Sports/05_Fondo.png",
          "correcta": "D",
          "opciones": {
            "A": {
              "capa": "assets/02 Sports/05 Pregunta C Sports/05_A.png",
              "zona": {
                "x": 83,
                "y": 824,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/05 Pregunta C Sports/05_A_Incorrecta.png",
              "info": null
            },
            "B": {
              "capa": "assets/02 Sports/05 Pregunta C Sports/05_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/05 Pregunta C Sports/05_B_Incorrecta.png",
              "info": null
            },
            "C": {
              "capa": "assets/02 Sports/05 Pregunta C Sports/05_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/05 Pregunta C Sports/05_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/02 Sports/05 Pregunta C Sports/05_D.png",
              "zona": {
                "x": 471,
                "y": 1274,
                "w": 530,
                "h": 130
              },
              "correcta": "assets/02 Sports/05 Pregunta C Sports/05_D_Correcta.png",
              "incorrecta": null,
              "info": null
            }
          },
          "home": {
            "capa": "assets/02 Sports/05 Pregunta C Sports/05_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        },
        {
          "fondo": "assets/02 Sports/06 Pregunta D Sports/06_Fondo.png",
          "correcta": "D",
          "opciones": {
            "A": {
              "capa": "assets/02 Sports/06 Pregunta D Sports/06_A.png",
              "zona": {
                "x": 83,
                "y": 824,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/06 Pregunta D Sports/06_A_Incorrecta.png",
              "info": null
            },
            "B": {
              "capa": "assets/02 Sports/06 Pregunta D Sports/06_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/06 Pregunta D Sports/06_B_Incorrecta.png",
              "info": null
            },
            "C": {
              "capa": "assets/02 Sports/06 Pregunta D Sports/06_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/02 Sports/06 Pregunta D Sports/06_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/02 Sports/06 Pregunta D Sports/06_D.png",
              "zona": {
                "x": 455,
                "y": 1275,
                "w": 546,
                "h": 130
              },
              "correcta": "assets/02 Sports/06 Pregunta D Sports/06_D_Correcta.png",
              "incorrecta": null,
              "info": "assets/02 Sports/06 Pregunta D Sports/06_CorrectaInfo.png"
            }
          },
          "home": {
            "capa": "assets/02 Sports/06 Pregunta D Sports/06_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        }
      ]
    },
    {
      "id": "entertainment",
      "nombre": "Entertainment",
      "menu": {
        "fondo": "assets/07 Entretenimiento/08 Menu Entertainment/08_Fondo.png",
        "empezar": {
          "capa": "assets/07 Entretenimiento/08 Menu Entertainment/08_A.png",
          "zona": {
            "x": 123,
            "y": 917,
            "w": 834,
            "h": 261
          }
        },
        "home": {
          "capa": "assets/07 Entretenimiento/08 Menu Entertainment/08_B.png",
          "zona": {
            "x": 92,
            "y": 1436,
            "w": 90,
            "h": 90
          }
        }
      },
      "preguntas": [
        {
          "fondo": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_Fondo.png",
          "correcta": "B",
          "opciones": {
            "A": {
              "capa": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_a.png",
              "zona": {
                "x": 83,
                "y": 824,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_A_Incorrecta.png",
              "info": null
            },
            "B": {
              "capa": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_b.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_B_Correcta.png",
              "incorrecta": null,
              "info": null
            },
            "C": {
              "capa": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_D.png",
              "zona": {
                "x": 480,
                "y": 1275,
                "w": 521,
                "h": 130
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_D_Incorrecta.png",
              "info": null
            }
          },
          "home": {
            "capa": "assets/07 Entretenimiento/09 Pregunta A Entretenimiento/09_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        },
        {
          "fondo": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_Fondo.png",
          "correcta": "A",
          "opciones": {
            "A": {
              "capa": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_A.png",
              "zona": {
                "x": 83,
                "y": 824,
                "w": 520,
                "h": 131
              },
              "correcta": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_A_Correcta.png",
              "incorrecta": null,
              "info": null
            },
            "B": {
              "capa": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_B_Incorrecta.png",
              "info": null
            },
            "C": {
              "capa": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_D.png",
              "zona": {
                "x": 480,
                "y": 1275,
                "w": 521,
                "h": 130
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_D_Incorrecta.png",
              "info": null
            }
          },
          "home": {
            "capa": "assets/07 Entretenimiento/10 Pregunta B Entretenimiento/10_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        },
        {
          "fondo": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_Fondo.png",
          "correcta": "B",
          "opciones": {
            "A": {
              "capa": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_A.png",
              "zona": {
                "x": 83,
                "y": 824,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_A_Incorrecta.png",
              "info": null
            },
            "B": {
              "capa": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_B_Correcta.png",
              "incorrecta": null,
              "info": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_B_CorrectaInfo.png"
            },
            "C": {
              "capa": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_D.png",
              "zona": {
                "x": 480,
                "y": 1275,
                "w": 521,
                "h": 130
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_D_Incorrecta.png",
              "info": null
            }
          },
          "home": {
            "capa": "assets/07 Entretenimiento/11 Pregunta C Entretenimiento/11_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        },
        {
          "fondo": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_Fondo.png",
          "correcta": "D",
          "opciones": {
            "A": {
              "capa": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_A.png",
              "zona": {
                "x": 83,
                "y": 824,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_A_Incorrecta.png",
              "info": null
            },
            "B": {
              "capa": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_B_Incorrecta.png",
              "info": null
            },
            "C": {
              "capa": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_D.png",
              "zona": {
                "x": 480,
                "y": 1275,
                "w": 521,
                "h": 130
              },
              "correcta": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_D_Correcta.png",
              "incorrecta": null,
              "info": null
            }
          },
          "home": {
            "capa": "assets/07 Entretenimiento/12 Pregunta D Entretenimiento/12_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        }
      ]
    },
    {
      "id": "tai",
      "nombre": "TAI",
      "menu": {
        "fondo": "assets/13 TAI/14 Menu Tai/14_Fondo.png",
        "empezar": {
          "capa": "assets/13 TAI/14 Menu Tai/14_A.png",
          "zona": {
            "x": 123,
            "y": 917,
            "w": 834,
            "h": 261
          }
        },
        "home": {
          "capa": "assets/13 TAI/14 Menu Tai/14_B.png",
          "zona": {
            "x": 92,
            "y": 1436,
            "w": 90,
            "h": 90
          }
        }
      },
      "preguntas": [
        {
          "fondo": "assets/13 TAI/15 Pregunta A Tai/15_Fondo.png",
          "correcta": "C",
          "opciones": {
            "A": {
              "capa": "assets/13 TAI/15 Pregunta A Tai/15_A.png",
              "zona": {
                "x": 83,
                "y": 825,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/15 Pregunta A Tai/15_A_Incorrecta.png",
              "info": null
            },
            "B": {
              "capa": "assets/13 TAI/15 Pregunta A Tai/15_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/15 Pregunta A Tai/15_B_Incorrecta.png",
              "info": null
            },
            "C": {
              "capa": "assets/13 TAI/15 Pregunta A Tai/15_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": "assets/13 TAI/15 Pregunta A Tai/15_C_Correcta.png",
              "incorrecta": null,
              "info": null
            },
            "D": {
              "capa": "assets/13 TAI/15 Pregunta A Tai/15_D.png",
              "zona": {
                "x": 480,
                "y": 1275,
                "w": 521,
                "h": 130
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/15 Pregunta A Tai/15_D_Incorrecta.png",
              "info": null
            }
          },
          "home": {
            "capa": "assets/13 TAI/15 Pregunta A Tai/15_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        },
        {
          "fondo": "assets/13 TAI/16 Pregunta B Tai/16_Fondo.png",
          "correcta": "A",
          "opciones": {
            "A": {
              "capa": "assets/13 TAI/16 Pregunta B Tai/16_A.png",
              "zona": {
                "x": 83,
                "y": 825,
                "w": 520,
                "h": 131
              },
              "correcta": "assets/13 TAI/16 Pregunta B Tai/16_A_Correcta.png",
              "incorrecta": null,
              "info": null
            },
            "B": {
              "capa": "assets/13 TAI/16 Pregunta B Tai/16_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/16 Pregunta B Tai/16_B_Incorrecta.png",
              "info": null
            },
            "C": {
              "capa": "assets/13 TAI/16 Pregunta B Tai/16_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/16 Pregunta B Tai/16_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/13 TAI/16 Pregunta B Tai/16_D.png",
              "zona": {
                "x": 480,
                "y": 1275,
                "w": 521,
                "h": 130
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/16 Pregunta B Tai/16_D_Incorrecta.png",
              "info": null
            }
          },
          "home": {
            "capa": "assets/13 TAI/16 Pregunta B Tai/16_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        },
        {
          "fondo": "assets/13 TAI/17 Pregunta C Tai/17_Fondo.png",
          "correcta": "C",
          "opciones": {
            "A": {
              "capa": "assets/13 TAI/17 Pregunta C Tai/17_A.png",
              "zona": {
                "x": 83,
                "y": 825,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/17 Pregunta C Tai/17_A_Incorrecta.png",
              "info": null
            },
            "B": {
              "capa": "assets/13 TAI/17 Pregunta C Tai/17_B.png",
              "zona": {
                "x": 485,
                "y": 961,
                "w": 520,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/17 Pregunta C Tai/17_B_Incorrecta.png",
              "info": null
            },
            "C": {
              "capa": "assets/13 TAI/17 Pregunta C Tai/17_C.png",
              "zona": {
                "x": 83,
                "y": 1130,
                "w": 521,
                "h": 131
              },
              "correcta": "assets/13 TAI/17 Pregunta C Tai/17_C_Correcta.png",
              "incorrecta": null,
              "info": null
            },
            "D": {
              "capa": "assets/13 TAI/17 Pregunta C Tai/17_D.png",
              "zona": {
                "x": 480,
                "y": 1275,
                "w": 521,
                "h": 130
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/17 Pregunta C Tai/17_D_Incorrecta.png",
              "info": null
            }
          },
          "home": {
            "capa": "assets/13 TAI/17 Pregunta C Tai/17_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        },
        {
          "fondo": "assets/13 TAI/18 Pregunta D Tai/18_Fondo.png",
          "correcta": "A",
          "opciones": {
            "A": {
              "capa": "assets/13 TAI/18 Pregunta D Tai/18_A.png",
              "zona": {
                "x": 53,
                "y": 782,
                "w": 793,
                "h": 131
              },
              "correcta": "assets/13 TAI/18 Pregunta D Tai/18_A_Correcta.png",
              "incorrecta": null,
              "info": null
            },
            "B": {
              "capa": "assets/13 TAI/18 Pregunta D Tai/18_B.png",
              "zona": {
                "x": 189,
                "y": 946,
                "w": 816,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/18 Pregunta D Tai/18_B_Incorrecta.png",
              "info": null
            },
            "C": {
              "capa": "assets/13 TAI/18 Pregunta D Tai/18_C.png",
              "zona": {
                "x": 53,
                "y": 1107,
                "w": 793,
                "h": 131
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/18 Pregunta D Tai/18_C_Incorrecta.png",
              "info": null
            },
            "D": {
              "capa": "assets/13 TAI/18 Pregunta D Tai/18_D.png",
              "zona": {
                "x": 122,
                "y": 1262,
                "w": 879,
                "h": 130
              },
              "correcta": null,
              "incorrecta": "assets/13 TAI/18 Pregunta D Tai/18_D_Incorrecta.png",
              "info": null
            }
          },
          "home": {
            "capa": "assets/13 TAI/18 Pregunta D Tai/18_E.png",
            "zona": {
              "x": 95,
              "y": 1436,
              "w": 89,
              "h": 89
            }
          }
        }
      ]
    }
  ],
  "resultados": {
    "genial": {
      "fondo": "assets/19 Genial Casi UPS/20 Genial/20_Fondo.png",
      "home": {
        "capa": "assets/19 Genial Casi UPS/20 Genial/20_A.png",
        "zona": {
          "x": 92,
          "y": 1436,
          "w": 90,
          "h": 90
        }
      }
    },
    "casi": {
      "fondo": "assets/19 Genial Casi UPS/21 CASI/21_Fondo.png",
      "home": {
        "capa": "assets/19 Genial Casi UPS/21 CASI/21_A.png",
        "zona": {
          "x": 92,
          "y": 1436,
          "w": 90,
          "h": 90
        }
      }
    },
    "ups": {
      "fondo": "assets/19 Genial Casi UPS/22 UPS/22_Fondo.png",
      "home": {
        "capa": "assets/19 Genial Casi UPS/22 UPS/22_A.png",
        "zona": {
          "x": 92,
          "y": 1436,
          "w": 90,
          "h": 90
        }
      }
    }
  },
  "cierre": {
    "fondo": "assets/23 Cierre/23_Fondo.png"
  }
};
