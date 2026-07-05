# TaskFlow AI 🚀

TaskFlow AI is a smart to-do application that uses an LLM to automatically categorize and prioritize user tasks. Built on the MERN stack with a beautiful glassmorphic dark-mode dashboard, it allows users to organize tasks via drag-and-drop, manage task stats, and query AI classification on-demand.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v3, drag-and-drop via `@hello-pangea/dnd`.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (using Mongoose).
- **AI Integration**: Groq API (`groq-sdk`) using `llama-3.1-8b-instant`.
- **Authentication**: JSON Web Token (JWT) session persistence with hashed passwords (`bcryptjs`).

---

## 🚀 Quick Start Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally OR a free MongoDB Atlas cluster.

### Step 1: Clone & Configure Backend
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file from the example:
   ```bash
   copy .env.example .env
   ```
3. Edit the `.env` file with your credentials:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: Any random alphanumeric string (e.g., `my_secret_token_123`).
   - `GROQ_API_KEY`: Your Groq API key (see instructions below).
   - `PORT`: Set to `5000`.
   - `CLIENT_URL`: Set to `http://localhost:5173`.
4. Install dependencies and start development server:
   ```bash
   npm install
   npm run dev
   ```

### Step 2: Configure & Start Frontend
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Create a `.env` file from the example:
   ```bash
   copy .env.example .env
   ```
3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 How to Get Keys & Connections

### 1. Get a Free Groq API Key
1. Go to the [Groq Console](https://console.groq.com/).
2. Sign up or log in.
3. Click on the **API Keys** tab on the left sidebar.
4. Click **Create API Key**, name it `TaskFlow-AI`, and copy the generated key.
5. Paste it in your `server/.env` as:
   ```env
   GROQ_API_KEY=gsk_your_key_here...
   ```

### 2. Create a Free MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project and build a **Free Shared Cluster (M0)**.
3. Choose your cloud provider and region, then click **Create**.
4. In the **Security** tab:
   - Create a database user with a username and password (write these down).
   - Go to **Network Access** and click **Add IP Address**. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) for development.
5. In the **Database** tab, click **Connect** next to your cluster.
6. Select **Drivers** (Node.js) and copy the Connection String.
7. Paste it in your `server/.env` file:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow-ai?retryWrites=true&w=majority
   ```
   *(Be sure to replace `<username>` and `<password>` with the database user details you created!)*

---

## 🧠 AI Classification Architecture

TaskFlow AI contains a central service `groqService.js` that isolates all AI prompt engineering:
- **Model**: `llama-3.1-8b-instant` — selected for sub-200ms latency, high throughput, and zero cost in development.
- **Prompt Design**:
  - The system prompt instructs the model to return **ONLY** one of the three lowercase priority strings: `urgent`, `important`, or `low`.
  - It explicitly restricts response formatting to prevent the model from prefixing markdown, punctuation, or descriptions.
- **Fail-safe Logic**:
  - If the Groq API key is missing, or the call times out/fails due to network conditions, or the model responds with an unexpected value, the application catches the error and defaults the task's priority to `important`.
  - **Task creation is never blocked by AI downtime.**

---

## 💬 Interview Q&A Cheatsheet (Resume Ready)

If you are asked about this project in an interview, here is how to explain it:

### Q: Why did you choose Groq instead of OpenAI?
> *"I chose Groq because of its LPU (Language Processing Unit) architecture which delivers unmatched token speeds. Specifically, for classifying to-do items, I wanted the priority column to feel instantaneous on saving. The latency of Llama-3.1-8B-Instant on Groq is under 150-200ms, making it feel like a local lookup, whereas OpenAI's GPT-4o-mini averages 800ms to 1.2s."*

### Q: How did you ensure the AI outputs were parseable?
> *"I used a highly strict system prompt specifying that the model must only return one word: `urgent`, `important`, or `low`. I kept the temperature low (0.1) to avoid creative responses. I also implemented a robust validation layer in the backend `groqService`: if the API returns anything else or fails, it catches the error and defaults to `important`. This prevents AI downtime from breaking core task CRUD."*

### Q: How did you implement the Drag-and-Drop priority overrides?
> *"I used `@hello-pangea/dnd` (the React-18 compatible fork of `react-beautiful-dnd`) on the frontend to render the three priority columns. When a user drags a card, the frontend immediately reorders the local state list using optimistic UI updates for a lag-free feel. We then dispatch a `PATCH` request to `/api/tasks/:id/priority` to persist the manual override. If the API fails, the board state reverts to match the database."*

### Q: What is your database schema design?
> *"I designed two Mongoose schemas: `User` and `Task`. The `Task` schema maintains a reference to the `User` document, ensuring scoped access. We index the `user` field and task creation dates to allow fast sorted lookups when fetching dashboard columns."*
