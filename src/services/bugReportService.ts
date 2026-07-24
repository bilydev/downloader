export interface BugReport {
  id: string;
  name: string;
  category: string;
  description: string;
  time: string;
  date: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai';
  isNew?: boolean;
}

const STORAGE_KEY = 'bily_bug_reports_v4';
const CLOUD_SYNC_ENDPOINT = 'https://api.restful-api.dev/objects';

export function getBugReports(): BugReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

/**
 * Fetch and merge persistent reports from Cloud API to support multi-device syncing
 */
export async function syncReportsFromCloud(): Promise<BugReport[]> {
  const localList = getBugReports();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(CLOUD_SYNC_ENDPOINT, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const cloudReports: BugReport[] = [];
        for (const item of data) {
          if (item && item.data && item.data.bilyAppReport) {
            cloudReports.push(item.data.bilyAppReport as BugReport);
          }
        }

        if (cloudReports.length > 0) {
          // Merge unique by ID
          const map = new Map<string, BugReport>();
          localList.forEach((r) => map.set(r.id, r));
          cloudReports.forEach((r) => map.set(r.id, r));

          const merged = Array.from(map.values());
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    }
  } catch {
    // Return local if offline
  }

  return localList;
}

/**
 * Submit bug report to both Cloud API endpoint and Local Storage
 */
export async function sendBugReportApi(
  name: string,
  category: string,
  description: string
): Promise<BugReport> {
  const newReport: BugReport = {
    id: 'rep-' + Date.now().toString(),
    name: name.trim() || 'Pengguna',
    category: category || 'Kendala Unduhan',
    description: description.trim(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: 'Hari ini',
    status: 'Menunggu',
    isNew: true,
  };

  // 1. Save to local storage
  const current = getBugReports();
  const updated = [newReport, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }

  // 2. Broadcast via channel for same-origin tabs
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('bily_downloader_reports');
      channel.postMessage({ type: 'NEW_REPORT', report: newReport });
      channel.close();
    }
  } catch {
    // safe
  }

  // 3. Send to Cloud REST API so report is received across different devices / Vercel deployment
  try {
    await fetch(CLOUD_SYNC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Bily Bug Report: ${newReport.name}`,
        data: {
          bilyAppReport: newReport,
        },
      }),
    }).catch(() => {
      // safe fallback
    });
  } catch {
    // safe fallback
  }

  return newReport;
}

export function updateReportStatus(id: string, status: 'Menunggu' | 'Diproses' | 'Selesai'): BugReport[] {
  const current = getBugReports();
  const updated = current.map((r) => (r.id === id ? { ...r, status, isNew: false } : r));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }
  return updated;
}

export function deleteReportItem(id: string): BugReport[] {
  const current = getBugReports();
  const updated = current.filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }
  return updated;
}
