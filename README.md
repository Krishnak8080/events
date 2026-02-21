# 🌏 Sydney Events — MERN Stack Web Application

A full-stack web application that automatically scrapes events from multiple Sydney event sources, displays them in a modern React UI with email lead capture, and provides a Google OAuth-protected admin dashboard for event management.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![Tech Stack](https://img.shields.io/badge/Node.js-Express-green) ![Tech Stack](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen) ![Tech Stack](https://img.shields.io/badge/Auth-Google%20OAuth-red)

---

## 📋 Features

### Part A — Event Scraping + Auto Updates
- Scrapers for **Eventbrite Sydney**, **Meetup Sydney**, and **What's On Sydney**
- Automatic scraping via **node-cron** (configurable schedule)
- Smart status tracking: `new`, `updated`, `inactive`, `imported`
- Duplicate detection via source URL indexing

### Part B — Public Event Listing
- Modern dark-mode UI with glassmorphism design
- Responsive event card grid with search & pagination
- **"GET TICKETS"** button → email capture modal → redirect to original event URL
- Email opt-in consent checkbox stored in MongoDB

### Part C — Admin Dashboard
- **Google OAuth 2.0** login (Passport.js)
- Protected dashboard with:
  - City filter, keyword search, date range filter, status filter
  - Sortable event table with status badges
  - Slide-out preview panel with full event details
  - **"Import to Platform"** button per event
  - Manual scrape trigger button

---

## 🏗️ Project Structure

```
Assignment/
├── server/                    # Express.js backend
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── passport.js        # Google OAuth strategy
│   ├── models/
│   │   ├── Event.js           # Event schema
│   │   └── EmailLead.js       # Email lead schema
│   ├── scrapers/
│   │   ├── eventbrite.js      # Eventbrite scraper
│   │   ├── meetup.js          # Meetup scraper
│   │   └── whatson.js         # What's On Sydney scraper
│   ├── routes/
│   │   ├── events.js          # Events API
│   │   ├── emails.js          # Email capture API
│   │   ├── auth.js            # Google OAuth routes
│   │   └── import.js          # Import actions
│   ├── middleware/
│   │   └── auth.js            # Auth guard
│   ├── cron/
│   │   └── scheduler.js       # Cron scheduler
│   ├── server.js              # Express entry point
│   ├── package.json
│   └── .env.example
├── client/                    # React (Vite) frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page views (Home, Dashboard)
│   │   ├── App.jsx            # Root component with routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Google Cloud Console** project with OAuth 2.0 credentials

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
cp .env.example .env   # Edit with your credentials
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Edit `server/.env` with your values:

```env
MONGODB_URI=mongodb://localhost:27017/sydney-events
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_random_secret
CRON_SCHEDULE=0 */6 * * *
CLIENT_URL=http://localhost:5173
PORT=5000
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google+ API** / **People API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Authorized redirect URI** to: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to your `.env` file

### 4. Run the Application

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 📡 API Endpoints

| Method | Endpoint                    | Description                    | Auth |
|--------|-----------------------------|--------------------------------|------|
| GET    | `/api/events`               | List events (filters, pagination) | No   |
| GET    | `/api/events/:id`           | Get single event               | No   |
| POST   | `/api/emails`               | Save email lead                | No   |
| GET    | `/api/auth/google`          | Initiate Google OAuth          | No   |
| GET    | `/api/auth/google/callback` | OAuth callback                 | No   |
| GET    | `/api/auth/user`            | Get current user               | No   |
| GET    | `/api/auth/logout`          | Logout                         | No   |
| PUT    | `/api/events/:id/import`    | Import event to platform       | Yes  |
| POST   | `/api/scrape`               | Trigger manual scrape          | No   |
| GET    | `/api/health`               | Health check                   | No   |

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite 5, Tailwind CSS 3    |
| Backend    | Node.js, Express 4                  |
| Database   | MongoDB, Mongoose 8                 |
| Scraping   | Axios, Cheerio                      |
| Auth       | Google OAuth 2.0, Passport.js       |
| Scheduler  | node-cron                           |
| Sessions   | express-session + connect-mongo     |

---

## 📝 License

This project is for educational/assignment purposes.
