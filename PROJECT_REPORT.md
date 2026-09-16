# PROJECT REPORT

## Title
Electronics Component Inventory Management System

## Problem Statement
Managing a physical inventory of electronic components (resistors, capacitors, microcontrollers) requires keeping track of categories, exact quantities, and physical storage locations. Without a digital inventory system, hobbyists and engineers may lose track of parts, purchase duplicates, or struggle to locate components in their workspace.

## Objectives
- Build a full-stack CRUD application to digitally track electronic components.
- Enforce data integrity (prevent duplicates using a unique name/category pair, ensure non-negative stock counts).
- Provide a responsive, searchable, and filterable frontend interface.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Axios, Lucide React
- **Backend**: Python, Flask, Flask-SQLAlchemy, Flask-Cors
- **Database**: SQLite

## Architecture Overview
The application uses a separated client-server architecture:
- The **backend** is a Python Flask REST API connected to a local SQLite database via SQLAlchemy. It performs data validation and constraints enforcement (e.g., uniqueness).
- The **frontend** is a React single-page application that consumes the REST API using Axios. It uses Tailwind CSS for styling and manages modal dialogs for item creation, updating, and deletion.
- In **development mode**, the frontend (Vite) and backend (Flask) run concurrently, with Vite proxying `/api` requests to Flask.
- In **production mode**, the Vite app is built statically, and the Flask app serves the static `dist/` directory at its root, exposing both the web interface and API from a single server port.

## CRUD Implementation Summary
- **Create**: Components are added via a modal form. The backend validates required fields, enforces `quantity >= 0`, and checks for `name`+`category` duplicates via SQL constraints.
- **Read**: Components are fetched on page load. A search bar and category dropdown allow client-side filtering. Individual component fetching is supported by the API.
- **Update**: Users can edit components via the same modal form. The backend securely updates only the provided fields in the PUT request.
- **Delete**: Users can delete components, prompted by a confirmation modal to prevent accidental data loss.

## Challenges & Solutions
- **Windows environment variable syntax**: The default `npm run dev` script used Unix-style syntax (`PORT=5000 python3 backend/app.py`), which failed on Windows with a "'PORT' is not recognized" error. Solved by running the Flask backend in a separate terminal (`python app.py`) without the inline environment variable, while the frontend ran independently via Vite.
- **Postman base URL mismatch**: The generated Postman collection's `baseUrl` variable was set to `http://localhost:3000` (the frontend's port) instead of `http://localhost:5000` (the actual Flask API port), causing all requests to fail to connect. Fixed by updating the collection's `baseUrl` variable to point to the correct backend port.
- **File naming after zip download**: Downloading the repository as a zip from GitHub caused configuration files such as `.gitignore` and `.env.example` to lose their leading dot (appearing as `_gitignore` and `_env.example`). Solved by manually renaming these files after extraction, restoring their intended function.
- **Local folder not linked to the correct Git repository**: The working folder had a leftover Git remote pointing to an unrelated project from a previous session. This was identified by running `git remote -v` before pushing, and corrected by removing the incorrect remote and re-adding the correct repository URL before committing and pushing the final code.

## Future Enhancements
- User Authentication (Login/Register) to secure the API.
- Add "Low Stock" alerts when a component's quantity drops below a threshold.
- Ability to attach reference images or datasheets (PDFs) to components.
- Export inventory to CSV or PDF for offline auditing.