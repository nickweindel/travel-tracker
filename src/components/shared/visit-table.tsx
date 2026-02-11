import { StateVisit } from "@/types/states";
import { CountryVisit } from "@/types/countries";
import { ParkVisit } from "@/types/parks";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

type TravelTableBase = {
    user: string;
    fetchVisits: () => void;
}

type TravelTableProps = TravelTableBase & (
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

export function VisitTable({ location, data, user, fetchVisits }: TravelTableProps) {
  async function updateVisitStatus({ location, id, userId, visited }: { location: "states" | "countries" | "national_parks"; id: string; userId: string; visited: boolean; }) {
    try {
      const res = await fetch(`/api/${location}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_id: userId, visited }),
      });
      if (!res.ok) throw new Error("Failed to update visit status");
      fetchVisits();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="border rounded h-full flex flex-col">
      <ScrollArea className="flex-1 min-h-0">
        <Table className="w-full">
          <TableBody>
            {location === "countries" &&
              data.map((country) => (
                <TableRow key={(country as CountryVisit).country_id}>
                  <TableCell className="font-medium w-[50%]">{(country as CountryVisit).country_name}</TableCell>
                  <TableCell className="w-[25%]">{(country as CountryVisit).continent}</TableCell>
                  <TableCell className="w-[25%]">
                    <Checkbox
                      checked={(country as CountryVisit).visited}
                      onCheckedChange={async (checked) => {
                        await updateVisitStatus({
                          location,
                          id: (country as CountryVisit).country_id,
                          userId: user,
                          visited: checked === true,
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}

            {location === "states" &&
              data.map((state) => (
                <TableRow key={(state as StateVisit).state_id}>
                  <TableCell className="font-medium w-[75%]">{(state as StateVisit).state_name}</TableCell>
                  <TableCell className="w-[25%]">
                    <Checkbox
                      checked={(state as StateVisit).visited}
                      onCheckedChange={async (checked) => {
                        await updateVisitStatus({
                          location,
                          id: (state as StateVisit).state_id,
                          userId: user,
                          visited: checked === true,
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}

            {location === "national_parks" &&
              data.map((park) => (
                <TableRow key={(park as ParkVisit).park_id}>
                  <TableCell className="font-medium w-[75%]">{(park as ParkVisit).park_name}</TableCell>
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