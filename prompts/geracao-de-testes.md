---
titulo: Geração de testes
objetivo: Gerar testes úteis e executáveis alinhados aos critérios de aceite — sem cobertura teatral.
quando_usar: Ao pedir testes para uma feature, bugfix ou regressão; antes de declarar uma entrega pronta.
ultima_revisao: 2026-10-10
tags: [prompt, testes, qa, cobertura]
---

# Contexto

Gere ou complete testes para `[PROJETO]` / `[CHAVES JIRA]`. Foque no comportamento que o aceite exige e nos regressões prováveis. Prefira poucos testes fortes a muitos frágeis.

# Passos

1. Extrair comportamentos verificáveis do aceite / bug report.
2. Listar casos: feliz, borda, erro, regressão do bug.
3. Escrever testes no estilo e framework já usados no repo.
4. Rodar os testes e colar comando + saída.
5. Apontar o que **não** está coberto e por quê.

## Formato de saída

- Casos cobertos (lista)
- Diff/arquivos de teste
- Comando executado + resultado
- Lacunas conscientes

# Armadilhas comuns

- Testar só o caminho feliz.
- Asserts fracos (`toBeTruthy` em tudo).
- Mocks que escondem a integração real sem necessidade.
- Declarar "cobertura ok" sem rodar.

# Checklist final

- [ ] Casos derivados do aceite
- [ ] Testes no padrão do repo
- [ ] Suite relevante executada com saída
- [ ] Lacunas explícitas
