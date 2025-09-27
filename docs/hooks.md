# Camada de Hooks - GA Frontend

## 📋 Visão Geral

Este documento descreve a camada de hooks implementada no projeto GA Frontend, incluindo hooks customizados e hooks do React Router. Os hooks são responsáveis por encapsular lógica reutilizável e gerenciar estado local dos componentes.

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── hooks/
│   └── useToast.ts           # Hook para notificações toast
├── components/
│   └── Inputs/
│       └── hooks/
│           └── useDate.ts    # Hook para gerenciamento de data
└── contexts/
    └── ToastContext.tsx      # Context para toast (usado pelo hook)
```

### Fluxo de Execução

```
Componente
└── useDate() / useToast()
    └── Lógica Encapsulada
        └── Estado Local + Funções
```

## 🔧 Hooks Customizados

### 1. Hook useDate

**Arquivo**: `src/components/Inputs/hooks/useDate.ts`

```tsx
import { useState, useEffect } from 'react';
import { getDateFromValue, formatDateForDisplay, formatDateForAPI } from '../../../utils/dateFormatters';
import { parseInputDate } from '../../../utils/dateInputParser';

interface UseDateProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDateChange?: (date: Date | null) => void;
}

export const useDate = ({ value, onChange, onDateChange }: UseDateProps) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputStr = e.target.value;
        setInputValue(inputStr);
        
        const apiDate = parseInputDate(inputStr);
        if (apiDate && apiDate.includes('-')) {
            const syntheticEvent = {
                target: {
                    value: apiDate
                }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
    };

    const handleDateSelect = (selectedDate: Date) => {
        const safeDate = new Date(selectedDate);
        safeDate.setHours(12, 0, 0, 0);

        const apiDate = formatDateForAPI(safeDate);
        const displayDate = formatDateForDisplay(safeDate);
        
        setInputValue(displayDate);
        
        if (onDateChange) {
            onDateChange(safeDate);
        }
        
        const syntheticEvent = {
            target: {
                value: apiDate
            }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChange(syntheticEvent);
        setIsDatePickerOpen(false);
    };

    const toggleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen);
    };

    const closeDatePicker = () => {
        setIsDatePickerOpen(false);
    };

    useEffect(() => {
        if (value) {
            setInputValue(formatDateForDisplay(getDateFromValue(value)));
        } else {
            setInputValue('');
        }
    }, [value]);

    return {
        isDatePickerOpen,
        inputValue,
        handleInputChange,
        handleDateSelect,
        toggleDatePicker,
        closeDatePicker
    };
};
```

**Responsabilidades**:
- Gerencia estado do date picker
- Formata dados de entrada e saída
- Controla abertura/fechamento do calendário
- Sincroniza valor do input com o estado

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
- Fornece acesso ao contexto de toast
- Valida se está sendo usado corretamente
- Simplifica o uso do contexto

## 📱 Contextos

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
- Gerencia lista de toasts ativos
- Auto-remove toasts após duração
- Suporte a diferentes tipos de notificação
- API simples para mostrar/esconder toasts

## 🔄 Como Funcionam os Hooks

### 1. Uso do useDate

```tsx
// src/components/Inputs/Input/index.tsx
import { useDate } from '../hooks/useDate';

export default function Input({ value, onChange, onDateChange, inputDate }) {
    const {
        isDatePickerOpen,
        inputValue,
        handleInputChange,
        handleDateSelect,
        toggleDatePicker,
        closeDatePicker
    } = useDate({ value, onChange, onDateChange });

    if (inputDate) {
        return (
            <div className="relative">
                <input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="00/00/0000"
                />
                <DatePicker
                    value={value}
                    onDateSelect={handleDateSelect}
                    isOpen={isDatePickerOpen}
                    onClose={closeDatePicker}
                />
            </div>
        );
    }

    return <input value={value} onChange={onChange} />;
}
```

### 2. Uso do useToast

```tsx
// src/components/Modals/ModalLogin/index.tsx
import { useToast } from '../../../hooks/useToast';

export default function ModalLogin() {
    const { showToast } = useToast();

    const handleLogin = async () => {
        try {
            const response = await userService.postLogin(loginData);
            showToast(
                "Sucesso!",
                "Login realizado com sucesso!",
                "success"
            );
        } catch (error) {
            showToast(
                "Erro!",
                "Erro ao fazer login. Tente novamente.",
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

### 3. Hooks do React Router

```tsx
// src/components/Header/index.tsx
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const handleUserButtonClick = () => {
        if (isLoggedIn) {
            navigate('/user');
        } else {
            handleOpenModal();
        }
    };

    return (
        <header>
            {/* Header content */}
        </header>
    );
}
```

## 🎯 Vantagens dos Hooks

### Reutilização
- **Lógica encapsulada**: Código reutilizável entre componentes
- **Customização**: Hooks específicos para necessidades do projeto
- **Composição**: Hooks podem usar outros hooks

### Manutenibilidade
- **Separação de responsabilidades**: Lógica separada da UI
- **Testabilidade**: Hooks podem ser testados isoladamente
- **Legibilidade**: Código mais limpo e organizado

### Performance
- **Otimizações**: useMemo, useCallback quando necessário
- **Re-renders controlados**: Estado local otimizado
- **Lazy loading**: Carregamento sob demanda

## 🚀 Como Criar Novos Hooks

### Passo 1: Identificar Lógica Reutilizável

```tsx
// Lógica que se repete em vários componentes
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
        const response = await api.post('/endpoint', data);
        return response.data;
    } catch (err) {
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
};
```

### Passo 2: Criar Hook Customizado

```tsx
// src/hooks/useApi.ts
import { useState } from 'react';

interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export const useApi = (options: UseApiOptions = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (apiCall: () => Promise<any>) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await apiCall();
            options.onSuccess?.(result);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Erro desconhecido';
            setError(errorMessage);
            options.onError?.(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        execute,
        clearError: () => setError(null),
    };
};
```

### Passo 3: Usar no Componente

```tsx
// src/components/UserForm/index.tsx
import { useApi } from '../../hooks/useApi';
import { userService } from '../../services/User/user.service';

export function UserForm() {
    const { loading, error, execute, clearError } = useApi({
        onSuccess: (data) => {
            console.log('Usuário criado:', data);
        },
        onError: (error) => {
            console.error('Erro ao criar usuário:', error);
        }
    });

    const handleSubmit = async (formData) => {
        try {
            await execute(() => userService.postCreateUser(formData));
        } catch (error) {
            // Erro já tratado pelo hook
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="error">
                    {error}
                    <button onClick={clearError}>Fechar</button>
                </div>
            )}
            <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
            </button>
        </form>
    );
}
```

## 🔧 Hooks Avançados

### 1. Hook com useCallback

```tsx
import { useState, useCallback } from 'react';

export const useCounter = (initialValue = 0) => {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => {
        setCount(prev => prev + 1);
    }, []);

    const decrement = useCallback(() => {
        setCount(prev => prev - 1);
    }, []);

    const reset = useCallback(() => {
        setCount(initialValue);
    }, [initialValue]);

    return {
        count,
        increment,
        decrement,
        reset,
    };
};
```

### 2. Hook com useMemo

```tsx
import { useState, useMemo } from 'react';

export const useFilteredList = <T>(items: T[], filterFn: (item: T) => boolean) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesFilter = filterFn(item);
            const matchesSearch = searchTerm === '' || 
                JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [items, filterFn, searchTerm]);

    return {
        filteredItems,
        searchTerm,
        setSearchTerm,
    };
};
```

### 3. Hook com useEffect

```tsx
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Erro ao ler localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Erro ao salvar localStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error(`Erro ao sincronizar localStorage key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue] as const;
};
```

## 📊 Resumo das Responsabilidades

| Hook | Responsabilidade | Localização |
|------|------------------|-------------|
| `useDate` | Gerenciamento de data e date picker | `src/components/Inputs/hooks/` |
| `useToast` | Acesso ao contexto de notificações | `src/hooks/` |
| `useLocation` | Navegação e rota atual | React Router |
| `useNavigate` | Programação de navegação | React Router |

## 🐛 Troubleshooting

### Problemas Comuns

1. **Hook não funciona**
   - **Causa**: Não está seguindo as regras dos hooks
   - **Solução**: Verificar se está sendo chamado no topo do componente

2. **Re-renders excessivos**
   - **Causa**: Dependências incorretas no useEffect
   - **Solução**: Revisar array de dependências

3. **Estado não atualiza**
   - **Causa**: Mutação direta do estado
   - **Solução**: Usar funções de atualização imutáveis

### Logs Úteis

```tsx
// Para debug de hooks
useEffect(() => {
    console.log('Hook executado:', { value, inputValue });
}, [value, inputValue]);

// Para debug de re-renders
const renderCount = useRef(0);
renderCount.current++;
console.log('Component renderizado:', renderCount.current);
```

## 📚 Recursos Adicionais

- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Custom Hooks](https://reactjs.org/docs/hooks-custom.html)
- [React Router Hooks](https://reactrouter.com/web/api/Hooks)
- [useCallback vs useMemo](https://reactjs.org/docs/hooks-reference.html)

---
