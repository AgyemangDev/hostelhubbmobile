import React, { useEffect, useState, createContext, useContext } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  orderBy, 
  startAfter,
  limit,
  getDoc,
  doc
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../app/firebase/FirebaseConfig";

const TransactionContext = createContext();

// Keys for AsyncStorage
const STORAGE_KEYS = {
  TRANSACTIONS: "transactions",
  TRANSACTIONS_META: "transactions_meta",
  LAST_SYNC_TIME: "transactions_last_sync"
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Load cached data and set up real-time listeners efficiently
  useEffect(() => {
    let unsubscribe = null;

    const syncTransactions = async () => {
      if (!user) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Load cached transactions and metadata
        const [
          storedTransactionsJSON,
          lastSyncTimeJSON
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME)
        ]);

        const storedTransactions = storedTransactionsJSON ? JSON.parse(storedTransactionsJSON) : [];
        const storedLastSyncTime = lastSyncTimeJSON ? JSON.parse(lastSyncTimeJSON) : null;
        
        console.log("Loaded transactions from AsyncStorage:", storedTransactions.length);
        
        // Set cached data immediately for better UX
        if (storedTransactions.length > 0) {
          setTransactions(storedTransactions);
          setLastSyncTime(storedLastSyncTime);
        }

        // OPTION 1: If we want to use a time-based query for new transactions only
        const transactionsRef = collection(db, "transaction");
        
        // Create base query for user's transactions
        let newTransactionsQuery = query(
          transactionsRef,
          where("userId", "==", user.uid)
        );

        // If we have stored transactions, only query for newer ones
        if (storedLastSyncTime) {
          const lastSyncDate = new Date(storedLastSyncTime);
          newTransactionsQuery = query(
            transactionsRef,
            where("userId", "==", user.uid),
            where("createdAt", ">=", lastSyncDate),
            orderBy("createdAt", "desc")
          );
          
          console.log("Fetching only transactions created after:", lastSyncDate);
        } else {
          console.log("No last sync time, fetching all transactions");
        }

        // Fetch new transactions since last sync
        const snapshot = await getDocs(newTransactionsQuery);
        const fetchedTransactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log("Fetched transactions from Firestore:", fetchedTransactions.length);

        if (fetchedTransactions.length > 0) {
          // Merge with existing cached transactions
          const transactionMap = new Map();
          
          // Add existing transactions to map
          storedTransactions.forEach(tx => {
            transactionMap.set(tx.id, tx);
          });
          
          // Add or update with new transactions
          fetchedTransactions.forEach(tx => {
            transactionMap.set(tx.id, tx);
          });
          
          // Convert map back to array
          const updatedTransactions = Array.from(transactionMap.values());
          
          // Store current time as last sync time
          const newSyncTime = Date.now();
          
          // Update AsyncStorage
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions)),
            AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, JSON.stringify(newSyncTime))
          ]);
          
          // Update state
          setTransactions(updatedTransactions);
          setLastSyncTime(newSyncTime);
          
          console.log("Updated transactions saved to AsyncStorage, total count:", updatedTransactions.length);
        }

        // OPTION 2: Set up a REAL-TIME LISTENER only for NEW TRANSACTIONS
        // This approach minimizes reads as it only listens for new transactions created after now
        const currentTimestamp = new Date();
        
        // Listen only for NEW transactions created after this moment
        const newTransactionsListenerQuery = query(
          transactionsRef,
          where("userId", "==", user.uid),
          where("createdAt", ">=", currentTimestamp),
          orderBy("createdAt", "desc")
        );

        unsubscribe = onSnapshot(
          newTransactionsListenerQuery, 
          { includeMetadataChanges: true },
          async (snapshot) => {
            // Only process if we have new server data (not just local cache)
            if (!snapshot.metadata.hasPendingWrites && !snapshot.metadata.fromCache) {
              const newTransactions = [];
              
              snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                  newTransactions.push({
                    id: change.doc.id,
                    ...change.doc.data()
                  });
                }
              });

              if (newTransactions.length > 0) {
                console.log("Real-time listener: New transactions detected:", newTransactions.length);
                
                // Get current cached data
                const currentCachedJSON = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
                const currentCached = currentCachedJSON ? JSON.parse(currentCachedJSON) : [];
                
                // Merge with existing transactions
                const updatedTransactions = [...currentCached, ...newTransactions];
                
                // Update AsyncStorage and state
                await AsyncStorage.setItem(
                  STORAGE_KEYS.TRANSACTIONS,
                  JSON.stringify(updatedTransactions)
                );
                
                setTransactions(updatedTransactions);
              }
            }
          }
        );

        setIsLoading(false);
        
      } catch (error) {
        console.error("Error syncing transactions:", error);
        setIsLoading(false);
      }
    };

    syncTransactions();

    // Cleanup function
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Function to manually refresh transactions - useful for pull-to-refresh
  const refreshTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const transactionsRef = collection(db, "transaction");
      const userTransactionsQuery = query(
        transactionsRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(userTransactionsQuery);
      const fetchedTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Update AsyncStorage and state
      const newSyncTime = Date.now();
      
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(fetchedTransactions)),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, JSON.stringify(newSyncTime))
      ]);
      
      setTransactions(fetchedTransactions);
      setLastSyncTime(newSyncTime);
      
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch a single transaction by ID (useful for updates)
  const fetchTransactionById = async (transactionId) => {
    try {
      const transactionRef = doc(db, "transaction", transactionId);
      const transactionSnap = await getDoc(transactionRef);
      
      if (transactionSnap.exists()) {
        const transaction = {
          id: transactionSnap.id,
          ...transactionSnap.data()
        };
        
        // Update the transaction in the cached list
        const updatedTransactions = transactions.map(tx => 
          tx.id === transactionId ? transaction : tx
        );
        
        // Update AsyncStorage and state
        await AsyncStorage.setItem(
          STORAGE_KEYS.TRANSACTIONS,
          JSON.stringify(updatedTransactions)
        );
        
        setTransactions(updatedTransactions);
        return transaction;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching transaction by ID:", error);
      return null;
    }
  };

  // Add a transaction locally (useful for optimistic updates)
  const addLocalTransaction = async (transaction) => {
    try {
      const updatedTransactions = [...transactions, transaction];
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify(updatedTransactions)
      );
      
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Error adding local transaction:", error);
    }
  };

  return (
    <TransactionContext.Provider 
      value={{ 
        transactions, 
        isLoading, 
        refreshTransactions,
        fetchTransactionById,
        addLocalTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);