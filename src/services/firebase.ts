import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  getDocFromServer,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId per instructions
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);

// Google Auth Provider with Forms and Drive scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/forms.body');
googleProvider.addScope('https://www.googleapis.com/auth/forms.body.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/forms.responses.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');

// In-memory access token storage
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken && onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (err) {
    console.warn('Google sign in error:', err);
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = () => cachedAccessToken;

export const logoutUser = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline check.');
    }
  }
}

// Error handler utility
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path,
  };
  console.warn('Firestore notice:', errInfo);
}

// Subscribers Firestore interface
export interface SubscriberDoc {
  id?: string;
  name: string;
  email: string;
  wantsLimitedCan: boolean;
  isFirst50Candidate: boolean;
  orderNumber: number;
  createdAt: string;
}

export async function addSubscriberToFirestore(
  name: string,
  email: string,
  wantsLimitedCan: boolean
): Promise<{ success: boolean; isFirst50: boolean; orderNumber: number }> {
  try {
    // Read count to assign order number
    const subCol = collection(db, 'subscribers');
    let orderNumber = 1;

    try {
      const snap = await getDocs(subCol);
      orderNumber = snap.size + 1;
    } catch {
      orderNumber = 1;
    }

    const isFirst50Candidate = orderNumber <= 50 && wantsLimitedCan;

    const data: Omit<SubscriberDoc, 'id'> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      wantsLimitedCan,
      isFirst50Candidate,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    await addDoc(subCol, data);

    return {
      success: true,
      isFirst50: isFirst50Candidate,
      orderNumber,
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'subscribers');
    // Fallback gracefully to localStorage
    const local = JSON.parse(localStorage.getItem('heavenly_subscribers') || '[]');
    const orderNumber = local.length + 1;
    const isFirst50 = orderNumber <= 50 && wantsLimitedCan;
    local.push({
      id: 'local-' + Date.now(),
      name,
      email,
      wantsLimitedCan,
      isFirst50Candidate: isFirst50,
      orderNumber,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('heavenly_subscribers', JSON.stringify(local));
    return { success: true, isFirst50, orderNumber };
  }
}

export async function fetchAllSubscribers(): Promise<SubscriberDoc[]> {
  try {
    const subCol = collection(db, 'subscribers');
    const q = query(subCol, orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    const results: SubscriberDoc[] = [];
    snap.forEach((d) => {
      results.push({ id: d.id, ...(d.data() as Omit<SubscriberDoc, 'id'>) });
    });
    if (results.length > 0) return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'subscribers');
  }

  try {
    const local = JSON.parse(localStorage.getItem('heavenly_subscribers') || '[]');
    return local;
  } catch {
    return [];
  }
}

export async function addFlavourSubmissionToFirestore(data: {
  name?: string;
  flavourName: string;
  category: string;
  description: string;
  suggestedColors: string;
  additionalIdeas?: string;
}) {
  try {
    const col = collection(db, 'flavourSubmissions');
    await addDoc(col, {
      ...data,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'flavourSubmissions');
  }
}

export async function addContactInquiryToFirestore(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const col = collection(db, 'contactInquiries');
    await addDoc(col, {
      ...data,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'contactInquiries');
  }
}

