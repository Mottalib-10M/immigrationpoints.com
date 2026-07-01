import { useState, useCallback } from 'react';
import { calculateAustraliaPoints } from '../lib/engine';
import type { AUInput, AUResult } from '../lib/engine';
import type { EnglishLevel, AustraliaEducation, AustraliaBonuses } from '../lib/australia-points-2026';

const ENGLISH_OPTIONS: { value: EnglishLevel; label: string }[] = [
  { value: 'superior', label: 'Superior (IELTS 8+)' },
  { value: 'proficient', label: 'Proficient (IELTS 7+)' },
  { value: 'competent', label: 'Competent (IELTS 6+)' },
];

const EDUCATION_OPTIONS: { value: AustraliaEducation; label: string }[] = [
  { value: 'phd', label: 'Doctoral degree (PhD)' },
  { value: 'bachelor', label: "Bachelor's degree" },
  { value: 'diploma', label: 'Diploma / Advanced diploma' },
  { value: 'trade', label: 'Trade qualification' },
];

function defaultBonuses(): AustraliaBonuses {
  return {
    australianStudyRequirement: false,
    specialistEducation: false,
    naatiCredential: false,
    professionalYear: false,
    partnerSkills: 'none',
    stateNomination: false,
    regionalNomination: false,
  };
}

export default function AustraliaCalculator() {
  const [age, setAge] = useState(28);
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>('competent');
  const [education, setEducation] = useState<AustraliaEducation>('bachelor');
  const [overseasWorkYears, setOverseasWorkYears] = useState(0);
  const [australianWorkYears, setAustralianWorkYears] = useState(0);
  const [bonuses, setBonuses] = useState<AustraliaBonuses>(defaultBonuses());
  const [result, setResult] = useState<AUResult | null>(null);

  const handleCalculate = useCallback(() => {
    const input: AUInput = {
      age,
      englishLevel,
      educationLevel: education,
      overseasWorkYears,
      australianWorkYears,
      bonuses,
    };
    setResult(calculateAustraliaPoints(input));
  }, [age, englishLevel, education, overseasWorkYears, australianWorkYears, bonuses]);

  const selectClass = "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1";
  const sectionClass = "bg-white rounded-lg border border-neutral-200 p-6 mb-6";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div>
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-primary mb-4">Personal Details</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Age</label>
                <input
                  type="number"
                  min={18}
                  max={50}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={selectClass}
                />
              </div>

              <div>
                <label className={labelClass}>English Language Ability</label>
                <select value={englishLevel} onChange={(e) => setEnglishLevel(e.target.value as EnglishLevel)} className={selectClass}>
                  {ENGLISH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Highest Education Qualification</label>
                <select value={education} onChange={(e) => setEducation(e.target.value as AustraliaEducation)} className={selectClass}>
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-primary mb-4">Work Experience</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Overseas Skilled Work Experience (years)</label>
                <select value={overseasWorkYears} onChange={(e) => setOverseasWorkYears(Number(e.target.value))} className={selectClass}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => (
                    <option key={y} value={y}>{y} {y === 1 ? 'year' : 'years'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Australian Skilled Work Experience (years)</label>
                <select value={australianWorkYears} onChange={(e) => setAustralianWorkYears(Number(e.target.value))} className={selectClass}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => (
                    <option key={y} value={y}>{y} {y === 1 ? 'year' : 'years'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-primary mb-4">Bonus Points</h3>
            <div className="space-y-3">
              {[
                { key: 'australianStudyRequirement' as const, label: 'Australian Study Requirement met — 5 pts' },
                { key: 'specialistEducation' as const, label: 'Specialist education qualification (STEM/ICT) — 5 pts' },
                { key: 'naatiCredential' as const, label: 'NAATI-accredited community language credential — 5 pts' },
                { key: 'professionalYear' as const, label: 'Professional Year in Australia completed — 5 pts' },
                { key: 'stateNomination' as const, label: 'State/Territory nomination (subclass 190) — 5 pts' },
                { key: 'regionalNomination' as const, label: 'Regional nomination or sponsorship (subclass 491) — 15 pts' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`au-${key}`}
                    checked={bonuses[key] as boolean}
                    onChange={(e) => setBonuses((prev) => ({ ...prev, [key]: e.target.checked }))}
                    className="rounded border-neutral-300"
                  />
                  <label htmlFor={`au-${key}`} className="text-sm text-neutral-700">{label}</label>
                </div>
              ))}

              <div className="mt-4">
                <label className={labelClass}>Partner Skills</label>
                <select
                  value={bonuses.partnerSkills}
                  onChange={(e) => setBonuses((prev) => ({
                    ...prev,
                    partnerSkills: e.target.value as 'none' | 'competentEnglish' | 'skilled',
                  }))}
                  className={selectClass}
                >
                  <option value="none">No partner / Partner not applicable</option>
                  <option value="competentEnglish">Partner has competent English — 5 pts</option>
                  <option value="skilled">Partner has skilled qualification + competent English — 10 pts</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Calculate Points
          </button>
        </div>

        {/* Right: Results */}
        <div>
          {result && (
            <div className="sticky top-6">
              {/* Total Score */}
              <div className={`rounded-lg p-6 mb-6 text-center ${result.meetsPassMark ? 'bg-green-700 text-white' : 'bg-secondary text-white'}`}>
                <p className="text-sm uppercase tracking-wide opacity-80">Your Points Score</p>
                <p className="text-6xl font-bold my-2">{result.totalScore}</p>
                <p className="text-sm opacity-80">Pass mark: {result.passMark} points</p>
                <div className="mt-4">
                  {result.meetsPassMark ? (
                    <span className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-semibold">
                      PASS — You meet the minimum points requirement
                    </span>
                  ) : (
                    <span className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-semibold">
                      BELOW PASS MARK — You need {result.passMark - result.totalScore} more points
                    </span>
                  )}
                </div>
              </div>

              {/* Breakdown */}
              <div className={sectionClass}>
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Score Breakdown</h3>
                <div className="space-y-3">
                  <BreakdownRow label="Age" value={result.breakdown.age} />
                  <BreakdownRow label="English Language" value={result.breakdown.english} />
                  <BreakdownRow label="Education" value={result.breakdown.education} />
                  <BreakdownRow label="Overseas Work Experience" value={result.breakdown.overseasWork} />
                  <BreakdownRow label="Australian Work Experience" value={result.breakdown.australianWork} />
                  <BreakdownRow label="Bonus Points" value={result.breakdown.bonuses} />
                  <div className="border-t border-neutral-200 pt-3 mt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-neutral-800">Total</span>
                      <span className="text-neutral-800">{result.totalScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="bg-neutral-100 rounded-lg p-8 text-center text-neutral-500">
              <p className="text-lg mb-2">Fill in your details and click "Calculate Points"</p>
              <p className="text-sm">Your score breakdown will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-neutral-600">{label}</span>
      <span className="font-semibold text-neutral-800">{value}</span>
    </div>
  );
}
