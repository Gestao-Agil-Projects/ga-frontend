# Camada de Stores - GA Frontend

## 📋 Visão Geral

Este documento descreve a camada de stores implementada no projeto GA Frontend, utilizando Zustand para gerenciamento de estado global da aplicação. Os stores são responsáveis por centralizar e gerenciar dados compartilhados entre componentes.

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── store/
│   ├── createUserStore.ts     # Store para criação de usuário
│   ├── userStore.ts           # Store para dados do usuário logado
│   ├── dtos/
│   │   ├── createUser.dto.ts  # DTOs para criação de usuário
│   │   └── user.dto.ts        # DTOs para usuário
│   └── types/
│       ├── TCreateUserData.ts # Tipos para criação de usuário
│       └── TUserData.ts       # Tipos para usuário
```

### Fluxo de Execução

```
Componente (ModalLogin)
└── createUserStore() / userStore()
    └── Zustand Store
        └── Estado Global
            └── Outros Componentes
```

## 🔧 Configuração do Zustand

### 1. Dependências

```json
{
  "zustand": "^4.4.7"
}
```

### 2. Store de Criação de Usuário

**Arquivo**: `src/store/createUserStore.ts`

```tsx
import { create } from "zustand";

interface CreateUserStore {
    // Estados
    email: string;
    password: string;
    full_name: string;
    cpf: string;
    phone: string;
    birth_date: string;
    
    // Actions
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setFullName: (full_name: string) => void;
    setCpf: (cpf: string) => void;
    setPhone: (phone: string) => void;
    setBirthDate: (birth_date: string) => void;
}

export const createUserStore = create<CreateUserStore>((set) => ({
    // Estados iniciais
    email: '',
    password: '',
    full_name: '',
    cpf: '',
    phone: '',
    birth_date: '',
    
    // Actions
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setFullName: (full_name) => set({ full_name }),
    setCpf: (cpf) => set({ cpf }),
    setPhone: (phone) => set({ phone }),
    setBirthDate: (birth_date) => set({ birth_date }),
}));
```

**Responsabilidades**:
- Gerencia dados do formulário de cadastro
- Fornece actions para atualizar cada campo
- Mantém estado local do formulário

### 3. Store de Usuário Logado

**Arquivo**: `src/store/userStore.ts`

```tsx
import { create } from "zustand";
import type { TUserAccountData, TUserDto } from "./dtos/user.dto";
import type { TUserData } from "./types/TUserData";

export const userStore = create<TUserDto>((set) => ({
    // Estados
    user: null,
    userAccountData: null,
    
    // Actions
    setUser: (userData: TUserData | null) =>
        set({ user: userData }),

    setUserAccountData: (userAccountData: TUserAccountData | null) =>
        set({ userAccountData: userAccountData }),
}));
```

**Responsabilidades**:
- Gerencia dados do usuário logado
- Armazena informações de autenticação
- Controla estado de login da aplicação

## 📱 DTOs e Tipos

### 1. DTOs de Usuário

**Arquivo**: `src/store/dtos/user.dto.ts`

```tsx
import type { TUserData } from "../types/TUserData";

export type TUserDto = {
    user: TUserData | null;
    setUser: (user: TUserData | null) => void;
    userAccountData: TUserAccountData | null;
    setUserAccountData: (userAccountData: TUserAccountData | null) => void;
}

export type TUserAccountData = {
    access_token: string;
}
```

### 2. Tipos de Dados

**Arquivo**: `src/store/types/TUserData.ts`

```tsx
export type TUserData = {
    id: string;
    email: string;
    full_name: string;
    cpf: string;
    phone: string;
    birth_date: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    role: string;
    frequency: string;
}
```

**Arquivo**: `src/store/types/TCreateUserData.ts`

```tsx
export type TCreateUserData = {
    email: string;
    password: string;
    full_name: string;
    cpf: string;
    phone: string;
    birth_date: string;
}
```

## 🔄 Como Funcionam os Stores

### 1. Uso no Componente

```tsx
// src/components/Modals/ModalLogin/index.tsx
import { createUserStore } from "../../../store/createUserStore";
import { userStore } from "../../../store/userStore";

export default function ModalLogin() {
    // Acessar dados do store
    const { 
        email, 
        setEmail, 
        password, 
        setPassword,
        full_name,
        setFullName,
        cpf,
        setCpf,
        phone,
        setPhone,
        birth_date,
        setBirthDate
    } = createUserStore();
    
    const { user, setUser, userAccountData, setUserAccountData } = userStore();

    // Usar os dados no componente
    const handleCreateUser = async () => {
        const userData = {
            email: email.trim(),
            password: password.trim(),
            full_name: full_name.trim(),
            cpf: cleanCPF(cpf),
            phone: cleanPhone(phone),
            birth_date: birth_date || "1990-01-01",
            // ... outros campos
        };

        const response = await userService.postCreateUser(userData);
        
        if (response.status === 201) {
            setUser(response.data); // Atualizar store
        }
    };

    return (
        <div>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            {/* ... outros inputs */}
        </div>
    );
}
```

### 2. Reatividade Automática

```tsx
// O componente se re-renderiza automaticamente quando o estado muda
const { email, setEmail } = createUserStore();

// Quando setEmail é chamado, todos os componentes que usam email são atualizados
setEmail("novo@email.com");
```

### 3. Estado Compartilhado

```tsx
// Componente A
const { user, setUser } = userStore();

// Componente B (recebe atualizações automaticamente)
const { user } = userStore();

// Quando Componente A chama setUser(), Componente B é atualizado
```

## 🎯 Vantagens do Zustand

### Simplicidade
- **API mínima**: Apenas `create()` e hooks
- **Sem boilerplate**: Menos código que Redux
- **TypeScript nativo**: Tipagem automática

### Performance
- **Re-renders seletivos**: Apenas componentes que usam dados alterados
- **Sem providers**: Não precisa envolver a app
- **Bundle pequeno**: ~2.5kb gzipped

### Flexibilidade
- **Actions assíncronas**: Suporte nativo
- **Middleware**: DevTools, persist, etc.
- **Immer**: Mutação de estado imutável

## 🚀 Como Adicionar Novos Stores

### Passo 1: Criar Interface

```tsx
// src/store/productStore.ts
import { create } from "zustand";

interface ProductStore {
    // Estados
    products: Product[];
    loading: boolean;
    error: string | null;
    
    // Actions
    setProducts: (products: Product[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Product) => void;
    removeProduct: (id: string) => void;
}
```

### Passo 2: Implementar Store

```tsx
export const productStore = create<ProductStore>((set, get) => ({
    // Estados iniciais
    products: [],
    loading: false,
    error: null,
    
    // Actions síncronas
    setProducts: (products) => set({ products }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    
    // Actions assíncronas
    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const products = await productService.getProducts();
            set({ products, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    
    addProduct: (product) => set((state) => ({
        products: [...state.products, product]
    })),
    
    removeProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
    })),
}));
```

### Passo 3: Usar no Componente

```tsx
// src/components/ProductList/index.tsx
import { productStore } from "../../store/productStore";

export function ProductList() {
    const { 
        products, 
        loading, 
        error, 
        fetchProducts 
    } = productStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div>
            {products.map(product => (
                <div key={product.id}>{product.name}</div>
            ))}
        </div>
    );
}
```

## 🔧 Configurações Avançadas

### 1. Middleware de Persistência

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const userStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
        }),
        {
            name: "user-storage", // nome da chave no localStorage
            partialize: (state) => ({ user: state.user }), // salvar apenas user
        }
    )
);
```

### 2. Middleware de DevTools

```tsx
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const userStore = create(
    devtools(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }, false, "setUser"),
        }),
        {
            name: "user-store", // nome no Redux DevTools
        }
    )
);
```

### 3. Actions Assíncronas com Loading

```tsx
export const userStore = create<UserStore>((set, get) => ({
    user: null,
    loading: false,
    error: null,
    
    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await userService.postLogin(credentials);
            set({ 
                user: response.data.user, 
                loading: false 
            });
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
        }
    },
    
    logout: () => set({ user: null, error: null }),
}));
```

### 4. Computed Values

```tsx
export const userStore = create<UserStore>((set, get) => ({
    user: null,
    
    // Getter para valor computado
    get isLoggedIn() {
        return !!get().user;
    },
    
    get userInitials() {
        const user = get().user;
        if (!user) return "";
        return user.full_name
            .split(" ")
            .map(name => name[0])
            .join("")
            .toUpperCase();
    },
}));
```

## 📊 Resumo das Responsabilidades

| Store | Responsabilidade | Localização |
|-------|------------------|-------------|
| `createUserStore` | Dados do formulário de cadastro | `src/store/` |
| `userStore` | Dados do usuário logado | `src/store/` |
| `user.dto.ts` | Definições de tipos do store | `src/store/dtos/` |
| `TUserData.ts` | Tipos de dados do usuário | `src/store/types/` |

## 🐛 Troubleshooting

### Problemas Comuns

1. **Componente não re-renderiza**
   - **Causa**: Não está usando o hook do store corretamente
   - **Solução**: Verificar se está chamando `store()` no componente

2. **Estado não persiste**
   - **Causa**: Não está usando middleware de persistência
   - **Solução**: Adicionar `persist` middleware

3. **Erro de tipagem**
   - **Causa**: Tipos não definidos corretamente
   - **Solução**: Verificar interfaces e tipos

### Logs Úteis

```tsx
// Para debug de stores
console.log("Store state:", userStore.getState());
console.log("User data:", user);

// Para verificar re-renders
useEffect(() => {
    console.log("Component re-rendered with user:", user);
}, [user]);
```

## 📚 Recursos Adicionais

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Zustand Middleware](https://github.com/pmndrs/zustand#middleware)
- [React State Management](https://reactjs.org/docs/state-and-lifecycle.html)
- [TypeScript](https://www.typescriptlang.org/)

---
