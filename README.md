# MKAVS - Split Frontend & Backend

This project has been separated into a frontend and backend architecture for deployment on Vercel and Render.

## Project Structure

- `frontend/`: Static HTML/JS files and React admin app.
- `backend/`: Node.js/Express server logic and database models.

## Deployment Instructions

### Backend (Render)

1. Create a new "Web Service" on [Render](https://render.com/).
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add Environment Variables from `backend/.env`.
6. Set `ALLOWED_ORIGINS` to your Vercel URL.
7. Set `NODE_ENV` to `production`.

### Frontend (Vercel)

1. Create a new Project on [Vercel](https://vercel.com/).
2. Select the `frontend` folder as the root.
3. Build Command: `npm run build` (for the admin React app, if applicable, otherwise none).
4. For the static files, Vercel will handle them automatically.
5. Update `frontend/config.js` with your Render URL.

## Local Development

1. **Backend**:
   - `cd backend`
   - `npm install`
   - `npm start` (Runs on http://localhost:3000)

2. **Frontend**:
   - Open `frontend/index.html` or use a live server.
   - For Admin:
     - `cd frontend/admin`
     - `npm install`
     - `npm run dev`
