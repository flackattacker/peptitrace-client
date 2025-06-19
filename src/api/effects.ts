import api from './api';

export interface Effect {
  _id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative';
  category: string;
  severity?: 'mild' | 'moderate' | 'severe';
  frequency: 'rare' | 'uncommon' | 'common' | 'very_common';
  isCommon: boolean;
}

// Description: Seed the database with initial effects and side effects data
// Endpoint: POST /api/seed/effects
// Request: {}
// Response: { success: boolean, message: string, data: { count: number, effects: Array<{ id: string, name: string, type: string, category: string }> } }
export const seedEffects = async () => {
  try {
    return await api.post('/api/seed/effects');
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Clear all effects data from the database
// Endpoint: DELETE /api/seed/effects
// Request: {}
// Response: { success: boolean, message: string, data: { deletedCount: number } }
export const clearEffects = async () => {
  try {
    return await api.delete('/api/seed/effects');
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get list of all effects
// Endpoint: GET /api/effects
// Request: { type?: 'positive' | 'negative', category?: string }
// Response: { effects: Effect[] }
export const getEffects = async (filters?: { type?: 'positive' | 'negative'; category?: string }) => {
  try {
    const response = await api.get('/api/effects', { params: filters });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};