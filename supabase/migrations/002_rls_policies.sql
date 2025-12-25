-- Enable Row Level Security
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for active sections (for landing page)
CREATE POLICY "Public can view active sections"
    ON sections FOR SELECT
    USING (is_active = true);

-- Public read access for section content (for landing page)
CREATE POLICY "Public can view section content"
    ON section_content FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sections
            WHERE sections.id = section_content.section_id
            AND sections.is_active = true
        )
    );

-- Public read access for pricing plans (for landing page)
CREATE POLICY "Public can view pricing plans"
    ON pricing_plans FOR SELECT
    USING (true);

-- Public read access for active youtube videos (for landing page)
CREATE POLICY "Public can view active youtube videos"
    ON youtube_videos FOR SELECT
    USING (
        is_active = true
        AND EXISTS (
            SELECT 1 FROM sections
            WHERE sections.id = youtube_videos.section_id
            AND sections.is_active = true
        )
    );

-- Public read access for images (for landing page)
CREATE POLICY "Public can view images"
    ON images FOR SELECT
    USING (true);

-- Admin users can do everything
CREATE POLICY "Admin users can manage sections"
    ON sections FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin users can manage section content"
    ON section_content FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin users can manage pricing plans"
    ON pricing_plans FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin users can manage youtube videos"
    ON youtube_videos FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admin users can manage images"
    ON images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.id = auth.uid()
            AND admin_users.role IN ('admin', 'editor')
        )
    );

-- Fix: Admin users can view admin_users (avoid infinite recursion)
-- Service role key automatically bypasses RLS, so backend can always read
-- For authenticated users, allow if they are in the table
CREATE POLICY "Admin users can view admin_users"
    ON admin_users FOR SELECT
    USING (
        -- Allow if user is authenticated and exists in admin_users
        auth.uid() IS NOT NULL
        AND id = auth.uid()
    );

-- Allow service role to bypass RLS (for backend operations)
-- Service role key automatically bypasses RLS, so no policy needed
-- Backend uses SUPABASE_SERVICE_ROLE_KEY which bypasses all RLS

