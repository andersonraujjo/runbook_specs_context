# Modus Operandi: Execução de Tasks

## Objetivo
Este documento define como você (agente) deve trabalhar em cada card/task, para que eu não precise repetir as orientações a cada tarefa. Siga os passos abaixo na ordem, sem pular nenhum.

## Configuração do projeto
> Preencha uma vez e mantenha. Se algum item estiver vazio ou não existir, pergunte antes de prosseguir.

- **Pasta raiz de documentação:** `<CAMINHO_RAIZ_DOCS>`
- **Pasta de ADR e docs do épico/projeto:** `<CAMINHO_DOCS_DO_EPICO>`
- **Pasta de tasks:** `<CAMINHO_DOCS_DO_EPICO>\tasks`
- **Template de auditoria:** `<CAMINHO_RAIZ_DOCS>\docs\templates\prompt-auditoria-entrega.md`
- **Documento de dívida técnica:** `<NOME_DO_DOC_DE_DIVIDAS>`
- **Documento de provisionamento de infra:** `<NOME_DO_DOC_DE_INFRA>`
- **Ferramenta de gestão de tasks:** `<EX.: Jira, via MCP/API>`

## Fontes de verdade
- **Card/task:** o que eu colar no chat.
- **ADR e documentação do épico/projeto:** pasta indicada na configuração.
- **Pasta de tasks:** onde ficam os artefatos de cada card.

Se houver conflito entre o card, a ADR e os docs, **não decida sozinho**: aponte o conflito, mostre os trechos divergentes e peça minha decisão.

## Regra de ouro: execução faseada
- Execute **um passo por vez**.
- Ao terminar um passo, apresente o resultado, diga qual é o próximo e **pare**.
- Só avance depois que eu responder com um OK explícito.
- Nunca execute vários passos na mesma resposta.
- Nunca faça commit, push ou alteração fora do escopo do card sem autorização.
- Se eu pedir para voltar a um passo anterior, volte e refaça a partir dele.

---

## Passo 1: Análise da task e bloqueios
1. Leia o card por completo e consulte a ADR e os docs relevantes.
2. Resuma em poucas linhas o que o card pede.
3. Identifique bloqueios: dependências não entregues, informações faltando, conflitos com a ADR, acessos ou infra necessários.
4. Responda **apenas no chat** (ainda não crie arquivos) com:
   - Resumo do entendimento
   - Bloqueios encontrados (ou "nenhum bloqueio identificado")
   - Dúvidas, se houver

⏸️ **Pare e aguarde meu OK.**

## Passo 2: Pasta da task, análise e plano
1. Crie a pasta `<pasta de tasks>\<ID-do-card>-<slug-curto>` (ex.: `PROJ-123-ajuste-tema`). Se eu não informar o ID, pergunte.
2. Dentro dela, salve:
   - `analise.md`: contexto, escopo, fora de escopo, bloqueios, riscos, decisões tomadas.
   - `plano-implementacao.md`: passos de implementação em ordem, arquivos/módulos afetados, estratégia de testes, critérios de aceite extraídos do card.
3. Mostre um resumo dos dois arquivos no chat.

⏸️ **Pare e aguarde meu OK.**

## Passo 3: Checagem final de bloqueios e dúvidas
1. Releia o plano e confirme se ainda há bloqueio, dúvida ou suposição não validada.
2. Liste tudo de forma objetiva. Se não houver nada, diga explicitamente "pronto para implementar".

⏸️ **Pare e aguarde meu OK.** Não comece a implementar com dúvida em aberto.

## Passo 4: Implementação
1. Implemente exatamente o que está no plano. Não adicione escopo extra.
2. Siga os padrões já existentes no código e o que estiver definido na ADR.
3. Se surgir algo imprevisto, pare e me consulte antes de mudar o plano. Se o plano mudar, atualize `plano-implementacao.md`.
4. Ao final, resuma o que foi feito, os arquivos alterados e como testar.

⏸️ **Pare e aguarde meu OK.**

## Passo 5: Validação e auditoria
A validação tem **três frentes**, nesta ordem:

1. **Card:** cada critério de aceite foi atendido? Monte um checklist item a item.
2. **ADR e docs** do projeto: a implementação respeita as decisões e padrões documentados?
3. **Auditoria da entrega:** leia e siga integralmente o documento `prompt-auditoria-entrega.md` (caminho na configuração, dentro de `docs\templates`). Execute a auditoria exatamente como ele descreve, sem pular etapas e sem adaptar o formato por conta própria. Se o arquivo não for encontrado ou estiver ambíguo, **pare e me avise** em vez de improvisar uma auditoria.

Apresente o resultado consolidado em tabela (critério | atendido? | evidência), incluindo o resultado da auditoria. Liste qualquer divergência, dívida técnica ou item pendente. Se encontrar problema, proponha a correção e aguarde meu OK antes de aplicar. Salve o resultado da auditoria na pasta da task (ex.: `auditoria.md`).

⏸️ **Pare e aguarde meu OK.**

## Passo 6: Push, PR e atualização da documentação
1. Faça o push da branch (somente após meu OK neste passo).
2. Me entregue o texto da PR com: título, contexto, o que mudou, como testar, impactos, dívidas técnicas e itens de infra, e link/ID do card.
3. Atualize os docs dentro da pasta de documentação do projeto, com atenção especial a:
   - **Dívida técnica** criada ou identificada → atualizar o documento de dívida técnica (novo item + histórico). Trabalho só **adiado para outro card da fila** **não** é dívida: registre no comentário do card ou na task, não no documento de dívidas.
   - **Provisionamento de infra** necessário (recursos, variáveis, permissões, pipelines) → atualizar o documento de provisionamento de infra (+ chamado na pasta da task, se aplicável). Se o item de infra puder escorregar além do prazo da entrega, **também** registrar como dívida técnica, com link para o item de infra.
   - Mudanças que afetem a ADR ou decisões anteriores.
4. Liste quais docs foram alterados e o que mudou em cada um.

⏸️ **Pare e aguarde meu OK.**

## Passo 7: Mover o card na ferramenta de gestão
1. Confirme comigo o **status de destino** se houver dúvida (ex.: card compartilhado entre FE e BE: não fechar como Done se o outro lado ainda está aberto).
2. Após meu OK, faça a transição do card (MCP/API da ferramenta configurada).
3. Adicione um comentário no card com: o que foi entregue nesta fatia, link da PR, o que permanece aberto (se houver).
4. Confirme no chat o status final e o link do card.

✅ **Fim do card.** Aguarde o próximo.

---

## Regras gerais
- Em dúvida, pergunte. Não invente requisitos nem assuma silenciosamente.
- Seja objetivo nas respostas: o que fez, o que falta, o que precisa de mim.
- Registre decisões relevantes nos arquivos da task, não só no chat.
- Card compartilhado entre mais de uma pessoa ou frente: avance o status só o necessário e documente a fatia entregue no comentário. **Não** marque Done sem o escopo completo do card.
- Ao iniciar uma nova task, releia este documento e a seção de configuração antes de começar o Passo 1.
