import { createContext, useContext, useMemo, useState } from 'react';

const STEPS = ['resume', 'gap', 'courses', 'negotiate', 'summary'];

const JourneyContext = createContext(null);

export function JourneyProvider({ children }) {
  const [step, setStep] = useState('resume');
  const [skillProfile, setSkillProfile] = useState(null);
  const [gapResult, setGapResult] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [scorecard, setScorecard] = useState(null);

  function resetJourney() {
    setStep('resume');
    setSkillProfile(null);
    setGapResult(null);
    setSelectedSkillId(null);
    setCourses([]);
    setScorecard(null);
  }

  const incomeXContribution = useMemo(() => {
    if (!gapResult) return null;
    const gapScore = gapResult.matchPercentage;
    const negoAvg = scorecard
      ? Math.round(
          ((scorecard.clarityScore +
            scorecard.boundaryScore +
            scorecard.professionalismScore) /
            30) *
            100
        )
      : null;
    const combined =
      negoAvg == null ? gapScore : Math.round(gapScore * 0.6 + negoAvg * 0.4);
    return { gapScore, negoAvg, combined };
  }, [gapResult, scorecard]);

  const value = {
    STEPS,
    step,
    setStep,
    skillProfile,
    setSkillProfile,
    gapResult,
    setGapResult,
    selectedSkillId,
    setSelectedSkillId,
    courses,
    setCourses,
    scorecard,
    setScorecard,
    resetJourney,
    incomeXContribution,
  };

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  return useContext(JourneyContext);
}
