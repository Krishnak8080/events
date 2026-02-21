# Sydney Events — MERN Stack Web Application
## Assignment 1 Report

---

### 1. Project Overview

This project is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that automatically scrapes public event listings from Sydney, Australia, stores them in a cloud database, and presents them through a modern, responsive user interface. The application also captures email leads and includes a Google OAuth-protected admin dashboard for event management.

**Live Deployment:**
- Frontend: https://events-nine-mauve.vercel.app
- Backend API: https://sydney-events-backend-pvr2.onrender.com
- Source Code: https://github.com/Krishnak8080/events

---

### 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), Tailwind CSS 3 |
| Backend | Node.js, Express.js 4 |
| Database | MongoDB Atlas (Mongoose 8 ODM) |
| Scraping | Axios + Cheerio |
| Authentication | Google OAuth 2.0 (Passport.js) |
| Scheduling | node-cron |
| Deployment | Vercel (frontend), Render (backend) |

---

### 3. Key Features Implemented

**Part A — Event Scraping & Auto Updates**
- Built three independent scrapers targeting Eventbrite Sydney, Meetup Sydney, and What's On Sydney using Axios for HTTP requests and Cheerio for HTML parsing.
- Implemented intelligent upsert logic that detects new events (status: `new`), identifies updates to existing events by comparing key fields (status: `updated`), and marks events no longer present on the source as `inactive`.
- Integrated node-cron to automatically run all scrapers every 6 hours. The schedule is configurable via environment variables. An immediate scrape runs on server startup.

**Part B — Public Event Listing Website**
- Designed a clean, dark-themed React frontend with glassmorphism aesthetics, gradient accents, micro-animations, and responsive layouts.
- Events are displayed as cards showing title, date/time, venue, short description, and source name, with a prominent "GET TICKETS" call-to-action button.
- The "GET TICKETS" button opens a modal that collects the user's email address, displays an opt-in consent checkbox, saves the lead (email + consent + event reference) to MongoDB, and then redirects the user to the original event URL.
- Implemented keyword search with debouncing and pagination for browsing large event collections.

**Part C — Google OAuth & Admin Dashboard**
- Implemented Google OAuth 2.0 login using Passport.js with session-based authentication stored in MongoDB via connect-mongo.
- The admin dashboard is a protected route — unauthenticated users see a login prompt.
- Dashboard features include: city filter (scalable beyond Sydney), keyword search across title/venue/description, date range filter, and status quick-filter pills for `new`, `updated`, `inactive`, and `imported`.
- Events are displayed in a sortable table with colored status badges. Clicking a row opens a slide-out preview panel showing full event details.
- Each event has an "Import to Platform" button that sets its status to `imported` and records `importedAt`, `importedBy` (Google user), and optional `importNotes`.
- A manual "Run Scraper" button allows admins to trigger scraping on demand.

---

### 4. Architecture & Data Flow

```
┌──────────────┐    Axios/Cheerio     ┌──────────────────┐
│ Event Sources │ ◄──── Scrapers ────► │   MongoDB Atlas   │
│ (Eventbrite,  │     (node-cron)      │  (Events, Leads)  │
│  Meetup, etc) │                      └────────┬─────────┘
└──────────────┘                                │
                                                │ Mongoose
                                    ┌───────────┴──────────┐
                                    │  Express.js Backend   │
                                    │  (REST API + OAuth)   │
                                    │  Hosted on Render     │
                                    └───────────┬──────────┘
                                                │ CORS + JSON
                                    ┌───────────┴──────────┐
                                    │   React Frontend      │
                                    │   (Vite + Tailwind)   │
                                    │   Hosted on Vercel    │
                                    └──────────────────────┘
```

The backend exposes RESTful API endpoints (`/api/events`, `/api/emails`, `/api/auth/*`, `/api/events/:id/import`) consumed by the React frontend. Authentication state is maintained through server-side sessions with cookies.

---

### 5. Challenges & Solutions

| Challenge | Solution |
|---|---|
| Port 5000 conflict on macOS (AirPlay) | Switched to port 5001 for local development |
| Frontend API calls failing in production | Created a centralized `config.js` using Vite's `VITE_API_URL` env variable to resolve the backend URL dynamically |
| Cross-origin cookie/session issues | Configured CORS with dynamic origin validation and proper `sameSite`/`secure` cookie settings |
| Eventbrite/What's On scraping yielded 0 results | These sites require JavaScript rendering; Cheerio parses static HTML only — documented as a known limitation upgradable to Puppeteer |

---

### 6. Conclusion

The application successfully meets all three parts of the assignment requirements. It demonstrates a production-ready MERN stack architecture with automated data collection, a polished user-facing interface, secure authentication, and a functional admin dashboard — all deployed and accessible online.
