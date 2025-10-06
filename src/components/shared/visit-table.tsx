import { StateVisit } from "@/types/states";
import { CountryVisit } from "@/types/countries";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@/components/ui/table";

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
);

export function VisitTable({ location, data, user, fetchVisits }: TravelTableProps) {
    async function updateVisitStatus({
        location,
        id,
        userId,
        visited,
      }: {
        location: "states" | "countries";
        id: string;
        userId: string;
        visited: boolean;
      }) {
        try {
          const res = await fetch(`/api/${location}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id,
              user_id: userId,
              visited,
            }),
          });
      
          if (!res.ok) {
            const errorData = await res.json();
            console.error("Failed to update visit status:", errorData.error);
            throw new Error(errorData.error || "Unknown error");
          }
      
          fetchVisits();
          return true;
        } catch (error) {
          console.error("Error updating visit status:", error);
          return false;
        }
      }

    return (
        <div className="border rounded">
            <Table>
                <TableBody>
                    {location === "countries" &&
                    data.map((item) => {
                        const country = item as CountryVisit;
                        return (
                        <TableRow key={country.country_id}>
                            <TableCell className="font-medium w-[50%]">{country.country_name}</TableCell>
                            <TableCell className="w-[25%]">{country.continent}</TableCell>
                            <TableCell className="w-[25%]">
                                <Checkbox
                                    onCheckedChange={async (checked) => {
                                        await updateVisitStatus({
                                          location: location,
                                          id: country.country_id,
                                          userId: user,
                                          visited: checked === true,
                                        });
                                      }}
                                    checked={country.visited} />
                            </TableCell>
                        </TableRow>
                        );
                    })}

                    {location === "states" &&
                    data.map((item) => {
                        const state = item as StateVisit;
                        return (
                        <TableRow key={state.state_id}>
                            <TableCell className="font-medium w-[75%]">{state.state_name}</TableCell>
                            <TableCell className="w-[25%]">
                                <Checkbox
                                    onCheckedChange={async (checked) => {
                                        await updateVisitStatus({
                                          location: location,
                                          id: state.state_id,
                                          userId: user,
                                          visited: checked === true,
                                        });
                                      }}
                                    checked={state.visited} />
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}