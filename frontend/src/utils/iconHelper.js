// /utils/iconHelper.js
import React from "react";
import * as LucideIcons from "lucide-react";

/* =====================================================
   CONSTANTS
===================================================== */

const INCH_TO_PX = 96;

/* =====================================================
   BASE64 CACHE
===================================================== */

const base64Cache = new Map();

/* =====================================================
   BUILD ICON-NODE MAP
===================================================== */

function buildIconNodeMap() {
  const origCreateElement = React.createElement.bind(React);
  const origConsoleError = console.error;
  console.error = () => {};

  const map = new Map();

  for (const [key, val] of Object.entries(LucideIcons)) {
    if (!val || typeof val !== "object" || typeof val.render !== "function")
      continue;
    if (key.endsWith("Icon")) continue;

    let captured = null;
    React.createElement = (type, props) => {
      if (props && Array.isArray(props.iconNode) && !captured) {
        captured = props.iconNode;
      }
      return { type, props };
    };

    try {
      val.render({}, null);
    } catch (_) {}

    if (captured) map.set(key, captured);
  }

  React.createElement = origCreateElement;
  console.error = origConsoleError;
  return map;
}

const ICON_NODE_MAP = buildIconNodeMap();
const ICON_NAMES = [...ICON_NODE_MAP.keys()];

console.info(`✅ Lucide icon map built: ${ICON_NAMES.length} icons`);

/* =====================================================
   FUZZY MATCHING (unchanged)
===================================================== */

function norm(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function getBigramFreq(s) {
  const n = norm(s);
  const f = {};
  for (let i = 0; i < n.length - 1; i++) {
    const g = n.slice(i, i + 2);
    f[g] = (f[g] || 0) + 1;
  }
  return f;
}
function diceSimilarity(a, b) {
  const aG = getBigramFreq(a),
    bG = getBigramFreq(b);
  const aT = Object.values(aG).reduce((s, v) => s + v, 0),
    bT = Object.values(bG).reduce((s, v) => s + v, 0);
  if (!aT || !bT) return 0;
  let m = 0;
  for (const [k, v] of Object.entries(aG)) m += Math.min(v, bG[k] || 0);
  return (2 * m) / (aT + bT);
}
function getTrigramFreq(s) {
  const n = norm(s);
  const f = {};
  for (let i = 0; i <= n.length - 3; i++) {
    const g = n.slice(i, i + 3);
    f[g] = (f[g] || 0) + 1;
  }
  return f;
}
function cosineSimilarity(a, b) {
  const aG = getTrigramFreq(a),
    bG = getTrigramFreq(b);
  let d = 0,
    am = 0,
    bm = 0;
  for (const [k, v] of Object.entries(aG)) {
    d += v * (bG[k] || 0);
    am += v * v;
  }
  for (const v of Object.values(bG)) bm += v * v;
  if (!am || !bm) return 0;
  return d / (Math.sqrt(am) * Math.sqrt(bm));
}
function prefixBonus(q, n) {
  const a = norm(q),
    b = norm(n);
  return b.startsWith(a) ? 0.4 * (a.length / b.length) : 0;
}
function combinedScore(q, n) {
  return (
    0.5 * diceSimilarity(q, n) +
    0.35 * cosineSimilarity(q, n) +
    0.15 * prefixBonus(q, n)
  );
}

function resolveLucideIcon(input) {
  if (!input || typeof input !== "string") return "Circle";
  for (const name of ICON_NAMES) if (norm(name) === norm(input)) return name;
  let best = "Circle",
    score = 0;
  for (const name of ICON_NAMES) {
    const s = combinedScore(input, name);
    if (s > score) {
      score = s;
      best = name;
    }
  }
  return score < 0.25 ? "Circle" : best;
}

/* =====================================================
   BUILD SVG
===================================================== */

// In buildSvg function - REMOVE width/height
function buildSvg(iconNode, color, sizePx, strokeWidth = 2) {
  const children = iconNode
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .filter(([k]) => k !== "key")
        .map(
          ([k, v]) =>
            `${k.replace(/([A-Z])/g, (m) => "-" + m.toLowerCase())}="${v}"`
        )
        .join(" ");
      return `<${tag} ${attrStr}/>`;
    })
    .join("");

  // CRITICAL: No width/height - only viewBox for scaling
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;
}

/* =====================================================
   BROWSER-SAFE BASE64
===================================================== */

function toBase64(str) {
  // Works in both browser and Node
  if (typeof window !== "undefined" && window.btoa) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  // Node fallback
  return Buffer.from(str, "utf8").toString("base64");
}

/* =====================================================
   GET ICON BASE64 - NOW RETURNS SVG (no sharp)
===================================================== */

export async function getIconBase64(icon, color = "#0099ff", sizeInch = 1) {
  const sizePx = Math.round(sizeInch * INCH_TO_PX);
  const resolvedName = resolveLucideIcon(icon);
  const cacheKey = `${resolvedName}:${color}:${sizePx}`;

  if (base64Cache.has(cacheKey)) return base64Cache.get(cacheKey);

  try {
    const iconNode = ICON_NODE_MAP.get(resolvedName);
    if (!iconNode) return fallbackCircle(color, sizePx);

    const svg = buildSvg(iconNode, color, sizePx);
    const base64 = toBase64(svg);
    const result = `data:image/svg+xml;base64,${base64}`;

    base64Cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Icon error:", error);
    return fallbackCircle(color, sizePx);
  }
}

/* =====================================================
   FALLBACK - SVG circle
===================================================== */

async function fallbackCircle(color, sizePx) {
  const r = Math.max(sizePx / 2 - 4, 4);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sizePx}" height="${sizePx}" viewBox="0 0 ${sizePx} ${sizePx}"><circle cx="${
    sizePx / 2
  }" cy="${sizePx / 2}" r="${r}" fill="${color}" opacity="0.9"/></svg>`;
  const base64 = toBase64(svg);
  return `data:image/svg+xml;base64,${base64}`;
}
