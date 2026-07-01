# Validation — ImmigrationPoints.com

## Project Overview
Immigration points calculator website supporting Canada Express Entry CRS and Australia SkillSelect points systems.

## Tech Stack
- **Framework:** Astro 5+ with React 19 islands
- **Styling:** Tailwind CSS v4 via @tailwindcss/vite
- **Testing:** Vitest
- **Language:** TypeScript (strict mode)
- **Node:** v22

## File Structure

```
immigrationpoints.com/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── env.d.ts
├── .gitignore
├── VALIDATION.md
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── styles/
    │   └── global.css          # Tailwind v4 + theme (primary=#1e40af, secondary=#dc2626)
    ├── lib/
    │   ├── canada-crs-2026.ts  # CRS data tables and helper functions
    │   ├── australia-points-2026.ts  # SkillSelect data tables and helpers
    │   ├── engine.ts           # Combined calculation engine with types
    │   └── engine.test.ts      # 30+ test cases
    ├── components/
    │   ├── CRSCalculator.tsx   # React — Canada CRS calculator
    │   └── AustraliaCalculator.tsx  # React — Australia points calculator
    ├── layouts/
    │   └── Layout.astro        # Base layout (lang="en", locale="en_US")
    └── pages/
        ├── index.astro         # Landing page (1500+ words)
        ├── canada/
        │   └── index.astro     # CRS calculator + guide (1500+ words)
        ├── australia/
        │   └── index.astro     # Points calculator + guide (1500+ words)
        ├── faq/
        │   └── index.astro     # 12 FAQs
        ├── legal/
        │   └── index.astro     # Legal disclaimer
        └── privacy/
            └── index.astro     # Privacy policy
```

## Data Accuracy

### Canada CRS (max 1,200 points)
- **Age:** 20-29 = 110 pts (without spouse), decreasing to 0 at 45+
- **Education:** PhD=150, Master=135, 2x Bachelor=128, Bachelor=120
- **Language (CLB per ability):** 10+=34, 9=31, 8=23, 7=17 (without spouse, first language)
- **Canadian Work Experience:** 1yr=40, 2yr=53, 3yr=64, 4yr=72, 5yr+=80
- **Skill Transferability:** 5 combinations, each max 50, section max 100
- **Additional:** PNP=600, LMIA=50/200, Canadian edu=15/30, French=25/50, sibling=15

### Australia SkillSelect (pass mark: 65)
- **Age:** 18-24=25, 25-32=30, 33-39=25, 40-44=15, 45-49=0
- **English:** Superior=20, Proficient=10, Competent=0
- **Overseas Work:** 3-4yr=5, 5-7yr=10, 8+=15
- **Australian Work:** 1-2yr=5, 3-4yr=10, 5-7yr=15, 8+=20
- **Education:** PhD=20, Bachelor=15, Diploma=10, Trade=10
- **Bonuses:** Australian study=5, specialist edu=5, NAATI=5, professional year=5, partner=5-10, state nom=5, regional=15

## Validation Steps

1. `npm install` — All dependencies install without errors
2. `npm test` — All 30+ test cases pass
3. `npm run build` — Production build completes without errors
4. All pages render with correct HTML lang="en" and og:locale="en_US"
5. Calculator components hydrate client-side via `client:load`
6. CRS scores capped at 1,200; skill transferability capped at 100
7. Australia pass/fail indicator correctly evaluates against 65-point threshold

## Sources
- IRCC: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system/grid.html
- Australia Department of Home Affairs: https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189/points-table
