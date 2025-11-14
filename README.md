***

# AI Courtroom – MERN Based Legal Argument Simulator

A real-time courtroom simulation where two parties join using a Case ID, submit structured arguments round-by-round, upload supporting documents, and receive an AI-generated verdict powered by Gemini.

The experience is intentionally simple: one user creates a case, receives a Case ID, and shares it with the second user - similar to joining a room in a Ludo game. Both participants sign in using their personal Google accounts. Once authenticated, the plaintiff creates a case, the defendant joins using the same Case ID, and together they begin presenting structured statements and arguments with real-time synchronization.

To ensure the platform stays fast, stable, and scalable, the system uses:

- Lazy loaded frontend routes
- Pagination for large data sets
- Virtualized rendering (react-virtuoso) for smooth performance
- Redis caching for reduced database load
- MongoDB Atlas for cloud scalability
- Google OAuth + JWT for secure authentication
- Gemini API for verdict generation

The goal is to simulate a courtroom environment with clarity and discipline — without unnecessary UI noise.

***

# Features

### Case System

- Create a case and receive a unique Case ID
- Another user can join instantly using the same Case ID
- Only two participants allowed: Side A (Plaintiff) and Side B (Defendant)

### Structured Argument Rounds

- Case proceeds in 5 rounds
- Each side can submit a fixed number of arguments per round
- Live syncing: messages appear instantly on both devices
- Clean separation of Side A vs Side B arguments

### Document Uploads

- Each side can upload supporting documents
- Frontend uses virtualized lists for smooth browsing
- Server extracts text (PDF/Docx) and stores metadata

### AI Judge

- Both sides may request a verdict
- Gemini API generates a structured summary and final judgment
- Verdict is cached in Redis for improved performance on repeated requests

### Authentication

- Login via Email + Password or Google OAuth
- JWT used for securing all protected API routes

### Scalability & Performance

- Redis caching for:
  - Case data
  - Messages
  - Verdicts
- MongoDB Atlas for horizontal scalability
- Lazy-loaded React routes reduce bundle size
- Paginated case lists
- Virtualized rendering for heavy chat and document lists

***
#  Screenshots (Click to Expand)
<details> <summary><b>Show Screenshots</b></summary> <br> <img width="1621" height="903" alt="Screenshot 2025-11-14 153417" src="https://github.com/user-attachments/assets/7a8b1530-2780-4c4e-baf7-8e4e5f3bde5a" /> <img width="1677" height="907" alt="Screenshot 2025-11-14 153456" src="https://github.com/user-attachments/assets/8095097e-646d-4da4-9e05-cd6e1aa0992b" /> <img width="1702" height="875" alt="Screenshot 2025-11-14 153509" src="https://github.com/user-attachments/assets/dfca33d3-6287-43a9-9cd7-0a5732c30f0f" /> <img width="1640" height="886" alt="Screenshot 2025-11-14 153526" src="https://github.com/user-attachments/assets/a9017215-4f05-402b-aef0-c6907665c7aa" /> <img width="1909" height="908" alt="Screenshot 2025-11-14 153619" src="https://github.com/user-attachments/assets/428593cf-39f8-4147-9446-690aa00c42a3" /> <img width="1687" height="880" alt="Screenshot 2025-11-14 153536" src="https://github.com/user-attachments/assets/1579703d-a067-4d13-b0e3-4c33dbb1bad3" /> </details>


# Tech Stack

### Frontend

- React 19
- Redux Toolkit (central state management: auth, cases, chat, judge, documents)
- React Router v7
- Tailwind CSS
- Axios
- React Virtuoso (virtualized list rendering)
- Vite (Rolldown-powered)

### Backend

- Node.js + Express
- MongoDB Atlas (Mongoose)
- Redis
- Google OAuth Library
- JWT (jsonwebtoken)
- Gemini API (@google/generative-ai)
- Multer (file uploads)
- pdf-parse / mammoth (document parsing)
- Winston (logging)

### Infrastructure

- Redis Cloud or local Redis server
- Environment variables for secrets

---

# How the System Works

### 1. Creating & Joining a Case

- User A logs in → creates a case → receives Case ID
- User B logs in from another device → joins using the same Case ID
- Both are assigned to Side A or Side B

### 2. Live Argument Submission

- Each message is stored with:
  - Case ID
  - Side (A/B)
  - Round number
  - Timestamp
- Frontend only renders messages for the current round
- Messages update instantly using periodic sync and cached responses

### 3. Document Uploads

- Supports PDF and DOCX
- Extracts text for AI analysis
- Stored in MongoDB with cloud scalability
- Listing uses react-virtuoso for smooth scrolling

### 4. Verdict Generation

- Either participant may request it
- Gemini processes:
  - Both sides' arguments
  - Document contents
- Produces a final decision in a structured format
- Verdict is cached to prevent repeated API calls

***

# Project Structure

### Client

``````
client/
  public/
  src/
    app/
      store.js
      hooks.js
    assets/
    components/
      chat/
      judge/
      layout/
      documents/
    features/
      auth/
      case/
      chat/
      judge/
      documents/
    pages/
      Login.jsx
      Register.jsx
      Dashboard.jsx
      CaseCreate.jsx
      CaseEntry.jsx
      CaseRoom.jsx
      ExportOrder.jsx
    utils/
      apiClient.js
      uploadDocument.js
    App.jsx
    main.jsx
  package.json
```

### Server

``````
server/
  controllers/
    authController.js
    caseController.js
    argumentController.js
    documentController.js
  services/
    authService.js
    caseService.js
    argumentService.js
  middleware/
    authMiddleware.js
    errorMiddleware.js
  models/
    User.js
    Case.js
    Party.js
    Argument.js
    Document.js
  config/
    redisClient.js
    logger.js
    db.js
  routes/
    authRoutes.js
    caseRoutes.js
    argumentRoutes.js
    documentRoutes.js
  uploads/
  server.js
  package.json
```

***

# Environment Variables

### Client (.env)

``````
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
```

### Server (.env)

``````
MONGO_URI=YOUR_MONGODB_ATLAS_URI
PORT=5000
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
JWT_SECRET=YOUR_JWT_SECRET
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
REDIS_URL=redis://default:password@host:port
```

***

# Installation & Setup

### 1. Clone the repository

```sh```
git clone https://github.com/Mohammedanees06/AI-Courtroom.git
cd AI-Courtroom

```

---

## 2. Environment Variables (Required Before Running)

Create a `.env` file inside both server/ and client/ and add the following values.

Developers must obtain the credentials from the official sources listed below.

### Where to get each key:

- MongoDB Atlas Cluster URI
  Create a free cluster:
  https://www.mongodb.com/docs/atlas/getting-started/

- Google OAuth Client ID
  Create from Google Cloud Console → OAuth 2.0 Credentials:
  https://developers.google.com/identity/oauth2/web/guides/create-client

- Gemini API Key
  Generate from Google AI Studio:
  https://ai.google.dev/gemini-api/docs/api-key

- Redis Cloud URL
  Create a free Redis instance:
  https://redis.io/docs/latest/operate/rc/rc-quickstart/

Add them to your `.env` files like this:

### Server `.env`

``````
PORT=5000
MONGO_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
REDIS_URL=your_redis_cloud_url
```

### Client `.env`

``````
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 3. Setup Server

``````sh
cd server
npm install
node server.js
```

***

## 4. Setup Client

```sh```
cd client
npm install
npm run dev
```

---

# Core Decisions & Optimizations

### Lazy Loading

Reduces initial bundle size by loading routes only when needed.

### Pagination

Used for case listings to avoid loading large data sets at once.

### Virtualized Rendering

``react-virtuoso` ensures heavy lists (messages, documents) render only what is visible.

### Redis Caching

Caches:

- Case data
- Messages
- Verdicts

Greatly reduces database load and boosts speed.

### Redux Toolkit

Manages:

- Authentication state
- Parties & case data
- Chat messages
- Verdict state
- Document uploads

Keeps the application predictable and easy to maintain.

---

# Why This Project Stands Out

- Courtroom structure with clear discipline
- AI-assisted judgment
- Simple Case ID–based joining mechanism
- Multi-device live sync
- Scalable, production-ready backend
- Robust use of caching and modern frontend performance patterns
- Secure authentication with OAuth + JWT

---

# Author

Mohammed Anees
Full-Stack Developer (MERN & AI)

🌐 Portfolio:
https://mohammedanees.netlify.app

💼 LinkedIn:
https://www.linkedin.com/in/mohammedaneesdev

💻 GitHub:
https://github.com/Mohammedanees06

📧 Email:
Mohammedanees0606[at]gmail[dot]com


---

