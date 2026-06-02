'use client';

import {useState, useEffect, useCallback} from 'react';
import {Check, Eye, Bell, User, Phone, MapPin, Lock, Trash2} from 'lucide-react';
import {useRouter} from 'next/navigation';

type Settings = {
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  notifySafetyAlerts: boolean;
  notifyNearbyReports: boolean;
  notifyFamilyUpdates: boolean;
  notifyEmergencyBroadcast: boolean;
  privacyShareLocation: boolean;
  privacyShowOnline: boolean;
  emergencyName: string;
  emergencyPhone: string;
  defaultRange: string;
};

const RANGES = [
  {value: '50m', label: 'Nearby (50m)'},
  {value: '100m', label: 'Street (100m)'},
  {value: '500m', label: 'Block (500m)'},
  {value: '1km', label: 'Neighborhood (1km)'},
  {value: '5km', label: 'District (5km)'},
  {value: '10km', label: 'City-wide (10km)'}
];

const STORAGE_KEY = 'community_settings';

function Toggle({
  enabled,
  onChange
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
        enabled
          ? 'border-blue-400 bg-blue-500'
          : 'border-gray-200 bg-gray-100'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}

function SectionHeader({label}: {label: string}) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
      {label}
    </p>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    profileName: '',
    profileEmail: '',
    profilePhone: '',
    notifySafetyAlerts: true,
    notifyNearbyReports: true,
    notifyFamilyUpdates: false,
    notifyEmergencyBroadcast: true,
    privacyShareLocation: true,
    privacyShowOnline: true,
    emergencyName: '',
    emergencyPhone: '',
    defaultRange: '100m'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(prev => ({...prev, ...parsed}));
      }
    } catch {
      // ignore corrupt data
    }
  }, []);

  const update = useCallback(<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings(prev => ({...prev, [key]: value}));
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [settings]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
      <div className="w-full max-w-[580px] mx-auto">
        <div className="mb-6">
          <h1 className="text-[17px] font-bold text-gray-900">Settings</h1>
          <p className="text-[13px] text-gray-400 mt-1">
            Manage your profile, privacy, and preferences.
          </p>
        </div>

        <div className="space-y-5">
          {/* Profile */}
          <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <SectionHeader label="Profile" />
            <div className="space-y-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={settings.profileName}
                  onChange={e => update('profileName', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={settings.profileEmail}
                onChange={e => update('profileEmail', e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
              />
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={settings.profilePhone}
                  onChange={e => update('profilePhone', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <SectionHeader label="Notifications" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell size={14} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] text-gray-700">Safety alerts</span>
                </div>
                <Toggle enabled={settings.notifySafetyAlerts} onChange={v => update('notifySafetyAlerts', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] text-gray-700">Nearby reports</span>
                </div>
                <Toggle enabled={settings.notifyNearbyReports} onChange={v => update('notifyNearbyReports', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <User size={14} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] text-gray-700">Family updates</span>
                </div>
                <Toggle enabled={settings.notifyFamilyUpdates} onChange={v => update('notifyFamilyUpdates', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell size={14} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] text-gray-700">Emergency broadcast</span>
                </div>
                <Toggle enabled={settings.notifyEmergencyBroadcast} onChange={v => update('notifyEmergencyBroadcast', v)} />
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <SectionHeader label="Privacy" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] text-gray-700">Share my location</span>
                </div>
                <Toggle enabled={settings.privacyShareLocation} onChange={v => update('privacyShareLocation', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Eye size={14} className="text-gray-400 shrink-0" />
                  <span className="text-[13px] text-gray-700">Show online status</span>
                </div>
                <Toggle enabled={settings.privacyShowOnline} onChange={v => update('privacyShowOnline', v)} />
              </div>
            </div>
          </section>

          {/* Safety */}
          <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <SectionHeader label="Safety" />
            <div className="space-y-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Emergency contact name"
                  value={settings.emergencyName}
                  onChange={e => update('emergencyName', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
                />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Emergency contact phone"
                  value={settings.emergencyPhone}
                  onChange={e => update('emergencyPhone', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
                />
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-400 mb-1.5">Default alert range</p>
                <select
                  value={settings.defaultRange}
                  onChange={e => update('defaultRange', e.target.value)}
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
              </div>
            </div>
          </section>

          {/* Account */}
          <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <SectionHeader label="Account" />
            <div className="space-y-2">
              <button
                onClick={() => {}}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <Lock size={14} />
                Change Password
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  router.replace('/sign-in');
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition"
              >
                <Trash2 size={14} />
                Delete Account
              </button>
            </div>
          </section>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-blue-500 py-3 text-[14px] font-semibold text-white hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
