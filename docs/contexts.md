# Camada de Contexts - GA Frontend

## 📋 Visão Geral

Este documento descreve a camada de contexts implementada no projeto GA Frontend, utilizando React Context API para gerenciar estado global e compartilhar dados entre componentes que não estão diretamente conectados na árvore de componentes.

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── contexts/
│   └── ToastContext.tsx      # Context para notificações toast
└── hooks/
    └── useToast.ts           # Hook para acessar o context
```

### Fluxo de Execução

```
App.tsx
└── ToastProvider
    └── Componentes da Aplicação
        └── useToast() Hook
            └── ToastContext
```

## 🔧 Contexts Implementados

### 1. ToastContext

**Arquivo**: `src/contexts/ToastContext.tsx`

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (title: string, message: string, type: Toast['type'], duration?: number) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (title: string, message: string, type: Toast['type'], duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
            id,
            title,
            message,
            type,
            duration,
        };

        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after duration
        setTimeout(() => {
            hideToast(id);
        }, duration);
    };

    const hideToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export { ToastContext };
```

**Funcionalidades**:
- **Gerenciamento de toasts**: Lista de notificações ativas
- **Auto-remoção**: Toasts são removidos automaticamente após duração
- **Tipos de notificação**: Success, error, warning, info
- **API simples**: Funções para mostrar e esconder toasts

### 2. Hook useToast

**Arquivo**: `src/hooks/useToast.ts`

```tsx
import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';

export const useToast = () => {
    const context = useContext(ToastContext);
    
    if (!context) {
        throw new Error('useToast deve ser usado dentro de um ToastProvider');
    }
    
    return context;
};
```

**Responsabilidades**:
- **Acesso ao context**: Fornece interface limpa para o ToastContext
- **Validação**: Verifica se está sendo usado corretamente
- **Tipagem**: TypeScript para autocomplete e validação

## 🔄 Como Funciona o Context

### 1. Configuração no App

```tsx
// src/App.tsx
import { ToastProvider } from "./contexts/ToastContext";
import { Routes } from "./routes";

function App() {
    return (
        <ToastProvider>
            <Routes />
        </ToastProvider>
    );
}

export default App;
```

### 2. Uso nos Componentes

```tsx
// src/components/Modals/ModalLogin/index.tsx
import { useToast } from "../../../hooks/useToast";

export default function ModalLogin() {
    const { showToast } = useToast();

    const handleLogin = async () => {
        try {
            const response = await userService.postLogin(loginData);
            showToast(
                "Sucesso!",
                "Login realizado com sucesso! Bem-vindo ao Calm Mind.",
                "success"
            );
        } catch (error: any) {
            showToast(
                "Erro!",
                "Erro ao fazer login. Tente novamente.",
                "error"
            );
        }
    };

    const handleCreateUser = async () => {
        try {
            const response = await userService.postCreateUser(userData);
            showToast(
                "Sucesso!",
                "Conta criada com sucesso! Bem-vindo ao Calm Mind.",
                "success"
            );
        } catch (error: any) {
            showToast(
                "Erro!",
                error.message || "Erro ao criar conta. Tente novamente.",
                "error"
            );
        }
    };

    return (
        <div>
            {/* Componente */}
        </div>
    );
}
```

### 3. Renderização dos Toasts

```tsx
// src/components/Toast/index.tsx
import { useToast } from "../../hooks/useToast";

export function Toast() {
    const { toasts, hideToast } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`p-4 rounded-lg shadow-lg max-w-sm ${
                        toast.type === 'success' ? 'bg-green-500 text-white' :
                        toast.type === 'error' ? 'bg-red-500 text-white' :
                        toast.type === 'warning' ? 'bg-yellow-500 text-white' :
                        'bg-blue-500 text-white'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold">{toast.title}</h4>
                            <p className="text-sm opacity-90">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => hideToast(toast.id)}
                            className="ml-2 text-white hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
```

## 🎯 Vantagens do Context

### Comunicação Global
- **Estado compartilhado**: Dados acessíveis em qualquer componente
- **Sem prop drilling**: Não precisa passar props por vários níveis
- **Reatividade**: Componentes se atualizam automaticamente

### Flexibilidade
- **Múltiplos providers**: Diferentes contexts para diferentes necessidades
- **Composição**: Contexts podem ser combinados
- **Tipagem**: TypeScript para segurança de tipos

### Performance
- **Re-renders seletivos**: Apenas componentes que usam o context
- **Memoização**: Possível otimizar com useMemo/useCallback
- **Lazy loading**: Contexts podem ser carregados sob demanda

## 🚀 Como Criar Novos Contexts

### Passo 1: Identificar Necessidade

```tsx
// Estado que precisa ser compartilhado entre componentes distantes
const [theme, setTheme] = useState('light');
const [language, setLanguage] = useState('pt-BR');
```

### Passo 2: Criar Context

```tsx
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
    theme: 'light' | 'dark';
    language: 'pt-BR' | 'en-US';
    setTheme: (theme: 'light' | 'dark') => void;
    setLanguage: (language: 'pt-BR' | 'en-US') => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'pt-BR' | 'en-US'>('pt-BR');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            language,
            setTheme,
            setLanguage,
            toggleTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export { ThemeContext };
```

### Passo 3: Criar Hook

```tsx
// src/hooks/useTheme.ts
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
    const context = useContext(ThemeContext);
    
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    
    return context;
};
```

### Passo 4: Usar no Componente

```tsx
// src/components/Header/index.tsx
import { useTheme } from '../../hooks/useTheme';

export function Header() {
    const { theme, toggleTheme, language, setLanguage } = useTheme();

    return (
        <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <button onClick={toggleTheme}>
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as 'pt-BR' | 'en-US')}
            >
                <option value="pt-BR">Português</option>
                <option value="en-US">English</option>
            </select>
        </header>
    );
}
```

## 🔧 Contexts Avançados

### 1. Context com useReducer

```tsx
// src/contexts/CartContext.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
}

type CartAction = 
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                const updatedItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
                return {
                    items: updatedItems,
                    total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                };
            }
            const newItems = [...state.items, action.payload];
            return {
                items: newItems,
                total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        
        case 'REMOVE_ITEM':
            const filteredItems = state.items.filter(item => item.id !== action.payload);
            return {
                items: filteredItems,
                total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        
        case 'UPDATE_QUANTITY':
            const updatedItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            return {
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        
        case 'CLEAR_CART':
            return { items: [], total: 0 };
        
        default:
            return state;
    }
};

interface CartContextType {
    state: CartState;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

    const addItem = (item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeItem = (id: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const updateQuantity = (id: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{
            state,
            addItem,
            removeItem,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export { CartContext };
```

### 2. Context com Persistência

```tsx
// src/contexts/UserPreferencesContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferences {
    theme: 'light' | 'dark';
    language: 'pt-BR' | 'en-US';
    notifications: boolean;
}

interface UserPreferencesContextType {
    preferences: UserPreferences;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
    const [preferences, setPreferences] = useState<UserPreferences>({
        theme: 'light',
        language: 'pt-BR',
        notifications: true
    });

    // Carregar preferências do localStorage
    useEffect(() => {
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
            try {
                setPreferences(JSON.parse(savedPreferences));
            } catch (error) {
                console.error('Erro ao carregar preferências:', error);
            }
        }
    }, []);

    // Salvar preferências no localStorage
    useEffect(() => {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }, [preferences]);

    const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
        setPreferences(prev => ({ ...prev, ...newPreferences }));
    };

    return (
        <UserPreferencesContext.Provider value={{
            preferences,
            updatePreferences
        }}>
            {children}
        </UserPreferencesContext.Provider>
    );
}

export { UserPreferencesContext };
```

### 3. Context com Validação

```tsx
// src/contexts/FormContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface FormField {
    name: string;
    value: string;
    error: string | null;
    touched: boolean;
}

interface FormContextType {
    fields: Record<string, FormField>;
    setFieldValue: (name: string, value: string) => void;
    setFieldError: (name: string, error: string | null) => void;
    setFieldTouched: (name: string, touched: boolean) => void;
    validateField: (name: string, value: string) => string | null;
    isFormValid: () => boolean;
    resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ 
    children, 
    initialFields 
}: { 
    children: ReactNode;
    initialFields: Record<string, FormField>;
}) {
    const [fields, setFields] = useState<Record<string, FormField>>(initialFields);

    const setFieldValue = (name: string, value: string) => {
        setFields(prev => ({
            ...prev,
            [name]: { ...prev[name], value, error: null }
        }));
    };

    const setFieldError = (name: string, error: string | null) => {
        setFields(prev => ({
            ...prev,
            [name]: { ...prev[name], error }
        }));
    };

    const setFieldTouched = (name: string, touched: boolean) => {
        setFields(prev => ({
            ...prev,
            [name]: { ...prev[name], touched }
        }));
    };

    const validateField = (name: string, value: string): string | null => {
        // Lógica de validação específica para cada campo
        switch (name) {
            case 'email':
                return !value.includes('@') ? 'Email inválido' : null;
            case 'password':
                return value.length < 6 ? 'Senha deve ter pelo menos 6 caracteres' : null;
            default:
                return null;
        }
    };

    const isFormValid = (): boolean => {
        return Object.values(fields).every(field => !field.error && field.value);
    };

    const resetForm = () => {
        setFields(initialFields);
    };

    return (
        <FormContext.Provider value={{
            fields,
            setFieldValue,
            setFieldError,
            setFieldTouched,
            validateField,
            isFormValid,
            resetForm
        }}>
            {children}
        </FormContext.Provider>
    );
}

export { FormContext };
```

## 📊 Resumo das Responsabilidades

| Context | Responsabilidade | Localização |
|---------|------------------|-------------|
| `ToastContext` | Gerenciamento de notificações | `src/contexts/` |
| `useToast` | Hook para acessar ToastContext | `src/hooks/` |

## 🐛 Troubleshooting

### Problemas Comuns

1. **Context não funciona**
   - **Causa**: Componente não está dentro do Provider
   - **Solução**: Verificar se o Provider envolve o componente

2. **Re-renders excessivos**
   - **Causa**: Objeto sendo recriado a cada render
   - **Solução**: Usar useMemo para o value do Provider

3. **Erro "useContext must be used within Provider"**
   - **Causa**: Hook sendo usado fora do Provider
   - **Solução**: Verificar hierarquia de componentes

### Logs Úteis

```tsx
// Para debug de contexts
console.log('Context value:', useContext(ToastContext));
console.log('Toasts:', toasts);
console.log('ShowToast function:', showToast);
```

## 📚 Recursos Adicionais

- [React Context](https://reactjs.org/docs/context.html)
- [useContext Hook](https://reactjs.org/docs/hooks-reference.html#usecontext)
- [useReducer Hook](https://reactjs.org/docs/hooks-reference.html#usereducer)
- [TypeScript](https://www.typescriptlang.org/)

---
