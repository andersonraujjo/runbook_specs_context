/**
 * meu-pdf — CLI: Markdown → HTML → PDF (Playwright/Chromium)
 *
 *   node build.mjs docs/arquivo.md
 *   node build.mjs docs/arquivo.md --preset terminal --theme verde
 *   node build.mjs --list-presets | --list-themes
 *   node build.mjs --all [--preset x] [--theme y]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { performance } from "node:perf_hooks";

import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import markdownItContainer from "markdown-it-container";
import markdownItAttrs from "markdown-it-attrs";
import markdownItBracketedSpans from "markdown-it-bracketed-spans";
import markdownItAnchor from "markdown-it-anchor";
import hljs from "highlight.js";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, "out");
const DOCS_DIR = path.join(ROOT, "docs");
const THEMES_DIR = path.join(ROOT, "themes");
const PRESETS_DIR = path.join(ROOT, "presets");
const TEMPLATE_PATH = path.join(ROOT, "template.html");
const LAYOUT_PATH = path.join(ROOT, "theme.css");
const DEFAULT_PRESET = "terminal";

const CARD_DEFAULT_LABELS = {
  ok: "ok",
  erro: "erro",
  aviso: "aviso",
  info: "info",
  card: "nota",
};

const ACCENT_ONLY_SURFACE = `
  --bg: color-mix(in srgb, var(--accent) 7%, black);
  --surface: color-mix(in srgb, var(--accent) 11%, black);
  --surface-2: color-mix(in srgb, var(--accent) 16%, black);
  --border: color-mix(in srgb, var(--accent) 45%, transparent);
`.trim();

// -----------------------------------------------------------------------------
// Presets / temas
// -----------------------------------------------------------------------------

function listCssNames(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".css"))
    .map((f) => path.basename(f, ".css"))
    .sort();
}

function listPresets() {
  return listCssNames(PRESETS_DIR);
}

function listThemes() {
  return listCssNames(THEMES_DIR);
}

function assertPreset(name) {
  const available = listPresets();
  if (!available.includes(name)) {
    throw new Error(
      `Preset "${name}" não encontrado.\nDisponíveis: ${available.join(", ") || "(nenhum em presets/)"}`,
    );
  }
  return path.join(PRESETS_DIR, `${name}.css`);
}

function assertTheme(name) {
  const available = listThemes();
  if (!available.includes(name)) {
    throw new Error(
      `Tema "${name}" não encontrado.\nDisponíveis: ${available.join(", ") || "(nenhum em themes/)"}`,
    );
  }
  return path.join(THEMES_DIR, `${name}.css`);
}

function parseCssVars(cssText) {
  const vars = {};
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = re.exec(cssText))) {
    vars[m[1]] = m[2].trim();
  }
  return vars;
}

/**
 * Preset: --preset > frontmatter preset: > terminal
 * Tema: só se --theme ou theme: forem informados (senão vale a paleta do preset)
 */
function resolveStyle(cliPreset, cliTheme, data) {
  const presetName = cliPreset || data.preset || DEFAULT_PRESET;
  const presetPath = assertPreset(presetName);

  const themeName = cliTheme || data.theme || null;
  let themePath = null;
  if (themeName) {
    themePath = assertTheme(themeName);
  }

  const overrides = [];
  const merged = {
    ...parseCssVars(fs.readFileSync(presetPath, "utf8")),
    ...(themePath ? parseCssVars(fs.readFileSync(themePath, "utf8")) : {}),
  };

  if (data.accent != null && data.accent !== "") {
    overrides.push(`--accent: ${String(data.accent)};`);
    merged.accent = String(data.accent).trim();
  }

  const paletteMap =
    data.palette && typeof data.palette === "object" && !Array.isArray(data.palette)
      ? data.palette
      : null;

  if (paletteMap) {
    for (const [key, value] of Object.entries(paletteMap)) {
      if (value == null || value === "") continue;
      const prop = key.startsWith("--") ? key : `--${key}`;
      overrides.push(`${prop}: ${String(value)};`);
      merged[key.replace(/^--/, "")] = String(value).trim();
    }
  }

  const themeFileVars = themePath
    ? parseCssVars(fs.readFileSync(themePath, "utf8"))
    : {};
  const themeIsAccentOnly =
    Object.keys(themeFileVars).length > 0 &&
    Object.keys(themeFileVars).every((k) => k === "accent");
  const paletteKeys = paletteMap
    ? Object.keys(paletteMap).map((k) => k.replace(/^--/, ""))
    : [];
  const paletteIsAccentOnly =
    paletteKeys.length > 0 && paletteKeys.every((k) => k === "accent");

  if (themeIsAccentOnly || (paletteIsAccentOnly && !merged.bg)) {
    overrides.push(ACCENT_ONLY_SURFACE);
  }

  return {
    presetName,
    presetPath,
    themeName,
    themePath,
    overridesCss: overrides.join("\n      "),
  };
}

// -----------------------------------------------------------------------------
// Fontes
// -----------------------------------------------------------------------------

const FONT_FILES = {
  syne700: "@fontsource/syne/files/syne-latin-700-normal.woff2",
  space600: "@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2",
  space700: "@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2",
  inter400: "@fontsource/inter/files/inter-latin-400-normal.woff2",
  inter600: "@fontsource/inter/files/inter-latin-600-normal.woff2",
  inter700: "@fontsource/inter/files/inter-latin-700-normal.woff2",
  mono400: "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
  mono500: "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
  // Fraunces (preset editorial) — latin + latin-ext (ã ç ô)
  fraunces400: "@fontsource/fraunces/files/fraunces-latin-400-normal.woff2",
  fraunces400Ext: "@fontsource/fraunces/files/fraunces-latin-ext-400-normal.woff2",
  fraunces400i: "@fontsource/fraunces/files/fraunces-latin-400-italic.woff2",
  fraunces400iExt: "@fontsource/fraunces/files/fraunces-latin-ext-400-italic.woff2",
  fraunces600: "@fontsource/fraunces/files/fraunces-latin-600-normal.woff2",
  fraunces600Ext: "@fontsource/fraunces/files/fraunces-latin-ext-600-normal.woff2",
};

function fontRel(relFromNodeModules) {
  const abs = path.join(ROOT, "node_modules", relFromNodeModules);
  if (!fs.existsSync(abs)) {
    throw new Error(`Fonte não encontrada: ${abs}\nRode: npm install`);
  }
  return `../node_modules/${relFromNodeModules.replace(/\\/g, "/")}`;
}

function buildFontsCss() {
  const u = Object.fromEntries(
    Object.entries(FONT_FILES).map(([k, rel]) => [k, fontRel(rel)]),
  );

  return `
@font-face {
  font-family: "Syne";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("${u.syne700}") format("woff2");
}
@font-face {
  font-family: "Space Grotesk";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("${u.space600}") format("woff2");
}
@font-face {
  font-family: "Space Grotesk";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("${u.space700}") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("${u.inter400}") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("${u.inter600}") format("woff2");
}
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("${u.inter700}") format("woff2");
}
@font-face {
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("${u.mono400}") format("woff2");
}
@font-face {
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("${u.mono500}") format("woff2");
}
@font-face {
  font-family: "Fraunces";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("${u.fraunces400}") format("woff2"), url("${u.fraunces400Ext}") format("woff2");
}
@font-face {
  font-family: "Fraunces";
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("${u.fraunces400i}") format("woff2"), url("${u.fraunces400iExt}") format("woff2");
}
@font-face {
  font-family: "Fraunces";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("${u.fraunces600}") format("woff2"), url("${u.fraunces600Ext}") format("woff2");
}
`.trim();
}

function buildHljsCss() {
  return `
.hljs { color: var(--text); background: transparent; }
.hljs-keyword, .hljs-selector-tag, .hljs-built_in, .hljs-name { color: var(--code-keyword); }
.hljs-string, .hljs-attr, .hljs-template-variable { color: var(--code-string); }
.hljs-number, .hljs-literal, .hljs-variable, .hljs-template-tag { color: var(--code-number); }
.hljs-comment, .hljs-quote, .hljs-deletion { color: var(--code-comment); font-style: italic; }
.hljs-title, .hljs-section, .hljs-selector-id { color: var(--code-title); }
.hljs-type, .hljs-class .hljs-title { color: var(--code-type); }
.hljs-meta, .hljs-meta .hljs-keyword { color: var(--code-meta); }
.hljs-symbol, .hljs-bullet, .hljs-link { color: var(--code-meta); }
.hljs-addition { color: var(--ok); }
.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: 700; }
`.trim();
}

// -----------------------------------------------------------------------------
// Linhas de código (<span class="ln">) — fecha/reabre spans do highlight.js
// -----------------------------------------------------------------------------

/**
 * Envolve cada linha em <span class="ln">. Spans HLJS que atravessam \n
 * são fechados no fim da linha e reabertos no início da próxima.
 */
function wrapCodeLines(highlightedHtml) {
  const raw = String(highlightedHtml).replace(/\r\n/g, "\n");
  const parts = raw.split("\n");
  if (parts.length && parts[parts.length - 1] === "") parts.pop();

  const openStack = []; // opening tag strings, e.g. '<span class="hljs-keyword">'
  const out = [];

  for (const line of parts) {
    const prefix = openStack.join("");
    let i = 0;
    let rebuilt = "";

    while (i < line.length) {
      if (line[i] === "<") {
        const close = line.indexOf(">", i);
        if (close === -1) {
          rebuilt += line.slice(i);
          break;
        }
        const tag = line.slice(i, close + 1);
        rebuilt += tag;
        if (/^<\/span\b/i.test(tag)) {
          openStack.pop();
        } else if (/^<span\b/i.test(tag) && !/\/\s*>$/.test(tag)) {
          openStack.push(tag);
        }
        i = close + 1;
      } else {
        rebuilt += line[i];
        i++;
      }
    }

    const suffix = "</span>".repeat(openStack.length);
    out.push(`<span class="ln">${prefix}${rebuilt}${suffix}</span>`);
  }

  return out.join("");
}

function highlightCode(str, lang) {
  let html;
  if (lang && hljs.getLanguage(lang)) {
    try {
      html = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
    } catch {
      html = null;
    }
  }
  if (html == null) {
    html = String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  return wrapCodeLines(html);
}

/**
 * Insere <wbr> só depois de / _ = : no texto de <code> dentro de <td>.
 * Nunca depois de - ou . — flags "--…" e "..." ficam em <span class="code-nobreak">
 * para o motor não quebrar no hífen.
 */
function insertWbrInTableCode(html) {
  return html.replace(/<td(\b[^>]*)>([\s\S]*?)<\/td>/gi, (full, attrs, inner) => {
    const nextInner = inner.replace(
      /<code(\b[^>]*)>([\s\S]*?)<\/code>/gi,
      (_c, cAttrs, cInner) => {
        const withBreaks = cInner.replace(
          /([^<]*)|(<[^>]+>)/g,
          (chunk, text, tag) => {
            if (tag) return tag;
            let s = String(text);
            // wbr antes de injetar HTML — senão / e = quebram </span> e class=
            s = s.replace(/([\/_=:])/g, "$1<wbr>");
            s = s.replace(/(--[A-Za-z0-9_]+)/g, '<span class="code-nobreak">$1</span>');
            s = s.replace(/\.\.\./g, '<span class="code-nobreak">...</span>');
            return s;
          },
        );
        return `<code${cAttrs}>${withBreaks}</code>`;
      },
    );
    return `<td${attrs}>${nextInner}</td>`;
  });
}

function stripTags(html) {
  return String(html)
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function addCellClass(tagOpen, className) {
  if (/\bclass\s*=\s*"/i.test(tagOpen)) {
    return tagOpen.replace(/\bclass\s*=\s*"/i, `class="${className} `);
  }
  return tagOpen.replace(/^<(th|td)\b/i, `<$1 class="${className}"`);
}

/**
 * Após render: col-narrow (max texto ≤12) ou col-code (maioria com <code>, média >14).
 */
function classifyTableColumns(html) {
  return html.replace(/<table\b[^>]*>[\s\S]*?<\/table>/gi, (tableHtml) => {
    const rows = [...tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
    if (!rows.length) return tableHtml;

    const grid = rows.map((m) =>
      [...m[1].matchAll(/<(th|td)(\b[^>]*)>([\s\S]*?)<\/\1>/gi)].map((c) => ({
        kind: c[1].toLowerCase(),
        attrs: c[2] || "",
        inner: c[3] || "",
        text: stripTags(c[3] || ""),
        hasCode: /<code\b/i.test(c[3] || ""),
      })),
    );
    const colCount = Math.max(0, ...grid.map((r) => r.length));
    if (!colCount) return tableHtml;

    const classes = Array.from({ length: colCount }, (_, ci) => {
      const cells = grid.map((r) => r[ci]).filter(Boolean);
      const body = cells.filter((c) => c.kind === "td");
      const sample = body.length ? body : cells;
      const maxLen = Math.max(0, ...sample.map((c) => c.text.length));
      if (maxLen <= 12) return "col-narrow";

      const codeCells = sample.filter((c) => c.hasCode);
      if (codeCells.length > sample.length / 2) {
        const avg =
          sample.reduce((s, c) => s + c.text.length, 0) / (sample.length || 1);
        if (avg > 14) return "col-code";
      }
      return null;
    });

    if (!classes.some(Boolean)) return tableHtml;

    return tableHtml.replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (rowFull, rowInner) => {
      let ci = 0;
      const nextInner = rowInner.replace(
        /<(th|td)(\b[^>]*)>([\s\S]*?)<\/\1>/gi,
        (cellFull, kind, attrs, inner) => {
          const cls = classes[ci++];
          if (!cls) return cellFull;
          return `${addCellClass(`<${kind}${attrs}>`, cls)}${inner}</${kind}>`;
        },
      );
      return rowFull.replace(rowInner, nextInner);
    });
  });
}

// -----------------------------------------------------------------------------
// Markdown
// -----------------------------------------------------------------------------

function parseFenceInfo(info) {
  const raw = (info || "").trim();
  let title = "";
  let lang = raw;
  const titleMatch = raw.match(/\btitle\s*=\s*"([^"]*)"/);
  if (titleMatch) {
    title = titleMatch[1];
    lang = raw.replace(titleMatch[0], "").trim();
  } else {
    lang = raw.split(/\s+/)[0] || "";
  }
  return { lang, title };
}

/** Parse `ok "rótulo"` a partir do info do container. */
function parseContainerLabel(info, type) {
  const raw = (info || "").trim();
  const m = raw.match(new RegExp(`^${type}\\s*(?:"([^"]*)")?\\s*$`, "i"));
  if (m && m[1] != null && m[1] !== "") return m[1];
  // Também aceita: ok rótulo sem aspas (resto da linha)
  const rest = raw.replace(new RegExp(`^${type}\\s*`, "i"), "").trim();
  if (rest.startsWith('"') && rest.endsWith('"')) return rest.slice(1, -1);
  if (rest) return rest.replace(/^"|"$/g, "");
  return CARD_DEFAULT_LABELS[type] || type;
}

function createMarkdown() {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
  });

  md.use(markdownItBracketedSpans);
  md.use(markdownItAttrs);
  md.use(markdownItAnchor, { permalink: false, level: [1, 2, 3, 4] });

  for (const name of ["ok", "erro", "aviso", "info", "card"]) {
    md.use(markdownItContainer, name, {
      validate(params) {
        return params.trim().match(new RegExp(`^${name}(\\s+.*)?$`));
      },
      render(tokens, idx) {
        if (tokens[idx].nesting === 1) {
          const label = parseContainerLabel(tokens[idx].info, name);
          return `<div class="card card-${name}" data-label="${escapeAttr(label)}">\n`;
        }
        return "</div>\n";
      },
    });
  }

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const { lang, title } = parseFenceInfo(token.info);
    const highlighted = highlightCode(token.content, lang);
    const langClass = lang ? ` language-${md.utils.escapeHtml(lang)}` : "";
    const barTitle = title || (lang ? lang : "code");

    return `
<div class="code-window">
  <div class="code-window-bar">
    <div class="code-window-dots" aria-hidden="true">
      <span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span>
    </div>
    <div class="code-window-title">${md.utils.escapeHtml(barTitle)}</div>
  </div>
  <pre><code class="hljs${langClass}">${highlighted}</code></pre>
</div>\n`;
  };

  const defaultTableOpen =
    md.renderer.rules.table_open ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  const defaultTableClose =
    md.renderer.rules.table_close ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

  md.renderer.rules.table_open = (tokens, idx, options, env, self) =>
    `<div class="table-wrap">${defaultTableOpen(tokens, idx, options, env, self)}`;
  md.renderer.rules.table_close = (tokens, idx, options, env, self) =>
    `${defaultTableClose(tokens, idx, options, env, self)}</div>\n`;

  return md;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

function renderMarkedTitle(title) {
  const parts = String(title).split(/(==[^=]+==)/g);
  return parts
    .map((p) => {
      const m = p.match(/^==([^=]+)==$/);
      if (m) return `<mark>${escapeHtml(m[1])}</mark>`;
      return escapeHtml(p);
    })
    .join("");
}

function stripMarks(title) {
  return String(title).replace(/==([^=]+)==/g, "$1");
}

function firstH1(markdownBody) {
  const m = markdownBody.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "Documento";
}

function renderBadges(badges) {
  if (!Array.isArray(badges) || badges.length === 0) return "";
  return badges
    .map((b) => {
      const texto = b?.texto ?? b?.text ?? "";
      const tipo = (b?.tipo ?? b?.type ?? "info").toLowerCase();
      return `<span class="badge ${tipo}">${escapeHtml(String(texto))}</span>`;
    })
    .join("\n");
}

function truthy(v) {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  return false;
}

/**
 * Hero como superset: só renderiza elementos cujo campo existe.
 * Presets mostram/escondem/reposicionam via CSS.
 */
function buildHero(data, titleFallback) {
  const titleRaw = data.title ?? titleFallback;
  if (!titleRaw && !data.subtitle && !data.eyebrow) return "";

  const parts = ['<header class="hero">'];

  if (data.eyebrow) {
    parts.push(`<p class="hero-eyebrow">${escapeHtml(data.eyebrow)}</p>`);
  }

  if (titleRaw) {
    parts.push(`<h1 class="hero-title">${renderMarkedTitle(titleRaw)}</h1>`);
  }

  if (data.subtitle) {
    parts.push(`<p class="hero-subtitle">${escapeHtml(data.subtitle)}</p>`);
  }

  const badgesHtml = renderBadges(data.badges);
  if (badgesHtml || data.date) {
    parts.push('<div class="hero-meta">');
    if (data.date) {
      parts.push(`<span class="hero-date">${escapeHtml(String(data.date))}</span>`);
    }
    if (badgesHtml) parts.push(badgesHtml);
    parts.push("</div>");
  }

  const stampFields = [
    ["doc_id", data.doc_id, "Doc"],
    ["rev", data.rev, "Rev"],
    ["sheet", data.sheet, "Sheet"],
    ["date", data.date, "Date"],
    ["author", data.author, "Author"],
  ].filter(([, v]) => v != null && v !== "");

  if (stampFields.length) {
    parts.push('<dl class="doc-stamp">');
    for (const [, value, label] of stampFields) {
      parts.push(`<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(String(value))}</dd></div>`);
    }
    parts.push("</dl>");
  }

  const sideText = data.doc_id || data.date;
  if (sideText) {
    parts.push(`<div class="hero-side">${escapeHtml(String(sideText))}</div>`);
  }

  // dimension_label: string mostra; false desliga; ausente = não renderiza
  if (data.dimension_label !== false && data.dimension_label != null && data.dimension_label !== "") {
    parts.push(
      `<p class="dimension-label">${escapeHtml(String(data.dimension_label))}</p>`,
    );
  }

  parts.push("</header>");
  return parts.join("\n");
}

function fillTemplate(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value ?? "");
  }
  return out;
}

/** Escape for CSS `content: "..."` string. */
function escapeCssString(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Quote multi-word families in a font stack for `font:` shorthand. */
function quoteFontStack(stack) {
  return String(stack)
    .split(",")
    .map((part) => {
      const f = part.trim();
      if (!f) return f;
      if (/^["']/.test(f)) return f;
      if (/\s/.test(f)) return `"${f.replace(/["']/g, "")}"`;
      return f;
    })
    .filter(Boolean)
    .join(", ");
}

/**
 * Margin boxes do Chromium (@page) — valores literais (sem var()).
 * Chromium ≥ 131; Playwright atual usa ~156.
 * background no @page pinta a margem (html/--bg sozinho não cobre gutters no print).
 */
function buildPageChromeCss({
  header,
  footerLeft,
  footerRight,
  color,
  fontMono,
  bg,
}) {
  const font = `7.5pt ${quoteFontStack(fontMono)}`;
  const h = escapeCssString(header);
  const fl = escapeCssString(footerLeft);
  const fr = escapeCssString(footerRight);
  const mid = footerRight ? " · " : "";
  return `
@page {
  background-color: ${bg};
  @top-right {
    content: "${h}";
    font: ${font};
    color: ${color};
  }
  @bottom-left {
    content: "${fl}";
    font: ${font};
    color: ${color};
  }
  @bottom-right {
    content: "${fr}${mid}" counter(page) " / " counter(pages);
    font: ${font};
    color: ${color};
  }
}
`.trim();
}

// -----------------------------------------------------------------------------
// Build
// -----------------------------------------------------------------------------

async function buildOne(mdPath, browser, opts = {}) {
  const t0 = performance.now();
  const absMd = path.resolve(mdPath);
  if (!fs.existsSync(absMd)) {
    throw new Error(`Arquivo não encontrado: ${absMd}`);
  }

  const raw = fs.readFileSync(absMd, "utf8");
  const { data, content } = matter(raw);
  const style = resolveStyle(opts.preset, opts.theme, data);

  const md = createMarkdown();
  const titleFallback = firstH1(content);
  let bodyMd = content;
  if (data.title) {
    bodyMd = bodyMd.replace(/^#\s+.+\n+/, "");
  }

  // Presets já numeram h2 via counter(sec) — evita "01" + "1. Título"
  bodyMd = bodyMd.replace(/^#{2}\s+\d+[.)]\s+/gm, "## ");

  let contentHtml = md.render(bodyMd);
  contentHtml = insertWbrInTableCode(contentHtml);
  contentHtml = classifyTableColumns(contentHtml);

  const titlePlain = stripMarks(data.title ?? titleFallback);
  const heroHtml = buildHero(data, titleFallback);
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  const themeLink = style.themePath
    ? `<link rel="stylesheet" href="../themes/${style.themeName}.css" />`
    : "";

  const html = fillTemplate(template, {
    TITLE_PLAIN: escapeHtml(titlePlain),
    FONTS_CSS: buildFontsCss(),
    HLJS_CSS: buildHljsCss(),
    LAYOUT_HREF: "../theme.css",
    PRESET_HREF: `../presets/${style.presetName}.css`,
    THEME_LINK: themeLink,
    ROOT_OVERRIDES: style.overridesCss,
    PRESET_NAME: escapeAttr(style.presetName),
    DROP_CAP: truthy(data.dropcap) ? "true" : "false",
    GRID: truthy(data.grid) ? "true" : "false",
    HERO: heroHtml,
    CONTENT: contentHtml,
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const base = path.basename(absMd, path.extname(absMd));
  const bits = [];
  if (opts.preset && opts.preset !== DEFAULT_PRESET) bits.push(opts.preset);
  if (opts.theme) bits.push(opts.theme);
  const suffix = bits.length ? `-${bits.join("-")}` : "";
  const htmlOut = path.join(OUT_DIR, `${base}${suffix}.html`);
  const pdfOut = path.join(OUT_DIR, `${base}${suffix}.pdf`);
  fs.writeFileSync(htmlOut, html, "utf8");

  const ownBrowser = !browser;
  const b = browser || (await chromium.launch({ headless: true }));
  try {
    const page = await b.newPage();
    await page.goto(pathToFileURL(htmlOut).href, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });

    // Margin boxes (@page) — literais resolvidos; não usam var() nem templates HF do Playwright
    const chrome = await page.evaluate(() => {
      const rs = getComputedStyle(document.documentElement);
      const bs = getComputedStyle(document.body);
      const muted = rs.getPropertyValue("--text-muted").trim();
      const mono =
        rs.getPropertyValue("--font-mono").trim() ||
        "JetBrains Mono, ui-monospace, monospace";
      const bg =
        bs.backgroundColor && bs.backgroundColor !== "rgba(0, 0, 0, 0)"
          ? bs.backgroundColor
          : rs.backgroundColor;
      return {
        fg: muted || bs.color || "rgb(110, 103, 127)",
        bg: bg || "rgb(11, 8, 20)",
        mono,
      };
    });

    // --header > frontmatter header/header_right > padrão
    const headerText = String(
      opts.header ?? data.header ?? data.header_right ?? "Anderson Araujo",
    );
    const footerLeft = String(data.footer_left ?? "");
    const footerRight = String(data.footer_right ?? "");
    const pageChromeCss = buildPageChromeCss({
      header: headerText,
      footerLeft,
      footerRight,
      color: chrome.fg,
      fontMono: chrome.mono,
      bg: chrome.bg,
    });

    await page.evaluate((css) => {
      let el = document.getElementById("page-chrome");
      if (!el) {
        el = document.createElement("style");
        el.id = "page-chrome";
        document.head.appendChild(el);
      }
      el.textContent = css;
    }, pageChromeCss);

    // Persistir no HTML gerado (mesmo CSS usado no PDF)
    {
      let saved = fs.readFileSync(htmlOut, "utf8");
      const block = `<style id="page-chrome">\n${pageChromeCss}\n</style>`;
      if (saved.includes('id="page-chrome"')) {
        saved = saved.replace(
          /<style id="page-chrome">[\s\S]*?<\/style>/,
          block,
        );
      } else {
        saved = saved.replace(/<\/head>/i, `  ${block}\n</head>`);
      }
      fs.writeFileSync(htmlOut, saved, "utf8");
    }

    await page.pdf({
      path: pdfOut,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });

    await page.close();

    const pages = countPdfPages(fs.readFileSync(pdfOut));
    const ms = Math.round(performance.now() - t0);
    const label = style.themeName
      ? `${style.presetName}+${style.themeName}`
      : style.presetName;
    console.log(
      `${path.relative(ROOT, absMd)} [${label}] → out/${path.basename(pdfOut)}  (${pages} pág, ${ms}ms)`,
    );
    return { pdfOut, pages, ms, preset: style.presetName, theme: style.themeName };
  } finally {
    if (ownBrowser) await b.close();
  }
}

function countPdfPages(buf) {
  const text = buf.toString("latin1");
  const matches = text.match(/\/Type\s*\/Page(?!s)\b/g);
  return matches ? matches.length : 1;
}

async function buildAll(opts) {
  const files = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(DOCS_DIR, f));
  if (!files.length) {
    console.log("Nenhum .md em docs/");
    return;
  }
  const browser = await chromium.launch({ headless: true });
  try {
    for (const f of files) await buildOne(f, browser, opts);
  } finally {
    await browser.close();
  }
}

function watchMode(target, opts) {
  const targets = [target, TEMPLATE_PATH, LAYOUT_PATH, PRESETS_DIR, THEMES_DIR];
  console.log(
    `watch: preset=${opts.preset || DEFAULT_PRESET}` +
      (opts.theme ? ` theme=${opts.theme}` : ""),
  );

  let timer = null;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        await buildOne(target, null, opts);
      } catch (err) {
        console.error(err.message || err);
      }
    }, 150);
  };

  for (const t of targets) {
    if (fs.existsSync(t)) {
      fs.watch(t, { persistent: true, recursive: true }, rebuild);
    }
  }
  buildOne(target, null, opts).catch((err) => console.error(err.message || err));
}

// -----------------------------------------------------------------------------
// CLI
// -----------------------------------------------------------------------------

function parseArgs(argv) {
  const flags = {
    watch: false,
    all: false,
    listThemes: false,
    listPresets: false,
    theme: undefined,
    preset: undefined,
    header: undefined,
    file: undefined,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--watch") flags.watch = true;
    else if (a === "--all") flags.all = true;
    else if (a === "--list-themes") flags.listThemes = true;
    else if (a === "--list-presets") flags.listPresets = true;
    else if (a === "--theme") {
      flags.theme = argv[++i];
      if (!flags.theme || flags.theme.startsWith("--")) throw new Error("Use: --theme <nome>");
    } else if (a === "--preset") {
      flags.preset = argv[++i];
      if (!flags.preset || flags.preset.startsWith("--")) throw new Error("Use: --preset <nome>");
    } else if (a === "--header") {
      flags.header = argv[++i];
      if (flags.header === undefined || String(flags.header).startsWith("--")) {
        throw new Error('Use: --header "texto do cabeçalho"');
      }
    } else if (!a.startsWith("--") && !flags.file) {
      flags.file = a;
    }
  }
  return flags;
}

const flags = parseArgs(process.argv.slice(2));

if (flags.listPresets) {
  const p = listPresets();
  console.log(p.length ? p.join("\n") : "(nenhum preset em presets/)");
  process.exit(0);
}
if (flags.listThemes) {
  const t = listThemes();
  console.log(t.length ? t.join("\n") : "(nenhum tema em themes/)");
  process.exit(0);
}

try {
  if (flags.preset) assertPreset(flags.preset);
  if (flags.theme) assertTheme(flags.theme);
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}

const buildOpts = {
  preset: flags.preset,
  theme: flags.theme,
  header: flags.header,
};

if (flags.all) {
  buildAll(buildOpts).catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else if (!flags.file) {
  console.error(
    "Uso: node build.mjs <arquivo.md> [--preset nome] [--theme nome] [--header texto] [--watch]\n" +
      "     node build.mjs --all [--preset nome] [--theme nome]\n" +
      "     node build.mjs --list-presets | --list-themes",
  );
  process.exit(1);
} else if (flags.watch) {
  watchMode(path.resolve(flags.file), buildOpts);
} else {
  buildOne(path.resolve(flags.file), null, buildOpts).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
