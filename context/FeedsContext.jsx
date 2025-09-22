// context/FeedsContext.js - MODIFIED TO REMOVE REPETITIVE CHECKING
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
// REMOVED: REAL_TIME_CHECK_INTERVAL - no more repetitive checking

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
  const lastFullRefreshTime = useRef(0);

  useEffect(() => {
    loadCachedHostels();
    return () => {
      if (realtimeUnsubscribe.current) {
        realtimeUnsubscribe.current();
      }
    };
  }, []);

  // Real-time listener for new hostel documents - this is passive and efficient
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
        
        // Set up real-time listener after loading cache (one-time setup)
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

  // REMOVED: checkForNewItems function - no more manual checking needed
  // The real-time listener handles new items automatically

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
    integratePendingItems
    // REMOVED: checkForNewItems - no longer available
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