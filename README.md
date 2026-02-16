# 🚀 Flugo – Gestão de Colaboradores

Uma aplicação **SaaS-style** para **gestão de colaboradores**, construída com foco em **UX moderna**, **componentização**, **boas práticas de frontend** e **integração em tempo real com Firebase**.

🔗 **Projeto online (Vercel):** [https://desafio-flugo-uskz.vercel.app/](https://SEU-LINK-DO-VERCEL-AQUI)

---

## 🧠 Visão Geral

O **Flugo** permite cadastrar, editar, listar e gerenciar colaboradores / departamentos de forma simples e profissional, seguindo padrões visuais inspirados em ferramentas como **Monday**, **ClickUp** e **Notion**.

O sistema foi desenvolvido com **React + MUI**, utilizando **Firebase Firestore** como banco de dados, **Firebase Auth** como autenticacao e **React Router** para navegação.

---

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação (Firebase Auth)

- ✅ Login com e-mail e senha
- ✅ Criação de conta diretamente pela tela de login
- ✅ Persistência de sessão (token no `localStorage`)
- ✅ Context API (`AuthContext`) para controle global do usuário
- ✅ Rotas protegidas (`PrivateRoutes`)
- ✅ Logout com limpeza de token e redirecionamento
- ✅ Página **Not Found** personalizada

---

### 👥 Colaboradores

- ✅ Cadastro de colaborador em **duas etapas (Stepper)**
- ✅ Edição de colaborador com dados pré-carregados
- ✅ Listagem com ordenação
- ✅ Status **Ativo / Inativo**
- ✅ Exclusão lógica (soft delete → `ativo = false`)
- ✅ Validação de e-mail
- ✅ Botões desabilitados quando formulário inválido
- ✅ Redirecionamento automático após salvar
- ✅ Transferência de colaborador entre departamentos
- ✅ Regra garantida: **colaborador nunca fica sem departamento**

---

### 🏢 Departamentos

- ✅ Cadastro de departamento
- ✅ Edição de departamento
- ✅ Definição de **gestor responsável** (colaborador com nível gestor) 
- ✅ Listagem de departamentos
- ✅ Associação de colaboradores ao departamento
- ✅ Adição de colaboradores existentes
- ✅ Aba de colaboradores dentro da edição do departamento
- ✅ Modal para transferência de colaborador
- ✅ Sincronização entre:
  - Departamento → lista de colaboradores
  - Colaborador → departamento atual

---

### 🧭 Navegação & Layout

- ✅ Sidebar fixa
- ✅ Menus expansíveis (Colaboradores / Departamentos)
- ✅ Ícones semânticos para cada módulo
- ✅ Layout principal desacoplado (`LayoutSistema`)
- ✅ Cabeçalho reutilizável
- ✅ Navegação protegida por autenticação

### 🧩 UX / UI

- ✅ Stepper vertical flutuante
- ✅ Inputs ocupando toda a largura disponível
- ✅ Feedback visual de progresso
- ✅ Snackbar de sucesso e erro
- ✅ Modal de confirmação
- ✅ Estados de loading
- ✅ Design consistente com Material UI
- ✅ Tema centralizado (`theme.ts`)

---

## 🛠️ Tecnologias Utilizadas

* **React + TypeScript**
* **Material UI (MUI)**
* **React Router DOM**
* **Firebase Firestore**
* **Firebase Auth**
* **Context API**
* **Vite**
* **Vercel (Deploy)**

---

## 📁 Estrutura do Projeto

```bash
src/
├── assets/
├── components/
│   ├── Cabecalho/
│   ├── Sidebar/
│   └── StepperVertical/
├── contexts/
│   ├── auth.context.ts
│   ├── AuthProvider.tsx
│   └── useAuth.ts
├── layouts/
│   └── LayoutSistema.tsx
├── pages/
│   ├── Login/
│   ├── Cadastro/
│   ├── Colaboradores/
│   ├── Departamentos/
│   └── NotFound/
├── routes/
│   ├── PrivateRoutes/
│   └── index.tsx
├── services/
│   ├── authService.ts
│   ├── colaboradorService.ts
│   ├── departamentosService.ts
│   └── firebase.ts
├── styles/
│   └── theme.ts
├── types/
│   ├── Colaborador.ts
│   └── Departamento.ts
├── utils/
│   └── constantes.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🔥 Integração com Firebase

* Banco: **Firestore**
* Coleção: `colaboradores`

### Estrutura do documento

```ts
{
  nome: string;
  email: string;
  departamento: string;
  ativo: boolean;
  criadoEm: Timestamp;
}
```

* Banco: **Firestore**
* Coleção: `departamentos`

### Estrutura do documento

```ts
{
  id?: string;
  nome: string;
  gestorId: string;
  gestorNome: string;
  colaboradores: string[];
  ativo: boolean;
}
```

---

## ▶️ Como Rodar o Projeto Localmente

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/flugo.git
cd flugo
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Configurar Firebase

Crie um arquivo:

```bash
src/services/firebase.ts
```

E adicione suas credenciais:

```ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);
```

### 4️⃣ Rodar o projeto

```bash
npm run dev
```

Acesse:

```
http://localhost:5173
```

---

## 🌍 Deploy

O projeto foi buildado e publicado na **Vercel**.

🔗 **Link:** [https://desafio-flugo-uskz.vercel.app/](https://SEU-LINK-DO-VERCEL-AQUI)

---

## 🧪 Testes Manuais Sugeridos

### 🔐 Autenticação
- Acessar rota protegida sem estar logado → redireciona para login
- Criar conta com e-mail inválido → erro exibido
- Criar conta com campos vazios → botão desabilitado
- Login com credenciais inválidas → mensagem de erro
- Login válido → redirecionamento para tela de colaboradores
- Logout → token removido do `localStorage` e redirecionamento para login

---

### 👥 Colaboradores
- Criar colaborador sem e-mail → botão **Concluir** desabilitado
- Criar colaborador com e-mail inválido → erro visual
- Criar colaborador sem nome → botão desabilitado
- Criar colaborador válido → redirecionamento automático
- Editar colaborador existente → dados pré-carregados
- Alterar status para **Inativo** → colaborador não aparece em seleções
- Exclusão lógica (ativo = false) → colaborador não removido do banco
- Transferir colaborador para outro departamento
- Garantir regra: colaborador **nunca fica sem departamento**
- Alterar nível hierárquico (colaborador ↔ gestor)

---

### 🏢 Departamentos
- Criar departamento sem nome → botão desabilitado
- Criar departamento sem gestor → botão desabilitado
- Criar departamento válido → redirecionamento automático
- Editar departamento → dados pré-carregados
- Adicionar colaborador existente ao departamento
- Visualizar lista de colaboradores do departamento
- Transferir colaborador para outro departamento via modal
- Verificar sincronização:
  - Departamento → lista de colaboradores
  - Colaborador → departamento atualizado
- Garantir que gestor seja sempre um colaborador válido

---

### 🧭 Navegação & UI
- Expandir e recolher menus da sidebar
- Navegar entre telas sem perder estado
- Verificar destaque correto do menu ativo
- Testar botões desabilitados quando formulário inválido
- Validar feedback visual de loading
- Conferir Snackbars de sucesso e erro
- Acessar rota inexistente → tela **Not Found**

---

### 📊 Listagens
- Ordenar lista de colaboradores por:
  - Nome
  - E-mail
  - Status
- Listar apenas colaboradores ativos nos selects
- Conferir atualização imediata após salvar/editar

---

## 📌 Próximas Melhorias (Roadmap)

* 🔐 Autenticação (Firebase Auth)
* 👤 Perfis e permissões
* 🔍 Busca e filtros avançados
* 📊 Dashboard com métricas
* 📱 Responsividade mobile

---

## 👨‍💻 Autor

**Luiz Filipe**
Desenvolvedor Frontend & Software Engineer

📎 LinkedIn: [https://linkedin.com/in/luizfilipemkato](https://linkedin.com/in/luizfilipemkato)
📎 GitHub: [https://github.com/Luiz-Filipee](https://github.com/Luiz-Filipee)

---

⭐ Se esse projeto te ajudou ou inspirou, deixe uma estrela no repositório!
