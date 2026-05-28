# TaskFlow API

TaskFlow is a task management REST API built with **Node.js + Express**.  
It provides user authentication, task management, and interactive API documentation via Swagger.

---

## 🚀 Features Implemented
- Express server setup with middleware (Helmet, CORS, Morgan, Rate Limiting).
- Health check endpoint (`/health`).
- MongoDB connection utility (`config/db.js`).
- Swagger documentation available at `/api/docs`.
- User model with password hashing and role support.
- Task model with validation, indexes, and user association.
- Utility helpers:
  - **JWT (`utils/jwt.js`)** → generate and verify access/refresh tokens.
  - **ApiResponse (`utils/apiResponse.js`)** → standardized success, error, and paginated responses.
- Middleware:
  - **Auth (`middleware/auth.js`)** → protects routes and enforces role-based access.
  - **ErrorHandler (`middleware/errorHandler.js`)** → centralized error handling.
  - **NotFound (`middleware/notFound.js`)** → handles undefined routes.
  - **Validate (`middleware/validate.js`)** → handles request validation errors.
- Controllers:
  - **Auth (`controllers/auth.controller.js`)** → register, login, refresh token, logout, and get profile.
  - **Task (`controllers/task.controller.js`)** → CRUD operations, status toggle, and stats aggregation.
  - **User (`controllers/user.controller.js`)** → profile update, password change, and admin user listing.
- Routes:
  - **Auth (`routes/auth.routes.js`)** → endpoints for register, login, refresh, logout, and profile.
  - **Task (`routes/task.routes.js`)** → endpoints for task CRUD, toggle, and stats.
  - **User (`routes/user.routes.js`)** → endpoints for profile update, password change, and admin listing.

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
├── utils/
│     ├── jwt.js        # JWT utilities
│     └── apiResponse.js# Standardized API responses
├── middleware/
│     ├── auth.js       # Auth & role-based protection
│     ├── errorHandler.js# Global error handler
│     ├── notFound.js   # 404 handler
│     └── validate.js   # Request validation
├── controllers/
│     ├── auth.controller.js # Auth controller
│     ├── task.controller.js # Task controller
│     └── user.controller.js # User controller
├── routes/
│     ├── auth.routes.js # Auth routes
│     ├── task.routes.js # Task routes
│     └── user.routes.js # User routes
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
   

