import express from 'express';
import { body, validationResult } from 'express-validator';
import Sermon from '../models/Sermon';
import Article from '../models/Article';

const router = express.Router();

// Get all sermons (public)
router.get('/', async (req, res) => {
  try {
    const { category, speaker, search, limit = 50, page = 1 } = req.query;
    
    let query: any = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (speaker) {
      query.speaker = new RegExp(speaker as string, 'i');
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') },
        { speaker: new RegExp(search as string, 'i') }
      ];
    }

    const sermons = await Sermon.find(query)
      .sort({ date: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Sermon.countDocuments(query);

    res.json({
      sermons,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching sermons:', error);
    res.status(500).json({ message: 'Server error fetching sermons' });
  }
});

// Get all articles (public)
router.get('/articles', async (req, res) => {
  try {
    const { category, author, search, limit = 10, page = 1 } = req.query;
    
    let query: any = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (author) {
      query.author = new RegExp(author as string, 'i');
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search as string, 'i') },
        { excerpt: new RegExp(search as string, 'i') },
        { content: new RegExp(search as string, 'i') }
      ];
    }

    const articles = await Article.find(query)
      .sort({ publishDate: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error fetching articles' });
  }
});

// Get single article (public)
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article || !article.isPublished) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);

  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Server error fetching article' });
  }
});

// Get single sermon (public) - Must come after /articles routes
router.get('/:id', async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    
    if (!sermon) {
      return res.status(404).json({ message: 'Sermon not found' });
    }

    res.json(sermon);

  } catch (error) {
    console.error('Error fetching sermon:', error);
    res.status(500).json({ message: 'Server error fetching sermon' });
  }
});

export default router;