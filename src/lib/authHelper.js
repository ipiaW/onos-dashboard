export function getBaseUrl(request) {
  // 1. Prioritaskan jika user sudah set NEXT_PUBLIC_APP_URL secara eksplisit
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    let url = process.env.NEXT_PUBLIC_APP_URL.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return url.replace(/\/$/, "");
  }

  // 2. Jika di-deploy di Vercel, Vercel otomatis menyediakan env VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Deteksi dari header request (x-forwarded-host / host)
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || "localhost:3000";

  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const proto = isLocal ? "http" : (forwardedProto || "https");

  return `${proto}://${host}`;
}
