import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Calendar, User, Tag } from 'lucide-react';
import axios from 'axios';
import { getYouTubeInfo } from '../utils/youtube';
import VideoPlayer from '../components/VideoPlayer';

interface Sermon {
  _id: string;
  title: string;
  speaker: string;
  date: string;
  category: string;
  description: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

interface Article {
  _id: string;
  title: string;
  author: string;
  date?: string;
  publishDate?: string;
  category?: string;
  imageUrl?: string;
  content: string;
  excerpt: string;
}

interface Audio {
  _id: string;
  title: string;
  speaker: string;
  date: string;
  category: string;
  description: string;
  audioUrl: string;
  duration?: number;
  scriptures: string[];
  tags: string[];
}

const Resources = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [audio, setAudio] = useState<Audio[]>([]);
  const [activeTab, setActiveTab] = useState<'sermons' | 'audio' | 'video' | 'articles'>('sermons');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  const categories = ['All', 'Expository', 'Book Study', 'Confession Study', 'Topical'];

  useEffect(() => {
    fetchSermons();
    fetchArticles();
    fetchAudio();
  }, []);

  const fetchSermons = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/sermons');
      setSermons(response.data.sermons || response.data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      // Mock data for demonstration
      setSermons([
        {
          _id: '1',
          title: 'The Sovereignty of God in Salvation',
          speaker: 'Pastor John Uwimana',
          date: '2024-01-21',
          category: 'Expository',
          description: 'An exposition of Romans 9:1-29 exploring God\'s sovereign choice in salvation.',
          imageUrl: 'https://images.pexels.com/photos/161060/cross-against-the-sky-161060.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          videoUrl: 'https://www.youtube.com/watch?v=example1',
          audioUrl: 'https://example.com/audio/sermon1.mp3'
        },
        {
          _id: '2',
          title: 'The Perseverance of the Saints',
          speaker: 'Pastor Emmanuel Nzeyimana',
          date: '2024-01-14',
          category: 'Confession Study',
          description: 'Study from the 1689 London Baptist Confession on the doctrine of perseverance.',
          imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          videoUrl: 'https://www.youtube.com/watch?v=example2'
        },
        {
          _id: '3',
          title: 'Justification by Faith Alone',
          speaker: 'Pastor John Uwimana',
          date: '2024-01-07',
          category: 'Book Study',
          description: 'Continuing our study through Galatians on the doctrine of justification.',
          imageUrl: 'https://images.pexels.com/photos/161060/cross-against-the-sky-161060.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          audioUrl: 'https://example.com/audio/sermon3.mp3'
        }
      ]);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/sermons/articles');
      setArticles(response.data.articles || response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Mock data for demonstration
      setArticles([
        {
          _id: '1',
          title: 'Understanding Reformed Theology',
          author: 'Pastor John Uwimana',
          date: '2024-01-15',
          content: 'Reformed theology...',
          excerpt: 'An introduction to the core principles of reformed theology and its biblical foundations.'
        },
        {
          _id: '2',
          title: 'The History of Baptist Churches in Rwanda',
          author: 'Dr. Grace Mukamana',
          date: '2024-01-10',
          content: 'The history of Baptist churches...',
          excerpt: 'Exploring the growth and development of Baptist churches in Rwanda over the past century.'
        }
      ]);
    }
  };

  const fetchAudio = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/audio');
      setAudio(response.data.audio || response.data);
    } catch (error) {
      console.error('Error fetching audio:', error);
      // Mock data for demonstration
      setAudio([
        {
          _id: '1',
          title: 'The Doctrine of Grace',
          speaker: 'Pastor John Uwimana',
          date: '2024-01-20',
          category: 'Expository',
          description: 'An in-depth study of God\'s grace in salvation.',
          audioUrl: 'https://example.com/audio/grace.mp3',
          duration: 45,
          scriptures: ['Ephesians 2:8-9', 'Romans 3:23-24'],
          tags: ['grace', 'salvation', 'reformed']
        },
        {
          _id: '2',
          title: 'Baptist Confession Study',
          speaker: 'Pastor Emmanuel Nzeyimana',
          date: '2024-01-18',
          category: 'Confession Study',
          description: 'Study of the 1689 London Baptist Confession.',
          audioUrl: 'https://example.com/audio/confession.mp3',
          duration: 60,
          scriptures: ['2 Timothy 3:16-17'],
          tags: ['confession', 'doctrine', 'baptist']
        }
      ]);
    }
  };

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || sermon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter(article => {
    return article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           article.author.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access our collection of sermons, Bible studies, and articles to grow 
            in your understanding of God's Word and reformed theology.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('sermons')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'sermons'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sermons
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'audio'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Audio
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'video'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Video
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'articles'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Articles
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            {activeTab === 'sermons' && (
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Sermons Tab */}
        {activeTab === 'sermons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon, index) => (
              <div 
                key={sermon._id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Sermon Image/Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                  {sermon.imageUrl ? (
                    <img 
                      src={sermon.imageUrl} 
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                    />
                  ) : sermon.videoUrl && getYouTubeInfo(sermon.videoUrl) ? (
                    <img 
                      src={getYouTubeInfo(sermon.videoUrl)!.thumbnailUrl} 
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const videoId = getYouTubeInfo(sermon.videoUrl!)?.videoId;
                        if (videoId) {
                          target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play className="h-16 w-16 text-white opacity-60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-sm font-medium text-white bg-primary-500 px-3 py-1 rounded-full shadow-md">
                      {sermon.category}
                    </span>
                  </div>
                  
                  {/* Play Button Overlay for Video */}
                  {sermon.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setSelectedVideo({ url: sermon.videoUrl!, title: sermon.title })}
                        className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200 hover:scale-110 transform cursor-pointer"
                        title="Click to play video"
                      >
                        <Play className="h-8 w-8" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Sermon Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold  text-gray-900 mb-2">
                    {sermon.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{sermon.speaker}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(sermon.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {sermon.description}
                  </p>
                  <div className="flex space-x-2">
                    {sermon.audioUrl && (
                      <a
                        href={sermon.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 bg-primary-500 text-white px-3 py-2 rounded-md hover:bg-primary-600 transition-colors duration-200"
                      >
                        <Play className="h-4 w-4" />
                        <span>Audio</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Audio Tab */}
        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audio.map((audioItem, index) => (
              <div 
                key={audioItem._id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Audio Image */}
                <div className="h-48 bg-gradient-to-br from-accent-400 to-accent-600 relative">
                  <div className="flex items-center justify-center h-full">
                    <Play className="h-16 w-16 text-white opacity-60" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-sm font-medium text-white bg-accent-500 px-3 py-1 rounded-full shadow-md">
                      {audioItem.category}
                    </span>
                  </div>
                </div>

                {/* Audio Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold  text-gray-900 mb-2">
                    {audioItem.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{audioItem.speaker}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(audioItem.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {audioItem.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4 text-accent-500" />
                      <span className="text-sm text-gray-500">
                        {audioItem.duration ? `${audioItem.duration} min` : 'Audio'}
                      </span>
                    </div>
                    <a
                      href={audioItem.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      className="flex items-center space-x-1 bg-accent-500 text-white px-3 py-2 rounded-md hover:bg-accent-600 transition-colors duration-200"
                      >
                        <Play className="h-4 w-4" />
                      <span>Listen</span>
                      </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Tab */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.filter(sermon => sermon.videoUrl).map((sermon, index) => (
              <div 
                key={sermon._id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Video Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 relative">
                  {sermon.videoUrl && getYouTubeInfo(sermon.videoUrl) ? (
                    <img 
                      src={getYouTubeInfo(sermon.videoUrl)!.thumbnailUrl} 
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const videoId = getYouTubeInfo(sermon.videoUrl!)?.videoId;
                        if (videoId) {
                          target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play className="h-16 w-16 text-white opacity-60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-sm font-medium text-white bg-red-500 px-3 py-1 rounded-full shadow-md">
                      {sermon.category}
                    </span>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setSelectedVideo({ url: sermon.videoUrl!, title: sermon.title })}
                      className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200 hover:scale-110 transform cursor-pointer"
                      title="Click to play video"
                    >
                      <Play className="h-8 w-8" />
                    </button>
                  </div>
                </div>

                {/* Video Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold  text-gray-900 mb-2">
                    {sermon.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{sermon.speaker}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(sermon.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {sermon.description}
                  </p>
                  <button
                    onClick={() => setSelectedVideo({ url: sermon.videoUrl!, title: sermon.title })}
                    className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    <Play className="h-4 w-4" />
                    <span>Watch Video</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <div 
                key={article._id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Article Image */}
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                  {article.imageUrl ? (
                    <img 
                      src={article.imageUrl.startsWith('http') ? article.imageUrl : `http://localhost:5001${article.imageUrl}`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Tag className="h-12 w-12 text-white opacity-70" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20" />

                  {/* Category Badge */}
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <span className="text-sm font-medium text-white bg-primary-500 px-3 py-1 rounded-full shadow-md">
                        {article.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold  text-gray-900 mb-2">
                  {article.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                      <span>{new Date(article.publishDate || article.date || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <a href={`/resources/articles/${article._id}`} className="text-primary-500 hover:text-primary-600 font-medium">
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'sermons' && filteredSermons.length === 0) || 
          (activeTab === 'audio' && audio.length === 0) ||
          (activeTab === 'video' && sermons.filter(s => s.videoUrl).length === 0) ||
          (activeTab === 'articles' && filteredArticles.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
      
      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default Resources;