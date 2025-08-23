import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for local development
});

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Execute a query with parameters
export async function query(text: string, params?: any[]): Promise<any> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Close the pool (call this when shutting down the app)
export async function closePool(): Promise<void> {
  await pool.end();
}

// Database types
export interface USState {
  state_id: string;
  state_name: string;
}

export interface StateWithVisitStatus {
  state_id: string;
  state_name: string;
  visited: boolean;
}

export interface Country {
  country_id: string;
  country_name: string;
  continent: string;
}

export interface CountryWithVisitStatus {
  country_id: string;
  country_name: string;
  continent: string;
  visited: boolean; 
}

// Database operations
export const db = {
  // Get all US states with visit status
  async getAllStatesWithVisitStatus(): Promise<StateWithVisitStatus[]> {
    const result = await query(`
      SELECT 
        states.state_id, 
        states.state_name, 
        COALESCE(visited.visited, FALSE) as visited
      FROM us_states states 
      LEFT JOIN states_visited visited ON states.state_id = visited.state_id 
      ORDER BY states.state_name
    `);
    return result.rows.map((row: any) => ({
      ...row,
      visited: Boolean(row.visited)
    }));
  },

  // Get all countries/continents with visit status
  async getAllCountriesWithVisitStatus(): Promise<CountryWithVisitStatus[]> {
    const result = await query(`
      SELECT 
        countries.country_id, 
        countries.country_name,
        countries.continent, 
        COALESCE(visited.visited, FALSE) as visited
      FROM countries countries 
      LEFT JOIN countries_visited visited ON countries.country_id = visited.country_id 
      ORDER BY countries.country_name
    `);
    return result.rows.map((row: any) => ({
      ...row,
      visited: Boolean(row.visited)
    }));
  },

  // Toggle visit status for a state
  async toggleStateVisitStatus(stateId: string, visited: boolean): Promise<void> {
    // Use UPSERT (INSERT ... ON CONFLICT) to handle both insert and update
    await query(`
      INSERT INTO states_visited (state_id, visited) 
      VALUES ($1, $2) 
      ON CONFLICT (state_id) 
      DO UPDATE SET visited = $2
    `, [stateId, visited ? 1 : 0]);
  },

  // Toggle visit status for a country
  async toggleCountryVisitStatus(countryId: string, visited: boolean): Promise<void> {
    // Use UPSERT (INSERT ... ON CONFLICT) to handle both insert and update
    await query(`
      INSERT INTO countries_visited (country_id, visited) 
      VALUES ($1, $2) 
      ON CONFLICT (country_id) 
      DO UPDATE SET visited = $2
    `, [countryId, visited ? 1 : 0]);
  },

  // Get all US states (legacy method)
  async getAllStates(): Promise<USState[]> {
    const result = await query('SELECT * FROM us_states ORDER BY state_name');
    return result.rows;
  },

  // Get all countries (legacy method)
  async getAllCountries(): Promise<Country[]> {
    const result = await query('SELECT * FROM countries ORDER BY country_name');
    return result.rows
  }
};
