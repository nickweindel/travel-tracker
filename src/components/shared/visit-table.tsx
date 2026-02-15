import { StateVisit } from "@/types/states";
import { CountryVisit } from "@/types/countries";
import { ParkVisit } from "@/types/parks";

import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Info, Plane } from "lucide-react";

type TravelTableBase = {
  user: string;
  fetchVisits: () => void;
};

type TravelTableProps = TravelTableBase &
  (
    | {
        location: "states";
        data: StateVisit[];
      }
    | {
        location: "countries";
        data: CountryVisit[];
      }
    | {
        location: "national_parks";
        data: ParkVisit[];
      }
  );

export function VisitTable({
  location,
  data,
  user,
  fetchVisits,
}: TravelTableProps) {
  async function updateVisitStatus({
    location,
    id,
    userId,
    visited,
    only_airport,
  }: {
    location: "states" | "countries" | "national_parks";
    id: string;
    userId: string;
    visited?: boolean;
    only_airport?: boolean;
  }) {
    try {
      const res = await fetch(`/api/${location}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          user_id: userId,
          visited,
          only_airport,
        }),
      });
      if (!res.ok) throw new Error("Failed to update visit status");
      fetchVisits();
    } catch (error) {
      console.error(error);
    }
  }

  function airportTooltipContent(type: "country" | "state") {
    return (
      <p>
        Marking this button indicates you've only been to an airport in this{" "}
        {type}. It will not count toward your visit KPIs.
      </p>
    );
  }

  return (
    <div className="border rounded h-full flex flex-col">
      <ScrollArea className="flex-1 min-h-0">
        <Table className="w-full">
          <TableBody>
            {location === "countries" &&
              data.map((country) => (
                <TableRow key={(country as CountryVisit).country_id}>
                  {/* Country Name */}
                  <TableCell className="font-medium w-[35%]">
                    {(country as CountryVisit).country_name}
                  </TableCell>

                  {/* Continent */}
                  <TableCell className="w-[20%]">
                    {(country as CountryVisit).continent}
                  </TableCell>

                  {/* Visited */}
                  <TableCell className="w-[20%]">
                    <Checkbox
                      checked={(country as CountryVisit).visited}
                      onCheckedChange={async (checked) => {
                        const isVisited = checked === true;

                        await updateVisitStatus({
                          location,
                          id: (country as CountryVisit).country_id,
                          userId: user,
                          visited: isVisited,
                          // If visited becomes true, clear only_airport
                          only_airport: isVisited
                            ? false
                            : (country as CountryVisit).only_airport,
                        });
                      }}
                    />
                  </TableCell>

                  {/* Airport Only */}
                  <TableCell className="w-[25%]">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            disabled={(country as CountryVisit).visited}
                            onClick={async () => {
                              if ((country as CountryVisit).visited) return;

                              await updateVisitStatus({
                                location,
                                id: (country as CountryVisit).country_id,
                                userId: user,
                                only_airport: !(country as CountryVisit)
                                  .only_airport,
                              });
                            }}
                            className={`transition ${
                              (country as CountryVisit).visited
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <Plane
                              className={`h-5 w-5 transition-colors ${
                                (country as CountryVisit).only_airport
                                  ? "fill-current text-primary"
                                  : "text-muted-foreground hover:text-primary"
                              }`}
                            />
                          </button>
                        </TooltipTrigger>

                        <TooltipContent>
                          {airportTooltipContent("country")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            {location === "states" &&
              data.map((state) => (
                <TableRow key={(state as StateVisit).state_id}>
                  {/* State Name */}
                  <TableCell className="font-medium w-[50%]">
                    <div className="flex items-center gap-2">
                      {(state as StateVisit).state_name}

                      {(state as StateVisit).state_kpi_exception && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {(state as StateVisit).state_name} is not a
                                state. Clicking that you've visited will fill in
                                the map but not affect your Visit Stats.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>

                  {/* Visited */}
                  <TableCell className="w-[25%]">
                    <Checkbox
                      checked={(state as StateVisit).visited}
                      onCheckedChange={async (checked) => {
                        const isVisited = checked === true;

                        await updateVisitStatus({
                          location,
                          id: (state as StateVisit).state_id,
                          userId: user,
                          visited: isVisited,
                          // Clear only_airport if visited becomes true
                          only_airport: isVisited
                            ? false
                            : (state as StateVisit).only_airport,
                        });
                      }}
                    />
                  </TableCell>

                  {/* Airport Only */}
                  <TableCell className="w-[25%]">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            disabled={(state as StateVisit).visited}
                            onClick={async () => {
                              if ((state as StateVisit).visited) return;

                              await updateVisitStatus({
                                location,
                                id: (state as StateVisit).state_id,
                                userId: user,
                                only_airport: !(state as StateVisit)
                                  .only_airport,
                              });
                            }}
                            className={`transition ${
                              (state as StateVisit).visited
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <Plane
                              className={`h-5 w-5 transition-colors ${
                                (state as StateVisit).only_airport
                                  ? "fill-current text-primary"
                                  : "text-muted-foreground hover:text-primary"
                              }`}
                            />
                          </button>
                        </TooltipTrigger>

                        <TooltipContent>
                          {airportTooltipContent("state")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            {location === "national_parks" &&
              data.map((park) => (
                <TableRow key={(park as ParkVisit).park_id}>
                  <TableCell className="font-medium w-[75%]">
                    {(park as ParkVisit).park_name}
                  </TableCell>
                  <TableCell className="w-[25%]">
                    <Checkbox
                      checked={(park as ParkVisit).visited}
                      onCheckedChange={async (checked) => {
                        await updateVisitStatus({
                          location,
                          id: (park as ParkVisit).park_id,
                          userId: user,
                          visited: checked === true,
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
