const INBOX = "info@rasr.co.in";
const SENDER_NAME = "TRISHLACOZY Website";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+91[6-9][0-9]{9}$/;

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "x-enquiry-rev": "4",
    },
  });
}

function line(value, max) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function readEnquiry(body) {
  const name = line(body.name, 80);
  const email = line(body.email, 120).toLowerCase();
  const phone = line(body.phone, 16);
  const city = line(body.city, 80);
  const remark = String(body.remark || "").replace(/\u0000/g, "").trim().slice(0, 1500);

  if (String(body.honey || body._honey || "").trim()) {
    return { spam: true };
  }
  if (name.length < 2) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email ID." };
  if (!PHONE_RE.test(phone)) return { error: "Enter a valid 10-digit Indian mobile number." };
  if (city.length < 2) return { error: "Please enter the city you belong to." };
  if (!remark) return { error: "Please write a remark." };
  return { name, email, phone, city, remark };
}

const OTP_TTL_MS = 10 * 60 * 1000;
const otpSendLog = new Map();

function makeOtp() {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return String(value).padStart(6, "0");
}

function bytesToB64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlToBytes(value) {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function safeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string" || left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}

async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return bytesToB64url(new Uint8Array(digest));
}

async function signToken(secret, payload) {
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, data));
  return bytesToB64url(data) + "." + bytesToB64url(signature);
}

async function readToken(secret, token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  let data;
  let signature;
  try {
    data = b64urlToBytes(parts[0]);
    signature = b64urlToBytes(parts[1]);
  } catch (err) {
    return null;
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const valid = await crypto.subtle.verify("HMAC", key, signature, data);
  if (!valid) return null;
  try {
    return JSON.parse(new TextDecoder().decode(data));
  } catch (err) {
    return null;
  }
}

function allowOtpSend(email) {
  const now = Date.now();
  const recent = (otpSendLog.get(email) || []).filter((sentAt) => now - sentAt < OTP_TTL_MS);
  if (recent.length >= 5) return false;
  recent.push(now);
  otpSendLog.set(email, recent);
  return true;
}

function brevoKey(env) {
  const named = [env.BREVO_API_KEY, env.BREVO_APL_KEY, env.BREVO_KEY];
  for (const value of named) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  for (const value of Object.values(env || {})) {
    if (typeof value === "string" && value.trim().startsWith("xkeysib-")) return value.trim();
  }
  return "";
}

function missingKeyResponse(env) {
  const names = Object.keys(env || {}).filter((name) => name.toUpperCase().includes("BREVO"));
  const message = names.length
    ? "Email service is not configured yet. Found " + names.join(", ") + " but it has no value."
    : "Email service is not configured yet. Add secret BREVO_API_KEY under Worker Settings, Variables and Secrets. A Build variable cannot send mail.";
  return json({ ok: false, message }, 503);
}

async function brevoSend(env, message) {
  const apiKey = brevoKey(env);
  if (!apiKey) return { error: missingKeyResponse(env) };

  const senderEmail = line(env.BREVO_SENDER_EMAIL || INBOX, 120);
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: senderEmail },
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      textContent: message.text,
    }),
  });

  if (response.ok) return { ok: true };

  let detail = "Could not deliver the email.";
  try {
    const data = await response.json();
    if (data && data.message) detail = String(data.message).slice(0, 300);
  } catch (err) {
    detail = "Could not deliver the email.";
  }
  return { error: json({ ok: false, message: detail }, 502) };
}

async function sendOtp(env, email) {
  const apiKey = brevoKey(env);
  if (!apiKey) return missingKeyResponse(env);
  if (!allowOtpSend(email)) {
    return json({ ok: false, message: "Too many codes were sent to this email. Wait a few minutes and try again." }, 429);
  }

  const code = makeOtp();
  const digest = await sha256(apiKey + "|" + email + "|" + code);
  const token = await signToken(apiKey, { email, digest, exp: Date.now() + OTP_TTL_MS });
  const sent = await brevoSend(env, {
    to: [{ email }],
    subject: "Your TRISHLACOZY enquiry code",
    text:
      "Your TRISHLACOZY enquiry code is " + code + ".\n\n" +
      "Enter this 6-digit code on the website to send your enquiry. It expires in 10 minutes.\n\n" +
      "If you did not request this, you can ignore this email.",
  });
  if (sent.error) {
    const recent = otpSendLog.get(email) || [];
    recent.pop();
    otpSendLog.set(email, recent);
    return sent.error;
  }
  return json({ ok: true, token }, 200);
}

async function otpMatches(env, email, code, token) {
  const apiKey = brevoKey(env);
  if (!apiKey) return { error: missingKeyResponse(env) };
  const payload = await readToken(apiKey, token);
  if (!payload || payload.email !== email) {
    return { error: json({ ok: false, message: "Send a new code for this email address." }, 400) };
  }
  if (!payload.exp || payload.exp < Date.now()) {
    return { error: json({ ok: false, message: "That code has expired. Send a new code." }, 400) };
  }
  const digest = await sha256(apiKey + "|" + email + "|" + String(code || "").trim());
  if (!safeEqual(digest, payload.digest)) {
    return { error: json({ ok: false, message: "That code does not match. Check the email and try again." }, 400) };
  }
  return { ok: true };
}

async function sendWithBrevo(env, enquiry) {
  const sent = await brevoSend(env, {
    to: [{ email: INBOX, name: "TRISHLACOZY" }],
    replyTo: { email: enquiry.email, name: enquiry.name },
    subject: "New TRISHLACOZY enquiry from " + enquiry.name,
    text:
      "Name: " + enquiry.name + "\n" +
      "Email: " + enquiry.email + "\n" +
      "Phone: " + enquiry.phone + "\n" +
      "City: " + enquiry.city + "\n\n" +
      enquiry.remark,
  });
  if (sent.error) return sent.error;
  return json({ ok: true }, 200);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/enquiry/otp" || url.pathname === "/api/enquiry") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204 });
      }
      if (request.method !== "POST") {
        return json({ ok: false, message: "Method not allowed." }, 405);
      }

      let body = {};
      try {
        body = await request.json();
      } catch (err) {
        return json({ ok: false, message: "The enquiry could not be read." }, 400);
      }
      body = body || {};

      if (String(body.honey || body._honey || "").trim()) {
        return json({ ok: true }, 200);
      }

      if (url.pathname === "/api/enquiry/otp") {
        const email = line(body.email, 120).toLowerCase();
        if (!EMAIL_RE.test(email)) return json({ ok: false, message: "Enter a valid email ID." }, 400);
        try {
          return await sendOtp(env, email);
        } catch (err) {
          return json({ ok: false, message: "Could not reach the email service. Please try again." }, 502);
        }
      }

      const enquiry = readEnquiry(body);
      if (enquiry.spam) return json({ ok: true }, 200);
      if (enquiry.error) return json({ ok: false, message: enquiry.error }, 400);

      try {
        const checked = await otpMatches(env, enquiry.email, body.otp, body.token);
        if (checked.error) return checked.error;
        return await sendWithBrevo(env, enquiry);
      } catch (err) {
        return json({ ok: false, message: "Could not reach the email service. Please try again." }, 502);
      }
    }

    if (!env.ASSETS) {
      return new Response("Not found", { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
};
