import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact';

const router = express.Router();

// Submit contact form (public)
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, message } = req.body;

    // Create new contact message
    const contactMessage = new Contact({
      name,
      email,
      message
    });

    await contactMessage.save();

    res.status(201).json({
      message: 'Thank you for your message. We will get back to you soon.',
      id: contactMessage._id
    });

  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Server error processing your message' });
  }
});

export default router;