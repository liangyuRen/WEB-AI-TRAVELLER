import express from 'express';
import axios from 'axios';
import { LLMFactory } from '../services/llm';

const router = express.Router();

interface LLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: string;
  apiKey?: string;
}

interface LLMResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Call LLM API
router.post('/chat', async (req, res) => {
  try {
    const { prompt, provider = 'alibaba', apiKey, temperature = 0.7, maxTokens = 1000 } = req.body as LLMRequest;

    // Get API key from request or environment
    const key = apiKey || process.env.LLM_API_KEY;

    if (!key) {
      return res.status(400).json({
        error: 'LLM API Key not provided. Please configure in Settings or set LLM_API_KEY environment variable.',
        requiresConfig: true
      });
    }

    try {
      const llmService = LLMFactory.createService(provider, key);
      const response = await llmService.chat(prompt, temperature, maxTokens);
      res.json({ success: true, data: response });
    } catch (llmError: any) {
      res.status(500).json({
        error: llmError.message,
        provider,
        requiresConfig: llmError.message.includes('API Key')
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate travel itinerary
router.post('/generate-itinerary', async (req, res) => {
  try {
    const { destination, days, budget, travelers, preferences, provider = 'alibaba', apiKey } = req.body;

    const key = apiKey || process.env.LLM_API_KEY;

    if (!key) {
      return res.status(400).json({
        error: 'LLM API Key not configured',
        requiresConfig: true
      });
    }

    const llmService = LLMFactory.createService(provider, key);
    const result = await llmService.generateTravelItinerary(destination, days, budget, travelers, preferences);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate budget analysis
router.post('/analyze-budget', async (req, res) => {
  try {
    const { expenses, totalBudget, provider = 'alibaba', apiKey } = req.body;

    const key = apiKey || process.env.LLM_API_KEY;

    if (!key) {
      return res.status(400).json({
        error: 'LLM API Key not configured',
        requiresConfig: true
      });
    }

    const llmService = LLMFactory.createService(provider, key);
    const result = await llmService.analyzeBudget(expenses, totalBudget);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
