import { doc, setDoc, deleteDoc, getDoc, collection } from "firebase/firestore";

// Fetch the star status
export const fetchStarStatus = async (db, userId, hostelId) => {
  try {
    const docRef = doc(db, `Student_Users/${userId}/shortlist`, hostelId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().isStarred : false;
  } catch (error) {
    console.error("Error fetching star status:", error);
    return false;
  }
};

// Toggle the star status
export const toggleStarStatus = async (db, userId, hostelId, isStarred) => {
  try {
    const docRef = doc(db, `Student_Users/${userId}/shortlist`, hostelId);
    if (isStarred) {
      await setDoc(docRef, { isStarred: true, hostelId });
    } else {
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.error("Error updating star status:", error);
  }
};

// Format views (e.g., 1.2K, 3.4M)
export const formatViews = (viewCount) => {
  if (viewCount >= 1_000_000) {
    return (viewCount / 1_000_000).toFixed(1) + "M";
  } else if (viewCount >= 1_000) {
    return (viewCount / 1_000).toFixed(1) + "K";
  }
  return viewCount;
};
