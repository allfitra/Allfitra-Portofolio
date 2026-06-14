import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, Star, Swords, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import FlagIcon from './FlagIcon';
import { db } from '../../../database/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Footer from './Footer';

const NUM_GROUPS = 12;
const MAX_GROUPS_WITH_THREE = 8;

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

const THIRD_PLACE_SLOTS = [
  { key: '3ABCDF', groups: ['A', 'B', 'C', 'D', 'F'] },
  { key: '3CDFGH', groups: ['C', 'D', 'F', 'G', 'H'] },
  { key: '3BEFIJ', groups: ['B', 'E', 'F', 'I', 'J'] },
  { key: '3AEHIJ', groups: ['A', 'E', 'H', 'I', 'J'] },
  { key: '3CEFHI', groups: ['C', 'E', 'F', 'H', 'I'] },
  { key: '3EHIJK', groups: ['E', 'H', 'I', 'J', 'K'] },
  { key: '3EFGIJ', groups: ['E', 'F', 'G', 'I', 'J'] },
  { key: '3DEIJL', groups: ['D', 'E', 'I', 'J', 'L'] },
];

const assignThirdPlaceTeams = (groupAdvancers) => {
  const qualifiedThirds = {};
  WORLD_CUP_GROUPS.forEach(g => {
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

const pialaImg = new URL('../../../assets/images/ImagesWorldCup/piala.png', import.meta.url).href;
const logoWorldCupImg = new URL('../../../assets/images/ImagesWorldCup/logo-world-cup.png', import.meta.url).href;

export const CupResultPage = () => {
  const [groupAdvancers, setGroupAdvancers] = useState({});
  const [roundOf32Winners, setRoundOf32Winners] = useState({});
  const [roundOf16Winners, setRoundOf16Winners] = useState({});
  const [quarterWinners, setQuarterWinners] = useState({});
  const [semiWinners, setSemiWinners] = useState({});
  const [finalWinner, setFinalWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGroupTab, setActiveGroupTab] = useState('A-F');

  const topScrollRef = useRef(null);
  const bracketScrollRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [svgPaths, setSvgPaths] = useState([]);

  // Load official results in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'worldCupResult', 'official'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setGroupAdvancers(d.groupAdvancers || {});
        setRoundOf32Winners(d.r32Winners || {});
        setRoundOf16Winners(d.r16Winners || {});
        setQuarterWinners(d.qfWinners || {});
        setSemiWinners(d.sfWinners || {});
        setFinalWinner(d.champion || null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error loading official result:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const thirdPlaceAssignment = useMemo(() => {
    return assignThirdPlaceTeams(groupAdvancers);
  }, [groupAdvancers]);

  const g1 = (id) => groupAdvancers[id]?.[0] ?? null;
  const g2 = (id) => groupAdvancers[id]?.[1] ?? null;
  const g3 = (slot) => thirdPlaceAssignment[slot]?.team ?? null;

  const getRoundOf32Matches = () => {
    return {
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
        { id: 'R32_R7', t1: g1('B'), t2: g3('3EFGIJ'), desc: '1B vs 3EFGIJ' },
        { id: 'R32_R8', t1: g1('K'), t2: g3('3DEIJL'), desc: '1K vs 3DEIJL' },
      ],
    };
  };

  const getRoundOf16Matches = () => {
    const w = roundOf32Winners;
    return {
      left: [
        { id: 'R16_L1', t1: w['R32_L1'], t2: w['R32_L2'], desc: 'W(L1) vs W(L2)' },
        { id: 'R16_L2', t1: w['R32_L3'], t2: w['R32_L4'], desc: 'W(L3) vs W(L4)' },
        { id: 'R16_L3', t1: w['R32_L5'], t2: w['R32_L6'], desc: 'W(L5) vs W(L6)' },
        { id: 'R16_L4', t1: w['R32_L7'], t2: w['R32_L8'], desc: 'W(L7) vs W(L8)' },
      ],
      right: [
        { id: 'R16_R1', t1: w['R32_R1'], t2: w['R32_R2'], desc: 'W(R1) vs W(R2)' },
        { id: 'R16_R2', t1: w['R32_R3'], t2: w['R32_R4'], desc: 'W(R3) vs W(R4)' },
        { id: 'R16_R3', t1: w['R32_R5'], t2: w['R32_R6'], desc: 'W(R5) vs W(R6)' },
        { id: 'R16_R4', t1: w['R32_R7'], t2: w['R32_R8'], desc: 'W(R7) vs W(R8)' },
      ],
    };
  };

  const getQuarterMatches = () => {
    const w = roundOf16Winners;
    return {
      left: [
        { id: 'QF_L1', t1: w['R16_L1'], t2: w['R16_L2'], desc: 'QF Kiri 1' },
        { id: 'QF_L2', t1: w['R16_L3'], t2: w['R16_L4'], desc: 'QF Kiri 2' },
      ],
      right: [
        { id: 'QF_R1', t1: w['R16_R1'], t2: w['R16_R2'], desc: 'QF Kanan 1' },
        { id: 'QF_R2', t1: w['R16_R3'], t2: w['R16_R4'], desc: 'QF Kanan 2' },
      ],
    };
  };

  const getSemiMatches = () => {
    return {
      left: { id: 'SF_L', t1: quarterWinners['QF_L1'], t2: quarterWinners['QF_L2'], desc: 'Semi Final Kiri' },
      right: { id: 'SF_R', t1: quarterWinners['QF_R1'], t2: quarterWinners['QF_R2'], desc: 'Semi Final Kanan' },
    };
  };

  const getFinalMatch = () => {
    return { id: 'F_1', t1: semiWinners['SF_L'], t2: semiWinners['SF_R'] };
  };

  const r32 = getRoundOf32Matches();
  const r16 = getRoundOf16Matches();
  const qf = getQuarterMatches();
  const sf = getSemiMatches();
  const finalMatch = getFinalMatch();

  // Scroll Sync
  const handleTopScroll = () => {
    if (topScrollRef.current && bracketScrollRef.current) {
      if (bracketScrollRef.current.scrollLeft !== topScrollRef.current.scrollLeft) {
        bracketScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
      }
    }
  };

  const handleBracketScroll = () => {
    if (topScrollRef.current && bracketScrollRef.current) {
      if (topScrollRef.current.scrollLeft !== bracketScrollRef.current.scrollLeft) {
        topScrollRef.current.scrollLeft = bracketScrollRef.current.scrollLeft;
      }
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      if (bracketScrollRef.current) {
        const contentEl = bracketScrollRef.current.querySelector('.bracket-scroll-content');
        if (contentEl) {
          setContentWidth(contentEl.scrollWidth);
        }
      }
    };
    const timer = setTimeout(updateWidth, 300);
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, [isLoading, groupAdvancers, roundOf32Winners, roundOf16Winners, quarterWinners, semiWinners, finalWinner]);

  // SVG Paths render
  const updateSvgPaths = useCallback(() => {
    const container = document.querySelector('.bracket-scroll-content');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const paths = [];

    const getCardConnectorPoints = (matchId) => {
      const card = container.querySelector(`[data-match-id="${matchId}"]`);
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      return {
        left: { x: rect.left - containerRect.left, y: rect.top - containerRect.top + rect.height / 2 },
        right: { x: rect.right - containerRect.left, y: rect.top - containerRect.top + rect.height / 2 },
      };
    };

    const connectMatches = (fromId, toId, side, fromWinnerVal) => {
      const fromPts = getCardConnectorPoints(fromId);
      const toPts = getCardConnectorPoints(toId);
      if (!fromPts || !toPts) return;

      const start = side === 'left' ? fromPts.right : fromPts.left;
      const end = side === 'left' ? toPts.left : toPts.right;
      const isActive = fromWinnerVal !== undefined && fromWinnerVal !== null;

      const controlX = start.x + (end.x - start.x) / 2;
      const d = `M ${start.x} ${start.y} C ${controlX} ${start.y}, ${controlX} ${end.y}, ${end.x} ${end.y}`;
      paths.push({ d, isActive });
    };

    // R32 -> R16 Left
    connectMatches('R32_L1', 'R16_L1', 'left', roundOf32Winners['R32_L1']);
    connectMatches('R32_L2', 'R16_L1', 'left', roundOf32Winners['R32_L2']);
    connectMatches('R32_L3', 'R16_L2', 'left', roundOf32Winners['R32_L3']);
    connectMatches('R32_L4', 'R16_L2', 'left', roundOf32Winners['R32_L4']);
    connectMatches('R32_L5', 'R16_L3', 'left', roundOf32Winners['R32_L5']);
    connectMatches('R32_L6', 'R16_L3', 'left', roundOf32Winners['R32_L6']);
    connectMatches('R32_L7', 'R16_L4', 'left', roundOf32Winners['R32_L7']);
    connectMatches('R32_L8', 'R16_L4', 'left', roundOf32Winners['R32_L8']);

    // R32 -> R16 Right
    connectMatches('R32_R1', 'R16_R1', 'right', roundOf32Winners['R32_R1']);
    connectMatches('R32_R2', 'R16_R1', 'right', roundOf32Winners['R32_R2']);
    connectMatches('R32_R3', 'R16_R2', 'right', roundOf32Winners['R32_R3']);
    connectMatches('R32_R4', 'R16_R2', 'right', roundOf32Winners['R32_R4']);
    connectMatches('R32_R5', 'R16_R3', 'right', roundOf32Winners['R32_R5']);
    connectMatches('R32_R6', 'R16_R3', 'right', roundOf32Winners['R32_R6']);
    connectMatches('R32_R7', 'R16_R4', 'right', roundOf32Winners['R32_R7']);
    connectMatches('R32_R8', 'R16_R4', 'right', roundOf32Winners['R32_R8']);

    // R16 -> QF Left
    connectMatches('R16_L1', 'QF_L1', 'left', roundOf16Winners['R16_L1']);
    connectMatches('R16_L2', 'QF_L1', 'left', roundOf16Winners['R16_L2']);
    connectMatches('R16_L3', 'QF_L2', 'left', roundOf16Winners['R16_L3']);
    connectMatches('R16_L4', 'QF_L2', 'left', roundOf16Winners['R16_L4']);

    // R16 -> QF Right
    connectMatches('R16_R1', 'QF_R1', 'right', roundOf16Winners['R16_R1']);
    connectMatches('R16_R2', 'QF_R1', 'right', roundOf16Winners['R16_R2']);
    connectMatches('R16_R3', 'QF_R2', 'right', roundOf16Winners['R16_R3']);
    connectMatches('R16_R4', 'QF_R2', 'right', roundOf16Winners['R16_R4']);

    // QF -> SF Left
    connectMatches('QF_L1', 'SF_L', 'left', quarterWinners['QF_L1']);
    connectMatches('QF_L2', 'SF_L', 'left', quarterWinners['QF_L2']);

    // QF -> SF Right
    connectMatches('QF_R1', 'SF_R', 'right', quarterWinners['QF_R1']);
    connectMatches('QF_R2', 'SF_R', 'right', quarterWinners['QF_R2']);

    // SF -> Final
    connectMatches('SF_L', 'F_1', 'left', semiWinners['SF_L']);
    connectMatches('SF_R', 'F_1', 'right', semiWinners['SF_R']);

    setSvgPaths(paths);
  }, [roundOf32Winners, roundOf16Winners, quarterWinners, semiWinners, finalWinner]);

  useEffect(() => {
    updateSvgPaths();
    window.addEventListener('resize', updateSvgPaths);
    const timer = setTimeout(updateSvgPaths, 300);
    return () => {
      window.removeEventListener('resize', updateSvgPaths);
      clearTimeout(timer);
    };
  }, [updateSvgPaths]);

  const getFilteredGroups = () => {
    if (activeGroupTab === 'A-F') return WORLD_CUP_GROUPS.slice(0, 6);
    return WORLD_CUP_GROUPS.slice(6, 12);
  };

  const MatchCard = ({ match, winnerState }) => {
    if (!match) return null;
    const isT1 = winnerState[match.id] === match.t1;
    const isT2 = winnerState[match.id] === match.t2;

    const TeamBtn = ({ team, isWinner }) => {
      let btnStyle = "bg-zinc-900/40 text-zinc-500 border border-zinc-900/60";
      if (isWinner) {
        btnStyle = "bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-md shadow-blue-500/5";
      } else if (team) {
        btnStyle = "bg-zinc-900/60 text-zinc-400 border border-white/5";
      }
      return (
        <div className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left select-none ${btnStyle}`}>
          <FlagIcon teamName={team} />
          <span className="text-[11px] font-semibold truncate">{team || 'TBD'}</span>
          {isWinner && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 ml-auto" />}
        </div>
      );
    };

    return (
      <div data-match-id={match.id} className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-2.5 relative z-10">
        {match.desc && <p className="text-[9px] text-zinc-650 font-bold uppercase tracking-wider mb-1.5">{match.desc}</p>}
        <div className="flex flex-col gap-1">
          <TeamBtn team={match.t1} isWinner={isT1} />
          <TeamBtn team={match.t2} isWinner={isT2} />
        </div>
      </div>
    );
  };

  const BracketColumn = ({ title, titleColor = 'text-zinc-400', matches, winnerState, type }) => (
    <div className="flex-shrink-0 w-52">
      <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 text-center border-b pb-2 ${titleColor} border-zinc-800`}>
        {title}
      </h3>
      <div className={`flex flex-col ${type === 'r32' ? 'gap-3' :
        type === 'r16' ? 'gap-[98px] pt-[49px]' :
          type === 'qf' ? 'gap-[280px] pt-[140px]' :
            'pt-[322px]'
        }`}>
        {matches.map(m => (
          <MatchCard key={m.id} match={m} winnerState={winnerState} />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-zinc-500 text-xs font-semibold">Memuat Hasil Resmi...</span>
      </div>
    );
  }

  const groupsWithThreeCount = Object.values(groupAdvancers).filter(t => t.length === 3).length;

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 pt-10 pb-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <style>{`
        .bracket-scroll::-webkit-scrollbar {
          height: 10px;
        }
        .bracket-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 9999px;
        }
        .bracket-scroll::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.25);
          border-radius: 9999px;
          border: 1px solid transparent;
        }
        .bracket-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>

      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER BRANDING */}
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between border-b border-zinc-900 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/world-cup" className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <img src={logoWorldCupImg} alt="FIFA World Cup 2026 Logo" className="h-20 w-auto object-contain" />
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-emerald-400 text-[9px] font-black tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Official Results
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-none">Hasil & Klasemen Resmi</h1>
              <p className="text-[11px] text-zinc-500 mt-1">FIFA World Cup 2026 — Pantau realtime sesuai hasil pertandingan terkini.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link 
              to="/world-cup" 
              className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 font-extrabold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2"
            >
              <Swords className="w-4 h-4" /> Masuk Predictor
            </Link>
          </div>
        </div>

        {/* ── STEP 1: GROUP STANDINGS ── */}
        <div className="mb-10 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 border-b border-zinc-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black text-xs border border-emerald-500/25">1</span>
              <div>
                <h2 className="text-base font-bold text-white">Klasemen Fase Grup</h2>
                <p className="text-[11px] text-zinc-500">Tim lolos terverifikasi peringkat 1, 2, dan 3 terbaik.</p>
              </div>
            </div>
            <div className="flex bg-zinc-900/80 p-1 rounded-lg border border-white/5 self-start sm:self-center">
              {['A-F', 'G-L'].map(tab => (
                <button key={tab} onClick={() => setActiveGroupTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-all ${activeGroupTab === tab ? 'bg-emerald-600 text-black font-extrabold' : 'text-zinc-400 hover:text-zinc-200'}`}>
                  Grup {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {getFilteredGroups().map(group => {
              const sel = groupAdvancers[group.id] || [];
              return (
                <div key={group.id} className="bg-zinc-950/50 border border-white/5 rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
                    <h3 className="text-sm font-extrabold text-emerald-400 tracking-wider">GRUP {group.id}</h3>
                    <span className="text-[9px] font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-white/5">
                      {sel.length} Lolos
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      ...sel.map(team => ({ team, rank: sel.indexOf(team) + 1, isSelected: true })),
                      ...group.teams.filter(t => !sel.includes(t)).map(t => ({ team: t, rank: null, isSelected: false })),
                    ].map(({ team, rank, isSelected }) => {
                      return (
                        <div
                          key={team}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border select-none transition-all duration-200 ${isSelected
                            ? rank === 1 ? 'bg-gradient-to-r from-blue-950/15 to-zinc-950 border-blue-500/25 text-white'
                              : rank === 2 ? 'bg-gradient-to-r from-emerald-950/10 to-zinc-950 border-emerald-500/25 text-white'
                                : 'bg-gradient-to-r from-amber-950/10 to-zinc-950 border-amber-500/25 text-amber-200'
                            : 'bg-zinc-950/20 border-white/5 text-zinc-600 opacity-55'
                            }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <FlagIcon teamName={team} />
                            <span className="text-xs font-semibold truncate">{team}</span>
                          </div>
                          {isSelected && (
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${rank === 1 ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' :
                              rank === 2 ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' :
                                'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                              }`}>
                              R{rank}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STEP 2: KNOCKOUT BRACKET ── */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-7 border-b border-zinc-800 pb-5">
            <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/25">2</span>
            <div>
              <h2 className="text-base font-bold text-white">Bagan Babak Gugur Resmi</h2>
              <p className="text-[11px] text-zinc-500">Hasil pertandingan babak 32 besar hingga Juara Dunia secara realtime.</p>
            </div>
          </div>

          {/* Synced Top Scrollbar */}
          <div 
            ref={topScrollRef}
            onScroll={handleTopScroll}
            className="w-full overflow-x-auto mb-2 bracket-scroll"
          >
            <div style={{ width: `${contentWidth}px`, height: '1px' }} />
          </div>

          <div
            ref={bracketScrollRef}
            onScroll={handleBracketScroll}
            className="w-full overflow-x-auto pb-4 bracket-scroll"
          >
            <div className="bracket-scroll-content flex items-start gap-12 py-8 px-6 min-w-max relative">
              
              {/* SVG Connector Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <linearGradient id="active-grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="active-grad-right" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                {svgPaths.map((p, idx) => (
                  <path
                    key={idx}
                    d={p.d}
                    fill="none"
                    stroke={p.isActive ? '#3b82f6' : '#1f2937'}
                    strokeWidth={p.isActive ? 2 : 1.25}
                    strokeDasharray={p.isActive ? 'none' : '4,4'}
                    className={p.isActive ? 'shadow-md shadow-blue-500/50' : ''}
                    style={{ transition: 'stroke 0.4s ease, stroke-width 0.4s ease' }}
                  />
                ))}
              </svg>

              {/* Left Bracket */}
              <BracketColumn title="Babak 32 Besar" titleColor="text-blue-400" matches={r32.left} winnerState={roundOf32Winners} type="r32" />
              <BracketColumn title="Babak 16 Besar" matches={r16.left} winnerState={roundOf16Winners} type="r16" />
              <BracketColumn title="Perempat Final" matches={qf.left} winnerState={quarterWinners} type="qf" />
              <BracketColumn title="Semifinal" matches={[sf.left]} winnerState={semiWinners} type="sf" />

              {/* Centerpiece Winner Trophy */}
              <div className="flex-shrink-0 w-80 pt-[240px] flex flex-col items-center relative z-20">
                <div className="w-full flex items-center justify-between bg-zinc-950/80 border border-zinc-900 rounded-full px-5 py-2 mb-4 relative z-10 backdrop-blur-md">
                  <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Grand Final</h3>
                  <Swords className="w-3.5 h-3.5 text-amber-400" />
                </div>

                <div className="w-full mb-6">
                  {finalMatch && (
                    <div className="bg-gradient-to-b from-amber-500/20 to-zinc-950 p-[1px] rounded-2xl border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                      <MatchCard
                        match={finalMatch}
                        winnerState={{ F_1: finalWinner }}
                      />
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {finalWinner ? (
                    <motion.div
                      key="winner-banner"
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="w-full flex flex-col items-center gap-4 mt-2"
                    >
                      <div className="relative w-full group mb-2">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-2xl blur-md opacity-45 animate-pulse" />
                        <div className="relative w-full py-5 px-4 bg-zinc-950/90 rounded-2xl border border-amber-500/30 flex flex-col items-center text-center overflow-hidden">
                          <img
                            src={logoWorldCupImg}
                            alt=""
                            className="absolute inset-0 w-full h-full object-contain opacity-[0.05] pointer-events-none z-0 select-none scale-110"
                          />
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-44 h-28 opacity-30 blur-[1px] pointer-events-none select-none z-0">
                              <FlagIcon teamName={finalWinner} className="w-full h-full object-cover rounded-xl border border-white/5 shadow-2xl" />
                            </div>
                            <img src={pialaImg} alt="Piala World Cup" className="relative z-10 w-36 h-36 object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-bounce" style={{ animationDuration: '3s' }} />
                            <h2 className="relative z-10 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 truncate max-w-full mt-[-10px]">
                              {finalWinner}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      className="flex flex-col items-center justify-center py-6 select-none pointer-events-none"
                    >
                      <Trophy className="w-24 h-24 text-zinc-700 stroke-[1]" />
                      <span className="text-[10px] uppercase tracking-widest text-zinc-650 font-black mt-2">Juara Dunia</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Bracket */}
              <BracketColumn title="Semifinal" matches={[sf.right]} winnerState={semiWinners} type="sf" />
              <BracketColumn title="Perempat Final" matches={qf.right} winnerState={quarterWinners} type="qf" />
              <BracketColumn title="Babak 16 Besar" matches={r16.right} winnerState={roundOf16Winners} type="r16" />
              <BracketColumn title="Babak 32 Besar" titleColor="text-blue-400" matches={r32.right} winnerState={roundOf32Winners} type="r32" />

            </div>
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default CupResultPage;
