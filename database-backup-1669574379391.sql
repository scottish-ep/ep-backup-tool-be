--
-- PostgreSQL database dump
--

-- Dumped from database version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 14.0

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: testing; Type: TABLE; Schema: public; Owner: epadmin
--

CREATE TABLE public.testing (
    id integer NOT NULL
);


ALTER TABLE public.testing OWNER TO epadmin;

--
-- Name: testing_id_seq; Type: SEQUENCE; Schema: public; Owner: epadmin
--

CREATE SEQUENCE public.testing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.testing_id_seq OWNER TO epadmin;

--
-- Name: testing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: epadmin
--

ALTER SEQUENCE public.testing_id_seq OWNED BY public.testing.id;


--
-- Name: testing id; Type: DEFAULT; Schema: public; Owner: epadmin
--

ALTER TABLE ONLY public.testing ALTER COLUMN id SET DEFAULT nextval('public.testing_id_seq'::regclass);


--
-- Data for Name: testing; Type: TABLE DATA; Schema: public; Owner: epadmin
--

COPY public.testing (id) FROM stdin;
\.


--
-- Name: testing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: epadmin
--

SELECT pg_catalog.setval('public.testing_id_seq', 1, false);


--
-- Name: testing testing_pkey; Type: CONSTRAINT; Schema: public; Owner: epadmin
--

ALTER TABLE ONLY public.testing
    ADD CONSTRAINT testing_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

