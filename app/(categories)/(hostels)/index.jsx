// hostels/index.jsx
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { AccommodationContext } from '../../../context/AccommodationContext';

import AllHostels from './AllHostels';
import PopularHostel from './PopularHostel';
import Homestel from './Homestel';
import LastMinute from './LastMinute';
import RecentlyViewed from './RecentlyViewed';
import TopStays from './TopStays';
import NewHostels from './newHostels';
import TopTabBar from '../../../components/CategoriesComponents/TopTabBar';

const TABS = [
  { key: 'all', label: 'All Hostels' },
  { key: 'justadded', label: 'Just Added' },
  { key: 'homestel', label: 'Homestels' },
  { key: 'popular', label: 'Popular' },
  { key: 'lastminute', label: 'Last Minute' },
];

export default function HostelScreen() {
  const { tab } = useLocalSearchParams();
  const { 
    accommodations, 
    loading, 
    loadMore, 
    hasMore, 
    refresh 
  } = useContext(AccommodationContext);
  
  const [activeTab, setActiveTab] = useState(tab || 'all');

  useEffect(() => {
    if (tab && TABS.find((t) => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'popular':
        return (
          <PopularHostel 
            hostels={accommodations} 
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
            refresh={refresh}
          />
        );
      case 'justadded':
        return (
          <NewHostels 
            hostels={accommodations} 
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
            refresh={refresh}
          />
        );
      case 'lastminute':
        return (
          <LastMinute 
            hostels={accommodations} 
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
            refresh={refresh}
          />
        );
      case 'homestel':
        return (
          <Homestel 
            hostels={accommodations} 
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
            refresh={refresh}
          />
        );
      case 'recent':
        return (
          <RecentlyViewed 
            hostels={accommodations} 
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
            refresh={refresh}
          />
        );
      case 'top':
        return (
          <TopStays 
            hostels={accommodations} 
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
            refresh={refresh}
          />
        );
      default:
        return (
          <AllHostels 
            hostels={accommodations} 
            loading={loading}
            loadMore={loadMore}
            hasMore={hasMore}
            refresh={refresh}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabWrapper}>
        <TopTabBar tabs={TABS} activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabWrapper: {
    paddingTop: 4, 
    paddingBottom: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});