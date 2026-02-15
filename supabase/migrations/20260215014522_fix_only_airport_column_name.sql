DROP VIEW public.vw_visit_kpis;
DROP VIEW public.vw_states_with_visit_status;
DROP VIEW public.vw_countries_with_visit_status;

CREATE OR REPLACE VIEW public.vw_states_with_visit_status AS
SELECT
    users.email AS user_id,
    states.state_id,
    states.state_name,
    COALESCE(visited.visited, FALSE) AS visited,
    states.state_kpi_exception,
    COALESCE(visited.only_airport, FALSE) AS only_airport
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
    COALESCE(visited.only_airport, FALSE) AS only_airport
FROM ((
    public.countries countries
    LEFT JOIN public.countries_visited AS visited ON (((countries.country_id)::text = (visited.country_id)::text))
)
CROSS JOIN auth.users AS users)
ORDER BY countries.country_name;

CREATE OR REPLACE VIEW public.vw_visit_kpis AS
WITH cte_unique_users AS (
    SELECT DISTINCT users_1.email
    FROM auth.users AS users_1
),

cte_continents_visited AS (
    SELECT
        vw_countries_with_visit_status.user_id,
        COUNT(DISTINCT vw_countries_with_visit_status.continent) AS continents_visited
    FROM public.vw_countries_with_visit_status
    WHERE (vw_countries_with_visit_status.visited = true)
    GROUP BY vw_countries_with_visit_status.user_id
),

cte_countries_not_visited AS (
    SELECT
        vw_countries_with_visit_status.user_id,
        COUNT(DISTINCT vw_countries_with_visit_status.country_id) AS countries_not_visited
    FROM public.vw_countries_with_visit_status
    WHERE (vw_countries_with_visit_status.visited = false)
    GROUP BY vw_countries_with_visit_status.user_id
),

cte_countries_visited AS (
    SELECT
        vw_countries_with_visit_status.user_id,
        COUNT(DISTINCT vw_countries_with_visit_status.country_id) AS countries_visited
    FROM public.vw_countries_with_visit_status
    WHERE (vw_countries_with_visit_status.visited = true)
    GROUP BY vw_countries_with_visit_status.user_id
),

cte_states_not_visited AS (
    SELECT
        vw_states_with_visit_status.user_id,
        COUNT(DISTINCT vw_states_with_visit_status.state_id) AS states_not_visited
    FROM public.vw_states_with_visit_status
    WHERE (
        vw_states_with_visit_status.visited = false
        AND vw_states_with_visit_status.state_id <> 'DC2'
    )
    GROUP BY vw_states_with_visit_status.user_id
),

cte_states_visited AS (
    SELECT
        vw_states_with_visit_status.user_id,
        COUNT(DISTINCT vw_states_with_visit_status.state_id) AS states_visited
    FROM public.vw_states_with_visit_status
    WHERE (
        vw_states_with_visit_status.visited = true
        AND vw_states_with_visit_status.state_id <> 'DC2'
    )
    GROUP BY vw_states_with_visit_status.user_id
),

cte_national_parks_not_visited AS (
    SELECT
        vw_national_parks_with_visit_status.user_id,
        COUNT(DISTINCT vw_national_parks_with_visit_status.park_id) AS national_parks_not_visited
    FROM public.vw_national_parks_with_visit_status
    WHERE (vw_national_parks_with_visit_status.visited = false)
    GROUP BY vw_national_parks_with_visit_status.user_id
),

cte_national_parks_visited AS (
    SELECT
        vw_national_parks_with_visit_status.user_id,
        COUNT(DISTINCT vw_national_parks_with_visit_status.park_id) AS national_parks_visited
    FROM public.vw_national_parks_with_visit_status
    WHERE (vw_national_parks_with_visit_status.visited = true)
    GROUP BY vw_national_parks_with_visit_status.user_id
)

SELECT
    users.email AS user_id,
    (7 - COALESCE(continents_v.continents_visited, (0)::BIGINT)) AS continents_not_visited,
    COALESCE(continents_v.continents_visited, (0)::BIGINT) AS continents_visited,
    COALESCE(countries_nv.countries_not_visited, (0)::BIGINT) AS countries_not_visited,
    COALESCE(countries_v.countries_visited, (0)::BIGINT) AS countries_visited,
    COALESCE(states_nv.states_not_visited, (0)::BIGINT) AS states_not_visited,
    COALESCE(states_v.states_visited, (0)::BIGINT) AS states_visited,
    COALESCE(parks_nv.national_parks_not_visited, (0)::BIGINT) AS national_parks_not_visited,
    COALESCE(parks_v.national_parks_visited, (0)::BIGINT) AS national_parks_visited
FROM (((((((
    cte_unique_users users
    LEFT JOIN cte_continents_visited AS continents_v ON (((users.email)::TEXT = (continents_v.user_id)::TEXT))
)
LEFT JOIN cte_countries_not_visited AS countries_nv ON (((users.email)::TEXT = (countries_nv.user_id)::TEXT))
)
LEFT JOIN cte_countries_visited AS countries_v ON (((users.email)::TEXT = (countries_v.user_id)::TEXT))
)
LEFT JOIN cte_states_not_visited AS states_nv ON (((users.email)::TEXT = (states_nv.user_id)::TEXT))
)
LEFT JOIN cte_states_visited AS states_v ON (((users.email)::TEXT = (states_v.user_id)::TEXT))
)
LEFT JOIN cte_national_parks_not_visited AS parks_nv ON (((users.email)::TEXT = (parks_nv.user_id)::TEXT))
)
LEFT JOIN cte_national_parks_visited AS parks_v ON (((users.email)::TEXT = (parks_v.user_id)::TEXT))
);