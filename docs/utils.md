# Camada de Utils - GA Frontend

## 📋 Visão Geral

Este documento descreve a camada de utilitários implementada no projeto GA Frontend. Os utils são funções auxiliares que encapsulam lógica comum, formatação de dados e operações reutilizáveis em toda a aplicação.

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── utils/
│   ├── dateFormatters.ts      # Formatação de datas
│   ├── dateInputParser.ts     # Parser de input de data
│   ├── formatCpf.ts           # Formatação de CPF
│   └── formatPhone.ts         # Formatação de telefone
```

### Fluxo de Execução

```
Componente
└── Utils Function
    └── Dados Processados
        └── Retorno Formatado
```

## 🔧 Utilitários Implementados

### 1. Formatação de Datas

**Arquivo**: `src/utils/dateFormatters.ts`

```tsx
import { 
    format, 
    parse, 
    isValid
} from 'date-fns';

/**
 * Converte uma string de data no formato yyyy-MM-dd para um objeto Date
 * @param dateString - String da data no formato yyyy-MM-dd
 * @returns Date | null
 */
export const getDateFromValue = (dateString: string): Date | null => {
    if (!dateString) return null;
    try {
        return parse(dateString, "yyyy-MM-dd", new Date());
    } catch {
        return null;
    }
};

/**
 * Formata uma data para exibição no formato dd/MM/yyyy
 * @param date - Data para formatar
 * @returns String formatada ou string vazia se inválida
 */
export const formatDateForDisplay = (date: Date | null): string => {
    if (!date || !isValid(date)) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Formata uma data para API no formato yyyy-MM-dd
 * @param date - Data para formatar
 * @returns String formatada ou string vazia se inválida
 */
export const formatDateForAPI = (date: Date | null): string => {
    if (!date || !isValid(date)) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Formata uma data usando date-fns com locale português
 * @param date - Data para formatar
 * @param formatString - String de formato do date-fns
 * @returns String formatada
 */
export const formatDateWithLocale = (date: Date, formatString: string): string => {
    return format(date, formatString);
};

/**
 * Valida se uma data é válida
 * @param date - Data para validar
 * @returns boolean
 */
export const isValidDate = (date: Date | null): boolean => {
    return date !== null && isValid(date);
};
```

**Funcionalidades**:
- **Conversão de strings**: `getDateFromValue()` - Converte string para Date
- **Formatação para display**: `formatDateForDisplay()` - Formato dd/MM/yyyy
- **Formatação para API**: `formatDateForAPI()` - Formato yyyy-MM-dd
- **Validação**: `isValidDate()` - Verifica se data é válida

### 2. Parser de Input de Data

**Arquivo**: `src/utils/dateInputParser.ts`

```tsx
/**
 * Parseia e formata input de data do usuário
 * @param inputStr - String de entrada do usuário
 * @returns String formatada ou data no formato API
 */
export const parseInputDate = (inputStr: string): string => {
    const numbers = inputStr.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    
    let formatted = numbers;
    if (numbers.length >= 3) {
        formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    if (numbers.length >= 5) {
        formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
    }
    
    if (numbers.length === 8) {
        const day = numbers.slice(0, 2);
        const month = numbers.slice(2, 4);
        const year = numbers.slice(4, 8);
        
        if (parseInt(day) >= 1 && parseInt(day) <= 31 && 
            parseInt(month) >= 1 && parseInt(month) <= 12 && 
            parseInt(year) >= 1900 && parseInt(year) <= 2100) {
            return `${year}-${month}-${day}`;
        }
    }
    
    return formatted;
};

/**
 * Valida se uma string de data está no formato correto
 * @param dateString - String da data para validar
 * @returns boolean
 */
export const isValidDateString = (dateString: string): boolean => {
    const numbers = dateString.replace(/\D/g, '');
    if (numbers.length !== 8) return false;
    
    const day = parseInt(numbers.slice(0, 2));
    const month = parseInt(numbers.slice(2, 4));
    const year = parseInt(numbers.slice(4, 8));
    
    return day >= 1 && day <= 31 && 
           month >= 1 && month <= 12 && 
           year >= 1900 && year <= 2100;
};
```

**Funcionalidades**:
- **Formatação em tempo real**: Adiciona barras automaticamente
- **Validação de data**: Verifica se dia/mês/ano são válidos
- **Conversão para API**: Retorna formato yyyy-MM-dd quando completo

### 3. Formatação de CPF

**Arquivo**: `src/utils/formatCpf.ts`

```tsx
/**
 * Formata um CPF adicionando pontos e hífen
 * @param cpf - CPF sem formatação
 * @returns CPF formatado (000.000.000-00)
 */
export const formatCPF = (cpf: string): string => {
    // Remove tudo que não é dígito
    const numbers = cpf.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a formatação
    if (limitedNumbers.length <= 3) {
        return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
        return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
    } else if (limitedNumbers.length <= 9) {
        return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
    } else {
        return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
    }
};

/**
 * Remove a formatação do CPF, deixando apenas números
 * @param cpf - CPF formatado
 * @returns CPF apenas com números
 */
export const cleanCPF = (cpf: string): string => {
    return cpf.replace(/\D/g, '');
};

/**
 * Valida se um CPF é válido
 * @param cpf - CPF para validar
 * @returns boolean
 */
export const isValidCPF = (cpf: string): boolean => {
    const cleanCpf = cleanCPF(cpf);
    
    if (cleanCpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let firstDigit = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCpf.charAt(9)) !== firstDigit) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    let secondDigit = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cleanCpf.charAt(10)) === secondDigit;
};
```

**Funcionalidades**:
- **Formatação visual**: `formatCPF()` - Adiciona pontos e hífen
- **Limpeza**: `cleanCPF()` - Remove formatação
- **Validação**: `isValidCPF()` - Algoritmo de validação do CPF

### 4. Formatação de Telefone

**Arquivo**: `src/utils/formatPhone.ts`

```tsx
/**
 * Formata um telefone adicionando parênteses, espaços e hífen
 * @param phone - Telefone sem formatação
 * @returns Telefone formatado (+00 (00) 00000-0000)
 */
export const formatPhone = (phone: string): string => {
    // Remove tudo que não é dígito
    const numbers = phone.replace(/\D/g, '');
    
    // Limita a 13 dígitos (código do país + DDD + número)
    const limitedNumbers = numbers.slice(0, 13);
    
    // Aplica a formatação baseada no tamanho
    if (limitedNumbers.length <= 2) {
        return limitedNumbers;
    } else if (limitedNumbers.length <= 4) {
        return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2)})`;
    } else if (limitedNumbers.length <= 9) {
        return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2, 4)}) ${limitedNumbers.slice(4)}`;
    } else {
        return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2, 4)}) ${limitedNumbers.slice(4, 9)}-${limitedNumbers.slice(9)}`;
    }
};

/**
 * Remove a formatação do telefone, deixando apenas números
 * @param phone - Telefone formatado
 * @returns Telefone apenas com números
 */
export const cleanPhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
};

/**
 * Valida se um telefone é válido
 * @param phone - Telefone para validar
 * @returns boolean
 */
export const isValidPhone = (phone: string): boolean => {
    const cleanPhoneNumber = cleanPhone(phone);
    
    // Telefone brasileiro: 10 ou 11 dígitos (com DDD)
    // Telefone internacional: 10 a 15 dígitos
    return cleanPhoneNumber.length >= 10 && cleanPhoneNumber.length <= 15;
};
```

**Funcionalidades**:
- **Formatação visual**: `formatPhone()` - Adiciona formatação internacional
- **Limpeza**: `cleanPhone()` - Remove formatação
- **Validação**: `isValidPhone()` - Verifica tamanho do número

## 🔄 Como Funcionam os Utils

### 1. Uso nos Componentes

```tsx
// src/components/Modals/ModalLogin/index.tsx
import { formatCPF, cleanCPF } from "../../../utils/formatCpf";
import { formatPhone, cleanPhone } from "../../../utils/formatPhone";

export default function ModalLogin() {
    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        setCpf(formatted);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setPhone(formatted);
    };

    const handleCreateUser = async () => {
        const userData = {
            cpf: cleanCPF(cpf),        // Remove formatação para API
            phone: cleanPhone(phone),  // Remove formatação para API
            // ... outros campos
        };
    };
}
```

### 2. Uso no Hook useDate

```tsx
// src/components/Inputs/hooks/useDate.ts
import { getDateFromValue, formatDateForDisplay, formatDateForAPI } from '../../../utils/dateFormatters';
import { parseInputDate } from '../../../utils/dateInputParser';

export const useDate = ({ value, onChange, onDateChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputStr = e.target.value;
        setInputValue(inputStr);
        
        const apiDate = parseInputDate(inputStr); // Formatação em tempo real
        if (apiDate && apiDate.includes('-')) {
            onChange({ target: { value: apiDate } });
        }
    };

    const handleDateSelect = (selectedDate: Date) => {
        const apiDate = formatDateForAPI(selectedDate);     // Para API
        const displayDate = formatDateForDisplay(selectedDate); // Para display
        
        setInputValue(displayDate);
        onChange({ target: { value: apiDate } });
    };

    useEffect(() => {
        if (value) {
            const date = getDateFromValue(value);           // Converte string para Date
            const displayValue = formatDateForDisplay(date); // Formata para display
            setInputValue(displayValue);
        }
    }, [value]);
};
```

### 3. Fluxo de Formatação

```
Input do Usuário: "12345678901"
↓
formatCPF(): "123.456.789-01"
↓
Exibição no Input
↓
cleanCPF(): "12345678901"
↓
Envio para API
```

## 🎯 Vantagens dos Utils

### Reutilização
- **Funções puras**: Sem efeitos colaterais
- **Testabilidade**: Fáceis de testar isoladamente
- **Consistência**: Mesma lógica em toda aplicação

### Manutenibilidade
- **Centralização**: Lógica em um local
- **Documentação**: JSDoc para cada função
- **Tipagem**: TypeScript previne erros

### Performance
- **Funções otimizadas**: Algoritmos eficientes
- **Validação rápida**: Verificações leves
- **Formatação em tempo real**: UX melhorada

## 🚀 Como Adicionar Novos Utils

### Passo 1: Identificar Necessidade

```tsx
// Lógica que se repete em vários lugares
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
```

### Passo 2: Criar Arquivo de Util

```tsx
// src/utils/currencyFormatters.ts

/**
 * Formata um valor numérico para moeda brasileira
 * @param value - Valor numérico para formatar
 * @returns String formatada (R$ 1.234,56)
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

/**
 * Remove a formatação de moeda, retornando apenas números
 * @param currencyString - String de moeda formatada
 * @returns Número sem formatação
 */
export const cleanCurrency = (currencyString: string): number => {
    const numbers = currencyString.replace(/\D/g, '');
    return parseFloat(numbers) / 100;
};

/**
 * Valida se um valor de moeda é válido
 * @param value - Valor para validar
 * @returns boolean
 */
export const isValidCurrency = (value: number): boolean => {
    return value >= 0 && value <= 999999.99;
};
```

### Passo 3: Usar no Componente

```tsx
// src/components/ProductCard/index.tsx
import { formatCurrency } from '../../utils/currencyFormatters';

export function ProductCard({ product }) {
    return (
        <div>
            <h3>{product.name}</h3>
            <p>Preço: {formatCurrency(product.price)}</p>
        </div>
    );
}
```

## 🔧 Utils Avançados

### 1. Debounce

```tsx
// src/utils/debounce.ts
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
```

### 2. Validação de Email

```tsx
// src/utils/validators.ts
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
    // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
```

### 3. Formatação de Texto

```tsx
// src/utils/textFormatters.ts
export const capitalizeFirst = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatName = (name: string): string => {
    return name
        .split(' ')
        .map(word => capitalizeFirst(word))
        .join(' ');
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};
```

## 📊 Resumo das Responsabilidades

| Util | Responsabilidade | Localização |
|------|------------------|-------------|
| `dateFormatters.ts` | Formatação e validação de datas | `src/utils/` |
| `dateInputParser.ts` | Parser de input de data | `src/utils/` |
| `formatCpf.ts` | Formatação e validação de CPF | `src/utils/` |
| `formatPhone.ts` | Formatação e validação de telefone | `src/utils/` |

## 🐛 Troubleshooting

### Problemas Comuns

1. **Formatação não funciona**
   - **Causa**: Regex incorreta ou lógica de formatação
   - **Solução**: Testar com diferentes inputs

2. **Validação muito restritiva**
   - **Causa**: Regras de validação muito rígidas
   - **Solução**: Ajustar critérios de validação

3. **Performance lenta**
   - **Causa**: Operações pesadas em re-renders
   - **Solução**: Usar useMemo ou debounce

### Logs Úteis

```tsx
// Para debug de formatação
console.log('Input original:', input);
console.log('Input formatado:', formatCPF(input));
console.log('Input limpo:', cleanCPF(input));

// Para debug de validação
console.log('CPF válido:', isValidCPF(cpf));
console.log('Data válida:', isValidDate(date));
```

## 📚 Recursos Adicionais

- [date-fns](https://date-fns.org/) - Biblioteca de manipulação de datas
- [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) - Formatação de números
- [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) - Regex para validação
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática

---
