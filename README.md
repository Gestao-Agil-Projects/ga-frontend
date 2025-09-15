# GA Frontend

Projeto React com TypeScript e Tailwind CSS configurado com sistema de design personalizado.

## 📋 Pré-requisitos

### Versões Necessárias

- **Node.js**: v20.19+ ou v22.12+ (recomendado: v22.19.0)
- **npm**: v10.9.3+ (vem com o Node.js)
- **Yarn**: v1.22.22+ (opcional, mas recomendado)
- **nvm**: v0.39.3+ (opcional, mas recomendado para gerenciar versões do Node.js)

### Instalação das Ferramentas

#### Opção 1: Usando Homebrew (macOS)
```bash
# Instalar Node.js
brew install node

# Instalar Yarn
brew install yarn

# Instalar nvm (opcional)
brew install nvm
```

#### Opção 2: Usando nvm (Recomendado - funciona em macOS, Linux e Windows)
```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Recarregar o terminal ou executar:
source ~/.bashrc  # Linux
# ou
source ~/.zshrc   # macOS com Zsh

# Instalar e usar a versão LTS do Node.js
nvm install --lts
nvm use --lts

# Instalar Yarn globalmente
npm install -g yarn
```

#### Opção 3: Download Direto
- **Node.js**: [nodejs.org](https://nodejs.org/) - baixar a versão LTS
- **Yarn**: [yarnpkg.com](https://yarnpkg.com/getting-started/install)

### Verificação das Instalações
```bash
node --version    # Deve mostrar v20.19+ ou v22.12+
npm --version     # Deve mostrar v10.9.3+
yarn --version    # Deve mostrar v1.22.22+
nvm --version     # Deve mostrar v0.39.3+ (se instalado)
```

## 🚀 Como Executar o Projeto

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd GA-FRONTEND
```

2. **Instale as dependências**
```bash
yarn install
# ou
npm install
```

3. **Execute o servidor de desenvolvimento**
```bash
yarn dev
# ou
npm run dev
```

4. **Abra o navegador**
Acesse [http://localhost:5173](http://localhost:5173)

## 📦 Scripts Disponíveis

- `yarn dev` - Inicia o servidor de desenvolvimento
- `yarn build` - Cria a build de produção
- `yarn preview` - Visualiza a build de produção
- `yarn lint` - Executa o linter ESLint

## 🛠️ Tecnologias e Bibliotecas Utilizadas

### Core
- **React 19.1.1** - Biblioteca para interfaces de usuário
- **TypeScript 5.8.3** - Superset do JavaScript com tipagem estática
- **Vite 7.1.2** - Build tool e servidor de desenvolvimento

### Styling
- **Tailwind CSS 3.4.17** - Framework CSS utilitário
- **PostCSS 8.5.6** - Processador CSS
- **Autoprefixer 10.4.21** - Adiciona prefixos CSS automaticamente

### Roteamento
- **React Router DOM 7.9.1** - Roteamento para React

### Ícones
- **Lucide React 0.544.0** - Biblioteca de ícones
- **Heroicons 2.2.0** - Ícones do Tailwind

### Gerenciamento de Estado
- **Zustand 5.0.8** - Gerenciamento de estado global

### Utilitários
- **Axios 1.12.2** - Cliente HTTP
- **clsx 2.1.1** - Utilitário para classes CSS condicionais
- **tailwind-merge 3.3.1** - Merge de classes Tailwind

### Desenvolvimento
- **ESLint 9.35.0** - Linter para JavaScript/TypeScript
- **Prettier 3.6.2** - Formatador de código
- **@types/node 24.5.0** - Tipos do Node.js

## 🔧 Configuração do Ambiente

### Para usuários que NÃO usam Homebrew:
As instruções acima funcionam independentemente do gerenciador de pacotes usado. O nvm é a opção mais universal e funciona em:
- macOS (com ou sem Homebrew)
- Linux (Ubuntu, Debian, CentOS, etc.)
- Windows (via WSL ou Git Bash)

### Troubleshooting

**Problema**: "Vite requires Node.js version 20.19+ or 22.12+"
**Solução**: Atualize o Node.js usando nvm:
```bash
nvm install --lts
nvm use --lts
```

**Problema**: "command not found: yarn"
**Solução**: Instale o Yarn:
```bash
npm install -g yarn
```

**Problema**: "vite: command not found"
**Solução**: Reinstale as dependências:
```bash
yarn install
```

**Problema**: Cores personalizadas não aparecem
**Solução**: Verifique se o Tailwind está configurado corretamente:
```bash
# Verifique se o arquivo tailwind.config.js existe
# Verifique se o postcss.config.js está correto
# Reinicie o servidor de desenvolvimento
yarn dev
```