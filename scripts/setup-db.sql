-- Create the database if it doesn't exist
CREATE DATABASE ai_curator;

-- Connect to the database
\c ai_curator;

-- Create the schema
CREATE SCHEMA IF NOT EXISTS public;

-- Create a user (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'ai_curator_user') THEN
    CREATE USER ai_curator_user WITH PASSWORD '010220';
  END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ai_curator TO ai_curator_user;