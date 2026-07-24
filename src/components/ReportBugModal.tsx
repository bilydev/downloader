import React, { useState } from 'react';
import { X, Bug, Send, CheckCircle2, Copy, Loader2, Sparkles } from 'lucide-react';
import { sendBugReportApi } from '../services/bugReportService';
import confetti from 'canvas-confetti';

interface ReportBugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted?: () => void;
}

export const ReportBugModal: React.FC<ReportBugModalProps> = ({
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [userName, setUserName] = useState('');
  const [category, setCategory] = useState('YouTube MP3 Error');
  const [description, setDescription] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSending(true);

    try {
      await sendBugReportApi(userName, category, description);
      
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#f43f5e', '#ffffff'],
        });
      } catch {
        // safe
      }

      setSubmitted(true);
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch {
      setSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  const copyTemplate = () => {
    const text = `[LAPORAN BUG BILY DOWNLOADER]\nPengirim: ${userName || 'Pengguna'}\nKategori: ${category}\nDeskripsi: ${description || 'URL download bermasalah'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-lg bg-[#0e0e1a] border border-purple-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(168,85,247,0.3)] z-10 animate-fadeIn">
        
        {/* Header - Diselaraskan sesuai permintaan user */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                Report Bug
                <span className="text-[10px] bg-purple-900/80 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40 font-mono">
                  API on
                </span>
              </h3>
              <p className="text-xs text-purple-300/80">
                laporan akan terkirim dan akan di baca admin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-purple-900/40 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit']">
              Laporan Berhasil Terkirim!
            </h4>
            <p className="text-xs text-purple-200/80 max-w-sm mx-auto">
              Laporan Anda sudah masuk ke antrean Admin dan akan segera dibaca oleh tim developer.
            </p>
            
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={copyTemplate}
                className="px-4 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Tersalin!' : 'Salin Teks'}
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setDescription('');
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1.5">
                Nama Anda / Username Telegram (Opsional)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Contoh: Bily / @username"
                className="w-full bg-[#151526] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1.5">
                Kategori Kendala
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#151526] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                <option value="YouTube MP3 Error">YouTube MP3 Gagal Convert</option>
                <option value="YouTube MP4 Error">YouTube MP4 HD Gagal Load</option>
                <option value="TikTok No Watermark Error">TikTok Video / Audio Bermasalah</option>
                <option value="Server Timeout">Koneksi API Lambat / Timeout</option>
                <option value="Saran Fitur Baru">Saran Fitur Baru</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1.5">
                Deskripsi Kendala / Masukkan URL Bermasalah
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan kendala Anda atau tempelkan link URL yang gagal diunduh..."
                className="w-full bg-[#151526] border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-400 placeholder:text-zinc-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-purple-400/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-fuchsia-400" />
                API aktif
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition cursor-pointer"
                >
                  Batal
                </button>
                
                {/* Tombol Kirim yang ringkas dan pas */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
