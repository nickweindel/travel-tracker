ALTER TABLE public.us_states
ADD COLUMN state_kpi_exception BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE public.us_states SET state_kpi_exception = TRUE
WHERE state_id = 'DC2';

CREATE OR REPLACE VIEW public.vw_states_with_visit_status AS
SELECT
    users.email AS user_id,
    states.state_id,
    states.state_name,
    COALESCE(visited.visited, FALSE) AS visited,
    states.state_kpi_exception
FROM ((
    public.us_states states
    LEFT JOIN public.states_visited AS visited ON (((states.state_id)::TEXT = (visited.state_id)::TEXT))
)
CROSS JOIN auth.users AS users)
ORDER BY states.state_name;