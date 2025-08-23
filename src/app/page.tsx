"use client";

import { useState } from "react";
import { SiteHeader, TravelType } from "@/components/site-header";

// Domestic travel components.
import StatesTable from "@/components/domestic-travel/states-table";
import UsaMap from "@/components/domestic-travel/usa-map";

// International travel components.
import CountriesTable from "@/components/international-travel/countries-table";
import WorldMap from "@/components/international-travel/world-map";

interface USState {
  state_id: string;
  state_name: string;
  visited: boolean;
}

interface Country {
  country_id: string;
  country_name: string;
  continent: string;
  visited: boolean;
}

export default function Home() {
  const [travelType, setTravelType] = useState<TravelType>("Domestic");
  const [states, setStates] = useState<USState[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="h-[80px] flex-shrink-0">
        <SiteHeader travelType={travelType} setTravelType={setTravelType}/>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 p-4 flex flex-col">
          {travelType === "Domestic" ? (
            <StatesTable onStatesChange={setStates} />
          ) : (
            <CountriesTable onCountriesChange={setCountries} />
          )}
        </div>
        <div className="w-2/3 p-4 flex flex-col">
          <div className="h-full bg-white rounded-lg border border-gray-200 p-4 flex justify-center items-center">
            {travelType === "Domestic" ? (
              <UsaMap states={states} />
            ) : (
              <WorldMap countries={countries} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
