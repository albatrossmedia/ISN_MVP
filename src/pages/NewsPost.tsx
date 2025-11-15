import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { blogApi, BlogPost } from '../lib/blogApi';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const NewsPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await blogApi.getPostBySlug(slug!);

      if (!postData) {
        toast.error('Post not found');
        return;
      }

      setPost(postData);

      await blogApi.recordPostView(postData.id);

      if (postData.category) {
        const related = await blogApi.getPublishedPosts(3, 0, postData.category.slug);
        setRelatedPosts(related.filter(p => p.id !== postData.id));
      }
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      '#4285F4': 'bg-blue-500/20 text-blue-400 border-blue-400/20',
      '#34A853': 'bg-green-500/20 text-green-400 border-green-400/20',
      '#FBBC05': 'bg-yellow-500/20 text-yellow-400 border-yellow-400/20',
      '#EA4335': 'bg-red-500/20 text-red-400 border-red-400/20'
    };
    return colors[color] || 'bg-gray-500/20 text-gray-400 border-gray-400/20';
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!post) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">The post you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-6 py-12">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>

        {post.category && (
          <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border mb-6 ${getCategoryColor(post.category.color)}`}>
            {post.category.name}
          </span>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-white/10">
          {post.author && (
            <div className="flex items-center gap-3">
              {post.author.avatar_url ? (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.display_name}
                  className="w-12 h-12 rounded-full border-2 border-white/10"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <p className="text-white font-medium">{post.author.display_name}</p>
                {post.author.title && <p className="text-gray-500 text-sm">{post.author.title}</p>}
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.published_at!)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time_minutes} min read</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {post.featured_image_url && (
          <div className="rounded-2xl overflow-hidden mb-12">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <div
            className="text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-white/10">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/news/tag/${tag.slug}`}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-sm transition-all"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/news/${relatedPost.slug}`}
                  className="group rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-white/20 p-6 backdrop-blur-xl transition-all"
                >
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {relatedPost.excerpt}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatDate(relatedPost.published_at!)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </PublicLayout>
  );
};
