import React, { forwardRef, useMemo } from 'react';
import FlagIcon from './FlagIcon';
import logoWorldCupImg from '../../../assets/images/ImagesWorldCup/logo-world-cup.png';
import pialaImg from '../../../assets/images/ImagesWorldCup/piala.png';

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

export const DownloadTemplate = forwardRef(({
  groupAdvancers = {},
  roundOf32Winners = {},
  roundOf16Winners = {},
  quarterWinners = {},
  semiWinners = {},
  finalWinner = null,
  username
}, ref) => {

  const groupsWithThreeCount = useMemo(() =>
    Object.values(groupAdvancers).filter(t => t.length === 3).length,
    [groupAdvancers]);

  const isComplete = useMemo(() => {
    const vals = Object.values(groupAdvancers);
    if (vals.length !== 12) return false;
    return vals.filter(g => g.length === 3).length === 8 &&
      vals.filter(g => g.length === 2).length === 4;
  }, [groupAdvancers]);

  const thirdPlaceAssignment = useMemo(() => {
    if (!isComplete) return {};
    return assignThirdPlaceTeams(groupAdvancers);
  }, [groupAdvancers, isComplete]);

  const g1 = (id) => groupAdvancers[id]?.[0] ?? null;
  const g2 = (id) => groupAdvancers[id]?.[1] ?? null;
  const g3 = (slot) => thirdPlaceAssignment[slot]?.team ?? null;

  const r32 = useMemo(() => {
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
  }, [isComplete, groupAdvancers, thirdPlaceAssignment]);

  const r16 = useMemo(() => {
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
  }, [roundOf32Winners]);

  const qf = useMemo(() => {
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
  }, [roundOf16Winners]);

  const sf = useMemo(() => {
    return {
      left: { id: 'SF_L', t1: quarterWinners['QF_L1'], t2: quarterWinners['QF_L2'], desc: 'Semi Final Kiri' },
      right: { id: 'SF_R', t1: quarterWinners['QF_R1'], t2: quarterWinners['QF_R2'], desc: 'Semi Final Kanan' },
    };
  }, [quarterWinners]);

  const finalMatch = useMemo(() => {
    return { id: 'F_1', t1: semiWinners['SF_L'], t2: semiWinners['SF_R'] };
  }, [semiWinners]);

  const MatchBlock = ({ match, winners, roundKey }) => {
    if (!match) return null;
    const isT1Winner = winners[match.id] === match.t1 && match.t1;
    const isT2Winner = winners[match.id] === match.t2 && match.t2;

    return (
      <div style={{ backgroundColor: '#0d0d12', border: '1px solid #27272a', borderRadius: '12px', padding: '8px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[match.t1, match.t2].map((t, idx) => {
            const isWinner = (idx === 0 && isT1Winner) || (idx === 1 && isT2Winner);
            return (
              <div
                key={t || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: isWinner ? '#1e3a5f' : '#07070a',
                  border: isWinner ? '1px solid #3b82f644' : '1px solid transparent',
                  color: t ? (isWinner ? '#ffffff' : '#a1a1aa') : '#4b5563',
                  fontSize: '11px',
                  fontWeight: '600'
                }}
              >
                <div style={{ width: '18px', height: '12px', overflow: 'hidden', borderRadius: '2px', display: 'flex', alignItems: 'center' }}>
                  <FlagIcon teamName={t} className="w-full h-full object-cover" />
                </div>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t || 'TBD'}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      style={{
        width: '1920px',
        height: '1080px',
        backgroundColor: '#07070a',
        backgroundImage:
          'radial-gradient(ellipse 900px 600px at 15% 10%, #1e3a5f15 0%, transparent 80%), ' +
          'radial-gradient(ellipse 800px 500px at 85% 90%, #064e3b15 0%, transparent 80%)',
        padding: '32px 48px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}
    >
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <img src={logoWorldCupImg} alt="World Cup Logo" style={{ height: '72px', width: 'auto', objectContain: 'contain' }} />
          <div>
            <span style={{ fontSize: '10px', fontWeight: '900', color: '#60a5fa', textTransform: 'uppercase', tracking: '0.1em', backgroundColor: '#1e3a5f33', border: '1px solid #3b82f633', padding: '3px 12px', borderRadius: '9999px', display: 'inline-block' }}>
              FIFA World Cup 2026 Prediction Bracket
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', margin: '4px 0 0 0', letterSpacing: '-0.025em' }}>
              Hasil Prediksi Lengkap Turnamen
            </h1>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11px', color: '#71717a' }}>PREDIKSI OLEH</span>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#34d399', marginTop: '2px' }}>
            {username || 'Guest Predictor'}
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: 'flex', gap: '32px', flex: 1, marginTop: '24px', marginBottom: '16px', height: 'calc(100% - 140px)', overflow: 'hidden' }}>

        {/* LEFT COLUMN: GROUPS */}
        <div style={{ width: '640px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#60a5fa', borderBottom: '1px solid #1f2937', paddingBottom: '6px', margin: 0 }}>
            Fase Grup
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', overflow: 'hidden' }}>
            {WORLD_CUP_GROUPS.map((group) => {
              const sel = groupAdvancers[group.id] || [];
              return (
                <div key={group.id} style={{ backgroundColor: '#0d0d12', border: '1px solid #27272a', borderRadius: '12px', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937', paddingBottom: '4px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '900', color: '#60a5fa' }}>GRUP {group.id}</span>
                    <span style={{ fontSize: '9px', color: '#71717a' }}>{sel.length} Lolos</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                      ...sel.map(team => ({ team, rank: sel.indexOf(team) + 1, isSelected: true })),
                      ...group.teams.filter(t => !sel.includes(t)).map(team => ({ team, rank: null, isSelected: false }))
                    ].map(({ team, rank, isSelected }) => (
                      <div
                        key={team}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 6px',
                          borderRadius: '6px',
                          backgroundColor: isSelected ? (rank === 3 ? '#2d1f05' : '#07070a') : 'transparent',
                          border: isSelected 
                            ? `1px solid ${rank === 1 ? '#3b82f644' : rank === 2 ? '#10b98144' : '#f59e0b44'}`
                            : '1px solid transparent',
                          opacity: isSelected ? 1 : 0.45,
                          fontSize: '10px'
                        }}
                      >
                        <div style={{ width: '14px', height: '10px', overflow: 'hidden', borderRadius: '1px', display: 'flex', alignItems: 'center' }}>
                          <FlagIcon teamName={team} className="w-full h-full object-cover" />
                        </div>
                        <span style={{ flex: 1, color: isSelected ? '#e4e4e7' : '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team}</span>
                        {isSelected && (
                          <span style={{ fontSize: '8px', fontWeight: '900', color: rank === 1 ? '#60a5fa' : rank === 2 ? '#34d399' : '#fbbf24' }}>
                            R{rank}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: KNOCKOUT BRACKET */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#10b981', borderBottom: '1px solid #1f2937', paddingBottom: '6px', margin: 0 }}>
            Bagan Gugur (Knockout Stage)
          </h2>

          {isComplete ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, gap: '16px' }}>

              {/* Left Bracket columns */}
              <div style={{ display: 'flex', gap: '12px', flex: 1, alignItems: 'center' }}>
                {/* R32 Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: '900', color: '#60a5fa', textAlign: 'center', marginBottom: '4px' }}>R32 (KIRI)</div>
                  {r32.left.map(m => (
                    <MatchBlock key={m.id} match={m} winners={roundOf32Winners} />
                  ))}
                </div>

                {/* R16 Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: '900', color: '#60a5fa', textAlign: 'center', marginBottom: '4px' }}>R16</div>
                  {r16.left.map(m => (
                    <MatchBlock key={m.id} match={m} winners={roundOf16Winners} />
                  ))}
                </div>

                {/* QF Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '72px', flex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: '900', color: '#60a5fa', textAlign: 'center', marginBottom: '4px' }}>QF</div>
                  {qf.left.map(m => (
                    <MatchBlock key={m.id} match={m} winners={quarterWinners} />
                  ))}
                </div>

                {/* SF Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '120px', flex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: '900', color: '#60a5fa', textAlign: 'center', marginBottom: '4px' }}>SF</div>
                  {sf.left ? <MatchBlock match={sf.left} winners={semiWinners} /> : null}
                </div>
              </div>

              {/* CENTER: CHAMPION */}
              <div style={{ width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', backgroundColor: '#2d1f05', border: '1px solid #fbbf2433', padding: '4px 12px', borderRadius: '9999px' }}>
                  <img src={pialaImg} alt="Trophy" style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '9px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase' }}>GRAND FINAL</span>
                </div>

                {finalMatch ? (
                  <div style={{ width: '100%', marginBottom: '16px' }}>
                    <MatchBlock match={finalMatch} winners={{ F_1: finalWinner }} />
                  </div>
                ) : null}

                {finalWinner && (
                  <div style={{
                    width: '100%',
                    backgroundColor: '#0d0d12',
                    border: '2px solid #fbbf24',
                    borderRadius: '16px',
                    padding: '16px 12px',
                    textAlign: 'center',
                    boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)',
                    position: 'relative'
                  }}>
                    <div style={{ fontSize: '9px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>JUARA DUNIA</div>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                      <div style={{ width: '48px', height: '32px', overflow: 'hidden', borderRadius: '4px', border: '1px solid #27272a' }}>
                        <FlagIcon teamName={finalWinner} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {finalWinner}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Bracket columns */}
              <div style={{ display: 'flex', gap: '12px', flex: 1, alignItems: 'center' }}>
                {/* SF Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '120px', flex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: '900', color: '#34d399', textAlign: 'center', marginBottom: '4px' }}>SF</div>
                  {sf.right ? <MatchBlock match={sf.right} winners={semiWinners} /> : null}
                </div>

                {/* QF Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '72px', flex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: '900', color: '#34d399', textAlign: 'center', marginBottom: '4px' }}>QF</div>
                  {qf.right.map(m => (
                    <MatchBlock key={m.id} match={m} winners={quarterWinners} />
                  ))}
                </div>

                {/* R16 Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: '900', color: '#34d399', textAlign: 'center', marginBottom: '4px' }}>R16</div>
                  {r16.right.map(m => (
                    <MatchBlock key={m.id} match={m} winners={roundOf16Winners} />
                  ))}
                </div>

                {/* R32 Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: '900', color: '#34d399', textAlign: 'center', marginBottom: '4px' }}>R32 (KANAN)</div>
                  {r32.right.map(m => (
                    <MatchBlock key={m.id} match={m} winners={roundOf32Winners} />
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #27272a', borderRadius: '16px', backgroundColor: '#07070a' }}>
              <div style={{ textAlign: 'center', color: '#71717a', fontSize: '12px' }}>
                Lengkapi prediksi Fase Grup terlebih dahulu untuk membuka Bagan Gugur.
              </div>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1f2937', paddingTop: '12px', fontSize: '10px', color: '#52525b' }}>
        <span>FIFA World Cup 2026 Predictor</span>
        <span>CREATTED BY @ALLFITRA</span>
      </div>
    </div>
  );
});

DownloadTemplate.displayName = 'DownloadTemplate';
export default DownloadTemplate;