-- Storage Policies for Images Bucket
-- Note: Service role key automatically bypasses all RLS policies
-- These policies are for public access and authenticated users

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update images" ON storage.objects;

-- Policy 1: Allow public read access to images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy 2: Allow upload images (Service role bypasses this automatically)
CREATE POLICY "Service role can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Policy 3: Allow delete images
CREATE POLICY "Service role can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- Policy 4: Allow update images
CREATE POLICY "Service role can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

