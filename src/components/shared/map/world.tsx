"use client";

import { useEffect, useState } from "react";
// @ts-ignore
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { MAP_VISITED_FILL, MAP_ONLY_AIRPORT_FILL } from "@/lib/constants";

interface Country {
  country_id: string; // ISO Alpha-2 or Alpha-3
  country_name: string;
  visited: boolean;
  only_airport?: boolean; // Add this
}

interface WorldMapProps {
  countries: Country[];
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap({ countries }: WorldMapProps) {
  const [visitedCcn3, setVisitedCcn3] = useState<Set<string>>(new Set());
  const [airportOnlyCcn3, setAirportOnlyCcn3] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const fetchCcn3 = async () => {
      const visitedCountries = countries.filter((c) => c.visited);
      const onlyAirportCountries = countries.filter((c) => c.only_airport);

      const visitedCodes = visitedCountries.map((c) => c.country_id).join(",");
      const airportCodes = onlyAirportCountries
        .map((c) => c.country_id)
        .join(",");

      if (!visitedCodes && !airportCodes) return;

      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/alpha?codes=${[
            visitedCodes,
            airportCodes,
          ]
            .filter(Boolean)
            .join(",")}`,
        );
        const data = await res.json();

        const visitedSet = new Set<string>(
          data
            .filter((c: any) =>
              visitedCountries.some(
                (v) => v.country_id === c.cca2 || v.country_id === c.cca3,
              ),
            )
            .map((c: any) => c.ccn3)
            .filter(Boolean),
        );

        const airportSet = new Set<string>(
          data
            .filter((c: any) =>
              onlyAirportCountries.some(
                (v) => v.country_id === c.cca2 || v.country_id === c.cca3,
              ),
            )
            .map((c: any) => c.ccn3)
            .filter(Boolean),
        );

        setVisitedCcn3(visitedSet);
        setAirportOnlyCcn3(airportSet);
      } catch (error) {
        console.error("Failed to fetch country data:", error);
      }
    };

    fetchCcn3();
  }, [countries]);

  return (
    <ComposableMap projectionConfig={{ scale: 140 }}>
      <Geographies geography={geoUrl}>
        {({ geographies }: { geographies: any[] }) =>
          geographies.map((geo: any) => {
            const countryId = geo.id; // numeric id (e.g., 840 for USA)
            let fillColor = "#E0E0E0";

            if (visitedCcn3.has(countryId)) fillColor = MAP_VISITED_FILL;
            else if (airportOnlyCcn3.has(countryId))
              fillColor = MAP_ONLY_AIRPORT_FILL;

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fillColor}
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
