-- Super Simple Bucket Creation (No Policies)
-- This avoids permission issues by only creating buckets
-- Policies can be set up through the Supabase UI afterward

-- Create storage bucket for product images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for payment receipts (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', false)
ON CONFLICT (id) DO NOTHING;

-- That's it! The buckets are created.
-- For policies, go to Storage > Settings in your Supabase dashboard
-- and set up the policies through the UI instead.
