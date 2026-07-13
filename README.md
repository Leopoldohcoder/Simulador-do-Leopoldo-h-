# Simulador do Leopoldo'H

**Sua aprovação começa aqui.**
Preparação para Concursos Públicos de Angola — React + Vite + Firebase, pronto para publicar no Netlify.

Desenvolvido por **Leopoldo Nicolau** · Suporte: **+244 931 619 002** · © 2026

---

## 1. Como instalar

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior instalado no computador.

```bash
# 1. Entre na pasta do projeto
cd Simulador-do-Leopoldoh

# 2. Instale as dependências
npm install

# 3. Rode em modo de desenvolvimento
npm run dev
```

O site abre em `http://localhost:5173`. Ainda não vai funcionar de verdade até você configurar o Firebase (passo 2).

---

## 2. Como configurar o Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e crie um novo projeto (gratuito, plano "Spark").
2. Dentro do projeto, clique no ícone **`</>`** ("Adicionar app da Web") e registe um app. Copie o objeto `firebaseConfig` que aparece.
3. No menu lateral, ative:
   - **Authentication** → separador "Sign-in method" → ative **"E-mail/Senha"**.
   - **Firestore Database** → "Criar base de dados" → inicie em modo de produção (as regras já vêm prontas no ficheiro `firestore.rules`, use "Publicar regras" para aplicá-las).
4. Na raiz do projeto, copie `.env.example` para um novo ficheiro chamado `.env`:
   ```bash
   cp .env.example .env
   ```
5. Preencha o `.env` com os valores do `firebaseConfig` que copiou no passo 2:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
6. Aplique as regras de segurança do Firestore: abra o ficheiro `firestore.rules` deste projeto, copie o conteúdo e cole em **Firestore Database → Regras** no console do Firebase, depois clique em "Publicar".
7. (Opcional, mas recomendado) Popule o banco com as questões de exemplo:
   ```bash
   npm run seed
   ```
   Isto importa as ~26 questões iniciais definidas em `src/data/seedQuestions.js` para a coleção `questions`.

> Nota técnica: como o sistema pede login apenas com "número + palavra-passe" (sem e-mail), o app transforma o número num e-mail interno (`<numero>@simuladorleopoldoh.ao`) para usar o Firebase Authentication por trás dos panos. O utilizador nunca vê isso.

---

## 3. Como criar o administrador

O administrador é identificado automaticamente pelo número de telefone `+244 931 619 002` (definido em `src/firebase/auth.js`, constante `ADMIN_PHONE`).

Basta criar uma conta normal em **"Criar Conta"** usando esse número — o sistema marca a conta como administrador automaticamente e ela passa a ter acesso ao botão **"Admin"** no menu, com todas as funções (gerir questões, candidatos, estatísticas e avisos).

Para trocar o número do administrador, edite a constante `ADMIN_PHONE` em `src/firebase/auth.js`.

---

## 4. Como publicar no Netlify

**Opção A — pelo site do Netlify (mais simples):**
1. Suba este projeto para um repositório no GitHub (ou GitLab/Bitbucket).
2. Em [app.netlify.com](https://app.netlify.com), clique em "Add new site" → "Import an existing project" e escolha o repositório.
3. O Netlify já vai detetar as configurações do ficheiro `netlify.toml` (comando `npm run build`, pasta `dist`).
4. Em **Site settings → Environment variables**, adicione as mesmas 6 variáveis do seu `.env` (`VITE_FIREBASE_API_KEY`, etc.).
5. Clique em "Deploy site".

**Opção B — pela linha de comando:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```
(Configure as variáveis de ambiente no painel do Netlify antes do deploy, senão o Firebase não vai conectar.)

Depois de publicado, adicione o domínio do Firebase Authentication autorizado: no console do Firebase, vá em **Authentication → Settings → Domínios autorizados** e adicione o domínio `.netlify.app` que o Netlify lhe deu.

---

## 5. Como atualizar questões

Depois de configurado, tudo é feito pela interface — não precisa mexer em código:
1. Entre como administrador.
2. Vá em **Admin → Questões**.
3. Preencha categoria, dificuldade, tema, pergunta, as 4 alternativas, marque a correta e escreva a explicação.
4. Clique em "Adicionar questão" (ou "Editar"/"Excluir" numa questão já existente na lista abaixo).

---

## 6. Como adicionar novos simulados

Este sistema gera os simulados dinamicamente a partir do banco de questões — não existem "simulados fixos" para criar manualmente. Para ter mais variedade:
- Adicione mais questões em cada disciplina (passo 5).
- Os candidatos escolhem a disciplina e a quantidade de questões (5, 10, 15 ou 20) na tela "Configurar Simulado", e o sistema sorteia questões aleatórias automaticamente.

---

## 7. Como alterar cores

Edite um único ficheiro: `src/styles/theme.js`, objeto `BRAND`:
```js
export const BRAND = {
  navy: "#0B2E59",     // azul escuro principal
  navyDark: "#071F3D", // azul mais escuro (cabeçalho/rodapé)
  red: "#D62828",      // vermelho de destaque/ação
  gold: "#C9A227",     // dourado dos detalhes
  goldLight: "#E4C766",
  paper: "#F4F5F7",    // fundo das páginas
  ink: "#101820",      // cor do texto
};
```
Todas as páginas e componentes importam essas cores daqui, então a mudança se aplica ao site inteiro.

---

## 8. Como alterar o logo

O "logo" atual é o selo `<Seal text="LH" />`, feito só em código (sem imagem), definido em `src/components/UI.jsx`.
- Para trocar o texto do selo, mude a prop `text="LH"` no `Header.jsx`.
- Para usar uma imagem/logotipo de verdade, substitua o componente `<Seal ... />` no `src/components/Header.jsx` por uma tag `<img src="/icons/icon-192.png" ... />`, e coloque o seu ficheiro de logo dentro de `public/`.
- Os ícones do PWA (instalação no telemóvel) ficam em `public/icons/` — substitua os ficheiros `icon-72.png` até `icon-512.png` pelos seus, mantendo os mesmos nomes e tamanhos.

---

## Estrutura do projeto

```
Simulador-do-Leopoldoh/
├─ src/
│  ├─ components/    # Header, Footer, botões, campos, cartões, rota protegida
│  ├─ pages/          # Uma página por rota (Home, Login, Painel, Admin, etc.)
│  ├─ hooks/          # useAuth
│  ├─ contexts/       # AuthContext (sessão do utilizador)
│  ├─ firebase/       # config.js e auth.js (ligação ao Firebase)
│  ├─ services/       # Funções que leem/escrevem no Firestore
│  ├─ styles/         # theme.js (cores, categorias, utilitários)
│  ├─ data/           # seedQuestions.js (banco de questões inicial)
│  ├─ App.jsx         # Rotas da aplicação
│  └─ main.jsx        # Ponto de entrada + registo do Service Worker
├─ public/
│  ├─ icons/           # Ícones do PWA (72 a 512px)
│  ├─ manifest.json    # Manifest do PWA
│  └─ sw.js             # Service Worker (funcionamento offline)
├─ scripts/
│  └─ seedFirestore.js # Script para importar as questões de exemplo
├─ firestore.rules     # Regras de segurança do Firestore
├─ netlify.toml        # Configuração de build/redirects do Netlify
├─ vite.config.js
├─ package.json
├─ .env.example
└─ README.md
```

---

## Coleções do Firestore

| Coleção         | Conteúdo                                                        |
|-----------------|-------------------------------------------------------------------|
| `users`         | Perfil de cada candidato (nome, telefone, isAdmin, bloqueado…)  |
| `questions`     | Banco de questões (categoria, alternativas, resposta, explicação) |
| `results`       | Resultados de cada simulado realizado                            |
| `ranking`       | Um documento por utilizador com provas/melhor nota/soma de notas |
| `notifications` | Documento único `latest` com o aviso exibido na página inicial   |
| `materials`     | Biblioteca de material de estudo (PDF, vídeos, links, resumos)   |

---

## Segurança

- Autenticação via Firebase Authentication (e-mail/senha, com o número de telefone convertido internamente).
- Regras do Firestore (`firestore.rules`) impedem que um candidato leia ou edite dados de outro, e restringem escrita em questões/materiais/avisos apenas ao administrador.
- Todas as rotas privadas (`/painel`, `/simulado`, `/historico`, `/ranking`, `/perfil`, `/admin`) são protegidas pelo componente `ProtectedRoute`, que redireciona para `/login` sem sessão ativa.
