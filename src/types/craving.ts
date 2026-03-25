export type CravingIntensity = 'low' | 'medium' | 'high' | 'severe';

export interface CravingLog {
  id: string;
  timestamp: string; // ISO string
  intensity: CravingIntensity;
  trigger?: string;
  notes?: string;
  resisted: boolean;
}

export const TRIGGERS = [
  'Stress', 'Social', 'Boredom', 'Emotions', 'Habit', 'Celebration', 'Loneliness', 'Other'
] as const;

export const INTENSITY_LABELS: Record<CravingIntensity, string> = {
  low: 'Mild',
  medium: 'Moderate',
  high: 'Strong',
  severe: 'Intense',
};

export const INTENSITY_SCORES: Record<CravingIntensity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  severe: 4,
};
