import type { Devotional } from "./types";

/**
 * THE WORD OF THE DAY — devotional content.
 *
 * This file is the entire content database for the prototype. It is a
 * plain, typed array so it can be swapped for a CMS or database later
 * without touching any component — every page reads through the
 * functions in `src/content/index.ts`, never this array directly.
 *
 * See src/content/README.md for how to add tomorrow's Word.
 */
export const devotionals: Devotional[] = [
  {
    id: "d1",
    slug: "god-is-still-working",
    date: "2026-10-05",
    title: "God Is Still Working",
    book: "Romans",
    chapter: 8,
    verseStart: 28,
    scriptureReference: "ROMANS 8:28",
    scriptureText:
      "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    keyMessage: "What looks unfinished to you is not unfinished to God.",
    reflection: [
      "There is a particular kind of ache that comes from watching a situation stay broken longer than you think it should. You prayed. You waited. You did what you knew to do. And still — the job hasn't come, the relationship hasn't healed, the diagnosis hasn't changed.",
      "Paul doesn't write this verse from a distance. He writes it from inside suffering, persecution, and uncertainty of his own. He isn't promising that every individual thing that happens to you is good. He is promising something sturdier than that: that God is weaving all of it — the painful and the ordinary alike — toward a good He has already decided on.",
      "You are not watching a finished painting and judging it unfinished. You are watching a brushstroke, up close, before the picture has resolved. God is not panicking over your unfinished season. He is working in it.",
    ],
    reflectionQuestion:
      "What is one situation you've been tempted to call \"ruined\" that God might actually still be working through?",
    prayer:
      "Father, I confess that waiting makes me want to take back the pen. Teach me to trust Your hand even in the parts of my story I cannot yet read. Where I see delay, let me remember You are not absent — You are working. In Jesus' name, Amen.",
    topics: ["Faith", "Waiting", "Spiritual Growth"],
    featuredImage: "sunrise-ridge",
    featuredImageAlt:
      "Soft golden light breaking over a quiet ridge at first light",
    seoTitle: "God Is Still Working — Romans 8:28 Devotional",
    seoDescription:
      "A devotional on Romans 8:28 for anyone in an unfinished season — what looks stalled to you may still be moving in God's hands.",
    published: true,
    featured: true,
  },
  {
    id: "d2",
    slug: "the-waiting-is-not-wasted",
    date: "2026-10-04",
    title: "The Waiting Is Not Wasted",
    book: "Isaiah",
    chapter: 40,
    verseStart: 31,
    scriptureReference: "ISAIAH 40:31",
    scriptureText:
      "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    keyMessage:
      "Waiting on God is not standing still — it is being made strong enough for what's next.",
    reflection: [
      "We tend to picture waiting as an empty room — nothing happening, nothing changing, time simply passing. But the Hebrew word behind \"wait\" here carries the sense of a rope wound tight, bound and entwined with something stronger than itself.",
      "That changes the picture entirely. To wait on the Lord is not to sit outside His work. It is to be tethered to Him while He works — in you, before He works through you.",
      "The eagle doesn't earn its wings by flapping harder. It rises because it has caught a current it didn't create. Your strength, too, is not something you will white-knuckle into existence. It is something you receive, by staying close to the One who gives it.",
    ],
    reflectionQuestion:
      "Where have you been trying to manufacture strength that God wants to give you instead?",
    prayer:
      "Lord, I grow weary of waiting and want to force open doors You haven't opened. Teach me to be tethered to You in this season, trusting that my strength will come from staying near, not from striving alone. Amen.",
    topics: ["Waiting", "Strength", "Faith"],
    featuredImage: "mountain-mist",
    featuredImageAlt: "Mist moving slowly across layered mountain ridgelines",
    seoTitle: "The Waiting Is Not Wasted — Isaiah 40:31 Devotional",
    seoDescription:
      "A devotional on Isaiah 40:31 about what it really means to wait on the Lord — and the strength that comes from it.",
    published: true,
  },
  {
    id: "d3",
    slug: "made-on-purpose-for-a-purpose",
    date: "2026-10-03",
    title: "You Were Made on Purpose, for a Purpose",
    book: "Jeremiah",
    chapter: 29,
    verseStart: 11,
    scriptureReference: "JEREMIAH 29:11",
    scriptureText:
      "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    keyMessage:
      "Before you questioned your purpose, God had already planned it.",
    reflection: [
      "This verse was written to a people in exile — displaced, far from home, with every external reason to believe God had forgotten them. And it was into exactly that silence that God spoke a plan.",
      "If you feel far from where you thought your life would be by now, you are in good company. The promise was never that you'd always understand the plan. It was that there is one, and that it is good, and that it belongs to Someone who has already thought it all the way through.",
      "Purpose is not something you have to manufacture from nothing. It's something you get to discover, one obedient step at a time, from a God who already knows the end.",
    ],
    reflectionQuestion:
      "What would change today if you believed God's plan for you was still intact?",
    prayer:
      "Father, when my life doesn't match the plan I imagined, remind me that Yours was never dependent on mine. Give me peace to walk forward even where I can't yet see the whole picture. Amen.",
    topics: ["Purpose", "Faith", "Direction"],
    featuredImage: "wheat-field",
    featuredImageAlt: "A wide field of wheat moving gently in early light",
    seoTitle: "You Were Made on Purpose — Jeremiah 29:11 Devotional",
    seoDescription:
      "A devotional on Jeremiah 29:11 for anyone who feels far from where they thought life would be by now.",
    published: true,
  },
  {
    id: "d4",
    slug: "discipline-is-an-act-of-love",
    date: "2026-10-02",
    title: "Discipline Is an Act of Love",
    book: "Hebrews",
    chapter: 12,
    verseStart: 11,
    scriptureReference: "HEBREWS 12:11",
    scriptureText:
      "Now no chastening for the present seemeth to be joyous, but grievous: nevertheless afterward it yieldeth the peaceable fruit of righteousness unto them that are exercised thereby.",
    keyMessage: "The discomfort of discipline is often the shape of God's love.",
    reflection: [
      "No one asks to be disciplined. We ask for comfort, for ease, for the short path. But a parent who truly loves a child does not only give what is wanted — they give what is needed, even when it costs the relationship something in the moment.",
      "God's discipline is not punishment for the condemned; it is correction for the beloved. It is proof you belong to Him, not proof you've failed Him.",
      "If God is pressing on an area of your life right now — a habit, a relationship, a pattern — consider that the pressure may be love wearing an uncomfortable shape.",
    ],
    reflectionQuestion:
      "Is there an area where you've mistaken God's correction for God's absence?",
    prayer:
      "Lord, discipline is hard to receive as love, but I believe You correct what You cherish. Give me a soft heart toward Your shaping, even when it costs me comfort. Amen.",
    topics: ["Discipline", "Spiritual Growth"],
    series: "7-days-of-discipline",
    seriesDay: 1,
    featuredImage: "window-light",
    featuredImageAlt: "Warm morning light cutting across a quiet wooden floor",
    seoTitle: "Discipline Is an Act of Love — Hebrews 12:11 Devotional",
    seoDescription:
      "Day 1 of 7 Days of Discipline — a devotional on Hebrews 12:11 and the loving shape of God's correction.",
    published: true,
  },
  {
    id: "d5",
    slug: "forgiveness-is-not-what-they-deserve",
    date: "2026-10-01",
    title: "Forgiveness Is Not What They Deserve",
    book: "Ephesians",
    chapter: 4,
    verseStart: 32,
    scriptureReference: "EPHESIANS 4:32",
    scriptureText:
      "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.",
    keyMessage: "You forgive because you were forgiven, not because they earned it.",
    reflection: [
      "Forgiveness is almost always offered to someone who, by any fair accounting, doesn't deserve it. That's not a flaw in forgiveness — that's the entire shape of it. Grace, by definition, is unearned.",
      "This verse doesn't ask you to pretend the wound wasn't real. It asks you to remember a larger debt that was cancelled on your behalf, and to let that memory soften your hand.",
      "Forgiveness is not a feeling you wait to arrive. It is a decision you make in obedience, and the feeling often follows behind it — sometimes slowly, sometimes all at once.",
    ],
    reflectionQuestion: "Who is God asking you to release — not because they've earned it, but because you've been forgiven?",
    prayer:
      "Father, thank You for forgiving a debt I could never repay. Give me the strength to extend that same grace to someone who has hurt me, even before they ask for it. Amen.",
    topics: ["Forgiveness", "Relationships"],
    featuredImage: "harbor-dawn",
    featuredImageAlt: "Still water at a harbor at dawn, soft and unbroken",
    seoTitle: "Forgiveness Is Not What They Deserve — Ephesians 4:32",
    seoDescription:
      "A devotional on Ephesians 4:32 about releasing someone who hurt you — not because they earned it, but because you were forgiven first.",
    published: true,
  },
  {
    id: "d6",
    slug: "love-covers-what-pride-cannot",
    date: "2026-09-30",
    title: "Love Covers What Pride Cannot",
    book: "1 Corinthians",
    chapter: 13,
    verseStart: 4,
    verseEnd: 7,
    scriptureReference: "1 CORINTHIANS 13:4-7",
    scriptureText:
      "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; rejoiceth not in iniquity, but rejoiceth in the truth; beareth all things, believeth all things, hopeth all things, endureth all things.",
    keyMessage:
      "Real love is patient with people who are still becoming who God is making them.",
    reflection: [
      "This passage is quoted at so many weddings that it's easy to forget how confrontational it actually is. It was written to a divided, quarreling church — not a happy couple. Paul isn't describing a feeling. He's describing a posture.",
      "Love that only shows up when it's easy isn't the love described here. This is love that stays patient through someone's growth, that doesn't keep a ledger, that chooses hope even when evidence is thin.",
      "If a relationship in your life feels hard right now, this isn't a verse telling you to stay silent about real harm. It is an invitation to ask what love, not pride, would do next.",
    ],
    reflectionQuestion:
      "Where has pride, rather than love, been directing your response to someone close to you?",
    prayer:
      "Lord, my love runs out quickly when I'm not being loved back. Teach me a love that endures, that isn't easily provoked, and that believes the best even when it's hard to see. Amen.",
    topics: ["Love", "Relationships"],
    featuredImage: "candle-glow",
    featuredImageAlt: "A single warm light glowing in a softly dark room",
    seoTitle: "Love Covers What Pride Cannot — 1 Corinthians 13 Devotional",
    seoDescription:
      "A devotional on 1 Corinthians 13:4-7 for relationships that feel hard right now — what love does that pride cannot.",
    published: true,
  },
  {
    id: "d7",
    slug: "fear-is-a-liar-with-a-loud-voice",
    date: "2026-09-29",
    title: "Fear Is a Liar With a Loud Voice",
    book: "2 Timothy",
    chapter: 1,
    verseStart: 7,
    scriptureReference: "2 TIMOTHY 1:7",
    scriptureText:
      "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
    keyMessage:
      "Fear speaks loudly, but it does not get the final word — God does.",
    reflection: [
      "Timothy was young, leading a difficult church, and apparently tempted to shrink back. Paul doesn't tell him the danger isn't real. He tells him where the fear is coming from — and where it isn't.",
      "Fear has a way of sounding like wisdom. It says it's just being careful, just being realistic. But there's a difference between discernment and a spirit of fear that keeps you small and silent.",
      "What God gives instead is specific: power to act, love that casts out self-protection, and a sound mind that can think clearly instead of spiraling. That is the voice worth listening to.",
    ],
    reflectionQuestion:
      "What is fear currently talking you out of that God might be calling you toward?",
    prayer:
      "Father, fear has been louder than faith lately. Remind me that You have not given me a spirit of fear, and fill the space it leaves with Your power, love, and a sound mind. Amen.",
    topics: ["Fear", "Anxiety", "Strength"],
    featuredImage: "storm-light",
    featuredImageAlt: "A break of light through heavy storm clouds over open land",
    seoTitle: "Fear Is a Liar — 2 Timothy 1:7 Devotional",
    seoDescription:
      "A devotional on 2 Timothy 1:7 for anyone battling fear right now — and the power, love, and sound mind God gives instead.",
    published: true,
  },
  {
    id: "d8",
    slug: "pray-like-someone-is-listening",
    date: "2026-09-28",
    title: "Pray Like Someone Is Listening",
    book: "Philippians",
    chapter: 4,
    verseStart: 6,
    verseEnd: 7,
    scriptureReference: "PHILIPPIANS 4:6-7",
    scriptureText:
      "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which is passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    keyMessage:
      "Peace is not the absence of a storm, it's the presence of God inside it.",
    reflection: [
      "Paul wrote this from a prison cell, which makes the instruction almost audacious: be anxious for nothing. Not because nothing is wrong, but because nothing is outside the reach of prayer.",
      "Notice the order. Thanksgiving comes before the peace, not after the problem is solved. Gratitude in the middle of a hard thing is often what opens the door for peace to walk in.",
      "This peace is described as something that guards — like a soldier standing watch over your heart and mind. It doesn't always answer every question. It stands guard anyway.",
    ],
    reflectionQuestion:
      "What is one specific anxious thought you can hand to God in prayer today, by name?",
    prayer:
      "Lord, I bring You what I've been carrying alone. Thank You even before the answer comes. Let Your peace, which doesn't need to make sense to work, guard my heart and mind today. Amen.",
    topics: ["Prayer", "Anxiety", "Peace"],
    featuredImage: "ocean-horizon",
    featuredImageAlt: "A calm, still ocean horizon at early morning",
    seoTitle: "Pray Like Someone Is Listening — Philippians 4:6-7",
    seoDescription:
      "A devotional on Philippians 4:6-7 for an anxious heart — and the peace that comes from giving it to God in prayer.",
    published: true,
  },
  {
    id: "d9",
    slug: "obedience-before-understanding",
    date: "2026-09-27",
    title: "Obedience Before Understanding",
    book: "Proverbs",
    chapter: 3,
    verseStart: 5,
    verseEnd: 6,
    scriptureReference: "PROVERBS 3:5-6",
    scriptureText:
      "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    keyMessage: "You don't need to see the whole staircase — just the next step.",
    reflection: [
      "We tend to want a map before we'll move. God, more often, gives a lamp — enough light for the next step, not the whole journey.",
      "Leaning on your own understanding doesn't just mean trusting your intellect. It means defaulting to what makes sense to you when it conflicts with what God has said. Trust, here, is a decision made before clarity arrives, not after.",
      "Direction is promised — but it's promised in acknowledgment, in the ongoing posture of including God in every way, not just the big decisions.",
    ],
    reflectionQuestion:
      "What decision are you waiting to fully understand before you're willing to trust God with it?",
    prayer:
      "Father, I don't need the whole map today — just the next step. Help me trust You with what I can't yet understand, and acknowledge You in every way, not just the obvious ones. Amen.",
    topics: ["Obedience", "Faith", "Direction"],
    featuredImage: "desert-road",
    featuredImageAlt: "A quiet road disappearing into soft morning haze",
    seoTitle: "Obedience Before Understanding — Proverbs 3:5-6 Devotional",
    seoDescription:
      "A devotional on Proverbs 3:5-6 for decision-making without full clarity — trusting God with what you can't yet see.",
    published: true,
  },
  {
    id: "d10",
    slug: "a-grateful-heart-sees-differently",
    date: "2026-09-26",
    title: "A Grateful Heart Sees Differently",
    book: "1 Thessalonians",
    chapter: 5,
    verseStart: 18,
    scriptureReference: "1 THESSALONIANS 5:18",
    scriptureText:
      "In every thing give thanks: for this is the will of God in Christ Jesus concerning you.",
    keyMessage: "Gratitude doesn't deny the hard season — it finds God inside of it.",
    reflection: [
      "This verse does not say give thanks for everything — as though every hardship is good. It says give thanks in everything — in the middle of it, alongside it, without waiting for it to end first.",
      "Gratitude is less about the size of your blessings and more about the posture of your attention. It trains your eyes to notice what grace is still present, even inside a hard chapter.",
      "A grateful heart doesn't ignore the pain in the room. It just refuses to let the pain be the only thing in it.",
    ],
    reflectionQuestion:
      "What is one small grace you can name today, even inside a hard season?",
    prayer:
      "Lord, teach me gratitude that doesn't wait for easier circumstances. Open my eyes to what is still good, still Yours, still present — even here. Amen.",
    topics: ["Gratitude", "Spiritual Growth"],
    featuredImage: "wheat-field",
    featuredImageAlt: "Golden light spilling across an open field at harvest",
    seoTitle: "A Grateful Heart Sees Differently — 1 Thessalonians 5:18",
    seoDescription:
      "A devotional on 1 Thessalonians 5:18 — practicing gratitude inside a hard season, not after it ends.",
    published: true,
  },
  {
    id: "d11",
    slug: "rooted-not-shaken",
    date: "2026-09-25",
    title: "Rooted, Not Shaken",
    book: "Psalm",
    chapter: 1,
    verseStart: 3,
    scriptureReference: "PSALM 1:3",
    scriptureText:
      "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.",
    keyMessage: "A life planted near God doesn't rush its fruit — it just stays rooted.",
    reflection: [
      "A tree does not strain to produce fruit. It simply stays planted, drawing from a source it did not create, and the fruit comes in its own season.",
      "So much of our spiritual anxiety comes from trying to force fruit on a timeline we set. This Psalm offers a different rhythm: stay near the water, and trust the season.",
      "Faith, in this picture, isn't frantic. It's rooted — quietly confident that nearness to God is never wasted, even when nothing visible seems to be happening yet.",
    ],
    reflectionQuestion:
      "What would it look like this week to focus on staying planted rather than forcing fruit?",
    prayer:
      "Father, plant me by Your water. I don't want to strain for fruit that only comes from staying near You. Teach me the patience of a rooted life. Amen.",
    topics: ["Faith", "Spiritual Growth", "Patience"],
    series: "7-days-of-faith",
    seriesDay: 1,
    featuredImage: "forest-light",
    featuredImageAlt: "Light filtering through tall trees onto a quiet forest floor",
    seoTitle: "Rooted, Not Shaken — Psalm 1:3 Devotional",
    seoDescription:
      "Day 1 of 7 Days of Faith — a devotional on Psalm 1:3 about staying planted instead of straining for fruit.",
    published: true,
  },
  {
    id: "d12",
    slug: "the-substance-of-things-hoped-for",
    date: "2026-09-24",
    title: "Faith Is the Substance of Things Hoped For",
    book: "Hebrews",
    chapter: 11,
    verseStart: 1,
    scriptureReference: "HEBREWS 11:1",
    scriptureText:
      "Now faith is the substance of things hoped for, the evidence of things not seen.",
    keyMessage: "Faith doesn't wait for proof — it is proof, given in advance.",
    reflection: [
      "Our culture trains us to trust only what we can measure. Scripture describes a different kind of knowing — one that holds substance and evidence even before the outcome arrives.",
      "This isn't blind optimism. It's confidence rooted in the character of the One doing the promising, not in how things currently look.",
      "If your hope feels thin right now, remember: faith was never meant to be the absence of uncertainty. It is substance, held, before the seeing comes.",
    ],
    reflectionQuestion:
      "What are you hoping for that you haven't yet treated as substantial, as real?",
    prayer:
      "Lord, grow my faith until it holds weight even before I see the outcome. Let my hope in You be substance, not just a wish. Amen.",
    topics: ["Faith", "Spiritual Growth"],
    series: "7-days-of-faith",
    seriesDay: 2,
    featuredImage: "mountain-mist",
    featuredImageAlt: "Early light breaking through fog over distant hills",
    seoTitle: "Faith Is the Substance of Things Hoped For — Hebrews 11:1",
    seoDescription:
      "Day 2 of 7 Days of Faith — a devotional on Hebrews 11:1 about the substance of faith before the outcome arrives.",
    published: true,
  },
  {
    id: "d13",
    slug: "when-god-feels-silent-he-is-still-working",
    date: "2026-09-23",
    title: "When God Feels Silent, He Is Still Working",
    book: "Habakkuk",
    chapter: 2,
    verseStart: 3,
    scriptureReference: "HABAKKUK 2:3",
    scriptureText:
      "For the vision is yet for an appointed time, but at the end it shall speak, and shall not lie: though it tarry, wait for it; because it will come, it will surely surely come, it will not tarry.",
    keyMessage: "Delay is not denial. The appointed time is still coming.",
    reflection: [
      "Habakkuk was a prophet who argued with God, openly, about the silence and injustice he saw. God's answer wasn't an explanation. It was a promise about timing.",
      "Silence from heaven can feel like absence. But Scripture repeatedly shows that God's quiet seasons are not empty ones — they are appointed, not accidental.",
      "You may be in a tarrying season right now. This verse doesn't ask you to pretend it doesn't hurt. It asks you to wait for an appointed time that will not lie.",
    ],
    reflectionQuestion:
      "What feels delayed in your life that you need to trust is simply appointed, not denied?",
    prayer:
      "Father, Your silence is hard to sit in. Help me trust that what tarries is still appointed, and that You have never once lied to me about Your timing. Amen.",
    topics: ["Waiting", "Faith"],
    series: "when-god-feels-silent",
    seriesDay: 1,
    featuredImage: "harbor-dawn",
    featuredImageAlt: "A quiet, empty shoreline just before sunrise",
    seoTitle: "When God Feels Silent, He Is Still Working — Habakkuk 2:3",
    seoDescription:
      "Day 1 of When God Feels Silent — a devotional on Habakkuk 2:3 for seasons when heaven feels quiet.",
    published: true,
  },
  {
    id: "d14",
    slug: "heartbreak-is-not-the-end-of-the-story",
    date: "2026-09-22",
    title: "Heartbreak Is Not the End of the Story",
    book: "Psalm",
    chapter: 34,
    verseStart: 18,
    scriptureReference: "PSALM 34:18",
    scriptureText:
      "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    keyMessage: "God is not distant from your grief. He is nearest right inside it.",
    reflection: [
      "We often picture God as most present when life is going well — as if pain pushes Him further away. This verse says the opposite: He draws nearest to the brokenhearted.",
      "Your heartbreak is not a disqualifying condition. It is, according to this Psalm, the very place He moves close.",
      "This doesn't erase the loss. But it means you are not grieving alone in a room God has left. He is nigh — near, present, close enough to reach.",
    ],
    reflectionQuestion: "Can you believe, today, that God is near rather than distant in your grief?",
    prayer:
      "Lord, my heart is broken in a way I don't know how to fix. Thank You for being near, not far, in exactly this place. Hold what I cannot. Amen.",
    topics: ["Heartbreak", "Relationships", "Healing"],
    series: "walking-through-heartbreak",
    seriesDay: 1,
    featuredImage: "candle-glow",
    featuredImageAlt: "A soft single light in a quiet, dim room",
    seoTitle: "Heartbreak Is Not the End of the Story — Psalm 34:18",
    seoDescription:
      "Day 1 of Walking Through Heartbreak — a devotional on Psalm 34:18 for anyone grieving a loss right now.",
    published: true,
  },
  {
    id: "d15",
    slug: "strength-for-the-weary",
    date: "2026-09-21",
    title: "Strength for the Weary",
    book: "Isaiah",
    chapter: 41,
    verseStart: 10,
    scriptureReference: "ISAIAH 41:10",
    scriptureText:
      "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    keyMessage: "You were never meant to carry this alone — and you still aren't.",
    reflection: [
      "Four promises sit back to back in this verse: presence, strength, help, and an upholding hand. God doesn't just acknowledge the fear — He answers it, point by point.",
      "Weariness often convinces us we have to find more strength from somewhere inside ourselves. This verse offers something different: strength that comes from being upheld, not from self-generating more willpower.",
      "If you are tired today — genuinely, bone-deep tired — this is not a verse asking you to try harder. It's an invitation to be held.",
    ],
    reflectionQuestion:
      "What would change if you stopped trying to find strength and let yourself be upheld instead?",
    prayer:
      "Father, I am weary in a way I can't talk myself out of. Thank You for upholding me with Your righteous right hand, even when I have nothing left to offer. Amen.",
    topics: ["Strength", "Fear", "Peace"],
    featuredImage: "sunrise-ridge",
    featuredImageAlt: "The first light of sunrise spilling gently over hills",
    seoTitle: "Strength for the Weary — Isaiah 41:10 Devotional",
    seoDescription:
      "A devotional on Isaiah 41:10 for anyone running on empty — strength that comes from being upheld, not self-generated.",
    published: true,
  },
];
