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
  const [internationalOrDomestic, setInternationalOrDomestic] =
    useState("Domestic");
  const [countryOrContinent, setCountryOrContinent] = useState("Country");
  const [stateOrPark, setStateOrPark] = useState("State");
  const [visitKpiDimension, setVisitKpiDimension] = useState<
    "states" | "countries" | "continents" | "national_parks"
  >("states");
  const [tableVisitData, setTableVisitData] = useState<
    StateVisit[] | CountryVisit[] | ParkVisit[]
  >([]);
  const [mapVisitData, setMapVisitData] = useState<
    StateVisit[] | CountryVisit[]
  >([]);
  const [kpiData, setKpiData] = useState<
    StateKpi | CountryKpi | ContinentKpi | null
  >(null);

  // Different loading states because we only rerender components for certain switches
  const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [isKpiLoading, setIsKpiLoading] = useState<boolean>(true);

  const fetchTableVisitData = async () => {
    const visitLocation =
      internationalOrDomestic === "Domestic"
        ? stateOrPark === "State"
          ? "states"
          : "national_parks"
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

  // ---- Map ----
  // Only reload map when switching Domestic <-> International
  useEffect(() => {
    let cancelled = false;

    const fetchMap = async () => {
      setIsMapLoading(true);
      try {
        const mapData = await fetchMapVisitData();
        if (!cancelled) setMapVisitData(mapData);
      } finally {
        if (!cancelled) setIsMapLoading(false);
      }
    };

    fetchMap();
    return () => {
      cancelled = true;
    };
  }, [internationalOrDomestic]);

  // ---- Table ----
  // Reload table when switching Domestic <-> International OR State <-> Park
  useEffect(() => {
    let cancelled = false;

    const fetchTable = async () => {
      setIsTableLoading(true);
      try {
        const tableData = await fetchTableVisitData();
        if (!cancelled) setTableVisitData(tableData);
      } finally {
        if (!cancelled) setIsTableLoading(false);
      }
    };

    fetchTable();
    return () => {
      cancelled = true;
    };
  }, [internationalOrDomestic, stateOrPark]);

  // ---- KPI ----
  // Reload KPI on every switch
  useEffect(() => {
    let cancelled = false;

    const fetchKpi = async () => {
      setIsKpiLoading(true);
      try {
        const kpi = await fetchVisitKpiData();
        if (!cancelled) setKpiData(kpi);
      } finally {
        if (!cancelled) setIsKpiLoading(false);
      }
    };

    fetchKpi();
    return () => {
      cancelled = true;
    };
  }, [internationalOrDomestic, stateOrPark, countryOrContinent]);

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

  // Helper function to safely get KPI values
  function getKpiValue(
    kpi: StateKpi | CountryKpi | ContinentKpi | ParkKpi | null,
    dimension: string,
    type: "visited" | "not_visited",
  ): number {
    if (!kpi) return 0;
    const key = `${dimension}_${type}` as keyof typeof kpi;
    return kpi[key] as number;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Page Header */}
      <PageHeader user={user} />

      {/* Selectors */}
      <div className="flex flex-row gap-3 p-3 justify-end">
        {internationalOrDomestic === "International" ? (
          <Selector
            category="countryOrContinent"
            value={countryOrContinent}
            onValueChange={setCountryOrContinent}
          />
        ) : (
          <Selector
            category="stateOrPark"
            value={stateOrPark}
            onValueChange={setStateOrPark}
          />
        )}
        <Selector
          category="internationalOrDomestic"
          value={internationalOrDomestic}
          onValueChange={setInternationalOrDomestic}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-3 p-3 overflow-hidden">
        {/* Left Panel */}
        <div className="w-[33%] h-full flex flex-col gap-3">
          {/* KPI */}
          <div className="w-full">
            {isKpiLoading ? (
              <Skeleton className="w-full h-32" />
            ) : (
              <VisitKpi
                visitKpiDimension={visitKpiDimension}
                visitedValue={getKpiValue(
                  kpiData,
                  visitKpiDimension,
                  "visited",
                )}
                notVisitedValue={getKpiValue(
                  kpiData,
                  visitKpiDimension,
                  "not_visited",
                )}
              />
            )}
          </div>

          {/* Table */}
          <div className="flex-1 w-full min-h-0 overflow-y-auto scrollbar-hidden">
            {isTableLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Right Panel: Map */}
        <div className="w-[67%] h-full">
          {isMapLoading ? (
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
