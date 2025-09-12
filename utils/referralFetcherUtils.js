import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../app/firebase/FirebaseConfig";

export const findReferredUser = async (referredByCode) => {
  try {
    const usersCollection = collection(db, "Student_Users");

    // First try matching agentCode
    const agentQuery = query(usersCollection, where("agentCode", "==", referredByCode));
    const agentSnapshot = await getDocs(agentQuery);

    if (!agentSnapshot.empty) {
      const userDoc = agentSnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }

    // If no match, try referralCode
    const referralQuery = query(usersCollection, where("referralCode", "==", referredByCode));
    const referralSnapshot = await getDocs(referralQuery);

    if (!referralSnapshot.empty) {
      const userDoc = referralSnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }

    // If neither matched
    return null;

  } catch (error) {
    console.error("Error fetching referred user:", error);
    throw new Error("Could not fetch referred user.");
  }
};


