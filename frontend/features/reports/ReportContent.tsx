'use client';

import {createContext, useContext, useState, useCallback, useEffect, type ReactNode} from 'react';
import type {UserReport} from './types';

const STORAGE_KEY = 'my-docs_reports';

interface ReportContextValue {
  reports: UserReport[];
  addReport: (r: UserReport) => void;
}

const ReportContext = createContext<ReportContextValue>({
  reports: [],
  addReport: () => {}
});

function loadReports(): UserReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReports(reports: UserReport[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {}
}

export function ReportProvider({children}: {children: ReactNode}) {
  const [reports, setReports] = useState<UserReport[]>(loadReports);

  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  const addReport = useCallback((r: UserReport) => {
    setReports(prev => [...prev, r]);
  }, []);

  return (
    <ReportContext.Provider value={{reports, addReport}}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportContext);
}
