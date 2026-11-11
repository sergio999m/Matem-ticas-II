/*
 * storage.js
 * ----------
 * Pequeño "gestor de archivos" para la sección "Mis Trabajos".
 *
 * IMPORTANTE — cómo funciona el almacenamiento:
 * Este sitio se despliega como archivos ESTÁTICOS en GitHub Pages,
 * es decir, no hay un servidor propio que reciba y guarde tus
 * archivos. Por eso los trabajos se guardan con IndexedDB, una base
 * de datos que el propio NAVEGADOR mantiene en tu computador.
 *
 * Consecuencias importantes:
 *  - Los archivos quedan disponibles solo en este navegador y este
 *    dispositivo (no se sincronizan entre celular/PC ni se suben
 *    a ningún servidor).
 *  - Si borras los datos de navegación / caché del sitio, se pierden.
 *  - Es ideal para tener a mano tus trabajos mientras estudias, pero
 *    NO reemplaza una copia de seguridad real (Drive, USB, etc.).
 */

const DB_NAME = "mate2-mis-trabajos";
const DB_VERSION = 1;
const STORE_NAME = "trabajos";

function openWorksDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        store.createIndex("materia", "materia", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Guarda un archivo (File) junto con su materia y una nota opcional.
async function saveWork(file, materia, nota) {
  const db = await openWorksDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).add({
      nombre: file.name,
      tipo: file.type || "desconocido",
      tamano: file.size,
      materia: materia || "Sin clasificar",
      nota: nota || "",
      fecha: new Date().toISOString(),
      blob: file, // File es un Blob, se guarda directamente
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function listWorks() {
  const db = await openWorksDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    req.onerror = () => reject(req.error);
  });
}

async function deleteWork(id) {
  const db = await openWorksDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function iconFor(type) {
  if (type.includes("pdf")) return "📕";
  if (type.includes("word") || type.includes("document")) return "📄";
  if (type.includes("image")) return "🖼️";
  if (type.includes("sheet") || type.includes("excel")) return "📊";
  return "📁";
}
