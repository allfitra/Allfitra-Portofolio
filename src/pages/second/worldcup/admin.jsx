import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Save, CheckCircle2, RotateCcw, Loader2, AlertTriangle,
  Shield, ChevronDown, ChevronUp, Swords, Star, Lock
} from 'lucide-react';
import logoWorldCupImg from '../../../assets/images/ImagesWorldCup/logo-world-cup.png';
import FlagIcon from './FlagIcon';
import { db } from '../../../database/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// ── Shared group + bracket data ───────────────────────────────────────────────
const WORLD_CUP_GROUPS = [
  { id: 'A', teams: ['Mexico', 'South Africa', 'South Korea', 'Czech Republic'] },
  { id: 'B', teams: ['Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland'] },
  { id: 'C', teams: ['Brazil', 'Morocco', 'Haiti', 'Scotland'] },
  { id: 'D', teams: ['United States', 'Paraguay', 'Australia', 'Turkiye'] },
  { id: 'E', teams: ['Germany', 'Curacao', 'Ivory Coast', 'Ecuador'] },
  { id: 'F', teams: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'] },
  { id: 'G', teams: ['Belgium', 'Egypt', 'Iran', 'New Zealand'] },
  { id: 'H', teams: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'] },
  { id: 'I', teams: ['France', 'Senegal', 'Iraq', 'Norway'] },
  { id: 'J', teams: ['Argentina', 'Algeria', 'Austria', 'Jordan'] },
  { id: 'K', teams: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'] },
  { id: 'L', teams: ['England', 'Croatia', 'Ghana', 'Panama'] },
];

const NUM_GROUPS = 12;
const MAX_GROUPS_WITH_THREE = 8;

const THIRD_PLACE_SLOTS = [
  { key: '3ABCDF', groups: ['A', 'B', 'C', 'D', 'F'] },
  { key: '3CDFGH', groups: ['C', 'D', 'F', 'G', 'H'] },
  { key: '3BEFIJ', groups: ['B', 'E', 'F', 'I', 'J'] },
  { key: '3AEHIJ', groups: ['A', 'E', 'H', 'I', 'J'] },
  { key: '3CEFHI', groups: ['C', 'E', 'F', 'H', 'I'] },
  { key: '3EHIJK', groups: ['E', 'H', 'I', 'J', 'K'] },
  { key: '3EFGLJ', groups: ['E', 'F', 'G', 'L', 'J'] },
  { key: '3DEIJL', groups: ['D', 'E', 'I', 'J', 'L'] },
];

const ADMIN_PASS = 'pariaman23';

// ── Backtracking: assign 3rd-place groups ─────────────────────────────────────
const assignThirdPlaceTeams = (groupAdvancers) => {
  const qualifiedThirds = {};
  WORLD_CUP_GROUPS.forEach((g) => {
    const sel = groupAdvancers[g.id];
    if (sel && sel.length === 3) qualifiedThirds[g.id] = sel[2];
  });
  const qualifiedGroupIds = Object.keys(qualifiedThirds);
  const assignment = {};
  const usedGroups = new Set();
  const solve = (slotIndex) => {
    if (slotIndex === THIRD_PLACE_SLOTS.length) return true;
    const slot = THIRD_PLACE_SLOTS[slotIndex];
    for (const gId of qualifiedGroupIds) {
      if (!usedGroups.has(gId) && slot.groups.includes(gId)) {
        usedGroups.add(gId);
        assignment[slot.key] = gId;
        if (solve(slotIndex + 1)) return true;
        usedGroups.delete(gId);
        delete assignment[slot.key];
      }
    }
    return false;
  };
  solve(0);
  const result = {};
  for (const slot of THIRD_PLACE_SLOTS) {
    const gId = assignment[slot.key];
    result[slot.key] = gId ? { team: qualifiedThirds[gId], group: gId } : null;
  }
  return result;
};

// ── Team selector pill ────────────────────────────────────────────────────────
const TeamPill = ({ team, selected, onClick, rank }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all ${selected
      ? rank === 1 ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
        : rank === 2 ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
          : 'bg-amber-600/20 border-amber-500/50 text-amber-300'
      : 'bg-zinc-900/60 border-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
  >
    <FlagIcon teamName={team} />
    <span className="truncate">{team}</span>
    {selected && (
      <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full ${rank === 1 ? 'bg-blue-500/30 text-blue-300'
        : rank === 2 ? 'bg-emerald-500/30 text-emerald-300'
          : 'bg-amber-500/30 text-amber-300'
        }`}>
        R{rank}
      </span>
    )}
  </div>
);

// ── Match result selector ─────────────────────────────────────────────────────
const MatchResult = ({ label, t1, t2, winner, onSelect }) => (
  <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-3">
    {label && <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mb-2">{label}</p>}
    <div className="flex flex-col gap-1.5">
      {[t1, t2].map((team) => (
        <div
          key={team || Math.random()}
          onClick={() => team && onSelect(team)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer select-none transition-all ${winner === team
            ? 'bg-emerald-600 text-white shadow shadow-emerald-900/40'
            : !team
              ? 'bg-zinc-900/30 text-zinc-700 cursor-default'
              : 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
        >
          <FlagIcon teamName={team} />
          <span className="truncate">{team || 'TBD'}</span>
          {winner === team && <CheckCircle2 className="w-3.5 h-3.5 ml-auto flex-shrink-0" />}
        </div>
      ))}
    </div>
  </div>
);

// ── Main Admin Page ───────────────────────────────────────────────────────────
export const WorldCupAdminPage = () => {
  // Auth
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState(false);

  // Data
  const [groupAdvancers, setGroupAdvancers] = useState({});
  const [r32Winners, setR32Winners] = useState({});
  const [r16Winners, setR16Winners] = useState({});
  const [qfWinners, setQfWinners] = useState({});
  const [sfWinners, setSfWinners] = useState({});
  const [champion, setChampion] = useState(null);
  const [leaderboardOpened, setLeaderboardOpened] = useState(false);

  // UI
  const [activeTab, setActiveTab] = useState('groups');
  const [status, setStatus] = useState(null); // 'saving' | 'saved' | 'error' | 'loading'
  const [errMsg, setErrMsg] = useState('');
  const [expandedGroup, setExpandedGroup] = useState('A');
  const [lastSaved, setLastSaved] = useState(null);

  // Derived
  const groupsWithThreeCount = Object.values(groupAdvancers).filter((t) => t?.length === 3).length;
  const thirdPlace = (() => {
    const allComplete = Object.values(groupAdvancers).filter((t) => t?.length >= 2).length === NUM_GROUPS;
    if (!allComplete) return {};
    return assignThirdPlaceTeams(groupAdvancers);
  })();

  const g1 = (id) => groupAdvancers[id]?.[0] ?? null;
  const g2 = (id) => groupAdvancers[id]?.[1] ?? null;
  const g3 = (slot) => thirdPlace[slot]?.team ?? null;

  // ── Load from Firestore ────────────────────────────────────────────────────
  const loadFromFirestore = useCallback(async () => {
    setStatus('loading');
    try {
      const snap = await getDoc(doc(db, 'worldCupResult', 'official'));
      if (snap.exists()) {
        const d = snap.data();
        setGroupAdvancers(d.groupAdvancers ?? {});
        setR32Winners(d.r32Winners ?? {});
        setR16Winners(d.r16Winners ?? {});
        setQfWinners(d.qfWinners ?? {});
        setSfWinners(d.sfWinners ?? {});
        setChampion(d.champion ?? null);
        setLeaderboardOpened(d.leaderboardOpened ?? true);
        setLastSaved(d.updatedAt ?? null);
      }
      setStatus(null);
    } catch (e) {
      console.error(e);
      setStatus('error');
      setErrMsg('Gagal load data dari Firestore.');
    }
  }, []);

  useEffect(() => {
    if (authed) loadFromFirestore();
  }, [authed, loadFromFirestore]);

  // ── Save to Firestore ──────────────────────────────────────────────────────
  const handleSave = async () => {
    setStatus('saving');
    setErrMsg('');
    try {
      const payload = {
        groupAdvancers,
        r32Winners,
        r16Winners,
        qfWinners,
        sfWinners,
        champion,
        leaderboardOpened,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'worldCupResult', 'official'), payload);
      setLastSaved(payload.updatedAt);
      setStatus('saved');
      setTimeout(() => setStatus(null), 2500);
    } catch (e) {
      console.error(e);
      setStatus('error');
      setErrMsg(e.message || 'Gagal menyimpan.');
    }
  };

  // ── Group team selection ───────────────────────────────────────────────────
  const handleGroupTeamClick = (groupId, team) => {
    setGroupAdvancers((prev) => {
      const curr = prev[groupId] || [];
      if (curr.includes(team)) return { ...prev, [groupId]: curr.filter((t) => t !== team) };
      if (curr.length < 2) return { ...prev, [groupId]: [...curr, team] };
      const currentThreeCount = Object.values(prev).filter((t) => t?.length === 3).length;
      if (curr.length === 2 && currentThreeCount < MAX_GROUPS_WITH_THREE)
        return { ...prev, [groupId]: [...curr, team] };
      return prev;
    });
    // cascade-reset bracket when group changes
    setR32Winners({});
    setR16Winners({});
    setQfWinners({});
    setSfWinners({});
    setChampion(null);
  };

  // ── Bracket matches ────────────────────────────────────────────────────────
  const r32 = {
    left: [
      { id: 'R32_L1', t1: g1('E'), t2: g3('3ABCDF'), desc: '1E vs 3ABCDF' },
      { id: 'R32_L2', t1: g1('I'), t2: g3('3CDFGH'), desc: '1I vs 3CDFGH' },
      { id: 'R32_L3', t1: g2('A'), t2: g2('B'), desc: '2A vs 2B' },
      { id: 'R32_L4', t1: g1('F'), t2: g2('C'), desc: '1F vs 2C' },
      { id: 'R32_L5', t1: g2('K'), t2: g2('L'), desc: '2K vs 2L' },
      { id: 'R32_L6', t1: g1('H'), t2: g2('J'), desc: '1H vs 2J' },
      { id: 'R32_L7', t1: g1('D'), t2: g3('3BEFIJ'), desc: '1D vs 3BEFIJ' },
      { id: 'R32_L8', t1: g1('G'), t2: g3('3AEHIJ'), desc: '1G vs 3AEHIJ' },
    ],
    right: [
      { id: 'R32_R1', t1: g1('C'), t2: g2('F'), desc: '1C vs 2F' },
      { id: 'R32_R2', t1: g2('E'), t2: g2('I'), desc: '2E vs 2I' },
      { id: 'R32_R3', t1: g1('A'), t2: g3('3CEFHI'), desc: '1A vs 3CEFHI' },
      { id: 'R32_R4', t1: g1('L'), t2: g3('3EHIJK'), desc: '1L vs 3EHIJK' },
      { id: 'R32_R5', t1: g1('J'), t2: g2('H'), desc: '1J vs 2H' },
      { id: 'R32_R6', t1: g2('D'), t2: g2('G'), desc: '2D vs 2G' },
      { id: 'R32_R7', t1: g1('B'), t2: g3('3EFGLJ'), desc: '1B vs 3EFGLJ' },
      { id: 'R32_R8', t1: g1('K'), t2: g3('3DEIJL'), desc: '1K vs 3DEIJL' },
    ],
  };

  const r16 = {
    left: [
      { id: 'R16_L1', t1: r32Winners['R32_L1'], t2: r32Winners['R32_L2'], desc: 'W(L1) vs W(L2)' },
      { id: 'R16_L2', t1: r32Winners['R32_L3'], t2: r32Winners['R32_L4'], desc: 'W(L3) vs W(L4)' },
      { id: 'R16_L3', t1: r32Winners['R32_L5'], t2: r32Winners['R32_L6'], desc: 'W(L5) vs W(L6)' },
      { id: 'R16_L4', t1: r32Winners['R32_L7'], t2: r32Winners['R32_L8'], desc: 'W(L7) vs W(L8)' },
    ],
    right: [
      { id: 'R16_R1', t1: r32Winners['R32_R1'], t2: r32Winners['R32_R2'], desc: 'W(R1) vs W(R2)' },
      { id: 'R16_R2', t1: r32Winners['R32_R3'], t2: r32Winners['R32_R4'], desc: 'W(R3) vs W(R4)' },
      { id: 'R16_R3', t1: r32Winners['R32_R5'], t2: r32Winners['R32_R6'], desc: 'W(R5) vs W(R6)' },
      { id: 'R16_R4', t1: r32Winners['R32_R7'], t2: r32Winners['R32_R8'], desc: 'W(R7) vs W(R8)' },
    ],
  };

  const qf = {
    left: [
      { id: 'QF_L1', t1: r16Winners['R16_L1'], t2: r16Winners['R16_L2'], desc: 'QF Kiri 1' },
      { id: 'QF_L2', t1: r16Winners['R16_L3'], t2: r16Winners['R16_L4'], desc: 'QF Kiri 2' },
    ],
    right: [
      { id: 'QF_R1', t1: r16Winners['R16_R1'], t2: r16Winners['R16_R2'], desc: 'QF Kanan 1' },
      { id: 'QF_R2', t1: r16Winners['R16_R3'], t2: r16Winners['R16_R4'], desc: 'QF Kanan 2' },
    ],
  };

  const sf = {
    left: { id: 'SF_L', t1: qfWinners['QF_L1'], t2: qfWinners['QF_L2'], desc: 'Semi Final Kiri' },
    right: { id: 'SF_R', t1: qfWinners['QF_R1'], t2: qfWinners['QF_R2'], desc: 'Semi Final Kanan' },
  };

  const finalMatch = { id: 'F_1', t1: sfWinners['SF_L'], t2: sfWinners['SF_R'] };

  // ── Login Gate ─────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Admin Panel</h1>
            <p className="text-xs text-zinc-500 mt-1">World Cup 2026 — Hasil Resmi</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={passInput}
              onChange={(e) => { setPassInput(e.target.value); setPassError(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (passInput === ADMIN_PASS) setAuthed(true);
                  else setPassError(true);
                }
              }}
              placeholder="Password admin..."
              className={`w-full bg-zinc-900 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors ${passError ? 'border-rose-500' : 'border-zinc-800 focus:border-amber-500'}`}
            />
            {passError && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Password salah
              </p>
            )}
            <button
              onClick={() => {
                if (passInput === ADMIN_PASS) setAuthed(true);
                else setPassError(true);
              }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-3 rounded-xl text-sm transition-all"
            >
              Masuk
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main Admin UI ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 pb-24 pt-8 px-4 sm:px-6">
      {/* Global decorative blur */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-amber-700/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/60"
        >
          <div className="flex items-center gap-4">
            <img src={logoWorldCupImg} alt="Logo" className="h-16 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Admin Panel</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Hasil Resmi World Cup 2026</h1>
              {lastSaved && (
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Terakhir disimpan · {new Date(lastSaved).toLocaleString('id-ID')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {status === 'saved' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan!
                </motion.span>
              )}
              {status === 'error' && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl font-semibold"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> {errMsg || 'Error'}
                </motion.span>
              )}
            </AnimatePresence>

            <button
              onClick={loadFromFirestore}
              disabled={status === 'loading' || status === 'saving'}
              className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={handleSave}
              disabled={status === 'saving'}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold px-5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-900/20"
            >
              {status === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {status === 'saving' ? 'Menyimpan...' : 'Simpan Semua'}
            </button>
          </div>
        </motion.div>

        {/* ── Settings Panel (Leaderboard Lock Switch) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${leaderboardOpened ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'}`}>
              <Star className={`w-4 h-4 ${leaderboardOpened ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white uppercase">Status Leaderboard</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                {leaderboardOpened ? 'Leaderboard dibuka untuk semua user (Real-Time)' : 'Leaderboard dikunci (Hanya admin yang bisa mengakses/membuka)'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLeaderboardOpened(!leaderboardOpened)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${leaderboardOpened ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20' : 'bg-rose-600/10 border-rose-500/30 text-rose-400 hover:bg-rose-600/20'}`}
          >
            {leaderboardOpened ? 'Kunci Leaderboard' : 'Buka Leaderboard'}
          </button>
        </motion.div>

        {/* ── Tab Nav ── */}
        <div className="flex bg-zinc-900/80 border border-white/5 rounded-xl p-1 mb-8 gap-1 w-fit">
          {[
            { key: 'groups', label: 'Fase Grup' },
            { key: 'r32', label: '32 Besar' },
            { key: 'r16', label: '16 Besar' },
            { key: 'qf', label: 'Perempat Final' },
            { key: 'sf', label: 'Semi Final' },
            { key: 'final', label: 'Final & Juara' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${activeTab === tab.key ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Fase Grup ── */}
        {activeTab === 'groups' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white">Pilih Tim Lolos dari Setiap Grup</h2>
              <span className="text-[11px] text-zinc-500 bg-zinc-900 border border-white/5 px-3 py-1 rounded-lg">
                Rank 3 Terisi: <strong className="text-amber-400">{groupsWithThreeCount}/{MAX_GROUPS_WITH_THREE}</strong>
              </span>
            </div>

            {WORLD_CUP_GROUPS.map((group) => {
              const sel = groupAdvancers[group.id] || [];
              const isExpanded = expandedGroup === group.id;
              const isFull = sel.length >= 3 || (sel.length === 2 && groupsWithThreeCount >= MAX_GROUPS_WITH_THREE);

              return (
                <div key={group.id} className="bg-zinc-950/60 border border-zinc-800/60 rounded-2xl overflow-hidden">
                  {/* Group header */}
                  <div
                    className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-zinc-900/40 transition-colors"
                    onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                        GRUP {group.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {sel.length === 0 && <span className="text-[11px] text-zinc-600">Belum ada pilihan</span>}
                        {sel.map((t, i) => (
                          <span key={t} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${i === 0 ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                            : i === 1 ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                            }`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sel.length >= 2 && (
                        <CheckCircle2 className={`w-4 h-4 ${sel.length === 3 ? 'text-amber-400' : 'text-emerald-400'}`} />
                      )}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                    </div>
                  </div>

                  {/* Teams */}
                  {isExpanded && (
                    <div className="px-5 pb-4 border-t border-zinc-800/40 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {group.teams.map((team) => {
                        const idx = sel.indexOf(team);
                        const isSelected = idx !== -1;
                        const isDisabled = !isSelected && isFull;
                        return (
                          <div key={team} className={isDisabled ? 'opacity-30 pointer-events-none' : ''}>
                            <TeamPill
                              team={team}
                              selected={isSelected}
                              rank={isSelected ? idx + 1 : null}
                              onClick={() => handleGroupTeamClick(group.id, team)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── TAB: 32 Besar ── */}
        {activeTab === 'r32' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest mb-4">Bracket Kiri (A–F)</h3>
                <div className="grid gap-3">
                  {r32.left.map((m) => (
                    <MatchResult key={m.id} label={m.desc} t1={m.t1} t2={m.t2}
                      winner={r32Winners[m.id]}
                      onSelect={(team) => setR32Winners((p) => ({ ...p, [m.id]: team }))} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-4">Bracket Kanan (G–L)</h3>
                <div className="grid gap-3">
                  {r32.right.map((m) => (
                    <MatchResult key={m.id} label={m.desc} t1={m.t1} t2={m.t2}
                      winner={r32Winners[m.id]}
                      onSelect={(team) => setR32Winners((p) => ({ ...p, [m.id]: team }))} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB: 16 Besar ── */}
        {activeTab === 'r16' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest mb-4">Bracket Kiri</h3>
                <div className="grid gap-3">
                  {r16.left.map((m) => (
                    <MatchResult key={m.id} label={m.desc} t1={m.t1} t2={m.t2}
                      winner={r16Winners[m.id]}
                      onSelect={(team) => setR16Winners((p) => ({ ...p, [m.id]: team }))} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-4">Bracket Kanan</h3>
                <div className="grid gap-3">
                  {r16.right.map((m) => (
                    <MatchResult key={m.id} label={m.desc} t1={m.t1} t2={m.t2}
                      winner={r16Winners[m.id]}
                      onSelect={(team) => setR16Winners((p) => ({ ...p, [m.id]: team }))} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB: Perempat Final ── */}
        {activeTab === 'qf' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest mb-4">Bracket Kiri</h3>
                <div className="grid gap-3">
                  {qf.left.map((m) => (
                    <MatchResult key={m.id} label={m.desc} t1={m.t1} t2={m.t2}
                      winner={qfWinners[m.id]}
                      onSelect={(team) => setQfWinners((p) => ({ ...p, [m.id]: team }))} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-4">Bracket Kanan</h3>
                <div className="grid gap-3">
                  {qf.right.map((m) => (
                    <MatchResult key={m.id} label={m.desc} t1={m.t1} t2={m.t2}
                      winner={qfWinners[m.id]}
                      onSelect={(team) => setQfWinners((p) => ({ ...p, [m.id]: team }))} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB: Semi Final ── */}
        {activeTab === 'sf' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
            <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest mb-4">Semi Final</h3>
            <div className="grid gap-4">
              <MatchResult label={sf.left.desc} t1={sf.left.t1} t2={sf.left.t2}
                winner={sfWinners['SF_L']}
                onSelect={(team) => setSfWinners((p) => ({ ...p, SF_L: team }))} />
              <MatchResult label={sf.right.desc} t1={sf.right.t1} t2={sf.right.t2}
                winner={sfWinners['SF_R']}
                onSelect={(team) => setSfWinners((p) => ({ ...p, SF_R: team }))} />
            </div>
          </motion.div>
        )}

        {/* ── TAB: Final & Juara ── */}
        {activeTab === 'final' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto">
            <div className="flex items-center gap-2 justify-center mb-6">
              <Swords className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-widest">Grand Final</h3>
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <MatchResult
              label="Grand Final — Pemenang Resmi"
              t1={finalMatch.t1}
              t2={finalMatch.t2}
              winner={champion}
              onSelect={(team) => setChampion(team)}
            />

            <AnimatePresence>
              {champion && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-6 text-center"
                >
                  <div className="relative inline-block">
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl blur-lg opacity-30" />
                    <div className="relative bg-zinc-950 border border-amber-500/30 rounded-2xl px-8 py-5">
                      <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                      <p className="text-[11px] text-amber-400 font-bold uppercase tracking-widest mb-1">Juara Dunia 2026</p>
                      <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                        {champion}
                      </h2>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 mt-4">
                    Klik <strong className="text-amber-400">Simpan Semua</strong> di atas untuk memperbarui hasil ke Firestore.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default WorldCupAdminPage;
