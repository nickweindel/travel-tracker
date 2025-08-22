-- Initialize the travel tracker database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table for states
CREATE TABLE IF NOT EXISTS us_states (
    state_id VARCHAR(2) PRIMARY KEY,
    state_name VARCHAR(14) NOT NULL
);

-- Create table for tracking visited states
CREATE TABLE IF NOT EXISTS states_visited (
    state_id VARCHAR(2) PRIMARY KEY REFERENCES us_states(state_id),
    visited BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create table for countries
CREATE TABLE IF NOT EXISTS countries (
    country_id VARCHAR(2) PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    continent VARCHAR(13) NOT NULL
);

-- Create table for tracking visited countries/continents
CREATE TABLE IF NOT EXISTS countries (
    country_id VARCHAR(2) PRIMARY KEY REFERENCES countries(country_id),
    visited BOOLEAN NOT NULL default FALSE
);

-- Insert US states data
INSERT INTO us_states (state_id, state_name) VALUES 
    ('AL', 'Alabama'),
    ('AK', 'Alaska'),
    ('AZ', 'Arizona'),
    ('AR', 'Arkansas'),
    ('CA', 'California'),
    ('CO', 'Colorado'),
    ('CT', 'Connecticut'),
    ('DE', 'Delaware'),
    ('FL', 'Florida'),
    ('GA', 'Georgia'),
    ('HI', 'Hawaii'),
    ('ID', 'Idaho'),
    ('IL', 'Illinois'),
    ('IN', 'Indiana'),
    ('IA', 'Iowa'),
    ('KS', 'Kansas'),
    ('KY', 'Kentucky'),
    ('LA', 'Louisiana'),
    ('ME', 'Maine'),
    ('MD', 'Maryland'),
    ('MA', 'Massachusetts'),
    ('MI', 'Michigan'),
    ('MN', 'Minnesota'),
    ('MS', 'Mississippi'),
    ('MO', 'Missouri'),
    ('MT', 'Montana'),
    ('NE', 'Nebraska'),
    ('NV', 'Nevada'),
    ('NH', 'New Hampshire'),
    ('NJ', 'New Jersey'),
    ('NM', 'New Mexico'),
    ('NY', 'New York'),
    ('NC', 'North Carolina'),
    ('ND', 'North Dakota'),
    ('OH', 'Ohio'),
    ('OK', 'Oklahoma'),
    ('OR', 'Oregon'),
    ('PA', 'Pennsylvania'),
    ('RI', 'Rhode Island'),
    ('SC', 'South Carolina'),
    ('SD', 'South Dakota'),
    ('TN', 'Tennessee'),
    ('TX', 'Texas'),
    ('UT', 'Utah'),
    ('VT', 'Vermont'),
    ('VA', 'Virginia'),
    ('WA', 'Washington'),
    ('WV', 'West Virginia'),
    ('WI', 'Wisconsin'),
    ('WY', 'Wyoming')
ON CONFLICT (state_id) DO NOTHING;