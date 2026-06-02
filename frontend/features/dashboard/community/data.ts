import type {User, SavedLocation, Zone} from './types';

// MOCK_USERS — looped by addUserMarkers() on map init and by filteredUsers in MapReference.
// If you remove items: user pins disappear from map, user list in sidebar goes blank,
// and signal responses will have no users to show.
export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Juan dela Cruz',
    lat: 14.399,
    lng: 120.8559,
    status: 'online',
    group: 'family',
    address: 'Tejero, Tanza, Cavite'
  },
  {
    id: 2,
    name: 'Maria Santos',
    lat: 14.3926,
    lng: 120.8545,
    status: 'online',
    group: 'family',
    address: 'Buenavista, Tanza, Cavite'
  },
  {
    id: 3,
    name: 'Pedro Reyes',
    lat: 14.389,
    lng: 120.8595,
    status: 'idle',
    group: 'public',
    address: 'Manggahan, Tanza, Cavite'
  },
  {
    id: 4,
    name: 'Ana Flores',
    lat: 14.375,
    lng: 120.8575,
    status: 'offline',
    group: 'public',
    address: 'Santiago, Tanza, Cavite'
  },
  {
    id: 5,
    name: 'Carlo Mendoza',
    lat: 14.3935,
    lng: 120.855,
    status: 'online',
    group: 'public',
    address: 'Bagtas, Tanza, Cavite',
    distress: true
  }
];

// SAVED_LOCATIONS — looped by addSavedLocationMarkers() on map init and rendered in Sidebar.
// If you remove items: their pins vanish from the map, sidebar list shrinks,
// and the FloatingPanel "Show route" button won't find a match.
export const SAVED_LOCATIONS: SavedLocation[] = [
  {
    id: 1,
    name: 'Tanza Covered Court',
    lat: 14.396,
    lng: 120.8525,
    type: 'evacuation',
    details: {
      status: 'Open',
      capacity: '320 / 500',
      openHours: '24/7 during alerts',
      description: 'Primary evacuation center for Tanza proper.'
    }
  },
  {
    id: 2,
    name: 'Rural Health Unit',
    lat: 14.398,
    lng: 120.8555,
    type: 'health',
    details: {
      status: 'Open',
      capacity: '12 beds available',
      openHours: '8AM – 5PM',
      contact: '(046) 123-4567',
      description: 'General consultation and emergency care.'
    }
  },
  {
    id: 3,
    name: 'Job Fair – Tanza NHS',
    lat: 14.391,
    lng: 120.8505,
    type: 'job',
    details: {
      jobCount: 42,
      date: 'June 3, 2025',
      openHours: '8AM – 4PM',
      description: 'DOLE-sponsored job fair. Bring 2 valid IDs and resume.'
    }
  },
  {
    id: 4,
    name: 'Barangay Hall',
    lat: 14.393,
    lng: 120.8525,
    type: 'government',
    details: {
      status: 'Open',
      openHours: 'Mon–Fri 8AM–5PM',
      contact: '(046) 987-6543',
      description: 'Barangay services, permits, certificates.'
    }
  },
  {
    id: 5,
    name: 'Tanza Elementary School',
    lat: 14.397,
    lng: 120.8585,
    type: 'education',
    details: {
      status: 'Open',
      description: 'Secondary evacuation point during typhoon season.',
      openHours: 'School days: 7AM–4PM'
    }
  },
  {
    id: 6,
    name: 'Illegal Dump Site',
    lat: 14.39,
    lng: 120.8565,
    type: 'environment',
    details: {
      severity: 'High',
      reportCount: 8,
      description: 'Active illegal dumping near the estero. Reported to CENRO.',
      status: 'Pending cleanup'
    }
  },
  {
    id: 7,
    name: 'Robbery Incident',
    lat: 14.394,
    lng: 120.8595,
    type: 'incident',
    details: {
      severity: 'Medium',
      reportCount: 1,
      description: 'Reported hold-up near the market area. Police notified.',
      date: 'May 28, 2025',
      status: 'Under investigation'
    }
  }
];

// ZONES — looped by addZonePolygons() on map init.
// If you remove items: zone polygons disappear from the map and zone legend in sidebar has no impact.
export const ZONES: Zone[] = [
  {
    id: 1,
    name: 'Flooded Road – Brgy. Bagtas',
    type: 'flood',
    coords: [
      [14.3915, 120.852],
      [14.3925, 120.852],
      [14.3925, 120.854],
      [14.3915, 120.854]
    ],
    report: {
      reportedBy: 'Barangay Rescue Team',
      reportedAt: 'May 30, 2025 6:00 AM',
      severity: 'High',
      description: 'Road impassable — 1.5ft floodwater. Avoid this route.',
      affectedCount: 12
    }
  },
  {
    id: 2,
    name: 'Safe Zone – Covered Court Area',
    type: 'safe',
    coords: [
      [14.3955, 120.8525],
      [14.3965, 120.8525],
      [14.3965, 120.854],
      [14.3955, 120.854]
    ],
    report: {
      reportedBy: 'MDRRMO Tanza',
      reportedAt: 'May 30, 2025 7:00 AM',
      severity: 'None',
      description: 'Elevated area. Road clear, evacuation center accessible.'
    }
  },
  {
    id: 3,
    name: 'Danger Zone – Crime Hotspot',
    type: 'danger',
    coords: [
      [14.3932, 120.8595],
      [14.3942, 120.8595],
      [14.3942, 120.861],
      [14.3932, 120.861]
    ],
    report: {
      reportedBy: 'Tanza PNP',
      reportedAt: 'May 29, 2025 10:00 PM',
      severity: 'High',
      description: 'Multiple incidents reported at night. Avoid walking alone.',
      caseCount: 3
    }
  },
  {
    id: 4,
    name: 'Fire Risk Area – Informal Settlers',
    type: 'fire',
    coords: [
      [14.397, 120.86],
      [14.398, 120.86],
      [14.398, 120.8615],
      [14.397, 120.8615]
    ],
    report: {
      reportedBy: 'BFP Tanza',
      reportedAt: 'May 28, 2025',
      severity: 'Medium',
      description:
        'Dense housing, limited fire access. Pre-emptive monitoring active.',
      affectedCount: 45
    }
  }
];
