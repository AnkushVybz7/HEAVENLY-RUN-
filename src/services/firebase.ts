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
  serverTimestamp,
  Timestamp,
  writeBatch,
  deleteDoc,
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
  isFirst50Candidate?: boolean;
  orderNumber?: number;
  createdAt: Timestamp;
}

export async function addSubscriberToFirestore(
  name: string,
  email: string,
  wantsLimitedCan: boolean
): Promise<{ success: boolean; isFirst50: boolean; orderNumber: number }> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // STRICT GUARANTEE: Creator/Founder Ankush Banerjee must NEVER be registered on the First 50 Can Contest list
  if (
    cleanEmail.includes('ankushbanerjeecool777') ||
    cleanName.toLowerCase().includes('ankush')
  ) {
    return { success: true, isFirst50: false, orderNumber: 0 };
  }

  const subCol = collection(db, 'subscribers');
  const data = {
    name: cleanName,
    email: cleanEmail,
    wantsLimitedCan,
    createdAt: serverTimestamp(),
  };
  try {
    await addDoc(subCol, data);
    return { success: true, isFirst50: false, orderNumber: 0 };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'subscribers');
    throw err;
  }
}

export async function fetchAllSubscribers(): Promise<SubscriberDoc[]> {
  const subCol = collection(db, 'subscribers');
  const q = query(subCol, orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<SubscriberDoc, 'id'>) }))
    .filter((s) => {
      const email = (s.email || '').toLowerCase();
      const sName = (s.name || '').toLowerCase();
      return !email.includes('ankushbanerjeecool777') && !sName.includes('ankush');
    });
}

export async function clearAllSubscribers(): Promise<{ success: boolean; deletedCount: number }> {
  try {
    const subCol = collection(db, 'subscribers');
    const snap = await getDocs(subCol);
    let count = 0;
    const batch = writeBatch(db);
    snap.forEach((d) => {
      batch.delete(doc(db, 'subscribers', d.id));
      count++;
    });
    if (count > 0) {
      await batch.commit();
    }
    return { success: true, deletedCount: count };
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, 'subscribers');
    return { success: true, deletedCount: 0 };
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
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'flavourSubmissions');
    throw err;
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
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'contactInquiries');
    throw err;
  }
}

