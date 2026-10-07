// '참교육 못하는 공녀님' 페이지 번역. 한국어는 HTML 원문을 그대로 씁니다.
// 키는 HTML의 data-i18n 값과 같습니다.

const IMG = "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&q=80";

export const PAGE_TEXT = {
  en: {
    pageTitle: "The Lady Who Can't Set Anyone Straight — Saffron",
    pageTitleChars: "Characters — The Lady Who Can't Set Anyone Straight — Saffron",
    workTitle: "The Lady Who Can't Set Anyone Straight",
    navWorld: "World",
    navMode: "Tone",
    navChars: "Characters",
    charGongnyeo: "The Lady",
    charButler: "The Butler",
    charMaid: "The Maid",
    world: `
      <span class="duchess-seal"><span class="crest">⚜</span> Approved by the head of house (self-approved)</span>
      <h2>World</h2>
      <img class="hero-image" src="${IMG}" alt="World of The Lady Who Can't Set Anyone Straight">
      <p class="hero-caption">※ Placeholder image — swap in the real cover or illustration URL.</p>
      <p>
        House Rosenclaw, one of the most distinguished ducal families in the empire. The trouble is that
        the house is famous half for its decorum and half for its disasters. From the moment she was born,
        the Lady was named the one who would set the household straight, yet the more seriously she scolds,
        the more the household seems to enjoy it.
      </p>
      <p>
        Behind the elegant drawing rooms and the endless party invitations are servants who cause trouble,
        big and small, every single day, and a Lady worn out from cleaning up after them. This story follows
        the noisy days of that ducal house.
      </p>`,
    mode: `
      <h2>Tone</h2>
      <p>
        The base tone is close to comedy. The more solemnly the Lady begins a lecture, the further the mood
        drifts, and the ones laughing are always the people being lectured. Beneath all the commotion lies
        this household's own kind of affection, and the Lady is the only one who fails to notice it to the very end.
      </p>
      <p>
        Moving between light court comedy and a quiet coming-of-age story, each episode is planned to have
        a slightly different texture.
      </p>`
  },
  ja: {
    pageTitle: "しつけができない公女様 — Saffron",
    pageTitleChars: "登場人物 — しつけができない公女様 — Saffron",
    workTitle: "しつけができない公女様",
    navWorld: "世界観",
    navMode: "トーン",
    navChars: "登場人物",
    charGongnyeo: "公女様",
    charButler: "執事",
    charMaid: "メイド",
    world: `
      <span class="duchess-seal"><span class="crest">⚜</span> 当主承認済み（本人承認）</span>
      <h2>世界観</h2>
      <img class="hero-image" src="${IMG}" alt="しつけができない公女様 世界観イメージ">
      <p class="hero-caption">※ 仮の画像です。実際の表紙・挿絵のURLに差し替えてください。</p>
      <p>
        帝国屈指の名門、ローゼンクロー公爵家。問題は、この家が有名な理由の半分が「格式」で、
        もう半分が「騒動」だということだ。公女は生まれた瞬間からこの家を正す者に指名されたが、
        肝心の家の者たちは、公女が真顔になるほど楽しそうに見える。
      </p>
      <p>
        豪奢な応接間と尽きることのない舞踏会の招待状の裏には、毎日大小の騒ぎを起こす使用人たちと、
        その後始末に疲れ果てていく公女がいる。この物語は、そんな騒がしい公爵家の毎日を追いかける。
      </p>`,
    mode: `
      <h2>トーン</h2>
      <p>
        基本のトーンはコメディに近い。公女が厳かにお説教を始めるほど空気はずれていき、
        笑っているのはお説教を受けている側だ。ただ、その騒ぎの下には、この家の人々なりの
        愛情があることに、公女だけが最後まで気づかない。
      </p>
      <p>
        軽やかな宮廷コメディと穏やかな成長物語を行き来しながら、エピソードごとに
        少しずつ違う味わいで構成していく予定だ。
      </p>`
  }
};
