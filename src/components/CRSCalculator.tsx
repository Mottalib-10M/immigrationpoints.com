import { useState, useCallback } from 'react';
import { calculateCRS } from '../lib/engine';
import type { CRSInput, CRSResult } from '../lib/engine';
import type { EducationLevel, AdditionalPointsInput } from '../lib/canada-crs-2026';

const EDUCATION_OPTIONS: { value: EducationLevel; label: string }[] = [
  { value: 'none', label: 'No formal education' },
  { value: 'secondary', label: 'Secondary school (high school)' },
  { value: 'oneYearDiploma', label: 'One-year post-secondary diploma' },
  { value: 'twoYearDiploma', label: 'Two-year post-secondary diploma' },
  { value: 'threeYearDiploma', label: 'Three-year post-secondary diploma' },
  { value: 'bachelor', label: "Bachelor's degree" },
  { value: 'twoPlusBachelor', label: 'Two or more post-secondary credentials' },
  { value: 'masters', label: "Master's degree" },
  { value: 'phd', label: 'Doctoral degree (PhD)' },
];

const CLB_OPTIONS = [
  { value: 0, label: 'None / Not tested' },
  { value: 4, label: 'CLB 4' },
  { value: 5, label: 'CLB 5' },
  { value: 6, label: 'CLB 6' },
  { value: 7, label: 'CLB 7' },
  { value: 8, label: 'CLB 8' },
  { value: 9, label: 'CLB 9' },
  { value: 10, label: 'CLB 10+' },
];

function defaultAdditional(): AdditionalPointsInput {
  return {
    provincialNomination: false,
    lmiaJobOffer00: false,
    lmiaJobOfferOther: false,
    canadianEducation1to2yr: false,
    canadianEducation3plusYr: false,
    frenchLanguageCLB7: false,
    frenchLanguageCLB7EnglishCLB5: false,
    siblingInCanada: false,
  };
}

export default function CRSCalculator() {
  const [age, setAge] = useState(30);
  const [education, setEducation] = useState<EducationLevel>('bachelor');
  const [firstLangCLB, setFirstLangCLB] = useState(9);
  const [secondLangCLB, setSecondLangCLB] = useState(0);
  const [canadianWorkYears, setCanadianWorkYears] = useState(0);
  const [foreignWorkYears, setForeignWorkYears] = useState(0);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseEducation, setSpouseEducation] = useState<EducationLevel>('none');
  const [spouseLangCLB, setSpouseLangCLB] = useState(0);
  const [spouseWorkYears, setSpouseWorkYears] = useState(0);
  const [hasCertificate, setHasCertificate] = useState(false);
  const [additional, setAdditional] = useState<AdditionalPointsInput>(defaultAdditional());
  const [result, setResult] = useState<CRSResult | null>(null);

  const handleCalculate = useCallback(() => {
    const input: CRSInput = {
      age,
      educationLevel: education,
      firstLanguageCLB: firstLangCLB,
      secondLanguageCLB: secondLangCLB,
      canadianWorkExperienceYears: canadianWorkYears,
      foreignWorkExperienceYears: foreignWorkYears,
      hasSpouse,
      spouseEducation,
      spouseFirstLanguageCLB: spouseLangCLB,
      spouseCanadianWorkYears: spouseWorkYears,
      hasCertificateOfQualification: hasCertificate,
      additionalPoints: additional,
    };
    setResult(calculateCRS(input));
  }, [age, education, firstLangCLB, secondLangCLB, canadianWorkYears, foreignWorkYears, hasSpouse, spouseEducation, spouseLangCLB, spouseWorkYears, hasCertificate, additional]);

  const selectClass = "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1";
  const sectionClass = "bg-white rounded-lg border border-neutral-200 p-6 mb-6";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div>
          {/* Core Human Capital */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-primary mb-4">Core / Human Capital Factors</h3>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Age</label>
                <input
                  type="number"
                  min={17}
                  max={50}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={selectClass}
                />
              </div>

              <div>
                <label className={labelClass}>Education Level</label>
                <select value={education} onChange={(e) => setEducation(e.target.value as EducationLevel)} className={selectClass}>
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>First Official Language (CLB Level)</label>
                <select value={firstLangCLB} onChange={(e) => setFirstLangCLB(Number(e.target.value))} className={selectClass}>
                  {CLB_OPTIONS.filter(o => o.value !== 0 || true).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Second Official Language (CLB Level)</label>
                <select value={secondLangCLB} onChange={(e) => setSecondLangCLB(Number(e.target.value))} className={selectClass}>
                  {CLB_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Canadian Work Experience (years)</label>
                <select value={canadianWorkYears} onChange={(e) => setCanadianWorkYears(Number(e.target.value))} className={selectClass}>
                  {[0, 1, 2, 3, 4, 5].map((y) => (
                    <option key={y} value={y}>{y === 5 ? '5+' : y} {y === 1 ? 'year' : 'years'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Foreign Work Experience (years)</label>
                <select value={foreignWorkYears} onChange={(e) => setForeignWorkYears(Number(e.target.value))} className={selectClass}>
                  {[0, 1, 2, 3, 4, 5].map((y) => (
                    <option key={y} value={y}>{y === 5 ? '5+' : y} {y === 1 ? 'year' : 'years'}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasCertificate"
                  checked={hasCertificate}
                  onChange={(e) => setHasCertificate(e.target.checked)}
                  className="rounded border-neutral-300"
                />
                <label htmlFor="hasCertificate" className="text-sm text-neutral-700">Certificate of Qualification (trade occupation)</label>
              </div>
            </div>
          </div>

          {/* Spouse */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-primary mb-4">Spouse / Common-law Partner</h3>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="hasSpouse"
                checked={hasSpouse}
                onChange={(e) => setHasSpouse(e.target.checked)}
                className="rounded border-neutral-300"
              />
              <label htmlFor="hasSpouse" className="text-sm text-neutral-700">I have a spouse or common-law partner</label>
            </div>

            {hasSpouse && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Spouse Education Level</label>
                  <select value={spouseEducation} onChange={(e) => setSpouseEducation(e.target.value as EducationLevel)} className={selectClass}>
                    {EDUCATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Spouse First Language (CLB)</label>
                  <select value={spouseLangCLB} onChange={(e) => setSpouseLangCLB(Number(e.target.value))} className={selectClass}>
                    {CLB_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Spouse Canadian Work Experience (years)</label>
                  <select value={spouseWorkYears} onChange={(e) => setSpouseWorkYears(Number(e.target.value))} className={selectClass}>
                    {[0, 1, 2, 3, 4, 5].map((y) => (
                      <option key={y} value={y}>{y === 5 ? '5+' : y} {y === 1 ? 'year' : 'years'}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Additional Points */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold text-primary mb-4">Additional Points</h3>
            <div className="space-y-3">
              {[
                { key: 'provincialNomination' as const, label: 'Provincial Nomination (PNP) — 600 pts' },
                { key: 'lmiaJobOffer00' as const, label: 'LMIA Job Offer — Senior Management (NOC 00) — 200 pts' },
                { key: 'lmiaJobOfferOther' as const, label: 'LMIA Job Offer — Other NOC — 50 pts' },
                { key: 'canadianEducation3plusYr' as const, label: 'Canadian Education (3+ year credential) — 30 pts' },
                { key: 'canadianEducation1to2yr' as const, label: 'Canadian Education (1-2 year credential) — 15 pts' },
                { key: 'frenchLanguageCLB7EnglishCLB5' as const, label: 'French CLB 7+ with English CLB 5+ — 50 pts' },
                { key: 'frenchLanguageCLB7' as const, label: 'French CLB 7+ (with English CLB 4 or lower) — 25 pts' },
                { key: 'siblingInCanada' as const, label: 'Sibling in Canada (citizen/PR) — 15 pts' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={key}
                    checked={additional[key]}
                    onChange={(e) => setAdditional((prev) => ({ ...prev, [key]: e.target.checked }))}
                    className="rounded border-neutral-300"
                  />
                  <label htmlFor={key} className="text-sm text-neutral-700">{label}</label>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Calculate CRS Score
          </button>
        </div>

        {/* Right: Results */}
        <div>
          {result && (
            <div className="sticky top-6">
              {/* Total Score */}
              <div className="bg-primary text-white rounded-lg p-6 mb-6 text-center">
                <p className="text-sm uppercase tracking-wide opacity-80">Your CRS Score</p>
                <p className="text-6xl font-bold my-2">{result.totalScore}</p>
                <p className="text-sm opacity-80">out of {result.maxScore}</p>
                <div className="mt-4 bg-white/20 rounded-full h-3">
                  <div
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{ width: `${Math.min((result.totalScore / result.maxScore) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Breakdown */}
              <div className={sectionClass}>
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Score Breakdown</h3>

                <div className="space-y-3">
                  <h4 className="font-medium text-neutral-700 text-sm">Core / Human Capital ({result.breakdown.coreHumanCapital.subtotal} pts)</h4>
                  <BreakdownRow label="Age" value={result.breakdown.coreHumanCapital.age} />
                  <BreakdownRow label="Education" value={result.breakdown.coreHumanCapital.education} />
                  <BreakdownRow label="First Language" value={result.breakdown.coreHumanCapital.firstLanguage} />
                  <BreakdownRow label="Second Language" value={result.breakdown.coreHumanCapital.secondLanguage} />
                  <BreakdownRow label="Canadian Work Exp." value={result.breakdown.coreHumanCapital.canadianWorkExperience} />

                  <div className="border-t border-neutral-200 pt-3 mt-3">
                    <h4 className="font-medium text-neutral-700 text-sm">Spouse Factors ({result.breakdown.spouseFactors.subtotal} pts)</h4>
                    <BreakdownRow label="Spouse Education" value={result.breakdown.spouseFactors.education} />
                    <BreakdownRow label="Spouse Language" value={result.breakdown.spouseFactors.firstLanguage} />
                    <BreakdownRow label="Spouse Work Exp." value={result.breakdown.spouseFactors.canadianWorkExperience} />
                  </div>

                  <div className="border-t border-neutral-200 pt-3 mt-3">
                    <BreakdownRow label="Skill Transferability" value={result.breakdown.skillTransferability} max={100} />
                  </div>

                  <div className="border-t border-neutral-200 pt-3 mt-3">
                    <BreakdownRow label="Additional Points" value={result.breakdown.additionalPoints} max={600} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="bg-neutral-100 rounded-lg p-8 text-center text-neutral-500">
              <p className="text-lg mb-2">Fill in your details and click "Calculate CRS Score"</p>
              <p className="text-sm">Your score breakdown will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, max }: { label: string; value: number; max?: number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-neutral-600">{label}</span>
      <span className="font-semibold text-neutral-800">
        {value}{max !== undefined ? <span className="text-neutral-400 font-normal"> / {max}</span> : null}
      </span>
    </div>
  );
}
