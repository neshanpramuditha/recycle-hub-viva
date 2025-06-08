-- Supabase Storage Setup for Product Images
-- Run these commands in your Supabase SQL Editor

-- 1. Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up storage policies

-- Allow anyone to view/download images (public bucket)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects 
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'product-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images" ON storage.objects 
  FOR DELETE TO authenticated 
  USING (
    bucket_id = 'product-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own images
CREATE POLICY "Users can update own images" ON storage.objects 
  FOR UPDATE TO authenticated 
  USING (
    bucket_id = 'product-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Alternative: If you want to organize by user folders, use this naming pattern:
-- {user_id}/product-{product_id}-{index}-{timestamp}.{ext}

-- For user-specific folder organization:
CREATE POLICY "Users can upload to own folder" ON storage.objects 
  FOR INSERT TO authenticated 
  WITH CHECK (
    bucket_id = 'product-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
