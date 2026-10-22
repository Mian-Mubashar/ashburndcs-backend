const normalizeOrigin = (url) =>
  String(url || "")
    .trim()
    .replace(/\/$/, "");

const hostnameOf = (url) => {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
};

const defaultAllowedOrigins = [
  "https://ashburndcs.com",
  "https://www.ashburndcs.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000",
];

const buildAllowedOrigins = () => {
  const raw = process.env.FRONTEND_URL || process.env.CORS_ORIGINS || "";

  const list = raw
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  const expanded = new Set([...defaultAllowedOrigins, ...list]);
  for (const origin of list) {
    try {
      const parsed = new URL(origin);
      if (parsed.hostname.startsWith("www.")) {
        expanded.add(`${parsed.protocol}//${parsed.hostname.slice(4)}`);
      } else if (
        parsed.hostname !== "localhost" &&
        !/^\d+\.\d+\.\d+\.\d+$/.test(parsed.hostname)
      ) {
        expanded.add(`${parsed.protocol}//www.${parsed.hostname}`);
      }
    } catch {
      /* ignore invalid */
    }
  }
  return [...expanded];
};

const isAllowedOrigin = (origin) => {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return true;

  const host = hostnameOf(normalized);

  // Always allow ashburndcs.com and any subdomain (e.g. www, api)
  if (host === "ashburndcs.com" || host.endsWith(".ashburndcs.com")) return true;

  // Always allow localhost and 127.0.0.1
  if (/^https?:\/\/localhost(:\d+)?$/i.test(normalized)) return true;
  if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/i.test(normalized)) return true;

  const allowed = buildAllowedOrigins();
  if (allowed.includes(normalized)) return true;

  return allowed.some((item) => {
    const allowedHost = hostnameOf(item);
    if (!host || !allowedHost) return false;
    return host === allowedHost || host === `www.${allowedHost}` || `www.${host}` === allowedHost;
  });
};

module.exports = {
  normalizeOrigin,
  allowedOrigins: buildAllowedOrigins(),
  isAllowedOrigin,
};

