'use client';

import {useState, useEffect, useCallback, useRef} from 'react';
import {
  User,
  Phone,
  Plus,
  Trash2,
  Heart,
  MapPin
} from 'lucide-react';
import type {FamilyMember} from '@/features/dashboard/community/types';

const STORAGE_KEY = 'family_members';
const DEFAULT_CENTER: [number, number] = [14.393, 120.855];

export default function FamilyPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setMembers(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Init mini map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let mounted = true;

    import('leaflet').then(mod => {
      if (!mounted || mapInstanceRef.current) return;
      const L = (mod as unknown as {default: typeof import('leaflet')}).default;

      if (!(window as unknown as Record<string, unknown>).L) {
        (window as unknown as Record<string, unknown>).L = L;
      }

      const map = L.map(mapRef.current!, {
        center: DEFAULT_CENTER,
        zoom: 14,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({position: 'bottomright'}).addTo(map);

      map.on('click', async (e: any) => {
        const {lat: clickLat, lng: clickLng} = e.latlng;
        setLat(clickLat);
        setLng(clickLng);

        // Place / move marker
        if (markerRef.current) {
          markerRef.current.setLatLng([clickLat, clickLng]);
        } else {
          const icon = L.divIcon({
            className: '',
            html: `<div style="width:14px;height:14px;border-radius:50%;background:#0d9488;border:3px solid white;box-shadow:0 0 8px rgba(13,148,136,0.6);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });
          markerRef.current = L.marker([clickLat, clickLng], {icon}).addTo(map);
        }

        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickLat}&lon=${clickLng}`,
            {headers: {'User-Agent': 'my-docs/1.0'}}
          );
          if (res.ok) {
            const data = await res.json();
            setAddress(data.display_name || `${clickLat.toFixed(5)}, ${clickLng.toFixed(5)}`);
          } else {
            setAddress(`${clickLat.toFixed(5)}, ${clickLng.toFixed(5)}`);
          }
        } catch {
          setAddress(`${clickLat.toFixed(5)}, ${clickLng.toFixed(5)}`);
        }
      });

      mapInstanceRef.current = map;
    });

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
    };
  }, []);

  const persist = (next: FamilyMember[]) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  const handleAdd = () => {
    if (!name.trim() || lat === null || lng === null) return;

    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      contact: contact.trim(),
      address: address.trim() || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      lat,
      lng
    };

    const next = [...members, newMember];
    setMembers(next);
    persist(next);
    setName('');
    setContact('');
    setAddress('');
    setLat(null);
    setLng(null);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  };

  const handleDelete = (id: string) => {
    const next = members.filter(m => m.id !== id);
    setMembers(next);
    persist(next);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
      <div className="w-full max-w-[580px] mx-auto">
        <div className="mb-6">
          <h1 className="text-[17px] font-bold text-gray-900">Family</h1>
          <p className="text-[13px] text-gray-400 mt-1">
            Add your relatives so they appear on the community map.
          </p>
        </div>

        <div className="space-y-5">
          {/* Add form */}
          <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Add Relative
            </p>
            <div className="space-y-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-teal-400 placeholder:text-gray-300"
                />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Contact number (optional)"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-teal-400 placeholder:text-gray-300"
                />
              </div>

              {/* Mini map picker */}
              <div>
                <p className="text-[11px] font-medium text-gray-400 mb-1.5">
                  Click on the map to set location
                </p>
                <link
                  rel="stylesheet"
                  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                />
                <div
                  ref={mapRef}
                  className="w-full rounded-xl border border-gray-200 overflow-hidden"
                  style={{height: 250, background: '#f8fafc'}}
                />
                {lat !== null && lng !== null && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-teal-600" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-teal-800">
                        {lat.toFixed(5)}, {lng.toFixed(5)}
                      </p>
                      <p className="text-[11px] text-teal-600 truncate">
                        {address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAdd}
                disabled={!name.trim() || lat === null || lng === null}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-2.5 text-[13px] font-semibold text-white hover:bg-teal-600 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
                Add Relative
              </button>
            </div>
          </section>

          {/* Family list */}
          <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Saved Relatives ({members.length})
            </p>
            {members.length === 0 ? (
              <p className="text-[12px] text-gray-300 text-center py-6">
                No relatives added yet.
              </p>
            ) : (
              <div className="space-y-2">
                {members.map(m => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100">
                      <Heart size={14} className="text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-gray-700">
                        {m.name}
                      </p>
                      <p className="truncate text-[11px] text-gray-400">
                        {m.contact || 'No contact'} · {m.address}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
