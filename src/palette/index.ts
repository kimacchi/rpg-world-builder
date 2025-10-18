import { Color } from 'three';

export type EnvironmentType = 'Empty' | 'Grassland' | 'Forest' | 'Mountain' | 'Village' | 'SnowyForest';

export interface Environment {
  name: string;
  color: string;
  baseColor: string;
  prop?: 'Tree' | 'House' | 'Rock'; // Placeholder for the 3D asset
}

export const EnvironmentPalette: Record<EnvironmentType, Environment> = {
    Empty: {
    name: 'Empty',
    color: '#000000',
    baseColor: '#000000',
    },
  Grassland: {
    name: 'Grassland',
    color: '#38a169',
    baseColor: '#48bb78',
  },
  Forest: {
    name: 'Forest',
    color: '#2f855a',
    baseColor: '#38a169',
    prop: 'Tree',
  },
  Mountain: {
    name: 'Mountain',
    color: '#718096',
    baseColor: '#a0aec0',
    prop: 'Rock',
  },
  Village: {
    name: 'Village',
    color: '#8b5cf6',
    baseColor: '#a78bfa',
    prop: 'House',
  },
  SnowyForest: {
    name: 'Snowy Forest',
    color: '#a0a0a0',
    baseColor: '#cccccc',
    prop: 'Tree', // A snowy version of a tree prop
  },
};

// Default type for initial placement
export const DEFAULT_PALETTE_TYPE: EnvironmentType = 'Grassland';