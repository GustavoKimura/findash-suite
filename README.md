<div align="center">
  <h1>📊 FinDash Suite</h1>
  <p><strong>Um dashboard de finanças pessoais moderno, responsivo e robusto.</strong></p>

  [![Cobertura Frontend](.github/badges/frontend-coverage.svg)](https://gustavokimura.github.io/findash-suite/)
  [![Cobertura Backend](.github/badges/backend-coverage.svg)](https://github.com/GustavoKimura/findash-suite)
  
  <br>

  [![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
  [![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://jdk.java.net/21/)
  [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

## 🌐 Demonstração Online

Acesse a aplicação aqui: **[FinDash Suite no GitHub Pages](https://gustavokimura.github.io/findash-suite/)**

## 🚀 Funcionalidades

- 🔒 **Autenticação Segura:** Sistema de login e registro baseado em JWT.
- 💰 **Gestão de Transações:** Adicione, edite e remova receitas ou despesas facilmente.
- 📈 **Dashboards Interativos:** Insights visuais com gráficos dinâmicos alimentados por Chart.js.
- 📱 **Design Responsivo:** Interface Mobile-First otimizada para todos os tamanhos de tela.
- ⚡ **Alta Performance:** API REST leve rodando em WildFly com um frontend Angular veloz.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Framework:** Angular 21+ (Standalone Components, Signals)
- **Estilização:** Tailwind CSS
- **Gráficos:** ng2-charts / Chart.js
- **Testes:** Vitest & Testing Library

### Backend
- **Linguagem:** Java 21
- **Framework:** Jakarta EE 11 (JAX-RS, JPA, CDI)
- **Servidor:** WildFly 35
- **Banco de Dados:** PostgreSQL
- **Segurança:** Nimbus JOSE JWT, jBCrypt
- **Testes:** JUnit 5, Mockito, AssertJ, JaCoCo

## ⚙️ Como Começar

### Pré-requisitos
- [Node.js 24+](https://nodejs.org/)
- [Java 21 (JDK)](https://jdk.java.net/21/)
- [Maven 3.9+](https://maven.apache.org/)
- Banco de dados PostgreSQL (`findashdb`) rodando na porta `5432`

### Configurando o Backend
```powershell
cd backend
mvn clean package
mvn wildfly:run
```

###  Configurando o Frontend
```powershell
cd frontend
npm install
npm start
```

## 🧪 Executando Testes

- Frontend: `npm run test:coverage`
- Backend: `mvn test`