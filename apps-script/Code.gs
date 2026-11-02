/**
 * LocalTutors lead capture for the "20 Min Math Error Assessors" page.
 *
 * Paste this whole file into Extensions > Apps Script of the Google Sheet
 * that should hold the leads, then deploy it as a Web app
 * (Execute as: Me, Who has access: Anyone). See README.md.
 *
 * The page sends one JSON record per lead as text/plain, so the browser
 * does not send a CORS preflight. Each lead becomes one row in the "Leads" tab.
 */

var SHEET_NAME = 'Leads';
var MAX_LENGTH = 100;
var TIME_ZONE = 'Africa/Johannesburg';

// Column order of the "Leads" tab. Do not reorder once leads exist.
var FIELDS = [
  'timestamp',
  'first_name',
  'surname',
  'grade',
  'language',
  'lead_magnet',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'referrer',
  'page_url',
  'status'
];

var REQUIRED = ['first_name', 'surname', 'grade'];

function doPost(e) {
  var data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '');
  } catch (err) {
    return respond_({ ok: false, error: 'invalid_json' });
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return respond_({ ok: false, error: 'invalid_body' });
  }

  // Honeypot: real visitors never see or fill the "website" field.
  if (clean_(data.website) !== '') {
    return respond_({ ok: false, error: 'rejected' });
  }

  var record = {};
  for (var i = 0; i < FIELDS.length; i++) {
    record[FIELDS[i]] = clean_(data[FIELDS[i]]);
  }

  for (var j = 0; j < REQUIRED.length; j++) {
    if (record[REQUIRED[j]] === '') {
      return respond_({ ok: false, error: 'missing_' + REQUIRED[j] });
    }
  }

  if (record.timestamp === '') {
    record.timestamp = Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss');
  }
  if (record.status === '') {
    record.status = 'New';
  }

  var row = FIELDS.map(function (field) {
    return safeCell_(record[field]);
  });

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return respond_({ ok: false, error: 'busy' });
  }
  try {
    getLeadsSheet_().appendRow(row);
    SpreadsheetApp.flush();
  } catch (err) {
    return respond_({ ok: false, error: 'write_failed' });
  } finally {
    lock.releaseLock();
  }

  return respond_({ ok: true });
}

// Opening the Web app URL in a browser shows this, so the owner can check it is live.
function doGet() {
  return respond_({ ok: true, message: 'LocalTutors lead capture is running.' });
}

// Returns the "Leads" tab, creating it with a bold, frozen header row if missing.
function getLeadsSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, FIELDS.length).setValues([FIELDS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Turns any value into a trimmed string of at most MAX_LENGTH characters.
function clean_(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return '';
  }
  return String(value).trim().slice(0, MAX_LENGTH);
}

// Stops the Sheet from running text that starts like a formula (=, +, -, @).
function safeCell_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function respond_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
