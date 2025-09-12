import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENTLY_VIEWED_KEY = 'RecentlyViewedHostels';
const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // expire after 7 weeks

/**
 * Adds a hostelId to recently viewed with a timestamp, ensuring no duplicates.
 */
export const addRecentlyViewedHostel = async (hostelId) => {
  try {
    const json = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    const currentIds = json ? JSON.parse(json) : [];

    // Remove expired hostels
    const validIds = currentIds.filter(item => {
      const timeDifference = new Date().getTime() - item.timestamp;
      return timeDifference < EXPIRY_TIME;
    });

    // Add the new hostel with the current timestamp
    validIds.push({ id: hostelId, timestamp: new Date().getTime() });

    await AsyncStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(validIds));
  } catch (error) {
    console.error('Failed to add recently viewed hostel:', error);
  }
};

/**
 * Returns the array of recently viewed hostel IDs, removing expired ones.
 */
export const getRecentlyViewedHostels = async () => {
  try {
    const json = await AsyncStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!json) return [];

    const currentIds = JSON.parse(json);

    // Filter out expired hostels
    const validIds = currentIds.filter(item => {
      const timeDifference = new Date().getTime() - item.timestamp;
      return timeDifference < EXPIRY_TIME;
    });

    await AsyncStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(validIds));
    return validIds.map(item => item.id); // Return only IDs
  } catch (error) {
    console.error('Failed to get recently viewed hostels:', error);
    return [];
  }
};
