---
titulo: Retrospectiva de causa raiz (post-mortem de épico)
objetivo: Localizar ONDE e POR QUE cada gap entre pedido e entregue surgiu, com evidência e classificação.
quando_usar: Ao fechar um épico, após um incidente de entrega, ou quando o documento de gaps estiver pronto e precisar de análise profunda.
ultima_revisao: 2026-10-10
tags: [prompt, post-mortem, causa-raiz, epico, gaps]
---

# Contexto

Você fará um post-mortem de épico. A fonte principal é o **documento de gaps** entre o que foi pedido e o que foi entregue. Seu trabalho não é reescrever o épico nem suavizar falhas: é achar a origem de cada desvio.

Placeholders típicos neste fluxo: `[ÉPICO]`, `[CHAVES JIRA]`, `[NOME DO DOCUMENTO]`, `[PROJETO]`.

# Passos

## 1. Objetivo da análise

Para cada gap, responder com precisão:

1. **ONDE** o gap surgiu (requisito, interação, agente, validação, documentação, processo/Jira).
2. **POR QUE** surgiu (causa raiz, não só sintoma).
3. Qual o **nível de confiança** da conclusão, baseado em evidência.

## 2. Fontes (nessa ordem)

Consulte e cite na ordem abaixo. Se alguma fonte falhar ou estiver inacessível, avise explicitamente — não invente.

1. Documento de gaps (`[NOME DO DOCUMENTO]`)
2. Histórico do chat da sessão de trabalho
3. Docs gerados durante o épico (specs, ADRs, checklists)
4. Jira (`[CHAVES JIRA]`) — descrição, comentários, transições, anexos
5. Padrões de documentação do repositório (templates, processos, runbooks)

## 3. Método por gap

Para **cada** gap do documento:

1. **O que foi pedido** — citar trecho ou critério de aceite original.
2. **O que foi entregue** — descrever o estado real (código, doc, ticket, comportamento).
3. **Linha do tempo da falha** — quando o desvio apareceu ou ficou possível (pedido → interpretação → implementação → validação → fechamento).
4. **Classificação da causa raiz** — uma categoria principal (ver abaixo); secundárias só se houver evidência.
5. **Nível de confiança** — Alto / Médio / Baixo, com justificativa curta (ex.: "Alto: critério explícito no ticket e ausência no PR").

## 4. Categorias de causa raiz

Use exatamente estas categorias:

| Categoria | Quando usar |
|-----------|-------------|
| **Requisito** | Pedido ambíguo, incompleto, contraditório ou mudado sem registro. |
| **Minha interação** | Instrução mal formulada, escopo omitido, aceite prematuro, contexto insuficiente dado ao agente. |
| **Agente** | Interpretação errada, alucinação, implementação fora do pedido apesar de instrução clara. |
| **Validação/testes** | Gap teria sido pegado por teste/revisão, mas não foi executado ou foi superficial. |
| **Documentação** | Spec/ADR/README desatualizado ou ausente induziu erro. |
| **Processo/Jira** | Status, handoff, definição de pronto ou rastreio no Jira falhou. |

## 5. Regras

- Basear-se **somente em evidência**. Sem evidência → confiança Baixa ou marcar como hipótese.
- **Não suavizar**. Se a falha foi humana (minha interação), diga isso.
- Se o acesso a uma fonte falhar, **avise** e continue com o que houver.
- Se um gap for **ambíguo**, pergunte antes de classificar — não assuma.
- Não misture recomendação com diagnóstico na mesma frase; separe seções.
- Não invente tickets, commits ou trechos que não viu.

## 6. Formato de saída

### A) Tabela resumo

| # | Gap (curto) | Causa raiz (categoria) | Confiança | Evidência-chave |
|---|-------------|------------------------|-----------|-----------------|

### B) Análise por gap

Para cada gap: pedido → entregue → linha do tempo → classificação → confiança → evidências citadas.

### C) Padrões recorrentes

Liste padrões que se repetem em 2+ gaps (ex.: "critérios de aceite não verificáveis", "aceite sem teste executado").

### D) Recomendações (separadas por área)

Agrupar em:

- Requisito
- Minha interação
- Agente
- Validação/testes
- Documentação
- Processo/Jira

Cada recomendação deve ser acionável e ligada a pelo menos um gap da tabela.

# Armadilhas comuns

- Tratar sintoma ("faltou campo X") como causa raiz sem perguntar por que ninguém detectou.
- Culpar só o agente quando o briefing omitiu escopo ou critérios.
- Usar histórico do chat como verdade sem cruzar com Jira/docs.
- Recomendações genéricas ("melhorar comunicação") sem amarra a gap concreto.

# Checklist final

- [ ] Todos os gaps do documento foram analisados
- [ ] Fontes consultadas na ordem; falhas de acesso reportadas
- [ ] Cada gap tem categoria + confiança + evidência
- [ ] Padrões recorrentes listados (ou "nenhum" explícito)
- [ ] Recomendações separadas por área e acionáveis
- [ ] Nenhum dado de cliente/empresa real no texto de saída
