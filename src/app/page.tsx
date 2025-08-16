import { SiteHeader } from "@/components/site-header";
import StatesTable from "@/components/states-table";
import { Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="h-[80px] flex-shrink-0">
        <SiteHeader />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 p-4 flex flex-col">
          <StatesTable />
        </div>
        <div className="w-2/3 p-4 flex flex-col">
          <div className="flex flex-col items-center justify-center h-full bg-gray-200 rounded-lg p-8">
            <Globe className="w-24 h-24 text-gray-600 mb-4" />
            <p className="text-lg text-gray-700">Map coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
