import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  getDocFromServer 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, AnalysisResult } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore specifying custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Verify Firestore connectivity on boot
export async function testFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
    console.log('🔥 Firebase Firestore successfully connected!');
    return true;
  } catch (error) {
    console.warn('Firebase Firestore connectivity warning:', error);
    return false;
  }
}

// Save User Profile to Firestore
export async function saveUserToFirestore(user: UserProfile): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...user,
      lastActiveAt: new Date().toISOString()
    }, { merge: true });
    console.log(`✅ Saved user profile (${user.name}) to Firebase Firestore`);
    return true;
  } catch (err) {
    console.error('Failed to save user profile to Firestore:', err);
    return false;
  }
}

// Save Analysis Result to Firestore Database
export async function saveAnalysisToFirestore(
  projectName: string, 
  analysis: AnalysisResult, 
  user?: UserProfile | null
): Promise<boolean> {
  try {
    const id = `analysis-${Date.now()}`;
    const analysisRef = doc(db, 'analyses', id);
    
    await setDoc(analysisRef, {
      id,
      projectName,
      analyzedAt: new Date().toISOString(),
      userId: user?.id || 'guest-1',
      userName: user?.name || 'Guest Developer',
      userRole: user?.role || 'developer',
      aiPercentage: analysis.qualityMetrics.aiInvolvementPercent || 50,
      humanPercentage: analysis.qualityMetrics.humanCodePercent || 50,
      analysisData: analysis
    });

    console.log(`✅ Saved analysis record for project "${projectName}" to Firebase Database`);
    return true;
  } catch (err) {
    console.error('Failed to save analysis to Firestore:', err);
    return false;
  }
}

// Fetch Stored Analyses from Firestore Database
export async function getAnalysesFromFirestore(): Promise<any[]> {
  try {
    const analysesRef = collection(db, 'analyses');
    const q = query(analysesRef, orderBy('analyzedAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    
    const records: any[] = [];
    snapshot.forEach(docSnap => {
      records.push(docSnap.data());
    });
    return records;
  } catch (err) {
    console.error('Failed to fetch analyses from Firestore:', err);
    return [];
  }
}
