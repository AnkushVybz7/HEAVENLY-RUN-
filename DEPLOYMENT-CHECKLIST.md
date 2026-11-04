# HEAVENLY-RUN ENERGY — DEPLOYMENT CHECKLIST & PRODUCTION GUIDE

This document summarizes configuration and verification steps for deploying the **HEAVENLY-RUN ENERGY** 3D platform to **Netlify** or a **Full-Stack Node/Cloud Run server**.

---

## 1. Official Instagram Integration

- **Official Username**: `@heavenly_run.energy`
- **Official URL**: `https://www.instagram.com/heavenly_run.energy/`
- **Status**: Live across all 4 pages (`/`, `/flavours`, `/mystery`, `/faq`), global `Footer.tsx`, and mobile navigation drawer in `Navbar.tsx`.
- **Promotional Section**: "FOLLOW THE FREQUENCY." with supporting copy: *"Follow us for new flavour announcements, launch updates and exclusive HEAVENLY-RUN reveals."* and CTA *"FOLLOW ON INSTAGRAM"* opening in a new tab.

---

## 2. Authentication & Public Access Policy

- **Google Authentication Removed**: All Google OAuth popups and buttons have been removed from the application.
- **Open Public Access**: Visitors can freely explore the Homepage, Flavours 3D Lab, The Mystery, and FAQ pages without mandatory registration.
- **First 50 Contest**: Available via the "SIGN IN / CONTEST" button, featuring the First 50 Can Name Offer with the opt-in checkbox enabled by default.
- **Founder Verification**:
  - Founder Email: `ankushbanerjeecool777@gmail.com`
  - Founder Password: `Ankush@123`
  - Unlocks the Fifth Page: `/admin-first-50` (First 50 Can Packaging portal with sign-up analytics).

---

## 3. Real 6-Digit Email OTP Verification Setup

Real cryptographic OTP verification protects:
1. **Flavour Lab Submissions** (`/flavours`)
2. **Contact & Inquiries** (`/faq`)

### Flow & Security:
- 6-digit numeric codes generated with `crypto.randomInt`.
- Hashed with HMAC-SHA256 and salted.
- 5-minute strict expiration.
- 60-second resend cooldown timer.
- Rate-limited to max 3 incorrect attempts.
- Disposable and temporary email domains automatically rejected.
- Single-use cryptographic verification token validated before form save.

### Email Delivery Provider (Resend):
1. Sign up for free at [resend.com](https://resend.com).
2. Generate an API key.
3. Configure environment variables in your deployment host:
   - `RESEND_API_KEY`: e.g. `re_abc123...`
   - `FROM_EMAIL`: e.g. `HEAVENLY-RUN <onboarding@resend.dev>` (for testing) or your verified domain like `verify@heavenlyrunenergy.com`.
4. If `RESEND_API_KEY` is not set, the API returns a clear offline status error message informing the user to configure credentials (no fake simulation).

---

## 4. Netlify Deployment Instructions

The repository is pre-configured with `netlify.toml` and serverless functions in `netlify/functions/`:

1. **Connect Repository to Netlify**:
   - Push your project repository to GitHub / GitLab.
   - In Netlify dashboard: **Add new site** > **Import an existing project**.

2. **Build Settings** (detected automatically via `netlify.toml`):
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Functions Directory**: `netlify/functions`

3. **Set Environment Variables in Netlify**:
   - Go to **Site Configuration** > **Environment Variables**.
   - Add:
     - `RESEND_API_KEY`: Your Resend API key.
     - `FROM_EMAIL`: `HEAVENLY-RUN <onboarding@resend.dev>` (or your verified domain).
     - `APP_URL`: Your Netlify site URL (e.g., `https://heavenly-run-energy.netlify.app`).

4. **Verify Function Endpoints**:
   - `/api/otp/send` -> redirected to `/.netlify/functions/send-otp`
   - `/api/otp/verify` -> redirected to `/.netlify/functions/verify-otp`
   - `/api/forms/submit` -> redirected to `/.netlify/functions/submit-form`

---

## 5. Express / Cloud Run / Node Deployment

For self-hosted or Docker/Cloud Run environments:
```bash
# 1. Install dependencies
npm install

# 2. Build client SPA
npm run build

# 3. Start full-stack server
node --loader tsx server.ts
# or
npm run preview
```

---

## 6. Pre-Launch Verification Completed

- [x] Instagram handle `@heavenly_run.energy` integrated across all four pages, footer, and navigation.
- [x] Google Auth completely removed; all public pages freely accessible.
- [x] Real 6-digit OTP verification implemented for Flavour Lab and FAQ contact form.
- [x] Founder login for Ankush Banerjee (`ankushbanerjeecool777@gmail.com`) with `Ankush@123` verified.
- [x] Cinematic loading screen with celestial orbits, nebula pulse, and reduced-motion handling verified.
- [x] Recharts sign-up analytics in `AdminFirst50Page.tsx` active.
- [x] Netlify functions & `netlify.toml` configured for production deploy.
