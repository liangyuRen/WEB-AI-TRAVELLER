import express from 'express';
import { travelPlanService, expenseService } from '../services/supabase';
import { LLMFactory } from '../services/llm';
import { Logger, AppError } from '../utils/errors';

const router = express.Router();
const logger = new Logger('BudgetRoutes');

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

// Record an expense
router.post('/expense', async (req, res, next) => {
  try {
    const { planId, category, amount, description } = req.body;

    // Validate required fields
    if (!planId) {
      throw new AppError('Plan ID is required', 400);
    }

    if (!category || !amount) {
      throw new AppError('Missing required fields: category, amount', 400);
    }

    if (amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }

    logger.info(`Recording expense for plan ${planId}: ${category} - ¥${amount}`);

    // Save to Supabase
    const savedExpense = await expenseService.create(planId, {
      category,
      amount,
      description: description || '',
      date: new Date().toISOString().split('T')[0]
    });

    logger.info(`Expense created with ID: ${savedExpense?.id}`);

    res.json({
      success: true,
      data: savedExpense
    });
  } catch (error) {
    next(error);
  }
});

// Get budget summary
router.get('/summary/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      throw new AppError('Plan ID is required', 400);
    }

    logger.info(`Fetching budget summary for plan ${planId}`);

    // Get travel plan
    const plan = await travelPlanService.getById(planId);

    if (!plan) {
      throw new AppError('Travel plan not found', 404);
    }

    // Fetch from Supabase and calculate totals
    const expenseSummary = await expenseService.getSummary(planId);

    const breakdown: any = {
      accommodation: 0,
      food: 0,
      transportation: 0,
      activities: 0,
      other: 0
    };

    // Build breakdown from expenses
    Object.entries(expenseSummary.byCategory).forEach(([category, amount]) => {
      if (category in breakdown) {
        breakdown[category] = amount;
      } else {
        breakdown.other = (breakdown.other || 0) + (amount as number);
      }
    });

    const summary = {
      totalBudget: plan.budget || 0,
      totalSpent: expenseSummary.total,
      remaining: (plan.budget || 0) - expenseSummary.total,
      percentage: Math.round((expenseSummary.total / (plan.budget || 1)) * 100),
      breakdown,
      expenseCount: expenseSummary.count,
      expenses: expenseSummary.expenses
    };

    logger.info(`Budget summary: spent ¥${summary.totalSpent} of ¥${summary.totalBudget}`);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
});

// Get all expenses for a plan
router.get('/expenses/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      throw new AppError('Plan ID is required', 400);
    }

    logger.info(`Fetching expenses for plan ${planId}`);

    const expenses = await expenseService.getByPlanId(planId);

    res.json({
      success: true,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
});

// Update expense
router.put('/expense/:expenseId', async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const updatedData = req.body;

    if (!expenseId) {
      throw new AppError('Expense ID is required', 400);
    }

    if (Object.keys(updatedData).length === 0) {
      throw new AppError('No data provided to update', 400);
    }

    // Validate data
    if (updatedData.amount !== undefined && updatedData.amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }

    logger.info(`Updating expense ${expenseId}`);

    // Update in Supabase
    const updatedExpense = await expenseService.update(expenseId, updatedData);

    logger.info(`Expense ${expenseId} updated successfully`);

    res.json({
      success: true,
      data: updatedExpense
    });
  } catch (error) {
    next(error);
  }
});

// Delete expense
router.delete('/expense/:expenseId', async (req, res, next) => {
  try {
    const { expenseId } = req.params;

    if (!expenseId) {
      throw new AppError('Expense ID is required', 400);
    }

    logger.info(`Deleting expense ${expenseId}`);

    // Delete from Supabase
    await expenseService.delete(expenseId);

    logger.info(`Expense ${expenseId} deleted successfully`);

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Analyze budget with AI
router.post('/analyze', async (req, res, next) => {
  try {
    const { planId, provider = 'alibaba', apiKey } = req.body;

    if (!planId) {
      throw new AppError('Plan ID is required', 400);
    }

    if (!apiKey) {
      throw new AppError('API Key is required for LLM service', 400);
    }

    logger.info(`Analyzing budget for plan ${planId}`);

    // Get expenses
    const expenses = await expenseService.getByPlanId(planId);

    // Get plan budget
    const plan = await travelPlanService.getById(planId);

    if (!plan) {
      throw new AppError('Travel plan not found', 404);
    }

    try {
      // Call LLM to analyze budget
      const llmService = LLMFactory.createService(provider, apiKey);
      const analysis = await llmService.analyzeBudget(expenses, plan.budget);

      logger.info(`Budget analysis completed for plan ${planId}`);

      res.json({
        success: true,
        data: {
          analysis: analysis.text,
          expenses,
          totalBudget: plan.budget,
          totalSpent: expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
        }
      });
    } catch (llmError: any) {
      logger.error(`LLM Error during budget analysis: ${llmError.message}`);

      // Return basic analysis even if LLM fails
      const totalSpent = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
      const remaining = plan.budget - totalSpent;
      const status = remaining < 0 ? 'over_budget' : remaining === 0 ? 'on_budget' : 'under_budget';

      res.json({
        success: true,
        data: {
          analysis: `Budget Status: ${status}. Total Budget: ¥${plan.budget}, Total Spent: ¥${totalSpent}, Remaining: ¥${remaining}. Expense breakdown by category is provided below.`,
          expenses,
          totalBudget: plan.budget,
          totalSpent,
          status,
          warning: 'Generated basic analysis due to LLM service error'
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
