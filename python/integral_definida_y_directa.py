"""
integral_definida_y_directa.py
================================
Código de apoyo para los Módulos 5 (Integral Definida / Área bajo la
curva) y 6 (Integración Directa) de "Mate II: Un Mundo por Explorar".

Usa SymPy para calcular integrales de forma simbólica (algebraica),
que es justo lo que hace un estudiante "a mano" pero verificado por
código — ideal para las verificaciones que pide el taller manual.

Requisitos: sympy (ya viene instalado en Colab).
    pip install sympy   # solo si lo corres fuera de Colab
"""

import sympy as sp

# Definimos x como variable simbólica; todo lo que sigue trabaja
# con expresiones algebraicas, no con números flotantes.
x = sp.symbols("x")


def integral_definida(expresion, a, b):
    """
    Calcula la integral definida de una expresión simbólica entre
    a y b, aplicando el Teorema Fundamental del Cálculo.

    Ejemplo:
        integral_definida(3*x**2 - 2*x + 1, 0, 2)  ->  6
    """
    F = sp.integrate(expresion, x)          # antiderivada F(x)
    valor = F.subs(x, b) - F.subs(x, a)     # F(b) - F(a)
    return sp.simplify(valor)


def area_bajo_curva(expresion, a, b):
    """
    Área bajo la curva (siempre positiva), integrando |f(x)|.
    Para curvas que no cambian de signo en [a, b] equivale a la
    integral definida normal.
    """
    return integral_definida(sp.Abs(expresion), a, b)


def area_entre_curvas(f_expr, g_expr, a=None, b=None):
    """
    Área entre dos curvas f(x) y g(x). Si no se dan a y b, se
    calculan automáticamente resolviendo f(x) = g(x) (los puntos
    de corte), tal como se hace a mano.
    """
    if a is None or b is None:
        cortes = sp.solve(sp.Eq(f_expr, g_expr), x)
        cortes = sorted([c for c in cortes if c.is_real])
        if len(cortes) < 2:
            raise ValueError("No se encontraron 2 puntos de corte reales; da 'a' y 'b' manualmente.")
        a, b = cortes[0], cortes[-1]
    return integral_definida(sp.Abs(f_expr - g_expr), a, b)


def integracion_directa(expresion):
    """
    Devuelve la antiderivada (integral indefinida) de una expresión,
    igual que la resolverías a mano con las fórmulas básicas.
    Incluye "+ C" explícito para que se vea igual que en el taller.
    """
    F = sp.integrate(expresion, x)
    C = sp.symbols("C")
    return sp.simplify(F) + C


def verificar_por_derivacion(antiderivada_sin_C, expresion_original):
    """
    Verifica una integral indefinida DERIVANDO el resultado (tal como
    pide el taller manual: "verificación por derivación de al menos
    1 ejercicio por sección"). Si la derivada coincide con la función
    original, la integral es correcta.
    """
    derivada = sp.diff(antiderivada_sin_C, x)
    coincide = sp.simplify(derivada - expresion_original) == 0
    return derivada, coincide


if __name__ == "__main__":
    # --- Ejemplo Módulo 5: integral definida ---
    resultado = integral_definida(3 * x ** 2 - 2 * x + 1, 0, 2)
    print("Ejemplo Módulo 5 — Integral definida:", resultado)  # -> 6

    # --- Ejemplo Módulo 5: área entre curvas x^2 y 2x ---
    area = area_entre_curvas(x ** 2, 2 * x)
    print("Ejemplo Módulo 5 — Área entre curvas:", area)  # -> 4/3

    # --- Ejemplo Módulo 6: integración directa ---
    F = integracion_directa(x - 1 - 1 / x)
    print("Ejemplo Módulo 6 — Integración directa:", F)

    # --- Verificación por derivación (requisito del taller) ---
    F_sin_C = sp.integrate(x - 1 - 1 / x, x)
    derivada, ok = verificar_por_derivacion(F_sin_C, x - 1 - 1 / x)
    print("Derivada obtenida:", derivada, "| ¿Coincide con f(x) original?:", ok)
