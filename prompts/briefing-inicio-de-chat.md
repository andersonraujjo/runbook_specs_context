---
titulo: Briefing de início de chat
objetivo: Abrir uma conversa com um agente com contexto, escopo e critérios claros o suficiente para evitar gaps.
quando_usar: Antes de qualquer sessão de trabalho com agente (feature, bugfix, refator, docs, investigação).
ultima_revisao: 2026-10-10
tags: [prompt, briefing, agente, escopo]
---

# Contexto

Use este template no **primeiro** message de um chat com agente. Preencha os placeholders. Quanto mais verificável o aceite, menor a chance de gap.

# Passos / Conteúdo

Copie e preencha:

```markdown
## Contexto
- Projeto: [PROJETO]
- Épico / ticket: [ÉPICO] / [CHAVES JIRA]
- Documento de referência: [NOME DO DOCUMENTO]
- Estado atual (1–3 frases): ...
- Restrições técnicas relevantes: ...

## Escopo (fazer)
- [ ] ...
- [ ] ...

## Critérios de aceite (verificáveis)
- [ ] Dado ..., quando ..., então ...
- [ ] Comando/teste X passa com saída esperada Y
- [ ] Doc/ticket atualizado em ...

## O que NÃO fazer
- Não alterar: ...
- Não refatorar além de: ...
- Não criar: ...
- Fora de escopo: trabalho de [DEV B], se aplicável

## Evidências exigidas antes de declarar pronto
- [ ] Testes executados (comando + saída)
- [ ] Diff/resumo do que mudou
- [ ] Checklist de aceite marcado com prova
- [ ] Atualização em Jira/docs, se combinado

## Quando perguntar em vez de assumir
Pergunte se:
- o aceite for ambíguo ou contraditório;
- houver mais de um caminho com trade-off relevante;
- precisar sair do escopo ou tocar em área listada em "NÃO fazer";
- faltar acesso a arquivo, ambiente ou ticket;
- uma dependência de [DEV B] bloquear o progresso.

Não assuma nomes, URLs internas, regras de negócio ou prioridades não escritas.
```

# Armadilhas comuns

- Escopo vago ("melhorar a API") sem critérios verificáveis.
- Omitir o "NÃO fazer" e receber refatoração indesejada.
- Aceitar "pronto" sem exigir comando + saída.
- Misturar trabalho de `[DEV A]` e `[DEV B]` no mesmo briefing sem separar.

# Checklist final

- [ ] Contexto e escopo preenchidos
- [ ] Aceite verificável (não só "funciona")
- [ ] "NÃO fazer" explícito
- [ ] Evidências exigidas listadas
- [ ] Regras de pergunta vs. assunção claras
