import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

/**
 * Initialize Supabase client
 */
export const initSupabase = (url?: string, key?: string): SupabaseClient => {
  const supabaseUrl = url || process.env.SUPABASE_URL;
  const supabaseKey = key || process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};

/**
 * Get Supabase instance
 */
export const getSupabase = (): SupabaseClient => {
  if (!supabase) {
    return initSupabase();
  }
  return supabase;
};

/**
 * Travel Plan Service
 */
export const travelPlanService = {
  /**
   * Create a new travel plan
   */
  async create(userId: string, data: any) {
    const sb = getSupabase();
    const { data: result, error } = await sb
      .from('travel_plans')
      .insert([
        {
          user_id: userId,
          destination: data.destination,
          start_date: data.startDate,
          end_date: data.endDate,
          budget: data.budget,
          travelers: data.travelers,
          preferences: data.preferences,
          itinerary: data.itinerary,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return result?.[0];
  },

  /**
   * Get all travel plans for a user
   */
  async getByUserId(userId: string) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a specific travel plan
   */
  async getById(planId: string) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('travel_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a travel plan
   */
  async update(planId: string, data: any) {
    const sb = getSupabase();
    const { data: result, error } = await sb
      .from('travel_plans')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', planId)
      .select();

    if (error) throw error;
    return result?.[0];
  },

  /**
   * Delete a travel plan
   */
  async delete(planId: string) {
    const sb = getSupabase();
    const { error } = await sb
      .from('travel_plans')
      .delete()
      .eq('id', planId);

    if (error) throw error;
  },
};

/**
 * Expense Service
 */
export const expenseService = {
  /**
   * Record an expense
   */
  async create(planId: string, data: any) {
    const sb = getSupabase();
    const { data: result, error } = await sb
      .from('expenses')
      .insert([
        {
          plan_id: planId,
          category: data.category,
          amount: data.amount,
          description: data.description,
          date: data.date || new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return result?.[0];
  },

  /**
   * Get all expenses for a plan
   */
  async getByPlanId(planId: string) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('expenses')
      .select('*')
      .eq('plan_id', planId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Update an expense
   */
  async update(expenseId: string, data: any) {
    const sb = getSupabase();
    const { data: result, error } = await sb
      .from('expenses')
      .update(data)
      .eq('id', expenseId)
      .select();

    if (error) throw error;
    return result?.[0];
  },

  /**
   * Delete an expense
   */
  async delete(expenseId: string) {
    const sb = getSupabase();
    const { error } = await sb
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) throw error;
  },

  /**
   * Get expense summary
   */
  async getSummary(planId: string) {
    const expenses = await this.getByPlanId(planId);
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = expenses.reduce((acc: any, exp: any) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    return {
      total,
      count: expenses.length,
      byCategory,
      expenses,
    };
  },
};

export default {
  initSupabase,
  getSupabase,
  travelPlanService,
  expenseService,
};
