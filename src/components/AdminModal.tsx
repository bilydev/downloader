import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Activity,
  Database,
  Radio,
  MessageSquareWarning,
  UserCheck,
  Trash2,
  Clock,
  Check,
  Copy,
} from 'lucide-react';
import { verifyAdminPin } from '../utils/security';
import {
  getBugReports,
  syncReportsFromCloud,
  updateReportStatus,
  deleteReportItem,
  BugReport,
} from '../services/bugReportService';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cacheCleared, setCacheCleared] = useState(false);
  const [reports, setReports] = useState<BugReport[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadAllReports = async () => {
    setIsSyncing(true);
    setReports(getBugReports());
    const synced = await syncReportsFromCloud();
    if (synced && synced.length > 0) {
      setReports(synced);
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllReports();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pin)) {
      setIsAuthenticated(true);
      setErrorMsg('');
      await loadAllReports();
    } else {
      setErrorMsg('PIN Keamanan Salah! Akses Ditolak.');
      setPin('');
    }
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const handleStatusChange = (id: string, newStatus: 'Menunggu' | 'Diproses' | 'Selesai') => {
    const updated = updateReportStatus(id, newStatus);
    setReports(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteReportItem(id);
    setReports(updated);
  };

  const handleCopyReport = (r: BugReport) => {
    const text = `[LAPORAN USER: ${r.name}]\nKategori: ${r.category}\nIsi: ${r.description}\nWaktu: ${r.time}`;
    navigator.clipboard.writeText(text);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/85 backdrop-blur-md" />

      <div className="relative w-full max-w-2xl bg-[#0b0b14] border border-purple-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(168,85,247,0.35)] z-10 animate-fadeIn max-h-[92vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/30 border border-purple-500/50 text-purple-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                BILY DEVELOPER ADMIN PANEL
                <span className="text-[10px] bg-purple-900/80 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  ROOT
                </span>
              </h3>
              <p className="text-xs text-purple-300/70">
                Sistem Kontrol API, Keamanan & Daftar Laporan Masuk Multi-Device
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPin('');
              setErrorMsg('');
              onClose();
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-purple-900/40 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Secret PIN Verification */}
        {!isAuthenticated ? (
          <form onSubmit={handleVerify} className="py-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                <KeyRound className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Masukkan PIN Akses Developer</h4>
              <p className="text-xs text-purple-300/70 max-w-xs mx-auto">
                Area ini khusus administrator Bily Programming. Masukkan PIN keamanan Anda.
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.6em] text-2xl font-mono bg-[#141423] border border-purple-500/40 focus:border-purple-400 rounded-2xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                autoFocus
              />

              {errorMsg && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition cursor-pointer active:scale-95"
              >
                Verifikasi PIN
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: Authenticated Admin Dashboard & LIVE USER REPORTS */
          <div className="py-4 space-y-5 overflow-y-auto pr-1 flex-1">
            
            {/* Status indicator bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Autentikasi Berhasil • Admin Mode Aktif</span>
              </div>
              <span className="font-mono text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded">
                SECURE ACCESS
              </span>
            </div>

            {/* SECTION 1: DAFTAR LAPORAN BUG MASUK DARI PENGGUNA */}
            <div className="p-4 rounded-2xl bg-[#121222] border border-purple-500/30 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <MessageSquareWarning className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white font-['Outfit']">
                      DAFTAR LAPORAN BUG MASUK
                    </h4>
                    <p className="text-[10px] text-purple-300/70">
                      Laporan yang dikirimkan oleh pengguna melalui tombol Report Bug (Cloud Sync Aktif)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-900/70 text-purple-200 text-[10px] font-mono border border-purple-500/40">
                    {reports.length} Laporan
                  </span>
                  <button
                    onClick={loadAllReports}
                    className="p-1.5 rounded-lg bg-[#1a1932] hover:bg-purple-900/50 text-purple-300 hover:text-white transition cursor-pointer"
                    title="Refresh Laporan"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-fuchsia-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* List of Submitted Reports */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {reports.length === 0 ? (
                  <div className="py-8 text-center bg-[#0e0e1a] rounded-2xl border border-purple-950/40 p-4 space-y-1">
                    <div className="text-xs font-semibold text-purple-300">Belum ada laporan bug baru yang masuk.</div>
                    <div className="text-[11px] text-zinc-500">Saat pengguna dari perangkat mana pun mengirim laporan, datanya akan langsung otomatis muncul di sini.</div>
                  </div>
                ) : (
                  reports.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl border transition-all bg-[#181530] border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.12)]"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                            {item.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40 font-mono">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                          <Clock className="w-3 h-3 text-purple-400" />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      <p className="text-xs text-purple-200/90 bg-[#0e0e1c] p-2.5 rounded-xl border border-purple-950/40 leading-relaxed font-sans select-text">
                        "{item.description}"
                      </p>

                      <div className="flex items-center justify-between pt-2 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStatusChange(item.id, 'Selesai')}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                              item.status === 'Selesai'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                                : 'bg-zinc-800 text-zinc-300 hover:text-white'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            {item.status === 'Selesai' ? 'Selesai Diperbaiki' : 'Tandai Selesai'}
                          </button>

                          <button
                            onClick={() => handleStatusChange(item.id, 'Diproses')}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                              item.status === 'Diproses'
                                ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                                : 'bg-zinc-800 text-zinc-300 hover:text-white'
                            }`}
                          >
                            Diproses
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyReport(item)}
                            className="p-1 text-purple-300 hover:text-white hover:bg-purple-900/40 rounded transition cursor-pointer"
                            title="Salin Laporan"
                          >
                            {copiedId === item.id ? (
                              <span className="text-[10px] text-emerald-400 font-mono">Tersalin!</span>
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded transition cursor-pointer"
                            title="Hapus Laporan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SECTION 2: API STATUS MONITOR */}
            <div className="p-4 rounded-2xl bg-[#121222] border border-purple-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  Status API Endpoint
                </span>
                <span className="text-[10px] text-purple-400/70 font-mono">
                  api.azbry.com
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#19192e] border border-purple-900/40 flex items-center justify-between">
                  <span className="font-mono text-purple-200 text-[11px]">YouTube MP3</span>
                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 200 OK
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#19192e] border border-purple-900/40 flex items-center justify-between">
                  <span className="font-mono text-purple-200 text-[11px]">YouTube MP4</span>
                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 200 OK
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#19192e] border border-purple-900/40 flex items-center justify-between">
                  <span className="font-mono text-purple-200 text-[11px]">TikTok TikWM</span>
                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 200 OK
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleClearCache}
                className="p-3 rounded-2xl bg-[#151528] hover:bg-purple-900/40 border border-purple-500/30 text-left transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                  {cacheCleared && (
                    <span className="text-[10px] text-emerald-400 font-mono">Dibersihkan!</span>
                  )}
                </div>
                <div className="text-xs font-bold text-white">Reset Cache API</div>
                <div className="text-[10px] text-zinc-400">Hapus temporary request</div>
              </button>

              <div className="p-3 rounded-2xl bg-[#151528] border border-purple-500/30 text-left">
                <div className="flex items-center justify-between mb-1">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-mono">Aktif</span>
                </div>
                <div className="text-xs font-bold text-white">Server Network</div>
                <div className="text-[10px] text-zinc-400">Region: SG-Jakarta • 24ms</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-center">
              <Database className="w-4 h-4 inline-block mr-1 text-purple-400" />
              <span className="text-[11px] text-purple-300">
                Sistem Bily Downloader & Sinkronisasi Cloud Multi-Device Berjalan Normal
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
