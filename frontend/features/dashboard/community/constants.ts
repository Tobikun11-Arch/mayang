import type {UserStatus, ZoneType, PinType} from './types';

// STATUS_COLOR — used by buildUserIcon() in iconBuilders.ts and the sidebar user list
export const STATUS_COLOR: Record<UserStatus, string> = {
  online: '#16a34a',
  idle: '#d97706',
  offline: '#9ca3af'
};

// ZONE_STYLE — used by addZonePolygons() in MapReference.tsx and the zone legend in Sidebar
export const ZONE_STYLE: Record<
  ZoneType,
  {color: string; fill: string; label: string}
> = {
  flood: {color: '#2563eb', fill: '#3b82f620', label: 'Flooded'},
  safe: {color: '#16a34a', fill: '#22c55e20', label: 'Safe Zone'},
  danger: {color: '#dc2626', fill: '#ef444420', label: 'Danger'},
  fire: {color: '#ea580c', fill: '#f9731620', label: 'Fire Risk'}
};

// PIN_COLOR — each key maps to a SavedLocation.type;
// if you remove a key, that pin type falls back to undefined in buildPinIcon()
export const PIN_COLOR: Record<PinType, string> = {
  user: '#3b82f6',
  evacuation: '#16a34a',
  health: '#ef4444',
  job: '#8b5cf6',
  incident: '#f97316',
  government: '#0ea5e9',
  education: '#f59e0b',
  environment: '#10b981'
};
