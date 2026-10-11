# AgriShare

AgriShare is a web-based agricultural marketplace designed to help farmers list crops and agricultural resources and help buyers discover available produce. It includes budget-based crop recommendations and a rule-based farming assistant.

## Features

- **User authentication:** Login and registration for farmer and buyer roles.
- **Crop marketplace:** Browse available crop listings and view details such as price, quantity, and location.
- **Smart crop recommendations:** Filters and ranks available crops using the buyer's budget, requested quantity, and optional crop preference.
- **Farming Assistant:** Provides prepared guidance for common questions about crops, soil, irrigation, pests, and fertilizers.
- **Orders and equipment features:** Use the crop-order and equipment features that are implemented in the current application.

> **AI/ML note:** The current crop recommendation feature is rule-based, and the Farming Assistant uses predefined responses. They do not currently use a trained machine-learning model or a generative AI API.

## Technology Stack

- **Frontend:** React, Vite, JavaScript
- **Backend:** Java, Spring Boot, Maven
- **Database:** MySQL
- **Authentication:** JWT-based authentication
- **API communication:** HTTP/JSON REST endpoints

## Project Structure

```text
Agrishare/
├── frontend/    # React + Vite application
└── backend/     # Spring Boot REST API
```

The exact internal folders may vary depending on the current project version.

## Prerequisites

Install the following before running the project:

- Node.js and npm
- Java JDK compatible with the project's Spring Boot configuration
- MySQL Server
- Git (for version control)

## Local Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Agrishare
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your repository URL.

### 2. Configure the database

Create a MySQL database:

```sql
CREATE DATABASE agrishare_db;
```

Configure the backend's database URL, username, and password in the backend configuration used by your project (for example, `application.properties` or environment variables).

Do not commit real database passwords or production credentials.

### 3. Start the backend

Open a terminal:

```powershell
cd backend
```

Set a local development JWT secret in the terminal. Use a private secret of at least 32 bytes and do not commit it:

```powershell
$env:JWT_SECRET = "REPLACE_WITH_A_PRIVATE_LOCAL_SECRET_OF_AT_LEAST_32_BYTES"
```

Run Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend is expected to run at `http://localhost:8080` if the project configuration uses port 8080.

If the Maven wrapper is unavailable, use the Maven command configured for your environment.

### 4. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. In the current development setup this has been `http://localhost:5174/`, but the port may differ if it is already in use.

## Important API Routes

The following routes are part of the current application setup:

- `POST /api/assistant/chat` — returns a prepared farming-assistant response.
- `GET /api/recommendations` — returns crop recommendations based on query parameters such as `budget` and `quantityKg`, with optional `cropName`.

Protected routes require a valid JWT bearer token. See the backend controller and security configuration for the complete list of routes and requirements.

## Testing Checklist

Before presenting or releasing the project, verify:

- [ ] Backend starts without compilation errors.
- [ ] Frontend starts and loads.
- [ ] Farmer and buyer login work.
- [ ] Crop listings load correctly.
- [ ] Crop recommendations handle valid and invalid inputs.
- [ ] Farming Assistant answers supported questions.
- [ ] Orders, stock updates, equipment, and bookings work where implemented.
- [ ] Protected endpoints reject unauthenticated or unauthorized requests.
- [ ] No secrets, tokens, or real user data are committed to the repository.

## Security Notes

- Never commit JWT secrets, database passwords, `.env` files containing credentials, access tokens, or production configuration.
- Use environment variables or an approved secret manager for secrets.
- Rotate any secret that has been exposed publicly.
- Configure production CORS, HTTPS, database access, and authentication settings before deployment.
- The local JWT secret used during development must not be reused as a production secret.

## Limitations and Future Improvements

- Replace the rule-based recommendation logic with a trained and evaluated ML model if machine-learning functionality is required.
- Connect the Farming Assistant to a language model only if desired and keep any provider API key on the backend.
- Add weather data, region-specific crop calendars, soil-test integration, and verified agricultural guidance.
- Add automated unit and integration tests for backend services and frontend flows.
- Add deployment configuration and database migrations for a production environment.

## Contributing

1. Create a branch for your change.
2. Make and test the change locally.
3. Review `git diff` to ensure secrets and unrelated files are not included.
4. Commit with a clear message and open a pull request if working with collaborators.

## License

Add a license file if you intend to distribute the project publicly. If no license is included, reuse and redistribution permissions are not explicitly granted.
