---
titulo: Checklist antes de concluir
objetivo: Impedir fechamento de task/PR sem critério atendido, testes, regressão, doc e evidência.
quando_usar: Imediatamente antes de marcar Done, pedir review final ou declarar entrega pronta ao usuário/agente.
ultima_revisao: 2026-10-10
tags: [processo, checklist, pronto, qualidade]
---

# Contexto

"Pronto" sem checklist é a principal fonte de gap falso-positivo. Use este checklist em toda conclusão de task de `[PROJETO]` / `[CHAVES JIRA]`.

# Passos (checklist)

## 1. Critério de aceite atendido

- [ ] Cada critério da task foi revisado individualmente
- [ ] Nenhum critério ficou "parcial" sem acordo explícito de escopo
- [ ] Comportamento observado bate com o aceite (não só com a intenção)

## 2. Testes rodados

- [ ] Testes automatizados relevantes executados
- [ ] Comando e saída registrados (PR, ticket ou chat)
- [ ] Falhas conhecidas documentadas — não escondidas

## 3. Regressão checada

- [ ] Fluxos adjacentes óbvios verificados
- [ ] Nada que funcionava ontem quebrou sem nota no PR
- [ ] Se houver risco alto: smoke manual mínimo listado e feito

## 4. Doc atualizada

- [ ] README/spec/runbook atualizados **se** o comportamento mudou
- [ ] Ticket/Jira reflete o que foi entregue (não o plano antigo)
- [ ] Decisões relevantes viraram ADR ou nota em `/decisoes` quando couber

## 5. Evidência anexada

- [ ] Link/diff do PR ou resumo do que mudou
- [ ] Saída de teste ou passos manuais com resultado
- [ ] Screenshots/logs só se forem genéricos (sem dados de cliente/empresa)

# Armadilhas comuns

- Marcar Done porque o código compilou.
- "Testei mentalmente" sem registrar.
- Atualizar só o status do Jira e esquecer a doc.
- Anexar evidência com dado sensível ou de cliente.

# Checklist final

- [ ] Os 5 blocos acima estão completos
- [ ] Se algum item falhou: task permanece aberta ou vira ⚠️ parcial com acordo
- [ ] Nenhum segredo ou dado de empresa na evidência
