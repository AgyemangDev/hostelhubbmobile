// StarredHostelsContext.js
import { createContext, useEffect, useState } from 'react';
import { fetchStarStatus, toggleStarStatus } from '../utils/firebaseUtils';
import { db,auth } from '../app/firebase/FirebaseConfig';

export const StarredHostelsContext = createContext();

export const StarredHostelsProvider = ({ children }) => {
  const [starredMap, setStarredMap] = useState({});

  const user = auth.currentUser;

  const fetchStarredStatus = async (hostelId) => {
    if (!user) return false;
    const status = await fetchStarStatus(db, user.uid, hostelId);
    setStarredMap(prev => ({ ...prev, [hostelId]: status }));
  };

  const toggleStar = async (hostelId) => {
    const current = starredMap[hostelId] ?? false;
    const newStatus = !current;
    setStarredMap(prev => ({ ...prev, [hostelId]: newStatus }));
    if (user) {
      await toggleStarStatus(db, user.uid, hostelId, newStatus);
    }
  };

  return (
    <StarredHostelsContext.Provider value={{ starredMap, fetchStarredStatus, toggleStar }}>
      {children}
    </StarredHostelsContext.Provider>
  );
};
