import axios from 'axios';

interface LLMProvider {
  name: string;
  apiKey: string;
  baseUrl?: string;
}

interface LLMResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Alibaba Bailian LLM Service
 * Supports Qwen (通义千问) models
 */
export class AlibabaBailianService {
  private apiKey: string;
  private modelId: string = 'qwen-7b-chat'; // Default model

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Alibaba Bailian API Key is required');
    }
    this.apiKey = apiKey;
  }

  async chat(prompt: string, temperature: number = 0.7, maxTokens: number = 1000): Promise<LLMResponse> {
    try {
      // TODO: Implement actual Alibaba Bailian API call
      // Documentation: https://help.aliyun.com/document_detail/417977.html

      const response = await axios.post(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        {
          model: this.modelId,
          input: {
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          },
          parameters: {
            temperature,
            top_p: 0.9,
            max_tokens: maxTokens,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        text: response.data.output?.text || 'No response',
        usage: {
          promptTokens: response.data.usage?.input_tokens || 0,
          completionTokens: response.data.usage?.output_tokens || 0,
          totalTokens: (response.data.usage?.input_tokens || 0) + (response.data.usage?.output_tokens || 0),
        },
      };
    } catch (error: any) {
      console.error('Alibaba Bailian API Error:', error.response?.data || error.message);
      throw new Error(`LLM Error: ${error.message}`);
    }
  }

  async generateTravelItinerary(
    destination: string,
    days: number,
    budget: number,
    travelers: number,
    preferences: string
  ): Promise<any> {
    const prompt = `You are a professional travel planner. Generate a detailed ${days}-day itinerary for a trip to ${destination}.

Trip Details:
- Destination: ${destination}
- Duration: ${days} days
- Budget: ¥${budget} total (¥${Math.round(budget / travelers)} per person)
- Number of travelers: ${travelers}
- Preferences: ${preferences}

Please provide a comprehensive travel plan in JSON format with:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["activity1", "activity2", "activity3"],
      "accommodation": "Hotel name and details",
      "meals": "Breakfast: ..., Lunch: ..., Dinner: ...",
      "transport": "How to get around",
      "estimated_cost": 500,
      "tips": ["Tip 1", "Tip 2"]
    }
  ],
  "total_estimated_cost": ${budget},
  "packing_list": ["Item 1", "Item 2"],
  "important_notes": ["Note 1", "Note 2"]
}

Ensure all costs are in CNY and realistic for the destination.`;

    return await this.chat(prompt, 0.7, 2000);
  }

  async analyzeBudget(expenses: any[], totalBudget: number): Promise<any> {
    const expenseStr = JSON.stringify(expenses, null, 2);
    const spent = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);

    const prompt = `Analyze the following travel expenses and provide recommendations.

Total Budget: ¥${totalBudget}
Total Spent: ¥${spent}
Remaining: ¥${totalBudget - spent}

Expenses:
${expenseStr}

Please provide analysis in JSON format:
{
  "status": "on_budget|over_budget|under_budget",
  "analysis": "Detailed analysis of spending",
  "category_breakdown": {
    "category_name": amount
  },
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "savings_opportunities": [
    "Opportunity 1"
  ]
}`;

    return await this.chat(prompt, 0.7, 1500);
  }
}

/**
 * OpenAI LLM Service
 */
export class OpenAIService {
  private apiKey: string;
  private modelId: string = 'gpt-3.5-turbo';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API Key is required');
    }
    this.apiKey = apiKey;
  }

  async chat(prompt: string, temperature: number = 0.7, maxTokens: number = 1000): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.modelId,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        text: response.data.choices?.[0]?.message?.content || 'No response',
        usage: {
          promptTokens: response.data.usage?.prompt_tokens || 0,
          completionTokens: response.data.usage?.completion_tokens || 0,
          totalTokens: response.data.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error(`LLM Error: ${error.message}`);
    }
  }

  async generateTravelItinerary(
    destination: string,
    days: number,
    budget: number,
    travelers: number,
    preferences: string
  ): Promise<any> {
    const prompt = `Generate a ${days}-day travel itinerary for ${destination} with budget ¥${budget} for ${travelers} travelers. Preferences: ${preferences}`;
    return await this.chat(prompt, 0.7, 2000);
  }

  async analyzeBudget(expenses: any[], totalBudget: number): Promise<any> {
    const prompt = `Analyze travel expenses totaling ¥${expenses.reduce((s: number, e: any) => s + e.amount, 0)} against budget ¥${totalBudget}. ${JSON.stringify(expenses)}`;
    return await this.chat(prompt, 0.7, 1500);
  }
}

/**
 * LLM Factory
 */
export class LLMFactory {
  static createService(provider: string, apiKey: string): AlibabaBailianService | OpenAIService {
    switch (provider.toLowerCase()) {
      case 'alibaba':
      case 'bailian':
        return new AlibabaBailianService(apiKey);
      case 'openai':
        return new OpenAIService(apiKey);
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }
}

export default LLMFactory;
