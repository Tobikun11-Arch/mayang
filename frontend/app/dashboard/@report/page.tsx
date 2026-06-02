'use client';

import {useState, useRef, useCallback, useEffect} from 'react';
import Image from 'next/image';
import {
  Camera,
  Upload,
  MapPin,
  AlertTriangle,
  Flame,
  Waves,
  Heart,
  Siren,
  Car,
  Building,
  X,
  Loader2,
  Check,
  Navigation,
  Cloud
} from 'lucide-react';
import {useReports} from '@/features/reports/ReportContent';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

type IncidentType =
  | 'accident'
  | 'fire'
  | 'flood'
  | 'medical'
  | 'robbery'
  | 'earthquake'
  | 'other';

type Severity = 'low' | 'medium' | 'high' | 'critical';
type Range = '50m' | '100m' | '500m' | '1km' | '5km' | '10km';

const INCIDENT_TYPES: {type: IncidentType; label: string; icon: React.ReactNode}[] = [
  {type: 'accident', label: 'Accident', icon: <Car size={18} />},
  {type: 'fire', label: 'Fire', icon: <Flame size={18} />},
  {type: 'flood', label: 'Flood', icon: <Waves size={18} />},
  {type: 'medical', label: 'Medical', icon: <Heart size={18} />},
  {type: 'robbery', label: 'Robbery', icon: <Siren size={18} />},
  {type: 'earthquake', label: 'Earthquake', icon: <Building size={18} />},
  {type: 'other', label: 'Other', icon: <AlertTriangle size={18} />}
];

const RANGES: {value: Range; label: string}[] = [
  {value: '50m', label: 'Nearby (50m)'},
  {value: '100m', label: 'Street (100m)'},
  {value: '500m', label: 'Block (500m)'},
  {value: '1km', label: 'Neighborhood (1km)'},
  {value: '5km', label: 'District (5km)'},
  {value: '10km', label: 'City-wide (10km)'}
];

const SEVERITIES: {value: Severity; label: string; color: string; bg: string}[] = [
  {value: 'low', label: 'Low', color: 'text-green-600', bg: 'bg-green-50 border-green-200'},
  {value: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200'},
  {value: 'high', label: 'High', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200'},
  {value: 'critical', label: 'Critical', color: 'text-red-600', bg: 'bg-red-50 border-red-200'}
];

interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

export default function ReportPage() {
  const {addReport} = useReports();
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [severity, setSeverity] = useState<Severity>('medium');
  const [range, setRange] = useState<Range>('100m');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState('');
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const {latitude, longitude} = pos.coords;
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setLocating(false);
      },
      () => {
        setLocationError('Could not detect location. Type it manually.');
        setLocating(false);
      },
      {enableHighAccuracy: true, timeout: 10000}
    );
  }, []);

  const addImages = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    setImages(prev => [
      ...prev,
      ...arr.map(file => ({
        file,
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file)
      }))
    ]);
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => {
      const target = prev.find(x => x.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(x => x.id !== id);
    });
  };

  useEffect(() => {
    return () => images.forEach(i => URL.revokeObjectURL(i.preview));
  }, [images]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {method: 'POST', body: formData}
    );

    if (!res.ok) throw new Error(`Cloudinary upload failed for ${file.name}`);
    const data = await res.json();
    return data.secure_url as string;
  };

  const geocodeAddress = async (address: string): Promise<{lat: number; lng: number} | null> => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {headers: {'User-Agent': 'my-docs/1.0'}}
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    return {lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon)};
  };

  const getCurrentPosition = () =>
    new Promise<{lat: number; lng: number}>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({lat: pos.coords.latitude, lng: pos.coords.longitude}),
        reject,
        {enableHighAccuracy: true, timeout: 10000}
      );
    });

  const handleSubmit = async () => {
    if (!incidentType) return;
    setSubmitting(true);

    let lat: number, lng: number;

    if (location.trim()) {
      const isCoords = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(location.trim());
      if (isCoords) {
        const parts = location.split(',').map(s => s.trim());
        lat = parseFloat(parts[0]) || 0;
        lng = parts[1] ? parseFloat(parts[1]) : 0;
      } else {
        setGeocoding(true);
        setLocationError('');
        const coords = await geocodeAddress(location);
        setGeocoding(false);
        if (!coords) {
          setLocationError('Could not find that address. Try typing coordinates instead.');
          setSubmitting(false);
          return;
        }
        lat = coords.lat;
        lng = coords.lng;
      }
    } else {
      setLocationError('');
      try {
        const pos = await getCurrentPosition();
        lat = pos.lat;
        lng = pos.lng;
      } catch {
        setLocationError('Could not detect your location. Type it or click Detect.');
        setSubmitting(false);
        return;
      }
    }

    try {
      const cloudinaryUrls = await Promise.all(
        images.map(i => uploadToCloudinary(i.file))
      );

      addReport({
        id: crypto.randomUUID(),
        type: incidentType,
        severity,
        range,
        description,
        lat,
        lng,
        contactName,
        contactPhone,
        imagePreviews: cloudinaryUrls,
        reportedAt: new Date().toLocaleString()
      });

      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setIncidentType(null);
      setSeverity('medium');
      setRange('100m');
      setDescription('');
      setContactName('');
      setContactPhone('');
      setLocation('');
      setLocationError('');
      images.forEach(i => URL.revokeObjectURL(i.preview));
      setImages([]);
    } catch (err) {
      console.error('Upload error:', err);
      setSubmitting(false);
    }
  };

  const canSubmit = incidentType && description.trim().length >= 5;

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={24} className="text-green-600" />
          </div>
          <p className="text-[15px] font-semibold text-gray-900">Report Submitted</p>
          <p className="text-[13px] text-gray-400">Thank you. Authorities have been notified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
      <div className="w-full max-w-[580px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[17px] font-bold text-gray-900">Report Incident</h1>
          <p className="text-[13px] text-gray-400 mt-1">
            Help keep your community safe by reporting incidents.
          </p>
        </div>

        <div className="space-y-5">
          {/* Incident Type */}
          <section>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
              Incident Type
            </p>
            <div className="grid grid-cols-4 gap-2">
              {INCIDENT_TYPES.map(({type, label, icon}) => (
                <button
                  key={type}
                  onClick={() => setIncidentType(type)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] transition ${
                    incidentType === type
                      ? 'border-blue-400 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {icon}
                  <span className="font-medium leading-tight text-center">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Severity */}
          <section>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
              Severity
            </p>
            <div className="flex gap-2">
              {SEVERITIES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setSeverity(s.value)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-[12px] font-medium transition ${
                    severity === s.value
                      ? `${s.bg} ${s.color}`
                      : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          {/* Range */}
          <section>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
              Affected Area
            </p>
            <select
              value={range}
              onChange={e => setRange(e.target.value as Range)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-400 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center'
              }}
            >
              {RANGES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </section>

          {/* Description */}
          <section>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
              Description
            </p>
            <textarea
              placeholder="Describe what happened…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
            />
          </section>

          {/* Location */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">
                Location
              </p>
              <button
                onClick={detectLocation}
                disabled={locating}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] text-gray-500 hover:border-gray-300 hover:text-gray-700 transition disabled:opacity-50"
              >
                {locating ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Navigation size={13} />
                )}
                Detect
              </button>
            </div>
            <div className="relative">
              <MapPin
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Click Detect or type coordinates / address"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
              />
            </div>
            {locationError && (
              <p className="mt-1.5 text-[11px] text-red-500">{locationError}</p>
            )}
          </section>

          {/* Images */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">
                Photos
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] text-gray-500 hover:border-gray-300 hover:text-gray-700 transition"
                >
                  <Upload size={13} />
                  Upload
                </button>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files && addImages(e.target.files)}
            />
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={e => e.target.files && addImages(e.target.files)}
            />

            {images.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {images.map(img => (
                  <div
                    key={img.id}
                    className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square"
                  >
                    <Image
                      src={img.preview}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-200 px-6 py-8 flex items-center justify-center">
                <p className="text-[12px] text-gray-300">No photos attached</p>
              </div>
            )}
          </section>

          {/* Contact (optional) */}
          <section>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
              Contact Info <span className="text-gray-300 font-normal normal-case">(optional)</span>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Your name"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
              />
            </div>
          </section>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting || geocoding}
            className="w-full rounded-xl bg-blue-500 py-3 text-[14px] font-semibold text-white hover:bg-blue-600 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {geocoding ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Looking up address…
              </>
            ) : submitting ? (
              <>
                <Cloud size={16} />
                Uploading…
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
