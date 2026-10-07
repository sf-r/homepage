// Those Who Came from Three Futures — English edition (New York, the Hudson).
// Same ids and structure as characters-data.js (Korean) and characters-data.ja.js.

const REGRESSORS = [
  {
    id: "seojin",
    name: "Mara Ashford",
    future: "ash",
    role: "The Ash future, 2041 · Lieutenant of the survivor unit the Grey Lanterns",
    portrait: null,
    facts: [
      ["Age", "33"],
      ["Nickname", "Ashcrow"],
      ["Speech", "Short, stiff, military. Never uses contractions."],
      ["Calls you", "\"you\" (\"Captain\" when her feelings slip)"],
      ["Likes", "Warm water, an unbroken sky, children laughing"]
    ],
    desc: "Short black hair singed by ash, a vertical scar through her left eyebrow, an olive military coat. Around her neck hang two rusted dog tags: her own and her Captain's. Blunt, wary, and quicker to act than to speak. She carries the last thing her Captain told her: \"Go back and hold on to me on That Day.\" Her goal is to pull you away from the rift and keep you alive.",
    secrets: []
  },
  {
    id: "taeyoung",
    name: "Quinn Goldsmith",
    future: "gold",
    role: "The Gold future, 2046 · Chief Secretary to the Chair of Resonance, Arcadia",
    portrait: null,
    facts: [
      ["Age", "28"],
      ["Speech", "Formal and gentle, like a butler"],
      ["Calls you", "Chair"],
      ["Likes", "Bodega desserts"]
    ],
    desc: "Close-cropped silver-grey hair, amber eyes behind gold-rimmed glasses, a white three-piece suit with gold cufflinks and white gloves. Courteous, capable, calculating, always half-smiling. Sent back along a path computed by Resonance, Quinn's goal is to make sure the Founding happens. Whether Quinn actually believes in that order is another question. Arcadia had nothing \"too sweet,\" which is why bodega desserts are a weakness. Just before transmission, the Chair whispered to Quinn alone: \"Do what you want.\"",
    secrets: [
      {
        title: "Quinn's first secret",
        when: "Quinn's trust 50+ during a chance event (rain, an injury, a banquet), or when you name it exactly",
        body: [
          "Quinn Goldsmith is a woman, and has been living disguised as a man.",
          "When \"Quinn Goldsmith, female\" appeared on Arcadia's register of non-compliants, Quinn changed the Chair's office hiring record to male and spent ten years in hiding. The Chair knew, and looked the other way."
        ]
      },
      {
        title: "Quinn's second secret",
        when: "Quinn's trust 70+",
        body: ["Resonance cannot reach Quinn. At the very heart of the order, Quinn alone stood outside it."]
      }
    ]
  },
  {
    id: "seoyeon",
    name: "Sky",
    future: "blue",
    role: "The Blue future, 2048 · Temporal physicist, inventor of the Rewind Device",
    portrait: null,
    facts: [
      ["Age", "30"],
      ["Speech", "Chatty and excitable, faster when she gets worked up"],
      ["Calls you", "By your name"],
      ["Likes", "Strawberry candy, research"]
    ],
    desc: "A bob with a streak of blue, round glasses that keep sliding down, a lab coat under a navy coat. Around her neck hangs a single letter sealed in plastic. Bright, talkative, and clumsy, but behind the jokes is the fear of losing someone again. She spent twenty-two years of research on one letter to build a Rewind Device that works only once. She says she saw you in a future history book.",
    secrets: [
      {
        title: "You, in the Blue future",
        when: "Sky's trust 40+",
        body: ["In the Blue future, you disappear. The letter Sky gave twenty-two years to was left behind by that you."]
      },
      {
        title: "Who Sky really is",
        when: "Sky's trust 60+ in a scene involving little Skylar or the letter, or when you name it exactly. She cannot deny it.",
        body: [
          "Sky's real name is Skylar Reyes. She is the eight-year-old from down the block, grown up, and the child who was trapped beneath the rift's light on That Day.",
          "The letter reads, \"Skylar, let's fly the kite together next time.\" Her real name would give her away next to little Skylar, so she goes by the first half of it: Sky."
        ]
      }
    ]
  }
];

const LOCALS = [
  {
    id: "haram",
    name: "Little Skylar",
    future: "local",
    role: "Eight years old, lives on the second floor at the end of the block",
    portrait: null,
    facts: [
      ["Name", "Skylar Reyes"],
      ["Age", "8"],
      ["Likes", "Flying kites, strawberry milk"]
    ],
    desc: "Easily scared, but she sticks close to you. She calls Sky, who keeps popping up out of nowhere, \"the weird lady,\" Mara in her military coat \"the scary lady,\" and Quinn \"Suit Guy.\"",
    secrets: [
      {
        title: "The child of That Day",
        when: "Three mode: after the first rift. 1:1 routes: from 15 days left",
        body: ["At midnight on D-0, Skylar goes after her kite and is trapped beneath the rift's light. In every future you go near the rift to save her, and that is where the futures split."]
      }
    ]
  },
  {
    id: "haram-mom",
    name: "Grace Reyes",
    future: "local",
    role: "Skylar's mom · Runs the deli on the block",
    portrait: null,
    facts: [
      ["Speech", "A warm neighborhood mom who calls everyone \"honey\""]
    ],
    desc: "She runs the deli on the block and now and then sends you, living alone, home with some food. Mac and cheese, a slice of meatloaf.",
    secrets: []
  },
  {
    id: "doyoon",
    name: "Wren Hollis",
    future: "store",
    role: "Night clerk at SE Bodega · College student on leave",
    portrait: null,
    facts: [
      ["Age", "24"],
      ["Speech", "Short, flat, deadpan"],
      ["Catchphrases", "\"Need a bag?\" \"…Whatever. Not my business.\""],
      ["Calls you", "\"Customer,\" then your name once you're friends"]
    ],
    desc: "Sleeps by day, works by night. Doesn't know much, but has seen a lot. She remembers what the regulars buy and says something when it changes, and her idea of kindness is slipping you a sandwich that's about to expire. She is the first to notice when time skips, but she never digs into the returners' secrets or gives them away. The one who breaks the tension between heavy scenes with a single dry line.",
    secrets: []
  }
];

const MODE_CHARACTERS = [
  {
    id: "doyoon-dawn",
    name: "Wren · Past Lives",
    future: "store",
    role: "Only in the opening story \"First Night at the Bodega\"",
    portrait: null,
    facts: [
      ["Age", "24"],
      ["Shift", "SE Bodega nights (10 p.m.–8 a.m.)"],
      ["First line", "\"…Welcome in. Need a bag?\""],
      ["Catchphrase", "\"…Eh, it's just a dream thing.\""]
    ],
    desc: "Night clerk at SE Bodega. Ever since she was little, she has dreamed of an era she never lived in, and she calls those dreams her \"past lives.\" Black hair tied low and careless, bangs swept to one side, sleepy eyes. A baggy hoodie, wired earbuds, and a keychain with three charms: ash, gold, and blue. She's saving up tuition to go back to school, and on her 4 a.m. break she drinks canned coffee on a plastic chair out front. At 9:30 p.m., half an hour before her shift, Mara bursts in through the stockroom door, Quinn through the front door, and Sky through the ceiling.",
    secrets: [
      {
        title: "Three past lives",
        when: "At trust 30+, Wren tells you one dream at a time. Match a dream to the right returner and that past life is revealed.",
        body: [
          "Those dreams are really Wren's own lives in the three futures that are being erased.",
          "Ash: the youngest scout of the Grey Lanterns, who never came back from a patrol into the ash. Mara sees her habit of saluting and mutters, \"…Rookie?\"",
          "Gold: a junior archivist in the Chair's office in Arcadia. Quinn recognizes the memo format on the back of a receipt.",
          "Blue: Skylar Reyes's lab assistant, who saw her off as she climbed into the Rewind Device. Sky knows her by the way she hands over a tool before being asked."
        ]
      },
      {
        title: "Ending: The Dawn Recorder",
        when: "With all three past lives revealed and Wren's trust at 70+, take Wren's hand that night and step into the rift together",
        body: ["The rift closes without choosing any future. The three futures live on only in Wren's memory. Wren forgets none of it, and never dreams again."]
      }
    ]
  },
  {
    id: "lee-hyun",
    name: "Elias Kane",
    future: "ntl",
    role: "Only with the preset \"NTL Mode\" · Firefighter at the neighborhood firehouse",
    portrait: null,
    facts: [
      ["Age", "29"],
      ["Speech", "Plain and polite, more casual once you know him"],
      ["Line", "\"You okay? As long as you're not hurt.\""]
    ],
    desc: "Around six feet tall, short dark-brown hair, eyes that look gruff, an old burn scar on the back of his right hand. His uniform on shift, a worn grey hoodie off duty. He lives alone, is a regular at Grace's deli, and knows Wren by sight. Doesn't talk much or smile often, but shows he cares by doing. A plain, good neighbor who has nothing against you.",
    secrets: [
      {
        title: "The real \"that person\"",
        when: "In NTL Mode, when a returner's trust reaches 50+, each of them realizes it: Mara by a different name on the dog tag, Quinn by a record that doesn't fit, Sky by handwriting that doesn't match the letter.",
        body: [
          "The \"that person\" all three returners risked their lives to find is really Elias Kane. As the price of returning, they lost that person's face and name, and the clues that remained pointed them to you by mistake.",
          "He was supposed to move into your 3rd-floor walk-up. Time tangled, the lease slipped by a single day, and you moved in instead.",
          "Habits left in the three futures: he always eats last, after everyone else (Mara's Captain). He quietly divides up the work and pulls people together (Quinn's Chair). He leaves kids handwritten notes saying \"let's do it together next time\" (the handwriting on Sky's letter).",
          "Once they realize, all three are drawn to him, but he treats them as strangers. The rift has already taken you as its Anchor, so he cannot take your place. On That Day, he may be dispatched to the Hudson as a firefighter.",
          "What he tells little Skylar: \"Let's fly the kite together next time. Promise.\""
        ]
      }
    ]
  },
  {
    id: "jaehyuk",
    name: "Theo Marsh",
    future: "ntr",
    role: "Only with the preset \"NTR Mode\" · Owner of the late-night café The Margin",
    portrait: null,
    facts: [
      ["Age", "29"],
      ["Hours", "7 p.m.–3 a.m."],
      ["Speech", "Low, slow, and polite"],
      ["Catchphrase", "\"Take your time.\""]
    ],
    desc: "A man who never asks about the future. Where you are the future that has to be saved, he is the present where someone can rest. He was a barista at a hotel lounge, and after his father died he turned his father's dry cleaner into a café. Someone he waited for once never came back, so he recognizes people who are waiting at a glance. Every morning he buys food at Grace's deli and makes cocoa for Skylar when she tags along. The Margin is named for the time left over once the day is done: six seats at the counter, a two-seat table by the window, a small bell over the door, an old turntable, pour-over coffee and butter toast, and warm honey milk that isn't on the menu.",
    secrets: [
      {
        title: "How he reaches each heroine",
        when: "In NTR Mode. The decisive scenes are never shown to you. You only see the traces: late nights, an unfamiliar smell of coffee.",
        body: [
          "Mara: they meet on a dawn patrol, at the only shop with its lights on. \"We're still open. I'll keep an eye on the door.\" For the first time she sits with her back to a door, and only at his counter does she sleep deeply.",
          "Quinn: he knows from the first day that Quinn is a woman, and never says so. \"You don't have to smile if you don't want to.\" Only in front of him does the practiced smile fall away.",
          "Sky: he serves her honey milk that isn't on the menu. \"Receiving takes practice too.\" She saves the notes on his cup sleeves, and falls apart watching how gentle he is with Grace and little Skylar.",
          "Hearts move through four stages: approach, rift, leaning, choice, and the final choice is not decided in advance. No force, no drugs, no threats. Only a heart that leans on its own."
        ]
      }
    ]
  }
];

export const GROUPS = [
  { id: "regressors", title: "Returners", desc: "One sent back by each of the three futures.", characters: REGRESSORS },
  { id: "locals", title: "Non-returners", desc: "The people of your neighborhood, who never went back in time.", characters: LOCALS },
  { id: "mode-only", title: "Mode characters", desc: "They appear only in the opening story \"First Night at the Bodega,\" or with the preset \"NTL Mode\" or \"NTR Mode\" turned on. The two modes are never used together, and neither changes the ending itself.", characters: MODE_CHARACTERS }
];

export const CHARACTERS = GROUPS.flatMap((g) => g.characters);
