import api from './api';

export interface UserDemographics {
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  weight?: number;
  height?: number;
  activityLevel?: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';
  fitnessGoals?: string[];
  medicalConditions?: string[];
  allergies?: string[];
}

export interface UserPreferences {
  units?: {
    weight?: 'kg' | 'lbs';
    height?: 'cm' | 'ft';
  };
  privacy?: {
    shareAge?: boolean;
    shareGender?: boolean;
    shareWeight?: boolean;
    shareHeight?: boolean;
  };
  notifications?: {
    email?: boolean;
    newExperiences?: boolean;
    weeklyDigest?: boolean;
  };
}

export interface User {
  _id: string;
  email: string;
  demographics: {
    ageRange?: string;
    biologicalSex?: string;
    activityLevel?: string;
  };
  preferences: {
    anonymityLevel?: string;
    dataSharing?: boolean;
    emailNotifications?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Description: Get current user profile
// Endpoint: GET /api/users/me
// Request: {}
// Response: { success: boolean, user: User }
export const getCurrentUser = async (): Promise<{ success: boolean; user: User }> => {
  console.log('getCurrentUser: Starting API call');
  console.log('getCurrentUser: Making GET request to /api/users/me');
  try {
    const response = await api.get('/api/users/me');
    console.log('getCurrentUser: Response received:', response);
    console.log('getCurrentUser: Response status:', response.status);
    console.log('getCurrentUser: Response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('getCurrentUser: API call failed');
    console.error('getCurrentUser: Error object:', error);
    console.error('getCurrentUser: Error status:', error?.response?.status);
    console.error('getCurrentUser: Error data:', error?.response?.data);
    console.error('getCurrentUser: Error message:', error?.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update user profile
// Endpoint: PUT /api/users/me
// Request: { demographics?: object, preferences?: object }
// Response: { success: boolean, user: User }
export const updateUser = async (userData: Partial<User>): Promise<{ success: boolean; user: User }> => {
  console.log('updateUser: Starting API call with data:', userData);
  console.log('updateUser: Making PUT request to /api/users/me');
  try {
    const response = await api.put('/api/users/me', userData);
    console.log('updateUser: Response received:', response);
    console.log('updateUser: Response status:', response.status);
    console.log('updateUser: Response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('updateUser: API call failed');
    console.error('updateUser: Error object:', error);
    console.error('updateUser: Error status:', error?.response?.status);
    console.error('updateUser: Error data:', error?.response?.data);
    console.error('updateUser: Error message:', error?.message);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Alias for backward compatibility
export const updateUserProfile = updateUser;