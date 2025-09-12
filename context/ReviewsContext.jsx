import React, { createContext, useState, useEffect } from 'react';
import { db } from '../app/firebase/FirebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const reviewsRef = collection(db, 'Reviews');
        const reviewsQuery = query(reviewsRef);
        
        // Fetch reviews once
        const snapshot = await getDocs(reviewsQuery);
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Update state and cache
        setReviews(reviewsData);
        
        await AsyncStorage.setItem('reviewsData', JSON.stringify(reviewsData));
        await AsyncStorage.setItem('reviewsTimestamp', JSON.stringify(Date.now()));

      } catch (error) {
        console.error("Error fetching reviews: ", error);
      } finally {
        setLoading(false);
      }
    };

    const loadReviewsFromCache = async () => {
      const cachedData = await AsyncStorage.getItem('reviewsData');
      if (cachedData) {
        setReviews(JSON.parse(cachedData));
        setLoading(false);
      }
    };

    const checkAndFetchReviews = async () => {
      const reviewsTimestamp = await AsyncStorage.getItem('reviewsTimestamp');
      const isDataExpired = !reviewsTimestamp || (Date.now() - JSON.parse(reviewsTimestamp)) > 172800000; // 48 hours in milliseconds

      if (isDataExpired) {
        await fetchReviews();
      } else {
        await loadReviewsFromCache();
      }
    };

    checkAndFetchReviews();
  }, []);

  return (
    <ReviewsContext.Provider value={{ reviews, loading }}>
      {children}
    </ReviewsContext.Provider>
  );
};
