// context/FeedsContext.js - MODIFIED TO PASS HOSTEL DOCUMENTS AS-IS
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  collection, 
  query, 
  limit, 
  getDocs, 
  orderBy, 
  startAfter, 
  where, 
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../app/firebase/FirebaseConfig';

const FeedsContext = createContext();

// Constants
const CACHE_KEY = 'hostel_feeds_cache_v1';
const BATCH_SIZE = 10;
const MAX_CACHE_ITEMS = 50; // Maximum hostel documents to cache
const REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const REAL_TIME_CHECK_INTERVAL = 30000; // 30 seconds

export const FeedsProvider = ({ children }) => {
  const [hostelDocuments, setHostelDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [fetchedIds, setFetchedIds] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const [cacheComplete, setCacheComplete] = useState(false);
  const [newItemsAvailable, setNewItemsAvailable] = useState(0);

  // Refs for optimization and real-time tracking
  const realtimeUnsubscribe = useRef(null);
  const newestCachedTimestamp = useRef(null);
  const pendingNewItems = useRef([]);
  const isCheckingForUpdates = useRef(false);
  const lastFullRefreshTime = useRef(0);

  useEffect(() => {
    loadCachedHostels();
    return () => {
      if (realtimeUnsubscribe.current) {
        realtimeUnsubscribe.current();
      }
    };
  }, []);

  // Real-time listener for new hostel documents
  const setupRealtimeListener = useCallback(() => {
    if (realtimeUnsubscribe.current) {
      realtimeUnsubscribe.current();
    }

    if (!newestCachedTimestamp.current) {
      console.log('⏸️ No timestamp reference, skipping real-time listener');
      return;
    }

    try {
      const feedsCollection = collection(db, 'feeds');
      
      const realtimeQuery = query(
        feedsCollection,
        where('createdAt', '>', newestCachedTimestamp.current),
        orderBy('createdAt', 'desc')
      );

      realtimeUnsubscribe.current = onSnapshot(
        realtimeQuery,
        (snapshot) => {
          const newDocs = [];
          
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const hostelData = { id: change.doc.id, ...change.doc.data() };
              
              // Check if this hostel is not already in our cache
              if (!fetchedIds.has(hostelData.id)) {
                newDocs.push(hostelData);
              }
            }
          });

          if (newDocs.length > 0) {
            console.log(`🔔 ${newDocs.length} new hostels detected via real-time listener`);
            pendingNewItems.current = [...newDocs, ...pendingNewItems.current];
            setNewItemsAvailable(prev => prev + newDocs.length);
          }
        },
        (error) => {
          console.error('❌ Real-time listener error:', error);
        }
      );

      console.log(`👂 Real-time listener established for hostels newer than ${newestCachedTimestamp.current.toDate()}`);
    } catch (error) {
      console.error('❌ Error setting up real-time listener:', error);
    }
  }, [fetchedIds]);

  // Enhanced cache operations with 24-hour refresh tracking
  const saveHostelsToCache = async (hostelsData, fetchedIdsSet, hasMore, isComplete, newestTimestamp) => {
    try {
      const cacheData = {
        hostels: hostelsData,
        fetchedIds: Array.from(fetchedIdsSet),
        hasMore,
        cacheComplete: isComplete,
        newestTimestamp: newestTimestamp ? newestTimestamp.toMillis() : null,
        lastSaved: Date.now(),
        lastFullRefresh: lastFullRefreshTime.current
      };
      
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log(`💾 Cached ${hostelsData.length} hostels (complete: ${isComplete})`);
    } catch (error) {
      console.error('❌ Error saving hostels to cache:', error);
    }
  };

  const loadCachedHostels = async () => {
    try {
      setLoading(true);
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      
      if (cachedData) {
        const { 
          hostels: cachedHostels, 
          fetchedIds: cachedIds, 
          hasMore, 
          cacheComplete: wasCacheComplete,
          newestTimestamp,
          lastFullRefresh
        } = JSON.parse(cachedData);
        
        // Check if cache is older than 24 hours
        const now = Date.now();
        const cacheAge = now - (lastFullRefresh || 0);
        const shouldRefresh = cacheAge > REFRESH_INTERVAL;
        
        if (shouldRefresh) {
          console.log(`🔄 Cache is ${Math.round(cacheAge / (1000 * 60 * 60))} hours old, forcing refresh`);
          await fetchInitialHostels();
          return;
        }
        
        setHostelDocuments(cachedHostels);
        setFetchedIds(new Set(cachedIds));
        setCacheComplete(wasCacheComplete || cachedHostels.length >= MAX_CACHE_ITEMS);
        setHasMoreData(hasMore && !wasCacheComplete && cachedHostels.length < MAX_CACHE_ITEMS);
        lastFullRefreshTime.current = lastFullRefresh || now;
        
        // Set the newest timestamp for real-time tracking
        if (newestTimestamp) {
          newestCachedTimestamp.current = Timestamp.fromMillis(newestTimestamp);
        } else if (cachedHostels.length > 0) {
          const firstItem = cachedHostels[0];
          if (firstItem.createdAt) {
            newestCachedTimestamp.current = firstItem.createdAt;
          }
        }
        
        console.log(`📱 Loaded ${cachedHostels.length} hostels from cache (${Math.round(cacheAge / (1000 * 60))} min old)`);
        
        // Set up real-time listener after loading cache
        setTimeout(() => setupRealtimeListener(), 1000);
        
        // Check if we need to fetch more to reach initial batch
        if (!wasCacheComplete && cachedHostels.length < MAX_CACHE_ITEMS && cachedHostels.length < BATCH_SIZE) {
          console.log(`🔄 Cache has only ${cachedHostels.length} items, fetching more to reach initial batch`);
          await fetchMoreHostels();
        }
      } else {
        console.log('📭 No cache found, fetching initial data...');
        await fetchInitialHostels();
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Error loading cached hostels:', error);
      await fetchInitialHostels();
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial hostels - now returns hostel documents as-is
  const fetchInitialHostels = async () => {
    if (hostelDocuments.length >= MAX_CACHE_ITEMS) {
      console.log(`✋ Already at maximum capacity (${hostelDocuments.length}/${MAX_CACHE_ITEMS})`);
      setCacheComplete(true);
      setHasMoreData(false);
      return;
    }

    try {
      setLoading(true);
      lastFullRefreshTime.current = Date.now();
      
      console.log(`🚀 Fetching initial hostel documents`);
      
      const feedsCollection = collection(db, 'feeds');
      const q = query(
        feedsCollection,
        orderBy('createdAt', 'desc'),
        limit(BATCH_SIZE)
      );

      const snapshot = await getDocs(q);
      console.log(`📊 Firebase read: ${snapshot.docs.length} hostel documents`);
      
      if (snapshot.empty) {
        setHasMoreData(false);
        setCacheComplete(true);
        return;
      }

      const updatedFetchedIds = new Set(fetchedIds);
      const newHostels = [];
      let newestTimestamp = null;
      
      snapshot.forEach((doc) => {
        const hostelData = { id: doc.id, ...doc.data() };
        
        if (!updatedFetchedIds.has(hostelData.id) && newHostels.length < MAX_CACHE_ITEMS) {
          newHostels.push(hostelData);
          updatedFetchedIds.add(hostelData.id);
          
          // Track the newest hostel timestamp
          if (!newestTimestamp && hostelData.createdAt) {
            newestTimestamp = hostelData.createdAt;
          }
        }
      });

      const updatedHostels = [...hostelDocuments, ...newHostels];
      const lastDocument = snapshot.docs[snapshot.docs.length - 1];
      
      const reachedLimit = updatedHostels.length >= MAX_CACHE_ITEMS;
      const noMoreItems = newHostels.length < BATCH_SIZE;
      const isComplete = reachedLimit || noMoreItems;
      
      setHostelDocuments(updatedHostels);
      setFetchedIds(updatedFetchedIds);
      setLastDoc(lastDocument);
      setHasMoreData(!isComplete);
      setCacheComplete(isComplete);
      
      // Update newest timestamp reference
      if (newestTimestamp) {
        newestCachedTimestamp.current = newestTimestamp;
      }
      
      await saveHostelsToCache(updatedHostels, updatedFetchedIds, !isComplete, isComplete, newestTimestamp);
      setupRealtimeListener();
      
      console.log(`✅ Fetched ${newHostels.length} hostels, total: ${updatedHostels.length}/${MAX_CACHE_ITEMS}`);
      
    } catch (error) {
      console.error('❌ Error fetching initial hostels:', error);
      setHasMoreData(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch more hostels - now returns hostel documents as-is
  const fetchMoreHostels = useCallback(async () => {
    if (loading || cacheComplete || hostelDocuments.length >= MAX_CACHE_ITEMS || !hasMoreData) {
      console.log(`⏹️ Skipping fetch - loading: ${loading}, complete: ${cacheComplete}, count: ${hostelDocuments.length}/${MAX_CACHE_ITEMS}, hasMore: ${hasMoreData}`);
      return;
    }

    try {
      setLoading(true);
      
      console.log(`🔄 Fetching more hostel documents (${hostelDocuments.length}/${MAX_CACHE_ITEMS} hostels cached)`);
      
      const feedsCollection = collection(db, 'feeds');
      
      let q;
      if (lastDoc) {
        q = query(
          feedsCollection,
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(BATCH_SIZE)
        );
      } else {
        q = query(
          feedsCollection,
          orderBy('createdAt', 'desc'),
          limit(BATCH_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      console.log(`📊 Firebase read: ${snapshot.docs.length} hostel documents`);
      
      if (snapshot.empty) {
        console.log('📭 No more hostel documents available');
        setHasMoreData(false);
        setCacheComplete(true);
        await saveHostelsToCache(hostelDocuments, fetchedIds, false, true, newestCachedTimestamp.current);
        return;
      }

      const updatedFetchedIds = new Set(fetchedIds);
      const newHostels = [];
      
      snapshot.forEach((doc) => {
        const hostelData = { id: doc.id, ...doc.data() };
        
        if (!updatedFetchedIds.has(hostelData.id) && (hostelDocuments.length + newHostels.length) < MAX_CACHE_ITEMS) {
          newHostels.push(hostelData);
          updatedFetchedIds.add(hostelData.id);
        }
      });

      if (newHostels.length === 0) {
        console.log('🔄 All fetched hostels were already in cache');
        setCacheComplete(true);
        setHasMoreData(false);
        return;
      }

      const updatedHostels = [...hostelDocuments, ...newHostels];
      const lastDocument = snapshot.docs[snapshot.docs.length - 1];
      
      const reachedLimit = updatedHostels.length >= MAX_CACHE_ITEMS;
      const noMoreItems = newHostels.length < BATCH_SIZE;
      const isComplete = reachedLimit || noMoreItems;
      
      setHostelDocuments(updatedHostels);
      setFetchedIds(updatedFetchedIds);
      setLastDoc(lastDocument);
      setHasMoreData(!isComplete);
      setCacheComplete(isComplete);
      
      await saveHostelsToCache(updatedHostels, updatedFetchedIds, !isComplete, isComplete, newestCachedTimestamp.current);
      
      console.log(`✅ Added ${newHostels.length} hostels, total: ${updatedHostels.length}/${MAX_CACHE_ITEMS}`);
      
    } catch (error) {
      console.error('❌ Error fetching more hostels:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMoreData, lastDoc, hostelDocuments, fetchedIds, cacheComplete]);

  // Integrate pending items
  const integratePendingItems = useCallback(async () => {
    if (pendingNewItems.current.length === 0) {
      return false;
    }

    try {
      const availableSlots = MAX_CACHE_ITEMS - hostelDocuments.length;
      const itemsToAdd = pendingNewItems.current
        .filter(item => !fetchedIds.has(item.id))
        .slice(0, availableSlots);

      if (itemsToAdd.length === 0) {
        pendingNewItems.current = [];
        setNewItemsAvailable(0);
        return false;
      }

      console.log(`🔄 Integrating ${itemsToAdd.length} new hostels (${availableSlots} slots available)`);

      const updatedHostels = [...itemsToAdd, ...hostelDocuments].slice(0, MAX_CACHE_ITEMS);
      const updatedFetchedIds = new Set([
        ...fetchedIds,
        ...itemsToAdd.map(item => item.id)
      ]);

      // Update newest timestamp if we have newer items
      const newestNewItem = itemsToAdd[0];
      let updatedNewestTimestamp = newestCachedTimestamp.current;
      
      if (newestNewItem?.createdAt && 
          (!newestCachedTimestamp.current || 
           newestNewItem.createdAt.toMillis() > newestCachedTimestamp.current.toMillis())) {
        updatedNewestTimestamp = newestNewItem.createdAt;
        newestCachedTimestamp.current = updatedNewestTimestamp;
      }

      setHostelDocuments(updatedHostels);
      setFetchedIds(updatedFetchedIds);
      
      const isNowComplete = updatedHostels.length >= MAX_CACHE_ITEMS;
      if (isNowComplete) {
        setCacheComplete(true);
        setHasMoreData(false);
      }
      
      await saveHostelsToCache(
        updatedHostels, 
        updatedFetchedIds, 
        hasMoreData && !isNowComplete, 
        isNowComplete,
        updatedNewestTimestamp
      );

      // Clear integrated items from pending
      const integratedIds = new Set(itemsToAdd.map(item => item.id));
      pendingNewItems.current = pendingNewItems.current.filter(item => !integratedIds.has(item.id));
      setNewItemsAvailable(pendingNewItems.current.length);

      console.log(`✅ Integrated ${itemsToAdd.length} hostels. Total: ${updatedHostels.length}/${MAX_CACHE_ITEMS}`);
      return true;

    } catch (error) {
      console.error('❌ Error integrating pending items:', error);
      return false;
    }
  }, [hostelDocuments, fetchedIds, hasMoreData]);

  // Check for new hostel documents
  const checkForNewItems = useCallback(async () => {
    if (isCheckingForUpdates.current || !newestCachedTimestamp.current) {
      return false;
    }

    isCheckingForUpdates.current = true;

    try {
      console.log('🔍 Checking for new hostel documents...');
      
      const feedsCollection = collection(db, 'feeds');
      
      const checkQuery = query(
        feedsCollection,
        where('createdAt', '>', newestCachedTimestamp.current),
        orderBy('createdAt', 'desc'),
        limit(5) // Small limit for checking
      );

      const snapshot = await getDocs(checkQuery);
      console.log(`📊 Manual check Firebase read: ${snapshot.docs.length} hostel documents`);

      if (snapshot.empty) {
        console.log('✅ No new hostel documents found');
        return false;
      }

      const newItems = [];
      snapshot.forEach((doc) => {
        const hostelData = { id: doc.id, ...doc.data() };
        if (!fetchedIds.has(hostelData.id)) {
          newItems.push(hostelData);
        }
      });

      if (newItems.length > 0) {
        console.log(`🔔 Found ${newItems.length} new hostels via manual check`);
        pendingNewItems.current = [...newItems, ...pendingNewItems.current];
        setNewItemsAvailable(prev => prev + newItems.length);
        return true;
      }

      return false;

    } catch (error) {
      console.error('❌ Error checking for new items:', error);
      return false;
    } finally {
      isCheckingForUpdates.current = false;
    }
  }, [fetchedIds]);

  // Refresh hostels with 24-hour logic
  const refreshHostels = async () => {
    try {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastFullRefreshTime.current;
      
      // If less than 24 hours, just reshuffle existing feeds
      if (timeSinceLastRefresh < REFRESH_INTERVAL && hostelDocuments.length > 0) {
        console.log(`🔀 Reshuffling existing hostels (${Math.round(timeSinceLastRefresh / (1000 * 60))} min since last refresh)`);
        
        // Just trigger a reshuffle in the VideoFeed component
        // The actual shuffling will happen there with a new seed
        return { reshuffleOnly: true };
      }

      console.log('🔄 Performing full refresh (24+ hours elapsed)...');
      setLoading(true);
      
      // Clear real-time listener
      if (realtimeUnsubscribe.current) {
        realtimeUnsubscribe.current();
      }
      
      // Reset all state
      setHostelDocuments([]);
      setFetchedIds(new Set());
      setLastDoc(null);
      setHasMoreData(true);
      setCacheComplete(false);
      setNewItemsAvailable(0);
      pendingNewItems.current = [];
      newestCachedTimestamp.current = null;
      lastFullRefreshTime.current = now;
      
      // Clear cache
      await AsyncStorage.removeItem(CACHE_KEY);
      
      // Fetch fresh data
      await fetchInitialHostels();
      
      console.log(`✅ Full refresh complete`);
      return { reshuffleOnly: false };
      
    } catch (error) {
      console.error('❌ Error refreshing hostels:', error);
      return { reshuffleOnly: false };
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    // Data - now providing hostel documents instead of individual videos
    hostelDocuments,
    loading,
    hasMoreData,
    isInitialized,
    cacheComplete,
    newItemsAvailable,
    maxCacheItems: MAX_CACHE_ITEMS,
    
    // Actions
    fetchMoreFeeds: fetchMoreHostels, // Keep same name for compatibility
    refreshFeeds: refreshHostels,     // Keep same name for compatibility
    checkForNewItems,
    integratePendingItems
  };

  return (
    <FeedsContext.Provider value={contextValue}>
      {children}
    </FeedsContext.Provider>
  );
};

export const useFeeds = () => {
  const context = useContext(FeedsContext);
  if (!context) {
    throw new Error('useFeeds must be used within a FeedsProvider');
  }
  return context;
};

export default FeedsContext;
// // context/FeedsContext.js - OPTIMIZED VERSION
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { collection, query, limit, getDocs, orderBy, startAfter, where, Timestamp } from 'firebase/firestore';
// import { db } from '../app/firebase/FirebaseConfig';

// const FeedsContext = createContext();

// // Constants
// const CACHE_KEY = 'feeds_cache';
// const BATCH_SIZE = 10;
// const PRELOAD_THRESHOLD = 8;
// const MAX_CACHE_ITEMS = 100; // Maximum items to cache
// const CACHE_VERSION = 'v3'; // Increment when changing cache structure

// export const FeedsProvider = ({ children }) => {
//   const [feeds, setFeeds] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [hasMoreData, setHasMoreData] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [lastDoc, setLastDoc] = useState(null);
//   const [fetchedIds, setFetchedIds] = useState(new Set());
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [cacheComplete, setCacheComplete] = useState(false); // Flag when we have max items

//   // Load cache on app start
//   useEffect(() => {
//     loadCachedFeeds();
//   }, []);

//   // Auto-fetch more when approaching end - WITH CACHE LIMIT CHECK
//   useEffect(() => {
//     if (
//       isInitialized && 
//       currentIndex >= feeds.length - (BATCH_SIZE - PRELOAD_THRESHOLD) && 
//       hasMoreData && 
//       !loading &&
//       !cacheComplete && // CRITICAL: Don't fetch if cache is complete
//       feeds.length < MAX_CACHE_ITEMS // CRITICAL: Don't fetch if we hit the limit
//     ) {
//       console.log(`🎯 Auto-fetching more feeds. Current: ${feeds.length}/${MAX_CACHE_ITEMS}`);
//       fetchMoreFeeds();
//     }
//   }, [currentIndex, feeds.length, hasMoreData, loading, isInitialized, cacheComplete]);

//   // Load cached feeds from AsyncStorage
//   const loadCachedFeeds = async () => {
//     try {
//       setLoading(true);
//       const cachedData = await AsyncStorage.getItem(`${CACHE_KEY}_${CACHE_VERSION}`);
      
//       if (cachedData) {
//         const { 
//           feeds: cachedFeeds, 
//           fetchedIds: cachedIds, 
//           hasMore, 
//           cacheComplete: wasCacheComplete,
//           lastFetchTimestamp 
//         } = JSON.parse(cachedData);
        
//         setFeeds(cachedFeeds);
//         setFetchedIds(new Set(cachedIds));
//         setCacheComplete(wasCacheComplete || cachedFeeds.length >= MAX_CACHE_ITEMS);
        
//         // Determine if we still have more data based on cache state
//         const shouldHaveMore = !wasCacheComplete && cachedFeeds.length < MAX_CACHE_ITEMS;
//         setHasMoreData(shouldHaveMore);
        
//         console.log(`📱 Loaded ${cachedFeeds.length} feeds from cache`);
//         console.log(`📊 Cache status: ${cachedFeeds.length}/${MAX_CACHE_ITEMS} items`);
//         console.log(`✅ Cache complete: ${wasCacheComplete || cachedFeeds.length >= MAX_CACHE_ITEMS}`);
        
//         // Only fetch more if cache is not complete and we have less than desired amount
//         if (!wasCacheComplete && cachedFeeds.length < Math.min(BATCH_SIZE * 2, MAX_CACHE_ITEMS)) {
//           console.log('🔄 Cache incomplete, fetching initial batch...');
//           await fetchInitialFeeds(cachedFeeds, new Set(cachedIds));
//         }
//       } else {
//         console.log('📭 No cache found, fetching initial data...');
//         await fetchInitialFeeds();
//       }
      
//       setIsInitialized(true);
//     } catch (error) {
//       console.error('❌ Error loading cached feeds:', error);
//       await fetchInitialFeeds();
//       setIsInitialized(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Save feeds to cache with version and completion status
//   const saveFeedsToCache = async (feedsData, fetchedIdsSet, hasMore, isComplete) => {
//     try {
//       const cacheData = {
//         feeds: feedsData,
//         fetchedIds: Array.from(fetchedIdsSet),
//         hasMore,
//         cacheComplete: isComplete,
//         lastFetchTimestamp: Date.now(),
//         version: CACHE_VERSION
//       };
      
//       await AsyncStorage.setItem(`${CACHE_KEY}_${CACHE_VERSION}`, JSON.stringify(cacheData));
//       console.log(`💾 Saved ${feedsData.length} feeds to cache (complete: ${isComplete})`);
//     } catch (error) {
//       console.error('❌ Error saving feeds to cache:', error);
//     }
//   };

//   // Check if we should stop fetching
//   const shouldStopFetching = (currentCount) => {
//     return currentCount >= MAX_CACHE_ITEMS;
//   };

//   // Fetch initial feeds with limit enforcement
//   const fetchInitialFeeds = async (existingFeeds = [], existingIds = new Set()) => {
//     // Don't fetch if we already have the maximum
//     if (existingFeeds.length >= MAX_CACHE_ITEMS) {
//       console.log(`✋ Already have maximum items (${existingFeeds.length}/${MAX_CACHE_ITEMS}), skipping fetch`);
//       setCacheComplete(true);
//       setHasMoreData(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log(`🚀 Fetching initial feeds (current: ${existingFeeds.length}/${MAX_CACHE_ITEMS})`);
      
//       // Calculate how many we can still fetch
//       const remainingSlots = MAX_CACHE_ITEMS - existingFeeds.length;
//       const fetchLimit = Math.min(BATCH_SIZE, remainingSlots);
      
//       const feedsCollection = collection(db, 'feeds');
//       const q = query(
//         feedsCollection,
//         orderBy('createdAt', 'desc'),
//         limit(fetchLimit)
//       );

//       const snapshot = await getDocs(q);
      
//       if (snapshot.empty) {
//         console.log('📭 No feeds available in database');
//         setHasMoreData(false);
//         setCacheComplete(true);
//         return;
//       }

//       const newFeeds = [];
//       snapshot.forEach((doc) => {
//         const feedData = { id: doc.id, ...doc.data() };
        
//         // Only add if not already fetched and we haven't hit the limit
//         if (!existingIds.has(doc.id) && (existingFeeds.length + newFeeds.length) < MAX_CACHE_ITEMS) {
//           newFeeds.push(feedData);
//           existingIds.add(doc.id);
//         }
//       });

//       const updatedFeeds = [...existingFeeds, ...newFeeds];
//       const lastDocument = snapshot.docs[snapshot.docs.length - 1];
      
//       // Check if we've reached our cache limit or if there are no more items
//       const reachedLimit = updatedFeeds.length >= MAX_CACHE_ITEMS;
//       const noMoreItems = newFeeds.length < fetchLimit;
//       const isComplete = reachedLimit || noMoreItems;
      
//       setFeeds(updatedFeeds);
//       setFetchedIds(new Set(existingIds));
//       setLastDoc(lastDocument);
//       setHasMoreData(!isComplete);
//       setCacheComplete(isComplete);
      
//       await saveFeedsToCache(updatedFeeds, existingIds, !isComplete, isComplete);
      
//       console.log(`✅ Fetched ${newFeeds.length} new feeds, total: ${updatedFeeds.length}/${MAX_CACHE_ITEMS}`);
//       console.log(`🏁 Cache complete: ${isComplete}`);
      
//     } catch (error) {
//       console.error('❌ Error fetching initial feeds:', error);
//       setHasMoreData(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // CRITICAL: Smart fetch more feeds - PREVENTS UNNECESSARY FETCHES
//   const fetchMoreFeeds = useCallback(async () => {
//     // CRITICAL CHECKS to prevent unnecessary fetches
//     if (loading) {
//       console.log('⏳ Already loading, skipping fetch');
//       return;
//     }

//     if (cacheComplete) {
//       console.log('🛑 Cache is complete, no more fetches needed');
//       return;
//     }

//     if (feeds.length >= MAX_CACHE_ITEMS) {
//       console.log(`🛑 Maximum cache items reached (${feeds.length}/${MAX_CACHE_ITEMS}), stopping fetches`);
//       setCacheComplete(true);
//       setHasMoreData(false);
//       await saveFeedsToCache(feeds, fetchedIds, false, true);
//       return;
//     }

//     if (!hasMoreData) {
//       console.log('🛑 No more data available');
//       return;
//     }

//     if (!lastDoc) {
//       console.log('🛑 No lastDoc available for pagination');
//       return;
//     }

//     try {
//       setLoading(true);
      
//       // Calculate how many more we can fetch
//       const remainingSlots = MAX_CACHE_ITEMS - feeds.length;
//       const fetchLimit = Math.min(BATCH_SIZE, remainingSlots);
      
//       console.log(`🔄 Fetching more feeds: ${feeds.length}/${MAX_CACHE_ITEMS} (fetching ${fetchLimit})`);
      
//       const feedsCollection = collection(db, 'feeds');
//       const q = query(
//         feedsCollection,
//         orderBy('createdAt', 'desc'),
//         startAfter(lastDoc),
//         limit(fetchLimit)
//       );

//       const snapshot = await getDocs(q);
      
//       if (snapshot.empty) {
//         console.log('📭 No more feeds available in database');
//         setHasMoreData(false);
//         setCacheComplete(true);
//         await saveFeedsToCache(feeds, fetchedIds, false, true);
//         return;
//       }

//       const newFeeds = [];
//       snapshot.forEach((doc) => {
//         const feedData = { id: doc.id, ...doc.data() };
        
//         // Only add if not already fetched and we haven't hit the limit
//         if (!fetchedIds.has(doc.id) && (feeds.length + newFeeds.length) < MAX_CACHE_ITEMS) {
//           newFeeds.push(feedData);
//         }
//       });

//       if (newFeeds.length === 0) {
//         console.log('🔄 All fetched items were already in cache or limit reached');
//         setCacheComplete(true);
//         setHasMoreData(false);
//         await saveFeedsToCache(feeds, fetchedIds, false, true);
//         return;
//       }

//       const updatedFeeds = [...feeds, ...newFeeds];
//       const updatedFetchedIds = new Set([...fetchedIds, ...newFeeds.map(feed => feed.id)]);
//       const lastDocument = snapshot.docs[snapshot.docs.length - 1];
      
//       // Check if we've reached our limit or if there are no more items
//       const reachedLimit = updatedFeeds.length >= MAX_CACHE_ITEMS;
//       const noMoreItems = newFeeds.length < fetchLimit;
//       const isComplete = reachedLimit || noMoreItems;
      
//       setFeeds(updatedFeeds);
//       setFetchedIds(updatedFetchedIds);
//       setLastDoc(lastDocument);
//       setHasMoreData(!isComplete);
//       setCacheComplete(isComplete);
      
//       await saveFeedsToCache(updatedFeeds, updatedFetchedIds, !isComplete, isComplete);
      
//       console.log(`✅ Fetched ${newFeeds.length} new feeds, total: ${updatedFeeds.length}/${MAX_CACHE_ITEMS}`);
//       console.log(`🏁 Cache complete: ${isComplete}`);
      
//       if (isComplete) {
//         console.log('🎉 All available feeds have been cached (reached limit or no more items)!');
//       }
      
//     } catch (error) {
//       console.error('❌ Error fetching more feeds:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [loading, hasMoreData, lastDoc, feeds, fetchedIds, cacheComplete]);

//   // Refresh feeds (clear cache and fetch fresh) - RESPECTS LIMITS
//   const refreshFeeds = async () => {
//     try {
//       console.log('🔄 Refreshing feeds...');
//       setLoading(true);
      
//       // Clear current state
//       setFeeds([]);
//       setFetchedIds(new Set());
//       setLastDoc(null);
//       setHasMoreData(true);
//       setCacheComplete(false);
//       setCurrentIndex(0);
      
//       // Clear cache
//       await AsyncStorage.removeItem(`${CACHE_KEY}_${CACHE_VERSION}`);
      
//       // Fetch fresh data
//       await fetchInitialFeeds();
      
//       console.log('✅ Refresh complete');
//     } catch (error) {
//       console.error('❌ Error refreshing feeds:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update current video index for preloading
//   const updateCurrentIndex = (index) => {
//     setCurrentIndex(index);
//   };

//   // Get feeds stats
//   const getStats = () => ({
//     totalFeeds: feeds.length,
//     fetchedIds: fetchedIds.size,
//     maxCacheItems: MAX_CACHE_ITEMS,
//     hasMoreData,
//     loading,
//     currentIndex,
//     cacheComplete,
//     cachePercentage: Math.round((feeds.length / MAX_CACHE_ITEMS) * 100),
//     remainingSlots: Math.max(0, MAX_CACHE_ITEMS - feeds.length)
//   });

//   // Clear cache (for debugging or user request)
//   const clearCache = async () => {
//     try {
//       await AsyncStorage.removeItem(`${CACHE_KEY}_${CACHE_VERSION}`);
//       setFeeds([]);
//       setFetchedIds(new Set());
//       setLastDoc(null);
//       setHasMoreData(true);
//       setCacheComplete(false);
//       setCurrentIndex(0);
//       console.log('🧹 Cache cleared');
//     } catch (error) {
//       console.error('❌ Error clearing cache:', error);
//     }
//   };

//   const contextValue = {
//     // Data
//     feeds,
//     loading,
//     hasMoreData,
//     currentIndex,
//     isInitialized,
//     cacheComplete,
    
//     // Actions
//     fetchMoreFeeds,
//     refreshFeeds,
//     updateCurrentIndex,
//     clearCache,
    
//     // Utils
//     getStats,
//     maxCacheItems: MAX_CACHE_ITEMS
//   };

//   return (
//     <FeedsContext.Provider value={contextValue}>
//       {children}
//     </FeedsContext.Provider>
//   );
// };

// // Custom hook to use feeds context
// export const useFeeds = () => {
//   const context = useContext(FeedsContext);
//   if (!context) {
//     throw new Error('useFeeds must be used within a FeedsProvider');
//   }
//   return context;
// };

// export default FeedsContext;