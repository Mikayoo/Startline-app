# Startline launch checklist

What has to be true before Startline is used by real people or sent to the App Store. Owner: **You** (Michael, with partners) or **Build** (development work).

## 1. Gates from the development handoff (nothing launches without these)

- [ ] **Partner agency** agrees to the pilot: receives referrals, reviews content, names a contact. (You)
- [ ] **Source review:** a caseworker checks every record in `src/content/sources.ts`; each gets `reviewStatus: 'approved'`, a `lastChecked` date and a reviewer. (You + partner)
- [ ] **Services check:** each service in `src/content/services.ts` confirms its details, hours, languages and eligibility. Remove the "Sample" labels only after this. (You)
- [ ] **Privacy review:** privacy policy, consent wording, data retention, and where data is stored. All data categories stored in Canada. (You + privacy reviewer)
- [ ] **Legal check** of wording about immigration and legal information. (You + lawyer or legal clinic)
- [ ] **Translations** for Arabic and the other pilot languages, checked by people, not only machine translated. (You + translators)

## 2. Product work (Build)

- [ ] Backend with real phone and email codes, accounts and saved plans stored in Canada.
- [ ] Ask Startline answer service on the server: same retrieval and safety routing, then a model phrases the answer. API key and spending cap on the server only.
- [ ] Referral channel to the partner agency, approved by the privacy reviewer.
- [ ] Real document camera, or remove documents from version 1.
- [ ] Remove every "Prototype", "Demo mode" and "Sample" label once the item behind it is real. Apple rejects demo apps.
- [ ] Final app icon, bundle ID (replace `app.startline.prototype`) and version.
- [ ] Accessibility pass: VoiceOver and TalkBack, larger text, contrast, reduced motion.
- [ ] Crash reporting; analytics only if the privacy review allows it.

## 3. Testing

- [x] End-to-end browser test of every main flow (36 checks) and the account flow.
- [x] Design review of all screens; flow breaks and visual lapses fixed.
- [ ] You test the full app on your phone, including Face ID and the call buttons.
- [ ] Usability test with 3 to 5 newcomers and settlement workers on a TestFlight build. Fix what they struggle with.

## 4. App Store

- [ ] Apple Developer account ($99 USD a year), ideally as an organization.
- [ ] App Store Connect listing: name, subtitle, description, keywords, support URL, privacy policy URL, age rating, screenshots.
- [ ] App Privacy labels: phone or email, name, date of birth, documents, and what each is used for.
- [ ] Account deletion inside the app that also deletes the server account.
- [ ] A test account for Apple's reviewers.
- [ ] Build with EAS, test on TestFlight, then submit for review.

## Suggested order

1. You test on your phone; partner agency conversations start.
2. Source and services review, privacy review and translations run in parallel.
3. Build the backend, Ask service and referral channel on a TestFlight build.
4. Usability test, then fixes.
5. Store listing and submission.
