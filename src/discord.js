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
// 입구 채널의 「규칙에 동의하고 가입」 버튼(누르면 규칙 동의) → 퀴즈 입력 창 → 주 활동 플랫폼을 맞히면
// 그 언어의 멤버 역할(🌱 멤버 / member / メンバー)을 주고 #가입-로그에 남긴다.
// 정답은 JOIN_ANSWERS 변수(쉼표로 구분)가 있으면 그것을, 없으면 아래 기본값을 쓴다.
//
// 버튼(custom_id)
//  join:start                    가입 퀴즈 입력 창 열기 (제출하면 join:submit)
//  notice:all / notice:adult     공지 알림 역할 켜고 끄기 (성인 쪽은 연령 제한 채널에서만)
//  adult:verify                  🔞 성인 인증 역할 받기 (연령 제한 채널에서만)
//
// 명령어 (영어 이름 / 한국어 / 日本語 — 등록은 discord/setup_bot.py)
//  /works [title]   작품 목록, 제목을 고르면 작품 카드     /genre genre   장르별 작품
//  /random          작품 하나 추천                         /roll [dice]   주사위 (2d6+1 등)
//  /notice [kind]   공지 알림 켜고 끄기                     /language lang 사용 언어 바꾸기
//  /idea [kind]     무작위 소재 추천 (SFW, 🔞 NSFW는 연령 제한 채널에서만) + 다시 뽑기 버튼(idea:sfw / idea:nsfw)
//  /help            명령어 안내
// 🔞 Safe OFF 작품은 연령 제한 채널에서만 보여 준다.

import { BOOKS, GENRES } from "../saffron/js/data.js";
import { ideaEmbed } from "./ideas.js";

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
  adultOnly: { ko: "연령 제한 채널에서만 쓸 수 있어요.", en: "This only works in an age-restricted channel.", ja: "年齢制限チャンネルでのみ使えます。" },
  needMember: { ko: "먼저 입구 채널의 「규칙에 동의하고 가입」 버튼으로 가입해 주세요.", en: "Please join first with the Agree & Join button in the entrance channel.", ja: "まず入口チャンネルの「同意して参加」ボタンで参加してください。" },
  joinTitle: { ko: "Saffron 제작공방 가입", en: "Join Saffron Studio", ja: "Saffron 制作工房に参加" },
  joinSource: { ko: "어디를 통해 유입되셨나요?", en: "Where did you find us?", ja: "どこでこのサーバーを知りましたか？" },
  joinPlatform: { ko: "제작자의 주 활동 플랫폼은 어디인가요?", en: "What is the creator's main platform?", ja: "制作者の主な活動プラットフォームは？" },
  joinOk: { ko: "🌱 가입했어요! 이제 서버의 채널들이 보여요.", en: "🌱 Welcome in! The server's channels are now open to you.", ja: "🌱 参加しました！サーバーのチャンネルが見えるようになりました。" },
  joinWrong: { ko: "아쉽지만 정답이 아니에요. 버튼을 다시 눌러 주세요.", en: "Sorry, that's not right. Press the button to try again.", ja: "残念ながら不正解です。もう一度ボタンを押してください。" },
  joinAlready: { ko: "이미 가입되어 있어요.", en: "You're already a member.", ja: "すでに参加済みです。" },
  failed: { ko: "처리하지 못했어요. 잠시 뒤 다시 눌러 주세요.", en: "Something went wrong. Please try again in a moment.", ja: "処理できませんでした。少し後でもう一度押してください。" },
  langOnly: { ko: { en: "Korean only", ja: "韓国語のみ" } },
  worksTitle: { ko: "Saffron 서재", en: "Saffron Library", ja: "Saffron 書斎" },
  genreLabel: { ko: "장르", en: "Genres", ja: "ジャンル" },
  readMore: { ko: "작품 페이지", en: "Work page", ja: "作品ページ" },
  notFound: { ko: "그 작품을 찾지 못했어요. 이 채널에서 볼 수 없는 작품일 수도 있어요.", en: "Couldn't find that work. It may not be viewable in this channel.", ja: "その作品が見つかりませんでした。このチャンネルでは表示できない作品かもしれません。" },
  genreEmpty: { ko: "이 채널에서 볼 수 있는 그 장르 작품이 없어요.", en: "No works in that genre are viewable in this channel.", ja: "このチャンネルで表示できるそのジャンルの作品はありません。" },
  randomPick: { ko: "🎲 오늘의 추천", en: "🎲 Today's pick", ja: "🎲 今日のおすすめ" },
  rollBad: { ko: "주사위는 2d6, d20, 3d6+2 처럼 적어 주세요. (최대 20개, 1000면)", en: "Write dice like 2d6, d20 or 3d6+2. (up to 20 dice, 1000 sides)", ja: "ダイスは 2d6、d20、3d6+2 のように書いてください。（最大20個・1000面）" },
  langChanged: { ko: "🌐 사용 언어를 한국어로 바꿨어요.", en: "🌐 Your language is now English.", ja: "🌐 使用言語を日本語に変更しました。" },
  help: {
    ko: "**Saffron 봇 명령어**\n`/작품` 작품 목록 · `/작품 제목` 작품 카드\n`/장르` 장르별 작품 · `/랜덤` 작품 하나 추천\n`/주사위 2d6+1` 주사위 · `/소재` 무작위 소재 추천 (🔞 NSFW는 연령 제한 채널에서)\n`/알림` 공지 알림 켜기·끄기 · `/언어` 사용 언어 바꾸기\n-# 🔞 Safe OFF 작품은 연령 제한 채널에서만 보여요.",
    en: "**Saffron bot commands**\n`/works` list · `/works title` work card\n`/genre` works by genre · `/random` a random pick\n`/roll 2d6+1` dice · `/idea` random story idea (🔞 NSFW in age-restricted channels)\n`/notice` toggle notifications · `/language` change your language\n-# 🔞 Safe OFF works only show in age-restricted channels.",
    ja: "**Saffron ボットのコマンド**\n`/作品` 一覧 · `/作品 タイトル` 作品カード\n`/ジャンル` ジャンル別 · `/ランダム` おすすめ\n`/ダイス 2d6+1` ダイス · `/ネタ` ランダムなネタ (🔞 NSFW は年齢制限チャンネルで)\n`/お知らせ` 通知のオン・オフ · `/言語` 言語の変更\n-# 🔞 Safe OFF 作品は年齢制限チャンネルでのみ表示されます。"
  },
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
    if (interaction.type === 2) return await command(interaction, env, lang);
    if (interaction.type === 4) return autocomplete(interaction, lang);
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
  if (kind === "idea") return idea(value, nsfw, lang);
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
  await log(env, `${ok ? "✅ 가입" : "❌ 오답"} <@${member.user.id}> (${member.user.username}) · ${lang} · 규칙 동의\n유입: ${values.source || "-"}\n플랫폼: ${values.platform || "-"}`);
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

// ---------- 명령어 ----------

async function command(interaction, env, lang) {
  const name = interaction.data.name;
  const opt = Object.fromEntries((interaction.data.options || []).map((o) => [o.name, o.value]));
  const nsfw = !!interaction.channel?.nsfw;
  const books = visibleBooks(nsfw);

  if (name === "works") {
    if (!opt.title) return worksList(books, nsfw, lang);
    const book = books.find((b) => b.id === opt.title) || books.find((b) => sameTitle(b, opt.title));
    return book ? say(bookCard(book, lang)) : reply(TEXT.notFound[lang]);
  }
  if (name === "genre") {
    const found = books.filter((b) => b.genres?.includes(opt.genre));
    if (!found.length) return reply(TEXT.genreEmpty[lang]);
    const g = GENRES[opt.genre]?.[lang] || opt.genre;
    return say({ title: `${TEXT.worksTitle[lang]} · ${g}`, url: SITE, color: 0xe9c97a, description: found.map((b) => bookLine(b, lang)).join("\n\n").slice(0, 4000) });
  }
  if (name === "random") {
    const book = books[Math.floor(Math.random() * books.length)];
    return say({ ...bookCard(book, lang), author: { name: TEXT.randomPick[lang] } });
  }
  if (name === "roll") return roll(opt.dice || "1d100", interaction, lang);
  if (name === "notice") {
    // 버튼과 같은 동작: 멤버만, 🔞 알림은 연령 제한 채널에서만
    return button({ ...interaction, data: { custom_id: `notice:${opt.kind || "all"}` } }, env, lang);
  }
  if (name === "language") return changeLanguage(interaction, env, opt.lang);
  if (name === "help") return reply(TEXT.help[lang]);
  if (name === "idea") return idea(opt.kind || "sfw", nsfw, lang);
  return reply(TEXT.failed[lang]);
}

// 제목 입력 중 자동 완성: 이 채널에서 볼 수 있는 작품 중 제목에 입력이 들어간 것
function autocomplete(interaction, lang) {
  const typed = (interaction.data.options || []).find((o) => o.focused)?.value || "";
  const q = normalize(typed);
  const choices = visibleBooks(!!interaction.channel?.nsfw)
    .filter((b) => !q || allTitles(b).some((t) => normalize(t).includes(q)))
    .slice(0, 25)
    .map((b) => ({ name: titleOf(b, lang).slice(0, 100), value: b.id }));
  return json({ type: 8, data: { choices } });
}

function visibleBooks(nsfw) {
  return BOOKS.filter((b) => nsfw || !b.safe);
}

function titleOf(b, lang) {
  return ((lang !== "ko" && b.i18n?.[lang]?.title) || b.title).replace(/\n/g, " ");
}

function allTitles(b) {
  return [b.title, b.id, ...Object.values(b.i18n || {}).map((t) => t.title).filter(Boolean)];
}

function sameTitle(b, text) {
  const q = normalize(text);
  return allTitles(b).some((t) => normalize(t) === q);
}

function bookLine(b, lang) {
  const t = (lang !== "ko" && b.i18n?.[lang]) || {};
  const mark = b.safe ? "🔞 " : "";
  // 사이트에서 그 언어로는 안 보이는 작품(한국어 전용 등)은 표시만 해 둔다
  const only = b.langs && !b.langs.includes(lang) ? ` · ${TEXT.langOnly[b.langs[0]]?.[lang] || b.langs.join("/")}` : "";
  return `${mark}**[${titleOf(b, lang)}](${SITE}${b.detailUrl || ""})**${only}\n${t.description || b.description}`;
}

function bookCard(b, lang) {
  const t = (lang !== "ko" && b.i18n?.[lang]) || {};
  const genres = (b.genres || []).map((g) => GENRES[g]?.[lang] || g).join(" · ");
  const card = {
    title: (b.safe ? "🔞 " : "") + titleOf(b, lang),
    url: SITE + (b.detailUrl || ""),
    color: parseInt((b.spine?.bg || "#e9c97a").slice(1), 16),
    description: `${t.description || b.description}\n\n[${TEXT.readMore[lang]} →](${SITE}${b.detailUrl || ""})`,
    fields: genres ? [{ name: TEXT.genreLabel[lang], value: genres }] : []
  };
  if (b.langs && !b.langs.includes(lang)) card.footer = { text: TEXT.langOnly[b.langs[0]]?.[lang] || b.langs.join("/") };
  if (b.cover) card.thumbnail = { url: b.cover };
  return card;
}

function worksList(books, nsfw, lang) {
  const embed = {
    title: TEXT.worksTitle[lang],
    url: SITE,
    color: 0xe9c97a,
    description: books.map((b) => bookLine(b, lang)).join("\n\n").slice(0, 4000)
  };
  if (!nsfw) embed.footer = { text: TEXT.worksAdultHint[lang] };
  return json({ type: 4, data: { embeds: [embed], flags: EPHEMERAL } });
}

// 주사위: NdM+K (N 1~20, M 2~1000, K -1000~1000). 결과는 채널에 보이게 남긴다
function roll(text, interaction, lang) {
  const m = String(text).replace(/\s+/g, "").toLowerCase().match(/^(\d{0,2})d(\d{1,4})([+-]\d{1,4})?$/);
  const n = m ? Number(m[1] || 1) : 0, sides = m ? Number(m[2]) : 0, mod = m ? Number(m[3] || 0) : 0;
  if (!m || n < 1 || n > 20 || sides < 2 || sides > 1000) return reply(TEXT.rollBad[lang]);
  const rolls = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * sides));
  const total = rolls.reduce((a, b) => a + b, 0) + mod;
  const detail = n > 1 || mod ? ` (${rolls.join(" + ")}${mod ? (mod > 0 ? ` + ${mod}` : ` − ${-mod}`) : ""})` : "";
  const who = interaction.member?.user?.id;
  return json({ type: 4, data: { content: `🎲 <@${who}> **${n}d${sides}${mod ? (mod > 0 ? "+" + mod : mod) : ""}** → **${total}**${detail}`, allowed_mentions: { parse: [] } } });
}

// 무작위 소재 한 벌을 채널에 올리고, 같은 종류로 다시 뽑는 버튼을 붙인다
function idea(kind, nsfw, lang) {
  if (kind !== "nsfw") kind = "sfw";
  if (kind === "nsfw" && !nsfw) return reply(TEXT.adultOnly[lang]);
  const reroll = { ko: "다시 뽑기", en: "Reroll", ja: "引き直す" }[lang];
  return json({ type: 4, data: {
    embeds: [ideaEmbed(kind, lang)],
    components: [{ type: 1, components: [{ type: 2, style: 2, label: reroll, emoji: { name: "🎲" }, custom_id: `idea:${kind}` }] }],
    allowed_mentions: { parse: [] }
  } });
}

// 사용 언어 바꾸기: 언어 표시 역할을 바꾸고, 이미 멤버면 멤버 역할도 그 언어로 바꾼다
async function changeLanguage(interaction, env, to) {
  const { roles } = DISCORD;
  const member = interaction.member;
  const has = (id) => member.roles.includes(id);
  const isMember = Object.values(roles.member).some(has);
  await setRole(env, member.user.id, roles.langTag[to], true);
  if (isMember) await setRole(env, member.user.id, roles.member[to], true);
  for (const code of Object.keys(roles.langTag)) {
    if (code === to) continue;
    if (has(roles.langTag[code])) await setRole(env, member.user.id, roles.langTag[code], false);
    if (has(roles.member[code])) await setRole(env, member.user.id, roles.member[code], false);
  }
  return reply(TEXT.langChanged[to]);
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

// 채널에 보이는 임베드 답장
function say(embed) {
  return json({ type: 4, data: { embeds: [embed], allowed_mentions: { parse: [] } } });
}

function json(obj) {
  return new Response(JSON.stringify(obj), { headers: { "Content-Type": "application/json" } });
}
