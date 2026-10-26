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

async function sendWithBrevo(env, enquiry) {
  const apiKey = env.BREVO_API_KEY;
  if (!apiKey) {
    return json({ ok: false, message: "Email service is not configured yet." }, 503);
  }

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
      to: [{ email: INBOX, name: "TRISHLACOZY" }],
      replyTo: { email: enquiry.email, name: enquiry.name },
      subject: "New TRISHLACOZY enquiry from " + enquiry.name,
      textContent:
        "Name: " + enquiry.name + "\n" +
        "Email: " + enquiry.email + "\n" +
        "Phone: " + enquiry.phone + "\n" +
        "City: " + enquiry.city + "\n\n" +
        enquiry.remark,
    }),
  });

  if (response.ok) return json({ ok: true }, 200);

  let message = "Could not deliver the enquiry email.";
  try {
    const data = await response.json();
    if (data && data.message) message = String(data.message).slice(0, 300);
  } catch (err) {
    message = "Could not deliver the enquiry email.";
  }
  return json({ ok: false, message }, 502);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/enquiry") {
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

      const enquiry = readEnquiry(body || {});
      if (enquiry.spam) return json({ ok: true }, 200);
      if (enquiry.error) return json({ ok: false, message: enquiry.error }, 400);

      try {
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
