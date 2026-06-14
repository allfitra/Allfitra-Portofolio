import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, MessageCircle, Instagram, Check, Copy } from 'lucide-react';

const DownloadPreviewModal = ({ isOpen, onClose, imageUrl, onDownload, shareUrl, downloadType = 'all', onChangeType, isGenerating }) => {
  const [copied, setCopied] = React.useState(false);
  const [showIgToast, setShowIgToast] = React.useState(false);

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    if (!shareUrl) return;
    const text = `Lihat prediksi bagan gugur World Cup 2026 saya disini! 🏆⚽\n\n${shareUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    // IG Story sharing flow helper
    handleCopyLink();
    onDownload(); // Trigger download
    setShowIgToast(true);
    // Auto close toast after 12 seconds
    setTimeout(() => setShowIgToast(false), 12000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container (Completely Blue Background Theme) */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative w-full max-w-4xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-955 border border-blue-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden z-10 text-white flex flex-col gap-5 max-h-[90vh]"
          >
            {/* Ambient glows inside blue modal */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Custom Instagram Story Toast/Banner */}
            <AnimatePresence>
              {showIgToast && (
                <motion.div
                  initial={{ opacity: 0, y: -30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-gradient-to-r from-purple-900 via-pink-900 to-red-950 border border-pink-500/40 rounded-2xl p-4 shadow-2xl z-50 text-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Instagram className="w-4 h-4 text-pink-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-pink-200">Siap Dibagikan ke Instagram Story!</h4>
                      <p className="text-[9.5px] text-pink-100/90 mt-1 leading-relaxed">
                        1. Gambar bracket telah <strong>diunduh otomatis</strong>.<br />
                        2. Link prediksi telah <strong>disalin ke clipboard</strong>.<br /><br />
                        Buka IG Story, buat story dengan gambar bracket tersebut, lalu tempelkan link sticker yang sudah disalin!
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => window.open('https://instagram.com', '_blank')}
                          className="bg-white text-pink-950 font-extrabold px-3 py-1.5 rounded-lg text-[9px] hover:bg-pink-100 transition-colors uppercase tracking-wider"
                        >
                          Buka Instagram
                        </button>
                        <button
                          onClick={() => setShowIgToast(false)}
                          className="border border-white/20 text-white/85 font-bold px-3 py-1.5 rounded-lg text-[9px] hover:bg-white/5 transition-colors uppercase tracking-wider"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                    <button onClick={() => setShowIgToast(false)} className="text-white/60 hover:text-white shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-extrabold tracking-wide uppercase text-white">Preview Hasil Prediksi</h3>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Opsi Unduhan */}
            <div className="flex justify-center relative z-10">
              <div className="flex bg-blue-950/80 border border-white/10 rounded-xl p-0.5 gap-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => onChangeType && onChangeType('all')}
                  className={`px-4 py-1.5 rounded-lg transition-all ${downloadType === 'all' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Semua (Grup + Gugur)
                </button>
                <button
                  type="button"
                  onClick={() => onChangeType && onChangeType('group')}
                  className={`px-4 py-1.5 rounded-lg transition-all ${downloadType === 'group' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-zinc-400 hover:text-white'}`}
                >
                  Fase Grup Saja
                </button>
              </div>
            </div>

            {/* Image Preview Window (Blue layout center) */}
            <div className="flex-1 overflow-y-auto min-h-0 relative z-10 flex items-center justify-center bg-blue-950/60 border border-white/5 rounded-xl p-4 shadow-inner">
              {imageUrl && !isGenerating ? (
                <img
                  src={imageUrl}
                  alt="Preview Bracket Prediksi"
                  className="max-h-[50vh] w-auto object-contain rounded-lg border border-white/10 shadow-2xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/40 py-20">
                  <span className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-white" />
                  <p className="text-xs">Membuat gambar preview...</p>
                </div>
              )}
            </div>

            {/* Footer / Sharing Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10 relative z-10">
              <p className="text-[10px] text-blue-200/70 text-center sm:text-left leading-relaxed">
                Unduh atau bagikan gambar bracket prediksi Anda ke sosial media!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
                {/* Download Button */}
                <button
                  onClick={onDownload}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Gambar
                </button>

                {/* WhatsApp button */}
                <button
                  onClick={shareToWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98]"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </button>

                {/* Instagram button */}
                <button
                  onClick={shareToInstagram}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
                >
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </button>

                {/* Copy Link button */}
                <button
                  onClick={handleCopyLink}
                  className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Link Disalin!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DownloadPreviewModal;
