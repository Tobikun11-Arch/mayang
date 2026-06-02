export type UserStatus = 'online' | 'idle' | 'offline';
export type UserGroup = 'family' | 'public';
export type ZoneType = 'danger' | 'safe' | 'flood' | 'fire';
export type PinType =
  | 'user'
  | 'evacuation'
  | 'health'
  | 'job'
  | 'incident'
  | 'government'
  | 'education'
  | 'environment';

export interface User {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: UserStatus;
  group: UserGroup;
  address: string;
  distress?: boolean;
}

export interface SavedLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: PinType;
  details: LocationDetails;
}

export interface Zone {
  id: number;
  name: string;
  type: ZoneType;
  coords: [number, number][];
  report: ZoneReport;
}

export interface LocationDetails {
  status?: string;
  capacity?: string;
  distance?: string;
  contact?: string;
  description?: string;
  openHours?: string;
  reportCount?: number;
  severity?: string;
  jobCount?: number;
  date?: string;
}

export interface ZoneReport {
  reportedBy: string;
  reportedAt: string;
  severity: string;
  description: string;
  affectedCount?: number;
  caseCount?: number;
}

export interface FloatingPanel {
  x: number;
  y: number;
  type: PinType | 'zone' | 'user' | 'distress' | 'report' | 'family';
  title: string;
  data: LocationDetails | ZoneReport | Record<string, unknown>;
  zoneType?: ZoneType;
}

export interface FamilyMember {
  id: string;
  name: string;
  contact: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Coords {
  lat: number;
  lng: number;
}
