# 🌐 SnippyChat — MERN Real-time Chat & Video App

SnippyChat is a full-stack real-time messaging and video calling platform built for speed, scalability, and style. Whether you're chatting one-on-one, joining a group video call, or swapping languages — SnippyChat delivers a seamless, powerful experience.

---

## 🚀 Features

- 💬 **Real-time Messaging** with Typing Indicators & Emoji Reactions  
- 📹 **1-on-1 and Group Video Calls** with Screen Sharing & Recording  
- 🔐 **JWT Authentication** with Secure Protected Routes  
- 📱 **Fully Responsive UI** for Desktop & Mobile  
- ⚠️ Robust **Error Handling** on Frontend & Backend  
- 🚀 **Free Deployment Ready** (Render, Netlify, Vercel)  
- 📡 **Scalable Streaming** using [Stream API](https://getstream.io/)  
- ⚙️ Easy `.env`-based Configuration  
- 🔊 **WebRTC-based Video Engine** for real-time peer-to-peer calls  

---

## ⚙️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Axios  
- **Backend:** Node.js + Express.js + MongoDB + JWT + Stream API  
- **Other Tools:** WebRTC, Socket.io  
- **Deployment:** Vercel (Frontend) + Render (Backend)  

---

## 📁 Folder Structure

SnippyChat/
├── backend/ # Express + MongoDB API
├── frontend/ # Vite + React UI
└── README.md

---

## 🧪 Environment Variables

### 🔙 Backend (`/backend/.env`)

```env
PORT=5001
MONGO_URI=your_mongo_uri
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development


🔜 Frontend (/frontend/.env)
VITE_STREAM_API_KEY=your_stream_api_key


💻 Running Locally
Backend
cd backend
npm install
npm run dev


Frontend

cd frontend
npm install
npm run dev



📦 Deployment

Frontend: Deploy /frontend to Vercel or Netlify
Backend: Deploy /backend to Render or Railway

Make sure to configure the environment variables on the deployment platform accordingly.


🤝 Contributing
Contributions are welcome!
Feel free to fork this repository, create a new branch, and submit a pull request.

📄 License
This project is licensed under the MIT License.



🙌 Acknowledgements
Stream API for scalable chat and call backend
WebRTC for real-time video/audio communication
Inspired by modern UI/UX chat platforms
Made with ❤️ by Suryansh Singh 