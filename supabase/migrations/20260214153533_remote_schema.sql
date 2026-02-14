


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."countries" (
    "country_id" character varying(2) NOT NULL,
    "country_name" character varying(100) NOT NULL,
    "continent" character varying(13) NOT NULL
);


ALTER TABLE "public"."countries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."countries_visited" (
    "user_id" character varying(100) NOT NULL,
    "country_id" character varying(2) NOT NULL,
    "visited" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."countries_visited" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."national_parks_visited" (
    "user_id" character varying(100) NOT NULL,
    "park_id" character varying(4) NOT NULL,
    "visited" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."national_parks_visited" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."states_visited" (
    "user_id" character varying(100) NOT NULL,
    "state_id" character varying(2) NOT NULL,
    "visited" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."states_visited" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."us_national_parks" (
    "park_id" character varying(4) NOT NULL,
    "park_name" character varying(255)
);


ALTER TABLE "public"."us_national_parks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."us_states" (
    "state_id" character varying(2) NOT NULL,
    "state_name" character varying(14) NOT NULL
);


ALTER TABLE "public"."us_states" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_countries_with_visit_status" AS
 SELECT "users"."email" AS "user_id",
    "countries"."country_id",
    "countries"."country_name",
    "countries"."continent",
    COALESCE("visited"."visited", false) AS "visited"
   FROM (("public"."countries" "countries"
     LEFT JOIN "public"."countries_visited" "visited" ON ((("countries"."country_id")::"text" = ("visited"."country_id")::"text")))
     CROSS JOIN "auth"."users" "users")
  ORDER BY "countries"."country_name";


ALTER VIEW "public"."vw_countries_with_visit_status" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_national_parks_with_visit_status" AS
 SELECT "users"."email" AS "user_id",
    "parks"."park_id",
    "parks"."park_name",
    COALESCE("visited"."visited", false) AS "visited"
   FROM (("public"."us_national_parks" "parks"
     LEFT JOIN "public"."national_parks_visited" "visited" ON ((("parks"."park_id")::"text" = ("visited"."park_id")::"text")))
     CROSS JOIN "auth"."users" "users")
  ORDER BY "parks"."park_name";


ALTER VIEW "public"."vw_national_parks_with_visit_status" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_states_with_visit_status" AS
 SELECT "users"."email" AS "user_id",
    "states"."state_id",
    "states"."state_name",
    COALESCE("visited"."visited", false) AS "visited"
   FROM (("public"."us_states" "states"
     LEFT JOIN "public"."states_visited" "visited" ON ((("states"."state_id")::"text" = ("visited"."state_id")::"text")))
     CROSS JOIN "auth"."users" "users")
  ORDER BY "states"."state_name";


ALTER VIEW "public"."vw_states_with_visit_status" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_visit_kpis" AS
 WITH "cte_unique_users" AS (
         SELECT DISTINCT "users_1"."email"
           FROM "auth"."users" "users_1"
        ), "cte_continents_visited" AS (
         SELECT "vw_countries_with_visit_status"."user_id",
            "count"(DISTINCT "vw_countries_with_visit_status"."continent") AS "continents_visited"
           FROM "public"."vw_countries_with_visit_status"
          WHERE ("vw_countries_with_visit_status"."visited" = true)
          GROUP BY "vw_countries_with_visit_status"."user_id"
        ), "cte_countries_not_visited" AS (
         SELECT "vw_countries_with_visit_status"."user_id",
            "count"(DISTINCT "vw_countries_with_visit_status"."country_id") AS "countries_not_visited"
           FROM "public"."vw_countries_with_visit_status"
          WHERE ("vw_countries_with_visit_status"."visited" = false)
          GROUP BY "vw_countries_with_visit_status"."user_id"
        ), "cte_countries_visited" AS (
         SELECT "vw_countries_with_visit_status"."user_id",
            "count"(DISTINCT "vw_countries_with_visit_status"."country_id") AS "countries_visited"
           FROM "public"."vw_countries_with_visit_status"
          WHERE ("vw_countries_with_visit_status"."visited" = true)
          GROUP BY "vw_countries_with_visit_status"."user_id"
        ), "cte_states_not_visited" AS (
         SELECT "vw_states_with_visit_status"."user_id",
            "count"(DISTINCT "vw_states_with_visit_status"."state_id") AS "states_not_visited"
           FROM "public"."vw_states_with_visit_status"
          WHERE ("vw_states_with_visit_status"."visited" = false)
          GROUP BY "vw_states_with_visit_status"."user_id"
        ), "cte_states_visited" AS (
         SELECT "vw_states_with_visit_status"."user_id",
            "count"(DISTINCT "vw_states_with_visit_status"."state_id") AS "states_visited"
           FROM "public"."vw_states_with_visit_status"
          WHERE ("vw_states_with_visit_status"."visited" = true)
          GROUP BY "vw_states_with_visit_status"."user_id"
        ), "cte_national_parks_not_visited" AS (
         SELECT "vw_national_parks_with_visit_status"."user_id",
            "count"(DISTINCT "vw_national_parks_with_visit_status"."park_id") AS "national_parks_not_visited"
           FROM "public"."vw_national_parks_with_visit_status"
          WHERE ("vw_national_parks_with_visit_status"."visited" = false)
          GROUP BY "vw_national_parks_with_visit_status"."user_id"
        ), "cte_national_parks_visited" AS (
         SELECT "vw_national_parks_with_visit_status"."user_id",
            "count"(DISTINCT "vw_national_parks_with_visit_status"."park_id") AS "national_parks_visited"
           FROM "public"."vw_national_parks_with_visit_status"
          WHERE ("vw_national_parks_with_visit_status"."visited" = true)
          GROUP BY "vw_national_parks_with_visit_status"."user_id"
        )
 SELECT "users"."email" AS "user_id",
    (7 - COALESCE("continents_v"."continents_visited", (0)::bigint)) AS "continents_not_visited",
    COALESCE("continents_v"."continents_visited", (0)::bigint) AS "continents_visited",
    COALESCE("countries_nv"."countries_not_visited", (0)::bigint) AS "countries_not_visited",
    COALESCE("countries_v"."countries_visited", (0)::bigint) AS "countries_visited",
    COALESCE("states_nv"."states_not_visited", (0)::bigint) AS "states_not_visited",
    COALESCE("states_v"."states_visited", (0)::bigint) AS "states_visited",
    COALESCE("parks_nv"."national_parks_not_visited", (0)::bigint) AS "national_parks_not_visited",
    COALESCE("parks_v"."national_parks_visited", (0)::bigint) AS "national_parks_visited"
   FROM ((((((("cte_unique_users" "users"
     LEFT JOIN "cte_continents_visited" "continents_v" ON ((("users"."email")::"text" = ("continents_v"."user_id")::"text")))
     LEFT JOIN "cte_countries_not_visited" "countries_nv" ON ((("users"."email")::"text" = ("countries_nv"."user_id")::"text")))
     LEFT JOIN "cte_countries_visited" "countries_v" ON ((("users"."email")::"text" = ("countries_v"."user_id")::"text")))
     LEFT JOIN "cte_states_not_visited" "states_nv" ON ((("users"."email")::"text" = ("states_nv"."user_id")::"text")))
     LEFT JOIN "cte_states_visited" "states_v" ON ((("users"."email")::"text" = ("states_v"."user_id")::"text")))
     LEFT JOIN "cte_national_parks_not_visited" "parks_nv" ON ((("users"."email")::"text" = ("parks_nv"."user_id")::"text")))
     LEFT JOIN "cte_national_parks_visited" "parks_v" ON ((("users"."email")::"text" = ("parks_v"."user_id")::"text")));


ALTER VIEW "public"."vw_visit_kpis" OWNER TO "postgres";


ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("country_id");



ALTER TABLE ONLY "public"."countries_visited"
    ADD CONSTRAINT "countries_visited_pkey" PRIMARY KEY ("user_id", "country_id");



ALTER TABLE ONLY "public"."national_parks_visited"
    ADD CONSTRAINT "parks_visited_pkey" PRIMARY KEY ("user_id", "park_id");



ALTER TABLE ONLY "public"."states_visited"
    ADD CONSTRAINT "states_visited_pkey" PRIMARY KEY ("user_id", "state_id");



ALTER TABLE ONLY "public"."us_national_parks"
    ADD CONSTRAINT "us_national_parks_pk" PRIMARY KEY ("park_id");



ALTER TABLE ONLY "public"."us_states"
    ADD CONSTRAINT "us_states_pkey" PRIMARY KEY ("state_id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."countries" TO "anon";
GRANT ALL ON TABLE "public"."countries" TO "authenticated";
GRANT ALL ON TABLE "public"."countries" TO "service_role";



GRANT ALL ON TABLE "public"."countries_visited" TO "anon";
GRANT ALL ON TABLE "public"."countries_visited" TO "authenticated";
GRANT ALL ON TABLE "public"."countries_visited" TO "service_role";



GRANT ALL ON TABLE "public"."national_parks_visited" TO "anon";
GRANT ALL ON TABLE "public"."national_parks_visited" TO "authenticated";
GRANT ALL ON TABLE "public"."national_parks_visited" TO "service_role";



GRANT ALL ON TABLE "public"."states_visited" TO "anon";
GRANT ALL ON TABLE "public"."states_visited" TO "authenticated";
GRANT ALL ON TABLE "public"."states_visited" TO "service_role";



GRANT ALL ON TABLE "public"."us_national_parks" TO "anon";
GRANT ALL ON TABLE "public"."us_national_parks" TO "authenticated";
GRANT ALL ON TABLE "public"."us_national_parks" TO "service_role";



GRANT ALL ON TABLE "public"."us_states" TO "anon";
GRANT ALL ON TABLE "public"."us_states" TO "authenticated";
GRANT ALL ON TABLE "public"."us_states" TO "service_role";



GRANT ALL ON TABLE "public"."vw_countries_with_visit_status" TO "anon";
GRANT ALL ON TABLE "public"."vw_countries_with_visit_status" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_countries_with_visit_status" TO "service_role";



GRANT ALL ON TABLE "public"."vw_national_parks_with_visit_status" TO "anon";
GRANT ALL ON TABLE "public"."vw_national_parks_with_visit_status" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_national_parks_with_visit_status" TO "service_role";



GRANT ALL ON TABLE "public"."vw_states_with_visit_status" TO "anon";
GRANT ALL ON TABLE "public"."vw_states_with_visit_status" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_states_with_visit_status" TO "service_role";



GRANT ALL ON TABLE "public"."vw_visit_kpis" TO "anon";
GRANT ALL ON TABLE "public"."vw_visit_kpis" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_visit_kpis" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


