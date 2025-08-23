interface SwitcherProps<T extends string> {
    option1: T;
    option2: T;
    switchValue: T;
    setSwitchValue: React.Dispatch<React.SetStateAction<T>>
    padding: string,
}

export default function Switcher<T extends string>({ 
    option1, 
    option2, 
    switchValue,
    setSwitchValue,
    padding}: SwitcherProps<T>) {
    const isChecked = switchValue === option2;

    const handleCheckboxChange = () => {
        setSwitchValue(isChecked ? option1 : option2 as React.SetStateAction<T>);
    }

    return (
        <div className={`ms-auto ${padding}`}>
            <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center'>
            <input
                type='checkbox'
                checked={isChecked}
                onChange={handleCheckboxChange}
                className='sr-only'
            />
            <span className='label flex items-center text-sm font-medium text-black'>
                {option1 as string}
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
                {option2 as string}
            </span>
            </label>
        </div>
    )
}
