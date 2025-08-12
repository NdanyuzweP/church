import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Home, 
  FileText, 
  MapPin, 
  Users, 
  MessageSquare, 
  Plus,
  Edit,
  Trash2,
  Calendar,
  X,
  Save,
  Headphones,
  BookOpen,
  Mail,
  Eye,
  Tag,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  sermons: number;
  missions: number;
  ministries: number;
  contactMessages: number;
}

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

interface Mission {
  _id: string;
  name: string;
  description: string;
  purpose: string;
  startDate: string;
  endDate?: string;
  status: string;
  imageUrl?: string;
  locations: Array<{
    name: string;
    address: string;
    description: string;
  }>;
  updates: Array<{
    title: string;
    content: string;
    date: Date;
    photos: string[];
  }>;
  budget?: number;
  teamMembers?: string[];
}

interface Ministry {
  _id: string;
  name: string;
  description: string;
  leader: string;
  meetingTime: string;
  imageUrl?: string;
  isActive: boolean;
}

interface Article {
  _id: string;
  title: string;
  author: string;
  content: string;
  excerpt: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
  isPublished: boolean;
  publishDate?: string;
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    sermons: 0,
    missions: 0,
    ministries: 0,
    contactMessages: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [items, setItems] = useState<Sermon[] | Mission[] | Ministry[] | Article[] | Audio[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    if (activeTab !== 'overview') {
      fetchItems();
    }
  }, [navigate, activeTab]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      // Fetch all stats in parallel
      const [sermonsRes, missionsRes, ministriesRes, messagesRes] = await Promise.all([
        axios.get('http://localhost:5001/api/admin/sermons', config),
        axios.get('http://localhost:5001/api/admin/missions', config),
        axios.get('http://localhost:5001/api/admin/ministries', config),
        axios.get('http://localhost:5001/api/admin/contact-messages', config)
      ]);

      setStats({
        sermons: sermonsRes.data.length,
        missions: missionsRes.data.length,
        ministries: ministriesRes.data.length,
        contactMessages: messagesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock data for demonstration
      setStats({
        sermons: 45,
        missions: 3,
        ministries: 5,
        contactMessages: 12
      });
    }
  };

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get(`http://localhost:5001/api/admin/${activeTab}`, config);
      setItems(response.data);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    }
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setIsEditing(false);
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (item: any) => {
    setShowAddForm(true);
    setIsEditing(true);
    setEditingId(item._id);
    setFormData(item);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      await axios.delete(`http://localhost:5001/api/admin/${activeTab}/${id}`, config);
      
      fetchItems();
      fetchStats();
    } catch (error: any) {
      console.error(`Error deleting ${activeTab.slice(0, -1)}:`, error);
      alert(error.response?.data?.message || 'Error deleting item');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      // Prepare data for submission
      const submitData = { ...formData };
      
      // Convert date strings to proper format if needed
      if (activeTab === 'sermons' && submitData.date) {
        submitData.date = new Date(submitData.date).toISOString();
      }
      if (activeTab === 'missions') {
        if (submitData.startDate) {
          submitData.startDate = new Date(submitData.startDate).toISOString();
        }
        if (submitData.endDate) {
          submitData.endDate = new Date(submitData.endDate).toISOString();
        }
      }
      if (activeTab === 'articles') {
        if (submitData.publishDate) {
          submitData.publishDate = new Date(submitData.publishDate).toISOString();
        } else if (submitData.publishDate === '') {
          delete submitData.publishDate;
        }
        if (typeof submitData.tags === 'string') {
          submitData.tags = submitData.tags
            .split(',')
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0);
        }
      }
      
      // Convert boolean fields
      if (activeTab === 'ministries' && submitData.isActive !== undefined) {
        submitData.isActive = Boolean(submitData.isActive);
      }
      
      console.log('Submitting data:', submitData);
      
      if (isEditing && editingId) {
        // Update existing item
        await axios.put(`http://localhost:5001/api/admin/${activeTab}/${editingId}`, submitData, config);
      } else {
        // Create new item
        await axios.post(`http://localhost:5001/api/admin/${activeTab}`, submitData, config);
      }
      
      setShowAddForm(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({});
      fetchItems();
      fetchStats();
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} ${activeTab.slice(0, -1)}:`, error);
      console.error('Error details:', error.response?.data);
      alert(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || `Error ${isEditing ? 'updating' : 'creating'} item`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'sermons', label: 'Sermons', icon: FileText },
    { id: 'audio', label: 'Audio', icon: Headphones },
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'missions', label: 'Missions', icon: MapPin },
    { id: 'ministries', label: 'Ministries', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const renderAddForm = () => {
    if (!showAddForm) return null;

    const getFormFields = () => {
      switch (activeTab) {
        case 'sermons':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Expository">Expository</option>
                  <option value="Book Study">Book Study</option>
                  <option value="Confession Study">Confession Study</option>
                  <option value="Topical">Topical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube)</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">Paste the full YouTube URL here</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL</label>
                <input
                  type="url"
                  name="audioUrl"
                  value={formData.audioUrl || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/audio.mp3"
                />
                <p className="text-xs text-gray-500 mt-1">Direct link to audio file (MP3, WAV, etc.)</p>
              </div>
            </>
          );
        case 'audio':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Expository">Expository</option>
                  <option value="Book Study">Book Study</option>
                  <option value="Confession Study">Confession Study</option>
                  <option value="Topical">Topical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audio File</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const token = localStorage.getItem('token');
                      const form = new FormData();
                      form.append('audio', file);
                      const res = await fetch('http://localhost:5001/api/admin/uploads/audio', {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                        body: form,
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Upload failed');
                      setFormData((prev: any) => ({ ...prev, audioUrl: data.url }));
                    } catch (err: any) {
                      alert(err.message || 'Error uploading audio');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formData.audioUrl && (
                  <div className="mt-2">
                    <audio controls className="w-full">
                      <source src={formData.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="1"
                  max="300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scriptures</label>
                <input
                  type="text"
                  name="scriptures"
                  value={formData.scriptures || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="John 3:16, Romans 8:28, etc. (comma-separated)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="gospel, salvation, grace, etc. (comma-separated)"
                />
              </div>
            </>
          );
        case 'articles':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Theology, History, Ministry, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Article Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const token = localStorage.getItem('token');
                      const form = new FormData();
                      form.append('image', file);
                      const res = await fetch('http://localhost:5001/api/admin/uploads', {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                        body: form,
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Upload failed');
                      setFormData((prev: any) => ({ ...prev, imageUrl: data.url }));
                    } catch (err: any) {
                      alert(err.message || 'Error uploading image');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img src={formData.imageUrl} alt="Article" className="h-32 w-full object-cover rounded" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Short summary of the article (max 500 chars)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  value={formData.content || ''}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : (formData.tags || '')}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="comma,separated,tags"
                />
                <p className="text-xs text-gray-500 mt-1">Enter tags separated by commas</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Published</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate ? formData.publishDate.substring(0, 10) : ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </>
          );
        case 'missions':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea
                  name="purpose"
                  value={formData.purpose || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="What is the main purpose of this mission?"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const token = localStorage.getItem('token');
                      const form = new FormData();
                      form.append('image', file);
                      const res = await fetch('http://localhost:5001/api/admin/uploads', {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                        body: form,
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Upload failed');
                      setFormData((prev: any) => ({ ...prev, imageUrl: data.url }));
                    } catch (err: any) {
                      alert(err.message || 'Error uploading image');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img src={formData.imageUrl} alt="Mission" className="h-32 w-full object-cover rounded" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </>
          );
        case 'ministries':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea
                  name="purpose"
                  value={formData.purpose || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="What is the main purpose of this ministry?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leader</label>
                <input
                  type="text"
                  name="leader"
                  value={formData.leader || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
                  <input
                    type="text"
                    name="meetingTime"
                    value={formData.meetingTime || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Every Sunday at 2 PM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Location</label>
                  <input
                    type="text"
                    name="meetingLocation"
                    value={formData.meetingLocation || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Main Hall"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+250..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                  <input
                    type="text"
                    name="ageGroup"
                    value={formData.ageGroup || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Youth, Adults"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min={1}
                    max={1000}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ministry Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const token = localStorage.getItem('token');
                      const form = new FormData();
                      form.append('image', file);
                      const res = await fetch('http://localhost:5001/api/admin/uploads', {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                        body: form,
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Upload failed');
                      setFormData((prev: any) => ({ ...prev, imageUrl: data.url }));
                    } catch (err: any) {
                      alert(err.message || 'Error uploading image');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img src={formData.imageUrl} alt="Ministry" className="h-32 w-full object-cover rounded" />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Active Ministry</label>
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {getFormFields()}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{isEditing ? 'Update' : 'Save'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderItemsList = () => {
    if (activeTab === 'overview') return null;

    return (
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item._id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {item.title || item.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {activeTab === 'sermons' && `${item.speaker} • ${new Date(item.date).toLocaleDateString()}`}
                  {activeTab === 'articles' && `${item.author} • ${item.isPublished ? 'Published' : 'Draft'}${item.publishDate ? ' • ' + new Date(item.publishDate).toLocaleDateString() : ''}`}
                  {activeTab === 'missions' && `${item.location} • ${item.status}`}
                  {activeTab === 'ministries' && `${item.leader} • ${item.meetingTime}`}
                </p>
                {activeTab === 'articles' && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.excerpt}</p>
                )}
                {activeTab === 'sermons' && (item.videoUrl || item.audioUrl) && (
                  <div className="flex space-x-2 mt-2">
                    {item.videoUrl && (
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        📹 Watch
                      </a>
                    )}
                    {item.audioUrl && (
                      <a
                        href={item.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700"
                      >
                        🎵 Listen
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(item)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} found. Click "Add New" to create one.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold  text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">Reformation Baptist Church of Kigali</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-md">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors duration-200 ${
                            activeTab === item.id
                              ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-primary-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Sermons</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.sermons}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <MapPin className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Missions</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.missions}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-primary-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Ministries</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.ministries}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <MessageSquare className="h-8 w-8 text-yellow-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Messages</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.contactMessages}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">New sermon uploaded: "The Sovereignty of God"</span>
                      <span className="text-gray-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Mission update added for Rural Church Planting</span>
                      <span className="text-gray-400">1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">New contact message received</span>
                      <span className="text-gray-400">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs */}
            {activeTab !== 'overview' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab} Management</h2>
                  <button 
                    onClick={handleAddNew}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New</span>
                  </button>
                </div>

                {renderAddForm()}
                {renderItemsList()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;