import { CaseRecord } from '@/types/case';

const DB_NAME = 'casecarry_db';
const DB_VERSION = 1;
const STORE_DRAFTS = 'active_draft';
const STORE_CASES = 'saved_cases';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
        db.createObjectStore(STORE_DRAFTS, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORE_CASES)) {
        db.createObjectStore(STORE_CASES, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredDraft {
  key: string;
  caseRecord: CaseRecord;
  currentStep: string;
  isDemoMode: boolean;
  savedAt: string;
}

export async function saveDraftLocally(
  caseRecord: CaseRecord,
  currentStep: string = 'entry',
  isDemoMode: boolean = false
): Promise<{ success: boolean; timestamp: string }> {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Try IndexedDB first
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DRAFTS, 'readwrite');
    const store = tx.objectStore(STORE_DRAFTS);
    const draftData: StoredDraft = {
      key: 'current_active_draft',
      caseRecord,
      currentStep,
      isDemoMode,
      savedAt: timestamp,
    };
    await new Promise<void>((resolve, reject) => {
      const req = store.put(draftData);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    return { success: true, timestamp };
  } catch (err) {
    // Fallback to localStorage for small payloads (excluding heavy dataUrls if needed)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const lightweightCase = {
          ...caseRecord,
          evidence: caseRecord.evidence.map((e) => ({
            ...e,
            dataUrl: undefined, // Strip huge base64 to avoid quota issues
          })),
        };
        window.localStorage.setItem(
          'casecarry_draft_fallback',
          JSON.stringify({
            caseRecord: lightweightCase,
            currentStep,
            isDemoMode,
            savedAt: timestamp,
          })
        );
        return { success: true, timestamp };
      }
    } catch {
      // Storage unavailable
    }
    return { success: false, timestamp: '' };
  }
}

export async function loadDraftLocally(): Promise<StoredDraft | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DRAFTS, 'readonly');
    const store = tx.objectStore(STORE_DRAFTS);
    const result = await new Promise<StoredDraft | undefined>((resolve, reject) => {
      const req = store.get('current_active_draft');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    if (result) return result;
  } catch {
    // Check fallback
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem('casecarry_draft_fallback');
      if (item) {
        return JSON.parse(item);
      }
    }
  } catch {
    // Ignore
  }

  return null;
}

export async function clearDraftLocally(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DRAFTS, 'readwrite');
    const store = tx.objectStore(STORE_DRAFTS);
    store.delete('current_active_draft');
  } catch {
    // Fallback
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('casecarry_draft_fallback');
    }
  } catch {
    // Ignore
  }
}

export async function saveCaseToLocalList(caseRecord: CaseRecord): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_CASES, 'readwrite');
    const store = tx.objectStore(STORE_CASES);
    await new Promise<void>((resolve, reject) => {
      const req = store.put(caseRecord);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('casecarry_cases_list') || '[]';
        const list: CaseRecord[] = JSON.parse(raw);
        const filtered = list.filter((c) => c.id !== caseRecord.id);
        filtered.unshift(caseRecord);
        window.localStorage.setItem('casecarry_cases_list', JSON.stringify(filtered.slice(0, 10)));
      }
    } catch {
      // Ignore
    }
  }
}

export const saveCaseLocally = saveCaseToLocalList;

export async function listLocalCases(): Promise<CaseRecord[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_CASES, 'readonly');
    const store = tx.objectStore(STORE_CASES);
    const result = await new Promise<CaseRecord[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    if (result && result.length > 0) return result;
  } catch {
    // Fallback
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('casecarry_cases_list');
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch {
    // Ignore
  }

  return [];
}

export async function deleteLocalCase(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_CASES, 'readwrite');
    const store = tx.objectStore(STORE_CASES);
    store.delete(id);
  } catch {
    // Fallback
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('casecarry_cases_list');
      if (raw) {
        const list: CaseRecord[] = JSON.parse(raw);
        const filtered = list.filter((c) => c.id !== id);
        window.localStorage.setItem('casecarry_cases_list', JSON.stringify(filtered));
      }
    }
  } catch {
    // Ignore
  }
}
