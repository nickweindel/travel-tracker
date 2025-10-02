"use client";

import { useState, useEffect } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { Selector } from "@/components/shared/selector";
import { Skeleton } from "@/components/ui/skeleton";
import { VisitTable } from "@/components/shared/visit-table";

import { CountryVisit } from "@/types/countries";
import { StateVisit } from "@/types/states";

export default function PageClient({ user }: { user: any }) {
  const [internationalOrDomestic, setInternationalOrDomestic] = useState("Domestic");
  const [countryOrContinent, setCountryOrContinent] = useState("Country");
  const [statesOrCountries, setStatesOrCountries] = useState<"states" | "countries">("states");
  const [visitData, setVisitData] = useState<StateVisit[] | CountryVisit[]>([]);
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
        console.log(visitData);
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
    fetchVisits()
  }, [internationalOrDomestic]);

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
        ) : statesOrCountries === "states" ? (
          <VisitTable location="states" data={visitData as StateVisit[]} />
        ) : (
          <VisitTable location="countries" data={visitData as CountryVisit[]} />
        )}
        </div>
      </div>
    </div>
  );
}