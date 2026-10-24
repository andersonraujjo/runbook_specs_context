# Template — Validação de promoção sandbox → main (produção)

> **Tipo:** template reutilizável de release  
> **Versão do template:** 1.0.0  
> **Idioma:** pt-BR

---

## Como usar este template

1. Copie este arquivo para a pasta de release do ciclo (ex.: `docs/releases/{{IDENTIFICADOR_RELEASE}}/validacao-sandbox-main.md`).
2. Preencha o frontmatter e a seção 0; **congele o tip** do sandbox antes de coletar evidências.
3. Preencha os gates (seção 2) e o painel de status (seção 1); nenhum item pode ficar 🟢 sem evidência no apêndice.
4. Complete código, banco, infra, smoke e runbook; riscos pré-existentes só entram como 🟠 com evidência e dono.
5. Aplique a regra do parecer: qualquer 🔴 ou ⚪ em gate crítico → **NO-GO**; 🟠 sem dono/justificativa/prazo conta como 🔴.
6. Só autorize merge/deploy após **GO** ou **GO CONDICIONAL** com todas as condições listadas, donos e prazos.
7. Após a promoção, atualize a seção 9 (aberto) e arquive evidências no apêndice.
8. Adapte termos de stack na seção “Adaptações por stack” sem alterar a ordem das seções 0–10.

<!-- Preenchimento: substitua todos os {{PLACEHOLDERS}}. Remova este bloco de comentário na cópia da release. -->

---

## 0. Metadados e freeze

**Objetivo:** identificar a promoção e travar o tip do sandbox para que a validação continue válida.

| Campo | Valor |
| --- | --- |
| Identificador da release | {{IDENTIFICADOR_RELEASE}} |
| Data/hora do início da validação (fuso) | {{DATA_HORA_INICIO}} |
| Data/hora do freeze do tip | {{DATA_HORA_FREEZE}} |
| Ambiente origem (sandbox / pré-prod) | {{AMBIENTE_ORIGEM}} |
| Ambiente destino (produção) | {{AMBIENTE_DESTINO}} |
| Branch origem | {{BRANCH_ORIGEM}} |
| Branch destino | {{BRANCH_DESTINO}} |
| Referência tip origem (hash / tag) | {{TIP_ORIGEM}} |
| Referência tip destino (hash / tag) | {{TIP_DESTINO}} |
| Artefato(s) de promoção (PR / change request) | {{ARTEFATOS_PROMOCAO}} |
| Dono da release | {{DONO_RELEASE}} |
| Dono de banco / schema | {{DONO_BANCO}} |
| Dono de infra / deploy | {{DONO_INFRA}} |
| Aprovador(es) obrigatório(s) | {{APROVADOR}} |
| Escopo funcional desta promoção (1–3 linhas) | {{ESCOPO_RELEASE}} |

### 0.1 Congelamento do tip

| Item | Status | Evidência |
| --- | --- | --- |
| Tip da origem congelado em {{TIP_ORIGEM}} | ☐ | {{EVIDENCIA_FREEZE}} |
| Nenhum merge novo na origem após o freeze | ☐ | {{EVIDENCIA_SEM_MERGE_POS_FREEZE}} |
| Qualquer mudança pós-freeze → **invalidar** esta validação e recomeçar | — | Regra fixa |

**Regra:** evidências coletadas após commit diferente de {{TIP_ORIGEM}} não contam para GO.

### 0.2 Adaptações por stack (preencher uma vez por produto)

<!-- Descreva nomes genéricos usados neste documento → equivalentes locais. Sem nomes de cliente/produto. -->

| Conceito no template | Equivalente neste produto |
| --- | --- |
| Serviço de API (back) | {{EQUIV_SERVICO_API}} |
| Aplicação cliente (front / app) | {{EQUIV_APP_CLIENTE}} |
| Banco relacional principal | {{EQUIV_BANCO_PRINCIPAL}} |
| Banco(s) satélite / escopos externos | {{EQUIV_BANCOS_SATELITE}} |
| Provedor de nuvem / orquestrador de deploy | {{EQUIV_PROVEDOR_NUVEM}} |
| Serviço de feature flags | {{EQUIV_SERVICO_FLAGS}} |
| Serviço de e-mail / messaging transacional | {{EQUIV_EMAIL}} |
| Outras integrações críticas | {{EQUIV_INTEGRACOES}} |
| Pipeline CI back | {{EQUIV_CI_BACK}} |
| Pipeline CI front (ou “inexistente”) | {{EQUIV_CI_FRONT}} |

---

## 1. Parecer e painel de status

**Objetivo:** em segundos, saber se a promoção pode seguir e o que ainda bloqueia.

### Legenda

| Símbolo | Significado |
| --- | --- |
| 🟢 | OK, com evidência anexada no apêndice |
| 🟠 | Risco aceito conscientemente — exige dono, justificativa e prazo |
| 🔴 | Bloqueante — impede a promoção |
| ⚪ | Não verificado — pendência (nunca tratar como OK) |

### Regras do parecer

| Situação | Parecer |
| --- | --- |
| Qualquer gate **crítico** em 🔴 ou ⚪ | **NO-GO** |
| Qualquer 🟠 sem dono **ou** sem justificativa **ou** sem prazo | Trata como 🔴 → **NO-GO** |
| Só 🟢 e 🟠 válidos; existem condições ainda abertas | **GO CONDICIONAL** |
| Só 🟢 (e 🟠 válidos já encerrados ou sem impacto no cutover) | **GO** |

### 1.1 Parecer

| Campo | Valor |
| --- | --- |
| **Parecer** | ☐ GO · ☐ GO CONDICIONAL · ☐ NO-GO |
| Data/hora do parecer | {{DATA_HORA_PARECER}} |
| Autor do parecer | {{DONO_RELEASE}} |
| Resumo (2–4 linhas) | {{RESUMO_PARECER}} |

### 1.2 Placar

| 🟢 | 🟠 | 🔴 | ⚪ |
| --- | --- | --- | --- |
| {{QTD_OK}} | {{QTD_RISCO_ACEITO}} | {{QTD_BLOQUEANTE}} | {{QTD_NAO_VERIFICADO}} |

### 1.3 Tabela de gates (visão rápida)

| Gate | Status | Evidência (link/ID) | Dono | Observação |
| --- | --- | --- | --- | --- |
| G1 Paridade e delta de código | ⚪ | {{EV_G1}} | {{DONO_RELEASE}} | |
| G2 Testes no resultado do merge | ⚪ | {{EV_G2}} | {{DONO_RELEASE}} | |
| G3 Esquema e dados | ⚪ | {{EV_G3}} | {{DONO_BANCO}} | Crítico |
| G4 Infra, secrets e variáveis | ⚪ | {{EV_G4}} | {{DONO_INFRA}} | Crítico |
| G5 Feature flags | ⚪ | {{EV_G5}} | {{DONO_RELEASE}} | Crítico se flags mudam comportamento |
| G6 Integrações de terceiros | ⚪ | {{EV_G6}} | {{DONO_RELEASE}} | |
| G7 Homologação por domínio (tip final) | ⚪ | {{EV_G7}} | {{DONO_RELEASE}} | Crítico |
| G8 Smoke manual | ⚪ | {{EV_G8}} | {{DONO_RELEASE}} | Crítico |
| G9 Observabilidade e alertas | ⚪ | {{EV_G9}} | {{DONO_INFRA}} | |
| G10 Rollback documentado e testável | ⚪ | {{EV_G10}} | {{DONO_INFRA}} | Crítico |
| G11 Aprovações e artefatos de promoção | ⚪ | {{EV_G11}} | {{APROVADOR}} | Crítico |
| G12 Ordem de deploy e janela | ⚪ | {{EV_G12}} | {{DONO_RELEASE}} | Crítico |

<!-- Atualize Status com 🟢🟠🔴⚪. Sem evidência → não pode ser 🟢. -->

### 1.4 Condições para o GO

| # | Condição | Status | Responsável | Prazo |
| --- | --- | --- | --- | --- |
| C1 | {{CONDICAO_1}} | ⚪ | {{RESP_C1}} | {{PRAZO_C1}} |
| C2 | {{CONDICAO_2}} | ⚪ | {{RESP_C2}} | {{PRAZO_C2}} |
| C3 | {{CONDICAO_3}} | ⚪ | {{RESP_C3}} | {{PRAZO_C3}} |

**GO CONDICIONAL** só é válido se todas as condições acima tiverem responsável e prazo, e nenhuma for gate crítico em 🔴/⚪.

---

## 2. Gates (critérios formais)

**Objetivo:** tornar cada decisão de promoção objetiva e auditável.

Para cada gate: preencha verificação, evidência e status. Gravidade **crítica** alimenta a regra de NO-GO da seção 1.

### G1 — Paridade e delta de código

| Campo | Conteúdo |
| --- | --- |
| Critério | Ahead/behind entre origem e destino conhecidos; commits existentes **somente no destino** inventariados; hotfixes do destino preservados ou supersedidos com evidência; merge textual sem conflito não resolvido. |
| Como verificar | Comparar branches {{BRANCH_ORIGEM}} × {{BRANCH_DESTINO}}; listar commits exclusivos do destino; revisar arquivos tocados nos dois lados (deploy, config, migrations). |
| Evidência exigida | Relatório de compare (contagens ahead/behind/arquivos) + tabela de commits só-destino com decisão (absorvido / supersedido / risco). |
| Gravidade | Alta (crítica se hotfix do destino puder ser perdido). |
| Bloqueia quando | Conflito não resolvido; hotfix do destino sem plano de preservação; tip da origem ≠ tip congelado. |
| Status | ⚪ |

### G2 — Testes automáticos no resultado do merge

| Campo | Conteúdo |
| --- | --- |
| Critério | Suítes relevantes passam no **resultado do merge** origem⊕destino (não apenas na origem isolada). Se CI de um artefato (ex.: app cliente) **não existir**, a compensação documentada vira gate (build + testes locais + smoke), não nota de rodapé. |
| Como verificar | Executar ou obter CI no merge-tree / branch de promoção; registrar contagens e SHA. |
| Evidência exigida | Log/CI ID + contagem passou/falhou/pulado + referência {{TIP_ORIGEM}}. |
| Gravidade | Crítica. |
| Bloqueia quando | Falha no merge; CI ausente sem compensação aprovada; testes enfraquecidos sem registro. |
| Status | ⚪ |

### G3 — Esquema e dados

| Campo | Conteúdo |
| --- | --- |
| Critério | Schema necessário ao release presente no destino; inventário de migrations do delta fechado; se o deploy **não** aplica migration automaticamente, aplicação manual (ou pacote) comprovada; sem drift crítico entre histórico de migrations e DDL real para objetos usados; integridade mínima (órfãos/constraints) dentro do limiar; role da aplicação com permissões necessárias. |
| Como verificar | Ver seção 4. |
| Evidência exigida | Pós-check com N verificações; resultado do diff estrutural; registro de migrations aplicadas; contagens de integridade. |
| Gravidade | Crítica. |
| Bloqueia quando | Objeto usado pelo código ausente; drift de constraint crítica; órfãos acima do limiar sem remediação; permissão da role insuficiente. |
| Status | ⚪ |

### G4 — Infraestrutura, secrets e variáveis

| Campo | Conteúdo |
| --- | --- |
| Critério | Serviço(s) de destino provisionados; secrets e variáveis necessários existem; configuração de origem **não** vaza para destino (ex.: URLs/credenciais de sandbox); dry-run ou evidência equivalente do **pipeline/trigger de deploy** do destino. |
| Como verificar | Inspecionar definição do serviço, secrets manager, variáveis; evidenciar dry-run do trigger/pipeline de produção. |
| Evidência exigida | Checklist de secrets/vars; registro do dry-run (substituições / parâmetros finais sem vazar segredos). |
| Gravidade | Crítica. |
| Bloqueia quando | Secret ausente; variável de origem apontando para sandbox em prod; trigger não verificado. |
| Status | ⚪ |

### G5 — Feature flags

| Campo | Conteúdo |
| --- | --- |
| Critério | Estado de cada flag relevante **antes** e **depois** do cutover definido; flags que devem permanecer desligadas no destino estão desligadas; decisão de produto registrada para flags que diferem entre origem e destino. |
| Como verificar | Consultar serviço de flags nos dois ambientes; preencher tabela da seção 5. |
| Evidência exigida | Tabela flags do dia + dono da decisão. |
| Gravidade | Crítica se a flag altera authz, billing ou fluxo principal. |
| Bloqueia quando | Flag crítica indefinida; destino herdaria estado da origem indevidamente. |
| Status | ⚪ |

### G6 — Integrações de terceiros

| Campo | Conteúdo |
| --- | --- |
| Critério | Integrações usadas pelo release têm conta/credencial válidas no destino; regra **aceite da API ≠ entrega** aplicada (efeito final confirmado quando a integração for assíncrona). |
| Como verificar | Smoke controlado + consulta de status no provedor / log de efeito final (ver seção 5). |
| Evidência exigida | ID de mensagem/evento + status final (entregue / processado / falhou) ou registro de cota/bloqueio. |
| Gravidade | Alta (crítica se o fluxo de negócio depende só da integração). |
| Bloqueia quando | Conta bloqueada/sem cota; aceite sem entrega no caminho crítico sem mitigação. |
| Status | ⚪ |

### G7 — Homologação por domínio no tip final

| Campo | Conteúdo |
| --- | --- |
| Critério | Domínios de negócio afetados pelo delta foram homologados **no tip congelado**, não em SHA anterior. |
| Como verificar | Checklist por domínio (seção 6); marcar massa mínima. |
| Evidência exigida | Matriz domínio × resultado × evidência. |
| Gravidade | Crítica. |
| Bloqueia quando | Domínio crítico sem homologação no tip final. |
| Status | ⚪ |

### G8 — Smoke manual

| Campo | Conteúdo |
| --- | --- |
| Critério | Roteiro mínimo executado; cada item com resultado; conferência cruzada UI × logs; massa mínima atendida ou exceção documentada. |
| Como verificar | Seção 6. |
| Evidência exigida | Tabela de smoke + IDs de log / horário. |
| Gravidade | Crítica. |
| Bloqueia quando | Item crítico falhou; smoke só em tip antigo; massa insuficiente sem aceite. |
| Status | ⚪ |

### G9 — Observabilidade e alertas

| Campo | Conteúdo |
| --- | --- |
| Critério | Sinais pós-deploy definidos (taxa de erro, erros de runtime, falhas de envio/integração); alertas existentes ou criados; linha de base pré-cutover anotada. |
| Como verificar | Confirmar queries/alertas no sistema de logs/métricas. |
| Evidência exigida | Lista de alertas + baseline. |
| Gravidade | Alta. |
| Bloqueia quando | Nenhum sinal para falha crítica do release (ex.: erro 5xx do serviço API). |
| Status | ⚪ |

### G10 — Rollback

| Campo | Conteúdo |
| --- | --- |
| Critério | Rollback de **código** e de **esquema/dados** documentados em separado; ponto de não retorno explícito; revisão/versão anterior identificada. |
| Como verificar | Seção 7. |
| Evidência exigida | Runbook de rollback preenchido + responsável. |
| Gravidade | Crítica. |
| Bloqueia quando | Só existe “voltar revisão” sem menção a schema; ponto de não retorno omitido. |
| Status | ⚪ |

### G11 — Aprovações e artefatos de promoção

| Campo | Conteúdo |
| --- | --- |
| Critério | Artefatos de promoção fora de rascunho; aprovações obrigatórias registradas; descrição alinhada ao tip congelado. |
| Como verificar | Revisar estado dos artefatos {{ARTEFATOS_PROMOCAO}}. |
| Evidência exigida | Registro de aprovação (quem/quando). |
| Gravidade | Crítica. |
| Bloqueia quando | Sem aprovação; descrição com tip desatualizado sem correção. |
| Status | ⚪ |

### G12 — Ordem de deploy e janela

| Campo | Conteúdo |
| --- | --- |
| Critério | Ordem schema → API → app cliente (ou equivalente) respeitada; janela entre componentes incompatíveis definida; comunicação a usuários/clientes planejada. |
| Como verificar | Seção 7. |
| Evidência exigida | Runbook assinado + plano de comunicação. |
| Gravidade | Crítica. |
| Bloqueia quando | Plano de deploy front antes do back (quando houver dependência); janela indefinida. |
| Status | ⚪ |

---

## 3. Código

**Objetivo:** provar o que entra na produção e o que não pode se perder no destino.

### 3.1 Compare de branches

| Métrica | Origem → Destino |
| --- | --- |
| Ahead (commits só na origem) | {{AHEAD}} |
| Behind (commits só no destino) | {{BEHIND}} |
| Arquivos alterados no delta | {{QTD_ARQUIVOS}} |
| Conflitos no merge-tree | ☐ nenhum · ☐ resolvidos (evidência) · ☐ abertos |

### 3.2 Commits exclusivos do destino (hotfixes / mudanças só na main)

| Referência | Tema | Risco se perder no merge | Decisão |
| --- | --- | --- | --- |
| {{COMMIT_DESTINO_1}} | {{TEMA_1}} | {{RISCO_1}} | ☐ absorvido · ☐ supersedido · ☐ reaplicar |
| {{COMMIT_DESTINO_2}} | {{TEMA_2}} | {{RISCO_2}} | ☐ absorvido · ☐ supersedido · ☐ reaplicar |

### 3.3 Artefatos de promoção

| Artefato | Tip / head | CI | Estado (rascunho/aprovado) | Observação |
| --- | --- | --- | --- | --- |
| {{ARTEFATO_API}} | {{TIP_ORIGEM}} | ☐ verde · ☐ amarelo · ☐ ausente | {{ESTADO_ARTEFATO_API}} | |
| {{ARTEFATO_CLIENTE}} | {{TIP_ORIGEM}} | ☐ verde · ☐ amarelo · ☐ ausente | {{ESTADO_ARTEFATO_CLIENTE}} | |

### 3.4 CI e compensação

| Componente | CI existe? | Compensação se CI ausente (vira gate) | Evidência |
| --- | --- | --- | --- |
| API | ☐ sim · ☐ não | {{COMPENSACAO_API}} | {{EV_CI_API}} |
| App cliente | ☐ sim · ☐ não | {{COMPENSACAO_CLIENTE}} | {{EV_CI_CLIENTE}} |
| Resultado do merge origem⊕destino | ☐ executado | Contagens: {{CONTAGEM_TESTES_MERGE}} | {{EV_TESTES_MERGE}} |

**Regra:** CI ausente + compensação vazia → G2 = 🔴.

---

## 4. Esquema e dados

**Objetivo:** garantir que o destino tem o schema e a integridade que o tip congelado exige — sem reaplicar às cegas.

### 4.1 Inventário de migrations do delta

| # | Identificador da migration | Presente no destino? | Aplicada como | Evidência |
| --- | --- | --- | --- | --- |
| 1 | {{MIGRATION_1}} | ☐ | ☐ auto-deploy · ☐ pacote manual · ☐ já estava | {{EV_MIG_1}} |
| 2 | {{MIGRATION_2}} | ☐ | ☐ auto-deploy · ☐ pacote manual · ☐ já estava | {{EV_MIG_2}} |
| … | {{MIGRATION_N}} | ☐ | ☐ | {{EV_MIG_N}} |

**Checagem de deploy sem migration automática:** ☐ confirmado que o pipeline de deploy **não** aplica schema → aplicação prévia obrigatória · ☐ pipeline aplica (evidenciar passo).

### 4.2 Diff estrutural origem × destino (escopo do release)

**Objetivo da consulta (descrição, sem SQL):** listar objetos do schema público relevantes (tabelas/colunas, constraints, índices) nos dois ambientes; comparar apenas o que o **código desta promoção** usa.

| Diferença encontrada | Onde (origem/destino/ambos) | Usada pelo release? | Efeito | Ação |
| --- | --- | --- | --- | --- |
| {{DIFF_1}} | {{ONDE_1}} | ☐ sim · ☐ não | {{EFEITO_1}} | {{ACAO_1}} |

**Esperado para GO:** nenhum objeto **usado pelo release** faltando no destino.

### 4.3 Drift histórico de migrations × DDL real

| Sintoma | Detectado? | Objeto afetado | Remediação |
| --- | --- | --- | --- |
| Revisão de migration marcada como aplicada, mas DDL ausente/errado | ☐ | {{OBJETO_DRIFT}} | {{REMEDIACAO_DRIFT}} |

**Esperado:** drifts críticos remediados **antes** do deploy do código que depende deles; ou risco aceito na seção 8 com evidência.

### 4.4 Integridade de dados

Descrever e executar consultas de **somente leitura**, por exemplo:

- Contar registros órfãos nas relações afetadas pelo release — **esperado:** 0 ou ≤ {{LIMIAR_ORFAOS}} com plano.
- Contar identidades/entidades expostas a risco de autorização conhecido — **esperado:** 0 para GO sem aceite.
- Validar constraints críticas (existência, alvo, validação) — **esperado:** conforme contrato do tip.

| Checagem | Resultado | Esperado | Status |
| --- | --- | --- | --- |
| {{CHECAGEM_INTEGRIDADE_1}} | {{RESULTADO_1}} | {{ESPERADO_1}} | ⚪ |
| {{CHECAGEM_INTEGRIDADE_2}} | {{RESULTADO_2}} | {{ESPERADO_2}} | ⚪ |

### 4.5 Permissões: role da aplicação × owner

| Verificação | Resultado |
| --- | --- |
| Owner dos objetos novos | {{OWNER_OBJETOS}} |
| Role de runtime da aplicação tem privilégios necessários (leitura/escrita conforme o caso) | ☐ sim · ☐ não · evidência {{EV_GRANTS}} |
| Nota | Permissão do owner **não** prova a role de runtime. |

### 4.6 Bancos satélites / escopos fora do principal

| Escopo | Coberto por este tombo? | Status | Observação |
| --- | --- | --- | --- |
| {{ESCOPO_SATELITE_1}} | ☐ sim · ☐ não · ☐ n/a | ⚪ | {{OBS_SATELITE_1}} |

### 4.7 Pós-check (N verificações)

| Métrica | Valor |
| --- | --- |
| Total de verificações | {{N_VERIFICACOES}} |
| OK | {{N_OK}} |
| Falhas reais | {{N_FALHAS_REAIS}} |
| Falsos positivos (bug da própria checagem) | {{N_FALSOS_POSITIVOS}} |

| Verificação com falso positivo | Por que é falso positivo | Evidência de que o objeto está correto |
| --- | --- | --- |
| {{FP_1}} | {{MOTIVO_FP_1}} | {{EV_FP_1}} |

**Esperado:** falhas reais = 0 antes do GO; falsos positivos documentados (não contam como 🔴 se provados).

### 4.8 Dry-run do pipeline / trigger de deploy do destino

| Campo | Valor |
| --- | --- |
| Como foi evidenciado | {{METODO_DRY_RUN_TRIGGER}} |
| Parâmetros críticos conferidos (ambiente, nome do serviço, ausência de config de origem) | ☐ |
| Evidência (ID/registro sem segredos) | {{EV_DRY_RUN_TRIGGER}} |
| Status | ⚪ |

**Bloqueio:** sem evidência de dry-run (ou inspeção equivalente aprovada) → G4 = 🔴.

<!-- Funções/triggers de banco: documentar em Adaptações por stack se aplicável ao produto. -->

---

## 5. Infra, flags e integrações

**Objetivo:** garantir que o destino está provisionado e que flags/integrações não surpreendem no cutover.

### 5.1 Provisionamento

| Item | Presente no destino? | Precisa para este cutover? | Evidência |
| --- | --- | --- | --- |
| Secrets obrigatórios do serviço API | ☐ | ☐ | {{EV_SEC_API}} |
| Secrets/jobs auxiliares (filas, workers) | ☐ | ☐ | {{EV_SEC_JOB}} |
| Variáveis de ambiente do destino | ☐ | ☐ | {{EV_ENV}} |
| Itens **não** devem existir no destino (ex.: config só de sandbox) | ☐ conferido ausentes | ☐ | {{EV_AUSENCIA}} |

### 5.2 Flags do dia

| Flag | Estado na origem | Estado no destino (hoje) | Estado desejado pós-cutover | Decisão / dono |
| --- | --- | --- | --- | --- |
| {{FLAG_1}} | {{ORIGEM_F1}} | {{DESTINO_F1}} | {{DESEJADO_F1}} | {{DONO_FLAG_1}} |
| {{FLAG_2}} | {{ORIGEM_F2}} | {{DESTINO_F2}} | {{DESEJADO_F2}} | {{DONO_FLAG_2}} |

### 5.3 Integrações — aceite da API ≠ entrega

**Regra:** resposta HTTP de sucesso / “aceito pelo provedor” **não** fecha o gate. Exigir efeito final.

| Integração | Caminho testado | Aceite técnico | Efeito final confirmado? | Mitigação se falhar |
| --- | --- | --- | --- | --- |
| Serviço de e-mail transacional | {{CAMINHO_EMAIL}} | ☐ | ☐ entregue · ☐ falhou · ☐ cota · ☐ spam | {{MITIGACAO_EMAIL}} |
| Webhook / provedor externo | {{CAMINHO_WEBHOOK}} | ☐ | ☐ processado · ☐ pendente · ☐ erro | {{MITIGACAO_WEBHOOK}} |
| {{INTEGRACAO_N}} | {{CAMINHO_N}} | ☐ | ☐ | {{MITIGACAO_N}} |

---

## 6. Smoke e matriz de testes

**Objetivo:** exercitar o tip congelado com massa mínima e evidência cruzada.

### 6.1 Critério de massa mínima

| Requisito de massa | Atendido? | Se não, exceção (dono + aceite) |
| --- | --- | --- |
| {{MASSA_1}} | ☐ | {{EXCECAO_MASSA_1}} |
| {{MASSA_2}} | ☐ | {{EXCECAO_MASSA_2}} |

Sem massa e sem exceção → G8 = 🔴.

### 6.2 Roteiro de smoke

| # | Ação | Esperado | Resultado | UI OK | Log OK | Evidência |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | {{SMOKE_1}} | {{ESP_1}} | ☐ passou · ☐ falhou · ☐ parcial · ☐ bloqueado | ☐ | ☐ | {{EV_S1}} |
| 2 | {{SMOKE_2}} | {{ESP_2}} | ☐ | ☐ | ☐ | {{EV_S2}} |
| 3 | {{SMOKE_3}} | {{ESP_3}} | ☐ | ☐ | ☐ | {{EV_S3}} |
| … | {{SMOKE_N}} | {{ESP_N}} | ☐ | ☐ | ☐ | {{EV_SN}} |

**Regra:** toast/mensagem de sucesso na UI **sem** log correspondente → item não pode ser 🟢.

### 6.3 Homologação por domínio (tip final)

| Domínio | Homologado em {{TIP_ORIGEM}}? | Resultado | Evidência |
| --- | --- | --- | --- |
| {{DOMINIO_1}} | ☐ | ☐ passa · ☐ falha · ☐ parcial · ☐ precisa prod | {{EV_D1}} |
| {{DOMINIO_2}} | ☐ | ☐ | {{EV_D2}} |
| {{DOMINIO_3}} | ☐ | ☐ | {{EV_D3}} |

### 6.4 Matriz de casos de teste × status

| Pacote / card / suíte | Passa | Falha | Parcial | Precisa de produção ou massa |
| --- | --- | --- | --- | --- |
| {{PACOTE_1}} | {{P1}} | {{F1}} | {{R1}} | {{PROD1}} |
| {{PACOTE_2}} | {{P2}} | {{F2}} | {{R2}} | {{PROD2}} |
| **Total** | {{P_TOTAL}} | {{F_TOTAL}} | {{R_TOTAL}} | {{PROD_TOTAL}} |

**Esperado para GO:** falhas = 0; parciais e “precisa produção” listados na seção 1.4 ou 8.

---

## 7. Runbook de produção

**Objetivo:** executar o cutover na ordem certa, com donos, critérios de sucesso e volta atrás.

### 7.1 Comunicação e janela

| Campo | Valor |
| --- | --- |
| Janela de mudança (início–fim, fuso) | {{JANELA_MUDANCA}} |
| Público afetado | {{PUBLICO_AFETADO}} |
| Canal e mensagem de comunicação | {{COMUNICACAO}} |
| Contato de war-room | {{CONTATO_WAR_ROOM}} |

### 7.2 Passos ordenados

| Passo | Ação (descrição) | Dono | Janela | Critério de sucesso | Feito |
| --- | --- | --- | --- | --- | --- |
| 0 | Confirmar freeze e parecer GO / GO CONDICIONAL | {{DONO_RELEASE}} | {{JANELA_0}} | Painel seção 1 coerente | ☐ |
| 1 | Pré-merge: leituras de banco e checagens de risco | {{DONO_BANCO}} | {{JANELA_1}} | Contagens dentro do esperado | ☐ |
| 2 | Provisionamento final (secrets/vars/flags) | {{DONO_INFRA}} | {{JANELA_2}} | Checklist 5.1/5.2 OK | ☐ |
| 3 | Backup / marcação da versão atual (API e app cliente) | {{DONO_INFRA}} | {{JANELA_3}} | Identificadores de rollback registrados | ☐ |
| 4 | Aprovar e promover artefato da API | {{APROVADOR}} / {{DONO_RELEASE}} | {{JANELA_4}} | Deploy saudável + smoke mínimo API | ☐ |
| 5 | Smoke mínimo pós-API (health, login, fluxo crítico) | {{DONO_RELEASE}} | {{JANELA_5}} | Critérios da tabela abaixo | ☐ |
| 6 | Promover app cliente (somente após API saudável, se houver dependência) | {{DONO_RELEASE}} | {{JANELA_6}} | App apontando para API nova; smoke UI | ☐ |
| 7 | Pós-deploy de dados (backfills create-only, cadastros operacionais) | {{DONO_BANCO}} | {{JANELA_7}} | Scripts com prévia → aplica → prévia = 0 | ☐ |
| 8 | Confirmar integrações (efeito final) | {{DONO_RELEASE}} | {{JANELA_8}} | Seção 5.3 OK ou mitigação ativa | ☐ |
| 9 | Observação pós-deploy | {{DONO_INFRA}} | {{DURACAO_OBSERVACAO}} (ex.: 24h) | Sem regressão nos alertas | ☐ |

#### Smoke mínimo pós-API (passo 5)

| Checagem | Esperado | OK |
| --- | --- | --- |
| Saúde do serviço | Resposta de sucesso do endpoint de health | ☐ |
| Feature flags críticas | Valores conforme tabela 5.2 | ☐ |
| Fluxo de autenticação básico | Login/sessão OK | ☐ |
| Uma tela/API crítica do release | Comportamento esperado | ☐ |

### 7.3 Observação pós-deploy

| Sinal | Baseline pré-cutover | Limiar de alerta | Dono |
| --- | --- | --- | --- |
| Taxa de erros 5xx do serviço API | {{BASE_5XX}} | {{LIMIAR_5XX}} | {{DONO_INFRA}} |
| Erros de runtime / schema (objeto inexistente, etc.) | {{BASE_RUNTIME}} | {{LIMIAR_RUNTIME}} | {{DONO_INFRA}} |
| Falhas de envio / integração | {{BASE_INTEG}} | {{LIMIAR_INTEG}} | {{DONO_RELEASE}} |

### 7.4 Rollback — código vs esquema/dados

#### Código

| Componente | Versão/revisão atual (pré-cutover) | Como reverter | Critério de sucesso da volta |
| --- | --- | --- | --- |
| Serviço API | {{REV_API_ATUAL}} | {{COMO_ROLLBACK_API}} | Tráfego na revisão anterior; health OK |
| App cliente | {{REV_CLIENTE_ATUAL}} | {{COMO_ROLLBACK_CLIENTE}} | Bundle/artefato anterior servido |
| Worker / job | {{REV_JOB_ATUAL}} | {{COMO_ROLLBACK_JOB}} | Job na imagem/revisão anterior |

#### Esquema / dados

| Item | Reversível após cutover? | Como | Ponto de não retorno |
| --- | --- | --- | --- |
| Migrations do delta | ☐ sim · ☐ não · ☐ parcial | {{ROLLBACK_SCHEMA}} | {{PONTO_NAO_RETORNO_SCHEMA}} |
| Backfills / dados | ☐ sim · ☐ não · ☐ parcial | {{ROLLBACK_DADOS}} | {{PONTO_NAO_RETORNO_DADOS}} |

**Regra explícita:** após {{PONTO_NAO_RETORNO_SCHEMA}}, rollback de código **não** desfaz schema; plano de contingência = {{CONTINGENCIA_POS_NAO_RETORNO}}.

---

## 8. Riscos aceitos

**Objetivo:** registrar o que segue para produção com olhos abertos — ou bloquear.

**Regra:** risco **pré-existente** só pode ser 🟠 com evidência objetiva (ex.: contagem de exposição = 0) + dono + prazo. Sem isso → 🔴.

| ID | Risco | Já existe em produção? | Impacto | Evidência | Decisão | Dono | Prazo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | {{RISCO_1}} | ☐ sim · ☐ não · ☐ desconhecido | {{IMPACTO_1}} | {{EV_R1}} | ☐ aceito · ☐ bloqueia | {{DONO_R1}} | {{PRAZO_R1}} |
| R2 | {{RISCO_2}} | ☐ | {{IMPACTO_2}} | {{EV_R2}} | ☐ aceito · ☐ bloqueia | {{DONO_R2}} | {{PRAZO_R2}} |

---

## 9. Aberto pós-promoção

**Objetivo:** não perder dívidas depois do GO.

| Item | Dono | Prioridade (alta/média/baixa) | Prazo | Status |
| --- | --- | --- | --- | --- |
| {{ABERTO_1}} | {{DONO_A1}} | {{PRI_A1}} | {{PRAZO_A1}} | ⚪ |
| {{ABERTO_2}} | {{DONO_A2}} | {{PRI_A2}} | {{PRAZO_A2}} | ⚪ |
| {{ABERTO_3}} | {{DONO_A3}} | {{PRI_A3}} | {{PRAZO_A3}} | ⚪ |

---

## 10. Apêndice de evidências

**Objetivo:** tornar cada 🟢 reproduzível e fechar gaps de auditorias anteriores.

### 10.1 Formato padrão de evidência

Para cada evidência citada nas seções 1–8, preencher uma linha:

| ID | O que foi executado / observado | Quando (data/hora fuso) | Commit / versão | Onde está o registro (link/path/ID) | Coletor |
| --- | --- | --- | --- | --- | --- |
| {{EV_G1}} | {{DESC_EV_G1}} | {{QUANDO_EV_G1}} | {{TIP_ORIGEM}} | {{ONDE_EV_G1}} | {{COLETOR_G1}} |
| {{EV_G2}} | {{DESC_EV_G2}} | {{QUANDO_EV_G2}} | {{TIP_ORIGEM}} | {{ONDE_EV_G2}} | {{COLETOR_G2}} |
| … | | | | | |

**Regra:** ID de evidência vazio ⇒ status do gate **não pode** ser 🟢.

### 10.2 Fechamento: gap de auditoria → evidência

| Gap apontado (auditoria / revisão anterior) | Status após esta validação | Evidência |
| --- | --- | --- |
| {{GAP_1}} | ☐ fechado · ☐ parcial · ☐ permanece | {{EV_GAP_1}} |
| {{GAP_2}} | ☐ | {{EV_GAP_2}} |

---

## Checklist final antes do merge

- [ ] Tip congelado = tip das evidências
- [ ] Placar atualizado; parecer coerente com a regra da seção 1
- [ ] Nenhum 🟢 sem linha no apêndice 10.1
- [ ] Nenhum 🟠 sem dono + justificativa + prazo
- [ ] G3/G4/G10/G11/G12 sem 🔴 nem ⚪
- [ ] Rollback código **e** schema preenchidos; ponto de não retorno explícito
- [ ] Comunicação e janela definidos
- [ ] Seção 9 revisada (dívidas não bloqueantes)

---

## Changelog do template

| Versão | Data | Mudança |
| --- | --- | --- |
| 1.0.0 | {{DATA_CRIACAO_TEMPLATE}} | Versão inicial: painel de status, gates G1–G12, código, schema/dados, infra/flags/integrações, smoke, runbook com rollback separado, riscos aceitos, aberto pós-promoção, apêndice de evidências, adaptações por stack. |

---

## Varredura de anonimização (preenchida na criação do template)

Checklist aplicado na geração deste arquivo:

- [x] Sem nomes de produto, cliente, empresa, repositório, épico ou ticket reais
- [x] Sem nomes de pessoas; apenas papéis `{{DONO_*}}` / `{{APROVADOR}}`
- [x] Sem SHAs, números de PR, IDs de log, serviços, tabelas, colunas, secrets, flags ou integrações reais
- [x] Sem SQL, código ou comandos concretos — apenas descrições do que consultar/executar e resultados esperados
- [x] Exemplos genéricos (“serviço de e-mail transacional”, “provedor de nuvem”, “feature flags”)

**Confirmação:** template 1.0.0 anonimizado e pronto para cópia por release.
