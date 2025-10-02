import { StateVisit } from "@/types/states";
import { CountryVisit } from "@/types/countries";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@/components/ui/table";

type TravelTableProps = (
  | {
      location: "states";
      data: StateVisit[];
    }
  | {
      location: "countries";
      data: CountryVisit[];
    }
);

export function VisitTable({ location, data }: TravelTableProps) {
    return (
        <>
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
                                    onCheckedChange={() => console.log(country.country_id)} 
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
                                    onCheckedChange={() => console.log(state.state_id)} 
                                    checked={state.visited} />
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
}