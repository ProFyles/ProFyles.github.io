-- ==========================================
-- PROFILE VIEWS SYSTEM (Once per IP - Forever)
-- ==========================================

CREATE TABLE IF NOT EXISTS profile_views (
    id bigserial PRIMARY KEY,
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    viewer_ip text NOT NULL,
    viewed_at timestamptz DEFAULT now(),
    UNIQUE(profile_id, viewer_ip)
);

CREATE INDEX IF NOT EXISTS idx_profile_views_profile_ip
ON profile_views(profile_id, viewer_ip);

ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all views" ON profile_views;
CREATE POLICY "Allow all views"
ON profile_views FOR ALL TO anon, authenticated
USING (true) WITH CHECK (true);

DROP FUNCTION IF EXISTS increment_views(uuid);
DROP FUNCTION IF EXISTS increment_views(uuid, text);

CREATE OR REPLACE FUNCTION increment_views(
    profile_id uuid, 
    viewer_ip text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM profile_views
        WHERE profile_views.profile_id = increment_views.profile_id
        AND profile_views.viewer_ip = increment_views.viewer_ip
    ) THEN
        INSERT INTO profile_views (profile_id, viewer_ip)
        VALUES (increment_views.profile_id, increment_views.viewer_ip);

        UPDATE profiles
        SET views = COALESCE(views, 0) + 1
        WHERE id = increment_views.profile_id;
    END IF;
END;
$$;

SELECT 'Views system ready!' AS status;
