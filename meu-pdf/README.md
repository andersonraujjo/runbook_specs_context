# meu-pdf

Gera PDFs A4 a partir de Markdown, com presets visuais (terminal, editorial, etc.), tipografia offline e interface gráfica opcional.

**Stack:** Node 20+ · Playwright (Chromium) · markdown-it · Tkinter (GUI)

---

## Instalação

```bash
cd meu-pdf
npm install
npx playwright install chromium
```

Requisitos: Node.js 20 ou superior. Para a GUI: Python 3 (só biblioteca padrão).

---

## Uso rápido (CLI)

```bash
# padrão: preset terminal
node build.mjs docs/exemplo.md

# preset / tema / cabeçalho do PDF
node build.mjs docs/exemplo.md --preset editorial
node build.mjs docs/exemplo.md --preset terminal --theme verde
node build.mjs docs/exemplo.md --header "Anderson Araujo"

node build.mjs --list-presets
node build.mjs --list-themes
npm run build:all
npm run watch
```

Saída em `out/` (PDF + HTML intermediário). A pasta `out/` e `*.pdf` estão no `.gitignore` — não sobem no Git.

Prioridade do cabeçalho (canto superior direito): `--header` → frontmatter `header:` → padrão `Anderson Araujo` (na GUI você pode mudar; o valor fica no `settings.json` local).

---

## Interface gráfica

```bash
python ui/app.py
```

Ou, no Windows, gere o executável e abra com duplo clique:

```bash
build_exe.bat
# → meu-pdf.exe na raiz (precisa ficar ao lado de build.mjs)
```

Na janela você escolhe o `.md`, o texto do **cabeçalho**, preset, tema (opcional) e se o PDF abre ao terminar. O log da conversão aparece em tempo real.

O `.exe` é só o lançador: não distribua fora da pasta `meu-pdf`. Se o antivírus acusar falso positivo (comum com PyInstaller onefile), edite `build_exe.bat` e troque `--onefile` por `--onedir`.

---

## Estrutura

```
meu-pdf/
├── build.mjs          # CLI Markdown → HTML → PDF
├── theme.css          # base de layout / impressão
├── template.html
├── presets/           # visual completo (cores + componentes)
├── themes/            # paletas opcionais
├── docs/              # exemplos .md
├── out/               # PDFs gerados
├── ui/app.py          # interface Tkinter
└── build_exe.bat      # empacota a GUI
```

Ordem do CSS: `theme.css` → `presets/NOME.css` → `themes/X.css` (só se pedido) → `palette:` / `accent:` do frontmatter.

---

## Frontmatter

```yaml
---
title: Título com ==destaque==
subtitle: Apoio
eyebrow: Linha pequena
date: 24 out 2026
header: Anderson Araujo
footer_left: Confidencial
footer_right: Runbook Specs
preset: terminal
theme: verde              # opcional
doc_id: RB-001
dropcap: true
grid: false
badges:
  - texto: P0
    tipo: bloqueia
---
```

Campo ausente = aquele pedaço do hero não é renderizado. `--preset` / `--theme` / `--header` na CLI vencem o frontmatter correspondente.

---

## Componentes no Markdown

| Componente | Sintaxe |
| --- | --- |
| Card | `::: ok "mitigado"` … `:::` |
| Badge | `[BLOQUEIA]{.badge .bloqueia}` |
| Código + título | \`\`\`sql title="postgres · prod" |
| Destaque no título | `==texto==` no `title` |

Presets: `terminal` (completo), `editorial`, `blueprint`, `suico`. Temas: `verde`, `azul`, `roxo`, `claro`.

Guia para criar/editar preset: [`docs/como-escrever-preset.md`](docs/como-escrever-preset.md).

---

## Licença / nota

Projeto interno de geração de documentos. Fontes via `@fontsource` (offline após `npm install`).
