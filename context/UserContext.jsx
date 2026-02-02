// context/UserContext.jsx
import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../app/firebase/supabaseConfig';
import { auth } from '../app/firebase/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export const UserContext = createContext();

const STORAGE_KEYS = {
  userSession: 'userSession',
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [userInfo, setUserInfo] = useState(null); // Supabase user info
  const [dataLoaded, setDataLoaded] = useState(false);
  const channelRef = useRef(null); // Store the subscription channel

  // Save userInfo to AsyncStorage
  const updateUserCache = useCallback(async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.userSession, JSON.stringify(data));
      console.log('User cache updated:', data);
    } catch (err) {
      console.error('Error updating cache:', err);
    }
  }, []);

  const clearUserSession = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.userSession);
      console.log('User session cleared');
    } catch (err) {
      console.error('Error clearing session:', err);
    }
  }, []);

  // Load cached user info on app start
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.userSession);
        if (cached) {
          const parsed = JSON.parse(cached);
          setUserInfo(parsed);
          console.log('Loaded cached user info:', parsed);
        }
      } catch (err) {
        console.error('Error loading cached user:', err);
      } finally {
        setDataLoaded(true);
      }
    };
    loadCachedData();
  }, []);

  // Setup Supabase Realtime subscription
  const setupRealtimeSubscription = useCallback((userId) => {
    // Clean up any existing subscription
    if (channelRef.current) {
      console.log('Removing existing subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('Setting up realtime subscription for user:', userId);

    // Create a new channel for this specific user
    const channel = supabase
      .channel(`student_user_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'Student_Users',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime update received:', payload);

          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updatedData = payload.new;
            console.log('User data updated in real-time:', updatedData);
            setUserInfo(updatedData);
            updateUserCache(updatedData);
          } else if (payload.eventType === 'DELETE') {
            console.log('User record deleted');
            setUserInfo(null);
            clearUserSession();
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime updates');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('Subscription error:', status);
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [updateUserCache, clearUserSession]);

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (!firebaseUser) {
        console.log('No Firebase user, clearing info');
        setUserInfo(null);
        clearUserSession();
        
        // Clean up subscription when user logs out
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        return;
      }

      try {
        console.log('Fetching Supabase user for UID:', firebaseUser.uid);

        const { data, error } = await supabase
          .from('Student_Users')
          .select('*')
          .eq('id', firebaseUser.uid)
          .single();

        if (error) {
          console.error('Supabase fetch error:', error);
          setUserInfo(null);
        } else if (!data) {
          console.warn('No user found in Supabase for UID:', firebaseUser.uid);
          setUserInfo(null);
        } else {
          console.log('Supabase user fetched:', data);
          setUserInfo(data);
          await updateUserCache(data);
          
          // Setup realtime subscription for this user
          setupRealtimeSubscription(firebaseUser.uid);
        }
      } catch (err) {
        console.error('Error fetching user from Supabase:', err);
        setUserInfo(null);
      }
    });

    return () => {
      unsubscribe();
      // Clean up subscription on component unmount
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [updateUserCache, clearUserSession, setupRealtimeSubscription]);

  const contextValue = useMemo(
    () => ({
      user,
      userInfo,
      isLoading: !dataLoaded,
      clearUserSession,
    }),
    [user, userInfo, dataLoaded, clearUserSession]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};