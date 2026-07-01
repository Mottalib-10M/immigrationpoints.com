/**
 * Canada Express Entry Comprehensive Ranking System (CRS) — 2026 Data
 * Maximum CRS score: 1200 points
 *
 * Section A: Core/Human Capital Factors (max 500 with spouse, 460 without)
 * Section B: Spouse or Common-law Partner Factors (max 40)
 * Section C: Skill Transferability Factors (max 100)
 * Section D: Additional Points (max 600)
 */

// ---------------------------------------------------------------------------
// Age points
// ---------------------------------------------------------------------------
export interface AgePointsTable {
  [age: number]: { withSpouse: number; withoutSpouse: number };
}

export const AGE_POINTS: AgePointsTable = {
  17: { withSpouse: 0, withoutSpouse: 0 },
  18: { withSpouse: 90, withoutSpouse: 99 },
  19: { withSpouse: 95, withoutSpouse: 105 },
  20: { withSpouse: 100, withoutSpouse: 110 },
  21: { withSpouse: 100, withoutSpouse: 110 },
  22: { withSpouse: 100, withoutSpouse: 110 },
  23: { withSpouse: 100, withoutSpouse: 110 },
  24: { withSpouse: 100, withoutSpouse: 110 },
  25: { withSpouse: 100, withoutSpouse: 110 },
  26: { withSpouse: 100, withoutSpouse: 110 },
  27: { withSpouse: 100, withoutSpouse: 110 },
  28: { withSpouse: 100, withoutSpouse: 110 },
  29: { withSpouse: 100, withoutSpouse: 110 },
  30: { withSpouse: 95, withoutSpouse: 105 },
  31: { withSpouse: 90, withoutSpouse: 99 },
  32: { withSpouse: 85, withoutSpouse: 94 },
  33: { withSpouse: 80, withoutSpouse: 88 },
  34: { withSpouse: 75, withoutSpouse: 83 },
  35: { withSpouse: 70, withoutSpouse: 77 },
  36: { withSpouse: 65, withoutSpouse: 72 },
  37: { withSpouse: 60, withoutSpouse: 66 },
  38: { withSpouse: 55, withoutSpouse: 61 },
  39: { withSpouse: 50, withoutSpouse: 55 },
  40: { withSpouse: 45, withoutSpouse: 50 },
  41: { withSpouse: 35, withoutSpouse: 39 },
  42: { withSpouse: 25, withoutSpouse: 28 },
  43: { withSpouse: 15, withoutSpouse: 17 },
  44: { withSpouse: 5, withoutSpouse: 6 },
  45: { withSpouse: 0, withoutSpouse: 0 },
};

export function getAgePoints(age: number, hasSpouse: boolean): number {
  if (age < 18 || age >= 45) return 0;
  const entry = AGE_POINTS[age];
  if (!entry) return 0;
  return hasSpouse ? entry.withSpouse : entry.withoutSpouse;
}

// ---------------------------------------------------------------------------
// Education levels
// ---------------------------------------------------------------------------
export type EducationLevel =
  | 'none'
  | 'secondary'
  | 'oneYearDiploma'
  | 'twoYearDiploma'
  | 'threeYearDiploma'
  | 'bachelor'
  | 'twoPlusBachelor'
  | 'masters'
  | 'phd';

export interface EducationPoints {
  withSpouse: number;
  withoutSpouse: number;
  spousePoints: number;
}

export const EDUCATION_POINTS: Record<EducationLevel, EducationPoints> = {
  none:              { withSpouse: 0,   withoutSpouse: 0,   spousePoints: 0 },
  secondary:         { withSpouse: 28,  withoutSpouse: 30,  spousePoints: 2 },
  oneYearDiploma:    { withSpouse: 84,  withoutSpouse: 90,  spousePoints: 6 },
  twoYearDiploma:    { withSpouse: 91,  withoutSpouse: 98,  spousePoints: 7 },
  threeYearDiploma:  { withSpouse: 98,  withoutSpouse: 105, spousePoints: 8 },
  bachelor:          { withSpouse: 120, withoutSpouse: 120, spousePoints: 9 },
  twoPlusBachelor:   { withSpouse: 128, withoutSpouse: 128, spousePoints: 10 },
  masters:           { withSpouse: 135, withoutSpouse: 135, spousePoints: 10 },
  phd:               { withSpouse: 150, withoutSpouse: 150, spousePoints: 10 },
};

export function getEducationPoints(level: EducationLevel, hasSpouse: boolean): number {
  const entry = EDUCATION_POINTS[level];
  return hasSpouse ? entry.withSpouse : entry.withoutSpouse;
}

// ---------------------------------------------------------------------------
// Language (CLB levels) — First Official Language
// ---------------------------------------------------------------------------
export interface LanguageAbilityPoints {
  withSpouse: number;
  withoutSpouse: number;
}

/** Points per ability (speaking, listening, reading, writing) for first official language */
export const FIRST_LANGUAGE_POINTS: Record<number, LanguageAbilityPoints> = {
  10: { withSpouse: 32, withoutSpouse: 34 },
  9:  { withSpouse: 29, withoutSpouse: 31 },
  8:  { withSpouse: 22, withoutSpouse: 23 },
  7:  { withSpouse: 16, withoutSpouse: 17 },
  6:  { withSpouse: 8,  withoutSpouse: 9 },
  5:  { withSpouse: 6,  withoutSpouse: 6 },
  4:  { withSpouse: 6,  withoutSpouse: 6 },
};

/** Points per ability for second official language */
export const SECOND_LANGUAGE_POINTS: Record<number, LanguageAbilityPoints> = {
  10: { withSpouse: 6, withoutSpouse: 6 },
  9:  { withSpouse: 6, withoutSpouse: 6 },
  8:  { withSpouse: 3, withoutSpouse: 3 },
  7:  { withSpouse: 3, withoutSpouse: 3 },
  6:  { withSpouse: 1, withoutSpouse: 1 },
  5:  { withSpouse: 1, withoutSpouse: 1 },
};

/** Spouse language points per ability */
export const SPOUSE_LANGUAGE_POINTS: Record<number, number> = {
  10: 5,
  9: 5,
  8: 3,
  7: 3,
  6: 1,
  5: 1,
  4: 0,
};

export function getFirstLanguagePoints(clb: number, hasSpouse: boolean): number {
  if (clb >= 10) {
    const entry = FIRST_LANGUAGE_POINTS[10];
    return hasSpouse ? entry.withSpouse : entry.withoutSpouse;
  }
  if (clb < 4) return 0;
  const entry = FIRST_LANGUAGE_POINTS[clb];
  if (!entry) return 0;
  return hasSpouse ? entry.withSpouse : entry.withoutSpouse;
}

export function getSecondLanguagePoints(clb: number, hasSpouse: boolean): number {
  if (clb >= 10) {
    const entry = SECOND_LANGUAGE_POINTS[10];
    return hasSpouse ? entry.withSpouse : entry.withoutSpouse;
  }
  if (clb < 5) return 0;
  const entry = SECOND_LANGUAGE_POINTS[clb];
  if (!entry) return 0;
  return hasSpouse ? entry.withSpouse : entry.withoutSpouse;
}

// ---------------------------------------------------------------------------
// Canadian Work Experience
// ---------------------------------------------------------------------------
export interface WorkExperiencePoints {
  withSpouse: number;
  withoutSpouse: number;
  spousePoints: number;
}

export const CANADIAN_WORK_EXPERIENCE_POINTS: Record<number, WorkExperiencePoints> = {
  0: { withSpouse: 0,  withoutSpouse: 0,  spousePoints: 0 },
  1: { withSpouse: 35, withoutSpouse: 40, spousePoints: 5 },
  2: { withSpouse: 46, withoutSpouse: 53, spousePoints: 7 },
  3: { withSpouse: 56, withoutSpouse: 64, spousePoints: 8 },
  4: { withSpouse: 63, withoutSpouse: 72, spousePoints: 9 },
  5: { withSpouse: 70, withoutSpouse: 80, spousePoints: 10 },
};

export function getCanadianWorkExperiencePoints(years: number, hasSpouse: boolean): number {
  const clamped = Math.min(Math.max(years, 0), 5);
  const entry = CANADIAN_WORK_EXPERIENCE_POINTS[clamped];
  return hasSpouse ? entry.withSpouse : entry.withoutSpouse;
}

// ---------------------------------------------------------------------------
// Skill Transferability Factors (Section C — max 100 points)
// ---------------------------------------------------------------------------

/**
 * Skill transferability cross-reference combinations.
 * Each combination can yield max 50 points, but total Section C is capped at 100.
 */
export interface SkillTransferabilityInput {
  educationLevel: EducationLevel;
  firstLanguageCLB: number; // lowest CLB across abilities
  canadianWorkYears: number;
  foreignWorkYears: number;
  hasCertificateOfQualification: boolean;
}

/** Education + Language combination (max 50) */
export function educationLanguagePoints(education: EducationLevel, clb: number): number {
  if (clb < 7) return 0;
  const eduRank = getEducationRank(education);
  if (eduRank === 0) return 0;

  if (clb >= 9) {
    if (eduRank >= 3) return 50;
    if (eduRank >= 2) return 50;
    if (eduRank >= 1) return 25;
  }
  if (clb >= 7) {
    if (eduRank >= 3) return 25;
    if (eduRank >= 2) return 25;
    if (eduRank >= 1) return 13;
  }
  return 0;
}

/** Education + Canadian Work Experience combination (max 50) */
export function educationCanadianWorkPoints(education: EducationLevel, canadianYears: number): number {
  if (canadianYears < 1) return 0;
  const eduRank = getEducationRank(education);
  if (eduRank === 0) return 0;

  if (canadianYears >= 2) {
    if (eduRank >= 3) return 50;
    if (eduRank >= 2) return 50;
    if (eduRank >= 1) return 25;
  }
  if (canadianYears >= 1) {
    if (eduRank >= 3) return 25;
    if (eduRank >= 2) return 25;
    if (eduRank >= 1) return 13;
  }
  return 0;
}

/** Foreign Work Experience + Language combination (max 50) */
export function foreignWorkLanguagePoints(foreignYears: number, clb: number): number {
  if (clb < 7 || foreignYears < 1) return 0;

  if (clb >= 9) {
    if (foreignYears >= 3) return 50;
    if (foreignYears >= 1) return 25;
  }
  if (clb >= 7) {
    if (foreignYears >= 3) return 25;
    if (foreignYears >= 1) return 13;
  }
  return 0;
}

/** Foreign Work Experience + Canadian Work Experience combination (max 50) */
export function foreignWorkCanadianWorkPoints(foreignYears: number, canadianYears: number): number {
  if (foreignYears < 1 || canadianYears < 1) return 0;

  if (canadianYears >= 2) {
    if (foreignYears >= 3) return 50;
    if (foreignYears >= 1) return 25;
  }
  if (canadianYears >= 1) {
    if (foreignYears >= 3) return 25;
    if (foreignYears >= 1) return 13;
  }
  return 0;
}

/** Certificate of Qualification + Language combination (max 50) */
export function certificateLanguagePoints(hasCertificate: boolean, clb: number): number {
  if (!hasCertificate || clb < 5) return 0;
  if (clb >= 7) return 50;
  if (clb >= 5) return 25;
  return 0;
}

function getEducationRank(education: EducationLevel): number {
  switch (education) {
    case 'none': return 0;
    case 'secondary': return 0;
    case 'oneYearDiploma': return 1;
    case 'twoYearDiploma': return 1;
    case 'threeYearDiploma': return 2;
    case 'bachelor': return 2;
    case 'twoPlusBachelor': return 3;
    case 'masters': return 3;
    case 'phd': return 3;
    default: return 0;
  }
}

export function calculateSkillTransferability(input: SkillTransferabilityInput): number {
  const combo1 = educationLanguagePoints(input.educationLevel, input.firstLanguageCLB);
  const combo2 = educationCanadianWorkPoints(input.educationLevel, input.canadianWorkYears);
  const combo3 = foreignWorkLanguagePoints(input.foreignWorkYears, input.firstLanguageCLB);
  const combo4 = foreignWorkCanadianWorkPoints(input.foreignWorkYears, input.canadianWorkYears);
  const combo5 = certificateLanguagePoints(input.hasCertificateOfQualification, input.firstLanguageCLB);

  const total = combo1 + combo2 + combo3 + combo4 + combo5;
  return Math.min(total, 100); // Section C capped at 100
}

// ---------------------------------------------------------------------------
// Additional Points (Section D — max 600)
// ---------------------------------------------------------------------------
export interface AdditionalPointsInput {
  provincialNomination: boolean;        // 600 pts
  lmiaJobOffer00: boolean;              // NOC 00 senior — 200 pts
  lmiaJobOfferOther: boolean;           // Other NOC — 50 pts
  canadianEducation1to2yr: boolean;     // 15 pts
  canadianEducation3plusYr: boolean;    // 30 pts
  frenchLanguageCLB7: boolean;          // French CLB 7+ with English CLB 4 or lower — 25 pts
  frenchLanguageCLB7EnglishCLB5: boolean; // French CLB 7+ with English CLB 5+ — 50 pts
  siblingInCanada: boolean;             // 15 pts
}

export function calculateAdditionalPoints(input: AdditionalPointsInput): number {
  let total = 0;

  if (input.provincialNomination) total += 600;
  if (input.lmiaJobOffer00) total += 200;
  else if (input.lmiaJobOfferOther) total += 50;
  if (input.canadianEducation3plusYr) total += 30;
  else if (input.canadianEducation1to2yr) total += 15;
  if (input.frenchLanguageCLB7EnglishCLB5) total += 50;
  else if (input.frenchLanguageCLB7) total += 25;
  if (input.siblingInCanada) total += 15;

  return Math.min(total, 600);
}

export const CRS_MAX_SCORE = 1200;
