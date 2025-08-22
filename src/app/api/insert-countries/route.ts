import { NextResponse } from 'next/server';
import { Client } from 'pg';

const transformContinent = (region: string, subregion: string): string => {
  if (region === 'Americas') {
    return subregion === 'South America' ? 'South America' : 'North America';
  }
  return region;
};

export async function POST() {
  const res = await fetch('https://restcountries.com/v3.1/all?fields=name,region,subregion,cca2');
  const data = await res.json();

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  for (const country of data) {
    const cca2 = country.cca2;
    const name = country.name?.common;
    const continent = transformContinent(country.region, country.subregion);

    if (cca2 && name && continent) {
      await client.query(
        `INSERT INTO countries (country_id, country_name, continent)
         VALUES ($1, $2, $3)
         ON CONFLICT (country_id) DO UPDATE
         SET country_name = EXCLUDED.country, continent = EXCLUDED.continent`,
        [cca2, name, continent]
      );
    }
  }

  await client.end();

  return NextResponse.json({ message: 'Countries synced' });
}