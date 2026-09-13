export function getBaseUrl(request) {
  // 1. Prioritaskan header request browser (x-forwarded-host / host)
  // Ini memastikan domain yang dipakai selalu sama persis dengan yang ada di address bar browser user
  if (request && request.headers) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost || request.headers.get("host");
    if (host) {
      const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
      const forwardedProto = request.headers.get("x-forwarded-proto");
      const proto = isLocal ? "http" : (forwardedProto || "https");
      return `${proto}://${host}`;
    }
  }

  // 2. Jika user set NEXT_PUBLIC_APP_URL secara eksplisit (non-localhost)
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    let url = process.env.NEXT_PUBLIC_APP_URL.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return url.replace(/\/$/, "");
  }

  // 3. Fallback Vercel env
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
