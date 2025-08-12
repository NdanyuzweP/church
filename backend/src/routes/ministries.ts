import express from 'express';
import Ministry from '../models/Ministry';

const router = express.Router();

// Get all ministries (public)
router.get('/', async (req, res) => {
  try {
    const { ageGroup, search } = req.query;
    
    let query: any = { isActive: true };
    
    if (ageGroup) {
      query.ageGroup = ageGroup;
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') }
      ];
    }

    const ministries = await Ministry.find(query).sort({ name: 1 });

    res.json(ministries);

  } catch (error) {
    console.error('Error fetching ministries:', error);
    res.status(500).json({ message: 'Server error fetching ministries' });
  }
});

// Get single ministry (public)
router.get('/:id', async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.id);
    
    if (!ministry || !ministry.isActive) {
      return res.status(404).json({ message: 'Ministry not found' });
    }

    res.json(ministry);

  } catch (error) {
    console.error('Error fetching ministry:', error);
    res.status(500).json({ message: 'Server error fetching ministry' });
  }
});

export default router;