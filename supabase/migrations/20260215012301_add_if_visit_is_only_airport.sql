ALTER TABLE public.states_visited
ADD COLUMN only_airport BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.countries_visited
ADD COLUMN only_airport BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE VIEW public.vw_states_with_visit_status AS
SELECT
    users.email AS user_id,
    states.state_id,
    states.state_name,
    COALESCE(visited.visited, FALSE) AS visited,
    states.state_kpi_exception,
    COALESCE(visited.only_airport, FALSE) AS airport_only
FROM ((
    public.us_states states
    LEFT JOIN public.states_visited AS visited ON (((states.state_id)::TEXT = (visited.state_id)::TEXT))
)
CROSS JOIN auth.users AS users)
ORDER BY states.state_name;

CREATE OR REPLACE VIEW public.vw_countries_with_visit_status AS
SELECT
    users.email AS user_id,
    countries.country_id,
    countries.country_name,
    countries.continent,
    COALESCE(visited.visited, FALSE) AS visited,
    COALESCE(visited.only_airport, FALSE) AS airport_only
FROM ((
    public.countries countries
    LEFT JOIN public.countries_visited AS visited ON (((countries.country_id)::text = (visited.country_id)::text))
)
CROSS JOIN auth.users AS users)
ORDER BY countries.country_name;