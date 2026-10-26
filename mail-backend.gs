/**
 * Optional Google Sheet copy of enquiries.
 * The website form does not use this file. It sends mail through
 * the Cloudflare Worker in worker.js and Brevo, to info@rasr.co.in.
 */

var BUSINESS_INBOX = 'info@rasr.co.in';

function doGet(e) {
  return handle_(e);
}

function doPost(e) {
  return handle_(e);
}

function handle_(e) {
  var p = {};
  try {
    if (e && e.postData && e.postData.contents && String(e.postData.type || '').indexOf('json') !== -1) {
      p = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      p = e.parameter;
    }
  } catch (err) {
    p = (e && e.parameter) || {};
  }

  var result = { ok: false };
  try {
    if (p.action === 'saveEnquiry') {
      result = saveEnquiry_(p);
    } else {
      result = { ok: false, error: 'Unknown action' };
    }
  } catch (err) {
    result = { ok: false, error: String(err) };
  }

  var payload = JSON.stringify(result);
  var callback = String(p.callback || '');
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + payload + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open this script from a Google Sheet (Extensions -> Apps Script).');
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function saveEnquiry_(p) {
  var name = String(p.name || '').replace(/[\r\n]/g, ' ').trim().slice(0, 80);
  var email = String(p.email || '').replace(/[\r\n]/g, ' ').trim().toLowerCase().slice(0, 120);
  var phone = String(p.phone || '').trim();
  var city = String(p.city || '').replace(/[\r\n]/g, ' ').trim().slice(0, 80);
  var remark = String(p.remark || '').trim().slice(0, 2000);

  if (name.length < 2) {
    return { ok: false, error: 'Please enter your name.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Enter a valid email ID.' };
  }
  if (!/^\+91[6-9][0-9]{9}$/.test(phone)) {
    return { ok: false, error: 'Enter a valid 10-digit Indian mobile number.' };
  }
  if (city.length < 2) {
    return { ok: false, error: 'Please enter the city you belong to.' };
  }
  if (!remark) {
    return { ok: false, error: 'Please write a remark.' };
  }

  getSheet_('Enquiries', [
    'Date', 'Name', 'Email', 'Phone', 'City', 'Remark'
  ]).appendRow([
    new Date(),
    name,
    email,
    phone,
    city,
    remark
  ]);

  try {
    MailApp.sendEmail({
      to: BUSINESS_INBOX,
      name: 'TRISHLACOZY Website',
      subject: 'New enquiry from ' + name,
      body:
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'City: ' + city + '\n\n' +
        remark
    });
  } catch (err) {}

  return { ok: true, email: email };
}
