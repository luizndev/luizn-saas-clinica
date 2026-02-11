# SaaS Clínica - Gestão Inteligente de Consultórios

<img width="1902" height="942" alt="{D86C145D-BE8D-49BC-8843-2EC575336D75}" src="https://github.com/user-attachments/assets/e15b809f-70fb-4623-b92b-f861611e81f8" />


Sistema de gestão clínica moderno e dinâmico, projetado para automatizar o fluxo de agendamentos e gerenciamento de profissionais de saúde. Uma solução robusta, escalável e com foco em UX/UI premium.

- **Dashboard Inteligente**: Visão geral de métricas, agendamentos recentes e gestão de desempenho.
- **Controle Total de Consultas**: Sistema de agendamento com validação de disponibilidade e status em tempo real.
- **Gestão de Médicos e Pacientes**: Cadastros completos com suporte a especialidades, planos de saúde e histórico.
- **Interface Premium**: Experiência de usuário refinada com `shadcn/ui`, animações fluidas e suporte a drag-and-drop.
- **Infraestrutura SaaS**: Suporte a multi-clínicas, autenticação segura e integração de pagamentos via Stripe.

---

### 💻 Tech Stack

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
  <img src="https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" />
  <img src="https://img.shields.io/badge/BetterAuth-000000?style=for-the-badge&logo=auth0&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
</div>

---

### 🚀 Principais Tecnologias e Bibliotecas

- **Framework**: Next.js 15 (App Router)
- **Estilização**: Tailwind CSS + shadcn/ui
- **Validacão**: Zod + React Hook Form
- **Persistência**: PostgreSQL via Drizzle ORM
- **Autenticação**: BetterAuth com suporte a Google OAuth
- **Pagamentos**: Stripe Subscriptions & Webhooks
- **UI/UX**: Lucide React, Sonner (toasts), Framer Motion (animações)

---

### 🛠️ Configuração Local

1.  Clone o repositório
2.  Instale as dependências: `yarn install`
3.  Configure o arquivo `.env` com suas credenciais (DB, Stripe, Auth)
4.  Execute as migrações: `npx drizzle-kit push`
5.  Inicie o servidor: `yarn dev`

---

_Desenvolvido com foco em alta performance e escalabilidade._
