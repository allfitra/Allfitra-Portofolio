import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, RotateCcw, Star, Swords, Save, Send, Loader2, X, AlertTriangle, Lock, Download, Share2, Search, ArrowLeft, HelpCircle, FileText, ExternalLink, Edit } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useSearchParams, Link } from 'react-router-dom';
import DownloadTemplate from './DownloadTemplate';
import RulesModal from './RulesModal';
import DownloadPreviewModal from './DownloadPreviewModal';
import Footer from './Footer';
import pialaImg from '../../../assets/images/ImagesWorldCup/piala.png';
import logoWorldCupImg from '../../../assets/images/ImagesWorldCup/logo-world-cup.png';
import FlagIcon from './FlagIcon';
import { db } from '../../../database/firebase';
import { collection, addDoc, getDocs, doc, getDoc, onSnapshot, setDoc, query, where } from 'firebase/firestore';

const STORAGE_KEY = 'worldcup_2026_bracket_v4';
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

// Bracket slot definitions for 3rd-place teams (FIFA 2026 format)
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

/** Backtracking algorithm: assigns each 3rd-place qualifying group to exactly one bracket slot */
const assignThirdPlaceTeams = (groupAdvancers) => {
  const qualifiedThirds = {};
  WORLD_CUP_GROUPS.forEach(g => {
    const sel = groupAdvancers[g.id];
    if (sel && sel.length === 3) qualifiedThirds[g.id] = sel[2];
  });

  const qualifiedGroupIds = Object.keys(qualifiedThirds);
  const assignment = {}; // slotKey -> groupId
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

const getInitials = (name) =>
  name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

const getBadgeColor = (name) => {
  const hash = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const colors = [
    'from-red-500 to-orange-600', 'from-blue-500 to-indigo-600',
    'from-green-500 to-emerald-600', 'from-yellow-500 to-amber-600',
    'from-purple-500 to-pink-600', 'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
  ];
  return colors[hash % colors.length];
};


const MAX_POSSIBLE_SCORE = 176;

const calculateGroupScore = (userPred, official) => {
  if (!official) return 0;
  let score = 0;
  if (userPred.groupStage && official.groupAdvancers) {
    userPred.groupStage.forEach(g => {
      const groupId = g.group;
      const userSelected = g.selected || [];
      const officialSelected = official.groupAdvancers[groupId] || [];
      userSelected.forEach((team, idx) => {
        if (officialSelected.includes(team)) {
          if (officialSelected[idx] === team) {
            score += 2; // Posisi & tim benar
          } else {
            score += 1; // Tim lolos tapi posisi salah
          }
        }
      });
    });
  }
  return score;
};

const calculateKnockoutScore = (userPred, official) => {
  if (!official) return 0;
  let score = 0;

  // 2. Round of 32 & 16 (3 points for each correct match winner)
  if (userPred.bracket && official.r32Winners) {
    const userR32 = userPred.bracket.roundOf32Winners || {};
    const officialR32 = official.r32Winners || {};
    Object.keys(officialR32).forEach(matchId => {
      if (officialR32[matchId] && userR32[matchId] === officialR32[matchId]) {
        score += 3;
      }
    });
  }
  if (userPred.bracket && official.r16Winners) {
    const userR16 = userPred.bracket.roundOf16Winners || {};
    const officialR16 = official.r16Winners || {};
    Object.keys(officialR16).forEach(matchId => {
      if (officialR16[matchId] && userR16[matchId] === officialR16[matchId]) {
        score += 3;
      }
    });
  }

  // 3. Quarters & Semis (5 points for each correct match winner)
  if (userPred.bracket && official.qfWinners) {
    const userQF = userPred.bracket.quarterWinners || {};
    const officialQF = official.qfWinners || {};
    Object.keys(officialQF).forEach(matchId => {
      if (officialQF[matchId] && userQF[matchId] === officialQF[matchId]) {
        score += 5;
      }
    });
  }
  if (userPred.bracket && official.sfWinners) {
    const userSF = userPred.bracket.semiWinners || {};
    const officialSF = official.sfWinners || {};
    Object.keys(officialSF).forEach(matchId => {
      if (officialSF[matchId] && userSF[matchId] === officialSF[matchId]) {
        score += 5;
      }
    });
  }

  // 4. Champion (10 points)
  if (userPred.bracket && official.champion) {
    const userChampion = userPred.bracket.champion;
    if (official.champion && userChampion === official.champion) {
      score += 10;
    }
  }

  return score;
};

const calculateScore = (userPred, official) => {
  return calculateGroupScore(userPred, official) + calculateKnockoutScore(userPred, official);
};

const encodeState = (state, username) => {
  try {
    const payload = {
      g: state.groupAdvancers,
      r32: state.roundOf32Winners,
      r16: state.roundOf16Winners,
      qf: state.quarterWinners,
      sf: state.semiWinners,
      fw: state.finalWinner,
      u: username
    };
    const jsonStr = JSON.stringify(payload);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binString = "";
    for (let i = 0; i < utf8Bytes.length; i++) {
      binString += String.fromCharCode(utf8Bytes[i]);
    }
    const base64 = btoa(binString);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error("Failed to encode state:", e);
    return "";
  }
};

const decodeState = (encodedStr) => {
  try {
    let base64 = encodedStr.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const binString = atob(base64);
    const utf8Bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      utf8Bytes[i] = binString.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(utf8Bytes);
    const payload = JSON.parse(jsonStr);
    return {
      groupAdvancers: payload.g || {},
      roundOf32Winners: payload.r32 || {},
      roundOf16Winners: payload.r16 || {},
      quarterWinners: payload.qf || {},
      semiWinners: payload.sf || {},
      finalWinner: payload.fw || null,
      username: payload.u || ""
    };
  } catch (e) {
    console.error("Failed to decode state:", e);
    return null;
  }
};

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { }
  return null;
};

export const CupPage = () => {
  const saved = loadFromStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  const sharedKey = searchParams.get('p');

  const decodedState = useMemo(() => {
    if (!sharedKey) return null;
    return decodeState(sharedKey);
  }, [sharedKey]);

  const isSharedView = !!decodedState;

  const [groupAdvancers, setGroupAdvancers] = useState(() => decodedState?.groupAdvancers ?? saved?.groupAdvancers ?? {});
  const [roundOf32Winners, setRoundOf32Winners] = useState(() => decodedState?.roundOf32Winners ?? saved?.roundOf32Winners ?? {});
  const [roundOf16Winners, setRoundOf16Winners] = useState(() => decodedState?.roundOf16Winners ?? saved?.roundOf16Winners ?? {});
  const [quarterWinners, setQuarterWinners] = useState(() => decodedState?.quarterWinners ?? saved?.quarterWinners ?? {});
  const [semiWinners, setSemiWinners] = useState(() => decodedState?.semiWinners ?? saved?.semiWinners ?? {});
  const [finalWinner, setFinalWinner] = useState(() => decodedState?.finalWinner ?? saved?.finalWinner ?? null);
  const [savedAt, setSavedAt] = useState(saved?.savedAt ?? null);
  const [activeGroupTab, setActiveGroupTab] = useState('A-F');
  const [saveFlash, setSaveFlash] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [inputName, setInputName] = useState(() => decodedState?.username || localStorage.getItem('worldcup_username') || '');
  const [inputContact, setInputContact] = useState(() => localStorage.getItem('worldcup_contact') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(() => localStorage.getItem('worldcup_submitted') === 'true');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState('all'); // 'all' | 'group'
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // 'new' | 'existing_mine' | 'existing_others' | null
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const checkUsernameAvailability = useCallback(async (name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setUsernameStatus(null);
      return;
    }
    setIsCheckingUsername(true);
    try {
      const localUsername = localStorage.getItem('worldcup_username') || '';
      const localDocId = localStorage.getItem('worldcup_doc_id');

      const q = query(collection(db, "worldCup"), where("username", "==", trimmed));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setUsernameStatus('new');
      } else {
        const docs = querySnapshot.docs;
        const hasMatchedLocalDocId = docs.some(d => d.id === localDocId);

        if (hasMatchedLocalDocId || (localUsername && localUsername.toLowerCase() === trimmed.toLowerCase())) {
          setUsernameStatus('existing_mine');
          // Use existing matched doc ID if possible, otherwise use the first one (most recent)
          const activeDoc = docs.find(d => d.id === localDocId) || docs[0];
          localStorage.setItem('worldcup_doc_id', activeDoc.id);
        } else {
          setUsernameStatus('existing_others');
        }
      }
    } catch (err) {
      console.error("Error checking username availability:", err);
    } finally {
      setIsCheckingUsername(false);
    }
  }, []);

  useEffect(() => {
    if (!isSaveModalOpen) {
      setUsernameStatus(null);
      return;
    }
    const timer = setTimeout(() => {
      checkUsernameAvailability(inputName);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputName, isSaveModalOpen, checkUsernameAvailability]);

  // Real-time leaderboard states
  const [officialResult, setOfficialResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingUser, setViewingUser] = useState(null);
  const [leaderboardTab, setLeaderboardTab] = useState('overall'); // 'overall' | 'group' | 'knockout'

  const activePred = useMemo(() => {
    if (viewingUser) {
      return viewingUser.predictionData;
    }
    if (isSharedView) {
      const groupStage = Object.keys(decodedState?.groupAdvancers || {}).map(gId => ({
        group: gId,
        selected: decodedState.groupAdvancers[gId] || []
      }));
      return {
        groupStage,
        bracket: {
          roundOf32Winners: decodedState?.roundOf32Winners || {},
          roundOf16Winners: decodedState?.roundOf16Winners || {},
          quarterWinners: decodedState?.quarterWinners || {},
          semiWinners: decodedState?.semiWinners || {},
          champion: decodedState?.finalWinner || null
        }
      };
    }
    const groupStage = Object.keys(groupAdvancers).map(gId => ({
      group: gId,
      selected: groupAdvancers[gId] || []
    }));
    return {
      groupStage,
      bracket: {
        roundOf32Winners,
        roundOf16Winners,
        quarterWinners,
        semiWinners,
        champion: finalWinner
      }
    };
  }, [viewingUser, isSharedView, decodedState, groupAdvancers, roundOf32Winners, roundOf16Winners, quarterWinners, semiWinners, finalWinner]);

  const displayGroupScore = useMemo(() => {
    return calculateGroupScore(activePred, officialResult);
  }, [activePred, officialResult]);

  const displayKnockoutScore = useMemo(() => {
    return calculateKnockoutScore(activePred, officialResult);
  }, [activePred, officialResult]);

  const displayOverallScore = useMemo(() => {
    return displayGroupScore + displayKnockoutScore;
  }, [displayGroupScore, displayKnockoutScore]);

  const handleSelectLeaderboardUser = (user) => {
    if (!user.predictionData) return;
    const pred = user.predictionData;
    const groupAdv = {};
    if (pred.groupStage) {
      pred.groupStage.forEach(g => {
        groupAdv[g.group] = g.selected || [];
      });
    }
    setGroupAdvancers(groupAdv);
    setRoundOf32Winners(pred.bracket?.roundOf32Winners || {});
    setRoundOf16Winners(pred.bracket?.roundOf16Winners || {});
    setQuarterWinners(pred.bracket?.quarterWinners || {});
    setSemiWinners(pred.bracket?.semiWinners || {});
    setFinalWinner(pred.bracket?.champion || null);
    setViewingUser(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMyPrediction = () => {
    setViewingUser(null);
    if (sharedKey) {
      setSearchParams({});
      return;
    }

    // If user has submitted, restore their own prediction from leaderboard
    if (hasSubmitted) {
      const myUsername = localStorage.getItem('worldcup_username') || inputName;
      const myEntry = leaderboard.find(u => u.name === myUsername);
      if (myEntry?.predictionData) {
        const pred = myEntry.predictionData;
        const groupAdv = {};
        if (pred.groupStage) {
          pred.groupStage.forEach(g => {
            groupAdv[g.group] = g.selected || [];
          });
        }
        setGroupAdvancers(groupAdv);
        setRoundOf32Winners(pred.bracket?.roundOf32Winners || {});
        setRoundOf16Winners(pred.bracket?.roundOf16Winners || {});
        setQuarterWinners(pred.bracket?.quarterWinners || {});
        setSemiWinners(pred.bracket?.semiWinners || {});
        setFinalWinner(pred.bracket?.champion || null);
        setInputName(myUsername);
        return;
      }
    }

    // Not submitted or own entry not found — clear everything
    localStorage.removeItem(STORAGE_KEY);
    setGroupAdvancers({});
    setRoundOf32Winners({});
    setRoundOf16Winners({});
    setQuarterWinners({});
    setSemiWinners({});
    setFinalWinner(null);
  };

  const templateRef = useRef(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [generatedShareUrl, setGeneratedShareUrl] = useState('');

  // Sync state if decoded state changes (e.g. user toggles back/forth or opens a new shared link)
  useEffect(() => {
    if (decodedState) {
      setGroupAdvancers(decodedState.groupAdvancers || {});
      setRoundOf32Winners(decodedState.roundOf32Winners || {});
      setRoundOf16Winners(decodedState.roundOf16Winners || {});
      setQuarterWinners(decodedState.quarterWinners || {});
      setSemiWinners(decodedState.semiWinners || {});
      setFinalWinner(decodedState.finalWinner || null);
      setInputName(decodedState.username || '');
    } else if (!viewingUser) {
      const savedState = loadFromStorage();
      setGroupAdvancers(savedState?.groupAdvancers ?? {});
      setRoundOf32Winners(savedState?.roundOf32Winners ?? {});
      setRoundOf16Winners(savedState?.roundOf16Winners ?? {});
      setQuarterWinners(savedState?.quarterWinners ?? {});
      setSemiWinners(savedState?.semiWinners ?? {});
      setFinalWinner(savedState?.finalWinner ?? null);
      setInputName(localStorage.getItem('worldcup_username') || '');
    }
  }, [decodedState, viewingUser]);

  // Load live leaderboard submissions
  const fetchLeaderboardSubmissions = useCallback(async (official) => {
    setIsLoadingLeaderboard(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'worldCup'));
      const list = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const gScore = calculateGroupScore(data, official);
        const kScore = calculateKnockoutScore(data, official);
        const oScore = gScore + kScore;
        list.push({
          id: doc.id,
          name: data.username || 'Anonymous',
          groupScore: gScore,
          knockoutScore: kScore,
          score: oScore,
          accuracy: Math.round((oScore / MAX_POSSIBLE_SCORE) * 100),
          groupAccuracy: Math.round((gScore / 64) * 100),
          knockoutAccuracy: Math.round((kScore / 112) * 100),
          createdAt: data.savedAt || '',
          predictionData: data,
        });
      });

      list.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
      setLeaderboard(list);
    } catch (error) {
      console.error("Error fetching leaderboard submissions:", error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  // Memoized and sorted leaderboard based on selected tab
  const sortedLeaderboard = useMemo(() => {
    const list = [...leaderboard];
    if (leaderboardTab === 'group') {
      return list.sort((a, b) => b.groupScore - a.groupScore || b.score - a.score || a.name.localeCompare(b.name));
    }
    if (leaderboardTab === 'knockout') {
      return list.sort((a, b) => b.knockoutScore - a.knockoutScore || b.score - a.score || a.name.localeCompare(b.name));
    }
    return list.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }, [leaderboard, leaderboardTab]);

  // Listen to official results and lock status in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'worldCupResult', 'official'), (snap) => {
      if (snap.exists()) {
        const officialData = snap.data();
        setOfficialResult(officialData);
        if (officialData.leaderboardOpened) {
          fetchLeaderboardSubmissions(officialData);
        } else {
          setLeaderboard([]);
        }
      }
    }, (error) => {
      console.error("Error listening to official result:", error);
    });

    return () => unsubscribe();
  }, [fetchLeaderboardSubmissions]);

  // Count groups with 3 selected teams
  const groupsWithThreeCount = useMemo(() =>
    Object.values(groupAdvancers).filter(t => t.length === 3).length,
    [groupAdvancers]);

  // Check overall completion
  const isComplete = useMemo(() => {
    const vals = Object.values(groupAdvancers);
    if (vals.length !== NUM_GROUPS) return false;
    return vals.filter(g => g.length === 3).length === MAX_GROUPS_WITH_THREE &&
      vals.filter(g => g.length === 2).length === NUM_GROUPS - MAX_GROUPS_WITH_THREE;
  }, [groupAdvancers]);

  // 3rd-place assignment (memoized, computed only when groupAdvancers changes)
  const thirdPlaceAssignment = useMemo(() => {
    if (!isComplete) return {};
    return assignThirdPlaceTeams(groupAdvancers);
  }, [groupAdvancers, isComplete]);

  // Helpers
  const g1 = (id) => groupAdvancers[id]?.[0] ?? null;
  const g2 = (id) => groupAdvancers[id]?.[1] ?? null;
  const g3 = (slot) => thirdPlaceAssignment[slot]?.team ?? null;

  // ── Bracket match generators ──────────────────────────────────────────────
  const getRoundOf32Matches = () => {
    if (!isComplete) return { left: [], right: [] };
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

  // ── Group selection ───────────────────────────────────────────────────────
  const handleTeamClick = (groupId, team) => {
    if (hasSubmitted || isSharedView || viewingUser || officialResult?.submissionsLocked) return;
    const current = groupAdvancers[groupId] || [];
    const currentGroupsWithThree = Object.values(groupAdvancers).filter(t => t.length === 3).length;

    let isChanged = false;
    if (current.includes(team)) {
      isChanged = true;
    } else if (current.length < 2) {
      isChanged = true;
    } else if (current.length === 2 && currentGroupsWithThree < MAX_GROUPS_WITH_THREE) {
      isChanged = true;
    }

    if (isChanged) {
      setGroupAdvancers((prev) => {
        const curr = prev[groupId] || [];
        if (curr.includes(team)) {
          return { ...prev, [groupId]: curr.filter(t => t !== team) };
        }
        if (curr.length < 2) return { ...prev, [groupId]: [...curr, team] };
        if (curr.length === 2 && currentGroupsWithThree < MAX_GROUPS_WITH_THREE)
          return { ...prev, [groupId]: [...curr, team] };
        return prev;
      });

      // Reset all bracket winners when group stage changes
      setRoundOf32Winners({});
      setRoundOf16Winners({});
      setQuarterWinners({});
      setSemiWinners({});
      setFinalWinner(null);
    }
  };

  // ── Persistence ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isSharedView) return; // Do not overwrite personal prediction with shared view
    const ts = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      groupAdvancers, roundOf32Winners, roundOf16Winners,
      quarterWinners, semiWinners, finalWinner, savedAt: ts,
    }));
    setSavedAt(ts);
  }, [groupAdvancers, roundOf32Winners, roundOf16Winners, quarterWinners, semiWinners, finalWinner, isSharedView]);

  // ── Build JSON ────────────────────────────────────────────────────────────
  const buildPredictionJSON = () => ({
    savedAt: new Date().toISOString(),
    groupStage: WORLD_CUP_GROUPS.map(g => ({
      group: g.id, selected: groupAdvancers[g.id] ?? [],
      rank1: groupAdvancers[g.id]?.[0] ?? null,
      rank2: groupAdvancers[g.id]?.[1] ?? null,
      rank3: groupAdvancers[g.id]?.[2] ?? null,
    })),
    thirdPlaceAssignment: Object.fromEntries(
      Object.entries(thirdPlaceAssignment).map(([k, v]) => [k, v?.team ?? null])
    ),
    bracket: { roundOf32Winners, roundOf16Winners, quarterWinners, semiWinners, champion: finalWinner },
  });

  // ── Firebase Integration / Saving ─────────────────────────────────────────
  const handleSaveToFirebase = () => {
    if (hasSubmitted || isSharedView) return;
    setIsSaveModalOpen(true);
    setSaveStatus(null);
    setErrorMsg('');
  };

  const submitPredictionToFirebase = async () => {
    if (hasSubmitted || isSharedView) {
      setErrorMsg('Anda sudah mengirimkan hasil prediksi atau sedang melihat link share.');
      return;
    }
    if (!inputName.trim()) {
      setErrorMsg('Nama tidak boleh kosong');
      return;
    }

    // Schema Validation: Ensure group predictions are complete
    if (!isComplete) {
      setErrorMsg('Harap lengkapi semua prediksi Fase Grup (pilih tim lolos).');
      return;
    }

    // Schema Validation: Ensure all 31 matches have winners selected
    const r32Matches = getRoundOf32Matches();
    const r16Matches = getRoundOf16Matches();
    const qfMatches = getQuarterMatches();
    const sfMatches = getSemiMatches();

    const missing = [];
    r32Matches.left.concat(r32Matches.right).forEach(m => {
      if (!roundOf32Winners[m.id]) missing.push('Babak 32 Besar');
    });
    r16Matches.left.concat(r16Matches.right).forEach(m => {
      if (!roundOf16Winners[m.id]) missing.push('Babak 16 Besar');
    });
    qfMatches.left.concat(qfMatches.right).forEach(m => {
      if (!quarterWinners[m.id]) missing.push('Perempat Final');
    });
    if (!semiWinners[sfMatches.left.id] || !semiWinners[sfMatches.right.id]) {
      missing.push('Semi Final');
    }
    if (!finalWinner) {
      missing.push('Juara Dunia');
    }

    if (missing.length > 0) {
      setErrorMsg(`Harap lengkapi semua pertandingan bagan gugur (${[...new Set(missing)].join(', ')}).`);
      return;
    }

    if (usernameStatus === 'existing_others') {
      setErrorMsg('Username sudah digunakan oleh peserta lain. Harap gunakan nama lain.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    try {
      localStorage.setItem('worldcup_username', inputName.trim());
      localStorage.setItem('worldcup_contact', inputContact.trim());

      const predictionData = {
        ...buildPredictionJSON(),
        username: inputName.trim(),
        contact: inputContact.trim() || '',
      };

      let existingDocId = localStorage.getItem('worldcup_doc_id');

      // Fallback: If no doc ID in localStorage, but username matches previous local submission, query Firestore to prevent duplicate names
      if (!existingDocId && localStorage.getItem('worldcup_username') === inputName.trim()) {
        try {
          const q = query(collection(db, "worldCup"), where("username", "==", inputName.trim()));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docs = querySnapshot.docs;
            // Sort to find the most recent prediction document in case there are duplicates already
            docs.sort((a, b) => new Date(b.data().savedAt || 0) - new Date(a.data().savedAt || 0));
            existingDocId = docs[0].id;
            localStorage.setItem('worldcup_doc_id', existingDocId);
          }
        } catch (e) {
          console.error("Gagal melakukan pencarian nama duplikat:", e);
        }
      }

      if (existingDocId) {
        await setDoc(doc(db, "worldCup", existingDocId), predictionData);
        console.log("Document updated with ID: ", existingDocId);
      } else {
        const docRef = await addDoc(collection(db, "worldCup"), predictionData);
        console.log("Document written with ID: ", docRef.id);
        localStorage.setItem('worldcup_doc_id', docRef.id);
      }

      localStorage.setItem('worldcup_submitted', 'true');
      setHasSubmitted(true);

      setSaveStatus('success');
      flashSave();
      if (officialResult?.leaderboardOpened) {
        fetchLeaderboardSubmissions(officialResult); // Reload live leaderboard
      }

      setTimeout(() => {
        setIsSaveModalOpen(false);
        setSaveStatus(null);
        // Buka modal preview download langsung
        handleDownloadBracket();
      }, 2000);
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      setSaveStatus('error');
      setErrorMsg(error.message || 'Gagal menyimpan prediksi. Coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetPrediction = () => {
    if (hasSubmitted || isSharedView || viewingUser || officialResult?.submissionsLocked) return;
    setGroupAdvancers({}); setRoundOf32Winners({}); setRoundOf16Winners({});
    setQuarterWinners({}); setSemiWinners({}); setFinalWinner(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleDownloadBracket = async () => {
    if (!templateRef.current) return;

    setPreviewImageUrl('');
    setIsPreviewOpen(true);
    setIsDownloading(true);
    setDownloadType('all'); // Reset back to default 'all' when opening

    setTimeout(async () => {
      try {
        const stateToShare = {
          groupAdvancers,
          roundOf32Winners,
          roundOf16Winners,
          quarterWinners,
          semiWinners,
          finalWinner
        };
        const code = encodeState(stateToShare, inputName);
        const shareUrl = `${window.location.origin}${window.location.pathname}?p=${code}`;
        setGeneratedShareUrl(shareUrl);

        const dataUrl = await toPng(templateRef.current, {
          quality: 0.95,
          backgroundColor: '#07070a',
          style: {
            transform: 'scale(1)',
          }
        });

        setPreviewImageUrl(dataUrl);
      } catch (error) {
        console.error('Gagal membuat gambar prediksi:', error);
        setIsPreviewOpen(false);
        alert('Gagal membuat preview gambar.');
      } finally {
        setIsDownloading(false);
      }
    }, 150);
  };

  const handleDownloadTypeChange = async (type) => {
    setDownloadType(type);
    setPreviewImageUrl('');
    setIsGeneratingPreview(true);

    setTimeout(async () => {
      try {
        const dataUrl = await toPng(templateRef.current, {
          quality: 0.95,
          backgroundColor: '#07070a',
          style: {
            transform: 'scale(1)',
          }
        });
        setPreviewImageUrl(dataUrl);
      } catch (error) {
        console.error('Gagal memperbarui preview gambar:', error);
      } finally {
        setIsGeneratingPreview(false);
      }
    }, 200);
  };

  const triggerActualDownload = () => {
    if (!previewImageUrl) return;
    const a = document.createElement('a');
    a.href = previewImageUrl;
    a.download = `WorldCup2026_Predictions_${downloadType === 'group' ? 'FaseGrup' : ''}_${inputName || 'User'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareLink = () => {
    try {
      const stateToShare = {
        groupAdvancers,
        roundOf32Winners,
        roundOf16Winners,
        quarterWinners,
        semiWinners,
        finalWinner
      };
      const code = encodeState(stateToShare, inputName);
      const url = `${window.location.origin}${window.location.pathname}?p=${code}`;
      navigator.clipboard.writeText(url);
      alert('Link prediksi Anda berhasil disalin ke clipboard!');
    } catch (err) {
      console.error("Gagal menyalin link:", err);
      alert('Gagal menyalin link share.');
    }
  };

  const flashSave = () => { setSaveFlash(true); setTimeout(() => setSaveFlash(false), 2000); };

  const getFilteredGroups = () => {
    if (activeGroupTab === 'A-F') return WORLD_CUP_GROUPS.slice(0, 6);
    return WORLD_CUP_GROUPS.slice(6, 12);
  };

  // ── Sub-components ────────────────────────────────────────────────────────
  const MatchCard = ({ match, winnerState, setWinnerState }) => {
    if (!match) return null;
    const isT1 = winnerState[match.id] === match.t1;
    const isT2 = winnerState[match.id] === match.t2;
    const TeamBtn = ({ team, isWinner, onClick }) => {
      const isClickable = team && !hasSubmitted && !isSharedView && !viewingUser && !officialResult?.submissionsLocked;
      let btnStyle = "";
      if (isWinner) {
        btnStyle = "bg-blue-600 text-white shadow-md shadow-blue-700/30 cursor-default";
      } else if (!team) {
        btnStyle = "bg-zinc-950 text-zinc-700 cursor-default";
      } else if (hasSubmitted || isSharedView) {
        btnStyle = "bg-zinc-900/40 text-zinc-500 border border-zinc-900/60 cursor-not-allowed";
      } else {
        btnStyle = "bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 cursor-pointer";
      }
      return (
        <div
          onClick={isClickable ? onClick : undefined}
          className={`flex items-center gap-2 w-full px-2.5 py-2 rounded-lg transition-all text-left select-none ${btnStyle}`}
        >
          <FlagIcon teamName={team} />
          <span className="text-[11px] font-semibold truncate">{team || 'TBD'}</span>
          {isWinner && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 ml-auto" />}
        </div>
      );
    };
    return (
      <div data-match-id={match.id} className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-2.5 hover:border-blue-500/30 transition-all relative z-10">
        {match.desc && <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mb-1.5">{match.desc}</p>}
        <div className="flex flex-col gap-1">
          <TeamBtn team={match.t1} isWinner={isT1} onClick={() => setWinnerState(p => ({ ...p, [match.id]: match.t1 }))} />
          <TeamBtn team={match.t2} isWinner={isT2} onClick={() => setWinnerState(p => ({ ...p, [match.id]: match.t2 }))} />
        </div>
      </div>
    );
  };

  const BracketColumn = ({ title, titleColor = 'text-zinc-400', matches, winnerState, setWinnerState, type }) => (
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
          <MatchCard key={m.id} match={m} winnerState={winnerState} setWinnerState={setWinnerState} />
        ))}
      </div>
    </div>
  );

  // ── Derived bracket data ──────────────────────────────────────────────────
  const r32 = getRoundOf32Matches();
  const r16 = getRoundOf16Matches();
  const qf = getQuarterMatches();
  const sf = getSemiMatches();
  const finalMatch = getFinalMatch();

  const r32Done = Object.keys(roundOf32Winners).length >= 16;
  const r16Done = Object.keys(roundOf16Winners).length >= 8;
  const qfDone = Object.keys(quarterWinners).length >= 4;
  const sfDone = semiWinners['SF_L'] && semiWinners['SF_R'];

  // SVG Bracket Connector Lines Calculation
  const [svgPaths, setSvgPaths] = useState([]);

  const updateSvgPaths = useCallback(() => {
    if (!isComplete) {
      setSvgPaths([]);
      return;
    }
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

      // The connector is active if the winner of the fromMatch is selected
      const isActive = fromWinnerVal !== undefined && fromWinnerVal !== null;

      const controlX = start.x + (end.x - start.x) / 2;
      const d = `M ${start.x} ${start.y} C ${controlX} ${start.y}, ${controlX} ${end.y}, ${end.x} ${end.y}`;
      paths.push({ d, isActive });
    };

    const r32Matches = getRoundOf32Matches();
    const r16Matches = getRoundOf16Matches();

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
  }, [isComplete, roundOf32Winners, roundOf16Winners, quarterWinners, semiWinners, finalWinner]);

  useEffect(() => {
    updateSvgPaths();
    window.addEventListener('resize', updateSvgPaths);
    const timer = setTimeout(updateSvgPaths, 300);
    return () => {
      window.removeEventListener('resize', updateSvgPaths);
      clearTimeout(timer);
    };
  }, [updateSvgPaths]);

  const topScrollRef = useRef(null);
  const bracketScrollRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

  const handleTopScroll = () => {
    if (topScrollRef.current && bracketScrollRef.current) {
      bracketScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  const handleBracketScroll = () => {
    if (topScrollRef.current && bracketScrollRef.current) {
      topScrollRef.current.scrollLeft = bracketScrollRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    if (!isComplete) return;
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
  }, [isComplete, roundOf32Winners, roundOf16Winners, quarterWinners, semiWinners, finalWinner]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 pb-4 relative overflow-hidden">
      {/* ── RUNNING TEXT MARQUEE ── */}
      <div className="w-full bg-[#0c0c14] border-b border-zinc-800/40 py-2.5 relative z-50 overflow-hidden flex select-none pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#07070a] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#07070a] to-transparent z-10" />

        <div className="animate-marquee flex shrink-0 justify-around min-w-full gap-8">
          <span className="text-[11px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400 uppercase">
            {officialResult?.submissionsLocked
              ? '🔒 PENGISIAN PREDIKSI TELAH DITUTUP! SELURUH BRACKET TELAH DIKUNCI UNTUK PENILAIAN POIN LEADERBOARD. SELAMAT BERTANDING!'
              : '🏆 PENGISIAN PREDIKSI AKAN DITUTUP PADA 17 JUNI 2026! SEGERA LENGKAPI DAN SUBMIT PREDIKSI TERBAIKMU SEBELUM BATAS WAKTU!'}
          </span>
          <span className="text-[11px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400 uppercase">
            {officialResult?.submissionsLocked
              ? '🔒 PENGISIAN PREDIKSI TELAH DITUTUP! SELURUH BRACKET TELAH DIKUNCI UNTUK PENILAIAN POIN LEADERBOARD. SELAMAT BERTANDING!'
              : '🏆 PENGISIAN PREDIKSI AKAN DITUTUP PADA 17 JUNI 2026! SEGERA LENGKAPI DAN SUBMIT PREDIKSI TERBAIKMU SEBELUM BATAS WAKTU!'}
          </span>
        </div>
        <div className="animate-marquee flex shrink-0 justify-around min-w-full gap-8" aria-hidden="true">
          <span className="text-[11px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400 uppercase">
            {officialResult?.submissionsLocked
              ? '🔒 PENGISIAN PREDIKSI TELAH DITUTUP! SELURUH BRACKET TELAH DIKUNCI UNTUK PENILAIAN POIN LEADERBOARD. SELAMAT BERTANDING!'
              : '🏆 PENGISIAN PREDIKSI AKAN DITUTUP PADA 17 JUNI 2026! SEGERA LENGKAPI DAN SUBMIT PREDIKSI TERBAIKMU SEBELUM BATAS WAKTU!'}
          </span>
          <span className="text-[11px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400 uppercase">
            {officialResult?.submissionsLocked
              ? '🔒 PENGISIAN PREDIKSI TELAH DITUTUP! SELURUH BRACKET TELAH DIKUNCI UNTUK PENILAIAN POIN LEADERBOARD. SELAMAT BERTANDING!'
              : '🏆 PENGISIAN PREDIKSI AKAN DITUTUP PADA 17 JUNI 2026! SEGERA LENGKAPI DAN SUBMIT PREDIKSI TERBAIKMU SEBELUM BATAS WAKTU!'}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
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
        .leaderboard-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .leaderboard-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .leaderboard-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
        }
        .leaderboard-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-700/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-700/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-20 pt-10 px-4 sm:px-6 lg:px-8">

        {/* ── SHARED VIEW TOP BANNER ── */}
        {(isSharedView || viewingUser) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-xs text-zinc-300">
                Melihat hasil prediksi dari: <strong className="text-white font-extrabold">{viewingUser ? viewingUser.name : (decodedState?.username || inputName || 'Guest')}</strong>
                {viewingUser && <span className="ml-2 text-amber-400 font-bold">({viewingUser.score} Pts)</span>}
              </span>
            </div>
            <button
              onClick={handleBackToMyPrediction}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali / buat Prediksi Saya
            </button>
          </motion.div>
        )}

        {/* ── HEADER & LEADERBOARD ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-zinc-800/50 pb-4"
        >
          {/* Logo di Kiri */}
          <div className="flex-shrink-0">
            <img src={logoWorldCupImg} alt="FIFA World Cup 2026 Logo" className="h-36 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.06)]" />
          </div>

          {/* Judul & Deskripsi di Tengah */}
          <div className="flex-grow text-center max-w-xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-emerald-600/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-[10px] font-semibold tracking-widest uppercase mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> FIFA World Cup 2026 Predictor
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 mb-3 leading-none">
              World Cup Predictor
            </h1>
            <p className="text-zinc-400 text-xs mb-2">
              Pilih tim yang lolos dari setiap grup (Rank 1, 2, dan Rank 3 (8 group)). Prediksi pemenang di setiap babak.
            </p>
            <p className="text-amber-400 text-[10px] font-semibold mb-4 italic">
              *Note: Akan ada pengisian prediksi khusus untuk babak knockout saja setelah fase grup selesai.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 predictor-actions">
              <AnimatePresence>
                {saveFlash && (
                  <motion.span initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="bg-green-500/15 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan!
                  </motion.span>
                )}
              </AnimatePresence>
              {savedAt && !isSharedView && (
                <span className="text-[11px] text-zinc-600 bg-zinc-900/50 border border-white/5 px-3 py-1.5 rounded-lg">
                  Autosave · {new Date(savedAt).toLocaleTimeString('id-ID')}
                </span>
              )}
              {!isSharedView && (
                <button
                  onClick={resetPrediction}
                  disabled={hasSubmitted || officialResult?.submissionsLocked || viewingUser}
                  className={`border border-white/5 text-zinc-400 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${hasSubmitted || officialResult?.submissionsLocked ? 'bg-zinc-950/20 text-zinc-500 cursor-not-allowed opacity-50' : 'bg-zinc-900/60 hover:bg-zinc-800'}`}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
              {isComplete && (
                <button
                  onClick={handleDownloadBracket}
                  disabled={isDownloading}
                  className="bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  {isDownloading ? 'Mengunduh...' : 'Unduh Hasil'}
                </button>
              )}
              {isComplete && (
                <button
                  onClick={handleShareLink}
                  className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Bagikan Link
                </button>
              )}
              {!isSharedView && (
                officialResult?.submissionsLocked ? (
                  <button disabled className="bg-zinc-900/40 border border-white/5 text-zinc-500 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5 text-zinc-500" /> Pengisian Ditutup
                  </button>
                ) : hasSubmitted ? (
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 select-none shadow-md shadow-emerald-950/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Terkirim: {inputName}
                    </div>
                    {!viewingUser && (
                      <button
                        onClick={() => setHasSubmitted(false)}
                        className="bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/25 text-blue-400 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-950/10 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-400" /> Ubah Prediksi
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {!viewingUser && (
                      <button onClick={handleSaveToFirebase} className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
                        <Save className="w-3.5 h-3.5" /> Simpan Hasil
                      </button>
                    )}
                  </>
                )
              )}
            </div>
          </div>

          {/* Leaderboard di Kanan */}
          {!officialResult?.submissionsLocked ? (
            <div className="flex-shrink-0 w-64 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 shadow-xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-900">
                <h3 className="text-xs font-extrabold text-amber-400 tracking-wider flex items-center gap-1.5 uppercase">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" /> Leaderboard
                </h3>
                <span className="text-[9px] font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-white/5">Live</span>
              </div>

              {officialResult?.leaderboardOpened ? (
                // Live Leaderboard view
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Cari nama..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-8 pr-2.5 py-1.5 text-[11px] text-white placeholder-zinc-650 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {/* Leaderboard Tab Selector */}
                  <div className="flex bg-zinc-900/80 border border-white/5 rounded-xl p-0.5 gap-0.5 text-[9px] font-bold">
                    <button
                      onClick={() => setLeaderboardTab('overall')}
                      className={`flex-1 py-1 rounded-lg transition-all ${leaderboardTab === 'overall' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'}`}
                    >
                      Overall
                    </button>
                    <button
                      onClick={() => setLeaderboardTab('group')}
                      className={`flex-1 py-1 rounded-lg transition-all ${leaderboardTab === 'group' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'}`}
                    >
                      Grup
                    </button>
                    <button
                      onClick={() => setLeaderboardTab('knockout')}
                      className={`flex-1 py-1 rounded-lg transition-all ${leaderboardTab === 'knockout' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'}`}
                    >
                      Knockout
                    </button>
                  </div>

                  {isLoadingLeaderboard ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                      <span className="text-[10px] text-zinc-500">Loading data...</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1.5 leaderboard-scroll">
                      {sortedLeaderboard
                        .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((user, idx) => {
                          const isUser = user.name === inputName;
                          const displayScore = leaderboardTab === 'group' ? user.groupScore : leaderboardTab === 'knockout' ? user.knockoutScore : user.score;
                          const displayAccuracy = leaderboardTab === 'group' ? user.groupAccuracy : leaderboardTab === 'knockout' ? user.knockoutAccuracy : user.accuracy;
                          return (
                            <div
                              key={user.id || idx}
                              onClick={() => handleSelectLeaderboardUser(user)}
                              className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer hover:bg-white/5 active:scale-[0.98] ${idx === 0
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                : idx === 1
                                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                                  : idx === 2
                                    ? 'bg-orange-950/10 border-orange-900/20 text-orange-300'
                                    : isUser
                                      ? 'bg-blue-950/25 border-blue-500/20 text-blue-300'
                                      : 'bg-zinc-950/40 border-white/5 text-zinc-400'
                                }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="w-4 h-4 rounded bg-zinc-950 flex items-center justify-center text-[9px] font-black border border-white/5 text-zinc-500">
                                  {idx + 1}
                                </span>
                                <span className="truncate">{user.name}</span>
                              </div>
                              <span className="font-mono font-bold text-right shrink-0">
                                {displayScore} Pts <span className="text-[8px] text-zinc-500">({displayAccuracy}%)</span>
                              </span>
                            </div>
                          );
                        })}
                      {sortedLeaderboard.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="text-center py-6 text-[10px] text-zinc-650 italic">
                          Tidak ada hasil
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                // Locked Leaderboard view
                <div className="relative">
                  {/* Leaderboard items (blurred) */}
                  <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1.5 leaderboard-scroll blur-sm opacity-20 select-none pointer-events-none">
                    {[
                      { rank: 1, name: 'Alfitra (You)', score: '94%', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-300' },
                      { rank: 2, name: 'Budi Hartono', score: '88%', bg: 'bg-zinc-900/60 border-zinc-800 text-zinc-300' },
                      { rank: 3, name: 'Rian Hidayat', score: '81%', bg: 'bg-orange-950/10 border-orange-900/20 text-orange-300' },
                      { rank: 4, name: 'Candra Wijaya', score: '76%', bg: 'bg-zinc-950/40 border-white/5 text-zinc-400' },
                      { rank: 5, name: 'Dewi Lestari', score: '72%', bg: 'bg-zinc-950/40 border-white/5 text-zinc-400' },
                    ].map((user) => (
                      <div key={user.rank} className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${user.bg}`}>
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-4 h-4 rounded bg-zinc-950 flex items-center justify-center text-[9px] font-black border border-white/5 text-zinc-500">
                            {user.rank}
                          </span>
                          <span className="truncate">{user.name}</span>
                        </div>
                        <span className="font-mono font-bold">{user.score}</span>
                      </div>
                    ))}
                  </div>

                  {/* Locked Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 bg-zinc-950/20 backdrop-blur-[1.5px] rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 shadow-lg shadow-amber-500/5 animate-pulse">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-[11px] font-black text-white tracking-wide uppercase">Leaderboard Terkunci</h4>
                    <p className="text-[9px] text-zinc-400 mt-1 max-w-[180px] leading-relaxed">
                      Akan dibuka setelah tanggal 17 Juni 2026
                    </p>
                    {/* <p className="text-[8px] text-amber-400/80 mt-1.5 max-w-[160px] leading-normal italic">
                      (Akan ada pengisian prediksi khusus babak Knockout saja)
                    </p> */}
                  </div>
                </div>
              )}
              <p className="text-[9px] text-zinc-600 mt-3 text-center mb-2">
                * Skor terupdate berdasarkan tingkat keakuratan prediksi Anda.
              </p>
              <button
                onClick={() => setIsRulesOpen(true)}
                className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-extrabold py-2 px-3 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Rules Perhitungan Poin
              </button>
            </div>
          ) : <div></div>}
        </motion.div>


        <div className="relative">
          <div className={officialResult?.submissionsLocked && !isSharedView && !viewingUser ? 'blur-md pointer-events-none select-none h-[650px] overflow-hidden' : ''}>
            {/* ── STEP 1: GROUP SELECTION ── */}
            <div className="mb-10 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 border-b border-zinc-800 pb-5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/25">1</span>
                  <div>
                    <h2 className="text-base font-bold text-white mt-1">Pilih Tim Lolos</h2>
                    <p className="text-[11px] text-zinc-500">Klik sesuai urutan rank. Kuota Rank 3:
                      <span className={`font-bold ml-1 ${groupsWithThreeCount >= MAX_GROUPS_WITH_THREE ? 'text-amber-400' : 'text-blue-400'}`}>
                        {groupsWithThreeCount}/{MAX_GROUPS_WITH_THREE} grup
                      </span>
                    </p>
                  </div>
                </div>
                <Link
                  to="/world-cup-table"
                  className="mt-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/5"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Lihat Bracket Sementara
                </Link>
                <div className="flex mt-2 bg-zinc-900/80 p-1 rounded-lg border border-white/5 self-start sm:self-center">
                  {['A-F', 'G-L'].map(tab => (
                    <button key={tab} onClick={() => setActiveGroupTab(tab)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wider transition-all ${activeGroupTab === tab ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
                      Grup {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {getFilteredGroups().map(group => {
                  const sel = groupAdvancers[group.id] || [];
                  const isFull = sel.length >= 3;
                  const canAddThird = sel.length === 2 && groupsWithThreeCount < MAX_GROUPS_WITH_THREE;
                  return (
                    <div key={group.id} className="bg-zinc-950/50 border border-white/5 rounded-2xl p-5 shadow-md">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
                        <h3 className="text-sm font-extrabold text-blue-400 tracking-wider">GRUP {group.id}</h3>
                        <div className="text-[9px] font-bold text-right">
                          {sel.length === 0 && <span className="text-zinc-600">Pilih Rank 1 & 2</span>}
                          {sel.length === 1 && <span className="text-blue-500">Pilih Rank 2</span>}
                          {sel.length === 2 && canAddThird && <span className="text-amber-400 animate-pulse">Optional: Rank 3</span>}
                          {sel.length === 2 && !canAddThird && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Selesai</span>}
                          {sel.length === 3 && <span className="text-amber-400 flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" />3 Lolos</span>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          // Selected teams first, in rank order
                          ...sel.map(team => ({ team, rank: sel.indexOf(team) + 1, isSelected: true })),
                          // Unselected teams below
                          ...group.teams
                            .filter(t => !sel.includes(t))
                            .map(t => ({ team: t, rank: null, isSelected: false })),
                        ].map(({ team, rank, isSelected }) => {
                          const isDisabled = hasSubmitted || (!isSelected && (isFull || (sel.length === 2 && !canAddThird)));
                          return (
                            <motion.button
                              key={team}
                              layout
                              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                              onClick={() => handleTeamClick(group.id, team)}
                              disabled={isDisabled}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors duration-200 ${isSelected
                                ? rank === 1 ? 'bg-gradient-to-r from-blue-950/30 to-zinc-950 border-blue-500/30 text-white'
                                  : rank === 2 ? 'bg-gradient-to-r from-emerald-950/20 to-zinc-950 border-emerald-500/30 text-white'
                                    : 'bg-gradient-to-r from-amber-950/20 to-zinc-950 border-amber-500/30 text-amber-200'
                                : isDisabled ? 'bg-black/10 border-white/5 text-zinc-700 cursor-not-allowed opacity-40'
                                  : 'bg-zinc-950/40 border-white/5 text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
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
                                  Rank {rank}
                                </span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {isComplete && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mt-5 flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Semua grup selesai! 32 tim siap berlomba di babak gugur. ↓
                </motion.div>
              )}
            </div>

            {/* ── STEP 2: BRACKET ── */}
            <AnimatePresence>
              {isComplete && !(officialResult?.submissionsLocked && !isSharedView && !viewingUser) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
                    <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/25">2</span>
                    <div>
                      <h2 className="text-base font-bold text-white">Bagan Gugur — 32 Tim</h2>
                      <p className="text-[11px] text-zinc-500">Klik pemenang setiap laga untuk melaju ke babak berikutnya.</p>
                    </div>
                  </div>

                  {/* Dummy Top Scrollbar */}
                  <div
                    ref={topScrollRef}
                    onScroll={handleTopScroll}
                    className="overflow-x-auto w-full bracket-scroll mb-1"
                  >
                    <div style={{ width: `${contentWidth}px`, height: '1px' }} />
                  </div>

                  {/* ── UNIFIED HORIZONTAL BRACKET ── */}
                  <div
                    ref={bracketScrollRef}
                    onScroll={handleBracketScroll}
                    className="overflow-x-auto pt-4 pb-2 bracket-scroll"
                  >
                    <div className="flex gap-8 min-w-max px-4 py-6 items-start justify-start min-[1900px]:justify-center bracket-scroll-content relative">

                      {/* SVG Connector Lines */}
                      <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible w-full h-full">
                        {svgPaths.map((path, idx) => (
                          <path
                            key={idx}
                            d={path.d}
                            fill="none"
                            stroke={path.isActive ? '#3b82f6' : '#27272a'}
                            strokeWidth={path.isActive ? 2 : 1}
                            strokeOpacity={path.isActive ? 0.8 : 0.3}
                            style={path.isActive ? { filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.5))' } : {}}
                            strokeDasharray={path.isActive ? 'none' : '3 3'}
                          />
                        ))}
                      </svg>

                      {/* Left Bracket (Grup A-F) */}
                      <div className="flex gap-6 items-start">
                        <BracketColumn title="Babak 32 Besar" matches={r32.left} winnerState={roundOf32Winners} setWinnerState={setRoundOf32Winners} titleColor="text-blue-400" type="r32" />
                        <BracketColumn title="16 Besar" matches={r16.left} winnerState={roundOf16Winners} setWinnerState={setRoundOf16Winners} titleColor="text-blue-400" type="r16" />
                        <BracketColumn title="Perempat Final" matches={qf.left} winnerState={quarterWinners} setWinnerState={setQuarterWinners} titleColor="text-blue-400" type="qf" />
                        <BracketColumn title="Semi Final" matches={sf.left ? [sf.left] : []} winnerState={semiWinners} setWinnerState={setSemiWinners} titleColor="text-blue-400" type="sf" />
                      </div>

                      {/* Grand Final Centerpiece */}
                      <div className="flex-shrink-0 w-64 flex flex-col items-center px-4 self-start pt-[312px]">

                        <div className="flex items-center gap-2 mb-4 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                          <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
                          <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Grand Final</h3>
                          <Swords className="w-3.5 h-3.5 text-amber-400" />
                        </div>

                        <div className="w-full mb-6">
                          {finalMatch ? (
                            <div className="bg-gradient-to-b from-amber-500/20 to-zinc-950 p-[1px] rounded-2xl border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                              <MatchCard
                                match={finalMatch}
                                winnerState={{ F_1: finalWinner }}
                                setWinnerState={(val) => {
                                  const r = typeof val === 'function' ? val({ F_1: finalWinner }) : val;
                                  setFinalWinner(r.F_1);
                                }}
                              />
                            </div>
                          ) : null}
                        </div>

                        {/* Winner Banner below MatchCard */}
                        <AnimatePresence mode="wait">
                          {finalWinner ? (
                            <motion.div
                              key="winner-banner"
                              initial={{ opacity: 0, scale: 0.9, y: 15 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 15 }}
                              className="w-full flex flex-col items-center gap-4 mt-2"
                            >
                              <div className="relative w-full group mb-2">
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-2xl blur-md opacity-45 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
                                <div className="relative w-full py-5 px-4 bg-zinc-950/90 rounded-2xl border border-amber-500/30 flex flex-col items-center text-center overflow-hidden">
                                  {/* Background Logo Samar */}
                                  <img
                                    src={logoWorldCupImg}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-contain opacity-[0.05] pointer-events-none z-0 select-none scale-110"
                                  />
                                  <div className="relative z-10 flex flex-col items-center">
                                    {/* Winner flag backdrop behind piala */}
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
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center justify-center py-6 select-none pointer-events-none"
                            >
                              <Trophy className="w-24 h-24 text-zinc-700 stroke-[1]" />
                              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mt-2">Juara Dunia</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* ── ACTIONS ── */}
                        <AnimatePresence>
                          {finalWinner && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="w-full centerpiece-actions mt-2"
                            >
                              <div className="w-full flex flex-col gap-2">
                                {viewingUser ? (
                                  <button
                                    onClick={handleBackToMyPrediction}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Prediksi Saya
                                  </button>
                                ) : isSharedView ? (
                                  <button
                                    onClick={() => setSearchParams({})}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Buat Prediksi Saya Sendiri
                                  </button>
                                ) : hasSubmitted ? (
                                  <button
                                    disabled
                                    className="w-full bg-zinc-900 border border-white/5 text-zinc-500 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Prediksi Sudah Terkirim
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleSaveToFirebase}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-emerald-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <Send className="w-3.5 h-3.5" /> Submit Hasil Prediksi
                                  </button>
                                )}
                                {/* {isComplete && (
                              <button
                                onClick={handleShareLink}
                                className="w-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 font-extrabold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                              >
                                <Share2 className="w-3.5 h-3.5" /> Bagikan Hasil (Copy Link)
                              </button>
                            )} */}
                                <button
                                  onClick={handleDownloadBracket}
                                  disabled={isDownloading}
                                  className="w-full bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                >
                                  {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                                  {isDownloading ? 'Mengunduh...' : 'Unduh Hasil (Gambar)'}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Right Bracket (Grup G-L) */}
                      <div className="flex gap-6 items-start">
                        <BracketColumn title="Semi Final" matches={sf.right ? [sf.right] : []} winnerState={semiWinners} setWinnerState={setSemiWinners} titleColor="text-emerald-400" type="sf" />
                        <BracketColumn title="Perempat Final" matches={qf.right} winnerState={quarterWinners} setWinnerState={setQuarterWinners} titleColor="text-emerald-400" type="qf" />
                        <BracketColumn title="16 Besar" matches={r16.right} winnerState={roundOf16Winners} setWinnerState={setRoundOf16Winners} titleColor="text-emerald-400" type="r16" />
                        <BracketColumn title="Babak 32 Besar" matches={r32.right} winnerState={roundOf32Winners} setWinnerState={setRoundOf32Winners} titleColor="text-emerald-400" type="r32" />
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── JSON PREVIEW ──
        <AnimatePresence>
          {finalWinner && (
            <motion.details initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-10 bg-zinc-950/80 border border-white/5 rounded-2xl overflow-hidden">
              <summary className="flex items-center gap-2 px-6 py-4 cursor-pointer text-xs font-bold text-zinc-500 hover:text-white transition-colors select-none bg-zinc-900/20">
                <span className="text-blue-500 font-mono">JSON</span> Preview Data Hasil Prediksi
              </summary>
              <pre className="overflow-x-auto text-xs text-emerald-400 bg-black/40 px-6 py-4 leading-relaxed max-h-64 overflow-y-auto font-mono">
                {JSON.stringify(buildPredictionJSON(), null, 2)}
              </pre>
            </motion.details>
          )}
        </AnimatePresence> */}

            {/* ── MODAL KIRIM/SIMPAN KE FIREBASE ── */}
            <AnimatePresence>
              {isSaveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !isSaving && setIsSaveModalOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  />

                  {/* Modal Card */}
                  <motion.div
                    initial={{ scale: 0.95, y: 15, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 15, opacity: 0 }}
                    className="relative w-full max-w-md bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl overflow-hidden z-10"
                  >
                    {/* Decorative Blur BG */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Close Button */}
                    {!isSaving && (
                      <button
                        onClick={() => setIsSaveModalOpen(false)}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}

                    {saveStatus === 'success' ? (
                      // Success State
                      <div className="flex flex-col items-center text-center py-6">
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10"
                        >
                          <CheckCircle2 className="w-8 h-8" />
                        </motion.div>
                        <h3 className="text-lg font-bold text-white mb-2">Prediksi Berhasil Disimpan!</h3>
                        <p className="text-xs text-zinc-400 max-w-xs">
                          Terima kasih <strong>{inputName}</strong>! Prediksi Anda telah terkirim.
                        </p>
                      </div>
                    ) : (
                      // Input/Form and Error States
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">Simpan Prediksi Anda</h3>
                            <p className="text-[11px] text-zinc-500">
                              {finalWinner ? 'Kirim prediksi lengkap Anda ke Leaderboard' : 'Simpan progress prediksi Anda'}
                            </p>
                          </div>
                        </div>

                        {errorMsg && (
                          <div className="mb-4 flex items-start gap-2 bg-rose-500/15 border border-rose-500/30 text-rose-400 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 pl-1">
                              Nama / Username
                            </label>
                            <input
                              type="text"
                              value={inputName}
                              onChange={(e) => {
                                setInputName(e.target.value);
                                if (errorMsg) setErrorMsg('');
                              }}
                              placeholder="Masukkan nama Anda..."
                              maxLength={30}
                              disabled={isSaving}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                            />
                            {isCheckingUsername && (
                              <p className="text-[10px] text-zinc-500 mt-1.5 pl-1 flex items-center gap-1">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-450" /> Memeriksa ketersediaan nama...
                              </p>
                            )}
                            {!isCheckingUsername && usernameStatus === 'existing_mine' && (
                              <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-[10px] text-amber-400 font-medium leading-relaxed">
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>Username ini terdaftar sebagai milik Anda di perangkat ini. Mengirim ulang akan <strong>memperbarui/mengganti</strong> data prediksi Anda sebelumnya.</span>
                              </div>
                            )}
                            {!isCheckingUsername && usernameStatus === 'existing_others' && (
                              <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2 text-[10px] text-rose-400 font-medium leading-relaxed">
                                <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <span>Username ini sudah digunakan oleh peserta lain. Harap gunakan nama/username lain.</span>
                              </div>
                            )}
                            {!isCheckingUsername && usernameStatus === 'new' && inputName.trim() && (
                              <p className="text-[10px] text-emerald-400 mt-1.5 pl-1 flex items-center gap-1 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-450" /> Username tersedia!
                              </p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2 pl-1">
                              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                Kontak (No. WA / Akun Sosmed)
                              </label>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase italic">Opsional</span>
                            </div>
                            <input
                              type="text"
                              value={inputContact}
                              onChange={(e) => setInputContact(e.target.value)}
                              placeholder="Contoh: @username / 081234..."
                              maxLength={50}
                              disabled={isSaving}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                            />
                            <p className="text-[9px] text-zinc-500 mt-1.5 pl-1 italic">
                              *Hanya untuk dihubungi jika Anda menang. Tidak akan dipublikasikan.
                            </p>
                            <p className="text-[9px] text-zinc-500 mt-1.5 pl-1 italic">
                              (PS: Hadiah bisa ada dan tidak, tergantung mood admin. jangan berharap banyak!!)
                            </p>
                          </div>

                          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 text-[11px] text-zinc-400 space-y-1">
                            <div className="flex justify-between">
                              <span>Status Prediksi:</span>
                              <span className={finalWinner ? 'text-amber-400 font-bold' : 'text-blue-400 font-bold'}>
                                {finalWinner ? 'Complete' : 'Draft (Belum Lengkap)'}
                              </span>
                            </div>
                            {finalWinner && (
                              <div className="flex justify-between">
                                <span>Prediksi Juara:</span>
                                <span className="text-white font-extrabold">{finalWinner}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsSaveModalOpen(false)}
                              disabled={isSaving}
                              className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 font-bold py-3 rounded-xl text-xs transition-colors disabled:opacity-50"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={submitPredictionToFirebase}
                              disabled={isSaving || !inputName.trim() || !finalWinner || usernameStatus === 'existing_others' || isCheckingUsername}
                              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Menyimpan...
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  Kirim Prediksi
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            {/* ── TRANSPARENCY: 3RD PLACE QUALIFICATION ── */}
            {isComplete && !(officialResult?.submissionsLocked && !isSharedView && !viewingUser) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-900/40">
                  <h3 className="text-xs font-black text-blue-400 tracking-wider uppercase flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Skema Penentuan Peringkat 3 Terbaik
                  </h3>
                  <a
                    href="https://drive.google.com/file/d/1FdeTcKumM7h65ALOnY_K548WK2x3igXm/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-blue-400 font-extrabold px-3.5 py-1.5 rounded-xl text-[10px] transition-all self-start sm:self-auto"
                  >
                    <FileText className="w-3 h-3 text-blue-400" /> Lihat Format Resmi FIFA <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
                <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
                  Sesuai regulasi resmi FIFA 2026, 8 tim peringkat 3 terbaik dari 12 grup dialokasikan ke slot babak gugur (Babak 32 Besar) menggunakan algoritma pencocokan optimal. Berikut adalah alokasi otomatis untuk prediksi Anda:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {THIRD_PLACE_SLOTS.map((slot) => {
                    const assigned = thirdPlaceAssignment[slot.key];
                    return (
                      <div key={slot.key} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-3 flex flex-col gap-1.5 hover:border-blue-500/20 transition-all">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{slot.key} Slot</span>
                        {assigned ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-2.5 overflow-hidden rounded-[1px] flex-shrink-0">
                              <FlagIcon teamName={assigned.team} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[10px] font-bold text-white truncate">{assigned.team}</span>
                            <span className="text-[8px] font-black text-amber-400 bg-amber-400/10 px-1 py-0.2 rounded border border-amber-400/20">Grup {assigned.group}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-600 italic">Kosong</span>
                        )}
                        <span className="text-[8.5px] text-zinc-600 font-medium">Kandidat: {slot.groups.join(', ')}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
          {officialResult?.submissionsLocked && !isSharedView && !viewingUser && (

            <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 rounded-3xl flex flex-col items-center justify-center p-4 sm:p-8 border border-white/5 min-h-[600px]">
              <div className="w-full max-w-2xl bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col max-h-[85%]">

                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-zinc-900 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/5">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-black text-white tracking-tight uppercase">Pengisian Prediksi Ditutup</h3>
                      <p className="text-zinc-450 text-[11px] mt-0.5">Seluruh pilihan bracket dikunci. Klik nama di bawah untuk melihat detail prediksi mereka.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">Submissions Locked</span>
                </div>

                <Link
                  to="/world-cup-table"
                  className="mb-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/5"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Lihat Hasil Resmi
                </Link>

                {officialResult?.leaderboardOpened ? (
                  <div className="flex-grow flex flex-col min-h-0 space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Cari nama peserta..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>

                      {/* Leaderboard Tab Selector */}
                      <div className="flex bg-zinc-900/80 border border-white/5 rounded-xl p-0.5 gap-0.5 text-[10px] font-bold sm:w-64">
                        <button
                          onClick={() => setLeaderboardTab('overall')}
                          className={`flex-1 py-1.5 rounded-lg transition-all ${leaderboardTab === 'overall' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'}`}
                        >
                          Overall
                        </button>
                        <button
                          onClick={() => setLeaderboardTab('group')}
                          className={`flex-1 py-1.5 rounded-lg transition-all ${leaderboardTab === 'group' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'}`}
                        >
                          Grup
                        </button>
                        <button
                          onClick={() => setLeaderboardTab('knockout')}
                          className={`flex-1 py-1.5 rounded-lg transition-all ${leaderboardTab === 'knockout' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'}`}
                        >
                          Knockout
                        </button>
                      </div>
                    </div>

                    {isLoadingLeaderboard ? (
                      <div className="flex-grow flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                        <span className="text-xs text-zinc-500">Memuat data leaderboard...</span>
                      </div>
                    ) : (
                      <div className="flex-grow overflow-y-auto pr-1 leaderboard-scroll space-y-2 max-h-[350px]">
                        {sortedLeaderboard
                          .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((user, idx) => {
                            const isUser = user.name === inputName;
                            const displayScore = leaderboardTab === 'group' ? user.groupScore : leaderboardTab === 'knockout' ? user.knockoutScore : user.score;
                            const displayAccuracy = leaderboardTab === 'group' ? user.groupAccuracy : leaderboardTab === 'knockout' ? user.knockoutAccuracy : user.accuracy;
                            return (
                              <div
                                key={user.id || idx}
                                onClick={() => handleSelectLeaderboardUser(user)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer hover:bg-white/5 active:scale-[0.99] ${idx === 0
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-300 shadow-lg shadow-amber-500/5'
                                  : idx === 1
                                    ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                                    : idx === 2
                                      ? 'bg-orange-950/15 border-orange-900/20 text-orange-300'
                                      : isUser
                                        ? 'bg-blue-950/25 border-blue-500/20 text-blue-300'
                                        : 'bg-zinc-900/40 border-white/5 text-zinc-400'
                                  }`}
                              >
                                <div className="flex items-center gap-3 truncate">
                                  <span className="w-5 h-5 rounded-md bg-zinc-950 flex items-center justify-center text-[10px] font-black border border-white/5 text-zinc-500">
                                    {idx + 1}
                                  </span>
                                  <span className="truncate">{user.name}</span>
                                </div>
                                <span className="font-mono font-bold text-right shrink-0">
                                  {displayScore} Pts <span className="text-[10px] text-zinc-500 font-medium">({displayAccuracy}%)</span>
                                </span>
                              </div>
                            );
                          })}
                        {sortedLeaderboard.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                          <div className="text-center py-10 text-xs text-zinc-500 italic bg-zinc-900/10 border border-dashed border-zinc-800 rounded-xl">
                            Nama peserta tidak ditemukan
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-3 animate-pulse">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Leaderboard Belum Dibuka</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 max-w-sm leading-relaxed">
                      Skor dan klasemen realtime peserta akan dibuka oleh Admin saat Babak Gugur resmi dimulai.
                    </p>
                  </div>
                )}

                <p className="text-[10px] text-zinc-500 mt-5 text-center leading-relaxed border-t border-zinc-900 pt-3">
                  * Klik nama peserta di atas untuk menginspeksi tebakan tebakan bracket mereka.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Download Template */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', overflow: 'hidden', width: '0', height: '0' }}>
          <DownloadTemplate
            ref={templateRef}
            groupAdvancers={groupAdvancers}
            roundOf32Winners={roundOf32Winners}
            roundOf16Winners={roundOf16Winners}
            quarterWinners={quarterWinners}
            semiWinners={semiWinners}
            finalWinner={finalWinner}
            username={inputName}
            isKnockoutPhase={downloadType === 'all'}
          />
        </div>

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

        {/* Download Preview Modal */}
        <DownloadPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          imageUrl={previewImageUrl}
          onDownload={triggerActualDownload}
          shareUrl={generatedShareUrl}
          downloadType={downloadType}
          onChangeType={handleDownloadTypeChange}
          isGenerating={isGeneratingPreview}
        />
      </div>
      <Footer />
    </div>
  );
};

export default CupPage;
