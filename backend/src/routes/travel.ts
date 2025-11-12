import express from 'express';

const router = express.Router();

// Generate travel plan
router.post('/plan', async (req, res) => {
  try {
    const { destination, days, budget, people, preferences } = req.body;

    // TODO: Call LLM API to generate travel plan
    const plan = {
      destination,
      days,
      budget,
      people,
      preferences,
      itinerary: [
        {
          day: 1,
          activities: ['Arrive at destination', 'Check into hotel', 'Explore nearby area'],
          accommodation: 'To be determined',
          meals: 'To be determined',
          estimated_cost: budget / days
        }
      ],
      total_estimated_cost: budget
    };

    res.json({ success: true, data: plan });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get saved travel plans
router.get('/plans/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Fetch from Supabase
    res.json({ success: true, data: [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update travel plan
router.put('/plan/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const updatedData = req.body;

    // TODO: Update in Supabase
    res.json({ success: true, data: updatedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
