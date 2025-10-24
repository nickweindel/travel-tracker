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
  const [statesOrCountries, setStatesOrCountries] = useState<"states" | "countries">("states");
  const [visitKpiDimension, setVisitKpiDimension] = useState<"states" | "countries" | "continents" | "national_parks">("states");
  const [tableVisitData, setTableVisitData] = useState<StateVisit[] | CountryVisit[] | ParkVisit[]>([]);
  const [mapVisitData, setMapVisitData] = useState<StateVisit[] | CountryVisit[]>([]);
  const [kpiData, setKpiData] = useState<StateKpi | CountryKpi | ContinentKpi | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to fetch state, country, or national park visit data to display on the clickable table.
  const fetchTableVisitData = async () => {
    const visitLocation = internationalOrDomestic === "Domestic" ? 
      stateOrPark === "State" ? "states" : "national_parks"
      : "countries"
  
    try {
      setIsLoading(true);
      const response = await fetch(`api/${visitLocation}?user=${user}`);
      const data = await response.json();
      if (response.ok) {
        const visitData = data.visits;
        setTableVisitData(visitData);
      } else {
        console.error(`Error fetching ${visitLocation}:`, data.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTableVisitData();
  }, [internationalOrDomestic, stateOrPark])

  // Function to fetch state or country visit data for display on the maps.
  const fetchMapVisitData = async () => {
    const visitLocation = internationalOrDomestic === "Domestic" ? "states" : "countries";

    setStatesOrCountries(visitLocation);

    try {
      setIsLoading(true);
      const response = await fetch(`api/${visitLocation}?user=${user}`);
      const data = await response.json();
      if (response.ok) {
        const visitData = data.visits;
        setMapVisitData(visitData);
      } else {
        console.error(`Error fetching ${statesOrCountries}:`, data.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapVisitData();
  }, [internationalOrDomestic]);

  // Function to fetch visit KPIs.
  const fetchVisitKpis = async () => {
    const dimension =
      internationalOrDomestic === "Domestic"
        ? stateOrPark === "State"
          ? "states"
          : "national_parks"
        : countryOrContinent === "Country"
        ? "countries"
        : "continents";

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
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitKpis();
  }, [internationalOrDomestic, countryOrContinent, tableVisitData, visitKpiDimension, statesOrCountries, stateOrPark]);

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
      <div className="flex flex-row gap-3 p-3 flex-1 overflow-hidden">

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
                    fetchVisits={fetchTableVisitData}
                  />
                ) : (
                  <VisitTable
                    location="national_parks"
                    data={tableVisitData as ParkVisit[]}
                    user={user}
                    fetchVisits={fetchTableVisitData}
                  />
                )
              ) : (
                <VisitTable
                  location="countries"
                  data={tableVisitData as CountryVisit[]}
                  user={user}
                  fetchVisits={fetchTableVisitData}
                />
              )}
            </div>
          )}
        </div>
        <div className="w-[67%] h-full">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <div className="w-full h-full border rounded">
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