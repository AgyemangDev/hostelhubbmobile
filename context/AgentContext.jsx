import React, { createContext, useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../app/firebase/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AgentContext = createContext();

// Storage keys for persistent caching
const RANDOM_SEED_KEY = 'agent_random_seed_key';
const CACHED_AGENTS_KEY = 'cached_agents_data';
const CACHE_TIMESTAMP_KEY = 'cache_timestamp';

export const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  // Get or create a permanent random seed (never changes once created)
  const getPermanentRandomSeed = async () => {
    try {
      const storedSeed = await AsyncStorage.getItem(RANDOM_SEED_KEY);
      if (storedSeed) {
        console.log('🔄 Using existing permanent random seed:', storedSeed);
        return parseFloat(storedSeed);
      }
      
      // Generate new seed only if none exists
      const newSeed = Math.random();
      await AsyncStorage.setItem(RANDOM_SEED_KEY, newSeed.toString());
      console.log('🆕 Created new permanent random seed:', newSeed);
      return newSeed;
    } catch (error) {
      console.error('❌ Error managing random seed:', error);
      // Fallback to consistent seed if storage fails
      return 0.5; // Fixed fallback to ensure consistency
    }
  };

  // Check if cached data exists
  const getCachedAgents = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHED_AGENTS_KEY);
      const cacheTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData && cacheTimestamp) {
        console.log('💾 Found cached agents data');
        return {
          data: JSON.parse(cachedData),
          timestamp: parseInt(cacheTimestamp)
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error reading cached data:', error);
      return null;
    }
  };

  // Cache agents data
  const cacheAgentsData = async (data) => {
    try {
      await AsyncStorage.setItem(CACHED_AGENTS_KEY, JSON.stringify(data));
      await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      console.log('✅ Agents data cached successfully');
    } catch (error) {
      console.error('❌ Error caching agents data:', error);
    }
  };

  // Fetch agents from Firestore with persistent random seed
  const fetchRandomAgentsFromFirestore = async (source = 'default') => {
    try {
      // Use permanent random seed instead of generating new one
      const randomSeed = await getPermanentRandomSeed();
      console.log(`🎲 Using permanent random seed: ${randomSeed} for ${source} fetch`);
      
      const agentsRef = collection(db, 'Employees');
      
      const firstQuery = query(
        agentsRef,
        where('department', '==', 'Hostel Agent'),
        where('isAccepted', '==', true),
        where('random', '>=', randomSeed),
        orderBy('random'),
        limit(10)
      );

      let snapshot;
      try {
        snapshot = await getDocs(firstQuery, { source });
      } catch (cacheError) {
        console.warn(`⚠️ Failed to fetch from ${source}. Error:`, cacheError.message);
        if (source === 'cache') return null;
        throw cacheError;
      }

      let agentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fallback if less than 10 agents
      if (agentData.length < 10) {
        const fallbackQuery = query(
          agentsRef,
          where('department', '==', 'Hostel Agent'),
          where('isAccepted', '==', true),
          where('random', '<', randomSeed),
          orderBy('random'),
          limit(10 - agentData.length)
        );

        let fallbackSnap;
        try {
          fallbackSnap = await getDocs(fallbackQuery, { source });
        } catch (fallbackError) {
          if (source === 'cache') return null;
          throw fallbackError;
        }

        const fallbackData = fallbackSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        agentData = [...agentData, ...fallbackData];
      }

      console.log(`📊 Fetched ${agentData.length} agents from ${source}`);
      return agentData;
    } catch (error) {
      console.error('🔥 Error fetching agents from Firestore:', error);
      return [];
    }
  };

  // Main load function with persistent caching
  const loadAgents = async () => {
    console.log('🚀 Starting loadAgents with persistent caching...');
    setLoadingAgents(true);

    try {
      // Step 1: Check AsyncStorage cache first
      const cachedResult = await getCachedAgents();
      if (cachedResult && cachedResult.data.length > 0) {
        console.log('💾 Using cached agents data - no Firestore fetch needed');
        setAgents(cachedResult.data);
        setLoadingAgents(false);
        return;
      }

      // Step 2: Try Firestore cache
      console.log('📡 No AsyncStorage cache, trying Firestore cache...');
      let agentsFromCache = await fetchRandomAgentsFromFirestore('cache');
      
      if (agentsFromCache && agentsFromCache.length > 0) {
        console.log('🎯 Using Firestore cache');
        setAgents(agentsFromCache);
        // Cache to AsyncStorage for next time
        await cacheAgentsData(agentsFromCache);
      } else {
        // Step 3: Fetch from server (only happens once)
        console.log('🌐 No cache available, fetching from server...');
        const agentsFromServer = await fetchRandomAgentsFromFirestore('server');
        setAgents(agentsFromServer);
        // Cache the server data
        await cacheAgentsData(agentsFromServer);
      }
    } catch (error) {
      console.error('❌ Error in loadAgents:', error);
      // Try to use any cached data as fallback
      const cachedResult = await getCachedAgents();
      if (cachedResult) {
        console.log('🔄 Using cached data as fallback');
        setAgents(cachedResult.data);
      }
    } finally {
      setLoadingAgents(false);
    }
  };

  // Optional: Clear cache function (for testing/debugging)
  const clearCache = async () => {
    try {
      await AsyncStorage.multiRemove([
        RANDOM_SEED_KEY,
        CACHED_AGENTS_KEY,
        CACHE_TIMESTAMP_KEY
      ]);
      console.log('🗑️ Cache cleared');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  };

  // Optional: Get cache info for debugging
  const getCacheInfo = async () => {
    try {
      const seed = await AsyncStorage.getItem(RANDOM_SEED_KEY);
      const cacheTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      const cachedData = await AsyncStorage.getItem(CACHED_AGENTS_KEY);
      
      return {
        hasSeed: !!seed,
        seed: seed ? parseFloat(seed) : null,
        hasCachedData: !!cachedData,
        cacheTimestamp: cacheTimestamp ? parseInt(cacheTimestamp) : null,
        cacheAge: cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : null,
        agentCount: cachedData ? JSON.parse(cachedData).length : 0
      };
    } catch (error) {
      console.error('❌ Error getting cache info:', error);
      return null;
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <AgentContext.Provider value={{ 
      agents, 
      loadingAgents,
      clearCache, // For debugging
      getCacheInfo // For debugging
    }}>
      {children}
    </AgentContext.Provider>
  );
};