import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, CheckCircle2, RotateCcw, Save, Send, Loader2, X, AlertTriangle,
    Lock, Flame, Swords, ChevronRight, ChevronLeft, Search, Zap, ShieldAlert, Star,
} from 'lucide-react';
import { db } from '../../../database/firebase';
import {
    collection, addDoc, getDocs, doc, onSnapshot, setDoc, query, where, getDoc,
} from 'firebase/firestore';
import FlagIcon from './FlagIcon';
import pialaImg from '../../../assets/images/ImagesWorldCup/piala.png';
import logoWorldCupImg from '../../../assets/images/ImagesWorldCup/logo-world-cup.png';
import Footer from './Footer';

/* ────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS — "Sudden Death" night-stadium theme
   bg-void   #0A0E14   panel  #0F141C   panel-2 #151B26
   crimson   #FF2D4B  (eliminated / live / selection)
   gold      #FFC845  (champion / trophy)
   ice       #4FD1FF  (live / info accents)
   Display font: Anton (condensed scoreboard headline)
   Mono font:    JetBrains Mono (scorelines / digits)
   ──────────────────────────────────────────────────────────────────────── */

const COLLECTION_NAME = 'worldCupv2';
const RESULT_DOC_PATH = ['worldcupv2Result', 'official'];
const SESSION_STORAGE_KEY = 'worldcup_knockout_session';

const ROUND_ORDER = ['R32', 'R16', 'QF', 'SF', 'FINAL'];

const ROUND_META = {
    R32: { label: 'Babak 32 Besar', short: '32 Besar' },
    R16: { label: 'Babak 16 Besar', short: '16 Besar' },
    QF: { label: 'Perempat Final', short: 'Perempat Final' },
    SF: { label: 'Semi Final', short: 'Semi Final' },
    FINAL: { label: 'Grand Final', short: 'Final' },
};
const TOTAL_MATCHES = 31; // 16 + 8 + 4 + 2 + 1

const mapApiToLocalTeam = (name) => {
    if (name === 'Bosnia & Herzegovina') return 'Bosnia and Herzegovina';
    if (name === 'USA') return 'United States';
    if (name === 'Turkey') return 'Turkiye';
    if (name === 'Curaçao') return 'Curacao';
    return name;
};

const isApiPlaceholder = (name) => {
    if (!name) return true;
    return /^[0-9]+[A-L]/i.test(name) || /^[WL][0-9]+/i.test(name);
};

const MAP_MATCH_NUM_TO_ID = {
    // R32
    73: 'R32_1', 74: 'R32_2', 75: 'R32_3', 76: 'R32_4',
    77: 'R32_5', 78: 'R32_6', 79: 'R32_7', 80: 'R32_8',
    81: 'R32_9', 82: 'R32_10', 83: 'R32_11', 84: 'R32_12',
    85: 'R32_13', 86: 'R32_14', 87: 'R32_15', 88: 'R32_16',
    // R16
    89: 'R16_1', 90: 'R16_2', 91: 'R16_3', 92: 'R16_4',
    93: 'R16_5', 94: 'R16_6', 95: 'R16_7', 96: 'R16_8',
    // QF
    97: 'QF_1', 98: 'QF_2', 99: 'QF_3', 100: 'QF_4',
    // SF
    101: 'SF_1', 102: 'SF_2',
    // FINAL
    104: 'FINAL_1'
};

// Official, confirmed Round of 32 matchups (locked as of the end of the group stage).
const R32_MATCHES = [
    { id: 'R32_1', t1: 'South Africa', t2: 'Canada', date: 'Min, 28 Jun', venue: 'Los Angeles Stadium' },
    { id: 'R32_2', t1: 'Germany', t2: 'Paraguay', date: 'Sen, 29 Jun', venue: 'Boston Stadium' },
    { id: 'R32_3', t1: 'Netherlands', t2: 'Morocco', date: 'Sen, 29 Jun', venue: 'Monterrey Stadium' },
    { id: 'R32_4', t1: 'Brazil', t2: 'Japan', date: 'Sen, 29 Jun', venue: 'Houston Stadium' },
    { id: 'R32_5', t1: 'France', t2: 'Sweden', date: 'Sel, 30 Jun', venue: 'New York/New Jersey Stadium' },
    { id: 'R32_6', t1: 'Ivory Coast', t2: 'Norway', date: 'Sel, 30 Jun', venue: 'Dallas Stadium' },
    { id: 'R32_7', t1: 'Mexico', t2: 'Ecuador', date: 'Sel, 30 Jun', venue: 'Mexico City Stadium' },
    { id: 'R32_8', t1: 'England', t2: 'DR Congo', date: 'Rab, 1 Jul', venue: 'Atlanta Stadium' },
    { id: 'R32_9', t1: 'United States', t2: 'Bosnia and Herzegovina', date: 'Rab, 1 Jul', venue: 'San Francisco Bay Area Stadium' },
    { id: 'R32_10', t1: 'Belgium', t2: 'Senegal', date: 'Rab, 1 Jul', venue: 'Seattle Stadium' },
    { id: 'R32_11', t1: 'Portugal', t2: 'Croatia', date: 'Kam, 2 Jul', venue: 'Toronto Stadium' },
    { id: 'R32_12', t1: 'Spain', t2: 'Austria', date: 'Kam, 2 Jul', venue: 'Los Angeles Stadium' },
    { id: 'R32_13', t1: 'Switzerland', t2: 'Algeria', date: 'Kam, 2 Jul', venue: 'Vancouver Stadium' },
    { id: 'R32_14', t1: 'Argentina', t2: 'Cape Verde', date: 'Jum, 3 Jul', venue: 'Miami Stadium' },
    { id: 'R32_15', t1: 'Colombia', t2: 'Ghana', date: 'Jum, 3 Jul', venue: 'Kansas City Stadium' },
    { id: 'R32_16', t1: 'Australia', t2: 'Egypt', date: 'Jum, 3 Jul', venue: 'Dallas Stadium' },
];
// NOTE: pairing for R16 → Final below assumes sequential bracket pairing
// (match 1 vs match 2, match 3 vs match 4, ...). Adjust pairing here if the
// official FIFA bracket tree differs once the knockout rounds are drawn out.


/** Builds R32→R16→QF→SF→FINAL given chosen winners, pruning stale downstream picks. */
const buildBracket = (winners) => {
    const rounds = { R32: R32_MATCHES };
    let prunedWinners = { ...winners };

    const getW = (id) => prunedWinners[id] || null;

    // R16 pairings based on official FIFA 2026 bracket
    const r16Pairings = [
        { id: 'R16_1', from: ['R32_2', 'R32_5'] },
        { id: 'R16_2', from: ['R32_1', 'R32_3'] },
        { id: 'R16_3', from: ['R32_4', 'R32_6'] },
        { id: 'R16_4', from: ['R32_7', 'R32_8'] },
        { id: 'R16_5', from: ['R32_11', 'R32_12'] },
        { id: 'R16_6', from: ['R32_9', 'R32_10'] },
        { id: 'R16_7', from: ['R32_14', 'R32_16'] },
        { id: 'R16_8', from: ['R32_13', 'R32_15'] },
    ];

    rounds.R16 = r16Pairings.map((p) => {
        const t1 = getW(p.from[0]);
        const t2 = getW(p.from[1]);
        if (prunedWinners[p.id] && prunedWinners[p.id] !== t1 && prunedWinners[p.id] !== t2) {
            delete prunedWinners[p.id];
        }
        return { id: p.id, t1, t2, fromIds: p.from };
    });

    // QF pairings
    const qfPairings = [
        { id: 'QF_1', from: ['R16_1', 'R16_2'] },
        { id: 'QF_2', from: ['R16_5', 'R16_6'] },
        { id: 'QF_3', from: ['R16_3', 'R16_4'] },
        { id: 'QF_4', from: ['R16_7', 'R16_8'] },
    ];

    rounds.QF = qfPairings.map((p) => {
        const t1 = getW(p.from[0]);
        const t2 = getW(p.from[1]);
        if (prunedWinners[p.id] && prunedWinners[p.id] !== t1 && prunedWinners[p.id] !== t2) {
            delete prunedWinners[p.id];
        }
        return { id: p.id, t1, t2, fromIds: p.from };
    });

    // SF pairings
    const sfPairings = [
        { id: 'SF_1', from: ['QF_1', 'QF_2'] },
        { id: 'SF_2', from: ['QF_3', 'QF_4'] },
    ];

    rounds.SF = sfPairings.map((p) => {
        const t1 = getW(p.from[0]);
        const t2 = getW(p.from[1]);
        if (prunedWinners[p.id] && prunedWinners[p.id] !== t1 && prunedWinners[p.id] !== t2) {
            delete prunedWinners[p.id];
        }
        return { id: p.id, t1, t2, fromIds: p.from };
    });

    // FINAL pairings
    const finalPairings = [
        { id: 'FINAL_1', from: ['SF_1', 'SF_2'] },
    ];

    rounds.FINAL = finalPairings.map((p) => {
        const t1 = getW(p.from[0]);
        const t2 = getW(p.from[1]);
        if (prunedWinners[p.id] && prunedWinners[p.id] !== t1 && prunedWinners[p.id] !== t2) {
            delete prunedWinners[p.id];
        }
        return { id: p.id, t1, t2, fromIds: p.from };
    });

    return { rounds, prunedWinners };
};

const parseMatchDateTimeToWIB = (dateStr, timeStr) => {
    if (!timeStr) {
        return { date: dateStr, time: 'TBD' };
    }

    try {
        const match = timeStr.match(/^(\d{2}):(\d{2})\s+UTC([+-]\d+)?$/);
        if (!match) {
            return { date: dateStr, time: timeStr };
        }

        const [_, hh, mm, offset] = match;
        let utcHourDiff = 0;
        if (offset) {
            utcHourDiff = parseInt(offset, 10);
        }

        const [year, month, day] = dateStr.split('-').map(Number);
        const utcHour = parseInt(hh, 10) - utcHourDiff;
        const utcMinute = parseInt(mm, 10);

        const dateUTC = Date.UTC(year, month - 1, day, utcHour, utcMinute);
        const dateObj = new Date(dateUTC);

        const wibOffset = 7 * 60 * 60 * 1000;
        const wibDate = new Date(dateObj.getTime() + wibOffset);

        const wibYear = wibDate.getUTCFullYear();
        const wibMonth = String(wibDate.getUTCMonth() + 1).padStart(2, '0');
        const wibDay = String(wibDate.getUTCDate()).padStart(2, '0');
        const wibDateStr = `${wibYear}-${wibMonth}-${wibDay}`;

        const wibH = String(wibDate.getUTCHours()).padStart(2, '0');
        const wibM = String(wibDate.getUTCMinutes()).padStart(2, '0');
        const wibTimeStr = `${wibH}:${wibM} WIB`;

        return { date: wibDateStr, time: wibTimeStr };
    } catch (e) {
        console.error("Failed to parse time:", e);
        return { date: dateStr, time: timeStr };
    }
};

const formatIndoDate = (dateStr) => {
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch (_) {
        return dateStr;
    }
};

const fetchOfficialResultsFromAPI = async () => {
    try {
        const res = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json');
        const data = await res.json();
        if (data && data.matches) {
            const apiWinners = {};
            const apiScores = {};
            const apiMeta = {};

            const getWinner = (m) => {
                if (!m.score) return null;
                const t1 = mapApiToLocalTeam(m.team1);
                const t2 = mapApiToLocalTeam(m.team2);
                if (isApiPlaceholder(t1) || isApiPlaceholder(t2)) return null;

                const score = m.score;
                if (score.p) {
                    return score.p[0] > score.p[1] ? t1 : t2;
                }
                if (score.et) {
                    return score.et[0] > score.et[1] ? t1 : t2;
                }
                if (score.ft) {
                    if (score.ft[0] === score.ft[1]) return null;
                    return score.ft[0] > score.ft[1] ? t1 : t2;
                }
                return null;
            };

            data.matches.forEach((m) => {
                if (!m.num) return;
                const matchId = MAP_MATCH_NUM_TO_ID[m.num];
                if (matchId) {
                    const winner = getWinner(m);
                    if (winner) {
                        apiWinners[matchId] = winner;
                    }
                    if (m.score && m.score.ft) {
                        apiScores[matchId] = {
                            s1: String(m.score.ft[0]),
                            s2: String(m.score.ft[1]),
                            isPenalty: !!m.score.p
                        };
                    }
                    const wibInfo = parseMatchDateTimeToWIB(m.date, m.time);
                    apiMeta[matchId] = {
                        date: formatIndoDate(wibInfo.date),
                        time: wibInfo.time,
                        venue: m.ground || m.stadium || m.venue || 'Stadion TBD'
                    };
                }
            });

            return { winners: apiWinners, scores: apiScores, meta: apiMeta };
        }
    } catch (err) {
        console.error('Gagal mengambil data dari openfootball API:', err);
    }
    return null;
};

const calcKnockoutScore = (userWinners, userScores, official) => {
    if (!official) return { points: 0, correctWinners: 0 };
    const officialWinners = official.winners || {};
    const officialScores = official.scores || {};
    let points = 0;
    let correctWinners = 0;
    ROUND_ORDER.forEach((round) => {
        const count = { R32: 16, R16: 8, QF: 4, SF: 2, FINAL: 1 }[round];
        for (let i = 1; i <= count; i++) {
            const id = `${round}_${i}`;
            const officialW = officialWinners[id];
            if (!officialW) continue;
            const userW = userWinners[id];
            if (userW && userW === officialW) {
                correctWinners += 1;
                const os = officialScores[id];
                const us = userScores[id];
                let isExactScore = false;
                if (os && us && String(os.s1) === String(us.s1) && String(os.s2) === String(us.s2)) {
                    isExactScore = true;
                }

                if (isExactScore) {
                    points += 3;
                } else if (os && os.isPenalty) {
                    points += 1;
                } else {
                    points += 2;
                }
            }
        }
    });
    return { points, correctWinners };
};

const KnockoutPredictorPage = () => {
    const [winners, setWinners] = useState({});
    const [scores, setScores] = useState({});
    const [saveFlash, setSaveFlash] = useState(false);

    const [activeRound, setActiveRound] = useState('R32');

    // ── Auth / session state ────────────────────────────────────────────────
    // modalMode: null | 'submit' | 'login'
    const [modalMode, setModalMode] = useState(null);
    const [inputName, setInputName] = useState('');
    const [inputContact, setInputContact] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
    const [errorMsg, setErrorMsg] = useState('');

    // logged-in user session (stored in localStorage to persist on refresh)
    const [session, setSession] = useState(() => {
        try {
            const raw = localStorage.getItem(SESSION_STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (_) { }
        return null;
    });
    const [submittedScore, setSubmittedScore] = useState(null);

    const [officialResult, setOfficialResult] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const [leaderboardLastUpdated, setLeaderboardLastUpdated] = useState(null);
    const [selectedViewerUser, setSelectedViewerUser] = useState(null);

    const locked = !!officialResult?.submissionsLocked;
    const hasSubmitted = !!session;

    // ── Bracket derivation ──────────────────────────────────────────────────
    const { rounds: bracket } = useMemo(() => buildBracket(winners), [winners]);
    const { rounds: officialBracket } = useMemo(() => buildBracket(officialResult?.winners || {}), [officialResult?.winners]);
    const userViewerBracket = useMemo(() => {
        if (!selectedViewerUser) return null;
        return buildBracket(selectedViewerUser.winners || {}).rounds;
    }, [selectedViewerUser]);
    const champion = winners['FINAL_1'] || null;
    const completedCount = Object.keys(winners).length;
    const isComplete = completedCount === TOTAL_MATCHES;
    const progressPct = Math.round((completedCount / TOTAL_MATCHES) * 100);

    const isRoundUnlocked = useCallback((round) => {
        const idx = ROUND_ORDER.indexOf(round);
        if (idx <= 0) return true;
        const prevRound = ROUND_ORDER[idx - 1];
        return bracket[prevRound].every((m) => !!winners[m.id]);
    }, [bracket, winners]);

    // ── Load user predictions from session ──────────────────────────────────
    useEffect(() => {
        if (!session?.docId) return;
        let isMounted = true;

        const loadUserPrediction = async () => {
            try {
                const docRef = doc(db, COLLECTION_NAME, session.docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && isMounted) {
                    const data = docSnap.data();
                    setWinners(data.winners || {});
                    setScores(data.scores || {});
                    const currentScore = calcKnockoutScore(data.winners || {}, data.scores || {}, officialResult);
                    setSubmittedScore(currentScore);
                }
            } catch (err) {
                console.error("Gagal memuat prediksi user dari sesi:", err);
            }
        };

        loadUserPrediction();

        return () => {
            isMounted = false;
        };
    }, [session?.docId, officialResult]);

    // ── Leaderboard / official result listener ─────────────────────────────
    const fetchLeaderboard = useCallback(async (official) => {
        setIsLoadingLeaderboard(true);
        try {
            const snap = await getDocs(collection(db, COLLECTION_NAME));
            const list = [];
            snap.forEach((d) => {
                const data = d.data();
                const { points, correctWinners } = calcKnockoutScore(data.winners || {}, data.scores || {}, official);
                list.push({
                    id: d.id,
                    name: data.username || 'Anonymous',
                    points,
                    correctWinners,
                    champion: data.champion || null,
                    winners: data.winners || {},
                    scores: data.scores || {},
                });
            });
            list.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
            setLeaderboard(list);
            setLeaderboardLastUpdated(new Date());
        } catch (err) {
            console.error('Gagal mengambil leaderboard:', err);
        } finally {
            setIsLoadingLeaderboard(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        let unsub = null;

        const loadOfficialData = async () => {
            const apiResult = await fetchOfficialResultsFromAPI();
            if (!isMounted) return;

            unsub = onSnapshot(doc(db, ...RESULT_DOC_PATH), (snap) => {
                let fsData = {};
                if (snap.exists()) {
                    fsData = snap.data();
                }
                const mergedResult = {
                    submissionsLocked: fsData.submissionsLocked ?? false,
                    leaderboardOpened: fsData.leaderboardOpened ?? false,
                    winners: apiResult?.winners ?? {},
                    scores: apiResult?.scores ?? {},
                    meta: apiResult?.meta ?? {},
                };
                if (isMounted) {
                    setOfficialResult(mergedResult);
                    if (mergedResult.leaderboardOpened) {
                        fetchLeaderboard(mergedResult);
                    } else {
                        setLeaderboard([]);
                    }
                }
            }, (err) => console.error('Gagal memuat hasil resmi:', err));
        };

        loadOfficialData();

        return () => {
            isMounted = false;
            if (unsub) unsub();
        };
    }, [fetchLeaderboard]);

    const sortedLeaderboard = useMemo(
        () => [...leaderboard].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)),
        [leaderboard],
    );

    const myScore = useMemo(
        () => calcKnockoutScore(winners, scores, officialResult),
        [winners, scores, officialResult],
    );

    // ── Interaction handlers ────────────────────────────────────────────────
    const isInteractive = !locked;

    const openModal = (mode) => {
        setModalMode(mode);
        setSaveStatus(null);
        setErrorMsg('');
        setInputName('');
        setInputPassword('');
        setInputContact('');
        setShowPassword(false);
    };

    const closeModal = () => {
        if (isSaving) return;
        setModalMode(null);
        setSaveStatus(null);
        setErrorMsg('');
    };

    const handleSelectWinner = (matchId, team) => {
        if (!isInteractive) return;

        // If scores are unequal, force the winner based on the higher score (do not allow manual overrides)
        const sc = scores[matchId] || {};
        const s1 = sc.s1;
        const s2 = sc.s2;
        if (s1 !== undefined && s2 !== undefined && s1 !== '' && s2 !== '') {
            const n1 = parseInt(s1, 10);
            const n2 = parseInt(s2, 10);
            if (!isNaN(n1) && !isNaN(n2) && n1 !== n2) {
                return;
            }
        }

        setWinners((prev) => {
            const { prunedWinners } = buildBracket({ ...prev, [matchId]: team });
            return prunedWinners;
        });
    };

    const handleScoreChange = (matchId, which, value) => {
        if (!isInteractive) return;
        const clean = value.replace(/[^0-9]/g, '').slice(0, 2);
        
        setScores((prev) => {
            const nextScores = {
                ...prev,
                [matchId]: { ...prev[matchId], [which]: clean },
            };

            // Automatically determine winner if scores are unequal
            const roundName = matchId.split('_')[0];
            const roundMatches = bracket[roundName];
            const match = roundMatches?.find((m) => m.id === matchId);
            if (match) {
                const sc = nextScores[matchId] || {};
                const s1 = sc.s1;
                const s2 = sc.s2;
                if (s1 !== undefined && s2 !== undefined && s1 !== '' && s2 !== '') {
                    const n1 = parseInt(s1, 10);
                    const n2 = parseInt(s2, 10);
                    if (!isNaN(n1) && !isNaN(n2)) {
                        if (n1 > n2) {
                            setWinners((prevWinners) => {
                                const { prunedWinners } = buildBracket({ ...prevWinners, [matchId]: match.t1 });
                                return prunedWinners;
                            });
                        } else if (n2 > n1) {
                            setWinners((prevWinners) => {
                                const { prunedWinners } = buildBracket({ ...prevWinners, [matchId]: match.t2 });
                                return prunedWinners;
                            });
                        }
                    }
                }
            }

            return nextScores;
        });
    };

    const resetPrediction = () => {
        if (!isInteractive) return;
        setWinners({});
        setScores({});
        setActiveRound('R32');
    };

    const flashSave = () => { setSaveFlash(true); setTimeout(() => setSaveFlash(false), 1800); };

    const buildPredictionJSON = () => ({
        savedAt: new Date().toISOString(),
        winners,
        scores,
        champion,
    });

    // ── Submit prediction ───────────────────────────────────────────────────
    const submitPrediction = async () => {
        if (!inputName.trim()) { setErrorMsg('Nama tidak boleh kosong'); return; }
        if (!inputPassword.trim() || inputPassword.trim().length < 4) { setErrorMsg('Password minimal 4 karakter'); return; }
        setIsSaving(true);
        setErrorMsg('');
        try {
            // Check if username already exists
            const q = query(collection(db, COLLECTION_NAME), where('username', '==', inputName.trim()));
            const snap = await getDocs(q);

            if (!snap.empty) {
                setErrorMsg('Username sudah digunakan peserta lain. Gunakan nama lain atau Login untuk update prediksimu.');
                setIsSaving(false);
                return;
            }

            const predictionData = {
                ...buildPredictionJSON(),
                username: inputName.trim(),
                contact: inputContact.trim() || '',
                password: inputPassword.trim(),
            };

            const docRef = await addDoc(collection(db, COLLECTION_NAME), predictionData);
            const newSession = { docId: docRef.id, username: inputName.trim(), contact: inputContact.trim() };
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
            setSession(newSession);
            setSaveStatus('success');
            const currentScore = calcKnockoutScore(winners, scores, officialResult);
            setSubmittedScore(currentScore);
            flashSave();
            if (officialResult?.leaderboardOpened) fetchLeaderboard(officialResult);

            setTimeout(() => {
                setModalMode(null);
                setSaveStatus(null);
            }, 3500);
        } catch (err) {
            console.error('Gagal menyimpan ke Firestore:', err);
            setSaveStatus('error');
            setErrorMsg(err.message || 'Gagal menyimpan prediksi. Coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    // ── Login (load existing prediction) ───────────────────────────────────
    const loginAndLoad = async () => {
        if (!inputName.trim()) { setErrorMsg('Nama tidak boleh kosong'); return; }
        if (!inputPassword.trim()) { setErrorMsg('Password tidak boleh kosong'); return; }

        setIsSaving(true);
        setErrorMsg('');
        try {
            const q = query(collection(db, COLLECTION_NAME), where('username', '==', inputName.trim()));
            const snap = await getDocs(q);

            if (snap.empty) {
                setErrorMsg('Username tidak ditemukan. Silakan Submit untuk daftar baru.');
                setIsSaving(false);
                return;
            }

            const matchedDoc = snap.docs.find((d) => d.data().password === inputPassword.trim());
            if (!matchedDoc) {
                setErrorMsg('Password salah.');
                setIsSaving(false);
                return;
            }

            const data = matchedDoc.data();
            setWinners(data.winners || {});
            setScores(data.scores || {});
            const newSession = { docId: matchedDoc.id, username: data.username, contact: data.contact || '' };
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
            setSession(newSession);
            const currentScore = calcKnockoutScore(data.winners || {}, data.scores || {}, officialResult);
            setSubmittedScore(currentScore);
            setSaveStatus('success');
            flashSave();

            setTimeout(() => {
                setModalMode(null);
                setSaveStatus(null);
            }, 2500);
        } catch (err) {
            console.error('Gagal login:', err);
            setErrorMsg(err.message || 'Gagal masuk. Coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    // ── Update prediction (already logged in) ──────────────────────────────
    const updatePrediction = async () => {
        if (!session) return;
        setIsSaving(true);
        setErrorMsg('');
        try {
            const predictionData = {
                ...buildPredictionJSON(),
                username: session.username,
                contact: session.contact || '',
                password: inputPassword.trim() || undefined,
            };
            // keep old password if not re-entered
            if (!inputPassword.trim()) delete predictionData.password;

            await setDoc(doc(db, COLLECTION_NAME, session.docId), predictionData, { merge: true });
            const currentScore = calcKnockoutScore(winners, scores, officialResult);
            setSubmittedScore(currentScore);
            setSaveStatus('success');
            flashSave();
            if (officialResult?.leaderboardOpened) fetchLeaderboard(officialResult);

            setTimeout(() => {
                setModalMode(null);
                setSaveStatus(null);
            }, 2500);
        } catch (err) {
            console.error('Gagal update prediksi:', err);
            setErrorMsg(err.message || 'Gagal update. Coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    const logout = () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSession(null);
        setWinners({});
        setScores({});
        setSubmittedScore(null);
        setActiveRound('R32');
    };

    // ── UI sub-components ───────────────────────────────────────────────────
    const TeamRow = ({ team, isWinner, onClick, score, onScoreChange, disabled }) => {
        const clickable = team && isInteractive && !disabled;
        const [localScore, setLocalScore] = useState(score ?? '');

        useEffect(() => {
            setLocalScore(score ?? '');
        }, [score]);

        const decrement = (e) => {
            e.stopPropagation();
            if (!isInteractive || disabled || !team) return;
            const current = score ? parseInt(score, 10) : 0;
            if (current > 0) {
                onScoreChange(String(current - 1));
            }
        };

        const increment = (e) => {
            e.stopPropagation();
            if (!isInteractive || disabled || !team) return;
            const current = score ? parseInt(score, 10) : 0;
            onScoreChange(String(current + 1));
        };

        return (
            <div
                onClick={clickable ? onClick : undefined}
                className={`group flex items-center gap-1.5 sm:gap-3 w-full px-2 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl border transition-all duration-200 select-none ${isWinner
                    ? 'bg-gradient-to-r from-[#10B981]/15 to-transparent border-[#10B981]/50 shadow-[0_0_18px_rgba(16,185,129,0.15)]'
                    : !team
                        ? 'bg-black/20 border-white/[0.03] cursor-default'
                        : clickable
                            ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-[#10B981]/25 cursor-pointer'
                            : 'bg-white/[0.02] border-white/5 cursor-not-allowed opacity-60'
                    }`}
            >
                <div className="w-7 h-5 rounded-[3px] overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                    <FlagIcon teamName={team} className="w-full h-full object-cover" />
                </div>
                <span className={`text-[12.5px] font-bold truncate flex-1 sm:block hidden ${isWinner ? 'text-white' : team ? 'text-zinc-300' : 'text-zinc-600 italic'}`}>
                    {team || 'TBD'}
                </span>
                <div className="flex-grow sm:hidden" />
                {isWinner && (
                    <span className="text-[8px] font-black tracking-widest text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/30 flex-shrink-0 sm:inline-block hidden">
                        Winner
                    </span>
                )}
                <input
                    type="text"
                    inputMode="numeric"
                    value={localScore}
                    placeholder="-"
                    disabled={!team || !isInteractive}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                        setLocalScore(val);
                    }}
                    onBlur={() => {
                        if (localScore !== (score ?? '')) {
                            onScoreChange(localScore);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.target.blur();
                        }
                    }}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="w-8 h-8 px-0 text-center text-sm font-bold bg-black/40 border border-white/10 rounded-lg text-[#FFC845] focus:outline-none focus:border-[#FFC845]/50 disabled:opacity-30 flex-shrink-0"
                />
            </div>
        );
    };

    const CompactMatchNode = ({ matchId, bracketData }) => {
        if (!bracketData) return null;
        const roundName = matchId.split('_')[0];
        const roundMatches = bracketData[roundName];
        if (!roundMatches) return null;
        const match = roundMatches.find((m) => m.id === matchId);
        if (!match) return null;

        const w = officialResult?.winners?.[matchId];
        const sc = officialResult?.scores?.[matchId];

        const t1 = match.t1;
        const t2 = match.t2;

        const isT1Winner = w && w === t1;
        const isT2Winner = w && w === t2;

        const s1 = sc?.s1 ?? '-';
        const s2 = sc?.s2 ?? '-';

        return (
            <div className="flex items-center gap-1 bg-[#151B26] border border-white/[0.04] p-1 px-1.5 rounded-lg shadow-sm w-[76px] justify-between group hover:border-white/10 transition-colors">
                <div className="flex flex-col gap-1 items-center w-full">
                    <div className={`w-5 h-3.5 rounded-[2px] overflow-hidden border border-white/5 relative ${t1 && w && !isT1Winner ? 'opacity-30' : ''}`}>
                        <FlagIcon teamName={t1} className="w-full h-full object-cover" />
                    </div>
                    <div className={`w-5 h-3.5 rounded-[2px] overflow-hidden border border-white/5 relative ${t2 && w && !isT2Winner ? 'opacity-30' : ''}`}>
                        <FlagIcon teamName={t2} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex flex-col text-[8px] font-black text-center text-[#FFC845] min-w-[12px] leading-tight font-mono select-none">
                    <span>{s1}</span>
                    <span>{s2}</span>
                </div>
            </div>
        );
    };

    const MatchCard = ({ match, round, meta }) => {
        const w = winners[match.id];
        const sc = scores[match.id] || {};
        const isReady = match.t1 && match.t2;
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0F141C] border border-white/[0.06] rounded-2xl p-2 sm:p-3.5 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FF2D4B] to-transparent opacity-60" />
                {(() => {
                    const apiMeta = officialResult?.meta?.[match.id];
                    const displayDate = apiMeta ? `${apiMeta.date} • ${apiMeta.time}` : meta?.date;
                    const displayVenue = apiMeta ? apiMeta.venue : meta?.venue;
                    const hasHeader = !!displayDate || !!displayVenue;
                    if (!hasHeader) return null;
                    return (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 pl-0.5 gap-0.5">
                            <span className="text-[8px] sm:text-[9px] font-bold text-zinc-500 tracking-wide">{displayDate}</span>
                            <span className="text-[8px] sm:text-[9px] font-bold text-zinc-600 truncate max-w-full sm:max-w-[55%] text-left sm:text-right sm:block hidden">{displayVenue}</span>
                        </div>
                    );
                })()}
                {!isReady && (
                    <div className="flex items-center gap-1.5 mb-2 pl-0.5 text-[8px] sm:text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                        <Lock className="w-2.5 h-2.5" /> Menunggu hasil babak sebelumnya
                    </div>
                )}
                <div className="flex flex-col gap-1.5">
                    <TeamRow
                        team={match.t1}
                        isWinner={w === match.t1}
                        onClick={() => handleSelectWinner(match.id, match.t1)}
                        score={sc.s1}
                        onScoreChange={(v) => handleScoreChange(match.id, 's1', v)}
                        disabled={!isReady}
                    />
                    <div className="flex items-center justify-center -my-0.5">
                        <span
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            className="text-[8px] sm:text-[9px] font-bold text-zinc-600 bg-[#0A0E14] px-1.5 sm:px-2 rounded-full border border-white/5"
                        >
                            VS
                        </span>
                    </div>
                    <TeamRow
                        team={match.t2}
                        isWinner={w === match.t2}
                        onClick={() => handleSelectWinner(match.id, match.t2)}
                        score={sc.s2}
                        onScoreChange={(v) => handleScoreChange(match.id, 's2', v)}
                        disabled={!isReady}
                    />
                </div>
            </motion.div>
        );
    };

    const roundMatches = bracket[activeRound] || [];
    const roundMeta = activeRound === 'R32' ? R32_MATCHES : null;

    return (
        <div className="min-h-screen bg-[#0A0E14] text-zinc-100 pb-4 relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
        @keyframes scanline { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes pulseDot { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        .knockout-scroll::-webkit-scrollbar { width: 4px; }
        .knockout-scroll::-webkit-scrollbar-track { background: transparent; }
        .knockout-scroll::-webkit-scrollbar-thumb { background: rgba(255,45,75,0.3); border-radius: 9999px; }
      `}</style>

            {/* Ambient glows */}
            <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#FF2D4B]/[0.06] rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FFC845]/[0.04] rounded-full blur-[140px] pointer-events-none" />

            {/* ── SUDDEN DEATH TICKER ── */}
            <div className="w-full bg-black border-b border-[#FF2D4B]/20 py-2 relative z-50 overflow-hidden flex select-none pointer-events-none">
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10" />
                <div className="flex shrink-0 gap-10 px-4" style={{ animation: 'scanline 22s linear infinite' }}>
                    {Array.from({ length: 2 }).map((_, i) => (
                        <span key={i} className="text-[10px] font-black tracking-[0.2em] text-[#FF2D4B] uppercase whitespace-nowrap flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D4B]" style={{ animation: 'pulseDot 1.4s ease-in-out infinite' }} />
                            {locked ? 'BRACKET DIKUNCI — PENILAIAN SEDANG BERLANGSUNG' : 'SUDDEN DEATH · SEKALI KALAH, LANGSUNG PULANG · KUNCI PREDIKSI BABAK 32 BESAR SEBELUM 28 JUNI 2026'}
                            <span className="opacity-40">// // //</span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto relative z-20 pt-8 px-4 sm:px-6 lg:px-8">

                {/* ── HEADER ── */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="border-b border-white/[0.06] pb-6 mb-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <img src={logoWorldCupImg} alt="FIFA World Cup 2026" className="h-16 w-auto object-contain opacity-90" />
                            <div>
                                <div className="inline-flex items-center gap-1.5 bg-[#FF2D4B]/10 border border-[#FF2D4B]/25 px-2.5 py-0.5 rounded-full text-[#FF2D4B] text-[9px] font-bold tracking-[0.15em] uppercase mb-2">
                                    <Flame className="w-3 h-3" /> Knockout Predictor
                                </div>
                                <h1 style={{ fontFamily: "'Anton', sans-serif" }} className="text-3xl sm:text-4xl tracking-wide text-white leading-none">
                                    SUDDEN DEATH BRACKET
                                </h1>
                                <p className="text-zinc-500 text-[11px] mt-1.5">Pilih pemenang &amp; tebak skor — dari 32 Besar sampai Juara Dunia.</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center sm:items-end gap-2.5 w-full sm:w-auto">
                            <div className="flex items-center gap-2.5">
                                <AnimatePresence>
                                    {saveFlash && (
                                        <motion.span initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                            className="bg-[#FFC845]/15 border border-[#FFC845]/30 text-[#FFC845] px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan!
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {!locked && (
                                    <button
                                        onClick={resetPrediction}
                                        disabled={!!session}
                                        className={`border border-white/10 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${session ? 'bg-black/20 text-zinc-600 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-zinc-300'}`}
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                                    </button>
                                )}
                                {session ? (
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#FFC845]/10 border border-[#FFC845]/30 text-[#FFC845] px-3.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> {session.username}
                                        </span>
                                        {!locked && (
                                            <button
                                                onClick={() => openModal('submit')}
                                                className="bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5"
                                            >
                                                <Save className="w-3.5 h-3.5" /> Update
                                            </button>
                                        )}
                                        {locked && (
                                            <span className="bg-[#FF2D4B]/10 border border-[#FF2D4B]/30 text-[#FF2D4B] px-3.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                                                <Lock className="w-3 h-3" /> Dikunci
                                            </span>
                                        )}
                                        <button
                                            onClick={logout}
                                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                                        >
                                            Keluar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {locked && (
                                            <span className="bg-[#FF2D4B]/10 border border-[#FF2D4B]/30 text-[#FF2D4B] px-3.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                                                <Lock className="w-3.5 h-3.5" /> Ditutup
                                            </span>
                                        )}
                                        <button
                                            onClick={() => openModal('login')}
                                            className="border border-white/10 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-zinc-300"
                                        >
                                            <Lock className="w-3.5 h-3.5" /> Login
                                        </button>
                                        {!locked && (
                                            <button
                                                onClick={() => openModal('submit')}
                                                className="bg-gradient-to-r from-[#FF2D4B] to-[#FF5470] text-white shadow-[0_0_20px_rgba(255,45,75,0.3)] hover:brightness-110 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5"
                                            >
                                                <Send className="w-3.5 h-3.5" /> Submit Prediksi
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Progress */}
                            <div className="w-full sm:w-64">
                                <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-1">
                                    <span>{completedCount}/{TOTAL_MATCHES} Prediksi</span>
                                    <span className="text-[#FF2D4B]">{progressPct}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={false}
                                        animate={{ width: `${progressPct}%` }}
                                        className="h-full bg-gradient-to-r from-[#FF2D4B] to-[#FFC845] rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

                    {/* ── MAIN: ROUND STEPPER + MATCHES ── */}
                    <div className="relative">
                        {locked && selectedViewerUser ? (
                            (() => {
                                const leftR32 = ['R32_2', 'R32_5', 'R32_1', 'R32_3', 'R32_11', 'R32_12', 'R32_9', 'R32_10'];
                                const rightR32 = ['R32_4', 'R32_6', 'R32_7', 'R32_8', 'R32_14', 'R32_16', 'R32_13', 'R32_15'];

                                const leftR16 = ['R16_1', 'R16_2', 'R16_5', 'R16_6'];
                                const rightR16 = ['R16_3', 'R16_4', 'R16_7', 'R16_8'];

                                const leftQF = ['QF_1', 'QF_2'];
                                const rightQF = ['QF_3', 'QF_4'];

                                const leftSF = ['SF_1'];
                                const rightSF = ['SF_2'];

                                return (
                                    <div className="w-full bg-[#0F141C] border border-white/[0.06] rounded-3xl p-4 flex flex-col items-center justify-between min-h-[480px] shadow-2xl relative overflow-hidden">
                                        <div className="flex items-center justify-between w-full border-b border-white/5 pb-2 mb-4">
                                            <span className="text-[10px] font-black text-[#FFC845] tracking-widest flex items-center gap-1.5 uppercase">
                                                <Trophy className="w-3.5 h-3.5" /> PREDIKSI: {selectedViewerUser.name}
                                            </span>
                                            <button
                                                onClick={() => setSelectedViewerUser(null)}
                                                className="bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 px-3 py-1 rounded-lg text-[9px] font-bold transition-all flex items-center gap-1.5"
                                            >
                                                <RotateCcw className="w-3 h-3" /> Hasil Resmi {session ? '/ Tebakan Saya' : ''}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between w-full gap-1 select-none overflow-x-auto knockout-scroll min-h-[360px]">
                                            {/* 1. R32 LEFT */}
                                            <div className="flex flex-col justify-between h-full gap-2.5">
                                                {leftR32.map(id => <CompactMatchNode key={id} matchId={id} bracketData={userViewerBracket} viewerWinners={selectedViewerUser.winners} viewerScores={selectedViewerUser.scores} />)}
                                            </div>

                                            {/* 2. R16 LEFT */}
                                            <div className="flex flex-col justify-around h-full min-h-[360px]">
                                                {leftR16.map(id => <CompactMatchNode key={id} matchId={id} bracketData={userViewerBracket} viewerWinners={selectedViewerUser.winners} viewerScores={selectedViewerUser.scores} />)}
                                            </div>

                                            {/* 3. QF LEFT */}
                                            <div className="flex flex-col justify-around h-full min-h-[360px]">
                                                {leftQF.map(id => <CompactMatchNode key={id} matchId={id} bracketData={userViewerBracket} viewerWinners={selectedViewerUser.winners} viewerScores={selectedViewerUser.scores} />)}
                                            </div>

                                            {/* 4. SF LEFT */}
                                            <div className="flex flex-col justify-center h-full min-h-[360px]">
                                                {leftSF.map(id => <CompactMatchNode key={id} matchId={id} bracketData={userViewerBracket} viewerWinners={selectedViewerUser.winners} viewerScores={selectedViewerUser.scores} />)}
                                            </div>

                                            {/* 5. CENTER */}
                                            <div className="flex flex-col justify-center items-center gap-5 min-h-[360px] px-1 border-x border-white/[0.03]">
                                                <div className="flex flex-col items-center text-center bg-black/40 border border-[#FFC845]/20 p-2 rounded-xl w-[90px]">
                                                    <Trophy className="w-5 h-5 text-[#FFC845] drop-shadow-[0_0_6px_rgba(255,200,69,0.4)] mb-1" />
                                                    <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-black">CHAMPION</span>
                                                    <div className="w-6 h-4.5 rounded-[2px] overflow-hidden border border-white/5 mt-1.5">
                                                        <FlagIcon teamName={selectedViewerUser.winners?.['FINAL_1']} className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[6px] text-zinc-500 uppercase tracking-wider font-bold mb-1">FINAL</span>
                                                    <CompactMatchNode matchId="FINAL_1" bracketData={userViewerBracket} viewerWinners={selectedViewerUser.winners} viewerScores={selectedViewerUser.scores} />
                                                </div>
                                            </div>

                                            {/* 6. SF RIGHT */}
                                            <div className="flex flex-col justify-center h-full min-h-[360px]">
                                                {rightSF.map(id => <CompactMatchNode key={id} matchId={id} bracketData={userViewerBracket} viewerWinners={selectedViewerUser.winners} viewerScores={selectedViewerUser.scores} />)}
                                            </div>

                                            {/* 7. QF RIGHT */}
                                            <div className="flex flex-col justify-around h-full min-h-[360px]">
                                                {rightQF.map(id => <CompactMatchNode key={id} matchId={id} bracketData={userViewerBracket} viewerWinners={selectedViewerUser.winners} viewerScores={selectedViewerUser.scores} />)}
                                            </div>

                                            {/* 8. R16 RIGHT */}
                                            <div className="flex flex-col justify-around h-full min-h-[360px]">
                                                {rightR16.map(id => <CompactMatchNode key={id} matchId={id} bracketData={userViewerBracket} viewerWinners={selectedViewerUser.winners} viewerScores={selectedViewerUser.scores} />)}
                                            </div>

                                            {/* 9. R32 RIGHT */}
                                            <div className="flex flex-col justify-between h-full gap-2.5">
                                                {rightR32.map(id => <CompactMatchNode key={id} matchId={id} bracketData={userViewerBracket} viewerWinners={selectedViewerUser.winners} viewerScores={selectedViewerUser.scores} />)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()
                        ) : locked && !session ? (
                            (() => {
                                const leftR32 = ['R32_2', 'R32_5', 'R32_1', 'R32_3', 'R32_11', 'R32_12', 'R32_9', 'R32_10'];
                                const rightR32 = ['R32_4', 'R32_6', 'R32_7', 'R32_8', 'R32_14', 'R32_16', 'R32_13', 'R32_15'];

                                const leftR16 = ['R16_1', 'R16_2', 'R16_5', 'R16_6'];
                                const rightR16 = ['R16_3', 'R16_4', 'R16_7', 'R16_8'];

                                const leftQF = ['QF_1', 'QF_2'];
                                const rightQF = ['QF_3', 'QF_4'];

                                const leftSF = ['SF_1'];
                                const rightSF = ['SF_2'];

                                return (
                                    <div className="w-full bg-[#0F141C] border border-white/[0.06] rounded-3xl p-4 flex flex-col items-center justify-between min-h-[480px] shadow-2xl relative overflow-hidden">
                                        <div className="flex items-center justify-between w-full border-b border-white/5 pb-2 mb-4">
                                            <span className="text-[10px] font-black text-[#FFC845] tracking-widest flex items-center gap-1.5 uppercase">
                                                <Trophy className="w-3.5 h-3.5" /> BAGAN HASIL PERTANDINGAN RESMI
                                            </span>
                                            <button
                                                onClick={() => openModal('login')}
                                                className="bg-[#FF2D4B]/10 hover:bg-[#FF2D4B]/20 border border-[#FF2D4B]/25 text-white px-3 py-1 rounded-lg text-[9px] font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,45,75,0.15)]"
                                            >
                                                <Lock className="w-2.5 h-2.5 text-[#FF2D4B]" /> Login Untuk Lihat Prediksimu
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between w-full gap-1 select-none overflow-x-auto knockout-scroll min-h-[360px]">
                                            {/* 1. R32 LEFT */}
                                            <div className="flex flex-col justify-between h-full gap-2.5">
                                                {leftR32.map(id => <CompactMatchNode key={id} matchId={id} bracketData={officialBracket} />)}
                                            </div>

                                            {/* 2. R16 LEFT */}
                                            <div className="flex flex-col justify-around h-full min-h-[360px]">
                                                {leftR16.map(id => <CompactMatchNode key={id} matchId={id} bracketData={officialBracket} />)}
                                            </div>

                                            {/* 3. QF LEFT */}
                                            <div className="flex flex-col justify-around h-full min-h-[360px]">
                                                {leftQF.map(id => <CompactMatchNode key={id} matchId={id} bracketData={officialBracket} />)}
                                            </div>

                                            {/* 4. SF LEFT */}
                                            <div className="flex flex-col justify-center h-full min-h-[360px]">
                                                {leftSF.map(id => <CompactMatchNode key={id} matchId={id} bracketData={officialBracket} />)}
                                            </div>

                                            {/* 5. CENTER */}
                                            <div className="flex flex-col justify-center items-center gap-5 min-h-[360px] px-1 border-x border-white/[0.03]">
                                                <div className="flex flex-col items-center text-center bg-black/40 border border-[#FFC845]/20 p-2 rounded-xl w-[90px]">
                                                    <Trophy className="w-5 h-5 text-[#FFC845] drop-shadow-[0_0_6px_rgba(255,200,69,0.4)] mb-1" />
                                                    <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-black">CHAMPION</span>
                                                    <div className="w-6 h-4.5 rounded-[2px] overflow-hidden border border-white/5 mt-1.5">
                                                        <FlagIcon teamName={officialResult?.winners?.['FINAL_1']} className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[6px] text-zinc-500 uppercase tracking-wider font-bold mb-1">FINAL</span>
                                                    <CompactMatchNode matchId="FINAL_1" bracketData={officialBracket} />
                                                </div>
                                            </div>

                                            {/* 6. SF RIGHT */}
                                            <div className="flex flex-col justify-center h-full min-h-[360px]">
                                                {rightSF.map(id => <CompactMatchNode key={id} matchId={id} bracketData={officialBracket} />)}
                                            </div>

                                            {/* 7. QF RIGHT */}
                                            <div className="flex flex-col justify-around h-full min-h-[360px]">
                                                {rightQF.map(id => <CompactMatchNode key={id} matchId={id} bracketData={officialBracket} />)}
                                            </div>

                                            {/* 8. R16 RIGHT */}
                                            <div className="flex flex-col justify-around h-full min-h-[360px]">
                                                {rightR16.map(id => <CompactMatchNode key={id} matchId={id} bracketData={officialBracket} />)}
                                            </div>

                                            {/* 9. R32 RIGHT */}
                                            <div className="flex flex-col justify-between h-full gap-2.5">
                                                {rightR32.map(id => <CompactMatchNode key={id} matchId={id} bracketData={officialBracket} />)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            <div>

                                {/* Mobile dropdown stepper */}
                                <div className="sm:hidden block mb-6 relative">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2 pl-0.5">Pilih Babak</label>
                                    <div className="relative">
                                        <select
                                            value={activeRound}
                                            onChange={(e) => setActiveRound(e.target.value)}
                                            className="w-full bg-[#0F141C] border border-white/[0.08] text-white rounded-xl px-4 py-3 text-xs font-bold appearance-none focus:outline-none focus:border-[#FF2D4B]/50 transition-all cursor-pointer"
                                        >
                                            {ROUND_ORDER.map((round) => {
                                                const unlocked = isRoundUnlocked(round);
                                                const isDone = bracket[round].every((m) => !!winners[m.id]);
                                                const statusPrefix = !unlocked ? '🔒 ' : isDone ? '✓ ' : '⚔ ';
                                                return (
                                                    <option key={round} value={round} disabled={!unlocked} className="bg-[#0A0E14] text-white">
                                                        {statusPrefix} {ROUND_META[round].label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-500">
                                            <ChevronRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop round stepper */}
                                <div className="sm:flex hidden items-center gap-1.5 mb-6 overflow-x-auto pb-1 knockout-scroll">
                                    {ROUND_ORDER.map((round, idx) => {
                                        const unlocked = isRoundUnlocked(round);
                                        const isDone = bracket[round].every((m) => !!winners[m.id]);
                                        const isActive = activeRound === round;
                                        return (
                                            <React.Fragment key={round}>
                                                <button
                                                    onClick={() => unlocked && setActiveRound(round)}
                                                    disabled={!unlocked}
                                                    className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[11px] font-bold tracking-wide transition-all ${isActive
                                                        ? 'bg-[#FF2D4B] border-[#FF2D4B] text-white shadow-[0_0_16px_rgba(255,45,75,0.35)]'
                                                        : !unlocked
                                                            ? 'bg-white/[0.02] border-white/5 text-zinc-600 cursor-not-allowed'
                                                            : isDone
                                                                ? 'bg-[#FFC845]/10 border-[#FFC845]/25 text-[#FFC845] hover:bg-[#FFC845]/15'
                                                                : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/[0.06]'
                                                        }`}
                                                >
                                                    {!unlocked ? <Lock className="w-3 h-3" /> : isDone ? <CheckCircle2 className="w-3 h-3" /> : <Swords className="w-3 h-3" />}
                                                    {ROUND_META[round].short}
                                                </button>
                                                {idx < ROUND_ORDER.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>

                                {/* Matches grid OR champion reveal */}
                                {activeRound !== 'FINAL' ? (
                                    <motion.div
                                        key={activeRound}
                                        initial={{ opacity: 0, x: 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="grid grid-cols-2 gap-2 sm:gap-4"
                                    >
                                        {roundMatches.map((m) => (
                                            <MatchCard key={m.id} match={m} round={activeRound} meta={roundMeta?.find((rm) => rm.id === m.id)} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div key="final" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 mb-5 bg-[#FFC845]/10 border border-[#FFC845]/25 px-4 py-1.5 rounded-full">
                                            <Trophy className="w-4 h-4 text-[#FFC845]" />
                                            <span style={{ fontFamily: "'Anton', sans-serif" }} className="text-[#FFC845] text-sm tracking-widest">GRAND FINAL</span>
                                        </div>
                                        <div className="w-full max-w-sm mb-6">
                                            {bracket.FINAL[0] && <MatchCard match={bracket.FINAL[0]} round="FINAL" />}
                                        </div>
                                        <AnimatePresence mode="wait">
                                            {champion ? (
                                                <motion.div
                                                    key="champ"
                                                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    className="relative w-full max-w-sm"
                                                >
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC845] via-[#FF2D4B] to-[#FFC845] rounded-2xl blur-md opacity-40" />
                                                    <div className="relative bg-[#0A0E14] rounded-2xl border border-[#FFC845]/30 py-6 px-4 flex flex-col items-center text-center">
                                                        <img src={pialaImg} alt="Piala" className="w-24 h-24 object-contain drop-shadow-[0_0_14px_rgba(255,200,69,0.5)] mb-2" />
                                                        <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-bold mb-1">Juara Dunia 2026</span>
                                                        <h2 style={{ fontFamily: "'Anton', sans-serif" }} className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFC845] to-[#FF2D4B] tracking-wide">
                                                            {champion}
                                                        </h2>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} className="flex flex-col items-center py-4">
                                                    <Trophy className="w-16 h-16 text-zinc-700" />
                                                    <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mt-2">Belum Ada Juara</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                {/* Round nav footer */}
                                <div className="flex items-center justify-between mt-6">
                                    <button
                                        onClick={() => {
                                            const idx = ROUND_ORDER.indexOf(activeRound);
                                            if (idx > 0) setActiveRound(ROUND_ORDER[idx - 1]);
                                        }}
                                        disabled={activeRound === 'R32'}
                                        className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-zinc-300 disabled:opacity-0 transition-colors"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" /> Babak Sebelumnya
                                    </button>
                                    <button
                                        onClick={() => {
                                            const idx = ROUND_ORDER.indexOf(activeRound);
                                            const next = ROUND_ORDER[idx + 1];
                                            if (next && isRoundUnlocked(next)) setActiveRound(next);
                                        }}
                                        disabled={activeRound === 'FINAL' || !isRoundUnlocked(ROUND_ORDER[ROUND_ORDER.indexOf(activeRound) + 1])}
                                        className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-zinc-300 disabled:opacity-0 transition-colors"
                                    >
                                        Babak Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* ── SIDEBAR: SCORE + LEADERBOARD ── */}
                    <div className="space-y-5">
                        {session && (
                            <div className="bg-[#0F141C] border border-white/[0.06] rounded-2xl p-4">
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Poin Saya</h3>
                                <div className="flex items-end gap-2">
                                    <span style={{ fontFamily: "'Anton', sans-serif" }} className="text-3xl text-[#FFC845]">{officialResult ? myScore.points : '—'}</span>
                                    <span className="text-[11px] text-zinc-500 mb-1">poin</span>
                                </div>
                                {officialResult && (
                                    <p className="text-[10px] text-zinc-500 mt-1">{myScore.correctWinners} tebakan tepat</p>
                                )}
                            </div>
                        )}

                        <div className="bg-[#0F141C] border border-white/[0.06] rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                                <h3 className="text-[11px] font-bold text-[#FFC845] tracking-wide flex items-center gap-1.5 uppercase">
                                    <Star className="w-3.5 h-3.5 fill-[#FFC845] text-[#FFC845]" /> Leaderboard
                                </h3>
                                <span className="text-[8px] font-bold text-[#FF2D4B] bg-[#FF2D4B]/10 px-2 py-0.5 rounded border border-[#FF2D4B]/20 flex items-center gap-1">
                                    <Zap className="w-2.5 h-2.5" /> LIVE
                                </span>
                            </div>

                            {!officialResult?.leaderboardOpened ? (
                                <div className="text-center py-8">
                                    <Lock className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
                                    <p className="text-[10px] text-zinc-500">Leaderboard akan dibuka saat babak knockout dimulai.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative mb-3">
                                        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
                                        <input
                                            type="text"
                                            placeholder="Cari nama..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg pl-8 pr-2.5 py-1.5 text-[11px] text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF2D4B]/40"
                                        />
                                    </div>
                                    {isLoadingLeaderboard ? (
                                        <div className="flex flex-col items-center py-8 gap-2">
                                            <Loader2 className="w-5 h-5 text-[#FF2D4B] animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5 max-h-[280px] overflow-y-auto knockout-scroll pr-1">
                                            {sortedLeaderboard
                                                .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((u, idx) => {
                                                    const isMe = u.name === inputName;
                                                    return (
                                                        <div
                                                            key={u.id}
                                                            onClick={() => {
                                                                if (locked) {
                                                                    setSelectedViewerUser({
                                                                        name: u.name,
                                                                        winners: u.winners || {},
                                                                        scores: u.scores || {}
                                                                    });
                                                                }
                                                            }}
                                                            style={{ cursor: locked ? 'pointer' : 'default' }}
                                                            className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${locked ? 'hover:bg-white/[0.06] active:scale-[0.98]' : ''
                                                                } ${idx === 0 ? 'bg-[#FFC845]/10 border-[#FFC845]/25 text-[#FFC845]'
                                                                    : idx === 1 ? 'bg-white/5 border-white/10 text-zinc-300'
                                                                        : idx === 2 ? 'bg-[#FF2D4B]/5 border-[#FF2D4B]/15 text-[#FF8093]'
                                                                            : isMe ? 'bg-[#4FD1FF]/10 border-[#4FD1FF]/20 text-[#4FD1FF]'
                                                                                : 'bg-black/20 border-white/5 text-zinc-400'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2 truncate">
                                                                <span className="w-4 h-4 rounded bg-black/40 flex items-center justify-center text-[9px] font-black border border-white/5">{idx + 1}</span>
                                                                <span className="truncate">{u.name}</span>
                                                            </div>
                                                            <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="font-bold">{u.points}</span>
                                                        </div>
                                                    );
                                                })}
                                            {sortedLeaderboard.length === 0 && (
                                                <p className="text-center text-[10px] text-zinc-600 italic py-6">Belum ada peserta</p>
                                            )}
                                        </div>
                                    )}
                                    {leaderboardLastUpdated && (
                                        <p className="text-[8px] text-zinc-500 text-center mt-2.5 pt-2 border-t border-white/5 uppercase tracking-widest font-bold">
                                            Update terakhir: {leaderboardLastUpdated.toLocaleTimeString('id-ID')} WIB
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Scoring info */}
                        <div className="bg-[#0F141C] border border-white/[0.06] rounded-2xl p-4">
                            <button onClick={() => setIsRulesOpen((v) => !v)} className="w-full flex items-center justify-between text-left">
                                <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-2">
                                    <ShieldAlert className="w-3.5 h-3.5 text-[#FF2D4B]" /> Cara Penilaian Poin
                                </span>
                                <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isRulesOpen ? 'rotate-90' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isRulesOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="grid grid-cols-3 gap-1.5 mt-3 text-center">
                                            <div className="bg-black/30 border border-white/5 rounded-xl py-2 px-1">
                                                <p className="text-[7.5px] text-zinc-500 font-extrabold uppercase tracking-wider whitespace-nowrap">Skor Tepat</p>
                                                <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[#FFC845] font-black text-[13px] mt-0.5">3 pts</p>
                                            </div>
                                            <div className="bg-black/30 border border-white/5 rounded-xl py-2 px-1">
                                                <p className="text-[7.5px] text-zinc-500 font-extrabold uppercase tracking-wider whitespace-nowrap">Tim Menang</p>
                                                <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[#FFC845] font-black text-[13px] mt-0.5">2 pts</p>
                                            </div>
                                            <div className="bg-black/30 border border-white/5 rounded-xl py-2 px-1">
                                                <p className="text-[7.5px] text-zinc-500 font-extrabold uppercase tracking-wider whitespace-nowrap">Adu Penalti</p>
                                                <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[#FFC845] font-black text-[13px] mt-0.5">1 pt</p>
                                            </div>
                                        </div>
                                        <ul className="text-[10px] text-zinc-400 mt-4 space-y-2.5 pl-1.5 leading-relaxed list-none text-left">
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC845] mt-1.5 shrink-0 shadow-[0_0_4px_#FFC845]" />
                                                <span>
                                                    <strong className="text-[#FFC845]">3 Poin:</strong> Menebak tim pemenang dan skor pertandingan secara tepat.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC845] mt-1.5 shrink-0 shadow-[0_0_4px_#FFC845]" />
                                                <span>
                                                    <strong className="text-[#FFC845]">2 Poin:</strong> Menebak tim pemenang dengan tepat di waktu normal atau ekstra, tetapi skor salah.
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC845] mt-1.5 shrink-0 shadow-[0_0_4px_#FFC845]" />
                                                <span>
                                                    <strong className="text-[#FFC845]">1 Poin:</strong> Tim pilihan menang melalui adu penalti, tetapi skor salah.
                                                </span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ── MODAL (Submit / Login / Update) ── */}
                <AnimatePresence>
                    {modalMode && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={closeModal}
                                className="absolute inset-0 bg-black/85 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.95, y: 15, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 15, opacity: 0 }}
                                className="relative w-full max-w-md bg-[#0A0E14] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden z-10"
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF2D4B]/10 rounded-full blur-2xl pointer-events-none" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FFC845]/10 rounded-full blur-2xl pointer-events-none" />

                                {!isSaving && (
                                    <button onClick={closeModal} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}

                                {saveStatus === 'success' ? (
                                    <div className="flex flex-col items-center text-center py-6">
                                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            className="w-16 h-16 rounded-full bg-[#FFC845]/10 border border-[#FFC845]/30 flex items-center justify-center text-[#FFC845] mb-4">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </motion.div>
                                        <h3 style={{ fontFamily: "'Anton', sans-serif" }} className="text-lg text-white mb-2 tracking-wide">
                                            {modalMode === 'login' ? 'BERHASIL MASUK!' : 'PREDIKSI TERKIRIM!'}
                                        </h3>
                                        <p className="text-xs text-zinc-400 max-w-xs mb-4">
                                            {modalMode === 'login'
                                                ? <>Selamat datang kembali, <strong>{session?.username || inputName}</strong>! Prediksimu berhasil dimuat.</>
                                                : <>Terima kasih <strong>{session?.username || inputName}</strong>! Semoga juara pilihanmu benar.</>}
                                        </p>
                                        {officialResult && submittedScore && (
                                            <div className="w-full bg-black/30 border border-[#FFC845]/20 rounded-2xl p-4 text-center">
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Poin Kamu Saat Ini</p>
                                                <p style={{ fontFamily: "'Anton', sans-serif" }} className="text-4xl text-[#FFC845]">{submittedScore.points}</p>
                                                <p className="text-[10px] text-zinc-500 mt-1">{submittedScore.correctWinners} tebakan tepat</p>
                                            </div>
                                        )}
                                        {!officialResult && (
                                            <div className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-[11px] text-zinc-500">
                                                Poin akan dihitung ketika pertandingan resmi dimulai.
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#FF2D4B]/10 border border-[#FF2D4B]/25 flex items-center justify-center text-[#FF2D4B]">
                                                {modalMode === 'login' ? <Lock className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 style={{ fontFamily: "'Anton', sans-serif" }} className="text-base text-white tracking-wide">
                                                    {modalMode === 'login' ? 'MASUK AKUN' : session ? 'UPDATE PREDIKSI' : 'KIRIM PREDIKSI'}
                                                </h3>
                                                <p className="text-[11px] text-zinc-500">
                                                    {modalMode === 'login' ? 'Muat prediksi yang sudah tersimpan' : session ? `Diperbarui sebagai ${session.username}` : 'Bracket knockout lengkap kamu'}
                                                </p>
                                            </div>
                                        </div>

                                        {errorMsg && (
                                            <div className="mb-4 flex items-start gap-2 bg-[#FF2D4B]/10 border border-[#FF2D4B]/25 text-[#FF8093] px-3.5 py-2.5 rounded-xl text-xs font-semibold">
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                <span>{errorMsg}</span>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {/* Username — hidden when updating via session */}
                                            {!session && (
                                                <div>
                                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 pl-1">Nama / Username</label>
                                                    <input
                                                        type="text"
                                                        value={inputName}
                                                        onChange={(e) => { setInputName(e.target.value); if (errorMsg) setErrorMsg(''); }}
                                                        placeholder="Masukkan nama Anda..."
                                                        maxLength={30}
                                                        disabled={isSaving}
                                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF2D4B]/50 transition-colors disabled:opacity-50"
                                                    />
                                                </div>
                                            )}


                                            {/* Password */}
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 pl-1">
                                                    Password <span className="text-[#FF2D4B]">{session ? '(opsional — kosongkan jika tidak ingin ubah)' : '*'}</span>
                                                </label>
                                                <p className="text-[9px] text-zinc-500 font-medium pl-1 mb-2 leading-relaxed">
                                                    * Jangan gunakan password yang biasa Anda gunakan di akun penting lain. Password disimpan tanpa di-hash.
                                                </p>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={inputPassword}
                                                        onChange={(e) => { setInputPassword(e.target.value); if (errorMsg) setErrorMsg(''); }}
                                                        placeholder={session ? 'Kosongkan jika tidak ingin ganti password' : 'Min. 4 karakter'}
                                                        maxLength={30}
                                                        disabled={isSaving}
                                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pr-24 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF2D4B]/50 transition-colors disabled:opacity-50"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-[10px] font-bold"
                                                    >
                                                        {showPassword ? 'SEMBUNYIKAN' : 'TAMPILKAN'}
                                                    </button>
                                                </div>
                                            </div>


                                            {/* Contact — only on first submit */}
                                            {!session && modalMode === 'submit' && (
                                                <div>
                                                    <div className="flex items-center justify-between mb-2 pl-1">
                                                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Kontak (No. WA / Sosmed)</label>
                                                        <span className="text-[9px] text-zinc-500 font-bold uppercase italic">Opsional</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={inputContact}
                                                        onChange={(e) => setInputContact(e.target.value)}
                                                        placeholder="Contoh: @username / 081234..."
                                                        maxLength={50}
                                                        disabled={isSaving}
                                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF2D4B]/50 transition-colors disabled:opacity-50"
                                                    />
                                                </div>
                                            )}

                                            {/* Prediksi Juara preview — only on submit */}
                                            {modalMode === 'submit' && (
                                                <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-[11px] text-zinc-400 flex justify-between">
                                                    <span>Prediksi Juara:</span>
                                                    <span className="text-white font-extrabold">{champion || '—'}</span>
                                                </div>
                                            )}

                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={closeModal}
                                                    disabled={isSaving}
                                                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 font-bold py-3 rounded-xl text-xs transition-colors disabled:opacity-50"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={session ? updatePrediction : modalMode === 'login' ? loginAndLoad : submitPrediction}
                                                    disabled={isSaving || (!session && !inputName.trim()) || (!session && !inputPassword.trim()) || (modalMode === 'login' && !inputPassword.trim())}
                                                    className="flex-1 bg-gradient-to-r from-[#FF2D4B] to-[#FF5470] hover:brightness-110 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                                                >
                                                    {isSaving
                                                        ? (<><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>)
                                                        : session
                                                            ? (<><Save className="w-3.5 h-3.5" /> Update Prediksi</>)
                                                            : modalMode === 'login'
                                                                ? (<><Lock className="w-3.5 h-3.5" /> Masuk</>)
                                                                : (<><Send className="w-3.5 h-3.5" /> Kirim Prediksi</>)}
                                                </button>
                                            </div>

                                            {/* Switch mode link */}
                                            {!session && (
                                                <p className="text-center text-[10px] text-zinc-600">
                                                    {modalMode === 'login'
                                                        ? <><span>Belum pernah submit?</span> <button onClick={() => { setModalMode('submit'); setErrorMsg(''); }} className="text-[#FF2D4B] font-bold hover:underline">Buat prediksi baru</button></>
                                                        : <><span>Sudah pernah submit?</span> <button onClick={() => { setModalMode('login'); setErrorMsg(''); }} className="text-[#FF2D4B] font-bold hover:underline">Login untuk update</button></>}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
        </div>
    );
};

export default KnockoutPredictorPage;