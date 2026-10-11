# AgriShare 🌱

**An Agricultural Marketplace Connecting Farmers and Buyers**

## About the Project

AgriShare is a web application designed to help farmers and buyers connect through an online agricultural marketplace. It provides crop listings, smart crop recommendations, and a farming assistant to help users access agricultural information.

## Features

- **User Authentication:** Registration and login with JWT-based authentication.
- **Crop Marketplace:** Browse available crops and their details.
- **Smart Crop Recommendations:** Find suitable crop listings based on budget, quantity, and optional crop name.
- **Farming Assistant:** Get predefined, rule-based answers to common farming questions.
- **Crop Orders:** Support for crop purchasing workflows.
- **Equipment Rentals:** Support for agricultural equipment rental workflows.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Java, Spring Boot |
| Database | MySQL |
| Authentication | JWT |
| API Communication | REST APIs |

## Project Structure

```text
Agrishare/
├── backend/
├── frontend/
├── README.md
└── .gitignore
```

## Prerequisites

Install the following before running the project:

- Java and Maven (or use the included Maven Wrapper)
- Node.js and npm
- MySQL Server

## How to Run

### 1. Set Up the Database

Start MySQL and create the database:

```sql
CREATE DATABASE agrishare_db;
```

Configure the database connection in the backend application settings using your own MySQL username and password.

### 2. Start the Backend

Open a terminal in the project folder and run:

```powershell
cd backend
$env:JWT_SECRET = "REPLACE_WITH_A_LONG_RANDOM_SECRET"
.\mvnw.cmd spring-boot:run
```

Use a secure, private secret for local development. Never commit real secrets to GitHub.

### 3. Start the Frontend

Open a second terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

## Production Deployment

- Deploy the backend to a publicly reachable HTTPS URL.
- Set the Vercel frontend environment variable `VITE_API_URL` to that backend's base URL (for example, `https://your-backend.example.com`, without `/api`), then redeploy the frontend.
- Set the backend environment variable `CORS_ALLOWED_ORIGINS` to the frontend origin, such as `https://agrishare-tau.vercel.app`. Separate multiple origins with commas.

## Important Notes

- Crop recommendations currently use rule-based filtering and ranking.
- The Farming Assistant uses predefined responses and is not a generative AI chatbot.
- Database configuration, JWT secrets, and other credentials must be configured securely.
- Check the backend configuration for the required database settings before starting the application.

## Future Enhancements

- Integrate weather and crop-price information.
- Add multilingual support for farmers.
- Improve recommendation logic using agricultural data.
- Deploy the application to a production environment.

## Author

AgriShare Project Team