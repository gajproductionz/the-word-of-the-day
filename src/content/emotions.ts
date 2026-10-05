import type { EmotionWord } from "./types";

/**
 * Powers "I Need A Word". Each entry maps a feeling or situation to a
 * Scripture, a short encouragement, and the devotional most relevant to it.
 */
export const emotionWords: EmotionWord[] = [
  {
    slug: "discouraged",
    label: "I'm Discouraged",
    scriptureReference: "PSALM 34:18",
    scriptureText:
      "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    encouragement:
      "Discouragement feels like proof that God has stepped back. It's actually the place He draws nearest. You are not too far gone for Him to reach.",
    devotionalSlug: "heartbreak-is-not-the-end-of-the-story",
  },
  {
    slug: "heartbroken",
    label: "I'm Heartbroken",
    scriptureReference: "PSALM 34:18",
    scriptureText:
      "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    encouragement:
      "Your grief is not a disqualifying condition. It is, according to this Psalm, the very place God moves close. You are not grieving alone.",
    devotionalSlug: "heartbreak-is-not-the-end-of-the-story",
  },
  {
    slug: "anxious",
    label: "I'm Anxious",
    scriptureReference: "PHILIPPIANS 4:6-7",
    scriptureText:
      "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God... shall keep your hearts and minds through Christ Jesus.",
    encouragement:
      "Peace isn't the absence of a storm — it's a Person standing guard inside it. Bring Him what you're carrying, by name.",
    devotionalSlug: "pray-like-someone-is-listening",
  },
  {
    slug: "need-direction",
    label: "I Need Direction",
    scriptureReference: "PROVERBS 3:5-6",
    scriptureText:
      "Trust in the LORD with all thine heart; and lean not unto thine own understanding... and he shall direct thy paths.",
    encouragement:
      "You don't need the whole staircase lit up. You only need enough light for the next step — and that, He has already given.",
    devotionalSlug: "obedience-before-understanding",
  },
  {
    slug: "worried-about-money",
    label: "I'm Worried About Money",
    scriptureReference: "MATTHEW 6:26",
    scriptureText:
      "Behold the fowls of the air: for they sow not, neither do they reap... yet your heavenly Father feedeth them. Are ye not much better than they?",
    encouragement:
      "The same Father who sustains what cannot plan or save for tomorrow has not forgotten you. Bring the worry to Him before it becomes fear.",
    devotionalSlug: "god-is-still-working",
  },
  {
    slug: "relationship-struggle",
    label: "I'm Struggling in a Relationship",
    scriptureReference: "1 CORINTHIANS 13:4-7",
    scriptureText:
      "Charity suffereth long, and is kind... beareth all things, believeth all things, hopeth all things, endureth all things.",
    encouragement:
      "Love that only shows up when it's easy isn't the love you were shown. Ask what love, not pride, would do next.",
    devotionalSlug: "love-covers-what-pride-cannot",
  },
  {
    slug: "angry",
    label: "I'm Angry",
    scriptureReference: "EPHESIANS 4:26",
    scriptureText: "Be ye angry, and sin not: let not the sun go down upon your wrath.",
    encouragement:
      "Your anger isn't automatically sin — but what you do with it can become one. Bring it to God before the sun sets on it.",
    devotionalSlug: "forgiveness-is-not-what-they-deserve",
  },
  {
    slug: "need-peace",
    label: "I Need Peace",
    scriptureReference: "PHILIPPIANS 4:6-7",
    scriptureText:
      "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    encouragement:
      "This peace doesn't require the situation to make sense first. It stands guard over your heart and mind right where you are.",
    devotionalSlug: "pray-like-someone-is-listening",
  },
  {
    slug: "need-strength",
    label: "I Need Strength",
    scriptureReference: "ISAIAH 41:10",
    scriptureText:
      "Fear thou not; for I am with thee... I will strengthen thee; yea, I will help thee; yea, I will uphold thee.",
    encouragement:
      "You weren't meant to find more strength from somewhere inside yourself. You were meant to be upheld. Let Him.",
    devotionalSlug: "strength-for-the-weary",
  },
  {
    slug: "need-discipline",
    label: "I Need Discipline",
    scriptureReference: "HEBREWS 12:11",
    scriptureText:
      "No chastening for the present seemeth to be joyous, but grievous: nevertheless afterward it yieldeth the peaceable fruit of righteousness.",
    encouragement:
      "The discomfort of discipline is often love wearing an uncomfortable shape. What feels like pressure may be God shaping you on purpose.",
    devotionalSlug: "discipline-is-an-act-of-love",
  },
  {
    slug: "faith-feels-weak",
    label: "My Faith Feels Weak",
    scriptureReference: "MARK 9:24",
    scriptureText: "Lord, I believe; help thou mine unbelief.",
    encouragement:
      "That prayer — honest, half-doubting — is still a prayer of faith. You don't need certainty to come to God. You just need to come.",
    devotionalSlug: "the-substance-of-things-hoped-for",
  },
  {
    slug: "grateful",
    label: "I'm Grateful",
    scriptureReference: "1 THESSALONIANS 5:18",
    scriptureText: "In every thing give thanks: for this is the will of God in Christ Jesus concerning you.",
    encouragement:
      "Let this gratitude become a habit, not just a reaction — a lens you bring into the next hard season, too.",
    devotionalSlug: "a-grateful-heart-sees-differently",
  },
  {
    slug: "feel-alone",
    label: "I Feel Alone",
    scriptureReference: "DEUTERONOMY 31:6",
    scriptureText:
      "Be strong and of a good courage... for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.",
    encouragement:
      "Feeling alone and being alone are not the same thing. He has not left, even when the room feels empty.",
    devotionalSlug: "strength-for-the-weary",
  },
  {
    slug: "waiting-on-god",
    label: "I'm Waiting on God",
    scriptureReference: "ISAIAH 40:31",
    scriptureText:
      "They that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.",
    encouragement:
      "Waiting on God is not standing still. You are being made strong enough for what's coming next.",
    devotionalSlug: "the-waiting-is-not-wasted",
  },
  {
    slug: "need-forgiveness",
    label: "I Need Forgiveness",
    scriptureReference: "1 JOHN 1:9",
    scriptureText:
      "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
    encouragement:
      "You don't have to carry what you've already confessed. He is not reluctant to forgive you — He is faithful to.",
    devotionalSlug: "forgiveness-is-not-what-they-deserve",
  },
  {
    slug: "need-purpose",
    label: "I Need Purpose",
    scriptureReference: "JEREMIAH 29:11",
    scriptureText:
      "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace... to give you an expected end.",
    encouragement:
      "Before you questioned your purpose, God had already planned it. You get to discover it, one step at a time.",
    devotionalSlug: "made-on-purpose-for-a-purpose",
  },
];
