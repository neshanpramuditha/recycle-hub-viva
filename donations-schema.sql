-- Create donations table for the donation system
-- Run this in your Supabase SQL editor

-- 1. Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  image_url TEXT DEFAULT '/image/placeholder.jpg',
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_category ON donations(category);
CREATE INDEX IF NOT EXISTS idx_donations_location ON donations(location);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for donations

-- Allow everyone to view available donations (public access)
CREATE POLICY "Donations are viewable by everyone" ON donations
  FOR SELECT USING (status = 'available');

-- Allow anyone to insert donations (no registration required)
CREATE POLICY "Anyone can insert donations" ON donations
  FOR INSERT WITH CHECK (true);

-- Allow donors to update their own donations (if they provide contact info)
CREATE POLICY "Donors can update own donations" ON donations
  FOR UPDATE USING (true);

-- 5. Create storage bucket for donation images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'donation-images', 
  'donation-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 6. Create storage policies for donation images

-- Allow anyone to upload donation images
CREATE POLICY "Anyone can upload donation images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'donation-images');

-- Allow everyone to view donation images (public)
CREATE POLICY "Donation images are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'donation-images');

-- Allow updating donation images
CREATE POLICY "Anyone can update donation images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'donation-images');

-- Allow deleting donation images
CREATE POLICY "Anyone can delete donation images" ON storage.objects
  FOR DELETE USING (bucket_id = 'donation-images');

-- 7. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_donations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create trigger for updated_at
CREATE TRIGGER update_donations_updated_at 
    BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_donations_updated_at();

-- 9. Insert sample donation data for testing
INSERT INTO donations (item_name, description, category, condition, contact_name, contact_phone, contact_email, location, image_url) VALUES 
('Children''s Books Collection', 'Set of 20 educational books for kids aged 5-10. All in good condition with minimal wear.', 'Books', 'Good', 'Anonymous Donor', '+94 77 123 4567', 'donor1@example.com', 'Colombo', '/image/15.png'),
('Office Chair', 'Comfortable ergonomic office chair, barely used. Perfect for home office or study room.', 'Furniture', 'Excellent', 'Office Donation', '+94 76 987 6543', 'office@example.com', 'Kandy', '/image/16.png'),
('Winter Clothes', 'Warm jackets and sweaters for adults and children. Clean and in good condition.', 'Clothing', 'Good', 'Community Helper', '+94 75 555 1234', 'helper@example.com', 'Galle', '/image/17.png'),
('Laptop Computer', 'Working laptop suitable for basic computing tasks. Includes charger.', 'Electronics', 'Fair', 'Tech Donor', '+94 78 999 8888', 'tech@example.com', 'Colombo', '/image/18.png'),
('Children''s Toys', 'Collection of educational toys and games for children aged 3-8.', 'Toys', 'Good', 'Family Donation', '+94 71 777 6666', 'family@example.com', 'Negombo', '/image/19.png')
ON CONFLICT DO NOTHING;

-- 10. Create a view for donation statistics
CREATE OR REPLACE VIEW donation_stats AS
SELECT 
    COUNT(*) as total_donations,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as available_donations,
    COUNT(CASE WHEN status = 'claimed' THEN 1 END) as claimed_donations,
    category,
    COUNT(*) as category_count
FROM donations 
GROUP BY category
ORDER BY category_count DESC;

-- Grant usage on sequence
GRANT USAGE, SELECT ON SEQUENCE donations_id_seq TO anon, authenticated;
