import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
 
// Paste the values Firebase gave you in Step 2
const firebaseConfig = {
  apiKey: 'AIzaSyALcLzol5bYlCufBRcnfXiUCw1zyH2PZNc',
  authDomain: 'notesapp-25322.firebaseapp.com',
  projectId: 'notesapp-25322',
  storageBucket: 'notesapp-25322.firebasestorage.app',
  messagingSenderId: '656517944838',
  appId: '1:656517944838:web:faf5e986b05ed187ebd587'
};
 
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
