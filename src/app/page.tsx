"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import StatesTable from "@/components/domestic-travel/states-table";
import UsaMap from "@/components/domestic-travel/usa-map";

interface USState {
  state_id: string;
  state_name: string;
  visited: boolean;
}

export default function Home() {
  const [states, setStates] = useState<USState[]>([]);
  const [travelType, setTravelType] = useState<"Domestic" | "International">("Domestic");

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
            <div>
              Under construction
            </div>
          )}
        </div>
        <div className="w-2/3 p-4 flex flex-col">
          <div className="h-full bg-white rounded-lg border border-gray-200 p-4 flex justify-center items-center">
            {travelType === "Domestic" ? (
              <UsaMap states={states} />
            ) : (
              <div>
                Under Construction Too!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
