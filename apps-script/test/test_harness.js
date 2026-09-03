// Standalone logic test harness for apps-script/Code.gs
// Stubs the Google Apps Script global services so onFormSubmit() and its
// helpers can be exercised with plain Node.js, without touching real Google
// APIs. This only tests SCORING/EMAIL LOGIC — it cannot verify the actual
// Form-building calls (FormApp.addMultipleChoiceItem etc.), which require a
// live Apps Script run (see ../README.md's test plan).
//
// Run with: node apps-script/test/test_harness.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');

// ---- Fake Sheet: an in-memory 2D array with getRange/setValues/getValues ----
function makeFakeSheet(initialHeaders) {
  const data = [initialHeaders.slice()];
  return {
    getLastColumn: function () { return data[0].length; },
    getRange: function (row, col, numRows, numCols) {
      numRows = numRows || 1;
      numCols = numCols || 1;
      return {
        getValues: function () {
          const out = [];
          for (let r = 0; r < numRows; r++) {
            const rowData = data[row - 1 + r] || [];
            const slice = [];
            for (let c = 0; c < numCols; c++) {
              slice.push(rowData[col - 1 + c] !== undefined ? rowData[col - 1 + c] : '');
            }
            out.push(slice);
          }
          return out;
        },
        setValues: function (values) {
          for (let r = 0; r < values.length; r++) {
            while (data.length <= row - 1 + r) data.push([]);
            for (let c = 0; c < values[r].length; c++) {
              data[row - 1 + r][col - 1 + c] = values[r][c];
            }
          }
        },
        setValue: function (value) {
          while (data.length <= row - 1) data.push([]);
          data[row - 1][col - 1] = value;
        }
      };
    },
    _dump: function () { return data; }
  };
}

const sentEmails = [];
const loggedLines = [];

const sandbox = {
  Logger: { log: function (msg) { loggedLines.push(msg); } },
  MailApp: { sendEmail: function (to, subject, body) { sentEmails.push({ to, subject, body }); } },
  console
};
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: 'Code.gs' });
// Top-level `const`/`let` in a vm context don't become own-properties of the
// sandbox object (only `var`/function declarations do) — pull them out
// explicitly via a second script run in the same context.
vm.runInContext(
  'this.__exports = { QUESTIONS, PARENT_NAME_TITLE, PARENT_EMAIL_TITLE, ' +
  'CHILD_GRADE_TITLE, PARENT_PHONE_TITLE, CALL_QUESTION_TITLE, ' +
  'CALL_YES_LABEL, CALL_NO_LABEL, RESULT_COLUMNS, onFormSubmit, ' +
  'scoreToCategory_, strongestArea_, ensureExtraHeaders_, ' +
  'isGuidePlaceholder_, READING_GUIDE_URL };',
  sandbox,
  { filename: 'exports.js' }
);
Object.assign(sandbox, sandbox.__exports);

// ---- Helper to build e.namedValues from a plain answers object ----
function buildEvent(sheet, row, answers) {
  const namedValues = {};
  Object.keys(answers).forEach(function (k) { namedValues[k] = [answers[k]]; });
  return {
    range: { getSheet: function () { return sheet; }, getRow: function () { return row; } },
    namedValues: namedValues
  };
}

let failures = 0;
function check(condition, message) {
  if (!condition) {
    failures++;
    console.error('FAILED: ' + message);
  }
}

function runCase(label, answers) {
  sentEmails.length = 0;
  const sheet = makeFakeSheet(['Timestamp', sandbox.PARENT_NAME_TITLE, sandbox.PARENT_EMAIL_TITLE]);
  const e = buildEvent(sheet, 2, answers);
  sandbox.onFormSubmit(e);
  const headerRow = sheet._dump()[0];
  const dataRow = sheet._dump()[1];
  const rowObj = {};
  headerRow.forEach(function (h, i) { rowObj[h] = dataRow[i]; });

  console.log('=== ' + label + ' ===');
  console.log('Total Score:', rowObj['Total Score']);
  console.log('Result Category:', rowObj['Result Category']);
  console.log('Reading Fluency Score:', rowObj['Reading Fluency Score']);
  console.log('Word Decoding Score:', rowObj['Word Decoding Score']);
  console.log('Reading Comprehension Score:', rowObj['Reading Comprehension Score']);
  console.log('Reading Attitude / Impact Score:', rowObj['Reading Attitude / Impact Score']);
  console.log('Strongest Area:', rowObj['Strongest Area']);
  console.log('Call Requested:', rowObj['Call Requested']);
  console.log('Guide Link:', rowObj['Guide Link']);
  console.log('Email sent to:', sentEmails[0] && sentEmails[0].to, '| subject:', sentEmails[0] && sentEmails[0].subject);
  console.log(sentEmails[0] && sentEmails[0].body);
  console.log('');
  return rowObj;
}

const Q = sandbox.QUESTIONS;

// ---- GREEN case: all "Never" (Q1-9), Q10 = "about where I would expect" ----
const greenAnswers = {};
Q.forEach(function (q, i) {
  if (i < 9) greenAnswers[q.title] = 'Never';
});
greenAnswers[Q[9].title] = 'They are about where I would expect';
greenAnswers[sandbox.PARENT_NAME_TITLE] = 'Jane Parent';
greenAnswers[sandbox.PARENT_EMAIL_TITLE] = 'jane@example.com';
greenAnswers[sandbox.CHILD_GRADE_TITLE] = 'Grade 4';
greenAnswers[sandbox.PARENT_PHONE_TITLE] = ''; // optional, left blank
greenAnswers[sandbox.CALL_QUESTION_TITLE] = sandbox.CALL_NO_LABEL;
const greenRow = runCase('GREEN (expect total 0)', greenAnswers);
check(greenRow['Total Score'] === 0, 'GREEN total should be 0');
check(greenRow['Result Category'] === 'GREEN', 'GREEN category expected');

// ---- ORANGE case: everything "Sometimes" (score 2) x9 = 18, Q10 = +2 => total 20 ----
const orangeAnswers = {};
Q.forEach(function (q, i) {
  if (i < 9) orangeAnswers[q.title] = 'Sometimes';
});
orangeAnswers[Q[9].title] = 'They are slightly behind'; // +2 => total 20
orangeAnswers[sandbox.PARENT_NAME_TITLE] = 'Sam Guardian';
orangeAnswers[sandbox.PARENT_EMAIL_TITLE] = 'sam@example.com';
orangeAnswers[sandbox.CHILD_GRADE_TITLE] = 'Grade 5';
orangeAnswers[sandbox.CALL_QUESTION_TITLE] = sandbox.CALL_YES_LABEL;
const orangeRow = runCase('ORANGE (expect total 20)', orangeAnswers);
check(orangeRow['Total Score'] === 20, 'ORANGE total should be 20, got ' + orangeRow['Total Score']);
check(orangeRow['Result Category'] === 'ORANGE', 'ORANGE category expected, got ' + orangeRow['Result Category']);
check(orangeRow['Call Requested'] === 'Yes', 'Call Requested should be Yes');

// ---- RED case: everything "Very often" (score 4) x9 = 36, Q10 = significantly behind (4) => total 40 ----
const redAnswers = {};
Q.forEach(function (q, i) {
  if (i < 9) redAnswers[q.title] = 'Very often';
});
redAnswers[Q[9].title] = 'They are significantly behind';
redAnswers[sandbox.PARENT_NAME_TITLE] = 'Alex Caretaker';
redAnswers[sandbox.PARENT_EMAIL_TITLE] = 'alex@example.com';
redAnswers[sandbox.CHILD_GRADE_TITLE] = 'Grade 3';
redAnswers[sandbox.CALL_QUESTION_TITLE] = sandbox.CALL_NO_LABEL;
const redRow = runCase('RED (expect total 40, max)', redAnswers);
check(redRow['Total Score'] === 40, 'RED total should be 40, got ' + redRow['Total Score']);
check(redRow['Result Category'] === 'RED', 'RED category expected');

// ---- Boundary checks on scoreToCategory_ ----
check(sandbox.scoreToCategory_(10) === 'GREEN', '10 should be GREEN');
check(sandbox.scoreToCategory_(11) === 'ORANGE', '11 should be ORANGE');
check(sandbox.scoreToCategory_(20) === 'ORANGE', '20 should be ORANGE');
check(sandbox.scoreToCategory_(21) === 'RED', '21 should be RED');
check(sandbox.scoreToCategory_(40) === 'RED', '40 should be RED');

// ---- Area analysis: fluency-only concern should surface Reading Fluency ----
const fluencyAnswers = {};
Q.forEach(function (q, i) {
  if (i < 9) fluencyAnswers[q.title] = 'Never';
});
fluencyAnswers[Q[0].title] = 'Very often'; // Q1 -> fluency
fluencyAnswers[Q[2].title] = 'Very often'; // Q3 -> fluency
fluencyAnswers[Q[9].title] = 'They are about where I would expect';
fluencyAnswers[sandbox.PARENT_NAME_TITLE] = 'Pat Guardian';
fluencyAnswers[sandbox.PARENT_EMAIL_TITLE] = 'pat@example.com';
const fluencyRow = runCase('Area analysis (fluency concern only)', fluencyAnswers);
check(fluencyRow['Strongest Area'] === 'Reading Fluency', 'Expected Reading Fluency, got ' + fluencyRow['Strongest Area']);
check(fluencyRow['Reading Fluency Score'] === 4, 'Fluency avg should be 4 (both Q1&Q3 = 4)');
check(fluencyRow['Word Decoding Score'] === 0, 'Decoding avg should be 0');

// ---- No email sent when parent email missing ----
sentEmails.length = 0;
const noEmailAnswers = Object.assign({}, greenAnswers);
delete noEmailAnswers[sandbox.PARENT_EMAIL_TITLE];
const sheet2 = makeFakeSheet(['Timestamp']);
sandbox.onFormSubmit(buildEvent(sheet2, 2, noEmailAnswers));
check(sentEmails.length === 0, 'No email should be sent without a parent email');

// ---- Placeholder guide URL handling in email body ----
check(sandbox.isGuidePlaceholder_() === true, 'READING_GUIDE_URL should still be the placeholder in this repo state');
check(greenRow['Guide Link'] === 'PASTE_READING_GUIDE_URL_HERE', 'Sheet should record whatever READING_GUIDE_URL currently is');

// ---- ensureExtraHeaders_ idempotency: running twice should not duplicate columns ----
const sheet3 = makeFakeSheet(['Timestamp']);
const map1 = sandbox.ensureExtraHeaders_(sheet3);
const map2 = sandbox.ensureExtraHeaders_(sheet3);
check(sheet3.getLastColumn() === 1 + sandbox.RESULT_COLUMNS.length, 'Header count should match RESULT_COLUMNS + Timestamp, got ' + sheet3.getLastColumn());
check(JSON.stringify(map1) === JSON.stringify(map2), 'Re-running ensureExtraHeaders_ should be idempotent');

if (failures > 0) {
  console.error(failures + ' assertion(s) FAILED.');
  process.exit(1);
} else {
  console.log('ALL ASSERTIONS PASSED.');
}
