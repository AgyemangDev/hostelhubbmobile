import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  Platform 
} from 'react-native';
import AllBookings from './AllBookings'; 
import PaidBookings from './PaidBookings'; 

const Index = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <View style={styles.container}>
      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'all' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'all' && styles.activeTabText
          ]}>
            All Bookings
          </Text>
          {activeTab === 'all' && <View style={styles.indicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'paid' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('paid')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'paid' && styles.activeTabText
          ]}>
            Paid Bookings
          </Text>
          {activeTab === 'paid' && <View style={styles.indicator} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'all' ? (
          <AllBookings navigation={navigation} />
        ) : (
          <PaidBookings navigation={navigation} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 30,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTabButton: {
    // Optional: add background color change if desired
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495e',
    opacity: 0.6,
  },
  activeTabText: {
    color: '#34495e',
    opacity: 1,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#e74c3c',
  },
  content: {
    flex: 1,
  },
});

export default Index;