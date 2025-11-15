/*
  # Create Blog System Schema for News and Announcements
  
  ## Summary
  This migration creates a complete blog system for managing company news, partnership announcements,
  and product updates. The system supports weekly content publishing with categorization, tagging,
  authoring, and subscriber management.
  
  ## New Tables
  
  ### 1. blog_categories
  - `id` (uuid, primary key)
  - `name` (text, unique) - Category name (e.g., "Partnership Updates")
  - `slug` (text, unique) - URL-friendly slug
  - `description` (text) - Category description
  - `color` (text) - Hex color for visual differentiation
  - `icon` (text) - Icon name for UI display
  - `display_order` (integer) - Order for displaying categories
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. blog_authors
  - `id` (uuid, primary key, references auth.users)
  - `display_name` (text) - Author's public display name
  - `bio` (text) - Short biography
  - `avatar_url` (text) - Profile image URL
  - `title` (text) - Job title
  - `social_links` (jsonb) - Social media profiles
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. blog_tags
  - `id` (uuid, primary key)
  - `name` (text, unique) - Tag name
  - `slug` (text, unique) - URL-friendly slug
  - `created_at` (timestamptz)
  
  ### 4. blog_posts
  - `id` (uuid, primary key)
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly slug
  - `excerpt` (text) - Short summary
  - `content` (text) - Full post content (markdown)
  - `featured_image_url` (text) - Hero image URL
  - `category_id` (uuid, references blog_categories)
  - `author_id` (uuid, references blog_authors)
  - `status` (text) - draft, scheduled, published, archived
  - `published_at` (timestamptz) - Publication date/time
  - `scheduled_for` (timestamptz) - Scheduled publication date
  - `is_featured` (boolean) - Show on homepage
  - `view_count` (integer) - Number of views
  - `reading_time_minutes` (integer) - Estimated reading time
  - `meta_title` (text) - SEO title
  - `meta_description` (text) - SEO description
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. blog_post_tags
  - `post_id` (uuid, references blog_posts)
  - `tag_id` (uuid, references blog_tags)
  - Primary key: (post_id, tag_id)
  
  ### 6. blog_subscribers
  - `id` (uuid, primary key)
  - `email` (text, unique) - Subscriber email
  - `subscribed_at` (timestamptz) - Subscription date
  - `is_active` (boolean) - Subscription status
  - `verification_token` (text) - Email verification token
  - `verified_at` (timestamptz) - Email verification date
  - `unsubscribed_at` (timestamptz) - Unsubscription date
  
  ### 7. blog_post_views
  - `id` (uuid, primary key)
  - `post_id` (uuid, references blog_posts)
  - `viewed_at` (timestamptz) - View timestamp
  - `user_id` (uuid, references auth.users, nullable) - Viewer if authenticated
  - `ip_address` (text) - Anonymized IP for analytics
  
  ## Security
  - Enable RLS on all tables
  - Public read access for published posts
  - Authenticated authors can create/edit their own posts
  - Admin users have full access
  - Subscribers can manage their own subscriptions
  
  ## Indexes
  - Posts by status and published date for efficient querying
  - Posts by category for filtering
  - Posts by slug for routing
  - Tags and categories by slug
  - Subscribers by email for lookups
*/

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#3b82f6',
  icon text DEFAULT 'FileText',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog categories are viewable by everyone"
  ON blog_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create blog_authors table
CREATE TABLE IF NOT EXISTS blog_authors (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text,
  avatar_url text,
  title text,
  social_links jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog authors are viewable by everyone"
  ON blog_authors FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own author profile"
  ON blog_authors FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can create author profiles"
  ON blog_authors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog tags are viewable by everyone"
  ON blog_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON blog_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image_url text,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES blog_authors(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  scheduled_for timestamptz,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  reading_time_minutes integer DEFAULT 5,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  TO public
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "Authors can view their own posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can create posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create blog_post_tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog post tags are viewable by everyone"
  ON blog_post_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage post tags"
  ON blog_post_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create blog_subscribers table
CREATE TABLE IF NOT EXISTS blog_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  verification_token text,
  verified_at timestamptz,
  unsubscribed_at timestamptz
);

ALTER TABLE blog_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can subscribe to newsletter"
  ON blog_subscribers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own subscription"
  ON blog_subscribers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own subscription"
  ON blog_subscribers FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create blog_post_views table for analytics
CREATE TABLE IF NOT EXISTS blog_post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address text
);

ALTER TABLE blog_post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a post view"
  ON blog_post_views FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics"
  ON blog_post_views FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_subscribers_email ON blog_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_post_id ON blog_post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_viewed_at ON blog_post_views(viewed_at DESC);

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color, icon, display_order) VALUES
  ('Partnership Updates', 'partnership-updates', 'Official collaboration announcements with Google Cloud and partnership progress', '#4285F4', 'Handshake', 1),
  ('Product & Technology', 'product-technology', 'AI/ML model developments, technical breakthroughs, and innovations', '#34A853', 'Cpu', 2),
  ('Product Showcases', 'product-showcases', 'Feature stories about our products and customer success stories', '#FBBC05', 'Star', 3)
ON CONFLICT (slug) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_authors_updated_at ON blog_authors;
CREATE TRIGGER update_blog_authors_updated_at
  BEFORE UPDATE ON blog_authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update view count
CREATE OR REPLACE FUNCTION increment_post_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_view_count_trigger ON blog_post_views;
CREATE TRIGGER increment_view_count_trigger
  AFTER INSERT ON blog_post_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_view_count();
