---
titulo: Deploy e rollback genérico
objetivo: Documentar o caminho feliz de deploy e o procedimento de rollback sem acoplar a um fornecedor específico.
quando_usar: Antes de publicar uma versão e sempre que precisar reverter com calma sob pressão.
ultima_revisao: 2026-10-10
tags: [runbook, deploy, rollback]
---

# Contexto

Esqueleto genérico para `[PROJETO]`. Substitua os passos pelos da sua stack (container, PaaS, VM, etc.). Nunca documente credenciais, contas reais ou URLs internas neste arquivo público.

# Passos

## Pré-deploy

<!-- O que checar antes de publicar -->

- [ ] Pipeline/testes verdes na revisão alvo
- [ ] Changelog / notas da versão preenchidas
- [ ] Migrações revisadas (forward-only? downtime?)
- [ ] Plano de rollback entendido

## Deploy

1. <!-- Identificar artefato/versão a publicar -->
2. <!-- Publicar no ambiente alvo (staging → produção) -->
3. <!-- Rodar migrações, se houver -->
4. <!-- Smoke checks pós-deploy -->

```bash
# Exemplos genéricos — adapte
# ./scripts/deploy.sh <ambiente> <versao>
# curl -sS http://localhost:<porta>/health
```

## Verificação pós-deploy

| Checagem | Comando / ação | Resultado esperado |
|----------|----------------|--------------------|
| Health | ... | HTTP 200 |
| Fluxo crítico | ... | ... |

## Rollback

1. <!-- Critério para acionar rollback -->
2. <!-- Reverter artefato/versão anterior -->
3. <!-- Política de migração: reverter ou forward-fix -->
4. <!-- Re-checar health e fluxo crítico -->
5. <!-- Registrar incidente / post-mortem se aplicável -->

```bash
# Exemplo genérico
# ./scripts/rollback.sh <ambiente> <versao-anterior>
```

# Armadilhas comuns

<!-- Preencher com lições reais genéricas -->

- Deploy sem smoke.
- Rollback de código sem plano para migração de schema.
- Misturar hotfix com feature grande no mesmo artefato.

# Checklist final

- [ ] Pré-deploy ok
- [ ] Deploy executado e verificado
- [ ] Se falhou: rollback feito e ambiente estável
- [ ] Registro do que foi publicado/revertido (versão, horário, responsável genérico)
