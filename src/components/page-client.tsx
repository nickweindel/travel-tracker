"use client";

import { useState, useEffect } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { Selector } from "@/components/shared/selector";
import { Skeleton } from "@/components/ui/skeleton";
import UsaMap from "@/components/shared/map/usa";
import { VisitTable } from "@/components/shared/visit-table";
import { VisitKpi } from "@/components/shared/visit-kpis";
import WorldMap from "@/components/shared/map/world";

import { ContinentKpi } from "@/types/continents";
import { CountryVisit, CountryKpi } from "@/types/countries";
import { StateVisit, StateKpi } from "@/types/states";

export default function PageClient({ user }: { user: any }) {
  const [internationalOrDomestic, setInternationalOrDomestic] = useState("Domestic");
  const [countryOrContinent, setCountryOrContinent] = useState("Country");
  const [statesOrCountries, setStatesOrCountries] = useState<"states" | "countries">("states");
  const [visitKpiDimension, setVisitKpiDimension] = useState<"states" | "countries" | "continents">("states");
  const [visitData, setVisitData] = useState<StateVisit[] | CountryVisit[]>([]);
  const [kpiData, setKpiData] = useState<StateKpi | CountryKpi | ContinentKpi | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to fetch state or country visit data.
  const fetchVisits = async () => {
    const visitLocation = internationalOrDomestic === "Domestic" ? "states" : "countries";

    setStatesOrCountries(visitLocation);

    try {
      setIsLoading(true);
      const response = await fetch(`api/${visitLocation}?user=${user}`);
      const data = await response.json();
      if (response.ok) {
        const visitData = data.visits;
        setVisitData(visitData);
      } else {
        console.error(`Error fetching ${statesOrCountries}:`, data.error);
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [internationalOrDomestic]);

  // Function to fetch visit KPIs.
  const fetchVisitKpis = async () => {
    const dimension = statesOrCountries === "states" ? "states" 
      : countryOrContinent === "Country" ? "countries" : "continents";

    setVisitKpiDimension(dimension);

    try {
      setIsLoading(true);
      const response = await fetch(`api/${dimension}/kpi?user=${user}`);
      const data = await response.json();
      if (response.ok) {
        const kpiData = data.kpis;
        setKpiData(kpiData);
      } else {
        console.error(`Error fetching KPIs:`, data.error);
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitKpis();
  }, [internationalOrDomestic, countryOrContinent, visitData, visitKpiDimension, statesOrCountries]);

  return (
    <div className="flex flex-col h-screen">
      <PageHeader user={user} />
      <div className="flex flex-row gap-3 p-3 justify-end">
        {internationalOrDomestic === "International" && (
          <Selector 
            category="countryOrContinent"
            value={countryOrContinent}
            onValueChange={setCountryOrContinent} />
        )}
        <Selector 
          category="internationalOrDomestic"
          value={internationalOrDomestic}
          onValueChange={setInternationalOrDomestic} />
      </div>
      <div className="flex flex-row gap-3 p-3 flex-1 overflow-hidden">

        <div className="w-[33%] overflow-y-auto scrollbar-hidden">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <div className="flex flex-col gap-3">
              <VisitKpi 
                visitKpiDimension={visitKpiDimension}
                visitedValue={kpiData?.[`${visitKpiDimension}_visited` as keyof (StateKpi | CountryKpi | ContinentKpi)]}
                notVisitedValue={kpiData?.[`${visitKpiDimension}_not_visited` as keyof (StateKpi | CountryKpi | ContinentKpi)]} />
              {statesOrCountries === "states" ? (
                <VisitTable 
                  location="states" 
                  data={visitData as StateVisit[]} 
                  user={user}
                  fetchVisits={fetchVisits} />
              ) : (
                <VisitTable 
                  location="countries" 
                  data={visitData as CountryVisit[]} 
                  user={user}
                  fetchVisits={fetchVisits} />
              )}
            </div>
          )}
        </div>
        <div className="w-[67%] h-full">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <div className="w-full h-full border rounded">
              {statesOrCountries === "states" ? (
                  <UsaMap states={visitData as StateVisit[]} />
              ) : (
                  <WorldMap countries={visitData as CountryVisit[]} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}