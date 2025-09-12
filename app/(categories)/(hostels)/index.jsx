// hostels/index.jsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useHostels } from '../../../context/HostelsContext';

import AllHostels from './AllHostels';
import PopularHostel from './PopularHostel';
import LastMinute from './LastMinute';
import RecentlyViewed from './RecentlyViewed';
import TopStays from './TopStays';
import NewHostels from './newHostels';
import TopTabBar from '../../../components/CategoriesComponents/TopTabBar';

const TABS = [
  { key: 'all', label: 'All Hostels' },
  { key: 'justadded', label: 'Just Added' },
  { key: 'popular', label: 'Popular' },
  { key: 'lastminute', label: 'Last Minute' },
  { key: 'recent', label: 'Recently Viewed' },
];

export default function HostelScreen() {
  const { tab } = useLocalSearchParams();
    const { hostels, loading } = useHostels();
  const [activeTab, setActiveTab] = useState(tab || 'all');

const filteredHostels = hostels.filter(
  (item) =>
    !item.category || item.category?.toLowerCase() === 'hostel'
);
  useEffect(() => {
    if (tab && TABS.find((t) => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'popular':
        return <PopularHostel hostels={filteredHostels} />;
      case 'justadded':
        return <NewHostels hostels={filteredHostels} />;
      case 'lastminute':
        return <LastMinute hostels={filteredHostels} />;
      case 'recent':
        return <RecentlyViewed hostels={filteredHostels} />;
      case 'top':
        return <TopStays hostels={filteredHostels} />;
      default:
        return <AllHostels hostels={filteredHostels} />;
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
