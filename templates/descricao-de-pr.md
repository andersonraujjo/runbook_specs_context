---
titulo: Template de descrição de PR
objetivo: Padronizar descrições de pull request com contexto, mudanças, aceite e evidência.
quando_usar: Ao abrir qualquer PR.
ultima_revisao: 2026-10-10
tags: [template, pr, github]
---

# Contexto

Cole o bloco abaixo na descrição do PR. Remova seções vazias. Não cole segredos, dados de cliente ou URLs internas.

# Passos / Conteúdo

```markdown
## Contexto
<!-- Por que este PR existe? Ticket: [CHAVES JIRA] -->

## O que mudou
- ...
- ...

## Fora de escopo
- ...

## Como testar
```bash
# comandos
```
<!-- Resultado esperado -->

## Evidência
<!-- Colar saída relevante ou descrever smoke -->

## Checklist
- [ ] Aceite da task atendido
- [ ] Testes executados
- [ ] Docs atualizadas (se necessário)
- [ ] Sem dados sensíveis no diff
```

# Armadilhas comuns

- PR sem ticket nem contexto.
- "Como testar" vazio.
- Misturar 5 features num único PR sem necessidade.

# Checklist final

- [ ] Contexto + mudanças claros
- [ ] Como testar preenchido
- [ ] Evidência anexada ou colada
