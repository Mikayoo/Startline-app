# Startline

A settlement app for refugees and refugee claimants anywhere in Canada, with sample local services for Kitchener-Waterloo, Ontario. This is the working prototype of the version 1 core loop:

1. **Onboarding:** a short story splash, language, then 4 questions (situation, province and city, household, up to 3 priorities) and a Review screen.
2. **Plan:** fixed, versioned rules turn the answers into ordered steps grouped as Now, Soon and Later.
3. **Step detail:** plain-language actions, who the step is for, what to prepare, and its official sources.
4. **Ask Startline:** answers only from the source register, with citations. Urgent and personal questions go to a person.
5. **Help today:** urgent lines (911, 988, 211) and a referral request with a preview of exactly what would be shared and explicit consent, in demo mode.
6. **Account (prototype):** save your plan with a phone number or email, a 6-digit passcode, optional Face ID, name and date of birth. The app locks on launch, and "Forgot passcode" resets it. Documents can be added from Your information.
7. **Resources and Profile:** sample local services with detail pages you can save, your details with Change buttons, saved support and My dates (add, list and remove your own dates).

The design comes from the v3.1 screens in Figma (`TiHKqEUApUi1FNNtRGzAC7`, pages "Onboarding v3" and "App v3.1").

Before a real launch, work through [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

## Prototype status

| Area | State |
| --- | --- |
| Data | Synthetic only. Nothing leaves the device. |
| Sources | Starter pack from the handoff. **None reviewed yet**; every record is `not-reviewed`. |
| Ask Startline | Demo mode: returns source passages word for word. No AI model is called. |
| Referrals | Demo mode: nothing is sent. |
| Services | Sample: real organizations in Waterloo Region, but details are not yet checked with them. Labelled "Sample" in the app. |
| Languages | English only. Arabic and the third pilot language need reviewed translations. |
| Storage | In memory by default; saved on the device only when the user saves their plan. "Delete my data" removes everything. |
| Accounts | On this phone only. There is no server, codes and emails are not sent (any 6 digits work), and the passcode is stored as a SHA-256 hash. The document camera is not connected yet. |

Do not use this build with real participants until the partner, content and privacy gates in the development handoff are passed.

## Run it

```bash
npm install
npm run web        # browser
npm start          # Expo Go on a phone (scan the QR code)
npm test           # plan rules and answer engine
npm run typecheck
```

Requires Node 20 or newer. Expo SDK 58.

## Structure

```
app/                     Screens (expo-router)
  intro.tsx              Language (after the splash)
  welcome.tsx            Start: build a plan, browse, or log in
  onboarding/            Four questions, then the plan
  (tabs)/                Home, My Path, Ask, Resources, Profile
  step/[id].tsx          Step detail
  service/[id].tsx       Service detail
  help.tsx               Help today
  dates.tsx              My dates
  saved.tsx              Saved support
  referral.tsx           Referral preview and consent (demo)
  privacy.tsx            Your information: account, documents, save and delete
  account/               Save plan, verify, passcode, Face ID, name, birthday, ready,
                         log in, unlock, reset, documents, scan
src/
  theme/tokens.ts        v3.1 colours, type, spacing (mirrors Figma variables)
  components/            Pill button, option card, chips, tab bar, step card
  content/sources.ts     Source register: one record per official page
  content/steps.ts       Step library and onboarding options
  content/services.ts    Sample local services for Resources
  content/photos.ts      Photos from the v3.1 Figma file
  logic/plan.ts          Plan rules (RULES_VERSION)
  logic/answer.ts        Retrieval, citations, urgent and personal routing
  logic/account.ts       Phone and email checks, masking
  logic/dates.ts         Date building and labels
  state/AppState.tsx     Answers, progress, saved services, dates, account, save and delete
__tests__/               Unit tests
```

## Changing content

- **Add or update a source:** edit `src/content/sources.ts`. Set `reviewStatus: 'approved'`, `lastChecked` and `reviewer` only after a caseworker signs it off. A `withdrawn` source is never used in answers.
- **Add a step:** add it to `STEPS` in `src/content/steps.ts`, link at least one source, then place it in the rules in `src/logic/plan.ts` and bump `RULES_VERSION`.
- Run `npm test` after any content change. A test checks that every step points at sources that exist.

## Next

- Server-side answer service: same retrieval and safety checks, then a model phrases the answer. API key and spending cap on the server only (see `.env.example`).
- Backend for saved plans after Canada data residency is verified for every data category.
- Referral channel once a partner agency and privacy reviewer approve it.
- Arabic and the third language, with human-reviewed translations.
