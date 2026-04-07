# FinDash Suite

![Frontend Coverage](.github/badges/frontend-coverage.svg)
![Backend Coverage](.github/badges/backend-coverage.svg)

FinDash Suite é uma aplicação completa de gestão financeira pessoal focada em usabilidade e performance. Ela permite o controle detalhado de receitas e despesas, visualização gráfica de gastos por categoria e gerenciamento histórico de transações.

O sistema é um monorepo dividido em dois componentes principais para garantir escalabilidade e separação de responsabilidades:
- **Frontend:** Desenvolvido em Angular 18+ com Tailwind CSS e Chart.js.
- **Backend:** Desenvolvido em Java 21 com Jakarta EE 10, WildFly e PostgreSQL.

## Funcionalidades
- Cadastro e autenticação segura de usuários utilizando JWT
- Painel interativo com resumo financeiro (saldo, receitas, despesas)
- Gráfico interativo em tempo real de despesas segmentadas por categoria
- Gerenciamento completo de transações (Adicionar, Editar, Remover)
- Interface totalmente responsiva (Mobile First)

## Estrutura do Projeto
- `/frontend`: Aplicação SPA focada em experiência do usuário e alta interatividade.
- `/backend`: API RESTful focada em processamento seguro e integridade de dados.

## Como Executar Localmente

### Pré-requisitos
- Node.js 24+
- Java 21 (JDK)
- Maven 3.9+
- Servidor PostgreSQL (Porta `5432` com banco `findashdb`)

### Iniciando a API (Backend)
```bash
cd backend
mvn clean package
mvn wildfly:run
```

### Iniciando a Interface (Frontend)
```bash
cd frontend
npm install
npm start
```

Após iniciar os serviços, o frontend estará acessível em `http://localhost:4200` e a API rodará em `http://localhost:8080/api`.