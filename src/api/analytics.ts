import api from './api';

export interface UsageAnalytics {
  overview: {
    totalPeptides: number;
    totalExperiences: number;
    recentExperiences: number;
  };
  popularPeptides: Array<{
    peptideId: string;
    name: string;
    experienceCount: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
}

export interface PeptideComparison {
  _id: string;
  name: string;
  category: string;
  totalExperiences: number;
  averageRating: number;
  outcomes: {
    energy: number;
    sleep: number;
    mood: number;
    performance: number;
    recovery: number;
    sideEffects: number;
  };
}

export interface PeptideEffectiveness {
  summary: {
    totalPeptidesWithRatings: number;
    averageEffectiveness: number;
    totalExperiences: number;
  };
  peptides: Array<{
    peptideId: string;
    name: string;
    category: string;
    totalExperiences: number;
    effectiveness: {
      overall: number;
      energy: number;
      sleep: number;
      mood: number;
      performance: number;
      sideEffects: number;
    };
    ratingDistribution: {
      recovery: Record<string, number>;
      energy: Record<string, number>;
      sleep: Record<string, number>;
      mood: Record<string, number>;
      performance: Record<string, number>;
      sideEffects: Record<string, number>;
    };
  }>;
  topPerformers: Array<{
    peptideId: string;
    name: string;
    category: string;
    totalExperiences: number;
    effectiveness: {
      overall: number;
      energy: number;
      sleep: number;
      mood: number;
      performance: number;
      sideEffects: number;
    };
  }>;
  bottomPerformers: Array<{
    peptideId: string;
    name: string;
    category: string;
    totalExperiences: number;
    effectiveness: {
      overall: number;
      energy: number;
      sleep: number;
      mood: number;
      performance: number;
      sideEffects: number;
    };
  }>;
}

export interface AnalyticsData {
  totalExperiences: number;
  totalPeptides: number;
  averageRating: number;
  activeUsers?: number;
  experienceGrowth?: number;
  categories?: number;
  dataQuality?: number;
  communityHealth?: number;
  responseRate?: number;
  trendingCategories?: Array<{
    name: string;
    growth: number;
  }>;
  topPeptides: Array<{
    name: string;
    experiences: number;
    rating: number;
  }>;
  effectivenessData: Array<{
    peptide: string;
    experiences: number;
    effectiveness: {
      energy: number;
      sleep: number;
      mood: number;
      performance: number;
      recovery: number;
      sideEffects: number;
    };
  }>;
  usageTrends: Array<{
    month: string;
    experiences: number;
  }>;
  outcomeDistribution: any;
  peptideFrequency: Array<any>;
}

export interface PeptideTrends {
  summary: {
    period: string;
    totalPeriods: number;
    totalExperiences: number;
    avgExperiencesPerPeriod: number;
  };
  trends: Array<{
    period: string;
    totalExperiences: number;
    topPeptides: Array<{
      peptideId: string;
      name: string;
      experiences: number;
      avgRating: number;
      growthRate: number;
    }>;
    growthRate: number;
  }>;
  fastestGrowing: Array<{
    name: string;
    overallGrowth: number;
    totalExperiences: number;
  }>;
  analysis: {
    periodWithMostActivity: {
      period: string;
      totalExperiences: number;
    };
  };
}

// Description: Get peptide usage analytics
// Endpoint: GET /api/analytics/usage
// Request: {}
// Response: { success: boolean, data: UsageAnalytics }
export const getUsageAnalytics = async (): Promise<{ success: boolean; data: UsageAnalytics }> => {
  try {
    console.log('Analytics API: getUsageAnalytics called')
    console.log('Analytics API: Making GET request to /api/analytics/usage')
    const response = await api.get('/api/analytics/usage');
    console.log('Analytics API: getUsageAnalytics response status:', response.status)
    console.log('Analytics API: getUsageAnalytics response data:', response.data)
    console.log('Analytics API: getUsageAnalytics full response object keys:', Object.keys(response))
    console.log('Analytics API: getUsageAnalytics data structure analysis:', JSON.stringify(response.data, null, 2))
    return response.data;
  } catch (error: any) {
    console.error('Analytics API: getUsageAnalytics error:', error)
    console.error('Analytics API: getUsageAnalytics error stack:', error.stack)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Compare multiple peptides
// Endpoint: GET /api/analytics/compare
// Request: { peptideIds: string[] }
// Response: { success: boolean, data: PeptideComparison[] }
export const comparePeptides = async (peptideIds: string[]): Promise<{ success: boolean; data: PeptideComparison[] }> => {
  try {
    console.log('Analytics API: comparePeptides called with peptideIds:', peptideIds)
    console.log('Analytics API: Making GET request to /api/analytics/compare')
    const response = await api.get('/api/analytics/compare', {
      params: { peptideIds: peptideIds.join(',') }
    });
    console.log('Analytics API: comparePeptides response status:', response.status)
    console.log('Analytics API: comparePeptides response data:', response.data)
    console.log('Analytics API: comparePeptides full response object keys:', Object.keys(response))
    console.log('Analytics API: comparePeptides data structure analysis:', JSON.stringify(response.data, null, 2))
    return response.data;
  } catch (error: any) {
    console.error('Analytics API: comparePeptides error:', error)
    console.error('Analytics API: comparePeptides error stack:', error.stack)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get peptide effectiveness ratings and distribution
// Endpoint: GET /api/analytics/peptide-effectiveness
// Request: {}
// Response: { success: boolean, data: PeptideEffectiveness }
export const getPeptideEffectiveness = async (): Promise<{ success: boolean; data: PeptideEffectiveness }> => {
  try {
    console.log('Analytics API: getPeptideEffectiveness called')
    console.log('Analytics API: Making GET request to /api/analytics/peptide-effectiveness')
    const response = await api.get('/api/analytics/peptide-effectiveness');
    console.log('Analytics API: getPeptideEffectiveness response status:', response.status)
    console.log('Analytics API: getPeptideEffectiveness response data:', response.data)
    console.log('Analytics API: getPeptideEffectiveness full response object keys:', Object.keys(response))
    console.log('Analytics API: getPeptideEffectiveness data structure analysis:', JSON.stringify(response.data, null, 2))
    return response.data;
  } catch (error: any) {
    console.error('Analytics API: getPeptideEffectiveness error:', error)
    console.error('Analytics API: getPeptideEffectiveness error stack:', error.stack)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get platform analytics data
// Endpoint: GET /api/analytics
// Request: {}
// Response: { success: boolean, data: AnalyticsData }
export const getAnalytics = async (): Promise<{ success: boolean; data: AnalyticsData }> => {
  try {
    console.log('Analytics API: getAnalytics called')
    console.log('Analytics API: Making GET request to /api/analytics')
    const response = await api.get('/api/analytics');
    console.log('Analytics API: getAnalytics response status:', response.status)
    console.log('Analytics API: getAnalytics response data:', response.data)
    console.log('Analytics API: getAnalytics full response object keys:', Object.keys(response))
    console.log('Analytics API: getAnalytics data structure analysis:', JSON.stringify(response.data, null, 2))
    console.log('Analytics API: getAnalytics activeUsers field check:', response.data?.data?.activeUsers)
    console.log('Analytics API: getAnalytics all data fields:', response.data?.data ? Object.keys(response.data.data) : 'no data field')
    return response.data;
  } catch (error: any) {
    console.error('Analytics API: getAnalytics error:', error)
    console.error('Analytics API: getAnalytics error stack:', error.stack)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get peptide usage statistics
// Endpoint: GET /api/analytics/peptide-usage
// Request: {}
// Response: { success: boolean, data: { totalExperiences: number, totalPeptides: number, peptideFrequency: Array, topPeptides: Array, averageRating: number } }
export const getPeptideUsageAnalytics = async (): Promise<{ success: boolean; data: any }> => {
  try {
    console.log('Analytics API: getPeptideUsageAnalytics called')
    console.log('Analytics API: Making GET request to /api/analytics/peptide-usage')
    const response = await api.get('/api/analytics/peptide-usage');
    console.log('Analytics API: getPeptideUsageAnalytics response status:', response.status)
    console.log('Analytics API: getPeptideUsageAnalytics response data:', response.data)
    console.log('Analytics API: getPeptideUsageAnalytics full response object keys:', Object.keys(response))
    console.log('Analytics API: getPeptideUsageAnalytics data structure analysis:', JSON.stringify(response.data, null, 2))
    return response.data;
  } catch (error: any) {
    console.error('Analytics API: getPeptideUsageAnalytics error:', error)
    console.error('Analytics API: getPeptideUsageAnalytics error stack:', error.stack)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get peptide usage trends over time
// Endpoint: GET /api/analytics/peptide-trends
// Request: { period?: 'daily' | 'weekly' | 'monthly', limit?: number }
// Response: { success: boolean, data: PeptideTrends }
export const getPeptideTrends = async (period: 'daily' | 'weekly' | 'monthly' = 'monthly', limit: number = 12): Promise<{ success: boolean; data: PeptideTrends }> => {
  try {
    console.log('Analytics API: getPeptideTrends called with period:', period, 'limit:', limit)
    console.log('Analytics API: Making GET request to /api/analytics/peptide-trends')
    const response = await api.get('/api/analytics/peptide-trends', {
      params: { period, limit }
    });
    console.log('Analytics API: getPeptideTrends response status:', response.status)
    console.log('Analytics API: getPeptideTrends response data:', response.data)
    console.log('Analytics API: getPeptideTrends full response object keys:', Object.keys(response))
    console.log('Analytics API: getPeptideTrends data structure analysis:', JSON.stringify(response.data, null, 2))
    return response.data;
  } catch (error: any) {
    console.error('Analytics API: getPeptideTrends error:', error)
    console.error('Analytics API: getPeptideTrends error stack:', error.stack)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Purge all analytics and research data
// Endpoint: DELETE /api/analytics/purge
// Request: {}
// Response: { success: boolean, message: string, deletedCounts: { experiences: number, peptides: number, effects: number } }
export const purgeAnalyticsData = async (): Promise<{ success: boolean; message: string; deletedCounts: { experiences: number, peptides: number, effects: number } }> => {
  try {
    console.log('Analytics API: purgeAnalyticsData called')
    console.log('Analytics API: Making DELETE request to /api/analytics/purge')
    const response = await api.delete('/api/analytics/purge');
    console.log('Analytics API: purgeAnalyticsData response status:', response.status)
    console.log('Analytics API: purgeAnalyticsData response data:', response.data)
    console.log('Analytics API: purgeAnalyticsData full response object keys:', Object.keys(response))
    console.log('Analytics API: purgeAnalyticsData data structure analysis:', JSON.stringify(response.data, null, 2))
    return response.data;
  } catch (error: any) {
    console.error('Analytics API: purgeAnalyticsData error:', error)
    console.error('Analytics API: purgeAnalyticsData error stack:', error.stack)
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get public analytics data for the home page
// Endpoint: GET /api/analytics/public
// Request: {}
// Response: { success: boolean, data: AnalyticsData }
export const getPublicAnalytics = async (): Promise<{ success: boolean; data: AnalyticsData }> => {
  try {
    console.log('Analytics API: getPublicAnalytics called')
    console.log('Analytics API: Making GET request to /api/analytics/public')
    const response = await api.get('/api/analytics/public');
    console.log('Analytics API: getPublicAnalytics response status:', response.status)
    console.log('Analytics API: getPublicAnalytics response data:', response.data)
    return response.data;
  } catch (error: any) {
    console.error('Analytics API: getPublicAnalytics error:', error)
    throw new Error(error?.response?.data?.error || error.message);
  }
};