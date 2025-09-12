import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import HeaderTextBlock from './HeaderTextBlock';
import NotificationBell from './NotificationBell';
import FavoriteIcon from './FavoriteIcon'; // Importing the FavoriteIcon component
import SearchBar from './SearchBar';

const CustomHeader = () => {
  const navigation = useNavigation();

  const handleNotificationPress = () => {
    navigation.navigate("NotificationScreen");
  };

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen');
  };

  const handleFavoritePress = () => {
    navigation.navigate('(shortlist)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusBarSpace} />
      <View style={styles.row}>
        {/* Welcome text on the left */}
        <HeaderTextBlock />
        
        <View style={styles.iconsContainer}>
          <FavoriteIcon onPress={handleFavoritePress} />
          <NotificationBell onPress={handleNotificationPress} />
        </View>
      </View>
      
      <SearchBar onPress={handleSearchPress} />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  statusBarSpace: {
    height: Platform.OS === 'ios' ? 0 : 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 90, 
    gap:2
  },
});
