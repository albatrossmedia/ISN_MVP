import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url?: string;
  category_id: string;
  author_id: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  published_at?: string;
  scheduled_for?: string;
  is_featured: boolean;
  view_count: number;
  reading_time_minutes: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
  author?: BlogAuthor;
  tags?: BlogTag[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogAuthor {
  id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  title?: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  verified_at?: string;
}

export const blogApi = {
  async getPublishedPosts(limit = 10, offset = 0, categorySlug?: string) {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        author:blog_authors(*)
      `)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (categorySlug) {
      const { data: category } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as BlogPost[];
  },

  async getFeaturedPosts(limit = 3) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        author:blog_authors(*)
      `)
      .eq('status', 'published')
      .eq('is_featured', true)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as BlogPost[];
  },

  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        author:blog_authors(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const { data: tags } = await supabase
        .from('blog_post_tags')
        .select('tag_id, tag:blog_tags(*)')
        .eq('post_id', data.id);

      if (tags) {
        data.tags = tags.map((t: any) => t.tag);
      }
    }

    return data as BlogPost | null;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('display_order');

    if (error) throw error;
    return data as BlogCategory[];
  },

  async getPostsByTag(tagSlug: string, limit = 10) {
    const { data: tag } = await supabase
      .from('blog_tags')
      .select('id')
      .eq('slug', tagSlug)
      .maybeSingle();

    if (!tag) return [];

    const { data: postTags } = await supabase
      .from('blog_post_tags')
      .select('post_id')
      .eq('tag_id', tag.id);

    if (!postTags) return [];

    const postIds = postTags.map(pt => pt.post_id);

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        author:blog_authors(*)
      `)
      .in('id', postIds)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as BlogPost[];
  },

  async recordPostView(postId: string, userId?: string) {
    const { error } = await supabase
      .from('blog_post_views')
      .insert({
        post_id: postId,
        user_id: userId,
        viewed_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  async subscribe(email: string) {
    const { data, error } = await supabase
      .from('blog_subscribers')
      .insert({
        email,
        subscribed_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') {
        throw new Error('This email is already subscribed');
      }
      throw error;
    }

    return data as BlogSubscriber;
  },

  async unsubscribe(email: string) {
    const { error } = await supabase
      .from('blog_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;
  },

  async createPost(post: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as BlogPost;
  },

  async updatePost(id: string, updates: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as BlogPost;
  },

  async deletePost(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getMyPosts(authorId: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        author:blog_authors(*)
      `)
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as BlogPost[];
  },

  async createOrUpdateAuthor(author: Partial<BlogAuthor>) {
    const { data, error } = await supabase
      .from('blog_authors')
      .upsert(author)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as BlogAuthor;
  },

  async addTagsToPost(postId: string, tagIds: string[]) {
    const records = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from('blog_post_tags')
      .insert(records);

    if (error) throw error;
  },

  async removeTagsFromPost(postId: string, tagIds: string[]) {
    const { error } = await supabase
      .from('blog_post_tags')
      .delete()
      .eq('post_id', postId)
      .in('tag_id', tagIds);

    if (error) throw error;
  },

  async getAllTags() {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as BlogTag[];
  },

  async createTag(tag: Partial<BlogTag>) {
    const { data, error } = await supabase
      .from('blog_tags')
      .insert(tag)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as BlogTag;
  }
};
