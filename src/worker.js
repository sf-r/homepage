// Saffron — Cloudflare Worker
//
// 정적 파일(saffron/)은 그대로 내보내고, 아래 GATES에 적힌 경로만 먼저 검사한다.
// 지금은 Re:Bloomlution 캐릭터 이미지 미리보기(pages/rebloom/gallery/)를
// 아카라이브(arca.live)에서 링크를 타고 들어온 사람에게만 보여 준다.
//
// 동작
//  1. 입장 키가 붙은 링크(…/gallery?k=입장키)로 온 요청 → 1시간짜리 입장 쿠키를 주고,
//     주소창에 키가 남지 않게 키를 뺀 주소로 바로 넘긴다.
//     아카라이브는 바깥 링크에 출처(Referer)를 보내지 않아서, 채널 글에는 이 링크를 건다.
//  2. 아카라이브에서 넘어온 요청(Referer가 arca.live) → 같은 쿠키를 주고 보여 준다.
//  3. 입장 쿠키가 있는 요청(새로고침, 페이지 안의 이미지·스크립트) → 보여 준다.
//  4. 그 밖(주소 직접 입력, 키 없는 링크, 이미지 주소만 복사) → 안내 페이지 / 403.
//
// 입장 키: Cloudflare 대시보드 → Workers → homepage → Settings → Variables and Secrets에
// GALLERY_KEY(비밀값)로 넣는다. 저장소가 공개라서 코드에는 적지 않는다. 키를 바꾸면
// 예전 링크는 더 이상 열리지 않으니, 채널 글의 링크도 새 키로 고친다.
//
// 한계: 키가 붙은 링크를 통째로 복사해 퍼뜨리면 그 링크로는 들어올 수 있다. 그럴 땐 키를 바꾼다.
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

    // 입장 키가 맞으면 쿠키를 주고 키를 뺀 주소로 넘긴다.
    // 키는 …/gallery?k=키 또는 …/gallery/enter/키 어느 쪽으로 와도 된다.
    let key = url.searchParams.get("k");
    let landing = null;
    if (key !== null) {
      url.searchParams.delete("k");
      landing = url.pathname + url.search;
    } else {
      const m = url.pathname.match(/\/enter\/([^/]+)\/?$/);
      if (m && url.pathname.startsWith(gate.prefix + "/enter/")) {
        try { key = decodeURIComponent(m[1]); } catch { key = m[1]; }
        landing = gate.prefix + "/";
      }
    }
    let reason = "";
    if (key !== null) {
      const expected = (env.GALLERY_KEY || "").trim();
      if (!expected) reason = "서버에 입장 키(GALLERY_KEY)가 아직 설정되지 않았어요.";
      else if (!(await sameSecret(key.trim(), expected, secret))) reason = "입장 키가 맞지 않아요.";
      else {
        const value = await makePass(gate.ttlSeconds, secret);
        return new Response(null, {
          status: 302,
          headers: {
            Location: landing,
            "Cache-Control": "no-store",
            "Referrer-Policy": "no-referrer",
            "Set-Cookie": `${gate.cookie}=${value}; Path=${gate.prefix}; Max-Age=${gate.ttlSeconds}; HttpOnly; Secure; SameSite=Lax`
          }
        });
      }
    }

    const fromAllowed = isFromAllowedReferrer(request, gate.allowedReferrerHosts);
    const hasPass = !fromAllowed && (await verifyPass(request, gate.cookie, secret));

    if (!fromAllowed && !hasPass) return denied(request, gate, reason || "입장 키 없이 들어왔어요.");

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

/* 입장 키 비교: 서명끼리 비교해서 글자 하나씩 맞춰 보는 추측을 어렵게 */
async function sameSecret(given, expected, secret) {
  return (await sign("key:" + given, secret)) === (await sign("key:" + expected, secret));
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

function denied(request, gate, reason) {
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
  .why { margin-top: 1.6rem; font-size: 0.75rem; color: #7d7068; }
  a { display: inline-block; margin-top: 1rem; padding: 0.5rem 1.1rem; border: 1px solid #f2a7d8;
    border-radius: 999px; color: #f2a7d8; text-decoration: none; font-size: 0.9rem; }
</style></head>
<body><main><div class="mark">✿</div><h1>${gate.deniedTitle}</h1><p>${gate.deniedText}</p>
<a href="/index.html">Saffron 서재로</a>
<p class="why">${reason} · gate v3</p></main></body></html>`;
  return new Response(html, { status: 403, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } });
}
