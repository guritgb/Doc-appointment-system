# Doc Appointment System

<!-- final commit -->

Doc Appointment System is a MERN-stack application that lets patients browse doctors, schedule appointments, and manage upcoming visits through a responsive web interface.

Here is the live demo: https://doc-appointment-system-wanc.onrender.com

## Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```
   This installs both backend and frontend packages via workspaces.
2. **Configure environment**
   - Create `.env` files for both `server/` and `client/` (copy from provided `.env.example` if available).
   - Supply MongoDB URI, JWT secret, and any third-party API keys.
3. **Run development servers**
   ```bash
   npm run dev
   ```
   This uses `concurrently` to launch backend (`server/`) and frontend (`client/`) together.
4. **Build for production (optional)**
   ```bash
   npm run build
   npm run start
   ```

## Tech Stack Used

- **Frontend:** React, React Router, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **State & Auth:** JWT-based auth, Redux Toolkit (if enabled)
- **Tooling:** Vite, Concurrently, ESLint, Prettier
