import {
    Card,
    CardContent,
    CardHeader,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { StatBlock } from "@/components/shared/stat-block";

import numeral from "numeral";

interface VisitKpiProps {
    visitKpiDimension: string;
    visitedValue: number | undefined;
    notVisitedValue: number | undefined;
}

export function VisitKpi({ visitKpiDimension, visitedValue, notVisitedValue } : VisitKpiProps ) {
    const cardDescription = visitKpiDimension.charAt(0).toUpperCase() + visitKpiDimension.slice(1);
    const percentVisited = visitedValue && notVisitedValue
        ? numeral(visitedValue / (visitedValue + notVisitedValue)).format("0%")
        : "0%";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Visit Stats</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row justify-between gap-6">
                    <StatBlock label="Visited" value={String(visitedValue)} />
                    <StatBlock label="Not Visited" value={String(notVisitedValue)} />
                    <StatBlock label="% Visited" value={percentVisited} />
                </div>
            </CardContent>
        </Card>
    )
}