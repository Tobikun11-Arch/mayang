import {renderToStaticMarkup} from 'react-dom/server';
import type {Map as LeafletMap} from 'leaflet';

// calculateDistance — haversine formula, used by marker click handlers to show distance from user
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): string {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
}

// latLngToPixel — converts map coords to container pixel position for FloatingPanel placement.
// Used by every marker/polygon click handler; if broken, all floating panels position at (0,0).
export function latLngToPixel(map: LeafletMap, lat: number, lng: number) {
  const L = (window as unknown as {L: typeof import('leaflet')}).L;
  const p = map.latLngToContainerPoint(L.latLng(lat, lng));
  return {x: p.x, y: p.y};
}

// makeLucideIcon — renders a React element to raw SVG HTML for Leaflet divIcon
export function makeLucideIcon(element: React.ReactElement): string {
  return renderToStaticMarkup(element);
}
