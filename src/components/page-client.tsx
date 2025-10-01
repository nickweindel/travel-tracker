"use client";

import { useState } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { Selector } from "@/components/shared/selector";

export default function PageClient({ user }: { user: any }) {
  const [internationalOrDomestic, setInternationalOrDomestic] = useState("Domestic");
  const [countryOrContinent, setCountryOrContinent] = useState("Country");

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