---
titulo: Setup de ambiente
objetivo: Deixar uma máquina pronta para desenvolver/testar o projeto genérico localmente.
quando_usar: No onboarding de uma máquina nova ou ao resetar o ambiente local.
ultima_revisao: 2026-10-10
tags: [runbook, setup, ambiente]
---

# Contexto

Preencha este runbook com os passos **genéricos** do seu `[PROJETO]`. Não inclua hosts internos, tokens, nomes de cliente ou URLs privadas.

# Passos

## Pré-requisitos

<!-- Listar versões mínimas: linguagem, runtime, gerenciador de pacotes, Docker, etc. -->

1. ...
2. ...

## Clone e dependências

```bash
# Exemplo genérico — adapte ao projeto
git clone <url-do-repositorio>
cd <nome-do-repo>
# instalar dependências...
```

## Variáveis de ambiente

<!-- Listar nomes de variáveis (sem valores secretos). Ex.: DATABASE_URL, APP_PORT -->

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `APP_PORT` | não | Porta local (padrão: 3000) |
| `DATABASE_URL` | sim | Connection string local |

## Subir serviços locais

<!-- Ex.: docker compose up, migrations, seed fictício -->

1. ...
2. ...

## Validar que o setup funcionou

```bash
# comando de smoke genérico
# saída esperada: ...
```

# Armadilhas comuns

<!-- Ex.: esquecer migration; Node errado; porta ocupada -->

- ...

# Checklist final

- [ ] Pré-requisitos instalados nas versões mínimas
- [ ] Dependências instaladas
- [ ] Env configurado (sem commitar segredos)
- [ ] Smoke de validação passou
