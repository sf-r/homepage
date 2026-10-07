// '세 개의 미래에서 온 그녀들' 세계관 페이지의 영어판·일본어판.
// 한국어는 index.html 원문을 그대로 씁니다. 키는 HTML의 data-i18n 값과 같습니다.
// 이름·장소·용어는 현지화 용어집(영어: 뉴욕·허드슨 / 일본어: 도쿄·다마가와)을 따릅니다.

/* 진실 조각 카드 묶음을 만든다. 구조는 index.html과 같다. */
function pieceGroups(L, groups) {
  return groups.map(([cls, name, who, pieces]) => `
        <div class="piece-group ${cls}">
          <h3>${name} <span class="piece-who">· ${who}</span></h3>
          ${pieces.map(([cond, how, trace, content], i) => `
          <details class="secret piece">
            <summary>${L.shard(i + 1)}</summary>
            <div class="secret-body">
              <dl class="piece-cond">
                <dt>${L.unlock}</dt><dd>${cond}</dd>
                <dt>${L.three}</dt><dd>${how}</dd>
                <dt>${L.route}</dt><dd>${L.trace(trace, i === 0 ? 40 : 70)}</dd>
              </dl>
              <details class="secret inner">
                <summary>${L.shardContent}</summary>
                <div class="secret-body"><p>${content}</p></div>
              </details>
            </div>
          </details>`).join("")}
        </div>`).join("");
}

/* ------------------------------------------------------------------ English */
const EN_L = {
  shard: (n) => `Shard ${n} · Show condition`,
  shardContent: "Show shard",
  unlock: "Unlocks",
  three: "Three mode",
  route: "1:1 route",
  trace: (t, n) => `The trace “${t}” (its meaning can be read once your partner's trust is ${n}+)`
};

const EN = {
  pageTitle: "Those Who Came from Three Futures — Saffron",
  pageTitleChars: "Characters — Those Who Came from Three Futures — Saffron",
  workTitle: "Those Who Came from Three Futures",
  navWorld: "World",
  navFutures: "The Three Futures",
  navPieces: "Truth Shards",
  navMode: "How to Play",
  navChars: "Characters",
  world: `
      <span class="rift-badge"><span class="mark">✦</span> D-30 · Days left until That Day</span>
      <h2>World</h2>
      <p class="lead">
        Thirty days from now, a rift in time will open in the sky over New York, and your choice before it
        will lock in one of three futures. Each of those futures has sent back one returner, and none of the
        three knew the others existed.
      </p>
      <p>
        Fall 2026, New York. You live alone in an old 3rd-floor walk-up. At the end of the block, on the
        second floor, live eight-year-old Skylar Reyes and her mom, who runs the deli. The neighborhood has a
        24-hour bodega, a shuttered video store, and a bike path running down to the Hudson.
      </p>
      <p>
        Midnight on D-0: That Day. Above the Hudson, a wound opens in the sky where many times have collided at
        a single point. The rift will not close on its own, and it responds only to you, the Anchor. Not even the
        returners know why it is you.
      </p>
      <p>
        On D-15, a thin crack begins to show in the sky. The same minute passes twice, a street disappears, the
        clocks stop. And the returners' memories begin, little by little, to change.
      </p>

      <h3>Rules of Returning</h3>
      <ul class="rule-list">
        <li>Each person can return only once, and there is no way back.</li>
        <li>A returner's body is tied to their own future. The further that future drifts, the more their fingertips fade and their words break off.</li>
        <li>When the future is locked in on That Day, every returner not from that future disappears.</li>
        <li>Saying the heart of the future outright brings on a headache and a nosebleed. Passing it along through memories, metaphors, actions, or objects works.</li>
        <li>Three futures sending someone back at the same time is an anomaly without precedent.</li>
      </ul>`,
  futures: `
      <h2>The Three Futures</h2>
      <p>What you do before the rift on That Day sets the whole future into a single path.</p>
      <div class="future-cards">
        <article class="future-card ash">
          <span class="future-year">2041</span>
          <h3>The Ash Future</h3>
          <p class="future-choice">You take the child in your arms and run from the rift</p>
          <p>Without its Anchor, the rift spews ash for fifteen years. Whoever the ash touches loses their memories first, then vanishes. The survivors live in the subway tunnels.</p>
          <p class="future-you">You, in that future · Captain of the survivor unit the Grey Lanterns. Strict, but never left anyone behind.</p>
          <p class="future-sender">Sent by · Mara Ashford</p>
        </article>
        <article class="future-card gold">
          <span class="future-year">2046</span>
          <h3>The Gold Future</h3>
          <p class="future-choice">You stand your ground before the rift and take in its power</p>
          <p>Arcadia, a city governed by the emotional synchronization system Resonance. No crime and no war, but no one asks their own heart anything.</p>
          <p class="future-you">You, in that future · The eternal Chair, bound to the system and never aging.</p>
          <p class="future-sender">Sent by · Quinn Goldsmith</p>
        </article>
        <article class="future-card blue">
          <span class="future-year">2048</span>
          <h3>The Blue Future</h3>
          <p class="future-choice">You push the child away and walk into the rift alone</p>
          <p>Peaceful, as if nothing ever happened. People call That Day the Clear Night.</p>
          <details class="secret">
            <summary>You, in that future · Reveal secret</summary>
            <div class="secret-body">
              <p>Missing. Only a single letter was left behind. A future where the world is at peace, and you are gone.</p>
              <p class="secret-when">Revealed when · Sky's trust 40+</p>
            </div>
          </details>
          <p class="future-sender">Sent by · Sky</p>
        </article>
      </div>`,
  pieces: `
      <h2>Truth Shards</h2>
      <p>
        The Truth of That Day is split into six shards, two in each of the three futures. In Three mode you get
        them from the returners. On a 1:1 route you get them from the Traces that the absent futures drop through
        the cracks in the timeline. The second shard is the moment that person admits their own future was wrong.
      </p>
      <p class="secret-hint">Press a button to see the condition first, then press again to open the shard itself.</p>
      <div class="piece-groups">${pieceGroups(EN_L, [
        ["ash", "The Ash Future", "Mara Ashford", [
          ["Mara's trust 40+", "Mara recalls a voice she heard in the ash, calling out for someone.", "a handful of ash", "The rift is not a disaster but a door searching for its Anchor. The ash was the blood of a door without one."],
          ["Mara's trust 70+", "“Don't leave the door empty,” engraved on the back of the Captain's dog tag.", "a fragment of a rusted dog tag", "The Ash future ran wild because you fled and left the door empty."]
        ]],
        ["gold", "The Gold Future", "Quinn Goldsmith", [
          ["Quinn's trust 40+", "Quinn unravels the Resonance pattern on a cufflink and explains the design.", "a faded gold shard", "Resonance is a structure for sharing the rift's power among many. Shared, it holds steady."],
          ["Quinn's trust 70+", "Along with a confession: Quinn was always outside Resonance.", "a Resonance pattern", "With one person at the center, everyone was bound. With many at the center, everyone is free."]
        ]],
        ["blue", "The Blue Future", "Sky", [
          ["Sky's trust 40+", "Sky's measurement data. With the letter, if her identity is already out.", "a scrap of a wet letter", "The door closes only if the Anchor pulls it shut from inside, and alone, the Anchor cannot come back."],
          ["Sky's trust 70+", "Along with the realization that her own future will disappear.", "an old measurement log", "If someone from another time holds on, the Anchor comes back. That someone is a returner."]
        ]]
      ])}
      </div>

      <details class="secret hidden-path">
        <summary>The two hidden paths · Show condition</summary>
        <div class="secret-body">
          <dl class="piece-cond">
            <dt>Three mode</dt><dd>Gather all six shards, and with all three returners' trust at 80+, try to close the rift together with all three.</dd>
            <dt>1:1 route</dt><dd>Gather all six shards, and with your partner's trust at 80+, try to close the rift together with your partner.</dd>
          </dl>
          <p class="secret-when">The returners realize these paths exist at the same moment you do, once all six shards are gathered.</p>
          <details class="secret inner">
            <summary>Show</summary>
            <div class="secret-body">
              <p>Put the six shards together and a way to close the rift without a sacrifice comes into view.</p>
              <p><strong>The Fourth Future</strong> (Three mode): You enter the rift, and the three returners each stake their own future to hold on to you and share its power. The rift closes and you come back. All three futures vanish, and the three remain in this time with nowhere to return to.</p>
              <p><strong>Just Us</strong> (1:1 route): Your partner holds on alone, and the Traces you gathered bear the share of the two futures that never arrived. The price is that your partner loses most of her memories of her own future. Mara loses her Captain's face, Quinn loses Arcadia and the years in hiding, and Sky loses twenty-two years of research.</p>
            </div>
          </details>
        </div>
      </details>`,
  mode: `
      <h2>How to Play</h2>
      <p>
        <strong>Three mode</strong>: all three returners appear. Each morning you choose who to spend the day with,
        dividing your trust among them, and head toward That Day amid the tension between the three.
      </p>
      <p>
        <strong>1:1 routes</strong>: only one returner arrived in this timeline. The two futures that never made it
        leave Traces instead of people. There are three routes, one for each returner.
      </p>`
};

/* ------------------------------------------------------------------ 日本語 */
const JA_L = {
  shard: (n) => `かけら ${n} · 条件を見る`,
  shardContent: "かけらの内容を見る",
  unlock: "解放",
  three: "三人モード",
  route: "1:1ルート",
  trace: (t, n) => `痕跡「${t}」（パートナーの信頼${n}以上で意味に気づける）`
};

const JA = {
  pageTitle: "三つの未来から来た彼女たち — Saffron",
  pageTitleChars: "登場人物 — 三つの未来から来た彼女たち — Saffron",
  workTitle: "三つの未来から来た彼女たち",
  navWorld: "世界観",
  navFutures: "三つの未来",
  navPieces: "真実のかけら",
  navMode: "遊び方",
  navChars: "登場人物",
  world: `
      <span class="rift-badge"><span class="mark">✦</span> D-30 · あの日まであと</span>
      <h2>世界観</h2>
      <p class="lead">
        三十日後、東京の空に開く時間の裂け目。その前でのあなたの選択が、三つの未来のうちひとつを確定させる。
        三つの未来はそれぞれ一人ずつ回帰者を送り込み、三人は互いの存在を知らなかった。
      </p>
      <p>
        2026年秋、東京。あなたは古いアパートの3階に一人で暮らしている。同じ路地の突き当たり、2階の家には
        八歳の青野遥と、惣菜屋を営む母親が住んでいる。近所には24時間のコンビニ、潰れたレンタルビデオ店、
        多摩川へ続くサイクリングロードがある。
      </p>
      <p>
        D-0の午前0時、「あの日」。多摩川の上空に、いくつもの時間が一点でぶつかってできた傷が開く。
        裂け目はひとりでには閉じず、「錨」であるあなたにだけ反応する。なぜあなたなのかは、回帰者たちも知らない。
      </p>
      <p>
        D-15、空に細いひびが見えはじめる。同じ一分が二度流れ、路地が消え、時計が止まる。
        そして回帰者たちの記憶も、少しずつ変わりはじめる。
      </p>

      <h3>回帰の規則</h3>
      <ul class="rule-list">
        <li>回帰は一人につき一度きりで、戻る方法はない。</li>
        <li>回帰者の体は自分の未来につながっている。その未来が遠ざかるほど指先が透け、言葉が途切れる。</li>
        <li>あの日に未来が固まると、その未来の出身ではない回帰者は消える。</li>
        <li>未来の核心をそのまま口にすると、頭痛と鼻血に襲われる。回想・たとえ・行動・物に託して伝えるのはかまわない。</li>
        <li>三つの未来が同時に人を送り込んだのは、前例のない異常事態だ。</li>
      </ul>`,
  futures: `
      <h2>三つの未来</h2>
      <p>あの日、裂け目の前であなたが何をするかが、未来全体をひとつの道に固める。</p>
      <div class="future-cards">
        <article class="future-card ash">
          <span class="future-year">2041</span>
          <h3>灰の未来</h3>
          <p class="future-choice">子どもを抱いて裂け目から逃げる</p>
          <p>錨を失った裂け目が十五年間、灰を噴き出し続ける。灰に触れた者は記憶から失い、やがて消える。生き残った人々は地下鉄のトンネルで暮らしている。</p>
          <p class="future-you">その未来のあなた · 生存者部隊「灰色の灯」の隊長。厳しいが、誰ひとり見捨てなかった。</p>
          <p class="future-sender">送り込んだ人 · 灰崎 澪</p>
        </article>
        <article class="future-card gold">
          <span class="future-year">2046</span>
          <h3>金の未来</h3>
          <p class="future-choice">裂け目の前に踏みとどまり、その力を受け入れる</p>
          <p>感情同期システム「共鳴」が治める都市アルカディア。犯罪も戦争もないが、人々は自分の心に何も問わない。</p>
          <p class="future-you">その未来のあなた · システムに縛られ、老いることのない永遠の議長。</p>
          <p class="future-sender">送り込んだ人 · 金城 薫</p>
        </article>
        <article class="future-card blue">
          <span class="future-year">2048</span>
          <h3>青の未来</h3>
          <p class="future-choice">子どもを突き放し、ひとりで裂け目へ歩いていく</p>
          <p>何事もなかったかのように平和だ。人々はあの日を「晴れた夜」と呼ぶ。</p>
          <details class="secret">
            <summary>その未来のあなた · 秘密を見る</summary>
            <div class="secret-body">
              <p>行方不明。手紙が一通残されただけだった。世界が平和である代わりに、あなたが消えた未来。</p>
              <p class="secret-when">明かされる時 · ハルの信頼40以上</p>
            </div>
          </details>
          <p class="future-sender">送り込んだ人 · ハル</p>
        </article>
      </div>`,
  pieces: `
      <h2>真実のかけら</h2>
      <p>
        あの日の真実は六つのかけらに分かれ、三つの未来に二つずつ散らばっている。三人モードでは回帰者から、
        1:1ルートでは来られなかった未来が時間線の隙間に落としていく「痕跡」から、かけらを手に入れる。
        二つ目のかけらは、その人が自分の未来は間違っていたと認める瞬間だ。
      </p>
      <p class="secret-hint">ボタンを押すとまず条件が、もう一度押すとかけらの内容が開きます。</p>
      <div class="piece-groups">${pieceGroups(JA_L, [
        ["ash", "灰の未来", "灰崎 澪", [
          ["澪の信頼40以上", "澪が、灰の中で聞こえた「誰かを呼ぶ声」を思い出す。", "ひとつかみの灰", "裂け目は災厄ではなく、錨を探す扉だ。灰は、錨のない扉が流す血だった。"],
          ["澪の信頼70以上", "隊長の認識票の裏に刻まれた「扉を空けるな」。", "錆びた認識票のかけら", "灰の未来が暴走したのは、あなたが逃げて扉の前が空になったからだ。"]
        ]],
        ["gold", "金の未来", "金城 薫", [
          ["薫の信頼40以上", "薫がカフスの共鳴の紋様をほどいて、その設計を説明する。", "色褪せた金の破片", "共鳴とは、裂け目の力を大勢で分け合って受け止める仕組みだ。分け合えば安定する。"],
          ["薫の信頼70以上", "自分は共鳴の外にいる人間だった、という告白とともに。", "共鳴の紋様", "中心がひとりだったから、皆が縛られた。中心が大勢なら、皆が自由になれる。"]
        ]],
        ["blue", "青の未来", "ハル", [
          ["ハルの信頼40以上", "ハルの観測データ。正体が明かされたあとなら、手紙とともに。", "濡れた手紙の切れ端", "錨が内側から扉を引かなければ閉じず、ひとりでは戻ってこられない。"],
          ["ハルの信頼70以上", "自分の未来が消えるという気づきとともに。", "古い観測記録", "別の時間の人がつかまえていれば、錨は戻ってくる。その人とは、回帰者だ。"]
        ]]
      ])}
      </div>

      <details class="secret hidden-path">
        <summary>隠された二つの道 · 条件を見る</summary>
        <div class="secret-body">
          <dl class="piece-cond">
            <dt>三人モード</dt><dd>六つのかけらをすべて集め、三人の信頼がすべて80以上のとき、三人と一緒に裂け目を閉じようとする。</dd>
            <dt>1:1ルート</dt><dd>六つのかけらをすべて集め、パートナーの信頼が80以上のとき、パートナーと一緒に裂け目を閉じようとする。</dd>
          </dl>
          <p class="secret-when">この道の存在には、六つのかけらがそろったとき、回帰者たちも一緒に気づく。</p>
          <details class="secret inner">
            <summary>内容を見る</summary>
            <div class="secret-body">
              <p>六つのかけらを合わせると、誰も犠牲にせずに裂け目を閉じる道が見えてくる。</p>
              <p><strong>四番目の未来</strong>（三人モード）— あなたが裂け目に入り、三人の回帰者がそれぞれ自分の未来を懸けてあなたをつかまえ、力を分け合って受け止める。裂け目は閉じ、あなたは戻ってくる。三つの未来はすべて消え、三人は帰る場所のないまま、この時間に残る。</p>
              <p><strong>ふたりの道</strong>（1:1ルート）— パートナーひとりがつかまえ、集めた痕跡が来られなかった二つの未来の分を代わりに支える。その代償として、パートナーは自分の未来の記憶のほとんどを失う。澪は隊長の顔を、薫はアルカディアと身を隠して生きた日々を、ハルは二十二年の研究を。</p>
            </div>
          </details>
        </div>
      </details>`,
  mode: `
      <h2>遊び方</h2>
      <p>
        <strong>三人モード</strong> — 三人の回帰者が全員登場する。毎朝その日の同行者を選んで信頼を分け合って積み上げ、
        三人のあいだの緊張の中で、あの日へ向かっていく。
      </p>
      <p>
        <strong>1:1ルート</strong> — この時間線には一人だけがたどり着いた。来られなかった二つの未来は、人の代わりに
        「痕跡」を残す。回帰者ごとにひとつずつ、三つのルートがある。
      </p>`
};

export const PAGE_TEXT = { en: EN, ja: JA };
