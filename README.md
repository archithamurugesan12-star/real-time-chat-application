# CONNECTHUB – Real-Time Chat Application

CONNECTHUB is a production-grade, full-stack MERN real-time messaging platform. It enables authenticated users to find other users, exchange instant messages via Socket.IO, view typing indicators, track message read receipts, observe live online/offline presence with last seen timestamps, and manage user profiles.

---

## 🌟 Key Features

- **JWT Authentication & Security**: Secure registration, login, session persistence, bcrypt password hashing, protected routes, and JWT-authenticated Socket.IO connections.
- **Real-Time Direct Messaging**: One-to-one messaging powered by Socket.IO and backed by persistent MongoDB storage.
- **User Discovery & Live Search**: Debounced search by name or email with live presence indicator.
- **Instant Presence Tracking**: Real-time online/offline presence tracking with automatic `lastSeen` timestamp updates on disconnect.
- **Typing Indicators**: Smooth, debounced typing feedback ("User is typing...").
- **Read Receipts**: Message delivery and read tracking with visual checkmark indicators (single check for delivered, double blue check for read).
- **Profile Customization**: Customizable user profile with 12+ pre-made SVG avatar options, custom avatar URL support, and custom bio status.
- **Mobile-First Responsive Design**: Tailored for both mobile drawer/single-pane workflows and desktop multi-pane views.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS + Custom Scrollbars
- **Routing**: React Router DOM (v6)
- **State Management**: Context API (`AuthContext`, `SocketContext`, `ChatContext`)
- **Real-Time Client**: Socket.IO Client (v4)
- **HTTP Client**: Axios with Bearer token interceptor
- **Forms & Validation**: React Hook Form
- **UI Icons**: Lucide React Icons
- **Notifications**: React Hot Toast
- **Date Utilities**: Date-fns

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-Time Engine**: Socket.IO (v4)
- **Security & Auth**: JSON Web Tokens (JWT), Bcrypt.js, CORS, Dotenv, Input Validation
- **Testing**: Jest, Supertest, MongoDB Memory Server

---

## 📂 Project Structure

```
CONNECTHUB – Real-Time Chat Application/
├── backend/
│   ├── config/
│   │   └── db.js                       # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js           # Register, login, get & update profile
│   │   ├── userController.js           # Search users & get user by ID
│   │   ├── conversationController.js   # Manage 1-on-1 conversations
│   │   └── messageController.js        # Send, fetch & mark messages read
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT Bearer token verification
│   │   └── errorMiddleware.js          # Centralized error handler
│   ├── models/
│   │   ├── User.js                     # User Schema
│   │   ├── Conversation.js             # Conversation Schema
│   │   └── Message.js                  # Message Schema
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth endpoints
│   │   ├── userRoutes.js               # /api/users endpoints
│   │   ├── conversationRoutes.js       # /api/conversations endpoints
│   │   └── messageRoutes.js            # /api/messages endpoints
│   ├── sockets/
│   │   ├── socketAuth.js               # Socket handshake JWT verification
│   │   └── socketHandler.js            # Presence, messaging & typing events
│   ├── utils/
│   │   └── token.js                    # JWT helper utilities
│   ├── tests/                          # Automated backend test suite
│   ├── .env.example
│   ├── package.json
│   └── server.js                       # Express & Socket.IO HTTP server
│
├── frontend/
│   ├── public/                         # Favicon & assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                   # ProtectedRoute, PublicRoute
│   │   │   ├── chat/                   # Sidebar, ChatArea, MessageList, MessageBubble, MessageInput, TypingIndicator, UserSearchModal
│   │   │   ├── common/                 # Avatar, StatusBadge, LoadingSpinner, Navbar
│   │   │   └── profile/                # AvatarPickerModal
│   │   ├── context/                    # AuthContext, SocketContext, ChatContext
│   │   ├── hooks/                      # useDebounce, useScrollToBottom
│   │   ├── pages/                      # LoginPage, RegisterPage, ChatPage, ProfilePage, NotFoundPage
│   │   ├── services/                   # api.js, authService, userService, conversationService, messageService
│   │   ├── utils/                      # dateUtils, avatarUtils
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── package.json                        # Root workspace scripts
└── README.md
```

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB Community Server or MongoDB Atlas connection string)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/connecthub
JWT_SECRET=connecthub_super_secret_jwt_key_998877665544332211
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 2. Frontend Setup

In a separate terminal:
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` (or copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
# App will open on http://localhost:5173
```

---

## ☁️ MongoDB Atlas Setup Guide

1. Create an account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (e.g. Shared M0 Free Tier).
3. Under **Database Access**, create a database user with read/write permissions. Note the username and password.
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`) or whitelist your server IPs.
5. In your Cluster overview, click **Connect** -> **Drivers** -> **Node.js**.
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/connecthub?retryWrites=true&w=majority
   ```
7. Set this URI as `MONGO_URI` in your backend environment variables.

---

## 🚀 Render Deployment (Backend)

1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New +** -> **Web Service**.
3. Select your repository.
4. Set the following build and start configurations:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default assigned by Render)
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_strong_random_secret_key`
   - `JWT_EXPIRE`: `7d`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`
6. Click **Create Web Service**. Note your backend live URL (e.g. `https://connecthub-api.onrender.com`).

---

## 🚀 Vercel Deployment (Frontend)

1. Sign in to [Vercel](https://vercel.com) and click **Add New...** -> **Project**.
2. Select your GitHub repository.
3. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://connecthub-api.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://connecthub-api.onrender.com`
5. Click **Deploy**.

---

## 📡 REST API Documentation

All protected endpoints require an `Authorization: Bearer <token>` header.

### Authentication Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user. Returns JWT and safe user object. |
| `POST` | `/api/auth/login` | Public | Authenticate user. Returns JWT and safe user object. |
| `GET` | `/api/auth/profile` | Private | Retrieve current user's profile. |
| `PUT` | `/api/auth/profile` | Private | Update name, avatar, or bio. |

### User Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users?search=query` | Private | Search users by name or email (excluding current user). |
| `GET` | `/api/users/:id` | Private | Fetch safe details of a specific user. |

### Conversation Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/conversations` | Private | List all conversations for the user with last messages and unread counts. |
| `POST` | `/api/conversations` | Private | Create or fetch existing 1-on-1 conversation (`{ recipientId }`). |
| `GET` | `/api/conversations/:id` | Private | Get single conversation details. |

### Message Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/:conversationId` | Private | Fetch chronological message history. |
| `POST` | `/api/messages` | Private | Send a text message (`{ conversationId, receiverId, text }`). |
| `PUT` | `/api/messages/:id/read` | Private | Mark a message as read. |
| `PUT` | `/api/messages/read/all` | Private | Mark all unread messages in a conversation as read (`{ conversationId }`). |

---

## ⚡ Socket.IO Real-Time Events Reference

### Client -> Server Events
| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `user:online` | None | Manually trigger presence update & request online users list. |
| `send:message` | `{ conversationId, receiverId, text }` | Send a new message directly via socket. |
| `typing:start` | `{ conversationId, receiverId }` | Notify receiver that user has started typing. |
| `typing:stop` | `{ conversationId, receiverId }` | Notify receiver that user has stopped typing. |
| `message:read` | `{ conversationId, senderId }` | Notify sender that messages were opened and read. |

### Server -> Client Events
| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `users:online:list` | `Array<string>` | Initial array of all online user IDs. |
| `user:status` | `{ userId, isOnline, lastSeen }` | Broadcast when a user connects or disconnects. |
| `message:new` | `MessageObject` | Delivered in real-time to sender and receiver rooms. |
| `typing:update` | `{ conversationId, userId, isTyping }` | Live typing state update for active chat. |
| `message:read:update` | `{ conversationId, readerId, readAt }` | Live read receipt update for sender. |
| `conversation:update` | `ConversationObject` | Updated conversation preview for sidebar. |

---

## 🧪 Testing the Application

### Automated Test Suite
Run the backend test suite (unit, integration & socket tests):
```bash
cd backend
npm test
```

### Manual Verification Checklist
1. **Registration**: Open `/register`, create user "Alice". Redirects to `/chat`.
2. **Second User**: Open an Incognito window, register user "Bob".
3. **Search & Start Chat**: On Alice's window, click "New Conversation" -> search "Bob" -> click "Chat".
4. **Real-Time Exchange**: Send message from Alice to Bob. The message appears instantly on Bob's screen without page refresh.
5. **Typing Indicators**: Type in Alice's input bar -> Bob sees "Alice is typing...".
6. **Read Receipts**: Notice checkmarks on sent bubbles change to double blue checkmarks when viewed.
7. **Presence Updates**: Close Bob's tab -> Alice sees Bob's status change from "Online" to "Last seen just now".
8. **Profile Customization**: Open `/profile`, select an avatar preset or enter custom URL, edit bio, and save.

---

## 📄 License
This project is licensed under the MIT License.
