import api from './api';

export interface UserDemographics {
  ageRange?: string;
  biologicalSex?: string;
  activityLevel?: string;
}

export interface Outcomes {
  [key: string]: number;
}

export interface UserVote {
  hasVoted: boolean;
  voteType: 'helpful' | 'not-helpful' | 'detailed' | 'concerning' | null;
  voteId: string | null;
}

export interface Experience {
  _id: string;
  userId: string;
  peptideName: string;
  peptideId: string;
  dosage: string;
  frequency: string;
  duration: number;
  route: string;
  primaryPurpose: string[];
  demographics: {
    ageRange: string;
    biologicalSex: string;
    activityLevel: string;
  };
  outcomes: {
    [key: string]: number;
  };
  effects: string[];
  timeline: string;
  story?: string;
  stack?: string[];
  sourcing?: {
    source: string;
    batchNumber?: string;
    certificateOfAnalysis?: string;
  };
  trackingId: string;
  createdAt: string;
  updatedAt: string;
  votes?: {
    helpful: number;
    notHelpful: number;
    detailed: number;
    concerning: number;
  };
}

export interface ExperienceSubmission {
  peptideId: string;
  dosage: string;
  frequency: string;
  duration: number;
  routeOfAdministration: string;
  primaryPurpose: string[];
  demographics: UserDemographics;
  outcomes: Outcomes;
  effects?: string[];
  timeline: string;
  story?: string;
  stack?: string[];
  sourcing?: {
    [key: string]: boolean;
  };
  captchaToken?: string;
}

export interface ExperienceFilters {
  peptideId?: string;
  userId?: string;
  rating?: number;
  effects?: string[];
  sortBy?: 'newest' | 'oldest' | 'rating' | 'votes';
  limit?: number;
  skip?: number;
}

// Description: Submit a new experience
// Endpoint: POST /api/experiences
// Request: { peptideId: string, dosage: string, frequency: string, duration: number, route: string, outcomes: object, story?: string, demographics?: object }
// Response: { success: boolean, data: { experience: Experience, trackingId: string } }
export const submitExperience = async (experienceData: ExperienceSubmission) => {
  try {
    console.log('API: submitExperience called with data:', experienceData);
    console.log('API: Making POST request to /api/experiences');
    const response = await api.post('/api/experiences', experienceData);
    console.log('API: submitExperience response status:', response.status);
    console.log('API: submitExperience response data:', response.data);
    return response.data.data; // Return the data object directly
  } catch (error: any) {
    console.error('API: submitExperience error:', error);
    console.error('API: submitExperience error response:', error?.response?.data);
    console.error('API: submitExperience error stack:', error.stack);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all experiences with optional filters
// Endpoint: GET /api/experiences
// Request: { filters?: ExperienceFilters }
// Response: { success: boolean, data: { experiences: Experience[] } }
export const getExperiences = async (filters?: ExperienceFilters) => {
  try {
    console.log('API: getExperiences called with filters:', filters);
    const response = await api.get('/api/experiences', { params: filters });
    console.log('API: getExperiences response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: getExperiences error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get experience by ID
// Endpoint: GET /api/experiences/:id
// Request: {}
// Response: { success: boolean, data: Experience }
export const getExperienceById = async (id: string) => {
  try {
    console.log('API: getExperienceById called with id:', id);
    const response = await api.get(`/api/experiences/${id}`);
    console.log('API: getExperienceById response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: getExperienceById error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new experience
// Endpoint: POST /api/experiences
// Request: { experience: Omit<Experience, '_id' | 'userId' | 'createdAt' | 'updatedAt'> }
// Response: { success: boolean, data: Experience }
export const createExperience = async (experience: Omit<Experience, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log('API: createExperience called with experience:', experience);
    const response = await api.post('/api/experiences', experience);
    console.log('API: createExperience response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: createExperience error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an experience
// Endpoint: PUT /api/experiences/:id
// Request: { experience: Partial<Omit<Experience, '_id' | 'userId' | 'createdAt' | 'updatedAt'>> }
// Response: { success: boolean, data: Experience }
export const updateExperience = async (id: string, experience: Partial<Omit<Experience, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
  try {
    console.log('API: updateExperience called with id:', id, 'experience:', experience);
    const response = await api.put(`/api/experiences/${id}`, experience);
    console.log('API: updateExperience response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: updateExperience error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete an experience
// Endpoint: DELETE /api/experiences/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteExperience = async (id: string) => {
  try {
    console.log('API: deleteExperience called with id:', id);
    const response = await api.delete(`/api/experiences/${id}`);
    console.log('API: deleteExperience response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: deleteExperience error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Vote on an experience
// Endpoint: POST /api/experiences/:id/vote
// Request: { voteType: 'helpful' | 'not-helpful' | 'detailed' | 'concerning' }
// Response: { success: boolean, data: { vote: { _id: string, voteType: string } } }
export const voteOnExperience = async (experienceId: string, voteType: 'helpful' | 'not-helpful' | 'detailed' | 'concerning') => {
  try {
    console.log('API: voteOnExperience called with experienceId:', experienceId, 'voteType:', voteType);
    const response = await api.post(`/api/experiences/${experienceId}/vote`, { voteType });
    console.log('API: voteOnExperience response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: voteOnExperience error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get user's vote for an experience
// Endpoint: GET /api/experiences/:id/vote
// Request: {}
// Response: { success: boolean, data: UserVote }
export const getUserVoteForExperience = async (experienceId: string) => {
  try {
    console.log('API: getUserVoteForExperience called with experienceId:', experienceId);
    const response = await api.get(`/api/experiences/${experienceId}/vote`);
    console.log('API: getUserVoteForExperience response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: getUserVoteForExperience error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get experience by tracking ID
// Endpoint: GET /api/experiences/tracking/:trackingId
// Request: {}
// Response: { success: boolean, data: { experience: Experience } }
export const getExperienceByTrackingId = async (trackingId: string) => {
  try {
    console.log('API: getExperienceByTrackingId called with trackingId:', trackingId);
    const response = await api.get(`/api/experiences/tracking/${trackingId}`);
    console.log('API: getExperienceByTrackingId response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: getExperienceByTrackingId error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get public experiences for the home page
// Endpoint: GET /api/experiences/home/public
// Request: {}
// Response: { success: boolean, data: { experiences: Experience[] } }
export const getPublicExperiences = async () => {
  try {
    console.log('API: getPublicExperiences called');
    const response = await api.get('/api/experiences/home/public');
    console.log('API: getPublicExperiences response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: getPublicExperiences error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};