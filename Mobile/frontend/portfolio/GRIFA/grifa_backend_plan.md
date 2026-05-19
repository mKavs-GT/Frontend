# GRIFA — Backend Development Plan

## Codebase Overview

GRIFA (Global Research Initiative for Applied problems) is a React 19 + Vite single-page application built for **DPS (DP Sudhakar)** that connects students and researchers to real-world, undocumented community problems. The frontend is complete and production-deployed on Vercel.

**Core user flows:**

- Public users browse research **Problems**, view **Scientists/Mentors**, explore a live **Impact Map**, and purchase tiered **Research Plans** (₹99 – ₹29,999) via Razorpay.
- Authenticated users access a personal **Research Dashboard** (pipeline, journal, mentor, leaderboard, certificates).
- An **Admin Portal** manages enrollments, inbox messages, scientists, problems, plan simulation, analytics, and site settings (maintenance mode).

**Current backend state:** Firebase (Firestore + Auth + Storage) is used for the Admin Inbox (`inbox` collection) and the Impact Map (`communityReports` collection). All other data — enrollments, scientists, problems — is **hardcoded in JS files**. There is **no payment integration** despite Razorpay being mentioned in the UI.

---

## Backend Requirements Analysis

### 1. Database Design

#### Recommended: PostgreSQL (primary) + Redis (cache) + Firebase Storage (files)

> [!NOTE]
> Firebase Firestore is already partially used. A hybrid approach is recommended: keep Firestore for real-time features (Inbox, Impact Map) and use PostgreSQL for structured transactional data (payments, enrollments, users).

---

**Table: `users`**

```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
firebase_uid  TEXT UNIQUE NOT NULL        -- Firebase Auth UID
email         TEXT UNIQUE NOT NULL
display_name  TEXT
photo_url     TEXT
role          TEXT DEFAULT 'student'      -- 'student' | 'admin' | 'mentor'
pan_number    TEXT                        -- for 80G tax compliance
created_at    TIMESTAMPTZ DEFAULT NOW()
updated_at    TIMESTAMPTZ DEFAULT NOW()
```

**Table: `plans`** (seed data, admin-editable)

```sql
id            SERIAL PRIMARY KEY
slug          TEXT UNIQUE NOT NULL        -- 'explorer', 'analyst', etc.
name          TEXT NOT NULL
price_inr     INTEGER NOT NULL
description   TEXT
features      JSONB                       -- array of feature strings
is_active     BOOLEAN DEFAULT TRUE
sort_order    INTEGER DEFAULT 0
```

**Table: `enrollments`**

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id) ON DELETE CASCADE
plan_id         INTEGER REFERENCES plans(id)
razorpay_order_id   TEXT UNIQUE
razorpay_payment_id TEXT UNIQUE
amount_paid_inr INTEGER NOT NULL
currency        TEXT DEFAULT 'INR'
status          TEXT DEFAULT 'pending'   -- 'pending' | 'active' | 'failed' | 'refunded'
enrolled_at     TIMESTAMPTZ DEFAULT NOW()
expires_at      TIMESTAMPTZ              -- NULL = lifetime
```

**Table: `problems`**

```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
slug          TEXT UNIQUE NOT NULL
title         TEXT NOT NULL
category      TEXT NOT NULL
description   TEXT
tags          TEXT[]
views         INTEGER DEFAULT 0
status        TEXT DEFAULT 'draft'        -- 'draft' | 'active' | 'archived'
is_featured   BOOLEAN DEFAULT FALSE
created_by    UUID REFERENCES users(id)
created_at    TIMESTAMPTZ DEFAULT NOW()
updated_at    TIMESTAMPTZ DEFAULT NOW()
```

**Table: `scientists`**

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
name            TEXT NOT NULL
institution     TEXT
specialization  TEXT
tags            TEXT[]
image_url       TEXT
status          TEXT DEFAULT 'pending'    -- 'pending' | 'active' | 'revoked'
created_at      TIMESTAMPTZ DEFAULT NOW()
```

**Table: `community_reports`** _(mirrors Firestore, for analytics backup)_

```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
firestore_id  TEXT UNIQUE
title         TEXT NOT NULL
category      TEXT
description   TEXT
reporter_name TEXT
lat           DECIMAL(9,6)
lng           DECIMAL(9,6)
photo_url     TEXT
status        TEXT DEFAULT 'community'
archived      BOOLEAN DEFAULT FALSE
created_at    TIMESTAMPTZ DEFAULT NOW()
```

**Table: `add_on_purchases`**

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id)
add_on_slug     TEXT NOT NULL              -- 'extra-hour', 'plagiarism', etc.
razorpay_payment_id TEXT
amount_paid_inr INTEGER
status          TEXT DEFAULT 'pending'
purchased_at    TIMESTAMPTZ DEFAULT NOW()
```

**Table: `donations`**

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
donor_name      TEXT
donor_email     TEXT
pan_number      TEXT
amount_inr      INTEGER NOT NULL
razorpay_payment_id TEXT UNIQUE
status          TEXT DEFAULT 'pending'
donated_at      TIMESTAMPTZ DEFAULT NOW()
```

**Table: `contact_messages`**

```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
name        TEXT NOT NULL
email       TEXT NOT NULL
subject     TEXT
message     TEXT NOT NULL
ip_address  TEXT
created_at  TIMESTAMPTZ DEFAULT NOW()
```

**Table: `maintenance_windows`**

```sql
id          SERIAL PRIMARY KEY
start_at    TIMESTAMPTZ NOT NULL
end_at      TIMESTAMPTZ NOT NULL
reason      TEXT
message     TEXT
created_by  UUID REFERENCES users(id)
is_active   BOOLEAN DEFAULT TRUE
```

**Table: `user_research_progress`**

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id) UNIQUE
saved_problems  UUID[]                   -- array of problem IDs
pipeline_stage  TEXT DEFAULT 'ideation'
journal_entries JSONB DEFAULT '[]'
mentor_id       UUID REFERENCES scientists(id)
certificates    JSONB DEFAULT '[]'
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

---

### 2. API Endpoints

**Base URL:** `https://api.grifa.in/v1`

#### Auth

| Method  | Endpoint       | Description                                 |
| ------- | -------------- | ------------------------------------------- |
| `POST`  | `/auth/verify` | Verify Firebase ID token, upsert user in DB |
| `GET`   | `/auth/me`     | Get current user profile                    |
| `PATCH` | `/auth/me`     | Update profile (name, PAN)                  |

#### Plans & Enrollments

| Method | Endpoint                | Description                                          |
| ------ | ----------------------- | ---------------------------------------------------- |
| `GET`  | `/plans`                | List all active plans                                |
| `POST` | `/enrollments/initiate` | Create Razorpay order, return order_id               |
| `POST` | `/enrollments/verify`   | Verify Razorpay signature, activate enrollment       |
| `GET`  | `/enrollments/mine`     | Current user's enrollment history                    |
| `GET`  | `/enrollments`          | **[Admin]** All enrollments, filterable              |
| `GET`  | `/enrollments/stats`    | **[Admin]** KPIs: revenue, counts, tier distribution |

#### Donations

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| `POST` | `/donations/initiate` | Create Razorpay order for donation |
| `POST` | `/donations/verify`   | Verify + record donation           |
| `GET`  | `/donations`          | **[Admin]** All donations          |

#### Add-ons

| Method | Endpoint           | Description                     |
| ------ | ------------------ | ------------------------------- |
| `GET`  | `/addons`          | List available add-ons          |
| `POST` | `/addons/initiate` | Create payment order for add-on |
| `POST` | `/addons/verify`   | Verify add-on payment           |

#### Problems

| Method   | Endpoint                | Description                                        |
| -------- | ----------------------- | -------------------------------------------------- |
| `GET`    | `/problems`             | List problems (filter: category, status, featured) |
| `GET`    | `/problems/:slug`       | Get single problem, increment view count           |
| `POST`   | `/problems`             | **[Admin]** Create problem                         |
| `PATCH`  | `/problems/:id`         | **[Admin]** Update problem                         |
| `DELETE` | `/problems/:id`         | **[Admin]** Delete/archive problem                 |
| `PATCH`  | `/problems/:id/feature` | **[Admin]** Toggle featured                        |

#### Scientists

| Method  | Endpoint                 | Description                  |
| ------- | ------------------------ | ---------------------------- |
| `GET`   | `/scientists`            | List active scientists       |
| `POST`  | `/scientists`            | **[Admin]** Add scientist    |
| `PATCH` | `/scientists/:id`        | **[Admin]** Update scientist |
| `PATCH` | `/scientists/:id/status` | **[Admin]** Revoke/reinstate |

#### Community Reports (Impact Map)

| Method  | Endpoint               | Description                                  |
| ------- | ---------------------- | -------------------------------------------- |
| `POST`  | `/reports`             | Submit community report (syncs to Firestore) |
| `GET`   | `/reports`             | **[Admin]** All reports with analytics       |
| `PATCH` | `/reports/:id/status`  | **[Admin]** Update research status           |
| `PATCH` | `/reports/:id/archive` | **[Admin]** Archive report                   |

#### Contact

| Method | Endpoint   | Description                        |
| ------ | ---------- | ---------------------------------- |
| `POST` | `/contact` | Submit contact form (rate-limited) |

#### Settings (Admin)

| Method   | Endpoint                    | Description                   |
| -------- | --------------------------- | ----------------------------- |
| `GET`    | `/settings/maintenance`     | Get active maintenance window |
| `POST`   | `/settings/maintenance`     | Schedule maintenance window   |
| `DELETE` | `/settings/maintenance/:id` | Cancel maintenance window     |
| `GET`    | `/settings/platform`        | Get platform config           |
| `PATCH`  | `/settings/platform`        | Update platform config        |

#### Webhooks

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| `POST` | `/webhooks/razorpay` | Razorpay payment event handler |

---

### 3. Authentication and Authorization

**Strategy:** Firebase Authentication (frontend) + Custom JWT verification (backend).

**Flow:**

1. User signs in via Firebase (email/password or Google OAuth).
2. Frontend obtains Firebase ID Token.
3. Every API request sends `Authorization: Bearer <firebase_id_token>` header.
4. Backend middleware calls `firebase-admin.auth().verifyIdToken(token)` to validate.
5. User record is upserted in PostgreSQL on first verified request.

**Roles:**

- `student` — default role; can read public data, manage own dashboard, make purchases.
- `admin` — full access to Admin Portal APIs; set by UID match or a `roles` Firestore document.
- `mentor` — read access to assigned student data (future expansion).

**Admin verification:** Replace `HARDCODED_ADMIN_UID` in `AuthContext.jsx` with a Firestore document lookup (`/adminRoles/{uid}`) or a DB column `users.role = 'admin'`.

**Middleware chain:**

```
verifyFirebaseToken → attachUserFromDB → checkRole(required)
```

---

### 4. Business Logic

#### Payment Flow (Razorpay)

1. **Initiate:** Backend creates a Razorpay Order (`POST /v1/orders`) with `amount`, `currency`, `receipt`. Returns `order_id` to frontend.
2. **Frontend:** Razorpay checkout modal opens with `order_id`. On success, frontend receives `payment_id`, `order_id`, `signature`.
3. **Verify:** Backend validates `HMAC-SHA256(order_id + "|" + payment_id, razorpay_key_secret) === signature`. On match, enrollment is activated in DB.
4. **Webhook:** Razorpay sends `payment.captured` / `payment.failed` events to `/webhooks/razorpay` as a reliable fallback for the verify step.

#### Plan Upgrade Logic

- Upgrade cost = `new_plan.price - current_plan.price`
- A new partial-payment Razorpay order is created for the difference.
- On verification, old enrollment is marked `upgraded`, new one is `active`.

#### 7-Day Refund Eligibility

- Backend checks: `enrollment.enrolled_at > NOW() - INTERVAL '7 days'` AND `plan.slug IN ('explorer', 'analyst', 'researcher')` AND no mentorship sessions consumed.

#### View Count Increment

- `GET /problems/:slug` calls `UPDATE problems SET views = views + 1`. Use Redis atomic `INCR` and flush to DB every 60s to reduce write load.

#### Maintenance Mode

- `GET /settings/maintenance` is a public endpoint polled by the frontend every 60s.
- Returns the active window if `now BETWEEN start_at AND end_at`.
- Removes the need for in-memory React state — persisted in DB.

---

### 5. Security Vulnerabilities and Mitigation Strategies

| Vulnerability                       | Current State                                                                        | Mitigation                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **API Key Exposure**                | Firebase config (apiKey, etc.) is in plaintext in `config.js` committed to repo      | Use Vite env vars (`VITE_FIREBASE_*`), add `.env` to `.gitignore`, rotate the exposed key       |
| **Hardcoded Admin UID**             | `HARDCODED_ADMIN_UID = "PLACEHOLDER_ADMIN_UID"` — bypassed by `adminOverride` toggle | Remove `adminOverride` toggle entirely; verify admin role server-side only                      |
| **No Rate Limiting**                | Contact form and report form have no server-side rate limiting                       | Apply `express-rate-limit`: 5 req/min on `/contact`, 10 req/min on `/reports`                   |
| **Razorpay Signature Not Verified** | Payment buttons have no backend verification — anyone can fake a payment             | Always verify Razorpay HMAC signature on server before activating enrollment                    |
| **Firestore Rules**                 | Using default rules (possibly open)                                                  | Lock Firestore: `inbox` write = admin only; `communityReports` write = authenticated users only |
| **No CSRF Protection**              | N/A (SPA with Bearer tokens is safe by default)                                      | Ensure `Authorization: Bearer` header is required — browsers can't auto-send this               |
| **PAN Number Storage**              | PAN collected in Donate form, no encryption                                          | Store PAN encrypted at rest (AES-256 via `pgcrypto`); never log it                              |
| **Open Contact Form**               | No spam protection, no CAPTCHA                                                       | Add Google reCAPTCHA v3 on Contact and Report forms                                             |
| **Unvalidated File Uploads**        | `communityReports` photos uploaded directly to Firebase Storage                      | Validate MIME type server-side; limit file size to 5MB; scan with Cloud Vision API              |
| **CORS**                            | Not configured                                                                       | Restrict `Access-Control-Allow-Origin` to `https://grifa.in` only                               |

---

### 6. Data Validation and Sanitization

Use **Zod** (Node.js) for schema validation on all incoming request bodies.

| Endpoint                     | Validation Rules                                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /auth/verify`          | `idToken`: non-empty string                                                                                                                 |
| `POST /enrollments/initiate` | `plan_id`: integer, exists in DB; `user_id`: from token                                                                                     |
| `POST /enrollments/verify`   | `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`: all non-empty strings                                                     |
| `POST /donations/initiate`   | `amount_inr`: integer 1–1,000,000; `donor_name`: max 100 chars; `donor_email`: valid email; `pan_number`: regex `/^[A-Z]{5}[0-9]{4}[A-Z]$/` |
| `POST /reports`              | `title`: 5–200 chars; `description`: 20–2000 chars; `lat`: -90 to 90; `lng`: -180 to 180; `category`: enum                                  |
| `POST /contact`              | `name`: 2–100 chars; `email`: valid email; `message`: 10–2000 chars; HTML stripped                                                          |
| `POST /problems`             | `title`: 5–300 chars; `category`: enum; `slug`: slug format                                                                                 |
| `POST /scientists`           | `name`: required; `institution`: max 200 chars; `image_url`: valid URL or empty                                                             |

**Sanitization:** Use `DOMPurify` equivalent on server (`sanitize-html`) for any rich-text fields before storage.

---

### 7. Error Handling and Logging

**Error Response Format:**

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_VERIFICATION_FAILED",
    "message": "Razorpay signature mismatch.",
    "requestId": "req_abc123"
  }
}
```

**HTTP Status Codes:**
| Code | Usage |
|---|---|
| `200` | Success |
| `201` | Resource created |
| `400` | Validation error |
| `401` | Missing/invalid token |
| `403` | Insufficient role |
| `404` | Resource not found |
| `409` | Conflict (duplicate enrollment) |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

**Logging Strategy (Winston + Pino):**

- `INFO`: Successful enrollments, admin actions, payment events
- `WARN`: Failed payment verifications, rate limit hits, 404s
- `ERROR`: Unhandled exceptions, DB connection failures
- **Never log:** passwords, Razorpay signatures, PAN numbers, full Firebase tokens

**Log format:** Structured JSON with `timestamp`, `level`, `requestId`, `userId`, `method`, `path`, `statusCode`, `durationMs`.

---

### 8. Performance Optimization

| Area                       | Strategy                                                                                                             |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Problem view counts**    | Redis `INCR` counter, flush to PostgreSQL every 60s via cron                                                         |
| **Plans list**             | Cache in Redis with 5-minute TTL (rarely changes)                                                                    |
| **Scientists list**        | Cache in Redis with 10-minute TTL                                                                                    |
| **Admin enrollment stats** | Materialized view in PostgreSQL, refreshed every 5 minutes                                                           |
| **Database indexes**       | `users(firebase_uid)`, `enrollments(user_id)`, `enrollments(status)`, `problems(slug)`, `problems(category, status)` |
| **Image uploads**          | Serve from Firebase Storage CDN; generate thumbnails with Cloud Functions on upload                                  |
| **API response**           | Gzip compression via `compression` middleware                                                                        |
| **Connection pooling**     | Use `pg-pool` with max 20 connections                                                                                |

---

### 9. Technology Stack

| Component         | Technology                                 | Justification                                                               |
| ----------------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| **Runtime**       | Node.js 20 LTS                             | Same ecosystem as frontend; large Razorpay SDK support                      |
| **Framework**     | Express.js                                 | Lightweight, well-documented, large middleware ecosystem                    |
| **Primary DB**    | PostgreSQL 16 (Supabase or Railway)        | ACID transactions for payments; relational integrity for enrollments        |
| **Cache**         | Redis (Upstash)                            | Serverless-compatible; view counts, session, rate limiting                  |
| **Real-time**     | Firebase Firestore (existing)              | Keep for Inbox and Impact Map — no migration needed                         |
| **File Storage**  | Firebase Storage (existing)                | Already integrated in frontend                                              |
| **Auth**          | Firebase Auth + `firebase-admin` SDK       | Already implemented on frontend                                             |
| **Payment**       | Razorpay                                   | Mentioned in UI; best Indian payment gateway, supports UPI/cards/netbanking |
| **Email**         | Nodemailer + Gmail SMTP or Resend          | Transactional emails (receipts, confirmations)                              |
| **Validation**    | Zod                                        | TypeScript-compatible schema validation                                     |
| **ORM**           | Drizzle ORM                                | Lightweight, type-safe, works well with PostgreSQL                          |
| **Rate Limiting** | `express-rate-limit` + Redis store         | Prevent abuse on public endpoints                                           |
| **Deployment**    | Railway or Render (Node.js)                | Simple deploys, env management, free tier available                         |
| **Monitoring**    | Sentry (errors) + Logflare or Axiom (logs) | Free tiers sufficient for early stage                                       |

---

### 10. Deployment Strategy

**Environment Variables (never commit to repo):**

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
FIREBASE_PROJECT_ID=grifadpsp
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
ALLOWED_ORIGIN=https://grifa.in
PORT=3000
NODE_ENV=production
```

**Deployment steps:**

1. Create Railway/Render project → connect GitHub repo
2. Set all environment variables in dashboard
3. PostgreSQL addon → run Drizzle migrations (`drizzle-kit push`)
4. Upstash Redis → copy `REDIS_URL`
5. Firebase → create Service Account, download JSON, extract into env vars
6. Set `ALLOWED_ORIGIN=https://grifa.in` on Vercel for frontend
7. Add backend URL to Vite's `VITE_API_BASE_URL` env on Vercel
8. Health check endpoint: `GET /health` → `{ status: "ok", db: "connected" }`

**CI/CD:** GitHub Actions — lint → type-check → run migrations → deploy on merge to `main`.

---

## Modification and Rewriting Plan

### File: `src/firebase/config.js`

**Issue:** Firebase API key and config are hardcoded and visible in the repository.

```diff
- const firebaseConfig = {
-   apiKey: "AIzaSyAEDdDGsMvhksroqdytrOaQsgo43hnJcyk",
-   authDomain: "grifadpsp.firebaseapp.com",
-   ...
- };
+ const firebaseConfig = {
+   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
+   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
+   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
+   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
+   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
+   appId: import.meta.env.VITE_FIREBASE_APP_ID,
+ };
```

Create a `.env.local` file (gitignored) with all `VITE_FIREBASE_*` variables. **Rotate the exposed API key immediately in the Firebase console.**

---

### File: `src/context/AuthContext.jsx`

**Issues:** (1) `HARDCODED_ADMIN_UID = "PLACEHOLDER_ADMIN_UID"` — admin check is trivially bypassed. (2) `adminOverride` toggle allows anyone to gain admin access client-side.

```diff
- export const HARDCODED_ADMIN_UID = "PLACEHOLDER_ADMIN_UID";
- const [adminOverride, setAdminOverride] = useState(false);
- const isAdmin = firebaseAdmin || adminOverride;
- function toggleAdminMode() { setAdminOverride(prev => !prev); }

+ // Admin role fetched from Firestore /adminRoles/{uid}
+ const [firebaseAdmin, setFirebaseAdmin] = useState(false);
+ const isAdmin = firebaseAdmin;
```

In `onAuthStateChanged`, add:

```js
if (user) {
  const roleSnap = await getDoc(doc(db, "adminRoles", user.uid));
  setFirebaseAdmin(roleSnap.exists());
}
```

Remove `toggleAdminMode` from context value and delete `AdminToggle.jsx` component entirely.

---

### File: `src/data/purchaseData.js`

**Issue:** Enrollment data is a hardcoded static array. The Admin Dashboard shows fake data.

**Replace with:** An API call to `GET /v1/enrollments` from the backend. Create `src/hooks/useEnrollments.js`:

```js
export function useEnrollments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/v1/enrollments', {
      headers: { Authorization: `Bearer ${await getIdToken()}` }
    }).then(r => r.json()).then(r => { setData(r.data); setLoading(false); });
  }, []);
  return { data, loading };
}
```

Delete `purchaseData.js` after migration. Update `Overview.jsx`, `Enrollments.jsx`, `TierAnalytics.jsx`, and `AdminDashboard.jsx` to use this hook.

---

### File: `src/admin/pages/ScientistManager.jsx`

**Issue:** Scientists are hardcoded in `INIT_SCIENTISTS`. Changes are lost on page refresh.

**Replace with:** Firestore real-time listener (short-term) or REST API calls to `/v1/scientists`. Pattern mirrors how `Inbox.jsx` already uses Firestore `onSnapshot`. All `setScientists` mutations must call `updateDoc`/`addDoc`/`deleteDoc` on Firestore or `PATCH`/`POST`/`DELETE` on the REST API.

---

### File: `src/admin/pages/ProblemManager.jsx`

**Issue:** Problems hardcoded in `INIT_PROBLEMS`. Same issue as scientists.

**Replace with:** REST API calls. Also, the 7 problem data files in `src/data/problems/` (business.js, creative.js, etc.) should be **migrated to the database** using a one-time seed script. The `Problems.jsx` and `ProblemDetail.jsx` pages should then fetch from `GET /v1/problems` instead of importing static JS files.

---

### File: `src/admin/pages/Settings.jsx`

**Issue:** (1) Maintenance window is stored only in React state — lost on refresh. (2) "Save Platform Info" and "Update Password" buttons do nothing (no API call).

**Changes:**

- Maintenance windows: `POST /v1/settings/maintenance` to persist in DB. App.jsx polls `GET /v1/settings/maintenance` to detect active windows.
- Platform info: `PATCH /v1/settings/platform` persists to a `platform_config` table.
- Password: Delegate to Firebase Auth `updatePassword()` (already available via `firebase/auth`).
- Remove the `seedInbox` developer utility from the production Settings UI — move to a separate `npm run seed` script.

---

### File: `src/pages/Donate.jsx` and `src/pages/Plans.jsx`

**Issue:** Payment buttons are non-functional. Clicking "Proceed to Donate" or "Start Exploring" does nothing.

**Changes:** Integrate Razorpay checkout:

```js
const handlePayment = async (planId) => {
  // 1. Get Razorpay order from backend
  const { order_id, amount } = await fetch("/api/v1/enrollments/initiate", {
    method: "POST",
    body: JSON.stringify({ plan_id: planId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((r) => r.json());

  // 2. Open Razorpay modal
  const rzp = new window.Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount,
    order_id,
    currency: "INR",
    name: "GRIFA by DPSP",
    handler: async ({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    }) => {
      // 3. Verify on backend
      await fetch("/api/v1/enrollments/verify", {
        method: "POST",
        body: JSON.stringify({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/dashboard");
    },
  });
  rzp.open();
};
```

---

### File: `src/pages/Contact.jsx`

**Issue:** The contact form `<form>` has no `onSubmit` handler. Messages are never sent anywhere.

**Changes:** Add `onSubmit` that calls `POST /v1/contact`:

```js
const handleSubmit = async (e) => {
  e.preventDefault();
  await fetch("/api/v1/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, subject, message }),
  });
  setSubmitted(true);
};
```

---

### File: `src/pages/Dashboard.jsx` (and `src/dashboard/*`)

**Issue:** User dashboard shows hardcoded "Analyst Plan" in sidebar — not the user's actual enrollment. Research Pipeline, Saved Problems, Journal, and Mentor sections are static placeholders.

**Changes:**

- Fetch the user's active enrollment from `GET /v1/enrollments/mine` and display actual plan name.
- Saved problems: store in `user_research_progress.saved_problems` via `PATCH /v1/users/me/research`.
- Journal entries: store in `user_research_progress.journal_entries` (JSONB array).
- Mentor: display the scientist assigned via the admin, fetched from the user's research record.

---

## Conclusion

GRIFA's frontend is well-structured and production-ready, but the backend is currently a prototype shell. The critical gaps are:

1. **No real payment processing** — the most important gap; the business model depends on Razorpay integration.
2. **All data is hardcoded** — enrollments, scientists, and problems are static JS files with no persistence.
3. **Admin actions have no effect** — adding/editing scientists or problems is lost on refresh.
4. **Security vulnerabilities** — exposed Firebase API key, bypassable admin check, no input rate limiting.
5. **Maintenance mode is ephemeral** — stored in React state, lost on page reload.

The proposed backend (Node.js + Express + PostgreSQL + Redis + Firebase Admin) builds on the existing Firebase Auth and Firestore investment while adding the transactional reliability needed for payments, the persistence needed for content management, and the security needed for a production research platform. The migration can be done incrementally — starting with the Razorpay payment flow, then migrating static data to the database — without breaking the existing frontend.
