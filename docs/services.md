# Camada de Services - GA Frontend

## 📋 Visão Geral

Este documento descreve a camada de services implementada no projeto GA Frontend, responsável por gerenciar a comunicação com APIs externas e encapsular a lógica de negócio relacionada a operações de dados.

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── services/
│   └── User/
│       ├── user.service.ts    # Serviço de usuário
│       └── types.ts           # Tipos TypeScript para o serviço
├── config/
│   ├── api.ts                 # Configuração da API
│   └── env.config.ts          # Configuração de ambiente
└── utils/
    ├── dateFormatters.ts      # Utilitários de formatação de data
    ├── dateInputParser.ts     # Parser de input de data
    ├── formatCpf.ts           # Formatação de CPF
    └── formatPhone.ts         # Formatação de telefone
```

### Fluxo de Execução

```
Componente (ModalLogin)
└── userService.postLogin()
    └── apiUser().post()
        └── axios.create()
            └── API Externa
```

## 🔧 Configuração da API

### 1. Configuração Base

**Arquivo**: `src/config/api.ts`

```tsx
import axios, { AxiosError } from "axios";
import { EnvConfig } from "./env.config";

const createApiInstance = (
    authorization?: string | null,
    baseURL?: string | null,
    ContentHeader?: any,
) => {
    const containAuthentication = () => {
        const commonFields = {
            "Content-Type": "application/json",
        };
        if (authorization) {
            return {
                ...commonFields,
                Authorization: `Bearer ${authorization}`,
            };
        }
        return { ...commonFields };
    };

    const axiosInstance = axios.create({
        baseURL: baseURL || undefined,
        headers: { ...containAuthentication(), ...ContentHeader },
    });

    // Interceptors para request
    axiosInstance.interceptors.request.use(
        async (config) => {
            console.log("🚀 Request:", {
                method: config.method?.toUpperCase(),
                url: config.url,
                baseURL: config.baseURL,
            });
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Interceptors para response
    axiosInstance.interceptors.response.use(
        (response) => {
            console.log("✅ Response Success:", {
                status: response.status,
                data: response.data,
            });
            return response;
        },
        (error: AxiosError) => {
            console.log("❌ Response Error:", {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
            });
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export const apiUser = () => createApiInstance();
```

**Responsabilidades**:
- Configura instâncias do Axios
- Gerencia headers de autenticação
- Implementa interceptors para logging
- Centraliza configurações de API

### 2. Configuração de Ambiente

**Arquivo**: `src/config/env.config.ts`

```tsx
export const EnvConfig = {
    API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/",
    NODE_ENV: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
};
```

## 📱 Services Implementados

### 1. User Service

**Arquivo**: `src/services/User/user.service.ts`

```tsx
import { apiUser } from "../../config/api";
import type { ICreateUserProps, ILoginProps } from "./types";

export const userService = {
    async postCreateUser(data: ICreateUserProps) {
        try {
            const response = await apiUser().post("/api/auth/register", data);
            return response;
        } catch (error: any) {
            if (error.response?.status === 400) {
                const responseData = error.response.data;
                
                if (responseData?.detail === "REGISTER_USER_ALREADY_EXISTS") {
                    throw new Error("Este email já está cadastrado. Tente fazer login ou use outro email.");
                }
            }
            throw error;
        }
    },

    async postLogin(data: ILoginProps) {
        try {
            console.log("🔍 Dados recebidos no postLogin:", data);
            
            // Converter o objeto para URLSearchParams para x-www-form-urlencoded
            const formData = new URLSearchParams();
            formData.append('grant_type', data.grant_type || 'password');
            formData.append('username', data.username || '');
            formData.append('password', data.password || '');
            formData.append('scope', data.scope || 'string');
            formData.append('client_id', data.client_id || 'string');
            formData.append('client_secret', data.client_secret || 'string');

            console.log("📤 FormData sendo enviado:", formData.toString());

            const response = await apiUser().post("/api/auth/jwt/login", formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response;
        } catch (error: any) {
            throw error;
        }
    }
}
```

**Funcionalidades**:
- **Cadastro de usuário**: `postCreateUser()` - Registra novo usuário
- **Login de usuário**: `postLogin()` - Autentica usuário existente
- **Tratamento de erros**: Mensagens específicas para diferentes tipos de erro
- **Formatação de dados**: Conversão para formato adequado da API

### 2. Tipos do User Service

**Arquivo**: `src/services/User/types.ts`

```tsx
export interface ICreateUserProps {
    "email"?: string,
    "password"?: string,
    "is_active"?: boolean,
    "is_superuser"?: boolean,
    "is_verified"?: boolean,
    "full_name"?: string,
    "cpf"?: string,
    "birth_date"?: string,
    "phone"?: string,
    "frequency": string,
    "role": string,
}

export interface ILoginProps {
    "grant_type": string;
    "username": string;
    "password": string;
    "scope": string;
    "client_id": string;
    "client_secret": string;
}
```

## 🔄 Como Funcionam os Services

### 1. Fluxo de Cadastro

```tsx
// 1. Componente chama o service
const response = await userService.postCreateUser(userData);

// 2. Service processa os dados
const response = await apiUser().post("/api/auth/register", data);

// 3. API retorna resposta
// 4. Service trata erros específicos
// 5. Componente recebe resposta ou erro
```

### 2. Fluxo de Login

```tsx
// 1. Componente prepara dados
const loginData = {
    grant_type: 'password',
    username: email,
    password: password,
    scope: 'string',
    client_id: 'string',
    client_secret: 'string'
};

// 2. Service converte para URLSearchParams
const formData = new URLSearchParams();
formData.append('grant_type', data.grant_type || 'password');

// 3. Envia requisição com headers corretos
const response = await apiUser().post("/api/auth/jwt/login", formData, {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});
```

### 3. Tratamento de Erros

```tsx
try {
    const response = await userService.postCreateUser(userData);
    // Sucesso
} catch (error: any) {
    // Erro específico baseado no status
    if (error.response?.status === 400) {
        const responseData = error.response.data;
        if (responseData?.detail === "REGISTER_USER_ALREADY_EXISTS") {
            throw new Error("Este email já está cadastrado...");
        }
    }
    throw error;
}
```

## 🎯 Vantagens da Arquitetura

### Separação de Responsabilidades
- **Services**: Lógica de negócio e comunicação com API
- **Components**: Interface e interação do usuário
- **Config**: Configurações centralizadas

### Reutilização
- **apiUser()**: Instância reutilizável em diferentes services
- **Interceptors**: Logging centralizado
- **Tipos**: Definições compartilhadas

### Manutenibilidade
- **Tratamento de erro**: Centralizado e específico
- **Logging**: Debug facilitado
- **Tipagem**: TypeScript previne erros

## 🚀 Como Adicionar Novos Services

### Passo 1: Criar Estrutura

```bash
mkdir src/services/Product
touch src/services/Product/product.service.ts
touch src/services/Product/types.ts
```

### Passo 2: Definir Tipos

```tsx
// src/services/Product/types.ts
export interface IProduct {
    id: string;
    name: string;
    price: number;
    description: string;
}

export interface ICreateProductProps {
    name: string;
    price: number;
    description: string;
}
```

### Passo 3: Implementar Service

```tsx
// src/services/Product/product.service.ts
import { apiUser } from "../../config/api";
import type { IProduct, ICreateProductProps } from "./types";

export const productService = {
    async getProducts(): Promise<IProduct[]> {
        try {
            const response = await apiUser().get("/api/products");
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async createProduct(data: ICreateProductProps): Promise<IProduct> {
        try {
            const response = await apiUser().post("/api/products", data);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }
}
```

### Passo 4: Usar no Componente

```tsx
// src/components/ProductList/index.tsx
import { productService } from "../../services/Product/product.service";

export function ProductList() {
    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        };

        fetchProducts();
    }, []);

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

### Interceptors Personalizados

```tsx
// Adicionar token automaticamente
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

// Tratar erros de autenticação
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirecionar para login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

### Timeout e Retry

```tsx
const axiosInstance = axios.create({
    baseURL: baseURL || undefined,
    timeout: 10000, // 10 segundos
    headers: { ...containAuthentication(), ...ContentHeader },
});

// Implementar retry automático
const retryRequest = async (config: any, retries = 3) => {
    try {
        return await axiosInstance(config);
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return retryRequest(config, retries - 1);
        }
        throw error;
    }
};
```

## 📊 Resumo das Responsabilidades

| Componente | Responsabilidade | Localização |
|------------|------------------|-------------|
| `api.ts` | Configuração base da API | `src/config/` |
| `user.service.ts` | Operações de usuário | `src/services/User/` |
| `types.ts` | Definições de tipos | `src/services/User/` |
| `env.config.ts` | Variáveis de ambiente | `src/config/` |

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro 422 - Unprocessable Entity**
   - **Causa**: Dados enviados em formato incorreto
   - **Solução**: Verificar se está usando URLSearchParams para x-www-form-urlencoded

2. **Erro de CORS**
   - **Causa**: API não configurada para aceitar requisições do frontend
   - **Solução**: Configurar CORS no backend

3. **Token expirado**
   - **Causa**: Token de autenticação inválido
   - **Solução**: Implementar refresh token ou redirecionar para login

### Logs Úteis

```tsx
// Para debug de requests
console.log("🔍 Dados recebidos:", data);
console.log("📤 FormData sendo enviado:", formData.toString());
console.log("✅ Response Success:", response.data);
console.log("❌ Response Error:", error.response?.data);
```

## 📚 Recursos Adicionais

- [Axios Documentation](https://axios-http.com/)
- [React Query](https://tanstack.com/query/latest) - Para cache e sincronização
- [SWR](https://swr.vercel.app/) - Para data fetching
- [TypeScript](https://www.typescriptlang.org/) - Para tipagem

---
