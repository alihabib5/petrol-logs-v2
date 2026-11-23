// Safri: record which Google account signed in.
// The app sends the Google access token it already has. This function asks Google who the token belongs to and checks it
// was issued to Safri's own OAuth client, then records the account in public.app_users with the secret key.
// The token is used only for those two Google calls and is never stored.
// Deploy with JWT verification off (the caller is a Google user, not a Supabase user): see supabase/config.toml.
import { createClient } from "npm:@supabase/supabase-js@2";

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") ??
  "488491697813-03g8gh1it1bdp66rq0ek5934u8go112h.apps.googleusercontent.com";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ??
  "https://safri.vercel.app,https://petrol-logs.vercel.app,http://localhost:8000").split(",").map((s) => s.trim());

function cors(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors(origin), "Content-Type": "application/json" } });

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ error: "Origin not allowed" }, 403);

  let token = "";
  try {
    const body = await req.json();
    token = typeof body?.access_token === "string" ? body.access_token : "";
  } catch { /* fall through */ }
  if (!token || token.length > 4096) return json({ error: "Missing access_token" }, 400);

  // 1. Is it a live Google token, and was it issued to Safri?
  const info = await fetch("https://oauth2.googleapis.com/tokeninfo?access_token=" + encodeURIComponent(token));
  if (!info.ok) return json({ error: "Google did not accept the token" }, 401);
  const ti = await info.json();
  if (ti.aud !== GOOGLE_CLIENT_ID && ti.azp !== GOOGLE_CLIENT_ID) return json({ error: "Token was issued to another app" }, 401);
  if (!ti.sub) return json({ error: "Token has no account id" }, 401);

  // 2. Who is it? (name and picture come from the profile scope)
  const u = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: "Bearer " + token } });
  const profile = u.ok ? await u.json() : {};
  if (profile.sub && profile.sub !== ti.sub) return json({ error: "Token mismatch" }, 401);

  // 3. Record it with the secret key (injected by Supabase on Edge Functions; never sent to the browser)
  const key = Deno.env.get("SUPABASE_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  if (!key || !url) return json({ error: "Server is missing its Supabase settings" }, 500);
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await sb.rpc("record_sign_in", {
    p_sub: String(ti.sub),
    p_email: ti.email ?? profile.email ?? null,
    p_name: profile.name ?? null,
    p_picture: profile.picture ?? null,
  });
  if (error) return json({ error: "Could not record the sign-in" }, 500);
  return json({ ok: true });
});
