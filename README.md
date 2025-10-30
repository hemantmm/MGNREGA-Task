# MGNREGA District Performance Tracker

## Setup Instructions

### 1. Get Government API Key
1. Visit https://data.gov.in/
2. Register for an account
3. Request API key for MGNREGA dataset
4. Copy your API key

### 2. Database Setup
```bash
# Install PostgreSQL (if not installed)
# On Mac: brew install postgresql
# On Ubuntu: sudo apt-get install postgresql

# Start PostgreSQL service
# On Mac: brew services start postgresql
# On Ubuntu: sudo service postgresql start

# Create database
createdb mgnrega_db
```

### 3. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp ../.env.example .env
# Edit .env and add your database credentials and API key

# Initialize database
npm run init-db

# Sync data from government API
npm run sync

# Start backend server
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

## API Endpoints

- `GET /api/districts` - Get all districts
- `GET /api/district/:districtCode` - Get district details
- `GET /api/performance/:districtCode` - Get performance data
- `GET /api/compare` - Compare all districts

## Data Sync

Run `npm run sync` in backend folder to fetch latest data from government API.

For production, set up a cron job to run sync daily:
```bash
0 2 * * * cd /path/to/backend && npm run sync
```

## Deployment

### VPS Deployment (DigitalOcean/AWS/Linode)

1. Install Node.js and PostgreSQL on VPS
2. Clone repository
3. Setup database and run migrations
4. Build frontend: `cd frontend && npm run build`
5. Serve frontend with nginx
6. Run backend with PM2: `pm2 start backend/index.js`
7. Setup SSL with Let's Encrypt

## Notes

- The app uses fallback data if government API is unavailable
- Data is cached in PostgreSQL for reliability
- Supports Hindi and English languages
- Mobile-responsive design for rural users
