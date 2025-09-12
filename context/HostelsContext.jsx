import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../app/firebase/FirebaseConfig';
import { UserContext } from './UserContext';

// Cache keys
const CACHE_KEY = 'hostelsCache';
const TIMESTAMP_KEY = 'lastFetchTimestamp';
const MANAGER_ID_SET_KEY = 'managerIdSet';

// Cache duration (24 hours in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const HostelsContext = createContext();

export const HostelsProvider = ({ children }) => {
  const [hostels, setHostels] = useState([]);
  const { userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [managerIds, setManagerIds] = useState(new Set());
  const [institutionAvailable, setInstitutionAvailable] = useState(false);

  const log = (message, data) => {
    console.log(`[HostelsContext] ${new Date().toISOString()} - ${message}`, data || '');
  };

  // Check if cached data exists and is still valid
  const getCachedData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      const cachedManagerIds = await AsyncStorage.getItem(MANAGER_ID_SET_KEY);
      const lastFetch = await AsyncStorage.getItem(TIMESTAMP_KEY);

      if (cachedData && lastFetch) {
        const cacheAge = Date.now() - parseInt(lastFetch);
        log('Cache found', {
          hostelCount: JSON.parse(cachedData).length,
          managerCount: cachedManagerIds ? JSON.parse(cachedManagerIds).length : 0,
          cacheAge: Math.round(cacheAge / 1000 / 60) + ' minutes',
          isValid: cacheAge < CACHE_DURATION
        });

        // Check if cache is still valid (within 24 hours)
        if (cacheAge < CACHE_DURATION) {
          return {
            hostels: JSON.parse(cachedData),
            managerIds: cachedManagerIds ? JSON.parse(cachedManagerIds) : [],
            timestamp: parseInt(lastFetch)
          };
        } else {
          log('Cache expired, needs refresh');
        }
      } else {
        log('No cached data found');
      }
      return null;
    } catch (error) {
      log('Error reading cached data', error);
      return null;
    }
  };

  // Cache hostels data to AsyncStorage
  const cacheHostelsData = async (hostelsData, managerIdsArray) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(hostelsData));
      await AsyncStorage.setItem(MANAGER_ID_SET_KEY, JSON.stringify(managerIdsArray));
      await AsyncStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
      log('✅ Hostels data cached successfully', {
        hostelCount: hostelsData.length,
        managerCount: managerIdsArray.length
      });
    } catch (error) {
      log('❌ Error caching hostels data', error);
    }
  };

  // Fetch hostels from Firestore with three-layer caching
  const fetchHostels = async (fetchLimit = 400, source = 'default') => {
    log(`🔍 Starting Firestore fetch with limit ${fetchLimit} from ${source}`);

    try {
      if (!userInfo || !userInfo.institution || userInfo.institution.length === 0) {
        log('❌ User institution is missing or empty', userInfo?.institution);
        return { hostels: [], managerIds: [] };
      }

      log('🏫 Fetching hostels for institution:', userInfo.institution);
      const hostelsRef = collection(db, 'Hostels');
      const hostelQuery = query(
        hostelsRef,
        where('deleted', '==', false),
        limit(fetchLimit)
      );

      let hostelSnapshots;
      try {
        hostelSnapshots = await getDocs(hostelQuery, { source });
      } catch (cacheError) {
        log(`⚠️ Failed to fetch from ${source}. Error:`, cacheError.message);
        if (source === 'cache') return null;
        throw cacheError;
      }

      log(`📊 Fetched ${hostelSnapshots.size} documents from ${source}`);

      const hostelsData = hostelSnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Extract manager IDs
      const managerIdsArray = [];
      hostelsData.forEach((hostel) => {
        if (hostel.managerId) {
          managerIdsArray.push(hostel.managerId);
        }
      });

      // Remove duplicates
      const uniqueManagerIds = [...new Set(managerIdsArray)];

      log('✅ Processed hostels data', {
        hostelCount: hostelsData.length,
        managerCount: uniqueManagerIds.length
      });

      return { hostels: hostelsData, managerIds: uniqueManagerIds };
    } catch (error) {
      log('❌ Error during fetchHostels', error);
      return { hostels: [], managerIds: [] };
    }
  };

  // Main load function with persistent caching
  const loadHostels = async () => {
    log('🚀 Starting loadHostels with persistent caching...');
    setLoading(true);

    try {
      // Step 1: Check AsyncStorage cache first
      const cachedResult = await getCachedData();
      if (cachedResult) {
        log('💾 Using cached hostels data - no Firestore fetch needed');
        setHostels(cachedResult.hostels);
        setManagerIds(new Set(cachedResult.managerIds));
        setLoading(false);
        return;
      }

      // Step 2: Try Firestore cache
      log('📡 No valid AsyncStorage cache, trying Firestore cache...');
      const firestoreCache = await fetchHostels(400, 'cache');
      
      if (firestoreCache && firestoreCache.hostels.length > 0) {
        log('🎯 Using Firestore cache');
        setHostels(firestoreCache.hostels);
        setManagerIds(new Set(firestoreCache.managerIds));
        // Cache to AsyncStorage for next time
        await cacheHostelsData(firestoreCache.hostels, firestoreCache.managerIds);
        setLoading(false);
        return;
      }

      // Step 3: Fetch from server (only happens on first load or cache expiry)
      log('🌐 No cache available, fetching from server...');
      const serverData = await fetchHostels(400, 'server');
      
      if (serverData && serverData.hostels.length > 0) {
        setHostels(serverData.hostels);
        setManagerIds(new Set(serverData.managerIds));
        // Cache the server data
        await cacheHostelsData(serverData.hostels, serverData.managerIds);
      } else {
        log('⚠️ No hostels data received from server');
      }

    } catch (error) {
      log('❌ Error in loadHostels', error);
      
      // Try to use any cached data as fallback
      const cachedResult = await getCachedData();
      if (cachedResult) {
        log('🔄 Using expired cached data as fallback');
        setHostels(cachedResult.hostels);
        setManagerIds(new Set(cachedResult.managerIds));
      }
    } finally {
      setLoading(false);
    }
  };

  // Force refresh function (bypasses cache)
  const forceRefresh = async () => {
    log('🔄 Force refresh requested');
    setLoading(true);
    
    try {
      const serverData = await fetchHostels(400, 'server');
      if (serverData && serverData.hostels.length > 0) {
        setHostels(serverData.hostels);
        setManagerIds(new Set(serverData.managerIds));
        await cacheHostelsData(serverData.hostels, serverData.managerIds);
      }
    } catch (error) {
      log('❌ Error during force refresh', error);
    } finally {
      setLoading(false);
    }
  };

  // Clear cache function (for debugging)
  const clearCache = async () => {
    try {
      await AsyncStorage.multiRemove([CACHE_KEY, MANAGER_ID_SET_KEY, TIMESTAMP_KEY]);
      log('🗑️ Cache cleared successfully');
    } catch (error) {
      log('❌ Error clearing cache', error);
    }
  };

  // Get cache info for debugging
  const getCacheInfo = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      const lastFetch = await AsyncStorage.getItem(TIMESTAMP_KEY);
      const cachedManagerIds = await AsyncStorage.getItem(MANAGER_ID_SET_KEY);
      
      return {
        hasCachedData: !!cachedData,
        hostelCount: cachedData ? JSON.parse(cachedData).length : 0,
        managerCount: cachedManagerIds ? JSON.parse(cachedManagerIds).length : 0,
        cacheTimestamp: lastFetch ? parseInt(lastFetch) : null,
        cacheAge: lastFetch ? Date.now() - parseInt(lastFetch) : null,
        isValid: lastFetch ? (Date.now() - parseInt(lastFetch)) < CACHE_DURATION : false
      };
    } catch (error) {
      log('❌ Error getting cache info', error);
      return null;
    }
  };

  // User info availability check
  useEffect(() => {
    log('HostelsProvider mounted');
    if (userInfo) {
      log('User info detected, checking institution', userInfo);
      if (userInfo.institution && userInfo.institution.length > 0) {
        log('✅ User institution found:', userInfo.institution);
        setInstitutionAvailable(true);
      } else {
        log('❌ User institution is missing or empty');
        setInstitutionAvailable(false);
      }
    } else {
      log('⏳ User info is not available yet');
      setInstitutionAvailable(false);
    }
  }, [userInfo]);

  // Load hostels when institution becomes available
  useEffect(() => {
    if (institutionAvailable) {
      log('🏫 Institution available, loading hostels');
      loadHostels();
    } else {
      log('⏳ Institution not available yet');
    }
  }, [institutionAvailable]);

  return (
    <HostelsContext.Provider value={{ 
      hostels, 
      loading, 
      managerIds,
      forceRefresh, 
      clearCache, 
      getCacheInfo
    }}>
      {children}
    </HostelsContext.Provider>
  );
};

export const useHostels = () => useContext(HostelsContext);