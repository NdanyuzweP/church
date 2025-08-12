import mongoose from 'mongoose';
import Sermon from './models/Sermon';
import Article from './models/Article';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reformation-baptist-church';

const sampleSermons = [
  {
    title: 'The Sovereignty of God in Salvation',
    speaker: 'Pastor John Uwimana',
    date: new Date('2024-01-21'),
    category: 'Expository',
    description: 'An exposition of Romans 9:1-29 exploring God\'s sovereign choice in salvation and the doctrine of election.',
    imageUrl: 'https://images.pexels.com/photos/161060/cross-against-the-sky-161060.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    audioUrl: 'https://example.com/audio/sermon1.mp3'
  },
  {
    title: 'The Perseverance of the Saints',
    speaker: 'Pastor Emmanuel Nzeyimana',
    date: new Date('2024-01-14'),
    category: 'Confession Study',
    description: 'Study from the 1689 London Baptist Confession on the doctrine of perseverance and eternal security.',
    imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example2'
  },
  {
    title: 'Justification by Faith Alone',
    speaker: 'Pastor John Uwimana',
    date: new Date('2024-01-07'),
    category: 'Book Study',
    description: 'Continuing our study through Galatians on the doctrine of justification and the gospel of grace.',
    imageUrl: 'https://images.pexels.com/photos/161060/cross-against-the-sky-161060.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    audioUrl: 'https://example.com/audio/sermon3.mp3'
  },
  {
    title: 'The Five Solas of the Reformation',
    speaker: 'Pastor Emmanuel Nzeyimana',
    date: new Date('2023-12-31'),
    category: 'Topical',
    description: 'A comprehensive overview of the five solas that define reformed theology: Sola Scriptura, Sola Fide, Sola Gratia, Solus Christus, and Soli Deo Gloria.',
    imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    audioUrl: 'https://example.com/audio/sermon4.mp3'
  },
  {
    title: 'The Doctrine of Total Depravity',
    speaker: 'Pastor John Uwimana',
    date: new Date('2023-12-24'),
    category: 'Expository',
    description: 'An examination of Romans 3:10-18 and the biblical teaching on the total depravity of man.',
    imageUrl: 'https://images.pexels.com/photos/161060/cross-against-the-sky-161060.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example5'
  }
];

const sampleArticles = [
  {
    title: 'Understanding Reformed Theology',
    author: 'Pastor John Uwimana',
    content: 'Reformed theology, also known as Calvinism, is a theological system that emphasizes the sovereignty of God in all things, including salvation. This article explores the core principles of reformed theology and its biblical foundations.',
    excerpt: 'An introduction to the core principles of reformed theology and its biblical foundations.',
    category: 'Theology',
    isPublished: true,
    publishDate: new Date('2024-01-15')
  },
  {
    title: 'The History of Baptist Churches in Rwanda',
    author: 'Dr. Grace Mukamana',
    content: 'The history of Baptist churches in Rwanda is a story of faith, perseverance, and growth. From the early missionaries to the present day, Baptist churches have played a vital role in the spiritual life of Rwanda.',
    excerpt: 'Exploring the growth and development of Baptist churches in Rwanda over the past century.',
    category: 'History',
    isPublished: true,
    publishDate: new Date('2024-01-10')
  },
  {
    title: 'The Importance of Biblical Preaching',
    author: 'Pastor Emmanuel Nzeyimana',
    content: 'Biblical preaching is the foundation of a healthy church. This article discusses the importance of expository preaching and how it strengthens the church.',
    excerpt: 'Why expository preaching is essential for church health and spiritual growth.',
    category: 'Ministry',
    isPublished: true,
    publishDate: new Date('2024-01-05')
  }
];

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Sermon.deleteMany({});
    await Article.deleteMany({});

    // Insert sample sermons
    const sermons = await Sermon.insertMany(sampleSermons);
    console.log(`Inserted ${sermons.length} sermons`);

    // Insert sample articles
    const articles = await Article.insertMany(sampleArticles);
    console.log(`Inserted ${articles.length} articles`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData(); 