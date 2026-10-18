// Saffron — Cloudflare Worker
//
// 정적 파일(saffron/)은 그대로 내보내고, 아래 GATES에 적힌 경로만 먼저 검사한다.
// 지금은 Re:Bloomlution 캐릭터 이미지 미리보기(pages/rebloom/gallery/)를
// 아카라이브(arca.live)에서 링크를 타고 들어온 사람에게만 보여 준다.
//
// 동작
//  1. 아카라이브에서 넘어온 요청(Referer가 arca.live) → 1시간짜리 입장 쿠키를 주고 보여 준다.
//  2. 입장 쿠키가 있는 요청(새로고침, 페이지 안의 이미지·스크립트) → 보여 준다.
//  3. 그 밖(주소 직접 입력, 다른 사이트에서 온 링크, 이미지 주소만 복사) → 안내 페이지 / 403.
//
// 한계: Referer 헤더는 마음먹고 조작하면 속일 수 있다. "링크를 공유하거나 주소를 직접
// 쳐서는 볼 수 없게" 하는 정도의 장치다.
//
// 쿠키 서명 키: Cloudflare 대시보드 → Workers → homepage → Settings → Variables에
// GALLERY_SECRET(비밀값)을 넣으면 그 값을 쓴다. 넣지 않으면 아래 기본값을 쓴다.

const GATES = [
  {
    prefix: "/pages/rebloom/gallery",
    cookie: "rb_gallery_pass",
    allowedReferrerHosts: ["arca.live"], // 하위 도메인(예: m.arca.live)도 허용
    ttlSeconds: 60 * 60,
    deniedTitle: "아카라이브 채널의 링크로 들어와 주세요",
    deniedText: "이 페이지는 아카라이브 채널 글에 걸린 링크를 눌러 들어왔을 때만 볼 수 있어요. 주소를 직접 입력하거나 다른 곳에서 공유된 링크로는 열리지 않습니다."
  }
];

const DEFAULT_SECRET = "saffron-gallery-pass-v1";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const gate = GATES.find((g) => url.pathname === g.prefix || url.pathname.startsWith(g.prefix + "/"));
    if (!gate) return env.ASSETS.fetch(request);

    const secret = env.GALLERY_SECRET || DEFAULT_SECRET;
    const fromAllowed = isFromAllowedReferrer(request, gate.allowedReferrerHosts);
    const hasPass = !fromAllowed && (await verifyPass(request, gate.cookie, secret));

    if (!fromAllowed && !hasPass) return denied(request, gate);

    const assetResponse = await env.ASSETS.fetch(request);
    const response = new Response(assetResponse.body, assetResponse);
    // 검사를 거친 내용은 캐시에 남기지 않고, 검색에도 잡히지 않게
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Referrer-Policy", "no-referrer");
    if (fromAllowed) {
      const value = await makePass(gate.ttlSeconds, secret);
      response.headers.append(
        "Set-Cookie",
        `${gate.cookie}=${value}; Path=${gate.prefix}; Max-Age=${gate.ttlSeconds}; HttpOnly; Secure; SameSite=Lax`
      );
    }
    return response;
  }
};

function isFromAllowedReferrer(request, hosts) {
  const referer = request.headers.get("Referer");
  if (!referer) return false;
  let host;
  try { host = new URL(referer).hostname.toLowerCase(); } catch { return false; }
  return hosts.some((h) => host === h || host.endsWith("." + h));
}

/* 입장 쿠키: "만료시각.서명" — 서명이 맞고 만료 전이어야 통과 */
async function makePass(ttlSeconds, secret) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  return `${exp}.${await sign(String(exp), secret)}`;
}

async function verifyPass(request, cookieName, secret) {
  const cookies = request.headers.get("Cookie") || "";
  const match = cookies.split(/;\s*/).find((c) => c.startsWith(cookieName + "="));
  if (!match) return false;
  const [exp, sig] = match.slice(cookieName.length + 1).split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return sig === (await sign(exp, secret));
}

async function sign(text, secret) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(mac))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function denied(request, gate) {
  const accept = request.headers.get("Accept") || "";
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!accept.includes("text/html")) return new Response("Forbidden", { status: 403, headers });
  const html = `<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow"><title>Saffron</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 1.5rem;
    background: #120a1c; color: #efe3c8; font-family: 'Pretendard Variable', 'Pretendard', system-ui, sans-serif; }
  main { max-width: 30rem; text-align: center; }
  .mark { font-size: 2rem; color: #f2a7d8; }
  h1 { font-size: 1.25rem; margin: 0.8rem 0; }
  p { color: #b8a9a0; line-height: 1.7; font-size: 0.95rem; }
  a { display: inline-block; margin-top: 1rem; padding: 0.5rem 1.1rem; border: 1px solid #f2a7d8;
    border-radius: 999px; color: #f2a7d8; text-decoration: none; font-size: 0.9rem; }
</style></head>
<body><main><div class="mark">✿</div><h1>${gate.deniedTitle}</h1><p>${gate.deniedText}</p>
<a href="/index.html">Saffron 서재로</a></main></body></html>`;
  return new Response(html, { status: 403, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } });
}
