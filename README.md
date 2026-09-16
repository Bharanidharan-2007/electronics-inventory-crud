# Electronics Component Inventory Management System

A full-stack CRUD web application for managing electronics components inventory. 

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Axios, Lucide React
- **Backend**: Python, Flask, Flask-SQLAlchemy, Flask-Cors
- **Database**: SQLite

## Folder Structure
```
/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ app.py              # Flask application and API endpoints
â”‚   â”œâ”€â”€ models.py           # SQLAlchemy database models
â”‚   â””â”€â”€ requirements.txt    # Python dependencies
â”œâ”€â”€ src/                    # Frontend React app
â”‚   â”œâ”€â”€ components/         # React UI components
â”‚   â”œâ”€â”€ api.ts              # Axios API client
â”‚   â”œâ”€â”€ types.ts            # TypeScript interfaces
â”‚   â”œâ”€â”€ App.tsx             # Main application component
â”‚   â””â”€â”€ main.tsx            # React DOM entry point
â”œâ”€â”€ package.json            # Node.js dependencies and scripts
â”œâ”€â”€ vite.config.ts          # Vite configuration and backend proxy setup
â”œâ”€â”€ API_DOCS.md             # API Documentation and ER Diagram
â”œâ”€â”€ TESTING.md              # Manual test cases
â”œâ”€â”€ PROJECT_REPORT.md       # Project report
â””â”€â”€ postman_collection.json # Importable Postman collection for API testing
```

## Setup Instructions

### 1. Backend Setup
1. Ensure you have Python 3 and `pip` installed.
2. Navigate to the project root and install backend dependencies:
   ```bash
   pip3 install -r backend/requirements.txt
   ```
*(Note: If you encounter an externally managed environment error, you can use `pip3 install --break-system-packages -r backend/requirements.txt` or use a `venv`.)*

### 2. Frontend Setup
1. Ensure you have Node.js and `npm` installed.
2. Install frontend dependencies:
   ```bash
   npm install
   ```

## How to Run

### Development Mode
To run both the Vite frontend (port 3000) and the Flask backend (port 5000) simultaneously with proxying:
```bash
npm run dev
```

### Production Mode
To build the frontend and serve it using Flask on port 3000:
```bash
npm run build
npm start
```
