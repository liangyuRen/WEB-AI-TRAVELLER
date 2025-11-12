import express from 'express';
import { travelPlanService } from '../services/supabase';
import { LLMFactory } from '../services/llm';
import { Logger, AppError } from '../utils/errors';

const router = express.Router();
const logger = new Logger('TravelRoutes');

// Generate travel plan
router.post('/plan', async (req, res, next) => {
  try {
    const { destination, days, budget, people, preferences, userId, provider = 'alibaba', apiKey } = req.body;

    // Validate required fields
    if (!destination || !days || !budget || !people) {
      throw new AppError('Missing required fields: destination, days, budget, people', 400);
    }

    if (!userId) {
      throw new AppError('User ID is required', 401);
    }

    if (!apiKey) {
      throw new AppError('API Key is required for LLM service', 400);
    }

    logger.info(`Generating travel plan for user ${userId}: ${destination}, ${days} days`);

    // Call LLM API to generate travel plan
    try {
      const llmService = LLMFactory.createService(provider, apiKey);
      const llmResponse = await llmService.generateTravelItinerary(
        destination,
        days,
        budget,
        people,
        preferences
      );

      // Parse LLM response
      let itinerary = [];
      let totalEstimatedCost = budget;
      let packingList = [];
      let importantNotes = [];

      try {
        const parsed = JSON.parse(llmResponse.text);
        itinerary = parsed.itinerary || [];
        totalEstimatedCost = parsed.total_estimated_cost || budget;
        packingList = parsed.packing_list || [];
        importantNotes = parsed.important_notes || [];
      } catch (parseError) {
        logger.warn('Failed to parse LLM response as JSON, using raw text');
        itinerary = [{
          day: 1,
          title: 'Full Itinerary',
          activities: [llmResponse.text],
          accommodation: 'To be determined',
          meals: 'To be determined',
          estimated_cost: budget / days
        }];
      }

      const plan = {
        destination,
        days,
        budget,
        people,
        preferences,
        itinerary,
        total_estimated_cost: totalEstimatedCost,
        packing_list: packingList,
        important_notes: importantNotes
      };

      // Save to Supabase
      const savedPlan = await travelPlanService.create(userId, {
        destination,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget,
        travelers: people,
        preferences,
        itinerary: plan.itinerary
      });

      logger.info(`Travel plan created with ID: ${savedPlan?.id}`);

      res.json({
        success: true,
        data: {
          ...plan,
          id: savedPlan?.id
        }
      });
    } catch (llmError: any) {
      logger.error(`LLM Error: ${llmError.message}`);
      // Return a basic plan even if LLM fails
      const basicPlan = {
        destination,
        days,
        budget,
        people,
        preferences,
        itinerary: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          activities: ['Explore destination', 'Local cuisine', 'Cultural sites'],
          accommodation: 'Hotel',
          meals: 'Local restaurants',
          estimated_cost: budget / days
        })),
        total_estimated_cost: budget
      };

      const savedPlan = await travelPlanService.create(userId, {
        destination,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget,
        travelers: people,
        preferences,
        itinerary: basicPlan.itinerary
      });

      res.json({
        success: true,
        data: {
          ...basicPlan,
          id: savedPlan?.id,
          warning: 'Generated basic itinerary due to LLM service error'
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

// Get saved travel plans
router.get('/plans/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    logger.info(`Fetching travel plans for user ${userId}`);

    // Fetch from Supabase
    const plans = await travelPlanService.getByUserId(userId);

    logger.info(`Found ${plans.length} travel plans for user ${userId}`);

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    next(error);
  }
});

// Get a single travel plan
router.get('/plan/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      throw new AppError('Plan ID is required', 400);
    }

    logger.info(`Fetching travel plan ${planId}`);

    const plan = await travelPlanService.getById(planId);

    if (!plan) {
      throw new AppError('Travel plan not found', 404);
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
});

// Update travel plan
router.put('/plan/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;
    const updatedData = req.body;

    if (!planId) {
      throw new AppError('Plan ID is required', 400);
    }

    if (Object.keys(updatedData).length === 0) {
      throw new AppError('No data provided to update', 400);
    }

    logger.info(`Updating travel plan ${planId}`);

    // Update in Supabase
    const updatedPlan = await travelPlanService.update(planId, updatedData);

    logger.info(`Travel plan ${planId} updated successfully`);

    res.json({
      success: true,
      data: updatedPlan
    });
  } catch (error) {
    next(error);
  }
});

// Delete travel plan
router.delete('/plan/:planId', async (req, res, next) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      throw new AppError('Plan ID is required', 400);
    }

    logger.info(`Deleting travel plan ${planId}`);

    await travelPlanService.delete(planId);

    logger.info(`Travel plan ${planId} deleted successfully`);

    res.json({
      success: true,
      message: 'Travel plan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
