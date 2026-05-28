# task-manager-app
Full Stack Task Management App using React.js + Node.js  
It provides user authentication, task management, and interactive API documentation via Swagger.

---

## 🚀 Features Implemented
- Express server setup with middleware (Helmet, CORS, Morgan, Rate Limiting).
- Health check endpoint (`/health`).
- MongoDB connection utility (`config/db.js`).
- Swagger documentation available at `/api/docs`.
- User model with password hashing and role support.
- Task model with validation, indexes, and user association.

---

## 📂 Project Structure
backend/
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── config/
│     ├── db.js         # MongoDB connection
│     └── swagger.js    # Swagger setup
├── models/
│     ├── User.js       # User schema
│     └── Task.js       # Task schema
├── routes/             # API routes (auth, tasks, users)
└── middleware/         # Error handling, notFound


---

## ⚙️ Installation & Setup
1. Clone the repository:
   git clone https://github.com/champ-sk/task-manager-app.git
   cd backend
2. Install dependencies:
   npm install
3. Create a .env file in the root with:
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/taskflow
   CLIENT_URL=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   
4. Run the server:
   node server.js
   

