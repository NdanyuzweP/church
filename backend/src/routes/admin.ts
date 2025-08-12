import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth';
import Sermon from '../models/Sermon';
import Article from '../models/Article';
import Mission from '../models/Mission';
import Ministry from '../models/Ministry';
import Contact from '../models/Contact';
import User from '../models/User';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// File upload setup
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = file.mimetype === 'image/png' ? '.png' : '.jpg';
    const originalExt = path.extname(file.originalname);
    const base = path.basename(file.originalname, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      return cb(null, true);
    }
    cb(new Error('Only PNG or JPG images are allowed'));
  }
});

// Admin login endpoint (no auth required)
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Apply auth middleware to all other admin routes
router.use(authMiddleware);

// Upload endpoint
router.post('/uploads', upload.single('image'), (req: Request, res: Response) => {
  try {
    // Construct public URL from saved file
    const fileName = (req.file as Express.Multer.File).filename;
    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
    res.status(201).json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Dashboard stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [sermonCount, missionCount, ministryCount, contactCount] = await Promise.all([
      Sermon.countDocuments(),
      Mission.countDocuments(),
      Ministry.countDocuments({ isActive: true }),
      Contact.countDocuments({ isRead: false })
    ]);

    res.json({
      sermons: sermonCount,
      missions: missionCount,
      ministries: ministryCount,
      unreadMessages: contactCount
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

// Sermon Management
router.get('/sermons', async (req: Request, res: Response) => {
  try {
    const sermons = await Sermon.find().sort({ date: -1 });
    res.json(sermons);
  } catch (error) {
    console.error('Error fetching sermons for admin:', error);
    res.status(500).json({ message: 'Server error fetching sermons' });
  }
});

router.post('/sermons', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('speaker').trim().isLength({ min: 1, max: 100 }).withMessage('Speaker is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('category').isIn(['Expository', 'Book Study', 'Confession Study', 'Topical']).withMessage('Valid category is required'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('videoUrl').optional().isURL().withMessage('Video URL must be a valid URL'),
  body('audioUrl').optional().isURL().withMessage('Audio URL must be a valid URL')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sermon = new Sermon(req.body);
    await sermon.save();
    
    res.status(201).json(sermon);
  } catch (error) {
    console.error('Error creating sermon:', error);
    res.status(500).json({ message: 'Server error creating sermon' });
  }
});

// Update sermon
router.put('/sermons/:id', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('speaker').trim().isLength({ min: 1, max: 100 }).withMessage('Speaker is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('category').isIn(['Expository', 'Book Study', 'Confession Study', 'Topical']).withMessage('Valid category is required'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('videoUrl').optional().isURL().withMessage('Video URL must be a valid URL'),
  body('audioUrl').optional().isURL().withMessage('Audio URL must be a valid URL')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sermon = await Sermon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sermon) {
      return res.status(404).json({ message: 'Sermon not found' });
    }

    res.json(sermon);
  } catch (error) {
    console.error('Error updating sermon:', error);
    res.status(500).json({ message: 'Server error updating sermon' });
  }
});

// Delete sermon
router.delete('/sermons/:id', async (req: Request, res: Response) => {
  try {
    const sermon = await Sermon.findByIdAndDelete(req.params.id);

    if (!sermon) {
      return res.status(404).json({ message: 'Sermon not found' });
    }

    res.json({ message: 'Sermon deleted successfully' });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    res.status(500).json({ message: 'Server error deleting sermon' });
  }
});

// Mission Management
router.get('/missions', async (req: Request, res: Response) => {
  try {
    const missions = await Mission.find().sort({ startDate: -1 });
    res.json(missions);
  } catch (error) {
    console.error('Error fetching missions for admin:', error);
    res.status(500).json({ message: 'Server error fetching missions' });
  }
});

router.post('/missions', [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Name is required'),
  body('location').trim().isLength({ min: 1, max: 200 }).withMessage('Location is required'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('purpose').trim().isLength({ min: 10, max: 500 }).withMessage('Purpose must be between 10 and 500 characters'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('status').isIn(['Active', 'Completed', 'On Hold']).withMessage('Valid status is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mission = new Mission(req.body);
    await mission.save();
    
    res.status(201).json(mission);
  } catch (error) {
    console.error('Error creating mission:', error);
    res.status(500).json({ message: 'Server error creating mission' });
  }
});

// Update mission
router.put('/missions/:id', [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Name is required'),
  body('location').trim().isLength({ min: 1, max: 200 }).withMessage('Location is required'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('purpose').trim().isLength({ min: 10, max: 500 }).withMessage('Purpose must be between 10 and 500 characters'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('status').isIn(['Active', 'Completed', 'On Hold']).withMessage('Valid status is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    res.json(mission);
  } catch (error) {
    console.error('Error updating mission:', error);
    res.status(500).json({ message: 'Server error updating mission' });
  }
});

// Delete mission
router.delete('/missions/:id', async (req: Request, res: Response) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    res.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    console.error('Error deleting mission:', error);
    res.status(500).json({ message: 'Server error deleting mission' });
  }
});

// Ministry Management
router.get('/ministries', async (req: Request, res: Response) => {
  try {
    const ministries = await Ministry.find().sort({ name: 1 });
    res.json(ministries);
  } catch (error) {
    console.error('Error fetching ministries for admin:', error);
    res.status(500).json({ message: 'Server error fetching ministries' });
  }
});

router.post('/ministries', [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Name is required'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('leader').trim().isLength({ min: 1, max: 100 }).withMessage('Leader is required'),
  body('purpose').trim().isLength({ min: 1, max: 500 }).withMessage('Purpose is required'),
  body('meetingTime').trim().isLength({ min: 1, max: 100 }).withMessage('Meeting time is required'),
  body('meetingLocation').trim().isLength({ min: 1, max: 200 }).withMessage('Meeting location is required'),
  body('contactPerson').trim().isLength({ min: 1, max: 100 }).withMessage('Contact person is required'),
  body('contactEmail').isEmail().withMessage('Valid contact email is required'),
  body('contactPhone').optional().isString(),
  body('ageGroup').optional().isString(),
  body('capacity').optional().isInt({ min: 1, max: 1000 }).withMessage('Capacity must be between 1 and 1000'),
  body('isActive').isBoolean().withMessage('Active status is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ministry = new Ministry(req.body);
    await ministry.save();
    
    res.status(201).json(ministry);
  } catch (error) {
    console.error('Error creating ministry:', error);
    res.status(500).json({ message: 'Server error creating ministry' });
  }
});

// Update ministry
router.put('/ministries/:id', [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Name is required'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('leader').trim().isLength({ min: 1, max: 100 }).withMessage('Leader is required'),
  body('purpose').trim().isLength({ min: 1, max: 500 }).withMessage('Purpose is required'),
  body('meetingTime').trim().isLength({ min: 1, max: 100 }).withMessage('Meeting time is required'),
  body('meetingLocation').trim().isLength({ min: 1, max: 200 }).withMessage('Meeting location is required'),
  body('contactPerson').trim().isLength({ min: 1, max: 100 }).withMessage('Contact person is required'),
  body('contactEmail').isEmail().withMessage('Valid contact email is required'),
  body('contactPhone').optional().isString(),
  body('ageGroup').optional().isString(),
  body('capacity').optional().isInt({ min: 1, max: 1000 }).withMessage('Capacity must be between 1 and 1000'),
  body('isActive').isBoolean().withMessage('Active status is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ministry = await Ministry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ministry) {
      return res.status(404).json({ message: 'Ministry not found' });
    }

    res.json(ministry);
  } catch (error) {
    console.error('Error updating ministry:', error);
    res.status(500).json({ message: 'Server error updating ministry' });
  }
});

// Delete ministry
router.delete('/ministries/:id', async (req: Request, res: Response) => {
  try {
    const ministry = await Ministry.findByIdAndDelete(req.params.id);

    if (!ministry) {
      return res.status(404).json({ message: 'Ministry not found' });
    }

    res.json({ message: 'Ministry deleted successfully' });
  } catch (error) {
    console.error('Error deleting ministry:', error);
    res.status(500).json({ message: 'Server error deleting ministry' });
  }
});

// Articles Management
router.get('/articles', async (req: Request, res: Response) => {
  try {
    const articles = await Article.find().sort({ publishDate: -1, createdAt: -1 });
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles for admin:', error);
    res.status(500).json({ message: 'Server error fetching articles' });
  }
});

router.post('/articles', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('author').trim().isLength({ min: 1, max: 100 }).withMessage('Author is required'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('excerpt').trim().isLength({ min: 10, max: 500 }).withMessage('Excerpt must be between 10 and 500 characters'),
  body('category').trim().isLength({ min: 1, max: 50 }).withMessage('Category is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be boolean'),
  body('publishDate').optional().isISO8601().withMessage('publishDate must be a valid date')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const article = new Article(req.body);
    await article.save();

    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error creating article' });
  }
});

router.put('/articles/:id', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('author').trim().isLength({ min: 1, max: 100 }).withMessage('Author is required'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('excerpt').trim().isLength({ min: 10, max: 500 }).withMessage('Excerpt must be between 10 and 500 characters'),
  body('category').trim().isLength({ min: 1, max: 50 }).withMessage('Category is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be boolean'),
  body('publishDate').optional().isISO8601().withMessage('publishDate must be a valid date')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error updating article' });
  }
});

router.delete('/articles/:id', async (req: Request, res: Response) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Server error deleting article' });
  }
});

// Contact Messages
router.get('/contact-messages', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    
    let query: any = {};
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      messages,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error fetching contact messages' });
  }
});

// Mark message as read
router.patch('/contact-messages/:id/read', async (req: Request, res: Response) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: 'Server error updating message' });
  }
});

// Delete contact message
router.delete('/contact-messages/:id', async (req: Request, res: Response) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error deleting message' });
  }
});

export default router;