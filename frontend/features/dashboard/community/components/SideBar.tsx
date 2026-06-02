'use client';

import {
  Building2,
  Heart,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  TreePine
} from 'lucide-react';
import type {User, UserGroup, PinType, SavedLocation, Coords, FamilyMember} from '../types';
import {STATUS_COLOR, ZONE_STYLE, PIN_COLOR} from '../constants';
import {SAVED_LOCATIONS} from '../data';

interface Props {
  userLocation: Coords | null;
  userAddress: string | null;
  locationError: string | null;
  activeFilter: 'all' | UserGroup;
  setActiveFilter: (f: 'all' | UserGroup) => void;
  filteredUsers: User[];
  selectedUser: User | null;
  familyMembers: FamilyMember[];
  onFocusUser: (user: User) => void;
  onFocusLocation: (loc: SavedLocation) => void;
  onFocusFamily: (member: FamilyMember) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

export default function Sidebar({
  userLocation,
  userAddress,
  locationError,
  activeFilter,
  setActiveFilter,
  filteredUsers,
  selectedUser,
  familyMembers,
  onFocusUser,
  onFocusLocation,
  onFocusFamily,
  sidebarOpen,
  setSidebarOpen
}: Props) {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          flex-col border-r border-gray-200 overflow-hidden bg-white shrink-0
          ${
            sidebarOpen
              ? 'fixed inset-y-0 left-0 z-50 flex w-64 shadow-xl'
              : 'hidden'
          }
          md:flex md:relative md:inset-auto md:shadow-none md:w-64
        `}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 md:hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Map Controls
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* My Location */}
        <div className="border-b border-gray-200 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            My Location
          </p>
          {userAddress ? (
            <div className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <div className="min-w-0">
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                  {userAddress}
                </p>
              </div>
            </div>
          ) : userLocation ? (
            <p className="text-xs text-gray-400">Resolving address…</p>
          ) : locationError ? (
            <p className="text-xs text-red-500 leading-relaxed">
              {locationError}
            </p>
          ) : (
            <p className="text-xs text-gray-400">Detecting location…</p>
          )}
        </div>

        {/* Users — shows MOCK_USERS for All/Public, saved relatives for Family */}
        <div className="border-b border-gray-200 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Users
          </p>
          <div className="mb-2 flex gap-1">
            {(['all', 'family', 'public'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-1 rounded px-1 py-1 text-xs capitalize transition ${
                  activeFilter === f
                    ? 'bg-gray-200 text-gray-800'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {f === 'family' ? 'Family' : f === 'public' ? 'Public' : 'All'}
              </button>
            ))}
          </div>

          {activeFilter === 'family' ? (
            <div className="space-y-1 overflow-y-auto" style={{maxHeight: 180}}>
              {familyMembers.length === 0 ? (
                <p className="text-xs text-gray-300 text-center py-4">
                  No relatives added yet.
                </p>
              ) : (
                familyMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => onFocusFamily(member)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-gray-100"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100">
                      <Heart size={12} className="text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-gray-700">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {member.contact || 'No contact'} · {member.address}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-1 overflow-y-auto" style={{maxHeight: 180}}>
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => onFocusUser(user)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-gray-100 ${
                    selectedUser?.id === user.id ? 'bg-gray-100' : ''
                  }`}
                >
                  {user.distress ? (
                    <div className="h-2 w-2 shrink-0 rounded-full bg-red-500 animate-pulse" />
                  ) : (
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{background: STATUS_COLOR[user.status]}}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-700">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user.address}
                    </p>
                  </div>
                  {user.distress && (
                    <span className="ml-auto shrink-0 text-xs text-red-500 font-medium">
                      SOS
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Saved locations — iterates SAVED_LOCATIONS; if data.ts is emptied this section goes blank */}
        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Saved Locations
          </p>
          <div className="space-y-1">
            {SAVED_LOCATIONS.map(loc => {
              const color = PIN_COLOR[loc.type];
              const iconEl: Record<PinType, React.ReactElement> = {
                evacuation: <Building2 size={13} />,
                health: <Heart size={13} />,
                job: <Briefcase size={13} />,
                government: <Building2 size={13} />,
                education: <GraduationCap size={13} />,
                incident: <AlertTriangle size={13} />,
                environment: <TreePine size={13} />,
                user: <Building2 size={13} />
              };
              return (
                <button
                  key={loc.id}
                  onClick={() => onFocusLocation(loc)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-gray-100"
                >
                  <span style={{color, flexShrink: 0}}>
                    {iconEl[loc.type]}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-700">
                      {loc.name}
                    </p>
                    <p className="text-xs capitalize text-gray-400">
                      {loc.type}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Zone legend */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Zone Legend
            </p>
            <div className="space-y-1">
              {(
                Object.entries(ZONE_STYLE) as [
                  import('../types').ZoneType,
                  (typeof ZONE_STYLE)[import('../types').ZoneType]
                ][]
              ).map(([, val]) => (
                <div key={val.label} className="flex items-center gap-2 px-1">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: val.color,
                      flexShrink: 0
                    }}
                  />
                  <span className="text-xs text-gray-500">{val.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
