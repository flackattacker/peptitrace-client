export interface Experience {
  _id: string
  userId: string
  peptideId: string
  peptideName: string
  dosage: string
  frequency: string
  duration: number
  route: string
  outcomes: {
    energy: number
    sleep: number
    mood: number
    performance: number
    recovery: number
    sideEffects: number
  }
  story?: string
  demographics?: {
    age?: number
    gender?: string
    weight?: number
    height?: number
    activityLevel?: string
    fitnessGoals?: string[]
    medicalConditions?: string[]
    allergies?: string[]
  }
  vendor?: {
    name?: string
    quantity?: string
    batchId?: string
  }
  createdAt: string
  updatedAt: string
} 