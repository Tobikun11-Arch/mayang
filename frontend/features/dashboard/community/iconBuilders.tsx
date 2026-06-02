import {Siren, Building2, Heart, Briefcase, GraduationCap, AlertTriangle, TreePine, AlertCircle} from 'lucide-react';
import type {UserStatus, PinType} from './types';
import {STATUS_COLOR, PIN_COLOR} from './constants';
import {makeLucideIcon} from './utils';

// buildMyLocationIcon — large blue dot with pulse ring.
// Called once in addMyLocationMarker() on map init; if removed the "you" dot disappears.
export function buildMyLocationIcon(L: typeof import('leaflet')) {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:24px;height:24px;">
      <div style="position:absolute;inset:-6px;border-radius:50%;background:#3b82f6;opacity:0.15;animation:pulse-ring 2s ease-out infinite;"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 8px #3b82f688;"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:white;"></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

// buildMyLocationWithReportIcon — user dot with an orange badge indicating nearby reports.
export function buildMyLocationWithReportIcon(L: typeof import('leaflet')) {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:24px;height:24px;">
      <div style="position:absolute;inset:-6px;border-radius:50%;background:#3b82f6;opacity:0.15;animation:pulse-ring 2s ease-out infinite;"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 8px #3b82f688;"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:white;"></div>
      <div style="position:absolute;top:-4px;right:-4px;width:12px;height:12px;border-radius:50%;background:#f97316;border:2px solid white;box-shadow:0 0 4px #f9731688;display:flex;align-items:center;justify-content:center;">
        <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4m0 4h0"/></svg>
      </div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

// buildUserIcon — status-colored dot for each mock user.
// Called per user in addUserMarkers(); if removed every user dot on the map goes blank.
export function buildUserIcon(L: typeof import('leaflet'), status: UserStatus) {
  const color = STATUS_COLOR[status];
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:24px;height:24px;">
      <div style="position:absolute;inset:-6px;border-radius:50%;background:${color};opacity:0.15;animation:pulse-ring 2s ease-out infinite;"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 0 8px ${color}88;"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:white;"></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

// buildDistressIcon — large SOS icon with radiating rings for Carlo Mendoza (distress: true).
// Called in addUserMarkers() for the distress user; if removed his pin falls back to buildUserIcon.
export function buildDistressIcon(L: typeof import('leaflet')) {
  const svg = makeLucideIcon(
    <Siren size={12} color="#fff" strokeWidth={2.5} />
  );
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:32px;height:32px;">
      <div style="position:absolute;inset:-10px;border-radius:50%;background:#ef4444;opacity:0.12;animation:distress-ring 1s ease-out infinite;"></div>
      <div style="position:absolute;inset:-4px;border-radius:50%;background:#ef4444;opacity:0.2;animation:distress-ring 1s ease-out infinite 0.2s;"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 0 10px #ef444488;display:flex;align-items:center;justify-content:center;">
        ${svg}
      </div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

// buildPinIcon — colored circle with Lucide icon for each saved location type.
// Called per location in addSavedLocationMarkers(); if removed all location pins vanish from the map.
export function buildPinIcon(
  L: typeof import('leaflet'),
  type: PinType,
  color: string
) {
  const iconMap: Record<PinType, React.ReactElement> = {
    evacuation: <Building2 size={13} color="#fff" strokeWidth={2} />,
    health: <Heart size={13} color="#fff" strokeWidth={2} />,
    job: <Briefcase size={13} color="#fff" strokeWidth={2} />,
    government: <Building2 size={13} color="#fff" strokeWidth={2} />,
    education: <GraduationCap size={13} color="#fff" strokeWidth={2} />,
    incident: <AlertTriangle size={13} color="#fff" strokeWidth={2} />,
    environment: <TreePine size={13} color="#fff" strokeWidth={2} />,
    user: <Building2 size={13} color="#fff" strokeWidth={2} />
  };
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2.5px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.2);">
      ${makeLucideIcon(iconMap[type])}
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28]
  });
}

// buildFamilyIcon — teal circle with Heart icon for family members added via the Family tab.
export function buildFamilyIcon(L: typeof import('leaflet')) {
  const svg = makeLucideIcon(
    <Heart size={13} color="#fff" strokeWidth={2} />
  );
  return L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50%;background:#0d9488;border:2.5px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(13,148,136,0.4);">
      ${svg}
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
}

// buildReportIcon — orange circle with AlertCircle icon for user-submitted incident reports.
// Called dynamically in MapReference when a new report is added via ReportContext.
export function buildReportIcon(L: typeof import('leaflet')) {
  const svg = makeLucideIcon(
    <AlertCircle size={14} color="#fff" strokeWidth={2} />
  );
  return L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50%;background:#f97316;border:2.5px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(249,115,22,0.4);">
      ${svg}
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
}
