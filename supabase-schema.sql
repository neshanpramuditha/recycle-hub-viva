-- Recycle Hub Database Schema for Supabase
-- This file contains all the SQL queries needed to set up your database

-- Enable Row Level Security (RLS) for all tables
-- Run these in the Supabase SQL editor

-- 1. Create Users Profile Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_ratings INTEGER DEFAULT 0,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id INTEGER REFERENCES categories(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  condition TEXT CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Poor')) NOT NULL,
  is_negotiable BOOLEAN DEFAULT FALSE,
  location TEXT NOT NULL,
  status TEXT CHECK (status IN ('available', 'sold', 'reserved', 'inactive')) DEFAULT 'available',
  views INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create Product Specifications Table
CREATE TABLE IF NOT EXISTS product_specifications (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  spec_name TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Create Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 7. Create Messages/Chat Table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Create Reviews/Ratings Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewed_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(reviewer_id, reviewed_user_id, product_id)
);

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);

-- 10. Insert default categories
INSERT INTO categories (name, description, icon_url) VALUES 
('Electronics', 'Electronic devices, gadgets, and accessories', '/icons/electronics.svg'),
('Furniture', 'Home and office furniture items', '/icons/furniture.svg'),
('Sports', 'Sports equipment and fitness gear', '/icons/sports.svg'),
('Clothing', 'Clothes, shoes, and fashion accessories', '/icons/clothing.svg'),
('Books', 'Books, magazines, and educational materials', '/icons/books.svg'),
('Vehicle Parts', 'Car, bike, and vehicle accessories', '/icons/vehicle.svg'),
('Others', 'Miscellaneous items', '/icons/others.svg')
ON CONFLICT (name) DO NOTHING;

-- 11. Create Row Level Security (RLS) policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view all profiles (for seller info)
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies (public read)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Products policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view available products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (status = 'available' OR seller_id = auth.uid());

-- Allow authenticated users to insert products
CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

-- Allow users to update their own products
CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = seller_id);

-- Allow users to delete their own products
CREATE POLICY "Users can delete own products" ON products
  FOR DELETE USING (auth.uid() = seller_id);

-- Product images policies
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view product images
CREATE POLICY "Product images are viewable by everyone" ON product_images
  FOR SELECT USING (true);

-- Allow product owners to manage images
CREATE POLICY "Product owners can manage images" ON product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id 
      AND products.seller_id = auth.uid()
    )
  );

-- Product specifications policies
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product specs are viewable by everyone" ON product_specifications
  FOR SELECT USING (true);

CREATE POLICY "Product owners can manage specs" ON product_specifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_specifications.product_id 
      AND products.seller_id = auth.uid()
    )
  );

-- Favorites policies
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Messages policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can send messages" ON messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- Reviews policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);

-- 12. Create functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user rating when a new review is added
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(2,1) 
            FROM reviews 
            WHERE reviewed_user_id = NEW.reviewed_user_id
        ),
        total_ratings = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE reviewed_user_id = NEW.reviewed_user_id
        )
    WHERE id = NEW.reviewed_user_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for rating updates
CREATE TRIGGER update_user_rating_trigger 
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Function to update favorites count
CREATE OR REPLACE FUNCTION update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products 
        SET favorites_count = favorites_count + 1 
        WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE products 
        SET favorites_count = favorites_count - 1 
        WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for favorites count
CREATE TRIGGER favorites_count_trigger 
    AFTER INSERT OR DELETE ON favorites
    FOR EACH ROW EXECUTE FUNCTION update_favorites_count();

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, location)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'location'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(product_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET views = views + 1 
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- 13. Insert sample data for testing

-- Insert sample profiles (you'll need to replace UUIDs with actual user IDs)
-- INSERT INTO profiles (id, email, full_name, phone, location, rating, total_ratings) VALUES 
-- ('550e8400-e29b-41d4-a716-446655440000', 'john.doe@example.com', 'John Doe', '+94 77 123 4567', 'Colombo, Sri Lanka', 4.5, 10),
-- ('550e8400-e29b-41d4-a716-446655440001', 'sarah.smith@example.com', 'Sarah Smith', '+94 76 987 6543', 'Kandy, Sri Lanka', 4.8, 15);

-- 14. Create views for common queries

-- View for products with seller info and category
CREATE OR REPLACE VIEW products_with_details AS
SELECT 
    p.*,
    pr.full_name as seller_name,
    pr.phone as seller_phone,
    pr.email as seller_email,
    pr.location as seller_location,
    pr.avatar_url as seller_avatar_url,
    pr.rating as seller_rating,
    pr.total_ratings as seller_total_ratings,
    pr.bio as seller_bio,
    pr.is_verified as seller_is_verified,
    c.name as category_name,
    c.description as category_description,
    COALESCE(pi.image_url, '/image/placeholder.jpg') as primary_image
FROM products p
LEFT JOIN profiles pr ON p.seller_id = pr.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true;

-- Add search_vector column to products table for full-text search
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        NEW.title || ' ' || NEW.description || ' ' || 
        COALESCE((SELECT name FROM categories WHERE id = NEW.category_id), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector
CREATE TRIGGER update_product_search_vector_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- Create index for full-text search on the actual column
CREATE INDEX IF NOT EXISTS idx_product_search_vector ON products USING gin(search_vector);

-- Update existing products search vectors
UPDATE products SET search_vector = to_tsvector('english', 
    title || ' ' || description || ' ' || 
    COALESCE((SELECT name FROM categories WHERE id = products.category_id), '')
);

-- View for product search (simplified since search_vector is now in the table)
CREATE OR REPLACE VIEW product_search AS
SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.original_price,
    p.condition,
    p.location,
    p.views,
    p.favorites_count,
    p.created_at,
    p.search_vector,
    pr.full_name as seller_name,
    c.name as category_name,
    pi.image_url as primary_image
FROM products p
LEFT JOIN profiles pr ON p.seller_id = pr.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
WHERE p.status = 'available';

-- Add notification preferences column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"emailNotifications": true, "productNotifications": true, "marketingEmails": false}';
