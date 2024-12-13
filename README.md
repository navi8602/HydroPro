
# HydroPro - Setup Instructions

## Prerequisites
1. Node.js (v20.x or later)
2. PostgreSQL (v16.x)
3. npm (comes with Node.js)

## Database Setup
1. Install PostgreSQL and create a database named 'hydropro':
```sql
CREATE DATABASE hydropro;
```

## Project Setup
1. Clone or download the project
2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hydropro?schema=public"
```

4. Start the development server:
```bash
npm run dev
```

The application will start at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3003

## Available Scripts
- `npm run frontend` - Runs only the frontend
- `npm run backend` - Runs only the backend
- `npm run dev` - Runs both frontend and backend concurrently

## Note
Make sure PostgreSQL service is running before starting the application.
