---
titulo: Checklist de abertura e fechamento de épico
objetivo: Padronizar o que precisa existir ao abrir e ao fechar um épico, reduzindo gaps e retrabalho.
quando_usar: No kickoff de `[ÉPICO]` e novamente na retrospectiva / aceite final.
ultima_revisao: 2026-10-10
tags: [processo, epico, checklist, kickoff, fechamento]
---

# Contexto

Épico sem abertura clara vira amontoado de tasks. Épico sem fechamento vira "quase pronto" eterno. Use este checklist nos dois momentos.

Placeholders: `[ÉPICO]`, `[CHAVES JIRA]`, `[PROJETO]`, `[DEV A]`, `[DEV B]`, `[NOME DO DOCUMENTO]`.

# Passos

## Abertura do épico

- [ ] Objetivo do épico em 2–4 frases (problema + resultado esperado)
- [ ] Escopo explícito e **fora de escopo** listados
- [ ] Critérios de sucesso do épico (verificáveis no conjunto, não só por task)
- [ ] Tasks iniciais criadas com aceite verificável (ver `como-escrever-uma-task.md`)
- [ ] Responsáveis claros (`[DEV A]`, `[DEV B]`…) sem ambiguidade de dono
- [ ] Docs de referência nomeados (`[NOME DO DOCUMENTO]`) ou criados a partir de `templates/spec-curta.md`
- [ ] Riscos / dependências conhecidos anotados
- [ ] Definição de pronto do épico acordada (o que precisa ser verdade para fechar)

## Durante (mínimo)

- [ ] Mudanças de escopo registradas no épico e nas tasks afetadas
- [ ] Evidências de progresso anexadas (PRs, testes), sem dados de cliente
- [ ] Bloqueios visíveis no Jira (não só no chat)

## Fechamento do épico

- [ ] Todos os critérios de sucesso do épico avaliados (✅ / ⚠️ / ❌)
- [ ] Tasks críticas fechadas com checklist de conclusão (`checklist-antes-de-concluir.md`)
- [ ] Validação crítica da entrega feita quando couber (`prompts/validacao-critica-entrega.md`)
- [ ] Documento de gaps preenchido (pedido vs. entregue), mesmo que vazio de gaps
- [ ] Retrospectiva de causa raiz se houver gaps relevantes (`prompts/retrospectiva-causa-raiz.md`)
- [ ] Docs finais atualizados (spec, runbooks, ADRs)
- [ ] Jira do épico e filhos em estado coerente com a realidade
- [ ] Aprendizados curtos em `/til` se algo for reutilizável
- [ ] Decisões relevantes em `/decisoes` (ADR) se o caminho escolhido importar no futuro

# Armadilhas comuns

- Abrir épico só com título e "vamos conversando".
- Fechar por data, não por critério.
- Esquecer o documento de gaps porque "foi bem".
- Deixar responsabilidade compartilhada sem dono por item.

# Checklist final

- [ ] Itens de abertura completos antes de coding intenso
- [ ] Itens de fechamento completos antes de Declaração de Done do épico
- [ ] Nenhuma informação de empresa/cliente nos artefatos deste repo
