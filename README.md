# Apollo

Apollo is a modern chatbot website that allows you to ask any question and get fast reliable answers.
It uses Next.js with Shadcn UI, authenticates users via **Better Auth**, stores data in **Neon** (PostgreSQL) accessed through **Prisma**, and powers the chat experience with the **Groq API**. The entire codebase is written in **TypeScript**.

---

## 🚀 Quick Start

```bash
# 1️⃣ Clone the repo
git clone https://github.com/DestroyerX7/apollo.git
cd apollo

# 2️⃣ Install dependencies
npm install   # or yarn / pnpm

# 3️⃣ Set up environment variables
touch .env
# Edit .env and fill in your credentials (see below)

# 4️⃣ Migrate the database
npx prisma migrate dev

# 5️⃣ Run the dev server
npm run dev   # or yarn dev / pnpm dev
```

Open your browser at `http://localhost:3000` to see Apollo in action.

---

## 🛠️ Tech Stack

| Layer        | Library/Tool                           | Purpose                                        |
| ------------ | -------------------------------------- | ---------------------------------------------- |
| **Frontend** | `next@15` + `shadcn/ui`                | Server‑side rendering + reusable UI components |
| **Auth**     | `@better-auth/nextjs`                  | Email & OAuth authentication                   |
| **Database** | `neon` (PostgreSQL) + `@prisma/client` | Managed DB + type‑safe ORM                     |
| **AI**       | `groq` API                             | Low‑latency LLM inference                      |
| **Language** | `TypeScript`                           | Static typing across the stack                 |

---

## ⚙️ Configuration

Create a `.env` file at the root.

| Variable             | Description                                   |
| -------------------- | --------------------------------------------- |
| `DATABASE_URL`       | Neon connection string (PostgreSQL)           |
| `BETTER_AUTH_SECRET` | Secret for Better Auth                        |
| `GROQ_API_KEY`       | API key for Groq inference                    |
| `BETTER_AUTH_URL`    | Your site URL (e.g., `http://localhost:3000`) |

---

## 📄 License

MIT © 2025 Blake Ojera

---
