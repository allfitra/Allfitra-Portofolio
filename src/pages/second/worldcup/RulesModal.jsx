import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Swords, Star, Info, HelpCircle } from 'lucide-react';

const RulesModal = ({ isOpen, onClose }) => {
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-850 rounded-2xl p-6 shadow-2xl overflow-hidden z-10 text-zinc-100"
          >
            {/* Decorative BG Blur */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-5 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide uppercase text-white">Aturan Perhitungan Poin</h3>
                  <p className="text-[10px] text-zinc-500">Panduan lengkap sistem penilaian prediksi</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content List */}
            <div className="space-y-4 relative z-10 max-h-[360px] overflow-y-auto pr-1">
              
              {/* Fase Grup */}
              <div className="bg-zinc-900/40 border border-zinc-900/80 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
                <div className="flex items-center gap-2 mb-2.5">
                  <Star className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                  <span className="text-[11px] font-black text-blue-400 tracking-wider uppercase">Fase Grup (Maks 64 Poin)</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Tim lolos dan peringkatnya <strong>Benar</strong> (Rank 1, 2, atau 3 sesuai pilihan Anda).
                    </p>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                      +2 Poin / Tim
                    </span>
                  </div>
                  <div className="h-[1px] bg-zinc-900/60" />
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Tim diprediksi lolos tetapi posisi peringkatnya <strong>Salah</strong>.
                    </p>
                    <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
                      +1 Poin / Tim
                    </span>
                  </div>
                </div>
              </div>

              {/* R32 & R16 */}
              <div className="bg-zinc-900/40 border border-zinc-900/80 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
                <div className="flex items-center gap-2 mb-2.5">
                  <Swords className="w-4 h-4 text-zinc-400" />
                  <span className="text-[11px] font-black text-zinc-400 tracking-wider uppercase">Babak 32 Besar & 16 Besar</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Setiap tebakan pemenang pertandingan yang <strong>Benar</strong> dan melaju ke babak berikutnya.
                  </p>
                  <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">
                    +3 Poin / Laga
                  </span>
                </div>
              </div>

              {/* Quarters & Semis */}
              <div className="bg-zinc-900/40 border border-zinc-900/80 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
                <div className="flex items-center gap-2 mb-2.5">
                  <Swords className="w-4 h-4 text-orange-400" />
                  <span className="text-[11px] font-black text-orange-400 tracking-wider uppercase">Perempat Final & Semi Final</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Setiap tebakan pemenang pertandingan yang <strong>Benar</strong> dan lolos ke babak selanjutnya.
                  </p>
                  <span className="text-xs font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 shrink-0">
                    +5 Poin / Laga
                  </span>
                </div>
              </div>

              {/* Juara */}
              <div className="bg-zinc-900/40 border border-zinc-900/80 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
                <div className="flex items-center gap-2 mb-2.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-black text-amber-400 tracking-wider uppercase">Juara Dunia (Final)</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Menebak negara yang keluar sebagai <strong>Juara Dunia</strong> World Cup 2026 secara tepat.
                  </p>
                  <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
                    +10 Poin
                  </span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-5 pt-3.5 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 relative z-10 pl-1">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-zinc-650" />
                <span>Total Poin Maksimal: <strong>176 Pts</strong></span>
              </div>
              <button
                onClick={onClose}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold px-4 py-2 rounded-xl text-[11px] border border-white/5 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RulesModal;
