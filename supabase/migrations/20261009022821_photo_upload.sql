INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

CREATE POLICY "Allow uploads for authenticated users"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'photos' AND auth.uid() IS NOT NULL
);

CREATE TABLE public.state_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id text NOT NULL,
    state_id text NOT NULL,

    storage_path text NOT NULL,
    caption text,
    created_at timestamp DEFAULT now(),

    FOREIGN KEY (
        user_id,
        state_id
    ) REFERENCES public.states_visited(
        user_id,
        state_id
    ) ON DELETE CASCADE
);

CREATE TABLE public.country_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id text NOT NULL,
    country_id text NOT NULL,

    storage_path text NOT NULL,
    caption text,
    created_at timestamp DEFAULT now(),

    FOREIGN KEY (
        user_id,
        country_id
    ) REFERENCES public.countries_visited(
        user_id,
        country_id
    ) ON DELETE CASCADE
);

CREATE TABLE public.national_park_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id text NOT NULL,
    park_id text NOT NULL,

    storage_path text NOT NULL,
    caption text,
    created_at timestamp DEFAULT now(),

    FOREIGN KEY (
        user_id,
        park_id
    ) REFERENCES public.national_parks_visited(
        user_id,
        park_id
    ) ON DELETE CASCADE
);