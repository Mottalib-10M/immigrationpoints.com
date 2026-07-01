import { describe, it, expect } from 'vitest';
import { calculateCRS, calculateAustraliaPoints } from './engine';
import type { CRSInput, AUInput } from './engine';
import { getAgePoints, getEducationPoints, calculateSkillTransferability, educationLanguagePoints, foreignWorkLanguagePoints, certificateLanguagePoints, calculateAdditionalPoints } from './canada-crs-2026';
import { getAustraliaAgePoints, getOverseasWorkPoints, getAustralianWorkPoints } from './australia-points-2026';

// ---------------------------------------------------------------------------
// Helper: default CRS input
// ---------------------------------------------------------------------------
function defaultCRSInput(overrides: Partial<CRSInput> = {}): CRSInput {
  return {
    age: 30,
    educationLevel: 'bachelor',
    firstLanguageCLB: 9,
    secondLanguageCLB: 0,
    canadianWorkExperienceYears: 0,
    foreignWorkExperienceYears: 0,
    hasSpouse: false,
    spouseEducation: 'none',
    spouseFirstLanguageCLB: 0,
    spouseCanadianWorkYears: 0,
    hasCertificateOfQualification: false,
    additionalPoints: {
      provincialNomination: false,
      lmiaJobOffer00: false,
      lmiaJobOfferOther: false,
      canadianEducation1to2yr: false,
      canadianEducation3plusYr: false,
      frenchLanguageCLB7: false,
      frenchLanguageCLB7EnglishCLB5: false,
      siblingInCanada: false,
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Helper: default Australia input
// ---------------------------------------------------------------------------
function defaultAUInput(overrides: Partial<AUInput> = {}): AUInput {
  return {
    age: 28,
    englishLevel: 'competent',
    educationLevel: 'bachelor',
    overseasWorkYears: 0,
    australianWorkYears: 0,
    bonuses: {
      australianStudyRequirement: false,
      specialistEducation: false,
      naatiCredential: false,
      professionalYear: false,
      partnerSkills: 'none',
      stateNomination: false,
      regionalNomination: false,
    },
    ...overrides,
  };
}

// ===================================================================
// Canada CRS Tests
// ===================================================================
describe('Canada CRS — Age Points', () => {
  it('should give 110 points for age 25 without spouse', () => {
    expect(getAgePoints(25, false)).toBe(110);
  });

  it('should give 105 points for age 30 without spouse', () => {
    expect(getAgePoints(30, false)).toBe(105);
  });

  it('should give 100 points for age 25 with spouse', () => {
    expect(getAgePoints(25, true)).toBe(100);
  });

  it('should give 0 points for age 45 and above', () => {
    expect(getAgePoints(45, false)).toBe(0);
    expect(getAgePoints(50, false)).toBe(0);
  });

  it('should give 0 points for age below 18', () => {
    expect(getAgePoints(16, false)).toBe(0);
  });
});

describe('Canada CRS — Education Points', () => {
  it('should give 150 points for PhD without spouse', () => {
    expect(getEducationPoints('phd', false)).toBe(150);
  });

  it('should give 135 points for masters without spouse', () => {
    expect(getEducationPoints('masters', false)).toBe(135);
  });

  it('should give 120 for bachelor with spouse', () => {
    expect(getEducationPoints('bachelor', true)).toBe(120);
  });
});

describe('Canada CRS — Language Combinations', () => {
  it('should calculate first language points correctly (CLB 9 without spouse)', () => {
    const result = calculateCRS(defaultCRSInput({ firstLanguageCLB: 9 }));
    // CLB 9 without spouse = 31 per ability * 4 = 124
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(124);
  });

  it('should add second language points when provided', () => {
    const result = calculateCRS(defaultCRSInput({ firstLanguageCLB: 9, secondLanguageCLB: 7 }));
    // Second language CLB 7 without spouse = 3 per ability * 4 = 12
    expect(result.breakdown.coreHumanCapital.secondLanguage).toBe(12);
  });
});

describe('Canada CRS — Skill Transferability', () => {
  it('should cap total skill transferability at 100', () => {
    const points = calculateSkillTransferability({
      educationLevel: 'phd',
      firstLanguageCLB: 10,
      canadianWorkYears: 5,
      foreignWorkYears: 5,
      hasCertificateOfQualification: true,
    });
    expect(points).toBeLessThanOrEqual(100);
    expect(points).toBe(100);
  });

  it('should return 50 for education+language with PhD and CLB 10', () => {
    expect(educationLanguagePoints('phd', 10)).toBe(50);
  });

  it('should return 0 for education+language with CLB below 7', () => {
    expect(educationLanguagePoints('phd', 6)).toBe(0);
  });

  it('should return 50 for foreign work + language with 3+ years and CLB 9', () => {
    expect(foreignWorkLanguagePoints(3, 9)).toBe(50);
  });

  it('should return 50 for certificate + language with CLB 7+', () => {
    expect(certificateLanguagePoints(true, 7)).toBe(50);
  });
});

describe('Canada CRS — Provincial Nomination', () => {
  it('should add 600 points for provincial nomination', () => {
    const input = defaultCRSInput({
      additionalPoints: {
        ...defaultCRSInput().additionalPoints,
        provincialNomination: true,
      },
    });
    const result = calculateCRS(input);
    expect(result.breakdown.additionalPoints).toBe(600);
  });
});

describe('Canada CRS — Additional Points', () => {
  it('should add 50 for LMIA job offer (non-00 NOC)', () => {
    const pts = calculateAdditionalPoints({
      provincialNomination: false,
      lmiaJobOffer00: false,
      lmiaJobOfferOther: true,
      canadianEducation1to2yr: false,
      canadianEducation3plusYr: false,
      frenchLanguageCLB7: false,
      frenchLanguageCLB7EnglishCLB5: false,
      siblingInCanada: false,
    });
    expect(pts).toBe(50);
  });

  it('should add 200 for LMIA job offer (NOC 00)', () => {
    const pts = calculateAdditionalPoints({
      provincialNomination: false,
      lmiaJobOffer00: true,
      lmiaJobOfferOther: false,
      canadianEducation1to2yr: false,
      canadianEducation3plusYr: false,
      frenchLanguageCLB7: false,
      frenchLanguageCLB7EnglishCLB5: false,
      siblingInCanada: false,
    });
    expect(pts).toBe(200);
  });
});

describe('Canada CRS — Full Calculation', () => {
  it('should not exceed 1200 max', () => {
    const input = defaultCRSInput({
      age: 25,
      educationLevel: 'phd',
      firstLanguageCLB: 10,
      secondLanguageCLB: 10,
      canadianWorkExperienceYears: 5,
      foreignWorkExperienceYears: 5,
      hasCertificateOfQualification: true,
      additionalPoints: {
        ...defaultCRSInput().additionalPoints,
        provincialNomination: true,
        lmiaJobOffer00: true,
        canadianEducation3plusYr: true,
        frenchLanguageCLB7EnglishCLB5: true,
        siblingInCanada: true,
        lmiaJobOfferOther: false,
        canadianEducation1to2yr: false,
        frenchLanguageCLB7: false,
      },
    });
    const result = calculateCRS(input);
    expect(result.totalScore).toBeLessThanOrEqual(1200);
  });
});

// ===================================================================
// Australia SkillSelect Tests
// ===================================================================
describe('Australia — Age Points', () => {
  it('should give 30 points for age 28', () => {
    expect(getAustraliaAgePoints(28)).toBe(30);
  });

  it('should give 25 points for age 20', () => {
    expect(getAustraliaAgePoints(20)).toBe(25);
  });

  it('should give 0 points for age 47', () => {
    expect(getAustraliaAgePoints(47)).toBe(0);
  });

  it('should give 15 points for age 42', () => {
    expect(getAustraliaAgePoints(42)).toBe(15);
  });
});

describe('Australia — English Level', () => {
  it('should give 20 points for superior English', () => {
    const result = calculateAustraliaPoints(defaultAUInput({ englishLevel: 'superior' }));
    expect(result.breakdown.english).toBe(20);
  });

  it('should give 0 points for competent English', () => {
    const result = calculateAustraliaPoints(defaultAUInput({ englishLevel: 'competent' }));
    expect(result.breakdown.english).toBe(0);
  });
});

describe('Australia — Work Experience', () => {
  it('should give 10 for 5 years overseas work', () => {
    expect(getOverseasWorkPoints(5)).toBe(10);
  });

  it('should give 5 for 1 year Australian work', () => {
    expect(getAustralianWorkPoints(1)).toBe(5);
  });

  it('should give 20 for 8+ years Australian work', () => {
    expect(getAustralianWorkPoints(10)).toBe(20);
  });
});

describe('Australia — Pass Mark', () => {
  it('should indicate pass when score >= 65', () => {
    const result = calculateAustraliaPoints(defaultAUInput({
      age: 28,
      englishLevel: 'superior',
      educationLevel: 'bachelor',
    }));
    // 30 + 20 + 15 = 65
    expect(result.totalScore).toBe(65);
    expect(result.meetsPassMark).toBe(true);
  });

  it('should indicate fail when score < 65', () => {
    const result = calculateAustraliaPoints(defaultAUInput({
      age: 42,
      englishLevel: 'competent',
      educationLevel: 'diploma',
    }));
    // 15 + 0 + 10 = 25
    expect(result.totalScore).toBe(25);
    expect(result.meetsPassMark).toBe(false);
  });
});

describe('Australia — Full Calculation', () => {
  it('should calculate total correctly with bonuses', () => {
    const result = calculateAustraliaPoints(defaultAUInput({
      age: 28,
      englishLevel: 'superior',
      educationLevel: 'phd',
      overseasWorkYears: 6,
      australianWorkYears: 4,
      bonuses: {
        australianStudyRequirement: true,
        specialistEducation: true,
        naatiCredential: false,
        professionalYear: false,
        partnerSkills: 'skilled',
        stateNomination: false,
        regionalNomination: true,
      },
    }));
    // 30 + 20 + 20 + 10 + 10 + (5+5+10+15) = 125
    expect(result.totalScore).toBe(125);
    expect(result.meetsPassMark).toBe(true);
  });
});
