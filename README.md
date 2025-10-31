# MGNREGA District Performance Tracker

## Setup Instructions

### 1. Get Government API Key
1. Visit https://data.gov.in/
2. Register for an account
3. Request API key for MGNREGA dataset
4. Copy your API key

### 2. Database Setup
```bash

# Create database
createdb mgnrega_db
```

### 3. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp ../.env.example .env

npm run init-db

npm run sync

npm start
```

### 4. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm start
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Data Sync

Run `npm run sync` in backend folder to fetch latest data from government API.

For production, set up a cron job to run sync daily:
```bash
cd /path/to/backend && npm run sync
```

## Deployment

### Using Vercel deployed

## Notes

- The app uses fallback data if government API is unavailable
- Data is cached in PostgreSQL for reliability
- Supports Hindi and English languages
- Mobile-responsive design for rural users
