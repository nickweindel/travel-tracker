export interface CountryVisit {
    user_id: string;
    country_id: string;
    country_name: string;
    continent: string;
    visited: boolean;
}

export interface CountryKpi {
    countries_visited: number;
    countries_not_visited: number;
}