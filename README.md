# Travel Tracker

A Next.js application for tracking travel experiences with PostgreSQL backend.

## Features

- PostgreSQL database for data persistence
- Docker containerization for easy deployment
- RESTful API endpoints for managing trips and locations
- TypeScript support
- Modern UI with Tailwind CSS

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
   # Start production version
   docker-compose up -d
   
   # Or start development version with hot reload
   docker-compose --profile dev up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000 (production) or http://localhost:3001 (development)
   - Database: localhost:5432
   - Health check: http://localhost:3000/api/health

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/travel_tracker

# Next.js Configuration
NODE_ENV=development
```

## Database Schema

The application includes the following tables:

- **users**: User accounts
- **trips**: Travel trips
- **locations**: Places visited during trips

## API Endpoints

### Health Check
- `GET /api/health` - Check application and database health

### Trips
- `GET /api/trips?userId=<id>` - Get all trips for a user
- `POST /api/trips` - Create a new trip
- `GET /api/trips/[id]` - Get a specific trip
- `PUT /api/trips/[id]` - Update a trip
- `DELETE /api/trips/[id]` - Delete a trip

### Locations
- `GET /api/locations?tripId=<id>` - Get all locations for a trip
- `POST /api/locations` - Create a new location
- `GET /api/locations/[id]` - Get a specific location
- `PUT /api/locations/[id]` - Update a location
- `DELETE /api/locations/[id]` - Delete a location

## Development

### Local Development (without Docker)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database configuration
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Management

The PostgreSQL database is automatically initialized with:
- Sample user data
- Database schema
- Indexes for performance
- Triggers for automatic timestamp updates

### Docker Commands

```bash
# Start all services
docker-compose up -d

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
│   │   └── ...
│   ├── lib/
│   │   └── db.ts          # Database utilities
│   └── ...
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile             # Production Docker image
├── Dockerfile.dev         # Development Docker image
├── init.sql              # Database initialization script
└── ...
```

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
   curl http://localhost:3000/api/health
   ```

### Port Conflicts

If ports 3000, 3001, or 5432 are already in use, you can modify the `docker-compose.yml` file to use different ports.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT
