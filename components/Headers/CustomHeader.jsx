import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationBell from './NotificationBell';
import FavoriteIcon from './FavoriteIcon';
import SearchBar from '../SearchComponents/SearchInput';

const CustomHeader = () => {
  const Router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.statusBarSpace} />

      <View style={styles.row}>
        {/* flexible search */}
        <View style={styles.searchWrap}>
          <SearchBar
            placeholder="Search accommodation "
            onPress={() => Router.push('/SearchScreen')}
          />
        </View>

        {/* fixed icons */}
        <View style={styles.iconsContainer}>
<FavoriteIcon onPress={() => Router.push('/Shortlist')} />
<NotificationBell onPress={() => Router.push('/NotificationScreen')} />
        </View>
      </View>
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
    paddingBottom:10
  },

  statusBarSpace: {
    height: Platform.OS === 'ios' ? 0 : 30,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  searchWrap: {
    flex: 1,              // 👈 takes remaining width only
    marginRight: 8,       // 👈 spacing instead of space-between
  },

  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
    justifyContent: 'space-between',
  },
});