---
titulo: Template de ticket
objetivo: Estrutura mínima para criar uma task/bug no tracker com aceite verificável.
quando_usar: Ao abrir qualquer ticket novo (história, task ou bug).
ultima_revisao: 2026-10-10
tags: [template, ticket, jira]
---

# Contexto

Use no Jira (ou similar) para `[PROJETO]`. Mantenha o texto genérico se for espelhar algo neste repo público. Guia completo: `processo/como-escrever-uma-task.md`.

# Passos / Conteúdo

```markdown
## Título
<!-- [área] verbo + objeto -->

## Tipo
História | Task | Bug

## Pai / épico
[ÉPICO] / [CHAVES JIRA]

## Contexto
<!-- Estado atual, problema, links para [NOME DO DOCUMENTO] -->

## Critérios de aceite
- [ ] ...
- [ ] ...

## Fora de escopo
- ...

## Responsável
[DEV A]

## Definição de pronto
- [ ] Aceite atendido com evidência
- [ ] Testes executados
- [ ] Regressão checada
- [ ] Doc/ticket atualizados
```

### Se for bug, acrescente

```markdown
## Reprodução
1. ...
2. ...

## Resultado atual
## Resultado esperado
## Ambiente
local | staging | prod (genérico)
```

# Armadilhas comuns

- Bug sem passos de reprodução.
- Aceite vago.
- Responsável ambíguo entre `[DEV A]` e `[DEV B]`.

# Checklist final

- [ ] Título e tipo definidos
- [ ] Aceite verificável
- [ ] Fora de escopo e responsável preenchidos
