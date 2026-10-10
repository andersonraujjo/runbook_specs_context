---
titulo: Como escrever uma task
objetivo: Escrever tasks com título claro, contexto suficiente e critérios de aceite verificáveis.
quando_usar: Ao abrir qualquer task/ticket antes de iniciar implementação ou pedir trabalho a um agente.
ultima_revisao: 2026-10-10
tags: [processo, task, jira, aceite]
---

# Contexto

Task ruim gera gap. Se o aceite não puder ser checado com um sim/não objetivo, a task ainda não está pronta para desenvolvimento.

Use placeholders: `[CHAVES JIRA]`, `[ÉPICO]`, `[PROJETO]`, `[DEV A]`.

# Passos

## 1. Título

- Formato sugerido: `[área] verbo + objeto + restrição relevante`
- Exemplos genéricos:
  - `api: rejeitar payload sem campo obrigatório X`
  - `docs: documentar rollback do serviço Y`
- Evite títulos vagos: "ajustes", "melhorias", "fix geral".

## 2. Contexto

Inclua só o necessário para agir sem adivinhar:

- Por que a task existe (problema ou objetivo)
- Ligação com `[ÉPICO]` / `[CHAVES JIRA]` pai
- Estado atual vs. estado desejado (1–3 frases)
- Links para docs/specs (`[NOME DO DOCUMENTO]`) — sem URLs internas reais neste repo público

## 3. Critérios de aceite verificáveis

Cada critério deve ser observável:

- **Bom:** "Dado um usuário sem permissão, `POST /recurso` retorna 403 e não persiste registro."
- **Ruim:** "Tratar permissões corretamente."

Liste 2–7 critérios. Prefira formato Dado/Quando/Então ou checklist binário.

## 4. Fora de escopo

Declare explicitamente o que **não** entra:

- Itens de `[DEV B]`
- Refactors cosméticos
- Features adjacentes "já que estamos aqui"

## 5. Definição de pronto

A task só fecha quando:

- [ ] Todos os critérios de aceite atendidos com evidência
- [ ] Testes relevantes executados (comando + resultado)
- [ ] Regressão óbvia checada
- [ ] Docs/tickets atualizados se o aceite exigir
- [ ] Evidência anexada no ticket ou no PR

# Armadilhas comuns

- Aceite subjetivo ("UX boa", "código limpo").
- Misturar várias entregas independentes numa task.
- Omitir fora de escopo e receber trabalho extras.
- Pronto = "código mergeado" sem verificação.

# Checklist final

- [ ] Título específico
- [ ] Contexto suficiente para começar sem perguntar o óbvio
- [ ] Aceite verificável item a item
- [ ] Fora de escopo explícito
- [ ] Definição de pronto alinhada a evidência
