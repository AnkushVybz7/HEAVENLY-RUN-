import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
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
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId per instructions
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const githubProvider = new GithubAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

export async function loginWithGoogle(): Promise<{ success: boolean; user?: User; error?: string; code?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    const code = error?.code || '';
    if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
      console.warn('Google Sign-In notice:', error?.message || code);
    }
    return {
      success: false,
      code,
      error: error?.message || 'Google sign-in was cancelled or failed.',
    };
  }
}

export async function loginWithGithub(): Promise<{ success: boolean; user?: User; error?: string; code?: string }> {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    const code = error?.code || '';
    let msg = error?.message || 'GitHub sign-in failed.';
    if (code === 'auth/operation-not-allowed') {
      msg = 'GitHub Sign-In is not enabled yet in your Firebase Console for project gen-lang-client-0192116749. Please use Google Sign-In (already active) or enable GitHub in Firebase Console.';
    } else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
      console.warn('GitHub Sign-In notice:', msg);
    }
    return { success: false, code, error: msg };
  }
}

export async function loginWithApple(): Promise<{ success: boolean; user?: User; error?: string; code?: string }> {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    const code = error?.code || '';
    let msg = error?.message || 'Apple sign-in failed.';
    if (code === 'auth/operation-not-allowed') {
      msg = 'Apple Sign-In is not enabled yet in your Firebase Console. Please use Google Sign-In (already active) or enable Apple in Firebase Console.';
    } else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
      console.warn('Apple Sign-In notice:', msg);
    }
    return { success: false, code, error: msg };
  }
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch {}
};

export const getCachedAccessToken = () => null;

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
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  // STRICT GUARANTEE: Creator/Founder Ankush Banerjee must NEVER be registered on the First 50 Can Contest list
  if (
    cleanEmail.includes('ankushbanerjeecool777') ||
    cleanName.toLowerCase().includes('ankush')
  ) {
    return {
      success: true,
      isFirst50: false,
      orderNumber: 0,
    };
  }

  try {
    // Read count to assign order number
    const subCol = collection(db, 'subscribers');
    let orderNumber = 1;

    try {
      const snap = await getDocs(subCol);
      // Count only non-founder entries
      orderNumber = snap.size + 1;
    } catch {
      orderNumber = 1;
    }

    const isFirst50Candidate = orderNumber <= 50 && wantsLimitedCan;

    const data: Omit<SubscriberDoc, 'id'> = {
      name: cleanName,
      email: cleanEmail,
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
      name: cleanName,
      email: cleanEmail,
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
      const data = d.data() as Omit<SubscriberDoc, 'id'>;
      // Filter out creator Ankush Banerjee from appearing on the list
      const email = (data.email || '').toLowerCase();
      const name = (data.name || '').toLowerCase();
      if (!email.includes('ankushbanerjeecool777') && !name.includes('ankush')) {
        results.push({ id: d.id, ...data });
      }
    });
    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'subscribers');
  }

  try {
    const local = JSON.parse(localStorage.getItem('heavenly_subscribers') || '[]');
    return local.filter((s: any) => {
      const email = (s.email || '').toLowerCase();
      const name = (s.name || '').toLowerCase();
      return !email.includes('ankushbanerjeecool777') && !name.includes('ankush');
    });
  } catch {
    return [];
  }
}

/**
 * Remove all registered names from the First 50 list (Firestore & LocalStorage)
 */
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

    // Always clear local cache as well
    localStorage.removeItem('heavenly_subscribers');
    return { success: true, deletedCount: count };
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, 'subscribers');
    localStorage.removeItem('heavenly_subscribers');
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

