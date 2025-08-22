"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import StatesTable from "@/components/states-table";
import UsaMap from "@/components/usa-map";

interface USState {
  state_id: string;
  state_name: string;
  visited: boolean;
}

export default function Home() {
  const [states, setStates] = useState<USState[]>([]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="h-[80px] flex-shrink-0">
        <SiteHeader />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 p-4 flex flex-col">
          <StatesTable onStatesChange={setStates} />
        </div>
        <div className="w-2/3 p-4 flex flex-col">
          <div className="h-full bg-white rounded-lg border border-gray-200 p-4 flex justify-center items-center">
            <UsaMap states={states} />
          </div>
        </div>
      </div>
    </div>
  );
}
