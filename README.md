# RoutineMap: Guia de Execução Local

Este projeto é um planejador de rotinas e hábitos construído com Next.js, otimizado para rodar localmente com persistência no navegador.

## Pré-requisitos

*   **Node.js**: Versão 18.x ou superior.
*   **Git**: Para clonar o repositório.

## Passos para Execução

### 1. Clonar o Repositório

```bash
git clone https://github.com/kaiquebazil/RoutineMap.git
cd RoutineMap
```

### 2. Instalar Dependências

Devido a conflitos de versões de bibliotecas de terceiros (ESLint/TypeScript), utilize o comando abaixo para garantir uma instalação correta:

```bash
npm install --legacy-peer-deps
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
DATABASE_URL="postgresql://user:password@localhost:5432/routine"
NEXTAUTH_SECRET="routine-map-secret-123"
```

*Nota: O app funciona primariamente com `localStorage`, então os valores acima podem ser fictícios para uso local básico.*

### 4. Rodar o Projeto

```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)
