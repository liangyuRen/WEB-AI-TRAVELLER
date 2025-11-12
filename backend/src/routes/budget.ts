import express from 'express';

const router = express.Router();

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

// Record an expense
router.post('/expense', async (req, res) => {
  try {
    const { planId, category, amount, description } = req.body;

    const expense: Expense = {
      id: Date.now().toString(),
      category,
      amount,
      description,
      date: new Date().toISOString()
    };

    // TODO: Save to Supabase
    res.json({ success: true, data: expense });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get budget summary
router.get('/summary/:planId', async (req, res) => {
  try {
    const { planId } = req.params;

    // TODO: Fetch from Supabase and calculate totals
    const summary = {
      totalBudget: 0,
      totalSpent: 0,
      remaining: 0,
      breakdown: {
        accommodation: 0,
        food: 0,
        transportation: 0,
        activities: 0,
        other: 0
      }
    };

    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update expense
router.put('/expense/:expenseId', async (req, res) => {
  try {
    const { expenseId } = req.params;
    const updatedData = req.body;

    // TODO: Update in Supabase
    res.json({ success: true, data: updatedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete('/expense/:expenseId', async (req, res) => {
  try {
    const { expenseId } = req.params;

    // TODO: Delete from Supabase
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
