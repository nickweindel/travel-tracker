import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectorCategory =
  | "internationalOrDomestic"
  | "countryOrContinent"
  | "stateOrPark";

interface SelectorProps {
  category: SelectorCategory;
  value: string;
  onValueChange: (value: string) => void;
}

export function Selector({ value, category, onValueChange }: SelectorProps) {
  const selectOptions = {
    internationalOrDomestic: {
      defaultValue: "Domestic",
      options: {
        domestic: "Domestic",
        international: "International",
      },
    },
    countryOrContinent: {
      defaultValue: "Country",
      options: {
        country: "Country",
        continent: "Continent",
      },
    },
    stateOrPark: {
      defaultValue: "State",
      options: {
        state: "State",
        national_park: "National Park",
      },
    },
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(selectOptions[category].options).map(
            ([value, label]) => (
              <SelectItem key={value} value={label}>
                {label}
              </SelectItem>
            ),
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
