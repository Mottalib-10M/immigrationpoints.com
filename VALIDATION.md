# Validation — immigrationpoints.com

## Sources

- [IRCC — Express Entry](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
- [Australian Home Affairs](https://immi.homeaffairs.gov.au)

**Disclaimer:** Informational tool only. Does not replace official calculators or registered consultants (RCIC/MARA).

---

## Test Case 1: Express Entry CRS — Young skilled worker

**Input:** Age 29, Master's, CLB 10 all, 3yr Canadian exp, 3yr foreign exp, no spouse
**Expected CRS:**
- Age (20-29): 110
- Education (Master's): 135
- Language (CLB 10 x4): 136
- Canadian exp (3yr): 72
- Skill transferability: ~50
- **Total: ~503** (above recent draw cutoffs)

**Source:** canada.ca CRS grid

### Test Case 2: Australia Points — Subclass 189

**Input:** Age 32, Superior English, 5yr overseas, Bachelor's
**Expected:**
- Age 25-32: 30
- English Superior: 20
- Experience 3-5yr: 10
- Bachelor's: 15
- **Total: 75** (meets 65-point threshold)

**Source:** immi.homeaffairs.gov.au points test

### Test Case 3: CRS with spouse factors

**Input:** Principal age 35 + skilled spouse CLB 7
**Verification:**
- Spouse education/language add points (Section D)
- Combined score 20-40 points from spouse
- Skilled spouse = fewer core points but transferability bonus

---

## Build status

- **Build:** 33 pages, 0 errors
- **Tests:** 31/31 passed
- **Sitemap:** auto-generated (sitemap-index.xml)

## Page inventory (33 pages)

| Category | Count | Details |
|---|---|---|
| Home + legal | 3 | index, legal, privacy |
| Tool pages | 3 | canada, australia, faq |
| Guides index | 1 | /guides/ |
| Guide articles | 8 | how-crs-score-calculated, improve-crs-score, express-entry-draws, australia-189-vs-190-vs-491, ielts-clb-conversion, provincial-nominee-programs, proof-of-funds-immigration, immigration-processing-times |
| CRS score pages | 10 | crs-score-[range] (300-349 through 575-600) |
| Occupation pages | 8 | immigration-[occupation] (8 high-demand occupations) |

## Components

- CRSCalculator.tsx (Canada Express Entry CRS calculator)
- AustraliaCalculator.tsx (Australia 189/190/491 points test)

## Data files

- canada-crs-2026.ts — CRS scoring grid
- australia-points-2026.ts — Australia points test grid
- crs-scores-data.ts — 10 CRS score range entries
- occupations-data.ts — 8 occupation entries

## Quality gates

- [x] Build passes (33 pages, 0 errors)
- [x] Tests pass (31/31)
- [x] Sitemap generated
- [x] Schema.org on every page (WebApplication, FAQPage, BreadcrumbList)
- [x] Analytics: Plausible + GA4 placeholder
- [x] robots.txt present
- [x] llms.txt present
- [x] All guide pages > 1500 words
- [x] Disclaimer in footer (reinforced: informational only)
- [x] Mobile-responsive navigation (hamburger menu)
- [x] Internal cross-linking between tools and guides
