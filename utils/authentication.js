// File: utils/authentication.js
import { db } from "../app/firebase/FirebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkUserAuthState = async ({
  user,
  router,
  deepLinkHostelId,
  setDeepLinkHostelId
}) => {
  const storedHostelId = await AsyncStorage.getItem('deepLinkHostelId') || deepLinkHostelId;

  if (user) {
    const userProfileRef = doc(db, "Student_Users", user.uid);
    const userProfile = await getDoc(userProfileRef);

    if (userProfile.exists()) {
      // User has a profile, proceed directly
      if (storedHostelId) {
        console.log("Navigating to deep linked hostel:", storedHostelId);
        setDeepLinkHostelId && setDeepLinkHostelId(null);
        await AsyncStorage.removeItem('deepLinkHostelId');

        router.replace({
          pathname: "Details",
          params: { hostelId: storedHostelId }
        });
      } else {
        // Normal flow - go to home
        router.replace("(tabs)/(index)");
      }
    } else {
      // Profile not found, send to locSelection
      router.replace("locSelection");
    }
  } else {
    // User not logged in, go to login
    router.replace("/(Client)"); // <-- Fixed route
  }
};
