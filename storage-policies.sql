-- Supabase Storage Setup for Product Images and Payment Receipts
-- Run these commands in your Supabase SQL Editor

-- 1. Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up storage policies for product images (using DO blocks to handle existing policies)

-- Allow anyone to view/download images (public bucket)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public Access'
  ) THEN
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
  END IF;
END $$;

-- Allow authenticated users to upload images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload images'
  ) THEN
    CREATE POLICY "Authenticated users can upload images" ON storage.objects 
      FOR INSERT TO authenticated 
      WITH CHECK (bucket_id = 'product-images');
  END IF;
END $$;

-- Allow users to delete their own images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own images'
  ) THEN
    CREATE POLICY "Users can delete own images" ON storage.objects 
      FOR DELETE TO authenticated 
      USING (
        bucket_id = 'product-images' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- Allow users to update their own images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update own images'
  ) THEN
    CREATE POLICY "Users can update own images" ON storage.objects 
      FOR UPDATE TO authenticated 
      USING (
        bucket_id = 'product-images' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- For user-specific folder organization:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload to own folder'
  ) THEN
    CREATE POLICY "Users can upload to own folder" ON storage.objects 
      FOR INSERT TO authenticated 
      WITH CHECK (
        bucket_id = 'product-images' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- 3. Create storage bucket for payment receipts (public bucket for easier access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Set up storage policies for payment receipts

-- Allow users to upload their own payment receipts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload payment receipts'
  ) THEN
    CREATE POLICY "Users can upload payment receipts" ON storage.objects 
      FOR INSERT TO authenticated 
      WITH CHECK (
        bucket_id = 'payment-receipts' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- Allow users to view/download their own payment receipts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can view own payment receipts'
  ) THEN
    CREATE POLICY "Users can view own payment receipts" ON storage.objects 
      FOR SELECT TO authenticated 
      USING (
        bucket_id = 'payment-receipts' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- Allow users to delete their own payment receipts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own payment receipts'
  ) THEN
    CREATE POLICY "Users can delete own payment receipts" ON storage.objects 
      FOR DELETE TO authenticated 
      USING (
        bucket_id = 'payment-receipts' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- Allow admins to view all payment receipts (for verification)
-- First ensure the admin function exists
DO $$
BEGIN
  -- Create admin function if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
    EXECUTE 'CREATE OR REPLACE FUNCTION is_admin()
    RETURNS BOOLEAN AS $func$
    BEGIN
      RETURN (
        SELECT COALESCE(
          (auth.jwt() ->> ''email'') = ''admin@recyclehub.com'' OR
          (auth.jwt() -> ''user_metadata'' ->> ''role'') = ''admin'' OR
          (auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'',
          false
        )
      );
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can view all payment receipts'
  ) THEN
    CREATE POLICY "Admins can view all payment receipts" ON storage.objects 
      FOR SELECT TO authenticated 
      USING (
        bucket_id = 'payment-receipts' AND is_admin()
      );
  END IF;
END $$;

-- Allow admins to delete payment receipts if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete payment receipts'
  ) THEN
    CREATE POLICY "Admins can delete payment receipts" ON storage.objects 
      FOR DELETE TO authenticated 
      USING (
        bucket_id = 'payment-receipts' AND is_admin()
      );
  END IF;
END $$;

-- File naming pattern for payment receipts:
-- payment_receipts/{user_id}/{transaction_id}.{ext}
