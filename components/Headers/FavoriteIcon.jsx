import React, { useContext } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../../context/UserContext';
import COLORS from '../../constants/Colors';

const FavoriteIcon = ({ onPress }) => {
  const { shortlist } = useContext(UserContext);  // Get the shortlist from context
  const shortlistedCount = shortlist?.length || 0; // Get the number of items in the shortlist

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.wrapper}>
        <Feather name="heart" size={24} color={COLORS.background} />
        {shortlistedCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{shortlistedCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default FavoriteIcon;

const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: '#f8f8f8',
      padding: 8,
      borderRadius: 12,
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: 'red',
      borderRadius: 10,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
    },
  });
  