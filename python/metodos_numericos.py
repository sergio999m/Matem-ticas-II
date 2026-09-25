"""
metodos_numericos.py
=====================
Implementación en Python de los 4 métodos numéricos de aproximación
de integrales vistos en el Módulo 1-4 de "Mate II: Un Mundo por
Explorar" (Sumas de Riemann, Trapecio, Punto Medio y Simpson).

Pensado para ejecutarse y documentarse en GOOGLE COLAB, tal como
exige la Parte II del parcial. Cada función está comentada línea a
línea para que sea fácil de seguir aunque no conozcas Python.

Requisitos: numpy, matplotlib (ya vienen instalados en Colab).
    pip install numpy matplotlib   # solo si lo corres fuera de Colab
"""

import numpy as np
import matplotlib.pyplot as plt


def suma_riemann(f, a, b, n, modo="medio"):
    """
    Aproxima la integral definida de f entre a y b usando una suma
    de Riemann.

    Parámetros
    ----------
    f    : función de una variable, por ejemplo lambda x: x**2
    a, b : límites de integración
    n    : número de subintervalos (rectángulos)
    modo : "izquierda", "derecha" o "medio" — dónde se toma la altura
           de cada rectángulo dentro de su subintervalo

    Retorna
    -------
    float con el valor aproximado de la integral.
    """
    dx = (b - a) / n  # ancho de cada subintervalo
    total = 0.0

    for i in range(n):
        x0 = a + i * dx        # extremo izquierdo del subintervalo i
        x1 = x0 + dx           # extremo derecho del subintervalo i

        if modo == "izquierda":
            x_muestra = x0
        elif modo == "derecha":
            x_muestra = x1
        else:  # "medio"
            x_muestra = (x0 + x1) / 2

        altura = f(x_muestra)
        total += altura * dx   # área de este rectángulo

    return total


def regla_trapecio(f, a, b, n):
    """
    Aproxima la integral definida usando la Regla del Trapecio:
    T_n = (dx/2) * [f(x0) + 2*sum(f(x_i)) + f(xn)]
    """
    dx = (b - a) / n
    xs = np.linspace(a, b, n + 1)   # n+1 puntos igualmente espaciados
    ys = np.array([f(x) for x in xs])

    # Los puntos "interiores" (todos menos el primero y el último)
    # se cuentan con peso 2; los extremos con peso 1.
    suma_interior = sum(ys[1:-1])
    return (dx / 2) * (ys[0] + 2 * suma_interior + ys[-1])


def regla_punto_medio(f, a, b, n):
    """Caso particular de suma de Riemann con muestreo en el punto medio."""
    return suma_riemann(f, a, b, n, modo="medio")


def regla_simpson(f, a, b, n):
    """
    Aproxima la integral definida usando la Regla de Simpson.
    Requiere que n sea PAR (si no lo es, se ajusta automáticamente
    sumando 1).
    """
    if n % 2 != 0:
        n += 1  # Simpson necesita un número par de subintervalos

    dx = (b - a) / n
    xs = np.linspace(a, b, n + 1)
    ys = np.array([f(x) for x in xs])

    # f(x0) + f(xn), más 4*(impares) + 2*(pares intermedios)
    suma = ys[0] + ys[-1]
    suma += 4 * sum(ys[1:-1:2])   # índices impares: 1, 3, 5, ...
    suma += 2 * sum(ys[2:-1:2])   # índices pares intermedios: 2, 4, 6, ...

    return (dx / 3) * suma


def comparar_metodos(f, a, b, n, valor_exacto=None):
    """
    Corre los 4 métodos con los mismos parámetros y los imprime en
    una tabla, comparándolos contra el valor exacto si se conoce.
    Útil para documentar el trabajo en el notebook de Colab.
    """
    resultados = {
        "Riemann izquierda": suma_riemann(f, a, b, n, "izquierda"),
        "Riemann derecha": suma_riemann(f, a, b, n, "derecha"),
        "Punto medio": regla_punto_medio(f, a, b, n),
        "Trapecio": regla_trapecio(f, a, b, n),
        "Simpson": regla_simpson(f, a, b, n),
    }

    print(f"Comparación de métodos para n={n} en [{a}, {b}]")
    print("-" * 45)
    for nombre, valor in resultados.items():
        linea = f"{nombre:<20}: {valor:.6f}"
        if valor_exacto is not None:
            error = abs(valor - valor_exacto)
            linea += f"   (error = {error:.6f})"
        print(linea)
    if valor_exacto is not None:
        print(f"{'Valor exacto':<20}: {valor_exacto:.6f}")
    return resultados


if __name__ == "__main__":
    # Ejemplo de uso: f(x) = x^2 en [0, 2], valor exacto = 8/3
    f = lambda x: x ** 2
    comparar_metodos(f, a=0, b=2, n=8, valor_exacto=8 / 3)

    # Gráfica simple mostrando f(x) y la aproximación de Riemann
    # (útil para pegar en el notebook de Colab como evidencia visual).
    xs_finos = np.linspace(0, 2, 200)
    plt.plot(xs_finos, f(xs_finos), label="f(x) = x²")
    plt.title("Función usada en los ejemplos de metodos_numericos.py")
    plt.xlabel("x")
    plt.ylabel("f(x)")
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig("ejemplo_riemann.png")
    print("\nGráfica guardada como ejemplo_riemann.png")
