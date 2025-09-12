import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../app/firebase/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

const STORAGE_KEYS = {
  userSession: 'userSession',
  userShortlist: 'userShortlist',
};

export const UserProvider = ({ children }) => {
  const [user, authLoading] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Memoized storage operations
  const updateUserCache = useCallback(async (data) => {
    try {
      const currentData = await AsyncStorage.getItem(STORAGE_KEYS.userSession);
      const currentParsed = currentData ? JSON.parse(currentData) : null;
      
      // Only update if data has changed
      if (JSON.stringify(currentParsed) !== JSON.stringify(data)) {
        await AsyncStorage.setItem(STORAGE_KEYS.userSession, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error updating user cache:', error);
    }
  }, []);

  const updateShortlistCache = useCallback(async (data) => {
    try {
      const currentData = await AsyncStorage.getItem(STORAGE_KEYS.userShortlist);
      const currentParsed = currentData ? JSON.parse(currentData) : [];
      
      // Only update if data has changed
      if (JSON.stringify(currentParsed) !== JSON.stringify(data)) {
        await AsyncStorage.setItem(STORAGE_KEYS.userShortlist, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error updating shortlist cache:', error);
    }
  }, []);

  // Clear user session
  const clearUserSession = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.userSession, STORAGE_KEYS.userShortlist]);
    } catch (error) {
      console.error('Error clearing user session:', error);
    }
  }, []);

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const [cachedUser, cachedShortlist] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.userSession),
          AsyncStorage.getItem(STORAGE_KEYS.userShortlist),
        ]);
        
        if (cachedUser) setUserInfo(JSON.parse(cachedUser));
        if (cachedShortlist) setShortlist(JSON.parse(cachedShortlist));
      } catch (error) {
        console.error('Error loading cached data:', error);
      } finally {
        setDataLoaded(true);
      }
    };

    loadCachedData();
  }, []);

  // Real-time fetch for user info
  const fetchUserInfo = useCallback((uid) => {
    const docRef = doc(db, 'Student_Users', uid);
    return onSnapshot(
      docRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo(data);
          await updateUserCache(data);
        } else {
          console.warn('No user document found.');
          setUserInfo(null);
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }, [updateUserCache]);

  // Real-time fetch for shortlist
  const fetchShortlist = useCallback((uid) => {
    const shortlistRef = collection(db, 'Student_Users', uid, 'shortlist');
    return onSnapshot(
      shortlistRef,
      async (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShortlist(data);
        await updateShortlistCache(data);
      },
      (error) => {
        console.error('Error fetching shortlist:', error);
      }
    );
  }, [updateShortlistCache]);

  // Set up live listeners when user is detected
  useEffect(() => {
    let unsubscribeUserInfo;
    let unsubscribeShortlist;

    if (user) {
      unsubscribeUserInfo = fetchUserInfo(user.uid);
      unsubscribeShortlist = fetchShortlist(user.uid);
    } else {
      clearUserSession();
      setUserInfo(null);
      setShortlist([]);
    }

    return () => {
      if (unsubscribeUserInfo) unsubscribeUserInfo();
      if (unsubscribeShortlist) unsubscribeShortlist();
    };
  }, [user, fetchUserInfo, fetchShortlist, clearUserSession]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      userInfo,
      shortlist,
      isLoading: authLoading || !dataLoaded,
      clearUserSession,
    }),
    [user, userInfo, shortlist, authLoading, dataLoaded, clearUserSession]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// import React, { createContext, useState, useEffect } from 'react';
// import { doc, collection, getDocs,onSnapshot } from 'firebase/firestore';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { db, auth } from '../app/firebase/FirebaseConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, loading] = useAuthState(auth);
//   const [userInfo, setUserInfo] = useState(null);
//   const [allUsers, setAllUsers] = useState([]); 
//   const [shortlist, setShortlist] = useState([]); 
//   const [isLoading, setIsLoading] = useState(true);

//   // Function to clear user session
//   const clearUserSession = async () => {
//     await AsyncStorage.removeItem('userSession');
//   };

//   // Check user session
//   useEffect(() => {
//     const checkUserSession = async () => {
//       const userSession = await AsyncStorage.getItem('userSession');
//       setIsLoading(false);
//     };

//     checkUserSession();
//   }, []);

//   // Fetching user information from the main `Student_Users` document
//   const fetchUserInfo = (uid) => {
//     const docRef = doc(db, 'Student_Users', uid);

//     return onSnapshot(docRef, (docSnap) => {
//       if (docSnap.exists()) {
//         setUserInfo(docSnap.data());
//         AsyncStorage.setItem('userSession', JSON.stringify(user));
//       } else {
//         console.error("No such document!");
//       }
//     }, (error) => {
//       console.error("Error fetching user data:", error);
//     });
//   };

//   // Fetching all users data from `Student_Users` collection
//   const fetchAllUsers = async () => {
//     try {
//       const usersRef = collection(db, 'Student_Users');
//       const snapshot = await getDocs(usersRef);
//       const usersData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       setAllUsers(usersData); // Set state with fetched users data
//       AsyncStorage.setItem('allUsers', JSON.stringify(usersData)); // Store fetched data in AsyncStorage
//     } catch (error) {
//       console.error("Error fetching all users data:", error);
//     }
//   };

//   // Fetching shortlist data with onSnapshot
//   const fetchShortlist = (uid) => {
//     const shortlistRef = collection(db, 'Student_Users', uid, 'shortlist');

//     return onSnapshot(shortlistRef, (snapshot) => {
//       const shortlistData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setShortlist(shortlistData);
//     }, (error) => {
//       console.error("Error fetching shortlist data:", error);
//     });
//   };

//   // Handle user info, shortlist, and all users fetching in useEffect
//   useEffect(() => {
//     let unsubscribeUserInfo;
//     let unsubscribeShortlist;

//     if (user) {
//       unsubscribeUserInfo = fetchUserInfo(user.uid);
//       unsubscribeShortlist = fetchShortlist(user.uid);
//     } else {
//       clearUserSession(); // Clear session if no user is logged in
//       setUserInfo(null);
//       setShortlist([]);
//     }

//     // Fetch all users initially
//     fetchAllUsers();

//     // Set an interval to refetch all users every 10 seconds
//     const interval = setInterval(() => {
//       fetchAllUsers();
//     }, 20000); //1 day

//     // Clean up the interval when the component unmounts
//     return () => {
//       if (unsubscribeUserInfo) {
//         unsubscribeUserInfo();
//       }
//       if (unsubscribeShortlist) {
//         unsubscribeShortlist();
//       }
//       clearInterval(interval); // Clear the interval
//     };
//   }, [user]);

//   return (
//     <UserContext.Provider value={{ user, userInfo, allUsers, shortlist, isLoading, clearUserSession }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
