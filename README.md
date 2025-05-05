# Ticket Management Full-Stack Application

**🎉  🌐Live Demo:** [https://ticket-management-fullstack.netlify.app/](https://ticket-management-fullstack.netlify.app/)

> This demo is fully integrated: the React frontend communicates with the deployed Node.js/Express backend in real time.

A secure, scalable Single-Page Application (SPA) for team-based ticket management, built with a **Vite-React** frontend and **Node.js/Express** backend. Implements **RBAC** (Role-Based Access Control) using **JWT** for authentication and **MongoDB** for persistence. Deployed on **Netlify** (frontend) and **Render** (backend).

---

## 📁 Project Structure

```
├── Backend
│   ├── Controllers
│   │   ├── chatBotController.js
│   │   ├── teamController.js
│   │   ├── ticketController.js
│   │   └── userController.js
│   ├── Middleware
│   │   ├── authMiddleware.js
│   │   └── authorize.js
│   ├── Models
│   │   ├── BotUser.js
│   │   ├── ChatBot.js
│   │   ├── Team.js
│   │   ├── Tickets.js
│   │   └── User.js
│   ├── Routes
│   │   ├── chatBotRouter.js
│   │   ├── teamRouter.js
│   │   ├── ticketRouter.js
│   │   └── userRouter.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── Frontend
│   ├── public
│   ├── src
│   │   ├── Components
│   │   ├── Pages
│   │   ├── UserContext.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   ├── netlify.toml
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔑 Features

* **Role-Based Access Control (RBAC)**: Captain-Admin, Admin, Member roles govern access to operations.
* **Authentication**: JWT-based, stored in HTTP-only cookies for security. (Protected by `authMiddleware`)
* **Authorization**: Middleware (`authorize.js`) enforces permission checks per role.
* **Team Management**: Create team, add/edit/remove members.
* **Ticketing System**: Raise, assign, and track tickets.
* **Chatbot Interface**: Users interact with a chatbot to submit and query tickets.
* **Profile Settings**: Edit user profile with immediate logout on sensitive changes; only Captain-Admin can change passwords.
* **Responsive SPA**: Built with Vite & React, smooth client-side routing.
* **Deployments**:

  * Backend on [Render](https://render.com)
  * Frontend on [Netlify](https://netlify.com)

## 🔐 Roles & Permissions

| Role            | Permissions                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| `captain-admin` | `solve_ticket`, `assign_ticket`, `update_chatbot`, `manage_team`, `handover_captain`     |
| `admin`         | `solve_ticket`, `assign_ticket`, `update_chatbot`, `manage_team` (except remove Captain) |
| `member`        | `solve_ticket` (only assigned ones)                                                      |
| `user`          | `create_ticket`                                                                          |

## 🚀 Getting Started

### Prerequisites

* Node.js v16+ & npm
* MongoDB Atlas (or self-hosted MongoDB)
* Git

### Environment Variables

Create a `.env` in `Backend/`:

```
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret>
```

Create a `.env` or set Netlify env vars in `Frontend/` if needed for API URL:

```
VITE_API_BASE_URL=https://<your-backend-render-url>
```

### Local Development

#### Backend

```bash
cd Backend
npm install
npm run dev    # nodemon server.js
```

#### Frontend

```bash
cd Frontend
npm install
npm run dev    # Vite dev server
```

Open `http://localhost:3000` (or the port shown) for the frontend.

---

## 📦 Deployment

### Backend on Render

1. Push `Backend/` to a Git repo.
2. Log in to Render, create a new **Web Service**, connect your repo.
3. Set **Root Directory** to `Backend`.
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add **Environment Variables** on Render:

   * `MONGODB_URI`, `JWT_SECRET`
7. Deploy and note the service URL (e.g. `https://api.example.com`).

### Frontend on Netlify

1. Push `Frontend/` to a Git repo (can be same monorepo).
2. In Netlify, click **New Site → Import from Git**, select your repo.
3. **Base directory**: `Frontend`
4. **Build command**: `npm run build`
5. **Publish directory**: `dist`
6. Ensure a `netlify.toml` or `_redirects` handles SPA routing:

   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
7. Deploy and note the URL (e.g. `https://app.example.netlify.app`).

