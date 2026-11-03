export type PageRoute = '/' | '/flavours' | '/mystery' | '/faq' | '/admin-first-50';

export type FlavourId = 'devil-rush' | 'heavenly-rush';

export interface ProductDetails {
  id: FlavourId;
  name: string;
  tagline: string;
  slogan: string;
  theme: string;
  category: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tasteExperience: {
    first: string;
    middle: string;
    finish: string;
    spicyKick: boolean;
  };
  specifications: {
    volume: string;
    caffeine: string;
    sugar: string;
    calories: string;
    provisionalNote: string;
  };
  imageAdUrl: string;
  description: string;
}

export interface FlavourLabSubmission {
  id: string;
  createdAt: string;
  name?: string;
  flavourName: string;
  category: 'sweet' | 'sour' | 'sweet and sour' | 'spicy' | 'fruity' | 'citrus' | 'other';
  description: string;
  suggestedColors: string;
  additionalIdeas?: string;
}

export interface ContactSubmission {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}
