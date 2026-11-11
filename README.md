# Mate II: Un Mundo por Explorar

Plataforma web colaborativa de Cálculo Integral, desarrollada como proyecto semestral
por un estudiante de Tecnología en Desarrollo de Software (UTP). Al finalizar el
semestre se convertirá en un recurso de estudio compartido con la red académica,
cubriendo los 14 métodos de integración y aproximación numérica vistos en el curso.

**Estado actual:** proyecto completo. Incluye los 14 módulos del taller más un módulo 15
(Sólidos de Revolución), todos con teoría, ejemplos resueltos y visualizador interactivo.

## Visión del proyecto completo

| Fase | Entrega | Módulos |
|---|---|---|
| Fase 1 | Parcial 1 | 1-6: Riemann, Trapecio, Punto Medio, Simpson, Área, Directa |
| Fase 2 | Parcial 2 | 7-10: Sustitución, Exponenciales, Logarítmicas, Trigonométricas |
| Fase 3 | Proyecto final | 11-15: Trig. inversas, Hiperbólicas inversas, Trinomio, Partes, Sólidos de revolución |

## Arquitectura del proyecto

```
mate2-mundo-por-explorar/
├── index.html                 # Home: navegación a los 14 módulos + buscador
├── modulo-01/ … modulo-15/    # Un módulo por carpeta: teoría + ejemplos + visualizador
├── mis-trabajos/              # Gestor personal de archivos (PDF, Word, imágenes...)
├── assets/
│   ├── css/style.css          # Sistema de diseño compartido por TODO el sitio
│   └── js/
│       ├── modules-catalog.js # Fuente única de datos de los 14 módulos
│       ├── common.js          # Header, footer y buscador inteligente
│       ├── visualizers.js     # Funciones Plotly reutilizables (Riemann, Trapecio, sólido 3D...)
│       └── storage.js         # Lógica de IndexedDB para "Mis Trabajos"
└── python/                    # Scripts Python para Google Colab (ver su propio README)
    ├── metodos_numericos.py
    └── integral_definida_y_directa.py
```

Se eligió **una carpeta por módulo** (en vez de rutas dinámicas) para que en las
Fases 2 y 3 baste con llenar el contenido de `modulo-07/index.html` en adelante,
sin reestructurar nada. Los módulos activos (`modulo-01` a `modulo-06`) cargan los
mismos tres scripts compartidos (`modules-catalog.js`, `common.js`, `visualizers.js`)
y luego un `<script>` propio con la función específica de su visualizador.

## Cómo ejecutar localmente

No requiere instalación ni build: es HTML/CSS/JS puro.

```bash
cd mate2-mundo-por-explorar
python3 -m http.server 8000
# abre http://localhost:8000 en el navegador
```

(Abrir `index.html` directamente con doble clic también funciona, salvo por
restricciones de `file://` en algunos navegadores para IndexedDB; se recomienda
usar un servidor local simple como el de arriba.)

## Cómo desplegar en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. Ve a **Settings → Pages** → selecciona la rama `main` y la carpeta raíz `/`.
3. GitHub publicará el sitio en `https://tu-usuario.github.io/tu-repo/`.

## El buscador de módulos

En el header de cada página hay un buscador local (sin backend ni IA externa):
compara lo que escribes contra el título y una lista de palabras clave/sinónimos
de cada módulo (definidos en `modules-catalog.js`), tolera tildes y mayúsculas,
y te lleva directo al módulo con clic o Enter. Atajo de teclado: `/` o `Ctrl+K`.

## "Mis Trabajos"

Sección para guardar tus propios archivos (PDF, Word, imágenes, Excel...) de esta
materia o de cualquier otra, usando IndexedDB del navegador. **No hay servidor**:
los archivos quedan solo en tu navegador/dispositivo — ver la nota dentro de la
página `mis-trabajos/index.html` para el detalle de esa limitación.

## Cómo contribuir (Fases 2 y 3)

1. Duplica la estructura de un módulo activo (ej. `modulo-06/`) dentro de la carpeta
   del nuevo módulo (`modulo-07/`, etc.).
2. Agrega la teoría, fórmulas (KaTeX) y ejemplos siguiendo el mismo formato HTML.
3. Si el módulo necesita visualizador, agrega la función correspondiente a
   `assets/js/visualizers.js` en vez de duplicar lógica de Plotly.
4. Actualiza el `status` de ese módulo a `"activo"` en `modules-catalog.js` — el
   home y el buscador se actualizan automáticamente, sin tocar más archivos.

## Uso de IA

Herramientas usadas: Claude (Anthropic), para generar la estructura base del sitio,
los visualizadores en Plotly.js y los scripts de Python documentados en `/python`.

