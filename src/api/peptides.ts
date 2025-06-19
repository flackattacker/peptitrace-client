import api from './api';

export interface Peptide {
  _id: string;
  name: string;
  peptide_sequence: string;
  category: string;
  description: string;
  averageRating?: number;
  totalExperiences?: number;
  commonEffects?: string[];
  sideEffects?: string[];
  dosageRanges?: {
    low: string;
    medium: string;
    high: string;
  };
  timeline?: {
    onset: string;
    peak: string;
    duration: string;
  };
  contraindications?: string[];
  researchStage?: string;
  molecularWeight?: number;
  halfLife?: string;
  commonDosage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PeptideDetail {
  _id: string;
  name: string;
  description: string;
  commonEffects: string[];
  sideEffects: string[];
  popularity: number;
  totalExperiences: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePeptideData {
  name: string;
  peptide_sequence: string;
  category: string;
  description: string;
  detailedDescription: string;
  mechanism: string;
  commonDosage: string;
  commonFrequency: string;
  commonEffects?: string[];
  sideEffects?: string[];
  commonStacks?: string[];
  dosageRanges?: {
    low: string;
    medium: string;
    high: string;
  };
  timeline?: {
    onset: string;
    peak: string;
    duration: string;
  };
}

// Description: Seed the database with initial peptide data
// Endpoint: POST /api/seed/peptides
// Request: {}
// Response: { success: boolean, message: string, count: number }
export const seedPeptides = async () => {
  console.log('API: seedPeptides called');
  try {
    console.log('API: Making POST request to /api/seed/peptides');
    const response = await api.post('/api/seed/peptides');
    console.log('API: seedPeptides response status:', response.status);
    console.log('API: seedPeptides response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: seedPeptides error:', error);
    console.error('API: seedPeptides error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get public peptides for the home page
// Endpoint: GET /api/peptides/public
// Request: {}
// Response: { success: boolean, data: { peptides: Peptide[] } }
export const getPublicPeptides = async () => {
  console.log('API: getPublicPeptides called');
  try {
    console.log('API: Making GET request to /api/peptides/public');
    const response = await api.get('/api/peptides/public');
    console.log('API: getPublicPeptides response status:', response.status);
    console.log('API: getPublicPeptides response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: getPublicPeptides error:', error);
    console.error('API: getPublicPeptides error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all peptides
// Endpoint: GET /api/peptides
// Request: {}
// Response: { success: boolean, data: { peptides: Peptide[] } }
export const getPeptides = async () => {
  console.log('API: getPeptides called');
  try {
    console.log('API: Making GET request to /api/peptides');
    const response = await api.get('/api/peptides');
    console.log('API: getPeptides response status:', response.status);
    console.log('API: getPeptides response data:', response.data);
    console.log('API: getPeptides peptides count:', response.data?.data?.peptides?.length || 0);
    console.log('API: getPeptides first peptide totalExperiences:', response.data?.data?.peptides?.[0]?.totalExperiences);
    console.log('API: getPeptides all peptide totalExperiences:', response.data?.data?.peptides?.map((p: any) => ({ name: p.name, totalExperiences: p.totalExperiences })));
    return response.data;
  } catch (error: any) {
    console.error('API: getPeptides error:', error);
    console.error('API: getPeptides error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get a single peptide by ID
// Endpoint: GET /api/peptides/:id
// Request: {}
// Response: { success: boolean, data: { peptide: Peptide } }
export const getPeptide = async (id: string) => {
  console.log('API: getPeptide called with id:', id);
  try {
    console.log('API: Making GET request to /api/peptides/' + id);
    const response = await api.get(`/api/peptides/${id}`);
    console.log('API: getPeptide response status:', response.status);
    console.log('API: getPeptide response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: getPeptide error:', error);
    console.error('API: getPeptide error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get detailed peptide information by ID
// Endpoint: GET /api/peptides/:id
// Request: {}
// Response: { success: boolean, data: { peptide: PeptideDetail } }
export const getPeptideDetail = async (id: string) => {
  console.log('API: getPeptideDetail called with id:', id);
  try {
    console.log('API: Making GET request to /api/peptides/' + id);
    const response = await api.get(`/api/peptides/${id}`);
    console.log('API: getPeptideDetail response status:', response.status);
    console.log('API: getPeptideDetail response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: getPeptideDetail error:', error);
    console.error('API: getPeptideDetail error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new peptide
// Endpoint: POST /api/peptides
// Request: { name: string, category: string, description: string, ... }
// Response: { success: boolean, data: { peptide: Peptide } }
export const createPeptide = async (peptideData: Partial<Peptide>) => {
  console.log('API: createPeptide called with data:', peptideData);
  try {
    console.log('API: Making POST request to /api/peptides');
    const response = await api.post('/api/peptides', peptideData);
    console.log('API: createPeptide response status:', response.status);
    console.log('API: createPeptide response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: createPeptide error:', error);
    console.error('API: createPeptide error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update a peptide
// Endpoint: PUT /api/peptides/:id
// Request: { name?: string, category?: string, description?: string, ... }
// Response: { success: boolean, data: { peptide: Peptide } }
export const updatePeptide = async (id: string, peptideData: Partial<Peptide>) => {
  console.log('API: updatePeptide called with id:', id, 'data:', peptideData);
  try {
    console.log('API: Making PUT request to /api/peptides/' + id);
    const response = await api.put(`/api/peptides/${id}`, peptideData);
    console.log('API: updatePeptide response status:', response.status);
    console.log('API: updatePeptide response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: updatePeptide error:', error);
    console.error('API: updatePeptide error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a peptide
// Endpoint: DELETE /api/peptides/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deletePeptide = async (id: string) => {
  console.log('API: deletePeptide called with id:', id);
  try {
    console.log('API: Making DELETE request to /api/peptides/' + id);
    const response = await api.delete(`/api/peptides/${id}`);
    console.log('API: deletePeptide response status:', response.status);
    console.log('API: deletePeptide response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: deletePeptide error:', error);
    console.error('API: deletePeptide error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Clear all peptides from database
// Endpoint: DELETE /api/seed/peptides
// Request: {}
// Response: { success: boolean, message: string }
export const clearPeptides = async () => {
  console.log('API: clearPeptides called');
  try {
    console.log('API: Making DELETE request to /api/seed/peptides');
    const response = await api.delete('/api/seed/peptides');
    console.log('API: clearPeptides response status:', response.status);
    console.log('API: clearPeptides response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: clearPeptides error:', error);
    console.error('API: clearPeptides error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Purge all data from database (peptides and experiences)
// Endpoint: DELETE /api/purge
// Request: {}
// Response: { success: boolean, message: string }
export const purgeAllData = async () => {
  console.log('API: purgeAllData called');
  try {
    console.log('API: Making DELETE request to /api/purge');
    const response = await api.delete('/api/purge');
    console.log('API: purgeAllData response status:', response.status);
    console.log('API: purgeAllData response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: purgeAllData error:', error);
    console.error('API: purgeAllData error response:', error?.response?.data);
    throw new Error(error?.response?.data?.error || error.message);
  }
};