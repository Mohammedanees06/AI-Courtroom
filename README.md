# AI Courtroom – MERN Based Legal Argument Simulator

A real-time courtroom simulation where two parties join using a Case ID, submit structured arguments round-by-round, upload supporting documents, and receive an AI-generated verdict powered by Gemini.

The experience is intentionally simple: one user creates a case, receives a Case ID, and shares it with the second user—similar to joining a room in a Ludo game. Both participants sign in using their Google accounts, the plaintiff creates a case, the defendant joins using the same Case ID, and both present structured statements with real-time synchronization.

### 🎥 Project Walkthrough (Video)

I have created a short <5 minute video showcasing:

- Complete implementation overview
- Folder structure
- Code walkthrough
- API flow explanation
- Demo of the working project

📺 Watch the Video:  
youtube(https://youtu.be/lQwDDlbNeH4)

## Features

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

- Each side can upload supporting documents (PDF, DOCX)
- Server extracts text and stores metadata for AI analysis
- Frontend uses virtualized lists for smooth browsing

### AI Judge

- Either side can request a verdict
- Gemini API generates a structured summary and final judgment
- Verdicts are cached in Redis to reduce repeated API calls

### Authentication

- Login via Email + Password or Google OAuth
- JWT secures all protected API routes
- Client uses the Google OAuth Client ID for sign-in

### Scalability & Performance

- Redis caching for case data, messages, and verdicts
- MongoDB Atlas for cloud scalability
- Lazy-loaded React routes to reduce bundle size
- Pagination for large lists
- Virtualized rendering for heavy chat and document lists

## Screenshots

<details>
  <summary><b>Show Screenshots</b></summary>

  <img width="1621" height="903" alt="Screenshot 2025-11-14 153417" src="https://github.com/user-attachments/assets/7a8b1530-2780-4c4e-baf7-8e4e5f3bde5a" />
  <img width="1677" height="907" alt="Screenshot 2025-11-14 153456" src="https://github.com/user-attachments/assets/8095097e-646d-4da4-9e05-cd6e1aa0992b" />
  <img width="1702" height="875" alt="Screenshot 2025-11-14 153509" src="https://github.com/user-attachments/assets/dfca33d3-6287-43a9-9cd7-0a5732c30f0f" />
  <img width="1640" height="886" alt="Screenshot 2025-11-14 153526" src="https://github.com/user-attachments/assets/a9017215-4f05-402b-aef0-c6907665c7aa" />
  <img width="1909" height="908" alt="Screenshot 2025-11-14 153619" src="https://github.com/user-attachments/assets/428593cf-39f8-4147-9446-690aa00c42a3" />
  <img width="1687" height="880" alt="Screenshot 2025-11-14 153536" src="https://github.com/user-attachments/assets/1579703d-a067-4d13-b0e3-4c33dbb1bad3" />
</details>

## Tech Stack

### Frontend

- React 19
- Redux Toolkit (auth, cases, chat, judge, documents)
- React Router v7
- Tailwind CSS
- Axios
- React Virtuoso (virtualized rendering)
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

## How the System Works

### 1. Creating & Joining a Case

- User A logs in → creates a case → receives Case ID
- User B logs in from another device → joins using the same Case ID
- Both are assigned to Side A or Side B

### 2. Live Argument Submission

- Each message stores:
  - Case ID
  - Side (A/B)
  - Round number
  - Timestamp
- Frontend renders messages for the current round only
- Messages update instantly using periodic sync plus cached responses

### 3. Document Uploads

- Supports PDF and DOCX uploads
- Extracts text for AI analysis; stores metadata in MongoDB
- Listing uses `react-virtuoso` for smooth scrolling

### 4. Verdict Generation

- Either participant may request a verdict
- Gemini processes both sides’ arguments and document contents
- Produces a structured final decision and caches the result

## Project Structure

### Client

```text
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

```text
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

## Environment Variables

Create a .env file in both server/ and client/ before running.

### Server .env

```env
PORT=5000
MONGO_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
REDIS_URL=your_redis_cloud_url
```

### Client .env

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Where to get keys:
- MongoDB Atlas: create a free cluster and get your connection string
- Google OAuth Client ID: create OAuth 2.0 credentials in Google Cloud Console
- Gemini API Key: generate in Google AI Studio
- Redis Cloud URL: create a free Redis instance (or use local Redis)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Mohammedanees06/AI-Courtroom.git
cd AI-Courtroom
```

### 2. Configure Environment

Add the above .env files to server/ and client/ using your credentials.

### 3. Setup Server

```bash
cd server
npm install
node server.js
```

### 4. Setup Client

```bash
cd client
npm install
npm run dev
```

## Core Decisions & Optimizations

### Lazy Loading

Routes are loaded on demand to reduce initial bundle size and improve first paint.

### Pagination

Large lists (e.g., cases) are paginated to limit payload and improve responsiveness.

### Virtualized Rendering

`react-virtuoso` renders only visible items with support for variable sizes and smooth scrolling.

### Redis Caching

Caches case data, messages, and verdicts to reduce database load and accelerate responses.

### Redux Toolkit

Centralizes auth, parties/case data, chat messages, verdict state, and documents for predictable state management.

## Why This Project Stands Out

- Courtroom structure with clear discipline and round-based argument flow
- AI-assisted judgment using Gemini for structured verdicts
- Simple Case ID–based joining mechanism for quick collaboration
- Multi-device live sync with cached responses for speed
- Scalable, production-ready backend with MongoDB Atlas and Redis
- Robust use of virtualization and lazy loading on the frontend
- Secure authentication with OAuth + JWT

## Author

Mohammed Anees  
Full-Stack Developer (MERN & AI)

Portfolio: https://mohammedanees.netlify.app  
LinkedIn: https://www.linkedin.com/in/mohammedaneesdev  
GitHub: https://github.com/Mohammedanees06  
Email: Mohammedanees0606[at]gmail[dot]com

