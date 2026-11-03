export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'launch' | 'product' | 'taste' | 'mystery';
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: 1,
    question: 'When is the brand launching?',
    answer: 'The launch date has not been decided yet. Official release dates and retail announcements will be communicated through our verified channels once finalized.',
    category: 'launch',
  },
  {
    id: 2,
    question: 'What is HEAVENLY-RUN?',
    answer: 'An upcoming premium beverage brand built around distinctive flavours, futuristic cyber-celestial aesthetics, and a unique identity that merges high-grade energy formulations with creative culture.',
    category: 'product',
  },
  {
    id: 3,
    question: 'What flavours are planned?',
    answer: 'The two foundational flagship flavours are DEVIL RUSH (Spicy & Sour) and HEAVENLY RUSH (Sweet & Sour). Additional mystery flavour concepts are currently being explored.',
    category: 'product',
  },
  {
    id: 4,
    question: 'What does DEVIL RUSH taste like?',
    answer: 'DEVIL RUSH features a sharp sour sensation with slight sweetness initially, moves into a crisp and smooth middle flavour, and finishes with a subtle warming spicy sensation in the throat. Its slogan is "Sour first. Fire last."',
    category: 'taste',
  },
  {
    id: 5,
    question: 'What does HEAVENLY RUSH taste like?',
    answer: 'HEAVENLY RUSH offers an initial pleasant sweetness, followed by a gentle tangy sourness, finishing crisp, clean and exceptionally smooth with no spicy kick. Its slogan is "Sweet first. Sour next."',
    category: 'taste',
  },
  {
    id: 6,
    question: 'How big are the cans?',
    answer: 'The proposed size is 300 ML, calibrated for optimal carbonation retention and hand feel.',
    category: 'product',
  },
  {
    id: 7,
    question: 'How much caffeine?',
    answer: 'The proposed amount is 100 MG per can (zero sugar, zero calories), subject to official verification prior to commercial production.',
    category: 'product',
  },
  {
    id: 8,
    question: 'Who is the guitarist?',
    answer: 'His identity remains strictly secret until the planned reveal. He is an extraordinary young electric guitar prodigy deeply connected to the frequency and aesthetic spirit of HEAVENLY-RUN.',
    category: 'mystery',
  },
  {
    id: 9,
    question: 'Will there be more flavours?',
    answer: 'Yes! More flavour concepts are planned. Visitors and energy enthusiasts are encouraged to submit concepts directly to the Community Flavour Lab on our Flavours page.',
    category: 'product',
  },
  {
    id: 10,
    question: 'Where can I buy the drinks?',
    answer: 'Availability has not been finalised. Retail distribution, direct pre-orders, and shipping locations will be announced closer to production.',
    category: 'launch',
  },
];
