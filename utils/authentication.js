// File: utils/authentication.js
import { db } from "../app/firebase/FirebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Checks user authentication state and handles routing
 * @param {Object} params - Parameters object
 * @param {Object} params.user - Current user object
 * @param {Object} params.router - Router object for navigation
 * @param {string} params.deepLinkHostelId - Hostel ID from deep link
 * @param {Function} params.setDeepLinkHostelId - State setter for deep link hostel ID
 */

export const checkUserAuthState = async ({
  user,
  router,
  deepLinkHostelId,
  setDeepLinkHostelId
}) => {
  // Check if we have a stored deep link
  const storedHostelId = await AsyncStorage.getItem('deepLinkHostelId') || deepLinkHostelId;
  
  if (user) {
    const userProfileRef = doc(db, "Student_Users", user.uid);
    const userProfile = await getDoc(userProfileRef);

    if (userProfile.exists()) {
      const userData = userProfile.data();
      const hasRequiredFields =
        userData.gender &&
        userData.firstName &&
        userData.phoneNumber &&
        userData.surname &&
        userData.institution;

      if (hasRequiredFields) {
        // If we have a deep link hostel ID and user is authenticated,
        // navigate to that hostel's details
        if (storedHostelId) {
          console.log("Navigating to deep linked hostel:", storedHostelId);
          // Clear the stored ID since we're handling it now
          setDeepLinkHostelId && setDeepLinkHostelId(null);
          await AsyncStorage.removeItem('deepLinkHostelId');
          
          // Navigate to hostel details
          router.replace({
            pathname: "Details",
            params: { hostelId: storedHostelId }
          });
        } else {
          // Normal flow - go to home
          router.replace("(tabs)/(index)");
        }
      } else {
        router.replace("locSelection");
      }
    } else {
      router.replace("locSelection");
    }
  } else {
    // If user is not authenticated, go to login
    router.replace("(Client)");
  }
};