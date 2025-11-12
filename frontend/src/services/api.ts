import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include API key from localStorage
apiClient.interceptors.request.use((config) => {
  const apiKeys = localStorage.getItem('apiKeys');
  if (apiKeys) {
    const keys = JSON.parse(apiKeys);
    // Add API key to request if available
    if (keys.llmApiKey && config.data) {
      config.data.apiKey = keys.llmApiKey;
      config.data.provider = keys.llmProvider || 'alibaba';
    }
  }
  return config;
});

export const travelService = {
  generatePlan: async (destination: string, days: number, budget: number, people: number, preferences: string) => {
    return apiClient.post('/travel/plan', {
      destination,
      days,
      budget,
      people,
      preferences,
    });
  },

  getSavedPlans: async (userId: string) => {
    return apiClient.get(`/travel/plans/${userId}`);
  },

  updatePlan: async (planId: string, data: any) => {
    return apiClient.put(`/travel/plan/${planId}`, data);
  },
};

export const budgetService = {
  recordExpense: async (planId: string, category: string, amount: number, description: string) => {
    return apiClient.post('/budget/expense', {
      planId,
      category,
      amount,
      description,
    });
  },

  getBudgetSummary: async (planId: string) => {
    return apiClient.get(`/budget/summary/${planId}`);
  },

  updateExpense: async (expenseId: string, data: any) => {
    return apiClient.put(`/budget/expense/${expenseId}`, data);
  },

  deleteExpense: async (expenseId: string) => {
    return apiClient.delete(`/budget/expense/${expenseId}`);
  },
};

export const llmService = {
  chat: async (prompt: string, model = 'qwen-7b-chat') => {
    return apiClient.post('/llm/chat', { prompt, model });
  },

  generateItinerary: async (destination: string, days: number, budget: number, travelers: number, preferences: string) => {
    return apiClient.post('/llm/generate-itinerary', {
      destination,
      days,
      budget,
      travelers,
      preferences,
    });
  },

  analyzeBudget: async (expenses: any[], totalBudget: number) => {
    return apiClient.post('/llm/analyze-budget', {
      expenses,
      totalBudget,
    });
  },
};

export default apiClient;
