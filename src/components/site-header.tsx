import Switcher from "./switcher";

export type TravelType = "Domestic" | "International";

interface SiteHeaderProps {
  travelType: TravelType;
  setTravelType: React.Dispatch<React.SetStateAction<TravelType>>
}

export function SiteHeader({ travelType, setTravelType }: SiteHeaderProps) {
  return (
    <main className="flex-1 px-6">
      <div className="flex flex-row">
        <div>
          <h2 className="text-2xl font-bold mb-4">Travel Tracker</h2>
          <p className="text-muted-foreground">Version 0.1.0</p>
        </div>
        <div className="ms-auto p-3">
            <Switcher 
              option1="Domestic"
              option2="International"
              switchValue={travelType}
              setSwitchValue={setTravelType}
              padding="p-3"
              />
        </div>
      </div>
    </main>
  )
}