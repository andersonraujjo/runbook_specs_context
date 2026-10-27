# Como escrever um preset (meu-pdf)

Regras para criar ou editar arquivos em `presets/*.css`.

---

## Referência

- `presets/terminal.css` está **aprovado**. Leia-o inteiro antes de escrever qualquer coisa e liste em 5 linhas quais seletores ele sobrescreve e como trata: contador das seções (`h2`), numeração de linhas (`.ln`), badges, cards (`data-label` via `::before`), tabela, listas, blockquote e `.code-window`. Copie a **estrutura** do arquivo (ordem das seções, escopo, tokens), não a aparência.
- Leia também, sem editar, o trecho do `build.mjs` que gera o `<style id="page-chrome">` e veja quais tokens ele lê para cor e fonte do header/footer; defina os mesmos tokens no `:root` do preset.

---

## Escopo

- Editar só `presets/NOME.css`. Todo seletor começa com `[data-preset="NOME"]`.
- Exceção: registrar fontes novas pelo mesmo mecanismo do build para as atuais (avisar o que mudou).
- Não alterar `theme.css`, outros presets nem o resto do `build.mjs`. Em `docs/exemplo.md` só é permitido, **uma única vez**, trocar "pílula" e "(roxo)" por "badge" e "neutro".

---

## Geometria (resolvida — proibido mexer)

- Nada de `@page`, `@top-*` / `@bottom-*`, padding ou margin vertical em `html` / `body` / `.doc`, `position: fixed`, `height: 100vh`, `zoom` ou `transform`.

---

## Quebra de página

- Não sobrescrever `break-inside` / `break-after` da base.
- Flex/grid só em componente pequeno com `break-inside: avoid` (hero, card). Código, tabela e blockquote ficam `display: block` / `table`.
- Nada de `overflow: hidden` em `table` ou `.table-wrap`.
- `position: absolute` só dentro de `card` / `.code-window` / `blockquote` com `position: relative` e `break-inside: avoid`.
- Não definir largura de coluna de tabela (`col-narrow` / `col-code` da base cuidam).

---

## Cores

- Nenhum hex/rgb fora do bloco `:root` do preset. Regras usam `var()` e `color-mix(in srgb, var(--x) N%, transparent)`.
- Contraste mínimo **4.5:1** para texto (incluindo badges, cards, código e rodapé). Se um token falhar, escurecer/clarear.

---

## Tipografia

- Usar só pesos com `@font-face` registrado (conferir no HTML intermediário gerado). Já registradas: Inter 400/600/700, JetBrains Mono 400/500, Space Grotesk 600/700. Outro peso → registrar.
- Conferir que `ã` `ç` `é` `ô` renderizam na fonte do preset, não em fallback.
- Mono: `font-variant-ligatures: none`.
- Títulos: sem uppercase; tracking ≥ `-0.03em`; com tracking negativo, `word-spacing: 0.06em`; `text-wrap: balance`.
- Todo ornamento via `::before` / `::after` tem espaço depois (`content: "§ "`); separadores com espaço dos dois lados. Conferir que nada cola no texto.

---

## Marcação disponível

- `body[data-preset][data-dropcap][data-grid]`
- `header.hero` → `p.hero-eyebrow`, `h1.hero-title` (`mark` = destaque), `p.hero-subtitle`, `div.hero-meta` (`span.hero-date` + `span.badge.TIPO`), `dl.doc-stamp` → `div` → `dt`+`dd`, `div.hero-side`, `p.dimension-label` (stamp/side/dimension já escondidos pela base; o preset reativa o que usa)
- `.content` → `h2` (contador `sec` da base), `h3`, `p`, `ul`, `ol`, `blockquote`, `code` inline
- `.card.card-{ok|erro|aviso|info|card}[data-label]`
- `.code-window` → `.code-window-bar` (→ `.code-window-dots` → `.dot-r` / `.dot-y` / `.dot-g`, + `.code-window-title`) + `pre` → `code.hljs` → `span.ln` (esconder `.code-window-dots` se não usar)
- `.table-wrap` → `table` (`col-narrow`, `col-code`, `code.code-nobreak`)
- `.badge.{bloqueia|importante|menor|ok}`

---

## Processo

- Uma coisa por vez. No máximo **2 tentativas** por problema; na terceira, pare e relate o que tentou.
- **Fase 1** (tokens, fontes, hero, h2/h3) → gerar e conferir a página 1 → **Fase 2** (resto) → conferir todas as páginas.
- Verificação:

  ```bash
  node build.mjs docs/exemplo.md --preset NOME
  ```

  Converter **todas** as páginas em PNG e olhar uma por uma: nenhuma linha ou linha de tabela fatiada no topo/rodapé, nada cortado ou sobreposto, header/footer visíveis, fundo cobrindo a página toda. `pdftotext` por página: o começo do texto bate com o topo visual.
- Se um ornamento (grade, aba sobre borda, capitular) não funcionar em 2 tentativas, remova-o e avise. O preset não depende dele.
