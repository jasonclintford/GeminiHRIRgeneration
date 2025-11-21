export interface HRIRMeasurement {
  feature: string;
  value: string;
  impact: string;
}

export interface HRIRData {
  measurements: HRIRMeasurement[];
  impulseResponse: number[]; // Normalized -1.0 to 1.0
  sampleRate: number;
  channel: 'left' | 'right' | 'mono';
}

export interface AppState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  image: File | null;
  imagePreviewUrl: string | null;
  hrirData: HRIRData | null;
  error: string | null;
  thinkingLog: string[];
}
