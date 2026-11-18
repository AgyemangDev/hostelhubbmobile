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
import { Tabs } from "../../../components/ui";
import { colors } from "../../../constants/theme";

const TABS = [
  { key: 'all', label: 'All Hostels', icon: 'home-outline' },
  { key: 'justadded', label: 'Just Added', icon: 'sparkles-outline' },
  { key: 'homestel', label: 'Homestels', icon: 'bed-outline' },
  { key: 'popular', label: 'Popular', icon: 'star-outline' },
  { key: 'lastminute', label: 'Last Minute', icon: 'time-outline' },
];
const TAB_OPTIONS = TABS.map((t) => ({ value: t.key, label: t.label, icon: t.icon }));

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
        <Tabs variant="pill" scroll options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} contentStyle={{ paddingHorizontal: 16 }} />
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
    backgroundColor: colors.surface,
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