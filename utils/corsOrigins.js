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

const buildAllowedOrigins = () => {
  const raw = process.env.FRONTEND_URL || process.env.CORS_ORIGINS || "";

  const list = raw
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  const expanded = new Set(list);
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

const allowedOrigins = buildAllowedOrigins();

const isAllowedOrigin = (origin) => {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return true;
  if (allowedOrigins.includes(normalized)) return true;

  const host = hostnameOf(normalized);
  return allowedOrigins.some((allowed) => {
    const allowedHost = hostnameOf(allowed);
    if (!host || !allowedHost) return false;
    return host === allowedHost || host === `www.${allowedHost}` || `www.${host}` === allowedHost;
  });
};

module.exports = {
  normalizeOrigin,
  allowedOrigins,
  isAllowedOrigin,
};
