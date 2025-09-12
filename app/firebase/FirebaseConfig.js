import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA3XdH-C0D2K7Iwm0bo8d1_wAdJZao8rm8",
  authDomain: "hostelhubbgh.firebaseapp.com",
  projectId: "hostelhubbgh",
  storageBucket: "hostelhubbgh.appspot.com",
  messagingSenderId: "397953583899",
  appId: "1:397953583899:web:cd42166f30dbc5922661be",
  measurementId: "G-2MX738FHSJ"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { db, auth };
