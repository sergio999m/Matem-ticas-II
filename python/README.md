# Scripts de Python (uso en Google Colab)

Estos scripts son el soporte en **Python** que pide el parcial ("Google Colab: para
desarrollo de código Python y documentación"). No forman parte del sitio web —
son evidencia de trabajo numérico/simbólico, pensados para pegarse en un notebook
de Colab junto con explicaciones y gráficas.

| Archivo | Módulos que cubre | Qué hace |
|---|---|---|
| `metodos_numericos.py` | 1, 2, 3, 4 | Suma de Riemann (izq/der/medio), Trapecio y Simpson, con una función `comparar_metodos` que imprime una tabla comparativa y el error frente al valor exacto. |
| `integral_definida_y_directa.py` | 5, 6 | Integral definida, área bajo la curva, área entre curvas y antiderivadas simbólicas con SymPy, más una función de **verificación por derivación** (el mismo requisito del taller manual). |

## Cómo usarlos en Colab

1. Abre [colab.research.google.com](https://colab.research.google.com) y crea un notebook nuevo.
2. Copia el contenido de cada archivo `.py` en una celda (o súbelos con el panel de archivos
   de la izquierda y haz `from metodos_numericos import *`).
3. Corre las funciones con tus propias funciones `f(x)` para generar ejemplos y gráficas
   que puedas mostrar en la sustentación en video.

## Sobre el uso de IA

Documenta aquí qué partes de este código generaste, corregiste o adaptaste con ayuda de
Qwen Coder u otra herramienta de IA, como lo exige la Parte II del parcial (recuerda que
esto solo está permitido en la parte de software, nunca en el taller manual).
