import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.apiKey.length > 5 &&
      firebaseConfig.projectId &&
      !firebaseConfig.apiKey.includes("YOUR_")
  );
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  } catch (err) {
    console.error("Failed to initialize Firebase:", err);
  }
}

export { auth, googleProvider };

export async function signInWithGoogle(): Promise<FirebaseUser> {
  if (!auth || !googleProvider) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  if (!auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return result.user;
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<FirebaseUser> {
  if (!auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (displayName && displayName.trim()) {
    try {
      await updateProfile(result.user, { displayName: displayName.trim() });
    } catch {
      // profile update error non-fatal
    }
  }
  return result.user;
}

export async function resetPassword(email: string): Promise<void> {
  if (!auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }
  await sendPasswordResetEmail(auth, email.trim());
}

export async function logout(): Promise<void> {
  if (auth) {
    await firebaseSignOut(auth);
  }
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Maps raw Firebase error codes to polished, customer-facing copy
 */
export function formatAuthError(err: unknown): string {
  if (!err) return "An unexpected error occurred. Please try again.";

  const message = err instanceof Error ? err.message : String(err);
  const code = (err as any)?.code || "";

  if (message === "FIREBASE_NOT_CONFIGURED") {
    return "Firebase credentials not yet configured. Please add your credentials in .env file.";
  }

  console.error("Firebase Auth Error:", err);

  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact customer care.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please verify and try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Please choose a stronger password (minimum 6 characters).";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Google sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/too-many-requests":
      return "Access temporarily locked due to multiple failed attempts. Please try again shortly or reset your password.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection.";
    case "auth/operation-not-allowed":
      return "Google or Email sign-in is not enabled in your Firebase project. Please enable Google / Email in Firebase Console → Authentication → Sign-in method.";
    case "auth/unauthorized-domain":
      return "This domain (localhost) is not authorized in Firebase. Please add localhost to Authorized Domains in Firebase Console → Authentication → Settings.";
    case "auth/configuration-not-found":
      return "Authentication provider not configured in Firebase. Please enable Google in your Firebase Console.";
    case "auth/invalid-api-key":
      return "Invalid Firebase API key. Please check your Firebase configuration.";
    default: {
      const raw = err instanceof Error ? err.message : String(err);
      const cleaned = raw.replace(/^Firebase:\s*/i, "").replace(/\s*\(auth\/.*\)\.?$/i, "").trim();
      if (!cleaned || cleaned.toLowerCase() === "error") {
        return code
          ? `Sign-in failed (${code}). Please ensure the provider is enabled in your Firebase Console.`
          : "Sign-in could not be completed. Please try again.";
      }
      return cleaned;
    }
  }
}
