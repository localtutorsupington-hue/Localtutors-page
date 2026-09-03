# Local Tutors — Grade 3–6 Reading Check (MVP)

A single Google Apps Script (`Code.gs`) that builds:

- a parent-facing **Google Form** screening assessment (10 questions, one per
  page, with a progress bar, parent/child info section, and an optional
  "request a call" question), and
- a linked, **private** Google Sheet with automatically calculated scoring
  columns, plus
- an `onFormSubmit` trigger that scores every response and emails the parent
  a personalised Green / Orange / Red result with the right next step(s).

No custom website, backend, or database — just Google Forms + Google Sheets +
Apps Script, per the brief.

## 1. Setup (5 minutes, no coding required)

1. Go to **https://script.google.com** and click **New project** (or, from
   Google Drive: **New → More → Google Apps Script**). Do this while signed
   in as the Local Tutors Google account — everything gets created there.
2. Delete the placeholder `function myFunction() {}` code and paste in the
   entire contents of [`Code.gs`](./Code.gs).
3. (Optional) Rename the project, e.g. "Local Tutors Reading Check", via the
   project name field top-left.
4. Set `READING_GUIDE_URL` near the top of the file to your real Google
   Drive share link once you have it (see §4 below). It's fine to leave the
   placeholder for now — the script won't invent a URL.
5. In the editor toolbar, pick **setupLocalTutorsAssessment** from the
   function dropdown, then click **Run**.
6. The first run asks you to authorize the script — click **Review
   permissions**, choose the Local Tutors account, then **Advanced → Go to
   (project name) (unsafe) → Allow**. This warning is normal for
   scripts you paste in yourself; nothing leaves your Google account. See
   the **"WHAT GOOGLE PERMISSIONS IT NEEDS"** comment block at the top of
   `Code.gs` for exactly what's requested and why.
7. When it finishes, open **View → Logs** (or the clock/"Executions" icon in
   the left sidebar) to see three links it printed:
   - **Edit the Form** (edit URL) — for you, to tweak wording or apply the
     brand theme (see §3).
   - **Live Form link** (published URL) — **send this one to parents.**
   - **Response spreadsheet** — for you; stays private to your Google
     account (see §5).

   You can also just look in Google Drive's "My Drive": both are created
   there, titled **"Local Tutors — Grade 3–6 Reading Check"** (the Form) and
   **"Local Tutors — Grade 3–6 Reading Check (Responses)"** (the Sheet).

### Re-running the script

`setupLocalTutorsAssessment()` is safe to run more than once — it remembers
the Form/Sheet it created (in Script Properties) and, if they already exist,
just re-logs the links instead of creating a duplicate Form. To force a
brand-new Form/Sheet, run `resetLocalTutorsAssessment()` first (this only
forgets the stored links; it does **not** delete the old Form/Sheet — remove
those from Drive yourself if you don't need them), then run
`setupLocalTutorsAssessment()` again.

Run `getAssessmentLinks()` any time to reprint the current links without
creating anything.

## 2. How scoring works

Each of Questions 1–9 uses the same 5-point scale (Never=0 … Very often=4).
Question 10 uses its own scale (0, 0, 2, 4, 0). Maximum total = 40.

| Total score | Category |
|---|---|
| 0–10 | 🟢 GREEN |
| 11–20 | 🟠 ORANGE |
| 21–40 | 🔴 RED |

These are an **initial prototype screening framework**, not a clinically
validated diagnostic scale — the emails and Form copy deliberately avoid any
diagnostic language.

**Area analysis:** Q1+Q3 = Reading Fluency, Q2 = Word Decoding, Q4+Q5+Q6 =
Reading Comprehension, Q7+Q8+Q9 = Reading Attitude/Impact. The Sheet stores
each area's **average** per-question score (0–4), not a raw sum — this keeps
the 1-question Decoding area comparable to the 3-question Comprehension/
Attitude areas when picking the "Strongest Area".

### Why results are emailed, not shown on the confirmation screen

Google Forms can only branch ("skip to section") on a single question's own
answer — it can't branch on a score computed by adding up 10 different
questions. So the on-screen confirmation message is intentionally generic
("thanks, your results are on their way"). The real Green/Orange/Red result,
area feedback, and the correct call-to-action are computed in Apps Script and
emailed to the parent immediately after they submit. This is the simplest
MVP way to give a genuinely personalised result without a custom web app.
This also solves "different CTA per result category" — the email logic picks
the reading-guide link and/or the call-request message per category.

## 3. Applying the Local Tutors brand look

The Apps Script Forms API doesn't expose theme colour/font controls, so this
one step is manual (takes under a minute):

1. Open the Form's **edit URL**.
2. Click the paint-roller **"Customize theme"** icon (top right).
3. Set:
   - **Theme colour:** Education Blue `#2563A6`
   - **Background:** Off-White/Bone `#F2F0EB`
   - **Font:** "Nunito Sans" if listed (Manrope isn't a Google Forms theme
     font option); otherwise pick the plainest sans-serif option ("Basic").

Reference palette: Obsidian Black `#111111` · Off-White/Bone `#F2F0EB` ·
Education Blue `#2563A6` · Highlight Sky Blue `#8CC8E8` · White `#FFFFFF` ·
Soft Grey `#F2F5F7` · Charcoal `#1F2933`.

## 4. Changing the reading guide URL later

Edit the `READING_GUIDE_URL` constant near the top of `Code.gs` and save. No
need to re-run setup — the new link is used automatically on the very next
form submission (it's read fresh each time an email is sent). Rows already
recorded in the Sheet keep whatever URL was live when that parent was
emailed — that's intentional, it's an accurate record of what was actually
sent.

## 5. Changing the scoring thresholds later

Edit `SCORE_THRESHOLDS.GREEN_MAX` / `SCORE_THRESHOLDS.ORANGE_MAX` near the
top of `Code.gs` and save. No need to re-run setup.

## 6. Privacy

- The response Sheet is created privately in the Local Tutors Drive account
  — it is never published or shared by this script.
- `form.setPublishingSummary(false)` stops respondents from seeing an
  aggregate results summary link.
- `form.setShowLinkToRespondAgain(false)` keeps the post-submit screen
  minimal (no incentive to game the form / see others' data).
- The parent only enters their contact details once (in "About You & Your
  Child"); the closing call-request question is a plain Yes/No — it does not
  re-collect any contact info.
- No admin API or public endpoint is created — everything is either the
  Form's own submit flow, or manual review of the private Sheet.

## 7. Test plan

Run these against a real copy created by `setupLocalTutorsAssessment()`.
Logic (scoring math, category thresholds, area analysis, email content) was
also verified with an isolated Node.js harness that stubs the Google
services and runs `onFormSubmit()` directly against fabricated form
responses — see `apps-script/test/test_harness.js` — before this was tried
live; use the live steps below to confirm the parts a unit test can't reach
(actual Form UI, real Sheet, real Gmail delivery, real permissions).

| # | Check | Steps | Expected result |
|---|---|---|---|
| 1 | **All 10 questions present, one per page** | Open the live Form link. Click through with **Next**. | Exactly 10 question pages appear in the order from the brief, each with its own page (progress bar advances each time), plus the intro page, the "About You & Your Child" page, and the final optional call page. |
| 2 | **Progress tracking** | Same walkthrough. | A progress bar is visible and advances as you click Next. |
| 3 | **Parent information / required fields** | Try clicking Next on the "About You & Your Child" page with Name, Email, or Grade blank. | Form blocks submission and asks for the required field. Entering an invalid email (e.g. `abc`) is rejected by the email-format validation. |
| 4 | **Optional phone number** | Leave "Phone/WhatsApp Number" blank and complete the rest of the form. | Form submits successfully — phone is not required. |
| 5 | **GREEN result** | Submit the form answering "Never" to Q1–Q9 and "They are about where I would expect" to Q10, using a real inbox you can check. | Sheet row shows Total Score 0, Result Category GREEN. Email arrives titled "Your Results: Reading Appears to Be on Track" with a reading-guide line (real link if configured, "our team will send this to you shortly" if still the placeholder) and no call-request line. |
| 6 | **ORANGE result** | Submit answering "Sometimes" to Q1–Q9 and "They are slightly behind" to Q10 (totals 20). | Sheet row shows Total Score 20, Result Category ORANGE. Email titled "Your Results: Some Areas May Need Attention" includes both the reading-guide line and a call line. |
| 7 | **RED result** | Submit answering "Very often" to Q1–Q9 and "They are significantly behind" to Q10 (totals 40). | Sheet row shows Total Score 40, Result Category RED. Email titled "Your Results: Additional Reading Support May Be Beneficial" leads with the call line, then the guide line. |
| 8 | **Score calculation (boundaries)** | Craft responses totalling exactly 10, 11, 20, and 21 (mix of answers). | Category is GREEN at 10, ORANGE at 11 and 20, RED at 21 — confirms the boundary logic in `scoreToCategory_`. |
| 9 | **Area calculation** | Submit a response where only Q1 and Q3 are "Very often" (rest "Never"). | Sheet's "Strongest Area" column reads "Reading Fluency"; Reading Fluency Score = 4, other three area scores = 0. Repeat by making only Q2 the outlier to confirm "Word Decoding" surfaces correctly. |
| 10 | **Call-request field** | Submit once selecting "Yes, I'd like a free call" and once selecting "No, thank you" (and once leaving it blank, since it's optional). | Sheet's "Call Requested" column reads Yes / No / blank respectively, and no contact fields are asked again on that page. |
| 11 | **Guide URL configuration** | Update `READING_GUIDE_URL` in the script to a real link, save, then submit a new response. | The new response's email contains the real link; the Sheet's "Guide Link" column for that row shows the same real link. Older rows keep the placeholder text, unaffected. |
| 12 | **Response spreadsheet** | Open the response Sheet directly (not via a share link — confirm it opens only because you're signed into the Local Tutors account). | Row 1 has headers for every Form question plus all of `RESULT_COLUMNS` (Total Score, Result Category, 4 area scores, Strongest Area, Assessment Date/Time, Call Requested, Guide Link). Sheet is not shared/published (check **Share** button shows only your account). |
| 13 | **Idempotent setup** | Run `setupLocalTutorsAssessment()` a second time. | Logs show "An assessment Form already exists" and reprint the same links — no second Form/Sheet is created. |

### Automated logic tests (already run during development)

`apps-script/test/test_harness.js` loads `Code.gs` into a sandboxed Node
`vm` context (stubbing `Logger`, `MailApp`, and a fake in-memory Sheet) and
calls `onFormSubmit()` directly with fabricated `namedValues`, asserting:

- GREEN / ORANGE / RED totals and categories match hand-computed expected
  values (0, 20, and 40 respectively), including the exact 10/11/20/21
  category boundaries via `scoreToCategory_()`.
- Area analysis picks the correct "Strongest Area" and per-area averages
  when only one area's questions are elevated.
- No email is sent when the parent email field is missing.
- `ensureExtraHeaders_()` is idempotent — running it twice never duplicates
  header columns.
- The placeholder `READING_GUIDE_URL` is correctly detected and swapped for
  a non-broken sentence in the email body instead of a dead link.

Run it yourself with `node apps-script/test/test_harness.js` (plain Node.js,
no dependencies). This does **not** replace the live checks in the table
above — it can't touch the real Forms UI, real Sheet, or real email
delivery — but it does verify the scoring/email logic in `Code.gs` is
correct before you ever open the Apps Script editor.
