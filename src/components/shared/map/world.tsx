'use client';

import { useEffect, useState } from 'react';
// @ts-ignore
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import { MAP_FILL } from "@/lib/constants";

interface Country {
  country_id: string; // ISO Alpha-2 or Alpha-3
  country_name: string;
  visited: boolean;
}

interface WorldMapProps {
  countries: Country[];
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function WorldMap({ countries }: WorldMapProps) {
  const [visitedCcn3, setVisitedCcn3] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCcn3 = async () => {
      const visitedCountries = countries.filter(c => c.visited);
      const codes = visitedCountries.map(c => c.country_id).join(',');

      if (!codes) return;

      try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}`);
        const data = await res.json();

        const ccn3Set = new Set(
          data.map((c: any) => c.ccn3).filter(Boolean)
        );

        setVisitedCcn3(ccn3Set);
      } catch (error) {
        console.error('Failed to fetch country data:', error);
      }
    };

    fetchCcn3();
  }, [countries]);

  return (
    <ComposableMap projectionConfig={{ scale: 140 }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => {
            const countryId = geo.id; // This is the numeric id (e.g., 840 for USA)
            const isVisited = visitedCcn3.has(countryId);

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isVisited ? MAP_FILL : '#E0E0E0'}
                stroke="#FFFFFF"
                strokeWidth={0.5}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}