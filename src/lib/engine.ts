/**
 * Immigration Points Calculation Engine
 * Supports Canada CRS and Australia SkillSelect
 */

import {
  type EducationLevel,
  type AdditionalPointsInput,
  getAgePoints,
  getEducationPoints,
  getFirstLanguagePoints,
  getSecondLanguagePoints,
  getCanadianWorkExperiencePoints,
  calculateSkillTransferability,
  calculateAdditionalPoints,
  CRS_MAX_SCORE,
  EDUCATION_POINTS,
  CANADIAN_WORK_EXPERIENCE_POINTS,
  SPOUSE_LANGUAGE_POINTS,
} from './canada-crs-2026';

import {
  type EnglishLevel,
  type AustraliaEducation,
  type AustraliaBonuses,
  getAustraliaAgePoints,
  AU_ENGLISH_POINTS,
  AU_EDUCATION_POINTS,
  getOverseasWorkPoints,
  getAustralianWorkPoints,
  calculateBonusPoints,
  AU_PASS_MARK,
} from './australia-points-2026';

// ===================================================================
// Canada CRS Types
// ===================================================================
export interface CRSInput {
  age: number;
  educationLevel: EducationLevel;
  firstLanguageCLB: number;   // Lowest CLB across 4 abilities for first official language
  secondLanguageCLB: number;  // Lowest CLB across 4 abilities for second official language (0 if none)
  canadianWorkExperienceYears: number;
  foreignWorkExperienceYears: number;
  hasSpouse: boolean;

  // Spouse factors (only if hasSpouse is true)
  spouseEducation: EducationLevel;
  spouseFirstLanguageCLB: number;
  spouseCanadianWorkYears: number;

  // Skill transferability
  hasCertificateOfQualification: boolean;

  // Additional points
  additionalPoints: AdditionalPointsInput;
}

export interface CRSBreakdown {
  coreHumanCapital: {
    age: number;
    education: number;
    firstLanguage: number;
    secondLanguage: number;
    canadianWorkExperience: number;
    subtotal: number;
  };
  spouseFactors: {
    education: number;
    firstLanguage: number;
    canadianWorkExperience: number;
    subtotal: number;
  };
  skillTransferability: number;
  additionalPoints: number;
}

export interface CRSResult {
  totalScore: number;
  maxScore: number;
  breakdown: CRSBreakdown;
}

// ===================================================================
// Australia SkillSelect Types
// ===================================================================
export interface AUInput {
  age: number;
  englishLevel: EnglishLevel;
  educationLevel: AustraliaEducation;
  overseasWorkYears: number;
  australianWorkYears: number;
  bonuses: AustraliaBonuses;
}

export interface AUBreakdown {
  age: number;
  english: number;
  education: number;
  overseasWork: number;
  australianWork: number;
  bonuses: number;
}

export interface AUResult {
  totalScore: number;
  passMark: number;
  meetsPassMark: boolean;
  breakdown: AUBreakdown;
}

// ===================================================================
// Canada CRS Calculator
// ===================================================================
export function calculateCRS(input: CRSInput): CRSResult {
  const { hasSpouse } = input;

  // Core / Human Capital
  const agePoints = getAgePoints(input.age, hasSpouse);
  const educationPoints = getEducationPoints(input.educationLevel, hasSpouse);

  // Language: 4 abilities * points per ability
  const firstLangPerAbility = getFirstLanguagePoints(input.firstLanguageCLB, hasSpouse);
  const firstLanguageTotal = firstLangPerAbility * 4;

  const secondLangPerAbility = input.secondLanguageCLB > 0
    ? getSecondLanguagePoints(input.secondLanguageCLB, hasSpouse)
    : 0;
  const secondLanguageTotal = secondLangPerAbility * 4;

  const workExpPoints = getCanadianWorkExperiencePoints(input.canadianWorkExperienceYears, hasSpouse);

  const coreSubtotal = agePoints + educationPoints + firstLanguageTotal + secondLanguageTotal + workExpPoints;

  // Spouse factors
  let spouseEduPoints = 0;
  let spouseLangPoints = 0;
  let spouseWorkPoints = 0;

  if (hasSpouse) {
    spouseEduPoints = EDUCATION_POINTS[input.spouseEducation]?.spousePoints ?? 0;
    const spouseLangPerAbility = SPOUSE_LANGUAGE_POINTS[Math.min(input.spouseFirstLanguageCLB, 10)] ?? 0;
    spouseLangPoints = spouseLangPerAbility * 4;
    const clampedSpouseWork = Math.min(Math.max(input.spouseCanadianWorkYears, 0), 5);
    spouseWorkPoints = CANADIAN_WORK_EXPERIENCE_POINTS[clampedSpouseWork]?.spousePoints ?? 0;
  }

  const spouseSubtotal = spouseEduPoints + spouseLangPoints + spouseWorkPoints;

  // Skill transferability (max 100)
  const skillTransferabilityPoints = calculateSkillTransferability({
    educationLevel: input.educationLevel,
    firstLanguageCLB: input.firstLanguageCLB,
    canadianWorkYears: input.canadianWorkExperienceYears,
    foreignWorkYears: input.foreignWorkExperienceYears,
    hasCertificateOfQualification: input.hasCertificateOfQualification,
  });

  // Additional points (max 600)
  const additionalPts = calculateAdditionalPoints(input.additionalPoints);

  const totalScore = Math.min(
    coreSubtotal + spouseSubtotal + skillTransferabilityPoints + additionalPts,
    CRS_MAX_SCORE
  );

  return {
    totalScore,
    maxScore: CRS_MAX_SCORE,
    breakdown: {
      coreHumanCapital: {
        age: agePoints,
        education: educationPoints,
        firstLanguage: firstLanguageTotal,
        secondLanguage: secondLanguageTotal,
        canadianWorkExperience: workExpPoints,
        subtotal: coreSubtotal,
      },
      spouseFactors: {
        education: spouseEduPoints,
        firstLanguage: spouseLangPoints,
        canadianWorkExperience: spouseWorkPoints,
        subtotal: spouseSubtotal,
      },
      skillTransferability: skillTransferabilityPoints,
      additionalPoints: additionalPts,
    },
  };
}

// ===================================================================
// Australia SkillSelect Calculator
// ===================================================================
export function calculateAustraliaPoints(input: AUInput): AUResult {
  const agePoints = getAustraliaAgePoints(input.age);
  const englishPoints = AU_ENGLISH_POINTS[input.englishLevel] ?? 0;
  const educationPoints = AU_EDUCATION_POINTS[input.educationLevel] ?? 0;
  const overseasWorkPts = getOverseasWorkPoints(input.overseasWorkYears);
  const australianWorkPts = getAustralianWorkPoints(input.australianWorkYears);
  const bonusPts = calculateBonusPoints(input.bonuses);

  const totalScore = agePoints + englishPoints + educationPoints + overseasWorkPts + australianWorkPts + bonusPts;

  return {
    totalScore,
    passMark: AU_PASS_MARK,
    meetsPassMark: totalScore >= AU_PASS_MARK,
    breakdown: {
      age: agePoints,
      english: englishPoints,
      education: educationPoints,
      overseasWork: overseasWorkPts,
      australianWork: australianWorkPts,
      bonuses: bonusPts,
    },
  };
}
