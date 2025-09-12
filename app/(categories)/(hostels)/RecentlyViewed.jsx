import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { getRecentlyViewedHostels } from '../../../utils/recentlyViewedUtils';

const RecentlyViewed = ({ hostels }) => {
  const [recentlyViewedHostels, setRecentlyViewedHostels] = useState([]);
  
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const viewedIds = await getRecentlyViewedHostels();
      const filteredHostels = hostels.filter((hostel) =>
        viewedIds.includes(hostel.id)
      );
      setRecentlyViewedHostels(filteredHostels);
    };

    fetchRecentlyViewed();
  }, [hostels]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {recentlyViewedHostels.length > 0 ? (
        <CardListScreen hostels={recentlyViewedHostels} />
      ) : (
        <Text style={styles.noHostelsText}>No recently viewed hostels.</Text>
      )}
    </View>
  );
};

export default RecentlyViewed;

const styles = StyleSheet.create({
  noHostelsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});
