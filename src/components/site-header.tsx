type TravelType = "Domestic" | "International"

interface SiteHeaderProps {
  travelType: string;
  setTravelType: React.Dispatch<React.SetStateAction<TravelType>>
}

export function SiteHeader({ travelType, setTravelType }: SiteHeaderProps) {
  const isChecked = travelType === "International";

  const handleCheckboxChange = () => {
    setTravelType(isChecked ? "Domestic" : "International");
  }

  return (
    <main className="flex-1 px-6">
      <div className="flex flex-row">
        <div>
          <h2 className="text-2xl font-bold mb-4">Travel Tracker</h2>
          <p className="text-muted-foreground">Version 0.1.0</p>
        </div>
        <div className="ms-auto p-3">
            <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center'>
            <input
              type='checkbox'
              checked={isChecked}
              onChange={handleCheckboxChange}
              className='sr-only'
            />
            <span className='label flex items-center text-sm font-medium text-black'>
              Domestic
            </span>
            <span
              className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                isChecked ? 'bg-[#212b36]' : 'bg-[#CCCCCE]'
              }`}
            >
              <span
                className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                  isChecked ? 'translate-x-[28px]' : ''
                }`}
              ></span>
            </span>
            <span className='label flex items-center text-sm font-medium text-black'>
              International
            </span>
          </label>
        </div>
      </div>
    </main>
  )
}