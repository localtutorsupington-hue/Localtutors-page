/**
 * =============================================================================
 *  LOCAL TUTORS — GRADE 3–6 READING CHECK
 *  Google Apps Script: builds the parent-facing screening Form, the linked
 *  response Google Sheet, and the scoring/results logic.
 * =============================================================================
 *
 *  WHAT THIS SCRIPT DOES
 *  ----------------------------------------------------------------------------
 *  Running setupLocalTutorsAssessment() once will:
 *    1. Create a new Google Form ("Local Tutors — Grade 3–6 Reading Check").
 *    2. Add the parent/child info section, then the 10 assessment questions
 *       (one per page, with the progress bar turned on), then an optional
 *       "would you like a call" question.
 *    3. Create a new Google Sheet and link it as the Form's response
 *       destination.
 *    4. Add calculated result columns to that Sheet (Total Score, Result
 *       Category, area scores, Strongest Area, etc).
 *    5. Install an onFormSubmit trigger that scores every new response and
 *       emails the parent their personalised Green / Orange / Red result.
 *
 *  HOW TO RUN THIS (for a non-developer)
 *  ----------------------------------------------------------------------------
 *  1. Go to https://script.google.com and click "New project"
 *     (or, from Google Drive: New > More > Google Apps Script).
 *  2. Delete any placeholder code in the editor, and paste in the ENTIRE
 *     contents of this file.
 *  3. Rename the project (top-left, e.g. "Local Tutors Reading Check") — this
 *     is optional but makes it easier to find later.
 *  4. Set the READING_GUIDE_URL constant below to your real Google Drive
 *     share link (see "CHANGING THE READING GUIDE URL" further down). It's
 *     fine to leave the placeholder for now and update it later.
 *  5. In the toolbar, make sure the function dropdown (next to "Debug") shows
 *     "setupLocalTutorsAssessment", then click "Run".
 *  6. The FIRST time you run it, Google will ask you to authorize the script.
 *     Click "Review permissions" > choose your Local Tutors Google account >
 *     "Advanced" > "Go to (project name) (unsafe)" > "Allow".
 *     This warning is normal for scripts you write/paste yourself — nothing
 *     is being sent anywhere outside your own Google account.
 *  7. When it finishes, open "Executions" (left sidebar, clock icon) or
 *     "View > Logs" to see the links it printed:
 *        - the Form's edit URL (for you, to tweak wording/theme)
 *        - the Form's live URL (send THIS one to parents)
 *        - the response Spreadsheet URL (for you, to review results)
 *     You can also just look in Google Drive — both the Form and the Sheet
 *     are created in the same account's "My Drive" root folder, titled
 *     "Local Tutors — Grade 3–6 Reading Check" and
 *     "Local Tutors — Grade 3–6 Reading Check (Responses)".
 *
 *  WHAT GOOGLE PERMISSIONS IT NEEDS, AND WHY
 *  ----------------------------------------------------------------------------
 *    - See, edit, create, and delete your Google Forms   -> to build the Form
 *    - See, edit, create, and delete your Google Sheets   -> to build the
 *      response spreadsheet and write calculated columns into it
 *    - Send email as you                                  -> to email each
 *      parent their personalised result (via MailApp)
 *    - Connect to an external service (script.google.com trigger service)
 *      -> to install the automatic "on form submit" trigger
 *  Nothing is sent to any third party. Everything stays inside your Google
 *  account (Forms, Sheets, Gmail send-as).
 *
 *  RE-RUNNING THIS SCRIPT (idempotency)
 *  ----------------------------------------------------------------------------
 *  The script remembers the Form/Sheet it created (in Script Properties). If
 *  you run setupLocalTutorsAssessment() again, it will NOT create a second
 *  Form — it will just log the existing links and stop. If you genuinely
 *  want a brand-new Form/Sheet, run resetLocalTutorsAssessment() first (this
 *  only forgets the stored links — it does not delete the old Form/Sheet from
 *  Drive; remove those yourself if you no longer need them), then run
 *  setupLocalTutorsAssessment() again.
 *  Run getAssessmentLinks() any time to reprint the Form/Sheet links without
 *  creating anything.
 *
 *  CHANGING THE READING GUIDE URL LATER
 *  ----------------------------------------------------------------------------
 *  Just edit the READING_GUIDE_URL constant below and save. You do NOT need
 *  to re-run setupLocalTutorsAssessment() — the new link is picked up
 *  automatically on the next form submission (the results email is built at
 *  send time). Existing rows already written to the Sheet keep the URL that
 *  was live when they were submitted; that's expected/desirable (it's a
 *  record of what the parent was actually sent).
 *
 *  CHANGING THE SCORING THRESHOLDS LATER
 *  ----------------------------------------------------------------------------
 *  Edit the SCORE_THRESHOLDS constant below (GREEN_MAX / ORANGE_MAX) and
 *  save. No need to re-run setup — new submissions use the new thresholds
 *  immediately. These thresholds are an initial prototype screening
 *  framework, not a clinically validated diagnostic scale.
 *
 *  A NOTE ON "DIFFERENT RESULTS PER SCORE" AND GOOGLE FORMS LIMITATIONS
 *  ----------------------------------------------------------------------------
 *  Google Forms can only branch ("go to section based on answer") using a
 *  SINGLE question's own answer — it cannot branch on a score computed by
 *  adding up 10 different questions. So the Form's own on-screen confirmation
 *  message is deliberately generic ("thanks, your results are on their way").
 *  The actual Green/Orange/Red result, area breakdown, and the correct
 *  call-to-action (reading guide link and/or "request a call") are computed
 *  here in Apps Script and sent to the parent by email straight after they
 *  submit — this is the simplest workable MVP way to give each parent a
 *  genuinely personalised result without building a custom web app.
 * =============================================================================
 */

// ============================================================================
// CONFIGURATION — edit these, then re-run setupLocalTutorsAssessment() only
// if you're setting up for the first time (see notes above).
// ============================================================================

// Paste the Local Tutors "Free Reading Guide" Google Drive share link here.
// Do NOT invent a URL — leave the placeholder until you have the real link.
const READING_GUIDE_URL = "PASTE_READING_GUIDE_URL_HERE";

// Scoring thresholds out of a maximum possible total of 40.
const SCORE_THRESHOLDS = {
  GREEN_MAX: 10,   // 0–10   => GREEN
  ORANGE_MAX: 20   // 11–20  => ORANGE, 21–40 => RED
};

// ============================================================================
// BRAND — Google Forms' Apps Script API does not expose theme colour/font
// controls, so these can't be applied by code. Apply them once, by hand,
// after the Form is created:
//   Open the Form -> click the paint-roller "Customize theme" icon (top
//   right) -> set:
//     Header/background image: none (or add a Local Tutors logo later)
//     Theme colour:  Education Blue #2563A6
//     Background:    Off-White/Bone #F2F0EB
//     Font:          "Nunito Sans" if listed (Manrope is not currently a
//                    Google Forms theme font option); otherwise pick the
//                    closest clean sans-serif ("Basic" is the safest match).
//   Reference palette (for anyone doing this manually):
//     Obsidian Black #111111   Off-White/Bone #F2F0EB
//     Education Blue #2563A6   Highlight Sky Blue #8CC8E8
//     White #FFFFFF            Soft Grey #F2F5F7
//     Charcoal #1F2933
// ============================================================================

const FORM_TITLE = "Local Tutors — Grade 3–6 Reading Check";

const FORM_DESCRIPTION =
  "This short screening is designed for parents and guardians of Grade 3–6 " +
  "learners.\n\n" +
  "It takes only a few minutes and can help you identify areas of reading " +
  "that may need attention. Please answer based on what you have observed " +
  "about your child.\n\n" +
  "This is a screening tool, not a diagnosis. It cannot diagnose dyslexia, " +
  "a learning disability, or any medical or developmental condition.\n\n" +
  "At the end, you'll receive guidance based on your responses and possible " +
  "next steps.";

const CONFIRMATION_MESSAGE =
  "Thank you for completing the Local Tutors Reading Check!\n\n" +
  "We're putting together your personalised results now — please check the " +
  "email address you gave us in the next few minutes for your results and " +
  "recommended next steps (do check your spam/junk folder just in case).";

// Parent/child info field titles — used both when the Form is built and
// when the response is scored, so they only need to be correct in one place.
const PARENT_NAME_TITLE = "Parent/Guardian Name";
const PARENT_EMAIL_TITLE = "Email Address";
const CHILD_GRADE_TITLE = "Child's Grade";
const PARENT_PHONE_TITLE = "Phone/WhatsApp Number";

// Final optional call-request question.
const CALL_QUESTION_TITLE =
  "Would you like Local Tutors to contact you about your results?";
const CALL_YES_LABEL = "Yes, I'd like a free call";
const CALL_NO_LABEL = "No, thank you";

// The 5-point frequency scale used by Questions 1–9.
const FREQUENCY_OPTIONS = ["Never", "Rarely", "Sometimes", "Often", "Very often"];
const FREQUENCY_SCORES = { "Never": 0, "Rarely": 1, "Sometimes": 2, "Often": 3, "Very often": 4 };

// Area groupings used for the "strongest area of concern" analysis.
const AREA_LABELS = {
  fluency: "Reading Fluency",
  decoding: "Word Decoding",
  comprehension: "Reading Comprehension",
  attitude: "Reading Attitude / Impact"
};

// Plain-language phrases used inside result-email sentences, e.g.
// "Your responses suggest that reading comprehension may be an area worth
// paying attention to."
const AREA_PHRASES = {
  fluency: "reading fluency — reading smoothly and without long pauses",
  decoding: "decoding or sounding out unfamiliar words",
  comprehension: "reading comprehension — understanding and remembering what was read",
  attitude: "your child's confidence and comfort with reading"
};

// The 10 assessment questions, in order. `area` groups Q1–Q9 for the area
// analysis; Q10 has no area (it only counts toward the total score), per the
// brief's Area Analysis grouping (Q1+Q3 fluency, Q2 decoding, Q4+Q5+Q6
// comprehension, Q7+Q8+Q9 attitude/impact).
const QUESTIONS = [
  {
    title: "When your child reads aloud, how often do they struggle to read words smoothly or pause for a long time?",
    options: FREQUENCY_OPTIONS,
    scoreMap: FREQUENCY_SCORES,
    area: "fluency"
  },
  {
    title: "How often does your child struggle to sound out or figure out unfamiliar words?",
    options: FREQUENCY_OPTIONS,
    scoreMap: FREQUENCY_SCORES,
    area: "decoding"
  },
  {
    title: "When reading, how often does your child skip words, add words, or replace a word with a different one?",
    options: FREQUENCY_OPTIONS,
    scoreMap: FREQUENCY_SCORES,
    area: "fluency"
  },
  {
    title: "After reading a short passage, how often does your child struggle to explain what they have just read?",
    options: FREQUENCY_OPTIONS,
    scoreMap: FREQUENCY_SCORES,
    area: "comprehension"
  },
  {
    title: "How often does your child forget important information shortly after reading it?",
    options: FREQUENCY_OPTIONS,
    scoreMap: FREQUENCY_SCORES,
    area: "comprehension"
  },
  {
    title: "How often does your child need you or another adult to help them understand what they are reading?",
    options: FREQUENCY_OPTIONS,
    scoreMap: FREQUENCY_SCORES,
    area: "comprehension"
  },
  {
    title: "How often does your child avoid reading when they are given the opportunity to read?",
    options: FREQUENCY_OPTIONS,
    scoreMap: FREQUENCY_SCORES,
    area: "attitude"
  },
  {
    title: "How often does your child become frustrated, tired, or upset when they have to read?",
    options: FREQUENCY_OPTIONS,
    scoreMap: FREQUENCY_SCORES,
    area: "attitude"
  },
  {
    title: "How often does difficulty reading affect your child's ability to complete schoolwork or understand questions in subjects other than English?",
    options: FREQUENCY_OPTIONS,
    scoreMap: FREQUENCY_SCORES,
    area: "attitude"
  },
  {
    title: "Compared with other children in the same grade, how would you describe your child's reading ability?",
    options: [
      "They are ahead of most children",
      "They are about where I would expect",
      "They are slightly behind",
      "They are significantly behind",
      "I'm not sure"
    ],
    scoreMap: {
      "They are ahead of most children": 0,
      "They are about where I would expect": 0,
      "They are slightly behind": 2,
      "They are significantly behind": 4,
      "I'm not sure": 0
    },
    area: null
  }
];

// Result copy per category — used to build the personalised results email.
// Wording is taken directly from the brief; do not add diagnostic language.
const RESULT_MESSAGES = {
  GREEN: {
    title: "Your Results: Reading Appears to Be on Track",
    description:
      "Based on your responses, we didn't identify many indicators of " +
      "significant reading difficulty.\n\n" +
      "Continue encouraging regular reading and talk to your child's " +
      "teacher if you have ongoing concerns.",
    steps: ["guide"]
  },
  ORANGE: {
    title: "Your Results: Some Areas May Need Attention",
    description:
      "Your responses suggest that your child may be experiencing some " +
      "challenges with reading.\n\n" +
      "The results may be worth exploring further, particularly in the " +
      "areas identified in your responses.",
    steps: ["guide", "call"]
  },
  RED: {
    title: "Your Results: Additional Reading Support May Be Beneficial",
    description:
      "Your responses indicate several areas where your child may be " +
      "experiencing difficulty with reading.\n\n" +
      "This screening does not diagnose a learning difficulty, but the " +
      "results may be worth exploring further.",
    steps: ["call", "guide"]
  }
};

// Extra calculated columns appended to the response Sheet, in order.
const RESULT_COLUMNS = [
  "Total Score",
  "Result Category",
  "Reading Fluency Score",
  "Word Decoding Score",
  "Reading Comprehension Score",
  "Reading Attitude / Impact Score",
  "Strongest Area",
  "Assessment Date/Time",
  "Call Requested",
  "Guide Link"
];

const SCRIPT_PROPERTY_FORM_ID = "LT_FORM_ID";
const SCRIPT_PROPERTY_SHEET_ID = "LT_SHEET_ID";

// ============================================================================
// SETUP — run this once from the Apps Script editor.
// ============================================================================

/**
 * Creates the Form, the linked response Sheet, and the onFormSubmit trigger.
 * Safe to run more than once: if a Form was already created by this script,
 * it logs the existing links and does nothing further (see the file header
 * comment "RE-RUNNING THIS SCRIPT" for how to force a brand-new Form).
 */
function setupLocalTutorsAssessment() {
  const props = PropertiesService.getScriptProperties();
  const existingFormId = props.getProperty(SCRIPT_PROPERTY_FORM_ID);

  if (existingFormId) {
    try {
      const existingForm = FormApp.openById(existingFormId);
      Logger.log(
        "An assessment Form already exists — nothing was created. " +
        "Edit link: " + existingForm.getEditUrl()
      );
      Logger.log(
        "To create a brand-new Form/Sheet instead, run " +
        "resetLocalTutorsAssessment() first, then re-run " +
        "setupLocalTutorsAssessment()."
      );
      getAssessmentLinks();
      return;
    } catch (err) {
      // Stored ID no longer resolves (e.g. Form was deleted from Drive) —
      // fall through and create a fresh one.
      Logger.log("Stored Form could not be opened (it may have been " +
        "deleted) — creating a new one.");
    }
  }

  // ---- Create the Form ----
  const form = FormApp.create(FORM_TITLE);
  form.setDescription(FORM_DESCRIPTION);
  form.setProgressBar(true);
  form.setCollectEmail(false); // we ask for the parent's email ourselves
  form.setPublishingSummary(false); // keep response summaries private
  form.setShowLinkToRespondAgain(false);
  form.setConfirmationMessage(CONFIRMATION_MESSAGE);

  // ---- Section: About You & Your Child (one page) ----
  form.addPageBreakItem()
      .setTitle("About You & Your Child")
      .setHelpText("Please tell us a little about you and your child. " +
        "You'll only need to enter this once.");

  form.addTextItem().setTitle(PARENT_NAME_TITLE).setRequired(true);

  const emailValidation = FormApp.createTextValidation()
      .setHelpText("Please enter a valid email address.")
      .requireTextIsEmail()
      .build();
  form.addTextItem()
      .setTitle(PARENT_EMAIL_TITLE)
      .setRequired(true)
      .setValidation(emailValidation);

  form.addMultipleChoiceItem()
      .setTitle(CHILD_GRADE_TITLE)
      .setChoiceValues(["Grade 3", "Grade 4", "Grade 5", "Grade 6"])
      .setRequired(true);

  form.addTextItem()
      .setTitle(PARENT_PHONE_TITLE)
      .setRequired(false);

  // ---- The 10 assessment questions — one question per page ----
  QUESTIONS.forEach(function (q, index) {
    form.addPageBreakItem().setTitle(
      "Question " + (index + 1) + " of " + QUESTIONS.length
    );
    form.addMultipleChoiceItem()
        .setTitle(q.title)
        .setChoiceValues(q.options)
        .setRequired(true);
  });

  // ---- Optional call-request question (its own final page) ----
  form.addPageBreakItem().setTitle("One Last Thing");
  form.addMultipleChoiceItem()
      .setTitle(CALL_QUESTION_TITLE)
      .setChoiceValues([CALL_YES_LABEL, CALL_NO_LABEL])
      .setRequired(false);

  // ---- Create and link the response Spreadsheet ----
  const ss = SpreadsheetApp.create(FORM_TITLE + " (Responses)");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();

  // Try to pre-populate the calculated-column headers now. Forms usually
  // creates the header row as soon as the destination is linked, but if it
  // hasn't yet, this is harmless to skip — onFormSubmit() adds the headers
  // itself (idempotently) the first time a real response comes in.
  try {
    const sheet = ss.getSheets()[0];
    ensureExtraHeaders_(sheet);
  } catch (err) {
    Logger.log("Calculated column headers will be added automatically " +
      "after the first response is submitted.");
  }

  // ---- Install the onFormSubmit trigger (only if not already installed) ----
  const alreadyInstalled = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === "onFormSubmit" &&
      t.getTriggerSourceId() === form.getId();
  });
  if (!alreadyInstalled) {
    ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create();
  }

  // ---- Remember what we created ----
  props.setProperty(SCRIPT_PROPERTY_FORM_ID, form.getId());
  props.setProperty(SCRIPT_PROPERTY_SHEET_ID, ss.getId());

  Logger.log("Done! Local Tutors Reading Check created.");
  Logger.log("Edit the Form (wording/theme):        " + form.getEditUrl());
  Logger.log("Live Form link — send this to parents: " + form.getPublishedUrl());
  Logger.log("Response spreadsheet (private):        " + ss.getUrl());
  if (READING_GUIDE_URL.indexOf("PASTE_") === 0) {
    Logger.log("REMINDER: READING_GUIDE_URL is still a placeholder — " +
      "update it at the top of this script once you have the real Drive " +
      "link.");
  }
}

/**
 * Forgets the stored Form/Sheet IDs so the next setupLocalTutorsAssessment()
 * run creates a brand-new Form and Sheet. Does NOT delete the previous
 * Form/Sheet from Drive — remove those yourself if you no longer need them.
 */
function resetLocalTutorsAssessment() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty(SCRIPT_PROPERTY_FORM_ID);
  props.deleteProperty(SCRIPT_PROPERTY_SHEET_ID);
  Logger.log("Stored Form/Sheet references cleared. The previous Form and " +
    "Sheet were NOT deleted — remove them from Drive yourself if you no " +
    "longer need them. Run setupLocalTutorsAssessment() to create new ones.");
}

/**
 * Reprints the current Form/Sheet links without creating anything. Handy any
 * time you just need to find them again.
 */
function getAssessmentLinks() {
  const props = PropertiesService.getScriptProperties();
  const formId = props.getProperty(SCRIPT_PROPERTY_FORM_ID);
  const sheetId = props.getProperty(SCRIPT_PROPERTY_SHEET_ID);

  if (!formId || !sheetId) {
    Logger.log("No assessment has been created yet. Run " +
      "setupLocalTutorsAssessment() first.");
    return;
  }

  const form = FormApp.openById(formId);
  const ss = SpreadsheetApp.openById(sheetId);
  Logger.log("Edit the Form (wording/theme):        " + form.getEditUrl());
  Logger.log("Live Form link — send this to parents: " + form.getPublishedUrl());
  Logger.log("Response spreadsheet (private):        " + ss.getUrl());
}

// ============================================================================
// SCORING — runs automatically on every Form submission.
// ============================================================================

/**
 * Installable trigger handler (bound to the Form via
 * setupLocalTutorsAssessment()). Computes the total score, per-area scores,
 * the Green/Orange/Red result category and the strongest area of concern;
 * writes them into the response Sheet; and emails the parent their
 * personalised result.
 */
function onFormSubmit(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  const colMap = ensureExtraHeaders_(sheet);
  const namedValues = e.namedValues || {};

  function answerFor(title) {
    const values = namedValues[title];
    return values && values.length ? values[0] : "";
  }

  // ---- Total score + per-area totals ----
  let totalScore = 0;
  const areaTotals = { fluency: 0, decoding: 0, comprehension: 0, attitude: 0 };
  const areaCounts = { fluency: 0, decoding: 0, comprehension: 0, attitude: 0 };

  QUESTIONS.forEach(function (q) {
    const answer = answerFor(q.title);
    const score = q.scoreMap.hasOwnProperty(answer) ? q.scoreMap[answer] : 0;
    totalScore += score;
    if (q.area) {
      areaTotals[q.area] += score;
      areaCounts[q.area] += 1;
    }
  });

  // Average per-question score (0–4) per area. We use an average rather than
  // a raw sum so areas with different numbers of questions (fluency/
  // comprehension/attitude have 2–3 questions, decoding has 1) can be fairly
  // compared to find the "strongest area of concern".
  const areaAverages = {};
  Object.keys(areaTotals).forEach(function (area) {
    areaAverages[area] = areaCounts[area] ? areaTotals[area] / areaCounts[area] : 0;
  });

  const category = scoreToCategory_(totalScore);
  const strongest = strongestArea_(areaAverages);

  const callAnswer = answerFor(CALL_QUESTION_TITLE);
  const callRequested = callAnswer === CALL_YES_LABEL ? "Yes" :
    (callAnswer === CALL_NO_LABEL ? "No" : "");

  // ---- Write calculated columns into the response row ----
  const rowValues = {};
  rowValues["Total Score"] = totalScore;
  rowValues["Result Category"] = category;
  rowValues["Reading Fluency Score"] = round1_(areaAverages.fluency);
  rowValues["Word Decoding Score"] = round1_(areaAverages.decoding);
  rowValues["Reading Comprehension Score"] = round1_(areaAverages.comprehension);
  rowValues["Reading Attitude / Impact Score"] = round1_(areaAverages.attitude);
  rowValues["Strongest Area"] = strongest.label;
  rowValues["Assessment Date/Time"] = new Date();
  rowValues["Call Requested"] = callRequested;
  rowValues["Guide Link"] = READING_GUIDE_URL;

  RESULT_COLUMNS.forEach(function (name) {
    sheet.getRange(row, colMap[name]).setValue(rowValues[name]);
  });

  // ---- Email the parent their personalised result ----
  const parentEmail = answerFor(PARENT_EMAIL_TITLE);
  const parentName = answerFor(PARENT_NAME_TITLE);
  if (parentEmail) {
    sendResultsEmail_(parentEmail, parentName, category, strongest.sentence,
      callRequested === "Yes");
  } else {
    Logger.log("Row " + row + ": no parent email captured — results email " +
      "not sent.");
  }
}

/** Maps a total score (0–40) to GREEN / ORANGE / RED using SCORE_THRESHOLDS. */
function scoreToCategory_(totalScore) {
  if (totalScore <= SCORE_THRESHOLDS.GREEN_MAX) return "GREEN";
  if (totalScore <= SCORE_THRESHOLDS.ORANGE_MAX) return "ORANGE";
  return "RED";
}

/**
 * Given the average score per area, returns the highest-scoring area(s) as
 * a Sheet-friendly label and an email-friendly sentence. If every area
 * averages 0, there's nothing to flag.
 */
function strongestArea_(areaAverages) {
  const entries = Object.keys(AREA_LABELS).map(function (key) {
    return {
      key: key,
      label: AREA_LABELS[key],
      phrase: AREA_PHRASES[key],
      value: areaAverages[key]
    };
  });

  const maxValue = Math.max.apply(null, entries.map(function (entry) { return entry.value; }));

  if (maxValue <= 0) {
    return { label: "No specific area identified", sentence: "" };
  }

  const top = entries.filter(function (entry) { return entry.value === maxValue; });
  const label = top.map(function (entry) { return entry.label; }).join(" & ");
  const phrase = top.map(function (entry) { return entry.phrase; }).join(", and ");
  const verb = top.length > 1 ? "may be areas" : "may be an area";
  const sentence = "Your responses suggest that " + phrase + " " + verb +
    " worth paying attention to.";

  return { label: label, sentence: sentence };
}

/** Rounds to 1 decimal place (for the 0–4 area score columns). */
function round1_(value) {
  return Math.round(value * 10) / 10;
}

/** True while READING_GUIDE_URL is still the unfilled placeholder. */
function isGuidePlaceholder_() {
  return !READING_GUIDE_URL || READING_GUIDE_URL.indexOf("PASTE_") === 0;
}

/**
 * Ensures the response Sheet has all RESULT_COLUMNS headers (appending any
 * that are missing, never duplicating ones that already exist). Returns a
 * map of header name -> 1-based column index, for the full header row.
 */
function ensureExtraHeaders_(sheet) {
  const lastCol = sheet.getLastColumn();
  const headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

  const existing = {};
  headers.forEach(function (header, i) {
    if (header) existing[header] = i + 1;
  });

  const missing = RESULT_COLUMNS.filter(function (name) { return !existing[name]; });
  if (missing.length > 0) {
    sheet.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
  }

  const finalLastCol = lastCol + missing.length;
  const finalHeaders = sheet.getRange(1, 1, 1, finalLastCol).getValues()[0];
  const colMap = {};
  finalHeaders.forEach(function (header, i) {
    if (header) colMap[header] = i + 1;
  });
  return colMap;
}

/**
 * Emails the parent their personalised Green/Orange/Red result, area
 * feedback, and the appropriate next step(s) (reading guide link and/or
 * call request), per RESULT_MESSAGES[category].steps.
 */
function sendResultsEmail_(email, name, category, strongestSentence, wantsCall) {
  const info = RESULT_MESSAGES[category];
  const firstName = name ? String(name).trim().split(/\s+/)[0] : "there";

  const lines = [];
  lines.push("Hi " + firstName + ",");
  lines.push("");
  lines.push("Thank you for completing the Local Tutors Grade 3–6 Reading Check.");
  lines.push("");
  lines.push(info.title);
  lines.push(info.description);
  if (strongestSentence) {
    lines.push("");
    lines.push(strongestSentence);
  }
  lines.push("");

  info.steps.forEach(function (step) {
    if (step === "guide") {
      if (isGuidePlaceholder_()) {
        lines.push("• Free Reading Guide: our team will send this to you shortly.");
      } else {
        lines.push("• Download the Free Reading Guide: " + READING_GUIDE_URL);
      }
    }
    if (step === "call") {
      if (wantsCall) {
        lines.push("• You told us you'd like a free call — one of our tutors will be in touch soon.");
      } else {
        lines.push("• Request a Free Call: just reply to this email and let us know, and we'll set up a time to chat.");
      }
    }
  });

  lines.push("");
  lines.push("Please remember: this is a screening tool, not a diagnosis. " +
    "It cannot diagnose dyslexia, a learning disability, or any medical or " +
    "developmental condition.");
  lines.push("");
  lines.push("Warm regards,");
  lines.push("The Local Tutors Team");

  MailApp.sendEmail(email, info.title + " — Local Tutors", lines.join("\n"));
}
