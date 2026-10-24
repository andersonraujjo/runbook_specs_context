---
titulo: Template de post-mortem
objetivo: Documentar um incidente ou falha de entrega com linha do tempo, causa raiz e ações.
quando_usar: Após incidente de produção, gap grave de épico, ou falha recorrente que precise de registro.
ultima_revisao: 2026-10-10
tags: [template, post-mortem, incidente]
---

# Contexto

Preencha com fatos. Sem culpa teatral e sem dados de cliente. Para análise profunda de gaps de épico, combine com `prompts/retrospectiva-causa-raiz.md`.

# Passos / Conteúdo

## Resumo

- Título:
- Data do incidente:
- Severidade: Baixa | Média | Alta
- Impacto (genérico): <!-- ex.: "API X ficou lenta por 20 min em staging" -->
- Status: Em análise | Ações abertas | Encerrado

## Linha do tempo

| Horário | Evento | Evidência |
|---------|--------|-----------|
| | | |

## O que aconteceu

<!-- Fatos observados -->

## O que deveria ter acontecido

<!-- Comportamento esperado -->

## Causa raiz

- Categoria: Requisito | Interação | Agente | Validação/testes | Documentação | Processo/Jira | Infra
- Descrição:
- Confiança: Alta | Média | Baixa

## O que funcionou bem

- ...

## Ações corretivas

| Ação | Dono | Prazo | Status |
|------|------|-------|--------|
| | [DEV A] | AAAA-MM-DD | |

# Armadilhas comuns

- Parar no sintoma ("reiniciamos e voltou").
- Ações sem dono ou sem prazo.
- Incluir logs com PII ou nomes reais de cliente.

# Checklist final

- [ ] Linha do tempo preenchida
- [ ] Causa raiz classificada
- [ ] Ações com dono e prazo
- [ ] Texto livre de dados de empresa/cliente
