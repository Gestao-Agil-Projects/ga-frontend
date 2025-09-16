# Sistema de Rotas - GA Frontend

## 📋 Visão Geral

Este documento descreve o sistema de rotas implementado no projeto GA Frontend, utilizando React Router DOM para gerenciar a navegação entre diferentes páginas da aplicação.

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── routes/
│   ├── index.tsx          # Configuração principal do roteador
│   ├── app.routes.tsx     # Definição das rotas da aplicação
│   └── types.ts           # Tipos TypeScript para as rotas
├── screens/
│   ├── Home/index.tsx     # Página inicial (/)
│   ├── About/index.tsx    # Página sobre (/about)
│   └── Contact/index.tsx  # Página contato (/contact)
└── components/
    └── Header/index.tsx   # Componente de cabeçalho com navegação
```

### Fluxo de Execução

```
App.tsx
└── Routes (index.tsx)
    └── AppRoutes (app.routes.tsx)
        ├── Home (/)
        ├── About (/about)
        └── Contact (/contact)
```

## 🔧 Configuração

### 1. Dependências

O sistema utiliza as seguintes dependências:

```json
{
  "react-router-dom": "^7.9.1",
  "@types/react-router-dom": "^5.3.3"
}
```

### 2. Configuração do Roteador Principal

**Arquivo**: `src/routes/index.tsx`

```tsx
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.routes";

export function Routes() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
```

**Responsabilidades**:
- Configura o `BrowserRouter` para habilitar roteamento baseado em URL
- Envolve toda a aplicação com capacidades de roteamento
- Permite uso de URLs como `/about`, `/contact`

### 3. Definição das Rotas

**Arquivo**: `src/routes/app.routes.tsx`

```tsx
import { Routes, Route } from "react-router-dom";
import { Home } from "../screens/Home";
import { About } from "../screens/About";
import { Contact } from "../screens/Contact";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
```

**Componentes**:
- `Routes`: Container que agrupa todas as rotas
- `Route`: Define uma rota específica
- `path`: URL que ativa a rota
- `element`: Componente que será renderizado

## 📱 Páginas da Aplicação

### Estrutura Padrão das Telas

Todas as telas seguem o mesmo padrão de estrutura:

```tsx
import { Header } from "../../components/Header";

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Conteúdo da página */}
        </div>
      </main>
    </div>
  );
}
```

### Páginas Disponíveis

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | `Home` | Página inicial da aplicação |
| `/about` | `About` | Página sobre a empresa |
| `/contact` | `Contact` | Página de contato |

## 🧭 Sistema de Navegação

### Componente Header

**Arquivo**: `src/components/Header/index.tsx`

```tsx
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              GA Frontend
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:text-primary hover:bg-gray-100"
              }`}
            >
              Sobre
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/contact")
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:text-primary hover:bg-gray-100"
              }`}
            >
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

### Funcionalidades do Header

- **Logo Clicável**: Leva para a página inicial
- **Navegação**: Botões para diferentes seções
- **Estado Ativo**: Destaque visual da página atual
- **Design Responsivo**: Adaptável a diferentes tamanhos de tela
- **Estilização**: Usando Tailwind CSS

## 🔄 Como Funciona a Navegação

### 1. Navegação por Link

```tsx
<Link to="/about">Sobre</Link>
```

**Processo**:
1. Usuário clica no link
2. React Router atualiza a URL para `/about`
3. Componente `About` é renderizado
4. Página não recarrega (SPA - Single Page Application)

### 2. Navegação por URL

```
Usuário digita: localhost:3000/about
↓
BrowserRouter detecta a URL
↓
AppRoutes encontra a rota correspondente
↓
Componente About é renderizado
```

### 3. Detecção de Estado Ativo

```tsx
const isActive = (path: string) => {
  return location.pathname === path;
};
```

- Detecta qual página está ativa
- Aplica estilos diferentes para a página atual
- Melhora a experiência do usuário

## 🚀 Como Adicionar Novas Rotas

### Passo 1: Criar o Componente

```tsx
// src/screens/Products/index.tsx
import { Header } from "../../components/Header";

export function Products() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Produtos
            </h1>
            <p className="text-gray-600">
              Lista de produtos disponíveis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

### Passo 2: Adicionar a Rota

```tsx
// src/routes/app.routes.tsx
import { Products } from "../screens/Products";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/products" element={<Products />} /> {/* Nova rota */}
    </Routes>
  );
}
```

### Passo 3: Adicionar Link no Header

```tsx
// src/components/Header/index.tsx
<Link
  to="/products"
  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive("/products")
      ? "bg-primary text-white"
      : "text-gray-700 hover:text-primary hover:bg-gray-100"
  }`}
>
  Produtos
</Link>
```

## 🎯 Vantagens do Sistema

### Performance
- **Sem Recarregamento**: Páginas mudam instantaneamente
- **Componentes Reutilizáveis**: Header é o mesmo em todas as páginas
- **Lazy Loading**: Possível carregar componentes sob demanda

### SEO e URLs
- **URLs Amigáveis**: `/about`, `/contact`
- **Navegação do Browser**: Botões voltar/avançar funcionam
- **Compartilhamento**: URLs podem ser compartilhadas

### Manutenibilidade
- **Separação de Responsabilidades**: Cada tela em seu próprio arquivo
- **Reutilização**: Header compartilhado entre todas as páginas
- **Escalabilidade**: Fácil adicionar novas rotas

## 🔧 Configurações Avançadas

### Rotas com Parâmetros

```tsx
<Route path="/user/:id" element={<UserProfile />} />
```

### Rotas Aninhadas

```tsx
<Route path="/admin" element={<AdminLayout />}>
  <Route path="users" element={<Users />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

### Redirecionamentos

```tsx
<Route path="/home" element={<Navigate to="/" replace />} />
```

### Rotas Protegidas

```tsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 📊 Resumo das Responsabilidades

| Componente | Responsabilidade | Localização |
|------------|------------------|-------------|
| `App.tsx` | Ponto de entrada da aplicação | `src/` |
| `Routes` | Configuração do roteador principal | `src/routes/` |
| `AppRoutes` | Definição das rotas específicas | `src/routes/` |
| `Header` | Navegação e interface do usuário | `src/components/` |
| `Home/About/Contact` | Telas da aplicação | `src/screens/` |

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de importação do React**
   - **Solução**: Remover importações desnecessárias do React (React 17+)

2. **Rota não encontrada**
   - **Verificar**: Se a rota está definida em `app.routes.tsx`
   - **Verificar**: Se o componente está importado corretamente

3. **Header não aparece**
   - **Verificar**: Se o componente Header está importado na tela
   - **Verificar**: Se o componente está sendo renderizado

### Logs Úteis

```tsx
// Para debug de rotas
console.log('Rota atual:', location.pathname);
console.log('Rota ativa:', isActive('/about'));
```

## 📚 Recursos Adicionais

- [Documentação React Router](https://reactrouter.com/)
- [React Router DOM](https://reactrouter.com/web/guides/quick-start)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Tailwind CSS](https://tailwindcss.com/)

---
