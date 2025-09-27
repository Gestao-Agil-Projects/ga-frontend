# GitFlow - GA Frontend

## 📋 Visão Geral

Este documento descreve o fluxo de trabalho Git implementado no projeto GA Frontend, baseado no GitFlow adaptado para as necessidades específicas do projeto.

## 🏗️ Estrutura de Branches

### Branches Principais

```
main (backup da homolog)
├── homolog (deploy para produção)
└── develop (branch principal de desenvolvimento)
    ├── feat-cardUser (exemplo de feature)
    ├── feat-userProfile
    ├── fix-loginBug
    └── ... (outras features)
```

### Hierarquia de Branches

| Branch | Propósito | Deploy | Status |
|--------|-----------|--------|--------|
| `main` | Backup da homolog | ❌ | Estável |
| `homolog` | Deploy para produção | ✅ | Estável |
| `develop` | Desenvolvimento principal | ❌ | Ativa |
| `feat-*` | Features específicas | ❌ | Temporária |

## 🔄 Fluxo de Trabalho

### 1. Desenvolvimento de Features

```bash
# 1. Criar branch de feature a partir da develop
git checkout develop
git pull origin develop
git checkout -b feat-cardUser

# 2. Desenvolver a feature
# ... fazer commits ...

# 3. Fazer push da feature
git push -u origin feat-cardUser

# 4. Criar Pull Request para develop
# GitHub: feat-cardUser → develop
```

### 2. Deploy para Homologação

```bash
# 1. Fazer merge da develop para homolog
git checkout homolog
git pull origin homolog
git merge develop
git push origin homolog

# 2. Deploy automático para ambiente de homologação
```

### 3. Backup para Main

```bash
# 1. Após validação na homolog, fazer backup na main
git checkout main
git pull origin main
git merge homolog
git push origin main
```

## 📱 Exemplo Prático

### Cenário: Implementar Card de Usuário

```bash
# 1. Criar branch da feature
git checkout develop
git pull origin develop
git checkout -b feat-cardUser

# 2. Desenvolver
echo "Implementando card de usuário..." > card-user.md
git add .
git commit -m "feat: implementa card de usuário"

# 3. Push e PR
git push -u origin feat-cardUser
# Criar PR: feat-cardUser → develop

# 4. Após aprovação, merge na develop
git checkout develop
git pull origin develop
git merge feat-cardUser
git push origin develop

# 5. Deploy para homolog
git checkout homolog
git pull origin homolog
git merge develop
git push origin homolog

# 6. Backup na main
git checkout main
git pull origin main
git merge homolog
git push origin main

# 7. Limpeza
git branch -d feat-cardUser
git push origin --delete feat-cardUser
```

## 🎯 Convenções de Nomenclatura

### Branches de Feature

```bash
feat-nomeDaFeature    # Nova funcionalidade
fix-nomeDoBug        # Correção de bug
refactor-nome        # Refatoração
docs-nome            # Documentação
test-nome            # Testes
```

### Commits

```bash
feat: adiciona card de usuário
fix: corrige bug no login
refactor: melhora performance do header
docs: atualiza documentação do gitflow
test: adiciona testes para userService
```

## 🔧 Configurações

### Branch Padrão

- **GitHub**: Configurar `develop` como branch padrão
- **Local**: Sempre trabalhar a partir da `develop`

### Proteções de Branch

```yaml
# main
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes

# homolog
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date

# develop
- Require pull request reviews
- Require status checks to pass
```

## 🚀 Comandos Úteis

### Comandos Básicos

```bash
# Ver branches
git branch -a

# Mudar para develop
git checkout develop
git pull origin develop

# Criar feature
git checkout -b feat-nomeDaFeature

# Ver status
git status

# Ver histórico
git log --oneline --graph
```

### Comandos de Merge

```bash
# Merge develop → homolog
git checkout homolog
git merge develop
git push origin homolog

# Merge homolog → main
git checkout main
git merge homolog
git push origin main
```

### Comandos de Limpeza

```bash
# Deletar branch local
git branch -d feat-nomeDaFeature

# Deletar branch remota
git push origin --delete feat-nomeDaFeature

# Limpar branches merged
git branch --merged | grep -v "\*\|main\|develop\|homolog" | xargs -n 1 git branch -d
```

## 📊 Fluxo Visual

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│  main   │    │ homolog │    │ develop │
│(backup) │    │(deploy) │    │(active) │
└─────────┘    └─────────┘    └─────────┘
     ▲              ▲              ▲
     │              │              │
     │              │              │
     └──────────────┼──────────────┘
                    │
                    │
               ┌─────────┐
               │feat-*   │
               │(feature)│
               └─────────┘
```

## 🎯 Vantagens do Fluxo

### Organização
- **Separação clara**: Cada branch tem um propósito específico
- **Rastreabilidade**: Histórico claro de mudanças
- **Backup**: Main serve como backup da homolog

### Deploy
- **Homologação**: Ambiente de teste antes da produção
- **Rollback**: Possibilidade de voltar versões
- **Controle**: Deploy controlado e testado

### Colaboração
- **Pull Requests**: Revisão de código obrigatória
- **Features isoladas**: Desenvolvimento paralelo
- **Conflitos**: Resolução antes do merge

## 🐛 Troubleshooting

### Problemas Comuns

1. **Conflito de merge**
   ```bash
   git status
   # Resolver conflitos manualmente
   git add .
   git commit -m "resolve merge conflicts"
   ```

2. **Branch desatualizada**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feat-nomeDaFeature
   git rebase develop
   ```

3. **Commit na branch errada**
   ```bash
   git log --oneline
   git reset --soft HEAD~1
   git stash
   git checkout branch-correta
   git stash pop
   git commit -m "commit message"
   ```

### Logs Úteis

```bash
# Ver histórico visual
git log --oneline --graph --all

# Ver diferenças
git diff develop..feat-nomeDaFeature

# Ver commits não merged
git log develop..feat-nomeDaFeature
```

## 📚 Recursos Adicionais

- [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/doc)

---

## 📝 Resumo do Fluxo

1. **Desenvolvimento**: `feat-*` → `develop` (via PR)
2. **Deploy**: `develop` → `homolog` (merge direto)
3. **Backup**: `homolog` → `main` (merge direto)
4. **Limpeza**: Deletar branches de feature após merge

### Comandos Essenciais

```bash
# Trabalhar em feature
git checkout develop && git pull
git checkout -b feat-nomeDaFeature
# ... desenvolver ...
git push -u origin feat-nomeDaFeature
# Criar PR para develop

# Deploy
git checkout homolog && git merge develop && git push
git checkout main && git merge homolog && git push

# Limpeza
git branch -d feat-nomeDaFeature
git push origin --delete feat-nomeDaFeature
```

---
