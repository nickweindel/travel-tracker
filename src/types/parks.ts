export interface ParkVisit {
    user_id: string;
    park_id: string;
    park_name: string;
    visited: boolean;
}

export interface ParkKpi {
    national_parks_visited: number;
    national_parks_not_visited: number;
}