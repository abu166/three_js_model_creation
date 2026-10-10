export type CabinetColor = 'white' | 'gray' | 'walnut';
export type AmbientTheme = 'day' | 'night' | 'studio';

export interface CabinetDimensions {
  width: number;  // in mm
  height: number; // in mm
  depth: number;  // in mm
}

export interface CabinetConfig {
  dimensions: CabinetDimensions;
  color: CabinetColor;
  ambientTheme: AmbientTheme;
  isDoorOpen: boolean;
  showDimensions: boolean;
  wireframe: boolean;
  autoRotate: boolean;
}

export interface DimensionLimits {
  min: number;
  max: number;
  step: number;
}

export const DIMENSION_LIMITS: Record<keyof CabinetDimensions, DimensionLimits> = {
  width: { min: 400, max: 1400, step: 10 },
  height: { min: 350, max: 1100, step: 10 },
  depth: { min: 300, max: 700, step: 10 },
};

export const COLOR_OPTIONS: {
  id: CabinetColor;
  name: string;
  subname: string;
  hex: string;
  roughness: number;
  metalness: number;
}[] = [
  {
    id: 'white',
    name: 'Ақ (White)',
    subname: 'Satin Finish',
    hex: '#F8F9FA',
    roughness: 0.35,
    metalness: 0.1,
  },
  {
    id: 'gray',
    name: 'Сұр (Gray)',
    subname: 'Matte Anthracite',
    hex: '#374151',
    roughness: 0.35,
    metalness: 0.1,
  },
  {
    id: 'walnut',
    name: 'Жаңғақ (Walnut)',
    subname: 'Natural Wood Grain',
    hex: '#4A3222',
    roughness: 0.7,
    metalness: 0.05,
  },
];

