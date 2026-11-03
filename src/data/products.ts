import { ProductDetails } from '../types';

export const PRODUCTS: Record<'devil-rush' | 'heavenly-rush', ProductDetails> = {
  'devil-rush': {
    id: 'devil-rush',
    name: 'DEVIL RUSH',
    tagline: 'FEEL THE RUSH.',
    slogan: 'SOUR FIRST. FIRE LAST.',
    theme: 'Midnight Black, Crimson Red & Metallic Silver',
    category: 'SPICY + SOUR',
    primaryColor: '#B51227', // Devil Crimson
    secondaryColor: '#090B12', // Midnight Black
    accentColor: '#C7CDD5', // Chrome Silver
    tasteExperience: {
      first: 'Sharp sour sensation with slight sweetness.',
      middle: 'Crisp and smooth flavour with refreshing clarity.',
      finish: 'Subtle warming spicy sensation in the throat.',
      spicyKick: true,
    },
    specifications: {
      volume: '300 ML',
      caffeine: '100 MG CAFFEINE',
      sugar: 'ZERO SUGAR',
      calories: 'ZERO CALORIES',
      provisionalNote: 'All nutritional specifications are provisional until verified.',
    },
    imageAdUrl: '/assets/aistudio/1793642287576_7a5f7729.png',
    description:
      'Engineered for those who thrive in intensity. A dual-phase sensory experience contrasting electric sour fruitiness against an escalating, warming finish.',
  },
  'heavenly-rush': {
    id: 'heavenly-rush',
    name: 'HEAVENLY RUSH',
    tagline: 'FEEL THE HEAVEN.',
    slogan: 'SWEET FIRST. SOUR NEXT.',
    theme: 'Pearl White, Icy Blue & Metallic Silver',
    category: 'SWEET + SOUR',
    primaryColor: '#176BFF', // Electric Blue
    secondaryColor: '#F5F7FC', // Pearl/Cloud White
    accentColor: '#A8D8FF', // Heavenly Blue
    tasteExperience: {
      first: 'Pleasant, invigorating sweetness.',
      middle: 'Gentle tangy sourness balancing the palate.',
      finish: 'Crisp, clean and exceptionally smooth. No spicy kick.',
      spicyKick: false,
    },
    specifications: {
      volume: '300 ML',
      caffeine: '100 MG CAFFEINE',
      sugar: 'ZERO SUGAR',
      calories: 'ZERO CALORIES',
      provisionalNote: 'All nutritional specifications are provisional until verified.',
    },
    imageAdUrl: '/assets/aistudio/1793644593915_1b64ec5a.png',
    description:
      'Crafted for celestial clarity. An immaculate blend of sweet nectar and zesty lemon notes with a refreshing, pristine finish.',
  },
};

export const BRAND_TAGLINE = 'RISE ABOVE ORDINARY.';
export const BRAND_NAME = 'HEAVENLY-RUN ENERGY';
export const CAFFEINE_WARNING =
  'CAFFEINATED BEVERAGE. NOT RECOMMENDED FOR CHILDREN OR CAFFEINE-SENSITIVE INDIVIDUALS.';
export const LAUNCH_DATE_STATUS = 'TO BE ANNOUNCED.';
export const GUITARIST_REVEAL_STATUS = 'TO BE ANNOUNCED.';
