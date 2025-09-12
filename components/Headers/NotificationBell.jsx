import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';

const NotificationBell = ({ onPress }) => {
  const unreadCount = 3; // 🔴 Replace this with your dynamic logic

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.wrapper}>
        <Feather name="bell" size={24} color={COLORS.background} />
        {unreadCount > 0 && (
          <View style={styles.dot} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationBell;

const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
    borderRadius: 12,
    position: 'relative',
    backgroundColor: '#f8f8f8',
  },
  dot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});
