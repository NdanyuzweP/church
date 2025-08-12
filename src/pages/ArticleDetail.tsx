import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  author: string;
  content: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  tags?: string[];
  isPublished: boolean;
  publishDate?: string;
  createdAt?: string;
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/sermons/articles/${id}`);
        setArticle(res.data);
      } catch (err: any) {
        console.error('Error fetching article:', err);
        setError(err.response?.data?.message || 'Error fetching article');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600 mb-4">{error || 'Article not found'}</p>
          <Link to="/resources" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const displayDate = article.publishDate || article.createdAt;
  const resolvedImageUrl = article.imageUrl
    ? (article.imageUrl.startsWith('http') ? article.imageUrl : `http://localhost:5001${article.imageUrl}`)
    : undefined;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/resources" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Resources
          </Link>
        </div>

        {/* Top Image */}
        {resolvedImageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img src={resolvedImageUrl} alt={article.title} className="w-full h-64 object-cover" />
          </div>
        )}

        <article className="bg-white rounded-lg shadow-md p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold  text-gray-900 mb-2">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center"><User className="h-4 w-4 mr-1" /> {article.author}</span>
              {displayDate && (
                <span className="inline-flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(displayDate).toLocaleDateString()}</span>
              )}
              <span className="inline-flex items-center"><Tag className="h-4 w-4 mr-1" /> {article.category}</span>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <span key={t} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">{t}</span>
                ))}
              </div>
            )}
          </header>

          <section className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line leading-7">{article.content}</p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail; 