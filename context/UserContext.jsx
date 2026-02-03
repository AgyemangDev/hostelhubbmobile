import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../app/firebase/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import API_BASE_URL from '../utils/api/api';
import EventSource from 'react-native-sse'; // Add this import

export const UserContext = createContext();

const STORAGE_KEYS = {
  userSession: 'userSession',
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  /* ------------------ Cache Helpers ------------------ */

  const saveCache = async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.userSession, JSON.stringify(data));
    } catch (e) {
      console.error('Cache save error:', e);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.userSession);
    } catch (e) {
      console.error('Cache clear error:', e);
    }
  };

  /* ------------------ Patch User Data ------------------ */
// UserContext.jsx - ADD LOGS TO patchUserData
// UserContext.jsx - FIX patchUserData to use cached token

const patchUserData = useCallback(async (updates) => {
  if (!user) throw new Error("No user logged in");

  console.log('========================================');
  console.log('PATCH REQUEST STARTING');
  console.log('Updates:', JSON.stringify(updates, null, 2));

  try {
    // FIX: Use forceRefresh: false to avoid quota issues
    const token = await user.getIdToken(false);
    console.log('Token obtained:', token ? 'YES' : 'NO');

    const url = `${API_BASE_URL}/api/students/me`;
    console.log('URL:', url);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Response error:', errorData);
      throw new Error(errorData.error || "Failed to update user data");
    }

    const responseData = await response.json();
    console.log('✅ Patch successful:', responseData);
    console.log('========================================');
  } catch (err) {
    console.error('❌ Patch failed:', err);
    console.log('========================================');
    throw err;
  }
}, [user]);

  /* ------------------ SSE Connection ------------------ */

// UserContext.jsx - FIX quota exceeded issue

const connectToStream = useCallback(async (firebaseUser) => {
  // Close existing connection
  if (eventSourceRef.current) {
    eventSourceRef.current.close();
    eventSourceRef.current = null;
  }

  if (reconnectTimeoutRef.current) {
    clearTimeout(reconnectTimeoutRef.current);
    reconnectTimeoutRef.current = null;
  }

  try {
    // FIX: Use forceRefresh: false to use cached token
    const token = await firebaseUser.getIdToken(false);
    
    const es = new EventSource(
      `${API_BASE_URL}/api/students/me/stream`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    es.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.error) {
          setUserInfo(data);
          await saveCache(data);
        }
      } catch (err) {
        console.error('Parse error:', err);
      }
    });

    es.addEventListener('error', (error) => {
      console.error('SSE error:', error);
      
      // FIX: Increase reconnect delay to 30 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        if (auth.currentUser) {
          connectToStream(auth.currentUser);
        }
      }, 30000);
    });

    es.addEventListener('open', () => {
      console.log('SSE connection opened');
    });

    eventSourceRef.current = es;
  } catch (err) {
    console.error('SSE connection error:', err);
    
    // FIX: Only retry if not quota exceeded
    if (err.code !== 'auth/quota-exceeded') {
      reconnectTimeoutRef.current = setTimeout(() => {
        if (auth.currentUser) {
          connectToStream(auth.currentUser);
        }
      }, 30000);
    } else {
      console.error('❌ Firebase quota exceeded - stopping reconnection attempts');
    }
  }
}, []);

  const disconnectStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  /* ------------------ Load Cached User ------------------ */

  useEffect(() => {
    const loadCache = async () => {
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.userSession);
        if (cached) {
          setUserInfo(JSON.parse(cached));
        }
      } catch (e) {
        console.error('Cache load error:', e);
      }
    };

    loadCache();
  }, []);

  /* ------------------ Auth Listener ------------------ */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        disconnectStream();
        setUserInfo(null);
        await clearCache();
        setLoading(false);
        return;
      }

      await connectToStream(firebaseUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      disconnectStream();
    };
  }, [connectToStream]);

  /* ------------------ Context Value ------------------ */

  const value = useMemo(() => ({
    user,
    userInfo,
    isLoading: loading,
     patchUserData, 
    logoutCleanup: async () => {
      disconnectStream();
      setUserInfo(null);
      await clearCache();
    },
  }), [user, userInfo, loading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};