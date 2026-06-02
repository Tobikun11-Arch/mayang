'use client';

import {useEffect, useRef, useState, useCallback} from 'react';
import type {Map as LeafletMap, Marker, Circle, Polygon, Polyline} from 'leaflet';
import {Locate, Menu} from 'lucide-react';
import type {Coords, User, SavedLocation, FloatingPanel as FP, FamilyMember} from './types';
import {STATUS_COLOR, ZONE_STYLE, PIN_COLOR} from './constants';
import {MOCK_USERS, SAVED_LOCATIONS, ZONES} from './data';
import {calculateDistance, latLngToPixel} from './utils';
import {
  buildMyLocationIcon,
  buildMyLocationWithReportIcon,
  buildUserIcon,
  buildDistressIcon,
  buildPinIcon,
  buildReportIcon,
  buildFamilyIcon
} from './iconBuilders';
import {useReports} from '@/features/reports/ReportContent';
import type {UserReport} from '@/features/reports/types';

function parseRangeToMeters(range: string): number {
  const m = parseFloat(range);
  return range.endsWith('km') ? m * 1000 : m;
}

function calculateDistanceNum(
  lat1: number, lng1: number, lat2: number, lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
import Sidebar from './components/SideBar';
import FloatingPanel from './components/FloatingPanel';
import SignalBar from './components/SignalBar';

export default function MapReference() {
  // MAP STATE
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const pulseLayersRef = useRef<Circle[]>([]);
  const routeLineRef = useRef<Polyline | null>(null);
  const zonesRef = useRef<Polygon[]>([]);
  const userLocationRef = useRef<Coords | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [mapInitDone, setMapInitDone] = useState(false);
  const [userLocation, setUserLocation] = useState<Coords | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'family' | 'public'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [floatingPanel, setFloatingPanel] = useState<FP | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [signalSent, setSignalSent] = useState(false);
  const [signalReceived, setSignalReceived] = useState<User[] | null>(null);
  const {reports} = useReports();
  const reportMarkersRef = useRef<Map<string, Marker>>(new Map());
  const userMarkerRef = useRef<Marker | null>(null);
  const nearbyReportsRef = useRef<UserReport[]>([]);
  const familyMarkersRef = useRef<Marker[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('family_members');
      if (raw) setFamilyMembers(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const filteredUsers = MOCK_USERS.filter(u =>
    activeFilter === 'all' ? true : u.group === activeFilter
  );

  // GPS → map init (cached in sessionStorage so location is only detected once per session)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    const loadLocation = (loc: Coords) => {
      setUserLocation(loc);
      userLocationRef.current = loc;
      setMapReady(true);

      const cachedAddr = sessionStorage.getItem('community_user_address');
      if (cachedAddr) {
        setUserAddress(cachedAddr);
        return;
      }

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`,
        {headers: {'User-Agent': 'my-docs/1.0'}}
      )
        .then(r => r.json())
        .then(data => {
          const addr = data.display_name || `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
          setUserAddress(addr);
          sessionStorage.setItem('community_user_address', addr);
        })
        .catch(() => {
          const addr = `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
          setUserAddress(addr);
          sessionStorage.setItem('community_user_address', addr);
        });
    };

    const cached = sessionStorage.getItem('community_user_location');
    if (cached) {
      try {
        const loc: Coords = JSON.parse(cached);
        loadLocation(loc);
        return;
      } catch {
        // invalid cache, fall through to re-detect
      }
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc: Coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        sessionStorage.setItem('community_user_location', JSON.stringify(loc));
        loadLocation(loc);
      },
      () => {
        setLocationError(
          'Location permission denied. Map cannot load without your location.'
        );
      }
    );
  }, []);

  useEffect(() => {
    if (
      !mapReady ||
      !mapRef.current ||
      mapInstanceRef.current ||
      !userLocationRef.current
    )
      return;

    const loc = userLocationRef.current;

    import('leaflet').then(mod => {
      const L = (mod as unknown as {default: typeof import('leaflet')}).default;

      if (!L.Icon.Default.imagePath) {
        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
          ._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
        });
      }

      (window as unknown as Record<string, unknown>).L = L;

      const map = L.map(mapRef.current!, {
        center: [loc.lat, loc.lng],
        zoom: 15,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({position: 'bottomright'}).addTo(map);

      mapInstanceRef.current = map;

      map.on('click', () => setFloatingPanel(null));

      addMyLocationMarker(L, map, loc);
      addUserMarkers(L, map, loc);
      addSavedLocationMarkers(L, map, loc);
      addZonePolygons(L, map);
      addFamilyMarkers(L, map, loc);

      setMapInitDone(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady]);

  // User-submitted reports — adds markers once the map is ready, then syncs when reports change.
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = (window as unknown as {L: typeof import('leaflet')}).L;
    const origin = userLocationRef.current;
    if (!map || !L || !origin) return;

    const seen = new Set<string>();
    const nearby: UserReport[] = [];

    reports.forEach(r => {
      seen.add(r.id);

      const distMeters = calculateDistanceNum(origin.lat, origin.lng, r.lat, r.lng);
      const rangeMeters = parseRangeToMeters(r.range || '100m');

      if (distMeters <= rangeMeters) {
        nearby.push(r);
        if (reportMarkersRef.current.has(r.id)) {
          reportMarkersRef.current.get(r.id)!.remove();
          reportMarkersRef.current.delete(r.id);
        }
        return;
      }

      if (reportMarkersRef.current.has(r.id)) return;
      const marker = L.marker([r.lat, r.lng], {
        icon: buildReportIcon(L)
      }).addTo(map);
      marker.on('click', e => {
        L.DomEvent.stopPropagation(e);
        const px = latLngToPixel(map, r.lat, r.lng);
        setFloatingPanel({
          x: px.x,
          y: px.y,
          type: 'report',
          title: r.type.charAt(0).toUpperCase() + r.type.slice(1),
          data: {
            type: r.type,
            severity: r.severity,
            range: r.range,
            description: r.description,
            imagePreviews: r.imagePreviews,
            contactName: r.contactName,
            contactPhone: r.contactPhone,
            reportedAt: r.reportedAt
          }
        });
      });
      reportMarkersRef.current.set(r.id, marker);
    });

    reportMarkersRef.current.forEach((marker, id) => {
      if (!seen.has(id)) {
        marker.remove();
        reportMarkersRef.current.delete(id);
      }
    });

    nearbyReportsRef.current = nearby;

    // Update user marker icon to show badge when reports are nearby
    const userMarker = userMarkerRef.current;
    if (userMarker) {
      userMarker.setIcon(
        nearby.length > 0
          ? buildMyLocationWithReportIcon(L)
          : buildMyLocationIcon(L)
      );
    }
  }, [reports, mapInitDone]);

  // MARKER SETUP

  const addMyLocationMarker = useCallback(
    (L: typeof import('leaflet'), map: LeafletMap, coords: Coords) => {
      const marker = L.marker([coords.lat, coords.lng], {
        icon: buildMyLocationIcon(L),
        zIndexOffset: 1000
      }).addTo(map);
      marker.on('click', e => {
        L.DomEvent.stopPropagation(e);
        const px = latLngToPixel(map, coords.lat, coords.lng);
        const nearby = nearbyReportsRef.current;
        const addr = sessionStorage.getItem('community_user_address') || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
        setFloatingPanel({
          x: px.x,
          y: px.y,
          type: 'user',
          title: 'My Location',
          data: {
            description: addr,
            nearbyReports: nearby
          }
        });
      });
      userMarkerRef.current = marker;
      markersRef.current.push(marker);
    },
    []
  );

  const addUserMarkers = useCallback(
    (L: typeof import('leaflet'), map: LeafletMap, origin: Coords) => {
      MOCK_USERS.forEach(user => {
        const icon = user.distress
          ? buildDistressIcon(L)
          : buildUserIcon(L, user.status);
        const marker = L.marker([user.lat, user.lng], {icon}).addTo(map);
        marker.on('click', e => {
          L.DomEvent.stopPropagation(e);
          const px = latLngToPixel(map, user.lat, user.lng);
          const dist = calculateDistance(
            origin.lat,
            origin.lng,
            user.lat,
            user.lng
          );
          setSelectedUser(user);
          setFloatingPanel({
            x: px.x,
            y: px.y,
            type: user.distress ? 'distress' : 'user',
            title: user.name,
            data: {
              status: user.status,
              group: user.group,
              address: user.address,
              distance: dist,
              distress: user.distress
            }
          });
        });
        markersRef.current.push(marker);
      });
    },
    []
  );

  const addSavedLocationMarkers = useCallback(
    (L: typeof import('leaflet'), map: LeafletMap, origin: Coords) => {
      SAVED_LOCATIONS.forEach(loc => {
        const color = PIN_COLOR[loc.type];
        const marker = L.marker([loc.lat, loc.lng], {
          icon: buildPinIcon(L, loc.type, color)
        }).addTo(map);
        marker.on('click', e => {
          L.DomEvent.stopPropagation(e);
          const px = latLngToPixel(map, loc.lat, loc.lng);
          const dist = calculateDistance(
            origin.lat,
            origin.lng,
            loc.lat,
            loc.lng
          );
          setFloatingPanel({
            x: px.x,
            y: px.y,
            type: loc.type,
            title: loc.name,
            data: {...loc.details, distance: dist}
          });
        });
        markersRef.current.push(marker);
      });
    },
    []
  );

  const addZonePolygons = useCallback(
    (L: typeof import('leaflet'), map: LeafletMap) => {
      zonesRef.current.forEach(z => z.remove());
      zonesRef.current = [];

      ZONES.forEach(zone => {
        const style = ZONE_STYLE[zone.type];
        const poly = L.polygon(zone.coords, {
          color: style.color,
          fillColor: style.color,
          fillOpacity: 0.18,
          weight: 2,
          opacity: 0.9
        }).addTo(map);

        poly.on('click', e => {
          L.DomEvent.stopPropagation(e);
          const center = poly.getBounds().getCenter();
          const px = latLngToPixel(map, center.lat, center.lng);
          setFloatingPanel({
            x: px.x,
            y: px.y,
            type: 'zone',
            title: zone.name,
            data: zone.report as unknown as Record<string, unknown>,
            zoneType: zone.type
          });
        });

        zonesRef.current.push(poly);
      });
    },
    []
  );

  const addFamilyMarkers = useCallback(
    (L: typeof import('leaflet'), map: LeafletMap, origin: Coords) => {
      familyMarkersRef.current.forEach(m => m.remove());
      familyMarkersRef.current = [];

      let stored: FamilyMember[] = [];
      try {
        const raw = localStorage.getItem('family_members');
        if (raw) stored = JSON.parse(raw);
      } catch {
        return;
      }

      stored.forEach(member => {
        const marker = L.marker([member.lat, member.lng], {
          icon: buildFamilyIcon(L)
        }).addTo(map);
        marker.on('click', e => {
          L.DomEvent.stopPropagation(e);
          const px = latLngToPixel(map, member.lat, member.lng);
          const dist = calculateDistance(
            origin.lat,
            origin.lng,
            member.lat,
            member.lng
          );
          setFloatingPanel({
            x: px.x,
            y: px.y,
            type: 'family',
            title: member.name,
            data: {
              contact: member.contact || '—',
              address: member.address,
              distance: dist
            }
          });
        });
        familyMarkersRef.current.push(marker);
      });
    },
    []
  );

  // INTERACTION HANDLERS

  const drawRouteLine = useCallback(
    (map: LeafletMap, from: Coords, to: Coords) => {
      import('leaflet').then(mod => {
        const L = (mod as unknown as {default: typeof import('leaflet')}).default;
        routeLineRef.current?.remove();
        routeLineRef.current = L.polyline(
          [
            [from.lat, from.lng],
            [to.lat, to.lng]
          ],
          {color: '#185FA5', weight: 3, dashArray: '6, 5', opacity: 0.85}
        ).addTo(map);
      });
    },
    []
  );

  const recenterMap = useCallback(() => {
    const loc = userLocationRef.current;
    if (!mapInstanceRef.current || !loc) return;
    mapInstanceRef.current.flyTo([loc.lat, loc.lng], 15, {duration: 1.2});
  }, []);

  const focusUser = useCallback(
    (user: User) => {
      setSelectedUser(user);
      const map = mapInstanceRef.current;
      const origin = userLocationRef.current;
      if (!map || !origin) return;
      map.setView([user.lat, user.lng], 16);
      drawRouteLine(map, origin, {lat: user.lat, lng: user.lng});
    },
    [drawRouteLine]
  );

  const focusSaved = useCallback(
    (loc: SavedLocation) => {
      const map = mapInstanceRef.current;
      const origin = userLocationRef.current;
      if (!map || !origin) return;
      map.setView([loc.lat, loc.lng], 17);
      drawRouteLine(map, origin, {lat: loc.lat, lng: loc.lng});
    },
    [drawRouteLine]
  );

  const focusFamily = useCallback(
    (member: FamilyMember) => {
      const map = mapInstanceRef.current;
      const origin = userLocationRef.current;
      if (!map || !origin) return;
      map.setView([member.lat, member.lng], 16);
      drawRouteLine(map, origin, {lat: member.lat, lng: member.lng});
    },
    [drawRouteLine]
  );

  // SIGNAL BROADCAST

  const sendSignal = useCallback(() => {
    setPinging(true);
    setSignalSent(true);
    setSignalReceived(null);
    const map = mapInstanceRef.current;
    const center = userLocationRef.current;
    if (!map || !center) return;

    import('leaflet').then(mod => {
      const L = (mod as unknown as {default: typeof import('leaflet')}).default;
      pulseLayersRef.current.forEach(l => l.remove());
      pulseLayersRef.current = [];
      for (let i = 1; i <= 3; i++) {
        const circle = L.circle([center.lat, center.lng], {
          radius: i * 300,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.04,
          weight: 1,
          opacity: 0.35
        }).addTo(map);
        pulseLayersRef.current.push(circle);
      }
      setTimeout(() => {
        setPinging(false);
        setSignalReceived(MOCK_USERS.filter(u => u.status === 'online'));
        setTimeout(() => {
          pulseLayersRef.current.forEach(l => l.remove());
          pulseLayersRef.current = [];
        }, 3000);
      }, 2000);
    });
  }, []);

  // RENDER

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes distress-ring {
          0%   { transform: scale(0.6); opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes ping-anim {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .signal-btn-pinging { animation: ping-anim 0.8s ease-in-out infinite; }
      `}</style>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <div className="flex h-full flex-col bg-white text-gray-900">
        <div className="relative flex flex-1 overflow-hidden">
          <Sidebar
            userLocation={userLocation}
            userAddress={userAddress}
            locationError={locationError}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filteredUsers={filteredUsers}
            selectedUser={selectedUser}
            familyMembers={familyMembers}
            onFocusUser={focusUser}
            onFocusLocation={focusSaved}
            onFocusFamily={focusFamily}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <div className="relative flex-1">
            {!mapReady && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
                  <p className="text-xs text-gray-400">
                    {locationError ? locationError : 'Waiting for location…'}
                  </p>
                </div>
              </div>
            )}

            <div
              ref={mapRef}
              className="h-full w-full"
              style={{background: '#f8fafc'}}
            />

            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden absolute top-2 left-2 z-[998] flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition"
            >
              <Menu size={16} className="text-gray-600" />
            </button>

            <button
              onClick={recenterMap}
              title="Go to my location"
              style={{
                position: 'absolute',
                bottom: 80,
                right: 10,
                zIndex: 999,
                width: 32,
                height: 32,
                background: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Locate size={16} color="#3b82f6" />
            </button>

            {floatingPanel && (
              <FloatingPanel
                panel={floatingPanel}
                onClose={() => setFloatingPanel(null)}
                onFocusUser={focusUser}
                onFocusLocation={focusSaved}
                mapRef={mapRef}
              />
            )}
          </div>
        </div>

        <SignalBar
          pinging={pinging}
          signalSent={signalSent}
          signalReceived={signalReceived}
          onSendSignal={sendSignal}
          onFocusUser={focusUser}
        />
      </div>
    </>
  );
}
