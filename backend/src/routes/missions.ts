import express from 'express';
import Mission from '../models/Mission';

const router = express.Router();

// Get all missions (public)
router.get('/', async (req, res) => {
  try {
    const { status, location, limit = 20 } = req.query;
    
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (location) {
      query.location = new RegExp(location as string, 'i');
    }

    const missions = await Mission.find(query)
      .sort({ startDate: -1 })
      .limit(Number(limit));

    res.json(missions);

  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ message: 'Server error fetching missions' });
  }
});

// Get single mission (public)
router.get('/:id', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    res.json(mission);

  } catch (error) {
    console.error('Error fetching mission:', error);
    res.status(500).json({ message: 'Server error fetching mission' });
  }
});

export default router;