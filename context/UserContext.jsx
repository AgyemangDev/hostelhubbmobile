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

  /* ------------------ SSE Connection ------------------ */

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
      const token = await firebaseUser.getIdToken(true);
      
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
        
        // Reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          if (auth.currentUser) {
            connectToStream(auth.currentUser);
          }
        }, 100000);
      });

      es.addEventListener('open', () => {
        console.log('SSE connection opened');
      });

      eventSourceRef.current = es;
    } catch (err) {
      console.error('SSE connection error:', err);
      
      // Retry connection
      reconnectTimeoutRef.current = setTimeout(() => {
        if (auth.currentUser) {
          connectToStream(auth.currentUser);
        }
      }, 5000);
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