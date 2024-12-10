

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


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."cache" (
    "key" "text" NOT NULL,
    "value" "json" NOT NULL,
    "created_at" timestamp with time zone
);


ALTER TABLE "public"."cache" OWNER TO "postgres";


COMMENT ON TABLE "public"."cache" IS 'Keyv cache';


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" integer NOT NULL,
    "time_elapsed" integer,
    "time_extra" integer,
    "team_id" integer,
    "player_id" integer,
    "player_name" character varying(255),
    "assist_id" integer,
    "assist_name" character varying(255),
    "type" character varying(255),
    "detail" character varying(255),
    "comments" "text",
    "fixture_id" integer
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."events_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."events_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."events_id_seq" OWNED BY "public"."events"."id";



CREATE TABLE IF NOT EXISTS "public"."fixtures" (
    "id" integer NOT NULL,
    "referee" character varying(255),
    "timezone" character varying(255),
    "date" timestamp without time zone,
    "timestamp" bigint,
    "periods_id" integer,
    "venue_id" integer,
    "status_id" integer,
    "league_id" integer,
    "home_team_id" integer,
    "away_team_id" integer,
    "goals_id" integer,
    "score_id" integer
);


ALTER TABLE "public"."fixtures" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."fixtures_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."fixtures_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."fixtures_id_seq" OWNED BY "public"."fixtures"."id";



CREATE TABLE IF NOT EXISTS "public"."goals" (
    "id" integer NOT NULL,
    "home" integer,
    "away" integer
);


ALTER TABLE "public"."goals" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."goals_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."goals_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."goals_id_seq" OWNED BY "public"."goals"."id";



CREATE TABLE IF NOT EXISTS "public"."leagues" (
    "id" integer NOT NULL,
    "name" character varying(255),
    "country" character varying(255),
    "logo" "text",
    "flag" "text",
    "season" integer,
    "round" character varying(255)
);


ALTER TABLE "public"."leagues" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."leagues_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."leagues_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."leagues_id_seq" OWNED BY "public"."leagues"."id";



CREATE TABLE IF NOT EXISTS "public"."periods" (
    "id" integer NOT NULL,
    "first" integer,
    "second" integer
);


ALTER TABLE "public"."periods" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."periods_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."periods_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."periods_id_seq" OWNED BY "public"."periods"."id";



CREATE TABLE IF NOT EXISTS "public"."scores" (
    "id" integer NOT NULL,
    "halftime_home" integer,
    "halftime_away" integer,
    "fulltime_home" integer,
    "fulltime_away" integer,
    "extratime_home" integer,
    "extratime_away" integer,
    "penalty_home" integer,
    "penalty_away" integer
);


ALTER TABLE "public"."scores" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."scores_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."scores_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."scores_id_seq" OWNED BY "public"."scores"."id";



CREATE TABLE IF NOT EXISTS "public"."statuses" (
    "id" integer NOT NULL,
    "long" character varying(255),
    "short" character varying(10),
    "elapsed" integer,
    "extra" integer
);


ALTER TABLE "public"."statuses" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."statuses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."statuses_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."statuses_id_seq" OWNED BY "public"."statuses"."id";



CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" integer NOT NULL,
    "name" character varying(255),
    "logo" "text",
    "winner" boolean
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."teams_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."teams_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."teams_id_seq" OWNED BY "public"."teams"."id";



CREATE TABLE IF NOT EXISTS "public"."venues" (
    "id" integer NOT NULL,
    "name" character varying(255),
    "city" character varying(255)
);


ALTER TABLE "public"."venues" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."venues_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."venues_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."venues_id_seq" OWNED BY "public"."venues"."id";



ALTER TABLE ONLY "public"."events" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."events_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."fixtures" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."fixtures_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."goals" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."goals_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."leagues" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."leagues_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."periods" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."periods_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."scores" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."scores_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."statuses" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."statuses_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."teams" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."teams_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."venues" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."venues_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cache"
    ADD CONSTRAINT "cache_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leagues"
    ADD CONSTRAINT "leagues_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."periods"
    ADD CONSTRAINT "periods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."statuses"
    ADD CONSTRAINT "statuses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."venues"
    ADD CONSTRAINT "venues_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_fixture_id_fkey" FOREIGN KEY ("fixture_id") REFERENCES "public"."fixtures"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_goals_id_fkey" FOREIGN KEY ("goals_id") REFERENCES "public"."goals"("id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_periods_id_fkey" FOREIGN KEY ("periods_id") REFERENCES "public"."periods"("id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_score_id_fkey" FOREIGN KEY ("score_id") REFERENCES "public"."scores"("id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id");



ALTER TABLE ONLY "public"."fixtures"
    ADD CONSTRAINT "fixtures_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id");



ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fixtures" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."goals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leagues" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "modify_events" ON "public"."events" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "modify_fixtures" ON "public"."fixtures" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "modify_goals" ON "public"."goals" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "modify_leagues" ON "public"."leagues" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "modify_periods" ON "public"."periods" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "modify_scores" ON "public"."scores" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "modify_statuses" ON "public"."statuses" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "modify_teams" ON "public"."teams" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "modify_venues" ON "public"."venues" USING (("auth"."role"() = 'authenticated'::"text"));



ALTER TABLE "public"."periods" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."scores" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_events" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "select_fixtures" ON "public"."fixtures" FOR SELECT USING (true);



CREATE POLICY "select_goals" ON "public"."goals" FOR SELECT USING (true);



CREATE POLICY "select_leagues" ON "public"."leagues" FOR SELECT USING (true);



CREATE POLICY "select_periods" ON "public"."periods" FOR SELECT USING (true);



CREATE POLICY "select_scores" ON "public"."scores" FOR SELECT USING (true);



CREATE POLICY "select_statuses" ON "public"."statuses" FOR SELECT USING (true);



CREATE POLICY "select_teams" ON "public"."teams" FOR SELECT USING (true);



CREATE POLICY "select_venues" ON "public"."venues" FOR SELECT USING (true);



ALTER TABLE "public"."statuses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."venues" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";












































































































































































































GRANT ALL ON TABLE "public"."cache" TO "anon";
GRANT ALL ON TABLE "public"."cache" TO "authenticated";
GRANT ALL ON TABLE "public"."cache" TO "service_role";




GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."fixtures" TO "anon";
GRANT ALL ON TABLE "public"."fixtures" TO "authenticated";
GRANT ALL ON TABLE "public"."fixtures" TO "service_role";



GRANT ALL ON SEQUENCE "public"."fixtures_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."fixtures_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."fixtures_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."goals" TO "anon";
GRANT ALL ON TABLE "public"."goals" TO "authenticated";
GRANT ALL ON TABLE "public"."goals" TO "service_role";



GRANT ALL ON SEQUENCE "public"."goals_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."goals_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."goals_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."leagues" TO "anon";
GRANT ALL ON TABLE "public"."leagues" TO "authenticated";
GRANT ALL ON TABLE "public"."leagues" TO "service_role";



GRANT ALL ON SEQUENCE "public"."leagues_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."leagues_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."leagues_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."periods" TO "anon";
GRANT ALL ON TABLE "public"."periods" TO "authenticated";
GRANT ALL ON TABLE "public"."periods" TO "service_role";



GRANT ALL ON SEQUENCE "public"."periods_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."periods_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."periods_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."scores" TO "anon";
GRANT ALL ON TABLE "public"."scores" TO "authenticated";
GRANT ALL ON TABLE "public"."scores" TO "service_role";



GRANT ALL ON SEQUENCE "public"."scores_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."scores_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."scores_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."statuses" TO "anon";
GRANT ALL ON TABLE "public"."statuses" TO "authenticated";
GRANT ALL ON TABLE "public"."statuses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."statuses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."statuses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."statuses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";



GRANT ALL ON SEQUENCE "public"."teams_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."teams_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."teams_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."venues" TO "anon";
GRANT ALL ON TABLE "public"."venues" TO "authenticated";
GRANT ALL ON TABLE "public"."venues" TO "service_role";



GRANT ALL ON SEQUENCE "public"."venues_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."venues_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."venues_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
