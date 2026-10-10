---
titulo: Cheatsheet de comandos
objetivo: Atalho para comandos frequentes (git, docker, SQL e afins) sem depender de memória.
quando_usar: No dia a dia, em debug ou quando precisar de um comando seguro e genérico.
ultima_revisao: 2026-10-10
tags: [runbook, cheatsheet, git, docker, sql]
---

# Contexto

Cole aqui só comandos **genéricos** e seguros para colar. Sem hosts internos, tokens ou nomes de banco reais de cliente. Adapte `[PROJETO]` conforme necessário.

# Passos / Conteúdo

## Git

```bash
# Status e diff
git status
git diff
git diff --staged

# Atualizar branch local com a base
git fetch origin
git rebase origin/main   # ou: git merge origin/main

# Desfazer commits locais ainda não enviados (cuidado)
git reset --soft HEAD~1

# Stash rápido
git stash push -m "wip"
git stash list
git stash pop
```

## Docker

```bash
# Subir / derrubar stack local
docker compose up -d
docker compose ps
docker compose logs -f <servico>
docker compose down

# Entrar no container
docker compose exec <servico> sh

# Limpeza leve (não use em produção sem saber)
docker image prune
```

## SQL (exemplos genéricos)

```sql
-- Ver conexões / versão (sintaxe varia por motor)
SELECT version();

-- Contagem simples
SELECT COUNT(*) FROM <tabela>;

-- Amostra limitada
SELECT * FROM <tabela> ORDER BY id DESC LIMIT 20;

-- Transação segura para experimento local
BEGIN;
-- ... alterações de teste ...
ROLLBACK;
```

## Outros (preencher)

<!-- Ex.: package manager, migrations, linters do [PROJETO] -->

```bash
# npm/pnpm/yarn, make, etc.
```

# Armadilhas comuns

- Rodar `RESET`/`DROP` fora de ambiente local.
- Comitar `.env` com segredos.
- `docker compose down -v` apagando volumes sem querer.

# Checklist final

- [ ] Comandos revisados para o seu motor/stack
- [ ] Nenhum host, token ou dado de cliente no arquivo
- [ ] Seções específicas do [PROJETO] preenchidas conforme necessidade
