# HEAVENLY-RUN — private deployment and security checklist

This repository is configured for the Firebase project currently referenced by `firebase-applet-config.json`. The rules below are prepared locally; they are **not deployed** until a project owner runs the Firebase CLI with access to that project.

## 1. Before deployment

- Confirm that `gen-lang-client-0192116749` and database `ai-studio-heavenlyrunenerg-0fa87315-1930-4cc0-b455-05552541778d` are the intended private test project/database.
- Confirm the founder email in `firestore.rules` and `src/App.tsx` is the correct account.
- Rotate the previously exposed password anywhere it was reused. Do not put passwords, service-account JSON, OAuth client secrets, or private keys in this repository.
- Because this is a temporary private project, do not collect real visitor information until an adult/legal reviewer has approved the privacy notice, consent flow, retention/deletion process, and access controls.

## 2. Deploy Firestore rules

Install the Firebase CLI on a trusted computer and sign in with an account that has access to the Firebase project:

```bash
npm install -g firebase-tools
firebase login
firebase use gen-lang-client-0192116749
firebase deploy --only firestore:rules
```

The `firebase.json` file targets the named Firestore database. After deployment, use the Firebase Rules Playground or Emulator to verify:

- unauthenticated reads of `subscribers`, `flavourSubmissions`, and `contactInquiries` are denied;
- unauthenticated creates are allowed only for valid, correctly shaped form documents;
- a verified sign-in from the configured founder account can read the collections;
- other signed-in accounts cannot read private submissions.

Do not assume that a successful website build deploys Firestore rules. They are separate operations.

## 3. Configure Authentication

In Firebase Console → Authentication → Sign-in method, enable Google. Add the exact test/deployment hostnames under Authentication → Settings → Authorized domains. Verify the founder Google account's email. Do not use an email/password credential hardcoded in frontend code.

## 4. Configure App Check before public traffic

In Firebase Console → App Check, register the web app with reCAPTCHA Enterprise (or the supported provider selected in the console). Add the exact deployed domains and complete the provider verification. Integrate the returned site key in the client app, test in monitoring mode, then enable enforcement for Firestore only after legitimate requests are verified. Do not turn on enforcement before the client is configured or all public form writes may fail.

## 5. Abuse protection and first-50 claims

The browser must not assign a confirmed first-50 place. This build intentionally treats registrations as expressions of interest only. To run a real limited offer, implement a trusted Cloud Function using a Firestore transaction and server-side eligibility checks, add App Check enforcement and rate limiting, and publish clear terms/eligibility. Cloud Functions deployment may require enabling billing (Blaze) and must be reviewed by the project owner.

## 6. Build and test locally

```bash
npm install
npm run lint
npm run build
npm run dev
```

Test all routes, refresh/deep links, the 3D viewer on mobile and desktop, Google sign-in, form success/failure states, and the admin route with both founder and non-founder accounts. Check browser console and Firebase logs.

## 7. Private repository hygiene

- Keep the GitHub repository private while this is a temporary prototype.
- Firebase web API keys are public client identifiers; do not mistake them for server secrets. Protect data with rules, App Check, authentication, and API restrictions.
- Never commit service-account keys, `.env` files containing secrets, OAuth client secrets, or private access tokens.
- Delete test submissions before inviting testers if they contain personal information.

## Current honest status

- Firestore rules are prepared in this repository, not deployed.
- App Check is not configured because the project has no site key in its current config.
- There is no server-side first-50 allocation or server-side rate limiter in this client-only build.
- Build verification must be completed on a machine with dependencies installed; package installation timed out in the current environment.
