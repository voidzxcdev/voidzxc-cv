import { renderSVG } from "./lib/qr.js";
import { dashCss, mergeSnaps, renderDash } from "./dash-ui.js";

export { SitePulse } from "./pulse-do.js";

const SITES = ["voidzxc.cv"];

const COOKIE = "dash";
const SESSION_MS = 7 * 24 * 3600_000;
const FAIL_LIMIT = 8;
const FAIL_MS = 15 * 60_000;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/_pulse" && request.method === "POST") {
      return handlePulse(request, env, "voidzxc.cv");
    }
    if (url.pathname === "/dashboard" || url.pathname.startsWith("/dashboard/")) {
      return handleDash(request, env, url);
    }
    // Serve cleaned index from GitHub until the next full assets deploy.
    if (
      (url.pathname === "/" || url.pathname === "/index.html") &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      const remote = await fetch(
        "https://raw.githubusercontent.com/voidzxcdev/voidzxc-cv/main/index.html",
        { cf: { cacheTtl: 60, cacheEverything: true } }
      );
      if (remote.ok) {
        const { vid, header } = visitor(request);
        if (isPageView(request, url)) {
          ctx.waitUntil(recordView(env, request, url, vid, "voidzxc.cv"));
        }
        let htmlBody = await remote.text();
        let res = new Response(request.method === "HEAD" ? null : htmlBody, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=60",
          },
        });
        res = await applyPreviewCard(request, res);
        if (header && isPageView(request, url)) {
          const out = new Response(res.body, res);
          out.headers.append("Set-Cookie", header);
          return out;
        }
        return res;
      }
    }
    let res = await env.ASSETS.fetch(request);
    const { vid, header } = visitor(request);
    if (isPageView(request, url)) {
      ctx.waitUntil(recordView(env, request, url, vid, "voidzxc.cv"));
    }
    res = await applyPreviewCard(request, res);
    if (isIconPath(url.pathname)) {
      const headers = new Headers(res.headers);
      headers.delete("Set-Cookie");
      headers.set("cache-control", "public, max-age=86400");
      return new Response(res.body, { status: res.status, headers });
    }
    if (!header || !isPageView(request, url)) return res;
    const out = new Response(res.body, res);
    out.headers.append("Set-Cookie", header);
    return out;
  },
};

async function handlePulse(request, env, site) {
  const { vid, header } = visitor(request);
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  if (body.t === "click" && body.href) {
    try {
      await env.PULSE.get(env.PULSE.idFromName(site)).hit({
        type: "click",
        at: Date.now(),
        href: String(body.href),
        path: String(body.path || "/"),
        vid,
        country: request.cf?.country || "??",
      });
    } catch {}
  }
  const headers = { "cache-control": "no-store" };
  if (header) headers["Set-Cookie"] = header;
  return new Response(null, { status: 204, headers });
}

async function recordView(env, request, url, vid, site) {
  try {
    await env.PULSE.get(env.PULSE.idFromName(site)).hit({
      type: "view",
      at: Date.now(),
      path: url.pathname,
      host: site,
      vid,
      country: request.cf?.country || "??",
      ref: request.headers.get("referer") || "",
      utm: url.searchParams.get("utm_source") || "",
    });
  } catch {}
}

const SQUARE_PREVIEW = /whatsapp|signal\/|viber|line\//i;

async function applyPreviewCard(request, res) {
  const type = res.headers.get("content-type") || "";
  if (!type.includes("text/html")) return res;
  if (!SQUARE_PREVIEW.test(request.headers.get("user-agent") || "")) return res;
  const body = (await res.text())
    .replaceAll("og.jpg?v=card2", "og-square.jpg?v=card2")
    .replaceAll('property="og:image:height" content="630"', 'property="og:image:height" content="1200"');
  return new Response(body, res);
}

function isIconPath(pathname) {
  return /\/(favicon(\.ico|\.png|\.svg|-\d+\.png)|apple-touch-icon\.png|android-chrome-\d+\.png|site\.webmanifest)$/i.test(
    pathname
  );
}

function isPageView(request, url) {
  if (request.headers.get("x-dash-health")) return false;
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (
    url.pathname.startsWith("/dashboard") ||
    url.pathname === "/_pulse"
  ) {
    return false;
  }
  if (/\.(css|js|mjs|woff2?|png|jpe?g|gif|svg|ico|map|json|txt|xml)$/i.test(url.pathname)) return false;
  if (url.pathname.startsWith("/fonts/") || url.pathname.startsWith("/icons/")) return false;
  if (/bot|crawl|spider|preview|slurp|facebookexternalhit|whatsapp|telegram/i.test(request.headers.get("user-agent") || "")) {
    return false;
  }
  const dest = request.headers.get("sec-fetch-dest");
  if (dest && dest !== "document") return false;
  return dest === "document" || url.pathname === "/" || !url.pathname.includes(".");
}

function visitor(request) {
  const existing = cookieValue(request, "vid");
  if (existing && /^[a-f0-9]{16,64}$/i.test(existing)) {
    return { vid: existing, header: "" };
  }
  const vid = randomHex(16);
  return {
    vid,
    header: `vid=${vid}; Path=/; Max-Age=31536000; Secure; SameSite=Lax; HttpOnly`,
  };
}

async function handleDash(request, env, url) {
  const path = url.pathname.replace(/\/$/, "") || "/dashboard";
  if (path === "/dashboard/login" && request.method === "POST") {
    return login(request, env);
  }
  if (path === "/dashboard/logout" && request.method === "POST") {
    return logout(request, env);
  }
  if (path !== "/dashboard") {
    return new Response("Not found", { status: 404 });
  }
  const session = await readSession(request, env);
  if (session) {
    const bounce = safeNext(url.searchParams.get("next"));
    if (bounce !== "/dashboard") {
      const headers = new Headers({ Location: "https://voidzxc.cv" + bounce });
      headers.append("Set-Cookie", clearLegacyDashCookie());
      headers.append("Set-Cookie", cookie(session.id, SESSION_MS / 1000));
      return new Response(null, { status: 302, headers });
    }
    return dashboardPage(env, request);
  }
  return gatePage(env, url.searchParams.get("e"), url.searchParams.get("next"));
}

async function getAuth(env) {
  const row = await env.DASH.get("auth", "json");
  if (row?.secret) return row;
  const secret = randomBase32(20);
  const next = { secret, enrolled: false, enrolledAt: 0 };
  await env.DASH.put("auth", JSON.stringify(next));
  return next;
}

async function login(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || "0";
  const failKey = "fail:" + ip;
  const fails = (await env.DASH.get(failKey, "json")) || { n: 0, until: 0 };
  if (fails.until && fails.until > Date.now()) {
    return Response.redirect("https://voidzxc.cv/dashboard?e=lock", 303);
  }

  const form = await request.formData();
  const code = String(form.get("code") || "").replace(/\D/g, "");
  const auth = await getAuth(env);
  const ok = await verifyTotp(auth.secret, code);

  if (!ok) {
    const n = (fails.n || 0) + 1;
    const until = n >= FAIL_LIMIT ? Date.now() + FAIL_MS : 0;
    await env.DASH.put(failKey, JSON.stringify({ n, until }), {
      expirationTtl: 60 * 60,
    });
    const next = safeNext(form.get("next"));
    const q = new URLSearchParams({ e: "code" });
    if (next !== "/dashboard") q.set("next", next);
    return Response.redirect("https://voidzxc.cv/dashboard?" + q.toString(), 303);
  }

  if (!auth.enrolled) {
    auth.enrolled = true;
    auth.enrolledAt = Date.now();
    await env.DASH.put("auth", JSON.stringify(auth));
  }
  await env.DASH.delete(failKey);

  const id = randomHex(24);
  await env.DASH.put(
    "sess:" + id,
    JSON.stringify({ created: Date.now() }),
    { expirationTtl: SESSION_MS / 1000 }
  );
  const next = safeNext(form.get("next"));
  const headers = new Headers({ Location: next });
  headers.append("Set-Cookie", clearLegacyDashCookie());
  headers.append("Set-Cookie", cookie(id, SESSION_MS / 1000));
  return new Response(null, { status: 303, headers });
}

async function logout(request, env) {
  const id = cookieValue(request, COOKIE);
  if (id) await env.DASH.delete("sess:" + id);
  const headers = new Headers({ Location: "/dashboard" });
  headers.append("Set-Cookie", clearLegacyDashCookie());
  headers.append("Set-Cookie", cookie("", 0));
  return new Response(null, { status: 303, headers });
}

async function readSession(request, env) {
  const id = cookieValue(request, COOKIE);
  if (!id) return null;
  const row = await env.DASH.get("sess:" + id, "json");
  if (!row) return null;
  return { id, created: row.created };
}

function cookie(value, maxAge) {
  const base = `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
  return value ? base : `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function clearLegacyDashCookie() {
  return `${COOKIE}=; Path=/dashboard; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function safeNext(_raw) {
  return "/dashboard";
}

function cookieValue(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return "";
}

async function gatePage(env, err, nextRaw) {
  const auth = await getAuth(env);
  const setup = !auth.enrolled;
  const next = safeNext(nextRaw);
  let qr = "";
  if (setup) {
    const uri = `otpauth://totp/voidzxc.cv:dashboard?secret=${auth.secret}&issuer=voidzxc.cv&algorithm=SHA1&digits=6&period=30`;
    qr = renderSVG(uri, { pixelSize: 8, whiteColor: "#f5f5f4", blackColor: "#0c0a09" });
  }
  const hint =
    err === "lock"
      ? "Too many tries. Wait 15 minutes."
      : err === "code"
        ? "That code was wrong. Try the next one."
        : "";
  return html(
    setup ? "Set up Authenticator" : "Dashboard",
    `
    <main class="gate">
      <p class="kicker">voidzxc.cv</p>
      <h1>${setup ? "Scan to open the dashboard" : "Authenticator code"}</h1>
      ${
        setup
          ? `<p class="lede">First visit only. Add this to Google Authenticator, then type the 6 digits. After that, the QR never shows again.</p>
             <div class="qr">${qr}</div>
             <p class="secret">${esc(auth.secret)}</p>`
          : `<p class="lede">Enter the current 6 digits from Google Authenticator.</p>`
      }
      ${hint ? `<p class="err">${esc(hint)}</p>` : ""}
      <form method="post" action="/dashboard/login">
        <input type="hidden" name="next" value="${esc(next)}" />
        <input
          name="code"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="6"
          pattern="[0-9]{6}"
          placeholder="000000"
          required
          autofocus
        />
        <button type="submit">Enter</button>
      </form>
    </main>
    <script>
      const input = document.querySelector("input[name=code]");
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\\D/g, "").slice(0, 6);
        if (input.value.length === 6) input.form.requestSubmit();
      });
    </script>
  `,
    true
  );
}

async function dashboardPage(env, request) {
  const url = new URL(request.url);
  const site = "voidzxc.cv";
  const range = ["24h", "7d", "30d"].includes(url.searchParams.get("r"))
    ? url.searchParams.get("r")
    : "7d";

  let snap = null;
  try {
    snap = await env.PULSE.get(env.PULSE.idFromName(site)).snapshot(range);
  } catch {
    snap = null;
  }

  return html(
    "Traffic",
    renderDash({ site, range, snap: snap || mergeSnaps(null, null, range) })
  );
}

function html(title, body, gate = false) {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#0C0A09" />
    <title>${esc(title)} · voidzxc.cv</title>
    <link rel="icon" href="https://voidzxc.cv/favicon-48.png?v=mark5" type="image/png" sizes="48x48" />
    <style>${dashCss()}</style>
  </head>
  <body class="${gate ? "is-gate" : ""}">${body}</body>
</html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
        "referrer-policy": "same-origin",
        "x-content-type-options": "nosniff",
      },
    }
  );
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function randomBase32(bytesLen) {
  const bytes = crypto.getRandomValues(new Uint8Array(bytesLen));
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits) out += alphabet[(value << (5 - bits)) & 31];
  return out;
}

function randomHex(n) {
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyTotp(secret, code) {
  if (!/^\d{6}$/.test(code)) return false;
  const step = Math.floor(Date.now() / 1000 / 30);
  for (const n of [step - 1, step, step + 1]) {
    if ((await totp(secret, n)) === code) return true;
  }
  return false;
}

async function totp(secret, counter) {
  const key = base32Decode(secret);
  const raw = new ArrayBuffer(8);
  const view = new DataView(raw);
  view.setUint32(4, counter);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, raw));
  const offset = sig[19] & 0xf;
  const bin =
    ((sig[offset] & 0x7f) << 24) |
    (sig[offset + 1] << 16) |
    (sig[offset + 2] << 8) |
    sig[offset + 3];
  return String(bin % 1_000_000).padStart(6, "0");
}

function base32Decode(input) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = input.toUpperCase().replace(/=+$/g, "");
  let bits = 0;
  let value = 0;
  const out = [];
  for (const ch of clean) {
    const idx = alphabet.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}
