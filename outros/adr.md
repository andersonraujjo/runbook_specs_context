---
titulo: Template de ADR (Architecture Decision Record)
objetivo: Registrar uma decisão técnica relevante com contexto, opções, escolha e consequências.
quando_usar: Ao escolher entre caminhos com trade-offs que futuras pessoas (ou você) precisarão entender.
ultima_revisao: 2026-10-10
tags: [template, adr, decisao]
---

# Contexto

Copie este arquivo para `/decisoes/NNNN-titulo-curto.md` (ex.: `0001-usar-filas-para-email.md`). Preencha as seções abaixo. Evite nomes de cliente/empresa.

# Passos / Conteúdo

## Título

ADR NNNN — <decisão em uma linha>

## Status

Proposta | Aceita | Deprecated | Substituída por ADR NNNN

## Contexto

<!-- Problema, forças, restrições. O que torna a decisão necessária agora? -->

## Opções consideradas

### Opção A — <nome>

- Prós:
- Contras:

### Opção B — <nome>

- Prós:
- Contras:

### Opção C — <nome> (opcional)

- Prós:
- Contras:

## Decisão

<!-- Qual opção foi escolhida e por quê (critérios). -->

## Consequências

- Positivas:
- Negativas / dívidas aceitas:
- O que precisa mudar agora (código, docs, processo):

# Armadilhas comuns

- ADR que só descreve o estado final sem alternativas.
- Decisão implícita no chat nunca registrada.
- Texto com detalhe proprietário de cliente.

# Checklist final

- [ ] Contexto claro sem dados de empresa
- [ ] Pelo menos duas opções reais
- [ ] Decisão e consequências explícitas
- [ ] Arquivo numerado em `/decisoes` e linkado no README se desejado
