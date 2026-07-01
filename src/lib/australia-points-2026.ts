/**
 * Australia SkillSelect Points System — 2026 Data
 * Pass mark: 65 points
 */

// ---------------------------------------------------------------------------
// Age
// ---------------------------------------------------------------------------
export type AustraliaAgeRange = '18-24' | '25-32' | '33-39' | '40-44' | '45-49';

export const AU_AGE_POINTS: Record<AustraliaAgeRange, number> = {
  '18-24': 25,
  '25-32': 30,
  '33-39': 25,
  '40-44': 15,
  '45-49': 0,
};

export function getAustraliaAgeRange(age: number): AustraliaAgeRange | null {
  if (age >= 18 && age <= 24) return '18-24';
  if (age >= 25 && age <= 32) return '25-32';
  if (age >= 33 && age <= 39) return '33-39';
  if (age >= 40 && age <= 44) return '40-44';
  if (age >= 45 && age <= 49) return '45-49';
  return null;
}

export function getAustraliaAgePoints(age: number): number {
  const range = getAustraliaAgeRange(age);
  if (!range) return 0;
  return AU_AGE_POINTS[range];
}

// ---------------------------------------------------------------------------
// English Language Ability
// ---------------------------------------------------------------------------
export type EnglishLevel = 'superior' | 'proficient' | 'competent';

export const AU_ENGLISH_POINTS: Record<EnglishLevel, number> = {
  superior: 20,
  proficient: 10,
  competent: 0,
};

// ---------------------------------------------------------------------------
// Overseas Work Experience (in skilled occupation)
// ---------------------------------------------------------------------------
export type OverseasWorkRange = 'none' | '3-4' | '5-7' | '8+';

export const AU_OVERSEAS_WORK_POINTS: Record<OverseasWorkRange, number> = {
  none: 0,
  '3-4': 5,
  '5-7': 10,
  '8+': 15,
};

export function getOverseasWorkRange(years: number): OverseasWorkRange {
  if (years >= 8) return '8+';
  if (years >= 5) return '5-7';
  if (years >= 3) return '3-4';
  return 'none';
}

export function getOverseasWorkPoints(years: number): number {
  return AU_OVERSEAS_WORK_POINTS[getOverseasWorkRange(years)];
}

// ---------------------------------------------------------------------------
// Australian Work Experience (in skilled occupation)
// ---------------------------------------------------------------------------
export type AustralianWorkRange = 'none' | '1-2' | '3-4' | '5-7' | '8+';

export const AU_AUSTRALIAN_WORK_POINTS: Record<AustralianWorkRange, number> = {
  none: 0,
  '1-2': 5,
  '3-4': 10,
  '5-7': 15,
  '8+': 20,
};

export function getAustralianWorkRange(years: number): AustralianWorkRange {
  if (years >= 8) return '8+';
  if (years >= 5) return '5-7';
  if (years >= 3) return '3-4';
  if (years >= 1) return '1-2';
  return 'none';
}

export function getAustralianWorkPoints(years: number): number {
  return AU_AUSTRALIAN_WORK_POINTS[getAustralianWorkRange(years)];
}

// ---------------------------------------------------------------------------
// Education Qualifications
// ---------------------------------------------------------------------------
export type AustraliaEducation = 'phd' | 'bachelor' | 'diploma' | 'trade';

export const AU_EDUCATION_POINTS: Record<AustraliaEducation, number> = {
  phd: 20,
  bachelor: 15,
  diploma: 10,
  trade: 10,
};

// ---------------------------------------------------------------------------
// Bonus Points
// ---------------------------------------------------------------------------
export interface AustraliaBonuses {
  australianStudyRequirement: boolean;  // 5 pts
  specialistEducation: boolean;          // 5 pts (STEM, ICT)
  naatiCredential: boolean;              // 5 pts
  professionalYear: boolean;             // 5 pts
  partnerSkills: 'none' | 'competentEnglish' | 'skilled'; // 0, 5, 10
  stateNomination: boolean;              // 5 pts (subclass 190)
  regionalNomination: boolean;           // 15 pts (subclass 491)
}

export function calculateBonusPoints(bonuses: AustraliaBonuses): number {
  let total = 0;
  if (bonuses.australianStudyRequirement) total += 5;
  if (bonuses.specialistEducation) total += 5;
  if (bonuses.naatiCredential) total += 5;
  if (bonuses.professionalYear) total += 5;

  if (bonuses.partnerSkills === 'skilled') total += 10;
  else if (bonuses.partnerSkills === 'competentEnglish') total += 5;

  if (bonuses.regionalNomination) total += 15;
  else if (bonuses.stateNomination) total += 5;

  return total;
}

export const AU_PASS_MARK = 65;
