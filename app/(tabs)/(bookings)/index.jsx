import React, { useState } from 'react';
import { Dimensions, StyleSheet, StatusBar, Platform } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AllBookings from './AllBookings'; 
import PaidBookings from './PaidBookings'; 

const Index = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'All Bookings' },
    { key: 'paid', title: 'Paid Bookings' },
  ]);

  const renderScene = SceneMap({
    all: () => <AllBookings navigation={navigation} />,
    paid: () => <PaidBookings navigation={navigation} />,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={(props) => (
        <TabBar
          indicatorStyle={{ backgroundColor: '#e74c3c' }}
          style={{ backgroundColor: '#ffffff' }}
          labelStyle={{ color: '#34495e', fontWeight: 'bold' }}
          navigationState={props.navigationState}
          position={props.position}
          jumpTo={(key) => {
            props.jumpTo(key);
          }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 30,
  },
});

export default Index;
