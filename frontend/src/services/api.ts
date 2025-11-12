import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuration for retry mechanism
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // Base delay in ms
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// Custom error class
export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include API key and user ID from localStorage
apiClient.interceptors.request.use((config) => {
  const apiKeys = localStorage.getItem('apiKeys');
  const userId = localStorage.getItem('userId');

  if (apiKeys) {
    const keys = JSON.parse(apiKeys);
    // Add API key and provider to request if available
    if (keys.llmApiKey && config.data) {
      config.data.apiKey = keys.llmApiKey;
      config.data.provider = keys.llmProvider || 'alibaba';
    }
  }

  // Add user ID to request if available
  if (userId && config.data) {
    config.data.userId = userId;
  }

  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = error.response?.data?.error || error.message || 'Unknown error';
    const statusCode = error.response?.status;

    const apiError = new APIError(message as string, statusCode, error);

    console.error('API Error:', {
      status: statusCode,
      message,
      url: error.config?.url,
      method: error.config?.method,
    });

    return Promise.reject(apiError);
  }
);

// Retry mechanism for failed requests
const retryWithBackoff = async (
  fn: () => Promise<any>,
  retries = 0
): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable =
      retries < RETRY_CONFIG.maxRetries &&
      (error.statusCode === undefined ||
        RETRY_CONFIG.retryableStatuses.includes(error.statusCode));

    if (isRetryable) {
      const delay = RETRY_CONFIG.retryDelay * Math.pow(2, retries); // Exponential backoff
      console.warn(
        `Request failed, retrying in ${delay}ms... (Attempt ${retries + 1}/${RETRY_CONFIG.maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries + 1);
    }

    throw error;
  }
};

export const travelService = {
  generatePlan: async (
    destination: string,
    days: number,
    budget: number,
    people: number,
    preferences: string
  ) => {
    return retryWithBackoff(() =>
      apiClient.post('/travel/plan', {
        destination,
        days,
        budget,
        people,
        preferences,
      })
    );
  },

  getSavedPlans: async (userId: string) => {
    return retryWithBackoff(() => apiClient.get(`/travel/plans/${userId}`));
  },

  getPlan: async (planId: string) => {
    return retryWithBackoff(() => apiClient.get(`/travel/plan/${planId}`));
  },

  updatePlan: async (planId: string, data: any) => {
    return retryWithBackoff(() => apiClient.put(`/travel/plan/${planId}`, data));
  },

  deletePlan: async (planId: string) => {
    return retryWithBackoff(() => apiClient.delete(`/travel/plan/${planId}`));
  },
};

export const budgetService = {
  recordExpense: async (
    planId: string,
    category: string,
    amount: number,
    description: string
  ) => {
    return retryWithBackoff(() =>
      apiClient.post('/budget/expense', {
        planId,
        category,
        amount,
        description,
      })
    );
  },

  getBudgetSummary: async (planId: string) => {
    return retryWithBackoff(() => apiClient.get(`/budget/summary/${planId}`));
  },

  getExpenses: async (planId: string) => {
    return retryWithBackoff(() => apiClient.get(`/budget/expenses/${planId}`));
  },

  updateExpense: async (expenseId: string, data: any) => {
    return retryWithBackoff(() =>
      apiClient.put(`/budget/expense/${expenseId}`, data)
    );
  },

  deleteExpense: async (expenseId: string) => {
    return retryWithBackoff(() =>
      apiClient.delete(`/budget/expense/${expenseId}`)
    );
  },

  analyzeBudget: async (planId: string) => {
    return retryWithBackoff(() =>
      apiClient.post('/budget/analyze', { planId })
    );
  },
};

export const llmService = {
  chat: async (prompt: string, model = 'qwen-7b-chat') => {
    return retryWithBackoff(() =>
      apiClient.post('/llm/chat', { prompt, model })
    );
  },

  generateItinerary: async (
    destination: string,
    days: number,
    budget: number,
    travelers: number,
    preferences: string
  ) => {
    return retryWithBackoff(() =>
      apiClient.post('/llm/generate-itinerary', {
        destination,
        days,
        budget,
        travelers,
        preferences,
      })
    );
  },

  analyzeBudget: async (expenses: any[], totalBudget: number) => {
    return retryWithBackoff(() =>
      apiClient.post('/llm/analyze-budget', {
        expenses,
        totalBudget,
      })
    );
  },
};

// Utility function to handle API errors
export const handleAPIError = (error: unknown): string => {
  if (error instanceof APIError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default apiClient;
