'use client';

import {Navigation, X} from 'lucide-react';
import type {FloatingPanel as FP, PinType} from '../types';
import {ZONE_STYLE, PIN_COLOR} from '../constants';
import {MOCK_USERS, SAVED_LOCATIONS} from '../data';
import {useState} from 'react';
import Row from './Row';

interface Props {
  panel: FP;
  onClose: () => void;
  onFocusUser: (user: (typeof MOCK_USERS)[number]) => void;
  onFocusLocation: (loc: (typeof SAVED_LOCATIONS)[number]) => void;
  mapRef: React.RefObject<HTMLDivElement | null>;
}

export default function FloatingPanel({
  panel,
  onClose,
  onFocusUser,
  onFocusLocation,
  mapRef
}: Props) {
  const {x, y, type, title, data, zoneType} = panel;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const color =
    type === 'zone'
      ? ZONE_STYLE[zoneType!].color
      : type === 'distress'
      ? '#ef4444'
      : type === 'user'
      ? '#3b82f6'
      : type === 'report'
      ? '#f97316'
      : type === 'family'
      ? '#0d9488'
      : PIN_COLOR[type as PinType];

  const panelW = 224;
  const panelH = 200;
  const mapRect = mapRef.current?.getBoundingClientRect();
  if (!mapRect) return null;
  const vx = mapRect.left + x;
  const vy = mapRect.top + y;
  const left =
    vx + 18 + panelW > mapRect.right - 8
      ? vx - panelW - 18
      : vx + 18;
  const top = Math.min(
    Math.max(vy - panelH / 2, mapRect.top + 8),
    mapRect.bottom - panelH - 8
  );
  const d = data as Record<string, unknown>;

  const userMatch = MOCK_USERS.find(u => u.name === title);
  const locMatch = SAVED_LOCATIONS.find(l => l.name === title);

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed',
        left,
        top,
        width: panelW,
        background: '#fff',
        border: `1.5px solid ${color}44`,
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.13)',
        zIndex: 1000,
        overflow: 'hidden',
        pointerEvents: 'auto'
      }}
    >
      <div
        style={{
          background: color,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            color: '#fff',
            fontWeight: 600,
            fontSize: 12,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginRight: 8
          }}
        >
          {title}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.25)',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            fontSize: 11,
            width: 20,
            height: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          padding: '10px 12px',
          fontSize: 12,
          color: '#374151',
          display: 'flex',
          flexDirection: 'column',
          gap: 5
        }}
      >
        {/* Distress — shows SOS alert + navigate button; relies on MOCK_USERS lookup by name */}
        {type === 'distress' && (
          <>
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: 6,
                padding: '6px 10px',
                marginBottom: 4
              }}
            >
              <span style={{color: '#dc2626', fontWeight: 600, fontSize: 12}}>
                🚨 Needs Help
              </span>
              <p style={{color: '#b91c1c', fontSize: 11, marginTop: 2}}>
                This person is sending a distress signal.
              </p>
            </div>
            <Row label="Address" value={String(d.address ?? '—')} />
            <Row label="Distance" value={String(d.distance ?? '—')} />
            <Row label="Status" value={String(d.status ?? '—')} />
            {userMatch && (
              <button
                onClick={() => onFocusUser(userMatch)}
                style={{
                  marginTop: 6,
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <Navigation size={11} /> Navigate to them
              </button>
            )}
          </>
        )}

        {/* User — basic info panel for own location or another user */}
        {type === 'user' && (
          <>
            <Row label="Group" value={String(d.group ?? '—')} />
            <Row label="Status" value={String(d.status ?? '—')} />
            <Row label="Address" value={String(d.address ?? '—')} />
            <Row label="Distance" value={String(d.distance ?? '—')} />
            {d.description && (
              <p style={{marginTop: 4, color: '#6b7280', fontSize: 11}}>
                {String(d.description)}
              </p>
            )}
            {Array.isArray(d.nearbyReports) && (d.nearbyReports as Record<string, unknown>[]).length > 0 && (
              <div style={{marginTop: 6}}>
                <p style={{fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4}}>
                  Nearby Reports ({((d.nearbyReports as Record<string, unknown>[]).length)})
                </p>
                {(d.nearbyReports as Record<string, unknown>[]).map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#fefce8',
                      border: '1px solid #fde68a',
                      borderRadius: 6,
                      padding: '5px 8px',
                      marginBottom: 4,
                      fontSize: 11
                    }}
                  >
                    <span style={{fontWeight: 600, color: '#92400e'}}>
                      {String(r.type ?? '').charAt(0).toUpperCase() + String(r.type ?? '').slice(1)}
                    </span>
                    <span style={{color: '#a16207', marginLeft: 4}}>
                      · {String(r.severity ?? '')}
                    </span>
                    <p style={{color: '#78350f', marginTop: 1, lineHeight: 1.3}}>
                      {String(r.description ?? '')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Zone — polygon area details */}
        {type === 'zone' && (
          <>
            <Row
              label="Zone"
              value={ZONE_STYLE[zoneType!].label}
              color={color}
            />
            <Row
              label="Severity"
              value={String(d.severity ?? '—')}
              color={
                d.severity === 'High'
                  ? '#dc2626'
                  : d.severity === 'Medium'
                  ? '#f97316'
                  : '#16a34a'
              }
            />
            <Row label="Reported by" value={String(d.reportedBy ?? '—')} />
            <Row label="Reported at" value={String(d.reportedAt ?? '—')} />
            {d.affectedCount && (
              <Row label="Affected" value={`${d.affectedCount} households`} />
            )}
            {d.caseCount && <Row label="Cases" value={String(d.caseCount)} />}
            <p
              style={{
                marginTop: 4,
                color: '#6b7280',
                fontSize: 11,
                lineHeight: 1.5
              }}
            >
              {String(d.description ?? '')}
            </p>
          </>
        )}

        {/* Report — user-submitted incident from tab3 */}
        {type === 'report' && (
          <>
            <Row label="Type" value={String(d.type ?? '—')} color={color} />
            <Row label="Severity" value={String(d.severity ?? '—')} color={
              d.severity === 'critical' ? '#dc2626'
              : d.severity === 'high' ? '#f97316'
              : d.severity === 'medium' ? '#d97706'
              : '#16a34a'
            } />
            {d.range && <Row label="Affected Area" value={String(d.range)} />}
            <p style={{marginTop: 4, color: '#6b7280', fontSize: 11, lineHeight: 1.4}}>
              {String(d.description ?? '')}
            </p>
            {d.contactName && <Row label="Contact" value={String(d.contactName)} />}
            {d.contactPhone && <Row label="Phone" value={String(d.contactPhone)} />}
            <Row label="Reported" value={String(d.reportedAt ?? '—')} />

            {/* Report images */}
            {Array.isArray(d.imagePreviews) && (d.imagePreviews as string[]).length > 0 && (
              <div style={{display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap'}}>
                {(d.imagePreviews as string[]).map((url, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(url)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb',
                      flexShrink: 0,
                      cursor: 'pointer'
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Family — shows contact, address, distance */}
        {type === 'family' && (
          <>
            <Row label="Contact" value={String(d.contact ?? '—')} />
            <Row label="Address" value={String(d.address ?? '—')} />
            <Row label="Distance" value={String(d.distance ?? '—')} />
            <div
              style={{
                marginTop: 6,
                background: '#f0fdfa',
                border: '1px solid #5eead4',
                borderRadius: 6,
                padding: '6px 10px'
              }}
            >
              <span style={{color: '#0f766e', fontWeight: 600, fontSize: 11}}>
                Family Member
              </span>
            </div>
          </>
        )}

        {/* Saved location — shows status/distance/hours/etc + "Show route" button; relies on SAVED_LOCATIONS lookup by name */}
        {type !== 'zone' && type !== 'user' && type !== 'distress' && type !== 'report' && type !== 'family' && (
          <>
            {d.status && (
              <Row
                label="Status"
                value={String(d.status)}
                color={
                  d.status === 'Open'
                    ? '#16a34a'
                    : d.status === 'High'
                    ? '#ef4444'
                    : undefined
                }
              />
            )}
            {d.distance && (
              <Row label="Distance" value={String(d.distance)} />
            )}
            {d.capacity && (
              <Row label="Capacity" value={String(d.capacity)} />
            )}
            {d.openHours && <Row label="Hours" value={String(d.openHours)} />}
            {d.contact && <Row label="Contact" value={String(d.contact)} />}
            {d.jobCount && (
              <Row label="Openings" value={String(d.jobCount)} />
            )}
            {d.date && <Row label="Date" value={String(d.date)} />}
            {d.severity && (
              <Row
                label="Severity"
                value={String(d.severity)}
                color={d.severity === 'High' ? '#ef4444' : '#f97316'}
              />
            )}
            {d.reportCount && (
              <Row label="Reports" value={String(d.reportCount)} />
            )}
            {d.description && (
              <p
                style={{
                  marginTop: 4,
                  color: '#6b7280',
                  fontSize: 11,
                  lineHeight: 1.5
                }}
              >
                {String(d.description)}
              </p>
            )}
            {locMatch && (
              <button
                onClick={() => onFocusLocation(locMatch)}
                style={{
                  marginTop: 6,
                  background: color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <Navigation size={11} /> Show route
              </button>
            )}
          </>
        )}
      </div>

      {/* Image viewer modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 8,
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              objectFit: 'contain',
              cursor: 'default'
            }}
          />
        </div>
      )}
    </div>
  );
}
