---
titulo: Debug guiado
objetivo: Investigar e corrigir um bug seguindo um ciclo disciplinado: reproduzir → isolar → hipótese → teste → correção → regressão.
quando_usar: Bugs não óbvios, falhas intermitentes, ou quando o agente tende a "chutar" um fix sem evidência.
ultima_revisao: 2026-10-10
tags: [prompt, debug, bugfix, investigacao]
---

# Contexto

Debugue o problema em `[PROJETO]` relacionado a `[CHAVES JIRA]`. Não proponha correção antes de reproduzir e ter uma hipótese testável. Se não reproduzir, diga isso e peça mais dados.

# Passos

Siga esta ordem; não pule etapas sem justificar.

1. **Reproduzir**  
   Passos mínimos, ambiente, resultado atual vs. esperado. Se falhar a reprodução, parar e reportar.

2. **Isolar**  
   Reduzir superfície: qual módulo, input, commit ou condição dispara o defeito.

3. **Hipótese**  
   Uma hipótese clara e falsificável ("X falha porque Y quando Z").

4. **Teste da hipótese**  
   Experimento concreto (log, teste, breakpoint, input controlado). Registrar resultado: confirma / refuta.

5. **Correção**  
   Só após hipótese confirmada (ou nova hipótese validada). Mudança mínima no escopo do bug.

6. **Teste de regressão**  
   Teste automatizado ou checklist reproduzível que falharia sem o fix; executar e colar saída.

## Formato de saída

- Reprodução
- Isolamento
- Hipótese(s) e resultado dos testes
- Correção (o que mudou e por quê)
- Evidência de regressão coberta

# Armadilhas comuns

- Aplicar fix na primeira ideia sem reproduzir.
- Várias mudanças de uma vez (fica impossível saber o que resolveu).
- Declarar resolvido sem teste de regressão.

# Checklist final

- [ ] Bug reproduzido (ou bloqueio documentado)
- [ ] Hipótese testada com evidência
- [ ] Correção mínima aplicada
- [ ] Regressão verificada com saída
