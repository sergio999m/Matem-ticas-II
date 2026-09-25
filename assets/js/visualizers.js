/*
 * visualizers.js
 * --------------
 * Funciones reutilizables para dibujar, con Plotly.js, los
 * visualizadores interactivos de los módulos 1 a 6. Cada función
 * recibe una función matemática f (JavaScript puro) y dibuja tanto
 * la curva como la aproximación geométrica correspondiente.
 *
 * Todas las funciones devuelven el VALOR APROXIMADO calculado, para
 * que la página que las llama pueda mostrarlo junto al slider.
 */

// Genera n+1 puntos igualmente espaciados entre a y b.
function linspace(a, b, n) {
  const step = (b - a) / n;
  return Array.from({ length: n + 1 }, (_, i) => a + i * step);
}

// Muestrea f(x) en `samples` puntos entre a y b (para dibujar la curva suave).
function sampleCurve(f, a, b, samples = 200) {
  const xs = linspace(a, b, samples);
  const ys = xs.map(f);
  return { xs, ys };
}

const PLOTLY_LAYOUT_BASE = {
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",
  font: { color: "#b9c0d6", family: "Source Sans 3, sans-serif" },
  margin: { t: 20, r: 20, b: 40, l: 45 },
  xaxis: { gridcolor: "#2a3555", zerolinecolor: "#2a3555" },
  yaxis: { gridcolor: "#2a3555", zerolinecolor: "#2a3555" },
  showlegend: false,
};

function basePlot(containerId, traces, layoutExtra = {}) {
  Plotly.newPlot(containerId, traces, { ...PLOTLY_LAYOUT_BASE, ...layoutExtra }, {
    displayModeBar: false,
    responsive: true,
  });
}

/* ---------- Módulos 1-3: Riemann (izquierda/derecha/punto medio) ---------- */
// mode: "left" | "right" | "mid"
function drawRiemann(containerId, f, a, b, n, mode) {
  const curve = sampleCurve(f, a, b);
  const dx = (b - a) / n;
  const bars = [];
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const x0 = a + i * dx;
    const x1 = x0 + dx;
    let sampleX;
    if (mode === "left") sampleX = x0;
    else if (mode === "right") sampleX = x1;
    else sampleX = (x0 + x1) / 2; // punto medio
    const height = f(sampleX);
    sum += height * dx;

    bars.push({
      x: [x0, x0, x1, x1],
      y: [0, height, height, 0],
      fill: "toself",
      fillcolor: "rgba(79,179,172,0.25)",
      line: { color: "#4fb3ac", width: 1 },
      mode: "lines",
      type: "scatter",
      hoverinfo: "skip",
    });
  }

  const curveTrace = {
    x: curve.xs, y: curve.ys, type: "scatter", mode: "lines",
    line: { color: "#e8a33d", width: 2.5 },
  };

  basePlot(containerId, [...bars, curveTrace]);
  return sum;
}

/* ---------- Módulo 2 (uso interno): Trapecio ---------- */
function drawTrapezoid(containerId, f, a, b, n) {
  const curve = sampleCurve(f, a, b);
  const dx = (b - a) / n;
  const bars = [];
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const x0 = a + i * dx;
    const x1 = x0 + dx;
    const y0 = f(x0);
    const y1 = f(x1);
    sum += ((y0 + y1) / 2) * dx;

    bars.push({
      x: [x0, x0, x1, x1],
      y: [0, y0, y1, 0],
      fill: "toself",
      fillcolor: "rgba(79,179,172,0.25)",
      line: { color: "#4fb3ac", width: 1 },
      mode: "lines",
      type: "scatter",
      hoverinfo: "skip",
    });
  }

  const curveTrace = {
    x: curve.xs, y: curve.ys, type: "scatter", mode: "lines",
    line: { color: "#e8a33d", width: 2.5 },
  };

  basePlot(containerId, [...bars, curveTrace]);
  return sum;
}

/* ---------- Módulo 4: Simpson (parábolas por cada par de subintervalos) --- */
function drawSimpson(containerId, f, a, b, n) {
  if (n % 2 !== 0) n += 1; // Simpson exige n par
  const curve = sampleCurve(f, a, b);
  const dx = (b - a) / n;
  const parabolas = [];
  let sum = f(a) + f(b);

  for (let i = 0; i < n; i += 2) {
    const x0 = a + i * dx;
    const x1 = x0 + dx;
    const x2 = x0 + 2 * dx;
    const y0 = f(x0), y1 = f(x1), y2 = f(x2);
    sum += 4 * y1 + (i + 2 < n ? 2 * y2 : 0);

    // Interpolación cuadrática (parábola) que pasa por (x0,y0),(x1,y1),(x2,y2),
    // usando diferencias divididas de Newton, solo para DIBUJAR la curva.
    const xs = linspace(x0, x2, 30);
    const ys = xs.map((x) => {
      const L0 = ((x - x1) * (x - x2)) / ((x0 - x1) * (x0 - x2));
      const L1 = ((x - x0) * (x - x2)) / ((x1 - x0) * (x1 - x2));
      const L2 = ((x - x0) * (x - x1)) / ((x2 - x0) * (x2 - x1));
      return y0 * L0 + y1 * L1 + y2 * L2;
    });
    parabolas.push({
      x: [...xs, x2, x0], y: [...ys, 0, 0],
      fill: "toself", fillcolor: "rgba(79,179,172,0.22)",
      line: { color: "#4fb3ac", width: 1 },
      mode: "lines", type: "scatter", hoverinfo: "skip",
    });
  }
  sum = (dx / 3) * sum;

  const curveTrace = {
    x: curve.xs, y: curve.ys, type: "scatter", mode: "lines",
    line: { color: "#e8a33d", width: 2.5 },
  };
  basePlot(containerId, [...parabolas, curveTrace]);
  return sum;
}

/* ---------- Módulo 5: área bajo la curva (y opcional área entre curvas) --- */
function drawArea(containerId, f, a, b, g = null) {
  const curve = sampleCurve(f, a, b);
  const traces = [];

  if (g) {
    const curveG = sampleCurve(g, a, b);
    traces.push({
      x: [...curve.xs, ...curveG.xs.slice().reverse()],
      y: [...curve.ys, ...curveG.ys.slice().reverse()],
      fill: "toself", fillcolor: "rgba(232,163,61,0.25)",
      line: { color: "transparent" }, mode: "lines", type: "scatter", hoverinfo: "skip",
    });
    traces.push({ x: curveG.xs, y: curveG.ys, type: "scatter", mode: "lines", line: { color: "#4fb3ac", width: 2.5 } });
  } else {
    traces.push({
      x: [...curve.xs, b, a], y: [...curve.ys, 0, 0],
      fill: "toself", fillcolor: "rgba(232,163,61,0.25)",
      line: { color: "transparent" }, mode: "lines", type: "scatter", hoverinfo: "skip",
    });
  }
  traces.push({ x: curve.xs, y: curve.ys, type: "scatter", mode: "lines", line: { color: "#e8a33d", width: 2.5 } });
  basePlot(containerId, traces);
}

/* ---------- Módulo 6: f(x) y su antiderivada F(x) ------------------------ */
function drawAntiderivative(containerId, f, F, a, b) {
  const curve = sampleCurve(f, a, b);
  const curveF = sampleCurve(F, a, b);
  basePlot(containerId, [
    { x: curve.xs, y: curve.ys, name: "f(x)", type: "scatter", mode: "lines", line: { color: "#4fb3ac", width: 2.5 } },
    { x: curveF.xs, y: curveF.ys, name: "F(x)", type: "scatter", mode: "lines", line: { color: "#e8a33d", width: 2.5 } },
  ], { showlegend: true, legend: { font: { color: "#b9c0d6" } } });
}
