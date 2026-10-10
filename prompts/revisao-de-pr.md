---
titulo: Revisão de PR
objetivo: Revisar um pull request com foco em correção, escopo, riscos e evidência de teste — sem nitpick cosmético.
quando_usar: Ao revisar PR próprio ou de outro; ou ao pedir a um agente para revisar um diff.
ultima_revisao: 2026-10-10
tags: [prompt, pr, revisao, code-review]
---

# Contexto

Revise o PR de `[PROJETO]` ligado a `[CHAVES JIRA]`. Priorize bugs, regressões, escopo e falta de evidência. Ignore estilo cosmético salvo se violar convenção explícita do repo.

# Passos

1. Ler descrição do PR e ticket: o que deveria mudar?
2. Conferir se o diff fica **dentro do escopo** (nada a mais/a menos sem justificativa).
3. Procurar riscos: edge cases, erros silenciados, dados sensíveis, breaking changes.
4. Exigir evidência de teste (comando + resultado). Se não houver, pedir antes de aprovar.
5. Emitir veredito: **Aprovar** / **Aprovar com ressalvas** / **Pedir mudanças**.

## Formato de saída

- Resumo em 2–4 frases
- Bloqueadores (se houver)
- Não bloqueadores
- Perguntas abertas
- Veredito final

# Armadilhas comuns

- Aprovar só porque "parece razoável".
- Pedir refatoração fora do escopo do PR.
- Ignorar ausência total de testes/evidência.

# Checklist final

- [ ] Escopo conferido contra ticket
- [ ] Riscos listados ou "nenhum relevante"
- [ ] Evidência de teste avaliada
- [ ] Veredito explícito
