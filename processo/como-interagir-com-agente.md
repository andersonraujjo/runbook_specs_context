---
titulo: Como interagir com um agente
objetivo: Extrair trabalho útil de agentes de IA sem aceitar "pronto" vazio e sem deixar o escopo escapar.
quando_usar: Em qualquer sessão com agente — coding, docs, debug, revisão ou validação.
ultima_revisao: 2026-10-10
tags: [processo, agente, briefing, evidencia]
---

# Contexto

Agentes otimizam por parecerem úteis. Sua responsabilidade é definir escopo, exigir evidência e registrar mudanças. Use o briefing em `prompts/briefing-inicio-de-chat.md` como ponto de partida.

# Passos

## 1. Sempre informar contexto e escopo

No início do chat (ou ao mudar de assunto):

- O que é `[PROJETO]` / `[ÉPICO]` / `[CHAVES JIRA]`
- O que fazer e o que **não** fazer
- Critérios de aceite verificáveis
- Restrições (responsável `[DEV A]` vs. ignorar `[DEV B]`, áreas intocáveis)

Sem isso, qualquer entrega é chute bem formatado.

## 2. Sempre exigir evidência e testes executados

Antes de aceitar qualquer "feito":

- Peça comando + saída (teste, lint, build, reprodução)
- Peça diff ou lista de arquivos alterados
- Recuse prova baseada só em narrativa do chat

Frase útil: *"Mostre o comando e a saída. Sem isso não está pronto."*

## 3. Não aceitar "pronto" sem verificação

Trate declaração de pronto como hipótese:

1. Confrontar com o aceite
2. Rodar ou exigir os testes
3. Só então marcar Done / aprovar

Se estiver revisando entrega de outro, use `prompts/validacao-critica-entrega.md`.

## 4. Registrar mudanças de escopo

Quando o escopo mudar no meio do chat:

- Escreva a mudança em uma linha explícita ("Escopo atualizado: …")
- Atualize o ticket/Jira se a mudança for real, não só exploratória
- Ajuste critérios de aceite — não deixe o antigo e o novo misturados

Se a mudança for grande, feche o chat antigo e abra outro com briefing novo.

# Armadilhas comuns

- Briefing de uma linha e depois cobrar precisão cirúrgica.
- Aceitar "todos os testes passaram" sem ver a saída.
- Deixar o agente expandir escopo ("também refatorei…") sem registrar.
- Misturar investigação, implementação e post-mortem no mesmo fio sem fases.

# Checklist final

- [ ] Contexto + escopo + fora de escopo informados
- [ ] Evidência e testes exigidos antes do aceite
- [ ] "Pronto" verificado contra critérios
- [ ] Mudanças de escopo registradas no chat e, se preciso, no ticket
