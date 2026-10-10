---
titulo: Verificador DoD pré-entrega
objetivo: Validar com evidência que o entregue atende ao pedido antes de dar a task como concluída
quando_usar: Antes de abrir/aprovar PR, fechar task ou entregar qualquer correção/feature
ultima_revisao: 2026-10-10
tags: [qa, dod, validacao, pre-entrega]
---

## Contexto
Vou entregar [TASK/ID: ex. PROJ-123]. Preciso de uma validação independente 
e rigorosa de que o que foi feito corresponde ao que foi pedido. 
Assuma postura de revisor/QA cético: nada está correto até ser comprovado.

## Entradas (preencha antes de rodar)
- Task/escopo: [ID, link ou descrição]
- Fonte do pedido: [task, PDF, spec, ticket, trecho do chat]
- Repo/área do código: [repo, pastas, módulos]
- Comando de testes: [ex.: npm test, pytest, mvn test]
- Escopo restrito (opcional): [somente itens de X / somente o módulo Y]. 
  Se preenchido, ignore todo o resto: não valide, não teste, não comente. 
  Se uma mudança minha depender de algo fora do escopo, apenas sinalize 
  a dependência em uma linha.

## Passo 0: confirmação do escopo (obrigatório)
Antes de validar, liste numerados todos os requisitos/itens que você 
extraiu da fonte do pedido, sem resumir. Marque como "ambíguo" o que não 
tiver dono ou critério claro e pergunte antes de incluir ou excluir. 
Só prossiga depois dessa lista.

## Fontes de verdade (nesta ordem)
1. Fonte do pedido: define o que deveria estar pronto.
2. Estado atual do código/docs/artefatos: leia os arquivos reais, não 
   confie na descrição do que foi feito.
3. Diff das mudanças (git diff / PR): o que realmente mudou.
4. Task original e critérios de aceite (Jira ou equivalente).
5. Meus padrões de documentação e de código, para checar conformidade.
6. Histórico do chat, se houver: o que foi declarado como feito.

## Método (para cada requisito)
a) Critério de aceite: reescreva o que precisa ser verdadeiro para 
   considerar o item resolvido (observável e verificável). Se a fonte 
   for vaga, explicite sua interpretação e sinalize.
b) Verificação no estado atual: compare o código/doc final com o 
   critério. Cite arquivo e trecho.
c) Testes: EXECUTE de verdade (suíte existente, testes novos para o 
   item, reprodução do cenário original do problema). Cubra caminho 
   feliz, bordas, entradas inválidas e regressão em áreas vizinhas. 
   Mostre comando e saída. Se não conseguir executar, diga isso e NÃO 
   marque como validado.
d) Busca ativa por falhas: tente quebrar a correção. Procure correção 
   parcial, tratamento só do sintoma, hardcode, casos não cobertos, 
   divergência entre doc e implementação.
e) Veredito: ✅ Resolvido (com evidência) | ⚠️ Parcial | ❌ Não resolvido | 
   ❓ Não verificável (e por quê).

## Verificações transversais
- Regressões: o que funcionava antes ainda funciona?
- Escopo: algo foi alterado fora do que foi pedido (arquivos, 
  dependências, configs)?
- Requisitos esquecidos: itens do pedido que nunca foram endereçados.
- Consistência: código, docs e Jira contam a mesma história?
- Afirmações de "pronto" que não se sustentam no estado real.

## Checklist DoD (marque ✅/❌ com evidência ou justificativa)
- [ ] Todos os critérios de aceite atendidos
- [ ] Testes novos/ajustados cobrindo a mudança
- [ ] Suíte completa passando (saída anexada)
- [ ] Sem regressão em fluxos vizinhos
- [ ] Lint/build/type-check sem erros novos
- [ ] Tratamento de erro e casos de borda cobertos
- [ ] Sem segredo, credencial, log de debug ou código morto commitado
- [ ] Sem TODO/FIXME novo sem justificativa
- [ ] Documentação atualizada (README, runbook, changelog, API docs)
- [ ] Migrations/configs/variáveis de ambiente documentadas, se houver
- [ ] Impacto em performance, segurança e compatibilidade avaliado
- [ ] Descrição do PR/task clara, com link para o pedido original
- [ ] Plano de rollback conhecido, se aplicável

## Regras
- Só marque ✅ com evidência concreta (saída de teste, trecho de código, 
  comparação direta). "Parece correto" não vale.
- Não confie em resumos; verifique o artefato real.
- Seja direto e crítico, sem suavizar. Não diga que está tudo bem para 
  me agradar.
- Se algum acesso falhar (Jira, repo, ambiente), avise e liste o que 
  ficou sem validar.
- Se algo estiver ambíguo, pergunte antes de concluir.

## Formato de saída
1. Lista dos requisitos identificados (e dos ambíguos), antes de 
   qualquer análise
2. Placar: X resolvidos / Y parciais / Z não resolvidos / W não 
   verificáveis, de N itens
3. Tabela: Item | Critério de aceite | Evidência | Testes executados | 
   Veredito
4. Detalhe dos itens ⚠️ e ❌: o que falta, risco e como corrigir
5. Regressões e problemas novos encontrados
6. Checklist DoD preenchido
7. Dependências fora do escopo (uma linha cada), se houver
8. Pendências priorizadas (bloqueantes primeiro)
9. Parecer final: pronto para entrega? Sim/Não e por quê.

## Armadilhas comuns
- Validar a própria narrativa do chat em vez do código real.
- Aprovar por ausência de erro sem ter executado nada.
- Testar só o caminho feliz.
- Esquecer itens do pedido que nunca apareceram no diff.
