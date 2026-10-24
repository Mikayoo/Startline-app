# Startline

A settlement app for refugees and refugee claimants in Kitchener-Waterloo, Ontario. This is the working prototype of the version 1 core loop:

1. **Onboarding:** language, city, household (optional), status (optional) and up to 3 priorities.
2. **Plan:** fixed, versioned rules turn the answers into ordered steps grouped as Now, Soon and Later.
3. **Step detail:** plain-language actions, who the step is for, what to prepare, and its official sources.
4. **Ask Startline:** answers only from the source register, with citations. Urgent and personal questions go to a person.
5. **Get help:** a referral request with a preview of exactly what would be shared and explicit consent, in demo mode.
6. **Account (prototype):** save your plan with a phone number or email, a 6-digit passcode, optional Face ID, name and date of birth. The app locks on launch, and "Forgot passcode" resets it. Documents can be added from Your information.

The design comes from the v3.1 screens in Figma (`TiHKqEUApUi1FNNtRGzAC7`, pages "Onboarding v3" and "App v3.1").

## Prototype status

| Area | State |
| --- | --- |
| Data | Synthetic only. Nothing leaves the device. |
| Sources | Starter pack from the handoff. **None reviewed yet**; every record is `not-reviewed`. |
| Ask Startline | Demo mode: returns source passages word for word. No AI model is called. |
| Referrals | Demo mode: nothing is sent. |
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
  welcome.tsx            First screen
  onboarding/            Five questions, then the plan
  (tabs)/                Home, My Path, Ask, Get help
  step/[id].tsx          Step detail
  referral.tsx           Referral preview and consent (demo)
  privacy.tsx            Your information: account, documents, save and delete
  account/               Save plan, verify, passcode, Face ID, name, birthday, ready,
                         log in, unlock, reset, documents, scan
src/
  theme/tokens.ts        v3.1 colours, type, spacing (mirrors Figma variables)
  components/            Pill button, option card, chips, tab bar, step card
  content/sources.ts     Source register: one record per official page
  content/steps.ts       Step library and onboarding options
  logic/plan.ts          Plan rules (RULES_VERSION)
  logic/answer.ts        Retrieval, citations, urgent and personal routing
  state/AppState.tsx     Answers, progress, save and delete
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
