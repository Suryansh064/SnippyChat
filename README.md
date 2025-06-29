# 🌐 SnippyChat — MERN Real-time Chat & Video App

SnippyChat is a full-stack real-time messaging and video calling platform built for speed, scalability, and style. Whether you're chatting one-on-one, joining a group video call, or swapping languages — SnippyChat delivers a seamless, powerful experience.

---

## 🚀 Features

- **Real-time Messaging** with Typing Indicators & Emoji Reactions  
- **1-on-1 and Group Video Calls** with Screen Sharing & Recording  
- **JWT Authentication** with Secure Protected Routes  
- **Language Exchange Mode** with 32 Unique UI Themes  
- **Fully Responsive UI** (Desktop + Mobile)  
- **Global State Management** with Zustand  
- Robust **Error Handling** on Frontend & Backend  
- **Free Deployment Ready** (e.g., Render, Netlify, Vercel)  
- **Scalable Streaming** via [Stream API](https://getstream.io/)  
- Easy `.env`-based Configuration  

---

## ⚙️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Axios 
- **Backend:** Node.js + Express.js + MongoDB + JWT + Stream  
- **Other Tools:** WebRTC, Socket.IO, Nodemailer, Twilio  
- **Deployment:** Vercel (Frontend) + Render (Backend)

---

## 📁 Folder Structure

```
SnippyChat/
├── backend/   # Express + MongoDB API
├── frontend/  # Vite + React UI
└── README.md
```

---

## 🧪 Environment Variables

### Backend (`/backend/.env`)

```env
PORT=5001
MONGO_URI=your_mongo_uri
STEAM_API_KEY=your_stream_api_key
STEAM_API_SECRET=your_stream_api_secret
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

### Frontend (`/frontend/.env`)

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🔧 Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

cd frontend
npm install
npm run dev
```

---

## 📦 Deployment

- **Frontend:** Deploy `/frontend` to Vercel or Netlify  
- **Backend:** Deploy `/backend` to Render or Railway  

Ensure environment variables are set up on the deployment platform.

---

