interface StatBlockProps {
    label: string;
    value: string;
}

export function StatBlock({ label, value }: StatBlockProps) {
    return (
        <div className="flex flex-col">
            <div className="text-sm text-gray-600">{label}</div>
            <div className="text-lg font-semibold">{value}</div>
        </div>
    )
};
  
