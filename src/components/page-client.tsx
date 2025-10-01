"use client";

import { useState, useEffect } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { Selector } from "@/components/shared/selector";

import { StateVisit } from "@/types/states";

export default function PageClient({ user }: { user: any }) {
  const [internationalOrDomestic, setInternationalOrDomestic] = useState("Domestic");
  const [countryOrContinent, setCountryOrContinent] = useState("Country");
  const [stateVisitData, setStateVisitData] = useState<StateVisit[]>([]);
  const [isStatesLoading, setIsStatesLoading] = useState<boolean>(true);

  // Function to fetch state visit data.
  const fetchStates = async () => {
    try {
      setIsStatesLoading(true);
      const response = await fetch(`api/states?user=${user}`);
      const data = await response.json();
      if (response.ok) {
        const statesData = data.states;
        setStateVisitData(statesData);
      } else {
        console.error('Error fetching states:', data.error);
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setIsStatesLoading(false);
    }
  };

  useEffect(() => {
    fetchStates()
  }, []);

  return (
    <div>
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
    </div>
  );
}