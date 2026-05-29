/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeotaggedSample {
  id: string;
  title: string;
  location: LatLng;
  locationLabel: string;
  source: 'Flickr' | 'Mapillary' | 'Google Open Images' | 'Custom';
  description: string;
  terrain: string;
  vegetation: string;
  architecture: string;
  climate: string;
}

export interface AnalysisReasoning {
  terrain: string;
  vegetation: string;
  architecture: string;
  climate: string;
  explanation: string;
}

export interface AlternativePrediction {
  lat: number;
  lng: number;
  label: string;
  confidence: number;
  distanceKm: number;
}

export interface NearestNeighborMatch {
  id: string;
  title: string;
  source: string;
  lat: number;
  lng: number;
  distanceKm: number;
  similarityScore: number;
}

export interface AnalysisResult {
  id: string;
  imageUrl: string;
  predictedLoc: LatLng & { label: string };
  confidence: number;
  reasoning: AnalysisReasoning;
  alternatives: AlternativePrediction[];
  nearestNeighbors: NearestNeighborMatch[];
  exifData?: {
    cameraModel?: string;
    lens?: string;
    focalLength?: string;
    exposure?: string;
    iso?: number;
    captureTime?: string;
    gpsStatus?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
