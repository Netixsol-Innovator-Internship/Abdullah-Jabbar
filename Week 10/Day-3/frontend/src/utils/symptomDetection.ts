// Utility to detect if a message is describing symptoms vs general product queries
export const detectSymptomQuery = (message: string): boolean => {
  const lowerMessage = message.toLowerCase().trim();

  // Symptom indicator patterns
  const symptomPatterns = [
    // Direct symptom statements
    /i (have|feel|am experiencing|suffer from|am having)/,
    /my (head|stomach|back|joints?|bones?|skin|hair|eyes?|throat)/,
    /i'm (tired|stressed|anxious|depressed|sick|weak|dizzy)/,
    /i feel (tired|weak|sick|nauseous|dizzy|stressed|anxious)/,
    /i can't (sleep|concentrate|focus|digest)/,
    /i have (pain|aches?|trouble|problems?|issues?)/,

    // Symptom keywords
    /(pain|ache|hurt|sore|stiff|swollen|inflamed)/,
    /(tired|fatigue|exhausted|weak|drained|sluggish)/,
    /(stress|anxiety|worried|nervous|tension|panic)/,
    /(insomnia|sleepless|restless|can't sleep|trouble sleeping)/,
    /(digestive|stomach|bloating|gas|constipation|diarrhea)/,
    /(headache|migraine|dizzy|nauseous)/,
    /(joint|arthritis|stiff|mobility)/,
    /(skin|acne|rash|dry|itchy)/,
    /(hair loss|hair fall|thinning|balding)/,
    /(memory|concentration|focus|brain fog)/,
    /(immunity|immune|infections|colds|flu)/,
    /(bones?|calcium|osteoporosis|brittle)/,
    /(heart|cardiovascular|cholesterol|blood pressure)/,
    /(weight|metabolism|appetite)/,

    // Medical/health context phrases
    /(symptoms?|condition|diagnosis|health issues?|medical)/,
    /(doctor said|physician|prescribed|treatment)/,
    /(chronic|acute|persistent|recurring)/,
  ];

  // Product query patterns (these suggest NOT a symptom query)
  const productPatterns = [
    /what is|tell me about|information about|details about/,
    /how much|price|cost|where to buy|purchase/,
    /ingredients|dosage|how to take|side effects/,
    /compare|difference|better|vs|versus/,
    /recommend|suggest|best|top|good/,
    /vitamin|supplement|protein|omega|calcium|magnesium/,
    /brand|manufacturer|company/,
  ];

  // Check for product patterns first (these take precedence)
  const hasProductPattern = productPatterns.some((pattern) =>
    pattern.test(lowerMessage)
  );
  if (hasProductPattern) {
    return false;
  }

  // Check for symptom patterns
  const hasSymptomPattern = symptomPatterns.some((pattern) =>
    pattern.test(lowerMessage)
  );

  // Additional heuristics
  const hasFirstPerson = /\b(i|my|me)\b/.test(lowerMessage);
  const hasSymptomKeywords =
    /(pain|tired|stress|sleep|digest|weak|sick|hurt|ache|problem|issue)/.test(
      lowerMessage
    );
  const isQuestionAboutHealth =
    /\b(why|how|what|when)\b.*\b(pain|tired|stress|sick|weak|hurt|ache)\b/.test(
      lowerMessage
    );

  // Combine all indicators
  return (
    hasSymptomPattern ||
    (hasFirstPerson && hasSymptomKeywords) ||
    isQuestionAboutHealth
  );
};

// Examples for testing:
// detectSymptomQuery("I have joint pain") // true
// detectSymptomQuery("I'm feeling tired all the time") // true
// detectSymptomQuery("My back hurts") // true
// detectSymptomQuery("Tell me about Vitamin C") // false
// detectSymptomQuery("What's the best multivitamin?") // false
// detectSymptomQuery("I can't sleep at night") // true
// detectSymptomQuery("How much does this cost?") // false
