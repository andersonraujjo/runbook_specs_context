---
title: Runbook de ==Incidentes== em Produção
subtitle: Guia operacional com checklist, queries e critérios de bloqueio — tema dark dashboard/dev.
eyebrow: Operações · SRE
date: 24 out 2026
header: meu-pdf · exemplo
footer_left: Confidencial · equipe de plataforma
footer_right: Runbook Specs
preset: terminal
doc_id: RB-INC-2026-041
rev: "B"
sheet: "1"
author: Equipe de plataforma
dropcap: true
grid: false
dimension_label: A4 · 210×297 mm
badges:
  - texto: P0
    tipo: bloqueia
  - texto: Revisado
    tipo: ok
  - texto: Draft ops
    tipo: menor
---

## Visão geral

Este documento demonstra **todos os componentes** do gerador: hero via frontmatter, cards semânticos, badges inline, tabelas longas, código com barra de janela, listas e callouts.

Use o código `INC-2026-041` como referência no canal `#incidentes`.

### Escopo

Cobertura mínima para o turno noturno: detecção, triagem e mitigação. Detalhes de postmortem ficam fora deste PDF.

::: info
Documentação viva: regenere o PDF após editar este Markdown (`npm run build` ou `npm run watch`).
:::

## Status e cards

Três containers de card com borda e fundo translúcido:

::: ok "mitigado"
**Mitigação aplicada.** O failover para a réplica `db-ro-02` restaurou a latência p95 abaixo de 120 ms. Monitorar por 30 minutos.
:::

::: erro "bloqueio"
**Escalação obrigatória.** Taxa de erro 5xx acima de 8% por mais de 5 minutos com impacto em checkout. Abrir war room imediatamente.
:::

::: aviso
**Capacidade degradada.** Cache Redis em 92% de memória. Evitar deploys e limpar chaves `session:*` expiradas antes do pico.
:::

::: card "nota"
Card genérico (neutro) para notas neutras de contexto — útil para “background” sem semântica de severidade.
:::

## Badges inline

Estados em formato badge:

- Bloqueio: [BLOQUEIA]{.badge .bloqueia} — não seguir sem aprovação
- Atenção: [IMPORTANTE]{.badge .importante} — risco operacional
- Secundário: [MENOR]{.badge .menor} — informativo
- Sucesso: [OK]{.badge .ok} — liberado

Combinação em frase: o job `sync-billing` está [BLOQUEIA]{.badge .bloqueia} até validar a migration `2026_10_billing_idx`.

## Queries de diagnóstico

Bloco SQL com título na info string (`title="..."`):

```sql title="postgres · prod"
-- Latência e erros por rota (últimos 15 min)
SELECT
  route,
  count(*) FILTER (WHERE status >= 500) AS errors_5xx,
  round(percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms)::numeric, 1) AS p95_ms
FROM request_log
WHERE ts > now() - interval '15 minutes'
GROUP BY route
HAVING count(*) FILTER (WHERE status >= 500) > 0
ORDER BY errors_5xx DESC
LIMIT 20;
```

Snippet curto de config:

```bash title="shell · hop"
kubectl -n payments get pods -l app=checkout --field-selector=status.phase!=Running
```

## Checklist operacional

1. Confirmar alerta no Grafana (`SLO checkout availability`).
2. Verificar feature flags e último deploy em `releases`.
3. Rodar a query de diagnóstico acima.
4. Decidir: mitigar, escalar ou observar.

Lista com marcadores:

- Isolar pod suspeito com `kubectl cordon` se CPU saturada
- Preferir rollback a hotfix quente após 22h
- Registrar timeline no ticket Jira vinculado

> Callout em blockquote: se o impacto for financeiro (chargebacks / falha de captura), trate como [BLOQUEIA]{.badge .bloqueia} mesmo com métricas “amarelas”.

## Matriz de decisão (tabela longa)

Tabela ampla o bastante para quebrar página — o `thead` deve se repetir e as linhas não devem ser cortadas no meio.

| Severidade | Sinal | Ação imediata | Owner | Código / comando | SLA |
| --- | --- | --- | --- | --- | --- |
| P0 | Checkout 5xx > 5% / 5 min | War room + rollback | SRE on-call | `kubectl rollout undo deploy/checkout` | 15 min |
| P0 | Pagamentos timeout > 3% | Failover PSP secundário | Payments | `flags.set psp_secondary=true` | 20 min |
| P1 | Latência p95 > 800 ms | Scale HPA + cache warm | Platform | `kubectl scale deploy/api --replicas=12` | 30 min |
| P1 | Fila SQS > 50k | Pausar consumers não críticos | Data | `aws sqs ...` + runbook fila | 30 min |
| P2 | Erro de autenticação SSO | Abrir ticket IdP + status page | Identity | portal status + `#identity` | 1 h |
| P2 | Disco nó > 85% | Expandir volume / limpar logs | Infra | `df -h` · `journalctl --vacuum` | 2 h |
| P2 | Certificado < 14 dias | Renovar via cert-manager | Security | `cmctl renew` | 1 dia |
| P3 | Drift Terraform | Planejar PR de reconciliação | Platform | `terraform plan` | 3 dias |
| P3 | Deprecation warning API | Agendar upgrade cliente | Eng | changelog interno | 1 sprint |
| P1 | Redis OOM kill | Flush seletivo + upsize | Cache | `redis-cli --scan --pattern 'tmp:*'` | 30 min |
| P0 | Corrupção de pedido | Freeze writes + restore PITR | DBA | `pg_restore --jobs=4 ...` | 15 min |
| P1 | Spike de CPU cron | Desabilitar job `nightly-agg` | Data | suspend CronJob | 30 min |
| P2 | Alertas flapping | Silenciar 1h + investigar | SRE | Alertmanager silence | 2 h |
| P3 | Docs desatualizadas | Atualizar este runbook | Tech writing | `npm run build` | 1 semana |
| P1 | CDN origin errors | Purge path `/api/v2/*` | Edge | Cloudflare purge | 30 min |
| P2 | Backups falhando | Reexecutar pipeline + validar | DBA | CI `backup-verify` | 4 h |
| P0 | Data leak suspeito | Isolar + legal + forense | Security | playbook DFIR | imediato |
| P1 | Migrations stuck | Cancel lock + retry com `lock_timeout` | DBA | `SELECT pg_terminate_backend(...)` | 45 min |
| P2 | Rate limit 429 em parceiro | Reduzir QPS + backoff | Integrations | config `max_qps` | 1 h |
| P3 | Lint CI vermelho | Não bloqueia prod; corrigir PR | Eng | `npm run lint` | próximo PR |

### Leitura da matriz

Linhas [BLOQUEIA]{.badge .bloqueia} (P0) exigem war room. Itens [IMPORTANTE]{.badge .importante} (P1) podem ser mitigados pelo plantão sem war room formal. Itens [MENOR]{.badge .menor} entram no backlog do dia seguinte.

## Encerramento

Quando o incidente estiver [OK]{.badge .ok}:

1. Remover silences temporários
2. Atualizar status page
3. Abrir postmortem em até 48h úteis

::: ok
Fim do exemplo — se o PDF renderizou hero, cards, badges, SQL, listas, blockquote e tabela com cabeçalho repetido, o gerador está saudável.
:::
