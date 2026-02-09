# 🚀 Flugo – Gestão de Colaboradores

Uma aplicação **SaaS-style** para **gestão de colaboradores**, construída com foco em **UX moderna**, **componentização**, **boas práticas de frontend** e **integração em tempo real com Firebase**.

🔗 **Projeto online (Vercel):** [https://desafio-flugo-uskz.vercel.app/](https://SEU-LINK-DO-VERCEL-AQUI)

---

## 🧠 Visão Geral

O **Flugo** permite cadastrar, editar, listar e gerenciar colaboradores de forma simples e profissional, seguindo padrões visuais inspirados em ferramentas como **Monday**, **ClickUp** e **Notion**.

O sistema foi desenvolvido com **React + MUI**, utilizando **Firebase Firestore** como banco de dados e **React Router** para navegação.

---

## ✨ Funcionalidades Implementadas

### 👥 Colaboradores

* ✅ Cadastro de colaborador em **duas etapas (Stepper)**
* ✅ Edição de colaborador com dados pré-carregados
* ✅ Listagem com ordenação por coluna
* ✅ Status **Ativo / Inativo**
* ✅ Exclusão lógica (soft delete → `ativo = false`)
* ✅ Redirecionamento automático após salvar

### 🧭 Navegação

* ✅ Sidebar fixa
* ✅ Menu de colaboradores **expansível**
* ✅ Destaque visual conforme rota

### 🧩 UX / UI

* ✅ Stepper vertical flutuante
* ✅ Inputs ocupando toda a área útil da tela
* ✅ Validação de e-mail em tempo real
* ✅ Botão desabilitado quando formulário inválido
* ✅ Snackbar de sucesso e erro
* ✅ Modal de confirmação ao excluir

---

## 🛠️ Tecnologias Utilizadas

* **React + TypeScript**
* **Material UI (MUI)**
* **React Router DOM**
* **Firebase Firestore**
* **Vite**
* **Vercel (Deploy)**

---

## 📁 Estrutura do Projeto

```bash
src/
├── assets/                # Logos e imagens
│   ├── logo-flugo.png
│   └── react.svg
│
├── components/            # Componentes reutilizáveis
│   ├── Cabecalho/
│   │   └── index.tsx
│   ├── Sidebar/
│   │   └── index.tsx
│   └── StepperVertical/
│       └── index.tsx
│
├── layouts/               # Layouts da aplicação
│   └── LayoutSistema.tsx
│
├── pages/
│   └── Colaboradores/
│       ├── CadastroColaborador.tsx
│       └── ListagemColaboradores.tsx
│
├── routes/                # Configuração de rotas
│   └── index.tsx
│
├── services/              # Integrações externas
│   ├── colaboradorService.ts
│   └── firebase.ts
│
├── styles/                # Tema e estilos globais
│   └── theme.ts
│
├── types/                 # Tipagens TypeScript
│   └── Colaborador.ts
│
├── utils/                 # Utilidades e constantes
│   └── constantes.ts
│
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

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);
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

* Criar colaborador sem e-mail → botão desabilitado
* Criar colaborador com e-mail inválido → erro visual
* Editar colaborador existente
* Desativar colaborador (exclusão lógica)
* Ordenar lista por nome, email e status

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
