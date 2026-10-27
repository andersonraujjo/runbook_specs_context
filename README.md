# Segundo cérebro (docs pessoais)

Repositório pessoal de documentação operacional: prompts de IA, guias de processo, runbooks, templates e aprendizados — tudo em Markdown (pt-BR). Inclui também o gerador **meu-pdf** (Markdown → PDF).

> **Nenhuma informação de empresa ou cliente. Tudo genérico.**

Use sempre placeholders: `[ÉPICO]`, `[CHAVES JIRA]`, `[DEV A]`, `[DEV B]`, `[NOME DO DOCUMENTO]`, `[PROJETO]`.

---

## Índice

### Prompts

- [Retrospectiva de causa raiz](prompts/retrospectiva-causa-raiz.md)
- [Validação crítica de entrega](prompts/validacao-critica-entrega.md)
- [Briefing de início de chat](prompts/briefing-inicio-de-chat.md)
- [Revisão de PR](prompts/revisao-de-pr.md)
- [Geração de testes](prompts/geracao-de-testes.md)
- [Debug guiado](prompts/debug-guiado.md)
- [Verificador DoD pré-entrega](prompts/verificador-dod-pre-entrega.md)

### Processo

- [Como escrever uma task](processo/como-escrever-uma-task.md)
- [Checklist antes de concluir](processo/checklist-antes-de-concluir.md)
- [Como interagir com um agente](processo/como-interagir-com-agente.md)
- [Checklist de abertura e fechamento de épico](processo/checklist-abertura-e-fechamento-de-epico.md)

### Runbooks

- [Setup de ambiente](runbooks/setup-de-ambiente.md)
- [Deploy e rollback genérico](runbooks/deploy-e-rollback-generico.md)
- [Cheatsheet de comandos](runbooks/cheatsheet-comandos.md)

### Templates (docs)

Esqueletos de documento em [`outros/`](outros/):

- [ADR](outros/adr.md)
- [Post-mortem](outros/post-mortem.md)
- [Spec curta](outros/spec-curta.md)
- [Descrição de PR](outros/descricao-de-pr.md)
- [Ticket](outros/ticket.md)

Prompts/templates de processo maiores em [`templates/`](templates/):

- [Modus operandi](templates/modus-operandi.md)
- [Prompt auditoria de entrega](templates/prompt-auditoria-entrega.md)
- [Validação sandbox → main](templates/template-validacao-sandbox-main.md)

### TIL

- [README do TIL](til/README.md)
- [Exemplo: evidência antes de pronto](til/2026-10-10-evidencia-antes-de-pronto.md)

### Decisões

- [README das decisões (ADRs)](decisoes/README.md)

### Ferramentas

- [**meu-pdf**](meu-pdf/README.md) — Markdown → PDF A4 (CLI + GUI), presets `terminal` / `editorial` / `suico` / `blueprint`

---

## Como usar

1. **Antes de um chat com agente:** copie `prompts/briefing-inicio-de-chat.md`, preencha e cole no início da conversa.
2. **Ao escrever task:** siga `processo/como-escrever-uma-task.md` ou o template `outros/ticket.md`.
3. **Antes de fechar entrega:** use `processo/checklist-antes-de-concluir.md`; se for auditoria cética, o prompt `prompts/validacao-critica-entrega.md`.
4. **Ao fechar épico com gaps:** documento de gaps + `prompts/retrospectiva-causa-raiz.md`.
5. **Comandos e ops:** preencha os esqueletos em `/runbooks` com o que for seu (ainda genérico/público).
6. **Aprendizado rápido:** um arquivo em `/til` (máx. 5 linhas).
7. **Decisão duradoura:** copie `outros/adr.md` para `/decisoes/NNNN-titulo.md`.
8. **PDF a partir de Markdown:** veja `meu-pdf/README.md` (`npm install`, `node build.mjs …` ou `python ui/app.py`).

Cabeçalho padrão (exceto README e TIL): `titulo`, `objetivo`, `quando_usar`, `ultima_revisao`, `tags`, seguido de Contexto, Passos/Conteúdo, Armadilhas comuns, Checklist final.

---

## Como contribuir com um novo doc

1. Escolha a pasta certa (`prompts`, `processo`, `runbooks`, `outros`, `templates`, `til`, `decisoes`).
2. Copie um template ou um arquivo vizinho como base.
3. Preencha o cabeçalho YAML (se não for README/TIL).
4. Escreva Contexto, Passos/Conteúdo, Armadilhas comuns, Checklist final.
5. Use só placeholders genéricos — zero dados de empresa/cliente.
6. Adicione o link deste arquivo no **Índice** acima.
7. Atualize `ultima_revisao` quando editar de propósito.
