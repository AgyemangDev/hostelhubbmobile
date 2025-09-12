import { useEffect, useState, createContext, useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For caching
import { db } from '../app/firebase/FirebaseConfig';
import { useHostels } from './HostelsContext'; // Import the useHostels hook

// Constants for cache keys and time limits
const CACHE_KEY = 'adminsCache';
const TIMESTAMP_KEY = 'adminLastFetchTimestamp';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

// Create a context for Admins
const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { managerIds } = useHostels(); // Access the managerIds from the HostelsContext
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmins = async () => {
      console.log('Loading admins...');
      setLoading(true);

      // Retrieve cached data
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      const lastFetch = await AsyncStorage.getItem(TIMESTAMP_KEY);

      console.log('Cached data:', cachedData ? JSON.parse(cachedData) : []);
      console.log('Last fetch timestamp:', lastFetch);

      const cachedAdmins = cachedData ? JSON.parse(cachedData) : [];
      const currentAdminIds = new Set(cachedAdmins.map((admin) => admin.id));

      console.log('Current admin IDs in cache:', currentAdminIds);

      // Identify new manager IDs that need to be fetched
      const newManagerIds = Array.from(managerIds).filter((id) => !currentAdminIds.has(id));

      if (newManagerIds.length === 0) {
        console.log('Using cached admins data...');
        const filteredAdmins = cachedAdmins.filter((admin) => managerIds.has(admin.id));
        setAdmins(filteredAdmins);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching admins from Firestore...');
        const fetchedAdmins = [];

        // Query Firestore for each manager ID individually
        for (const managerId of newManagerIds) {
          const adminCollectionRef = collection(db, 'Admin_Users');
          const q = query(adminCollectionRef, where('id', '==', managerId));

          console.log(`Querying Firestore for managerId: ${managerId}`);
          const snapshot = await getDocs(q);

          snapshot.docs.forEach((doc) => {
            fetchedAdmins.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        }

        console.log('Fetched admins:', fetchedAdmins);

        // Combine cached admins with newly fetched ones
        const updatedAdmins = [...cachedAdmins, ...fetchedAdmins];
        console.log('Updated admins:', updatedAdmins);

        // Update state and cache
        setAdmins(updatedAdmins);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedAdmins));
        await AsyncStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
        console.log('Cache updated successfully');
      } catch (error) {
        console.error('Error fetching admins:', error);
      }

      setLoading(false);
    };

    loadAdmins();
  }, [managerIds]);

  return (
    <AdminContext.Provider value={{ admins, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use the AdminContext
export const useAdmin = () => useContext(AdminContext);
