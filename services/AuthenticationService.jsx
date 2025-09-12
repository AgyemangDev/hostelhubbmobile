import { auth,db } from "../app/firebase/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const signUpUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Create user document in Firestore
  await setDoc(doc(db, "Student_Users", user.uid), {
    Timestamp: new Date(),
    email: user.email,
    paymentStatus: false,
    id: user.uid,
    balance: 0,
    paymentDate: null
  });

  // Send verification email
  await sendEmailVerification(user);
  
  return user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const getErrorMessage = (error) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "You already have an account. Log in or use another email.";
    case "auth/network-request-failed":
      return "You are offline. Check your internet connection.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    default:
      return "There was an error. Please try again.";
  }
};