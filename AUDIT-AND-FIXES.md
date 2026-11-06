# HEAVENLY-RUN website — source audit and fixes

## Fixes applied in this revision

- Removed the hardcoded founder password check. Founder access now requires Google sign-in with the configured founder email and a verified email address.
- Removed trust in the browser's `isAdmin` localStorage flag. Admin UI access is derived from Firebase Authentication, and the admin route is guarded even when opened directly.
- Replaced the permissive Firestore read rules. Subscriber, flavour-lab and contact records are readable only by the verified founder account; public users can only create validated submissions.
- Added field/type/length validation to Firestore create rules.
- Subscriber creation now uses a Firestore server timestamp. A browser-provided timestamp can no longer be used to manipulate the registration ordering.
- Removed the client-side collection-count calculation for first-50 positions. Client-side counts are race-prone and must not be represented as confirmed places. The admin page now describes registrations as interest requiring review.
- Flavour Lab and Contact forms now await Firebase writes and only show success after the write succeeds.
- Removed persistent localStorage copies of contact inquiries and flavour submissions. The page only displays submissions made during the current browser session.
- Corrected prototype/privacy copy so it no longer claims Firebase submissions are saved only locally.
- Updated the admin chart/date handling for Firestore Timestamp values.

## Important deployment steps

1. Deploy the revised `firestore.rules` to the exact Firebase project/database used by this app. Merely committing the rules file does not deploy it.
2. In Firebase Authentication, enable Google sign-in and verify the founder account email. Confirm the authorised email in both `src/App.tsx` and `firestore.rules` is the intended account.
3. Add the deployed website domains to Firebase Authentication's authorised domains.
4. Test Firestore rules with the Firebase Rules Playground or Emulator: anonymous create should work only for the validated public form collections; anonymous reads must fail; founder reads should succeed.
5. Enable Firebase App Check and add abuse/rate limiting (preferably a trusted Cloud Function) before accepting public traffic. Public create rules can still be spammed by automated clients.
6. A real, tamper-resistant first-50 allocation needs a trusted server-side transaction/Cloud Function. This revision intentionally does not promise a confirmed rank or prize from a browser-side counter.
7. Review privacy notice, consent, retention and applicable Indian data-protection requirements before collecting real names/emails.
8. Rotate the previously exposed founder password anywhere else it was reused. It has been removed from this source, but assume it was exposed.

## Remaining limitations / items requiring live configuration

- Google Forms API features require the right Google OAuth scopes, API enablement and a valid user access token. The token is held in memory and is not restored after a page refresh, so the Forms panel may need a fresh Google sign-in.
- The public registration flow is still intentionally simple. It has no email verification/deduplication, CAPTCHA, App Check enforcement or server-side rate limit yet.
- The app's Firebase client config is present in the repository. Firebase web API keys are client identifiers, not server secrets; security must come from Auth, Firestore rules, App Check and API restrictions.
- A dependency installation/build could not be completed in this environment because package installation timed out and `vite/client` dependencies were unavailable. Therefore this ZIP has not been confirmed by a successful production build or browser/device test.
- No claims are made that the Firebase rules have been deployed to the live project.

## Files changed

- `firestore.rules`
- `src/App.tsx`
- `src/components/SubscriberModal.tsx`
- `src/services/firebase.ts`
- `src/pages/AdminFirst50Page.tsx`
- `src/pages/FlavoursPage.tsx`
- `src/pages/FaqPage.tsx`
- `src/components/admin/SignUpTrendChart.tsx`
