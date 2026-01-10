// TODO: implement some more logic for loading
// If switching between international and domestic, set everything to loading.
// If switching between states and national parks, set table and KPIs to loading (not map).
// If switching between countries and continents set KPIs to loading (not table or map).

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
import { ParkVisit, ParkKpi } from "@/types/parks";

export default function PageClient({ user }: { user: any }) {
  const [internationalOrDomestic, setInternationalOrDomestic] = useState("Domestic");
  const [countryOrContinent, setCountryOrContinent] = useState("Country");
  const [stateOrPark, setStateOrPark] = useState("State");
  const [visitKpiDimension, setVisitKpiDimension] = useState<"states" | "countries" | "continents" | "national_parks">("states");
  const [tableVisitData, setTableVisitData] = useState<StateVisit[] | CountryVisit[] | ParkVisit[]>([]);
  const [mapVisitData, setMapVisitData] = useState<StateVisit[] | CountryVisit[]>([]);
  const [kpiData, setKpiData] = useState<StateKpi | CountryKpi | ContinentKpi | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTableVisitData = async () => {
    const visitLocation =
      internationalOrDomestic === "Domestic"
        ? stateOrPark === "State" ? "states" : "national_parks"
        : "countries";
  
    const response = await fetch(`api/${visitLocation}?user=${user}`);
    const data = await response.json();
    return data.visits;
  };
  
  const fetchMapVisitData = async () => {
    const visitLocation =
      internationalOrDomestic === "Domestic" ? "states" : "countries";
  
    const response = await fetch(`api/${visitLocation}?user=${user}`);
    const data = await response.json();
    return data.visits;
  };
  
  const fetchVisitKpiData = async () => {
    const dimension =
      internationalOrDomestic === "Domestic"
        ? stateOrPark === "State"
          ? "states"
          : "national_parks"
        : countryOrContinent === "Country"
        ? "countries"
        : "continents";
  
    const response = await fetch(`api/${dimension}/kpi?user=${user}`);
    const data = await response.json();
    return data.kpis;
  };
  
  // Refresh everything with a loading skeleton.
  useEffect(() => {
    let cancelled = false;
  
    const run = async () => {
      setIsLoading(true);
  
      try {
        const [table, map, kpi] = await Promise.all([
          fetchTableVisitData(),
          fetchMapVisitData(),
          fetchVisitKpiData(),
        ]);
  
        if (!cancelled) {
          setTableVisitData(table);
          setMapVisitData(map);
          setKpiData(kpi);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
  
    run();
    return () => { cancelled = true; }
  }, [
    internationalOrDomestic,
    stateOrPark,
    countryOrContinent
  ]);

  // Change the visit KPI dimension.
  useEffect(() => {
    if (internationalOrDomestic === "Domestic") {
      if (stateOrPark === "State") {
        setVisitKpiDimension("states");
      } else {
        setVisitKpiDimension("national_parks");
      }
    } else {
      if (countryOrContinent === "Country") {
        setVisitKpiDimension("countries");
      } else {
        setVisitKpiDimension("continents");
      }
    }
  }, [internationalOrDomestic, stateOrPark, countryOrContinent]);

  // Refresh everything but do not show a loading skeleton. 
  const silentRefreshAll = async () => {
    const [table, map, kpi] = await Promise.all([
      fetchTableVisitData(),
      fetchMapVisitData(),
      fetchVisitKpiData(),
    ]);
  
    setTableVisitData(table);
    setMapVisitData(map);
    setKpiData(kpi);
  };
  

  return (
    <div className="flex flex-col h-screen">
      <PageHeader user={user} />
      <div className="flex flex-row gap-3 p-3 justify-end">
        {internationalOrDomestic === "International" ? (
          <Selector 
            category="countryOrContinent"
            value={countryOrContinent}
            onValueChange={setCountryOrContinent} />
        ) : 
          <Selector
            category="stateOrPark"
            value={stateOrPark}
            onValueChange={setStateOrPark} />
        }
        <Selector 
          category="internationalOrDomestic"
          value={internationalOrDomestic}
          onValueChange={setInternationalOrDomestic} />
      </div>
      <div className="flex flex-row gap-3 pt-0 pb-3 px-3 flex-1 overflow-hidden">
        <div className="w-[33%] overflow-y-auto scrollbar-hidden">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <div className="flex flex-col gap-3">
              <VisitKpi 
                visitKpiDimension={visitKpiDimension}
                visitedValue={kpiData?.[`${visitKpiDimension}_visited` as keyof (StateKpi | CountryKpi | ContinentKpi | ParkKpi)]}
                notVisitedValue={kpiData?.[`${visitKpiDimension}_not_visited` as keyof (StateKpi | CountryKpi | ContinentKpi | ParkKpi)]} />
              {internationalOrDomestic === "Domestic" ? (
                stateOrPark === "State" ? (
                  <VisitTable
                    location="states"
                    data={tableVisitData as StateVisit[]}
                    user={user}
                    fetchVisits={silentRefreshAll}
                  />
                ) : (
                  <VisitTable
                    location="national_parks"
                    data={tableVisitData as ParkVisit[]}
                    user={user}
                    fetchVisits={silentRefreshAll}
                  />
                )
              ) : (
                <VisitTable
                  location="countries"
                  data={tableVisitData as CountryVisit[]}
                  user={user}
                  fetchVisits={silentRefreshAll}
                />
              )}
            </div>
          )}
        </div>
        <div className="w-[67%] h-full">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <div className="w-full h-full border rounded flex items-center justify-center">
              {internationalOrDomestic === "Domestic" ? (
                  <UsaMap states={mapVisitData as StateVisit[]} />
              ) : (
                  <WorldMap countries={mapVisitData as CountryVisit[]} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}