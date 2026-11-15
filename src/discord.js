// Saffron 디스코드 봇 — 상호작용(버튼·명령어)을 이 Worker가 받아 처리한다.
// 따로 켜 둘 봇 서버가 없다: 디스코드가 버튼 클릭이나 /작품 명령을
// https://www.homepage.saffran.kr/discord/interactions 로 보내면 여기서 답한다.
//
// 필요한 값
//  - DISCORD_BOT_TOKEN (비밀값): Cloudflare → Workers → homepage → Settings → Variables and Secrets.
//    역할을 주고 빼는 데 쓴다. 저장소가 공개라서 코드에는 적지 않는다.
//  - 아래 DISCORD 설정의 ID와 공개 키는 비밀이 아니다. (DISCORD_PUBLIC_KEY 변수가 있으면 그 키로 확인: 로컬 시험용)
//
// 가입 흐름: 온보딩 질문으로 사용 언어를 고르면 언어 표시 역할(🇰🇷/🇺🇸/🇯🇵, 권한 없음)이 붙는다.
// 입구 채널의 「가입하기」 버튼 → 퀴즈 입력 창 → 주 활동 플랫폼을 맞히면
// 그 언어의 멤버 역할(🌱 멤버 / member / メンバー)을 주고 #가입-로그에 남긴다.
// 정답은 JOIN_ANSWERS 변수(쉼표로 구분)가 있으면 그것을, 없으면 아래 기본값을 쓴다.
//
// 버튼(custom_id)
//  join:start                    가입 퀴즈 입력 창 열기 (제출하면 join:submit)
//  notice:all / notice:adult     공지 알림 역할 켜고 끄기 (성인 쪽은 연령 제한 채널에서만)
//  adult:verify                  🔞 성인 인증 역할 받기 (연령 제한 채널에서만)

import { BOOKS } from "../saffron/js/data.js";

export const DISCORD = {
  applicationId: "1571482072290172928",
  publicKey: "0be3784f41c1d64c466ba6ec70ade0e8aa95548326324611326b5483a2bcadf7",
  guildId: "1571467020933800088",
  roles: {
    adult: "1571486588855132180", // 🔞 성인 인증
    member: { ko: "1571486589752840232", en: "1571491212123308082", ja: "1571491213075423293" },
    langTag: { ko: "1571511144303304808", en: "1571511145540354181", ja: "1571511147050434580" }, // 🇰🇷 / 🇺🇸 / 🇯🇵
    notice: "1571486590914789406", // 🔔 공지 알림 / notice / お知らせ
    noticeAdult: "1571487408405352498" // 🔔 공지 알림 / notice / お知らせ 🔞
  },
  joinLogChannel: "1571486714852286625" // 가입-로그・join-log・参加ログ
};

// 주 활동 플랫폼 정답. 비교할 때 대소문자·띄어쓰기·괄호·문장부호는 무시한다.
const DEFAULT_JOIN_ANSWERS = ["알플레이(스토리엔진)", "알플레이", "스토리엔진", "Rplay", "Story Engine", "ストーリーエンジン"];

const SITE = "https://www.homepage.saffran.kr/";
const EPHEMERAL = 64;

// 답장 문구. 언어는 고른 언어(언어 버튼) 또는 디스코드 앱 언어(interaction.locale)를 따른다.
const TEXT = {
  noticeOn: { ko: "🔔 공지 알림을 켰어요.", en: "🔔 Notifications are on.", ja: "🔔 お知らせ通知をオンにしました。" },
  noticeOff: { ko: "🔕 공지 알림을 껐어요.", en: "🔕 Notifications are off.", ja: "🔕 お知らせ通知をオフにしました。" },
  adultOk: { ko: "🔞 성인 인증 역할을 받았어요. 사이트 갤러리를 열 수 있어요.", en: "🔞 You now have the verified adult role. The site gallery is open to you.", ja: "🔞 成人認証ロールを付与しました。サイトのギャラリーが開けます。" },
  adultOnly: { ko: "이 버튼은 연령 제한 채널에서만 쓸 수 있어요.", en: "This button only works in the age-restricted channel.", ja: "このボタンは年齢制限チャンネルでのみ使えます。" },
  needMember: { ko: "먼저 입구 채널의 「가입하기」 버튼으로 가입해 주세요.", en: "Please join first with the Join button in the entrance channel.", ja: "まず入口チャンネルの「参加する」ボタンで参加してください。" },
  joinTitle: { ko: "Saffron 제작공방 가입", en: "Join Saffron Studio", ja: "Saffron 制作工房に参加" },
  joinSource: { ko: "어디를 통해 유입되셨나요?", en: "Where did you find us?", ja: "どこでこのサーバーを知りましたか？" },
  joinPlatform: { ko: "제작자의 주 활동 플랫폼은 어디인가요?", en: "What is the creator's main platform?", ja: "制作者の主な活動プラットフォームは？" },
  joinOk: { ko: "🌱 가입했어요! 이제 서버의 채널들이 보여요.", en: "🌱 Welcome in! The server's channels are now open to you.", ja: "🌱 参加しました！サーバーのチャンネルが見えるようになりました。" },
  joinWrong: { ko: "아쉽지만 정답이 아니에요. 다시 「가입하기」를 눌러 주세요.", en: "Sorry, that's not right. Press Join to try again.", ja: "残念ながら不正解です。もう一度「参加する」を押してください。" },
  joinAlready: { ko: "이미 가입되어 있어요.", en: "You're already a member.", ja: "すでに参加済みです。" },
  failed: { ko: "처리하지 못했어요. 잠시 뒤 다시 눌러 주세요.", en: "Something went wrong. Please try again in a moment.", ja: "処理できませんでした。少し後でもう一度押してください。" },
  langOnly: { ko: { en: "Korean only", ja: "韓国語のみ" } },
  worksTitle: { ko: "Saffron 서재", en: "Saffron Library", ja: "Saffron 書斎" },
  worksAdultHint: { ko: "🔞 Safe OFF 작품은 연령 제한 채널에서 /작품 을 쓰면 함께 보여요.", en: "🔞 Use /works in an age-restricted channel to also see Safe OFF works.", ja: "🔞 年齢制限チャンネルで /作品 を使うと Safe OFF の作品も表示されます。" }
};

function langOf(locale) {
  if (!locale) return "ko";
  if (locale.startsWith("ko")) return "ko";
  if (locale.startsWith("ja")) return "ja";
  return "en";
}

export async function handleDiscord(request, env) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const body = await request.text();
  if (!(await verifySignature(request, body, env.DISCORD_PUBLIC_KEY || DISCORD.publicKey))) return new Response("invalid request signature", { status: 401 });

  const interaction = JSON.parse(body);
  if (interaction.type === 1) return json({ type: 1 }); // PING: 디스코드가 주소를 확인할 때

  const tagged = Object.entries(DISCORD.roles.langTag).find(([, id]) => interaction.member?.roles.includes(id));
  const lang = tagged ? tagged[0] : langOf(interaction.locale);
  try {
    if (interaction.type === 2) return worksCommand(interaction, lang);
    if (interaction.type === 3) return await button(interaction, env, lang);
    if (interaction.type === 5) return await joinSubmit(interaction, env, lang);
  } catch (err) {
    console.error("discord interaction failed", err);
    return reply(TEXT.failed[lang]);
  }
  return reply(TEXT.failed[lang]);
}

async function button(interaction, env, lang) {
  const [kind, value] = interaction.data.custom_id.split(":");
  const member = interaction.member;
  const has = (id) => member.roles.includes(id);
  const nsfw = !!interaction.channel?.nsfw;
  const { roles } = DISCORD;
  const isMember = Object.values(roles.member).some(has);

  if (kind === "join") {
    if (isMember) return reply(TEXT.joinAlready[lang]);
    return json({ type: 9, data: joinModal(lang) }); // 입력 창 열기
  }
  if (kind === "notice") {
    if (!isMember) return reply(TEXT.needMember[lang]);
    if (value === "adult" && !nsfw) return reply(TEXT.adultOnly[lang]);
    const id = value === "adult" ? roles.noticeAdult : roles.notice;
    const on = !has(id);
    await setRole(env, member.user.id, id, on);
    return reply((on ? TEXT.noticeOn : TEXT.noticeOff)[lang]);
  }
  if (kind === "adult" && value === "verify") {
    // 연령 제한 채널은 디스코드가 성인 인증한 계정만 들어올 수 있다. 그 안에서 누른 것만 인정한다.
    if (!nsfw) return reply(TEXT.adultOnly[lang]);
    if (!isMember) return reply(TEXT.needMember[lang]);
    await setRole(env, member.user.id, roles.adult, true);
    return reply(TEXT.adultOk[lang]);
  }
  return reply(TEXT.failed[lang]);
}

function joinModal(lang) {
  const input = (id, label, required) => ({
    type: 1,
    components: [{ type: 4, custom_id: id, label, style: 1, required, max_length: 100 }]
  });
  return {
    custom_id: "join:submit",
    title: TEXT.joinTitle[lang],
    components: [input("source", TEXT.joinSource[lang], false), input("platform", TEXT.joinPlatform[lang], true)]
  };
}

// 입력 창 제출. 주 활동 플랫폼이 정답이면 그 언어의 멤버 역할을 준다. 맞든 틀리든 #가입-로그에 남긴다.
async function joinSubmit(interaction, env, lang) {
  const values = {};
  (function walk(list) {
    for (const c of list || []) {
      if (c.custom_id && typeof c.value === "string") values[c.custom_id] = c.value.trim();
      walk(c.components);
      if (c.component) walk([c.component]);
    }
  })(interaction.data.components);
  const member = interaction.member;
  const accepted = (env.JOIN_ANSWERS ? env.JOIN_ANSWERS.split(",") : DEFAULT_JOIN_ANSWERS).map(normalize);
  const ok = accepted.includes(normalize(values.platform || ""));

  if (ok) await setRole(env, member.user.id, DISCORD.roles.member[lang], true);
  await log(env, `${ok ? "✅ 가입" : "❌ 오답"} <@${member.user.id}> (${member.user.username}) · ${lang}\n유입: ${values.source || "-"}\n플랫폼: ${values.platform || "-"}`);
  return reply((ok ? TEXT.joinOk : TEXT.joinWrong)[lang]);
}

function normalize(s) {
  return s.normalize("NFKC").toLowerCase().replace(/[\s()（）\[\]{}.,·・\-_/!?~]/g, "");
}

async function log(env, content) {
  if (!env.DISCORD_BOT_TOKEN) return;
  try {
    await fetch(`https://discord.com/api/v10/channels/${DISCORD.joinLogChannel}/messages`, {
      method: "POST",
      headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.slice(0, 1900), allowed_mentions: { parse: [] } })
    });
  } catch (err) {
    console.error("join log failed", err);
  }
}

// /작품 · /works · /作品 — 책장의 작품 목록. Safe OFF 작품은 연령 제한 채널에서만 보인다.
function worksCommand(interaction, lang) {
  const nsfw = !!interaction.channel?.nsfw;
  const books = BOOKS.filter((b) => nsfw || !b.safe);
  const lines = books.map((b) => {
    const t = (lang !== "ko" && b.i18n?.[lang]) || {};
    const title = (t.title || b.title).replace(/\n/g, " ");
    const mark = b.safe ? "🔞 " : "";
    // 사이트에서 그 언어로는 안 보이는 작품(한국어 전용 등)은 표시만 해 둔다
    const only = b.langs && !b.langs.includes(lang) ? ` · ${TEXT.langOnly[b.langs[0]]?.[lang] || b.langs.join("/")}` : "";
    return `${mark}**[${title}](${SITE}${b.detailUrl || ""})**${only}\n${t.description || b.description}`;
  });
  const embed = {
    title: TEXT.worksTitle[lang],
    url: SITE,
    color: 0xe9c97a,
    description: lines.join("\n\n").slice(0, 4000)
  };
  if (!nsfw) embed.footer = { text: TEXT.worksAdultHint[lang] };
  return json({ type: 4, data: { embeds: [embed], flags: EPHEMERAL } });
}

async function setRole(env, userId, roleId, add) {
  if (!env.DISCORD_BOT_TOKEN) throw new Error("DISCORD_BOT_TOKEN is not set");
  const res = await fetch(`https://discord.com/api/v10/guilds/${DISCORD.guildId}/members/${userId}/roles/${roleId}`, {
    method: add ? "PUT" : "DELETE",
    headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`, "X-Audit-Log-Reason": "Saffron bot" }
  });
  if (!res.ok && res.status !== 404) throw new Error(`role ${add ? "add" : "remove"} failed: ${res.status} ${await res.text()}`);
}

// 디스코드가 보낸 요청인지 Ed25519 서명으로 확인한다 (확인하지 않으면 디스코드가 주소 등록을 거부한다)
async function verifySignature(request, body, publicKey) {
  const signature = request.headers.get("X-Signature-Ed25519");
  const timestamp = request.headers.get("X-Signature-Timestamp");
  if (!signature || !timestamp) return false;
  try {
    const key = await crypto.subtle.importKey("raw", hex(publicKey), { name: "Ed25519" }, false, ["verify"]);
    return await crypto.subtle.verify("Ed25519", key, hex(signature), new TextEncoder().encode(timestamp + body));
  } catch {
    return false;
  }
}

function hex(s) {
  const out = new Uint8Array(s.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(s.substr(i * 2, 2), 16);
  return out;
}

function reply(content) {
  return json({ type: 4, data: { content, flags: EPHEMERAL } });
}

function json(obj) {
  return new Response(JSON.stringify(obj), { headers: { "Content-Type": "application/json" } });
}
