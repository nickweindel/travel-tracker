# Travel Tracker

A Next.js application for tracking travel experiences with PostgreSQL backend. Currently focused on tracking US states and countries/continents visited.

## Features

- PostgreSQL database for data persistence
- Docker containerization for easy deployment
- RESTful API endpoints for managing state and country visits
- TypeScript support
- Modern UI with Tailwind CSS
- Real-time KPI tracking with visit statistics
- Responsive design with scrollable state lists
- Maps to visualize travel

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd travel-tracker
   ```

2. **Start the application with Docker Compose**
   ```bash
   # Start development version (default)
   docker-compose up -d
   
   # Or start production version
   docker-compose --profile prod up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Database: localhost:5432
   - Database credentials: myuser/mypassword
   - Database name: personal_database

## Environment Variables

The application uses the following environment variables (configured in docker-compose.yml):

```env
# Database Configuration
DATABASE_URL=postgresql://myuser:mypassword@postgres:5432/personal_database

# Next.js Configuration
NODE_ENV=development
WATCHPACK_POLLING=true  # For development hot reload
```

## Database Schema

The application includes the following tables:

### us_states
- `state_id` (VARCHAR(2), PRIMARY KEY) - Two-letter state code (e.g., 'CA', 'NY')
- `state_name` (VARCHAR(14), NOT NULL) - Full state name (e.g., 'California', 'New York')

### states_visited
- `state_id` (VARCHAR(2), PRIMARY KEY, FOREIGN KEY) - References us_states.state_id
- `visited` (BOOLEAN, NOT NULL, DEFAULT FALSE) - Whether the state has been visited

### countries
- `country_id` (VARCHAR(2), PRIMARY KEY) - Two-letter country code (e.g. "MX", "NZ")
- `country_name` (VARCHAR(100), NOT NULL) - Full (common) country name (e.g. 'Mexico', 'New Zealand')
- `continent` (VARCHAR(13), NOT NULL) - Full continent name (this project uses 7 continents)

### countries_visited
- `country_id` (VARCHAR(2), PRIMARY KEY, FOREIGN KEY) - References countries.country_id
- `visited` (BOOLEAN, NOT NULL, DEFAULT FALSE) - Whether the country has been visited

The database is pre-populated with all 50 US states. 

Upon `docker compose up --build`, the database is populated with country names.

## API Endpoints

### States Management
- `GET /api/get-states` - Get all US states with visit status
  - Returns: Array of states with `state_id`, `state_name`, and `visited` boolean
  - Example response:
    ```json
    [
      {
        "state_id": "CA",
        "state_name": "California",
        "visited": true
      }
    ]
    ```

### Country Management
- `GET /api/get-countries` - Get all countries of the world (plus some other places, like Antarctica) with visit status
   - Returns: Array of states with `country_id` (ISO-2), `country_name`, `continent`, and `visited` boolean
   - Example response: 
     ```json
     [
      { 
         "country_id": "MX",
         "country_name": "Mexico",
         "continent": "North America",
         "visited": true
      }
     ]
     ```

### Visit Status Management
- `POST /api/toggle-state-visit` - Toggle visit status for a state
  - Body: `{ "stateId": "CA", "visited": true }`
  - Returns: `{ "success": true }`

- `POST /api/toggle-country-visit` - Toggle visit status for a country
  - Body: `{ "countryId": "US", "visited": true}`
  - Returns: `{ "success": true }`

### Get Country List
- `POST /api/insert-states` - Hit [REST countries API](https://restcountries.com/) to get list of countries and insert into Postgres database
 - Returns: `{ "messages": "Countries synced" }`

## External API References
In addition to the list of countries from [REST countries API](https://restcountries.com/v3.1/all), this project also hits the code [endpoint](https://restcountries.com/v.3.1/alpha?codes={code}) to get the three-digit numerical code needed to fill in the world map.

## Development

### Local Development (without Docker)

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database configuration
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

### Database Management

The PostgreSQL database is automatically initialized with:
- All 50 US states
- List of 250 countries and other territories, geographical areas
- Database schema with foreign key constraints
- Automatic visit status tracking

### Docker Commands

```bash
# Start all services (development)
docker-compose up -d

# Start production version
docker-compose --profile prod up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Remove volumes (this will delete all data)
docker-compose down -v
```

## Project Structure

```
travel-tracker/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   │   ├── get-countries/ # Countries API endpoint
│   │   │   └── get-states/ # States API endpoint
|   |   |   └── insert-countries/ # Insert countries into Postgres database
|   |   |   └── toggle-state-visit/ # Visit status API endpoint for states
|   |   |   └── toggle-country-visit/ # Visit status API endpoint for countries
│   │   └── ...
│   ├── components/         # React components
|   |   ├── domestic-travel # Components specific to domestic travel
|   |   |   └── states-table.tsx # States list with checkboxes
│   │   |   └── usa-map.tsx  # Map of USA where states are filled if they've been visited
|   |   ├── international-travel # Components specific to international travel
|   |   |   └── states-table.tsx # Countries list with checkboxes
│   │   |   └── world-map.tsx  # World map where countries are filled if they've been visited
|   |   ├── site-header.tsx # Website name with switcher between displaying international and domestic travel
|   |   ├── switcher.tsx # Switcher component to swap various states throughout the app
|   |   ├── visit-kpis.tsx # Component to show count of visited places: can be used for states, countries, or continents
│   │   └── ...
│   ├── lib/
│   │   └── db.ts          # Database utilities
|   |   └── utils.ts       # Handle tailwind conflicts
│   └── ...
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile             # Production Docker image
├── Dockerfile.dev         # Development Docker image
├── Dockerfile.sync        # Runs country sync
├── init.sql              # Database initialization script
└── ...
```

## Current Features

- **State Tracking**: Check/uncheck states to mark them as visited
- **Real-time KPIs**: View visited count, not visited count, and percentage
- **Persistent Storage**: Visit status persists across sessions
- **Responsive Design**: Works on desktop and mobile devices
- **Database Integration**: PostgreSQL backend with proper foreign key relationships

## Troubleshooting

### Database Connection Issues

1. Check if PostgreSQL container is running:
   ```bash
   docker-compose ps
   ```

2. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

3. Test database connection:
   ```bash
   curl http://localhost:3000/api/get-states
   ```

### Port Conflicts

The application uses:
- Port 3000: Next.js application (both dev and prod)
- Port 5432: PostgreSQL database

If these ports are already in use, you can modify the `docker-compose.yml` file to use different ports.

### Container Name Conflicts

If you get container name conflicts, remove existing containers:
```bash
docker-compose down
docker rm -f travel-tracker-app-dev travel-tracker-postgres
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT
