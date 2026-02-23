import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/Colors';
import { UserContext } from '../../context/UserContext';

const HeaderTextBlock = () => {
  const { userInfo } = useContext(UserContext);
  const balance = userInfo?.balance || 0.00;
  const router = useRouter();
 
  const handlePress = () => {
    router.push('/transactions'); // Navigate to transactions screen
  };
 
  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.contentWrapper}>
        {/* Money Icon/Image */}
        <View style={styles.iconContainer}>
          <Text style={styles.moneyIcon}>💰</Text>
        </View>
        
        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.priceText}>GHC {balance.toFixed(2)}</Text>
          <Text style={styles.welcomeText}>Tap to deposit</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default HeaderTextBlock;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    height: 50,
    width:140,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moneyIcon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '400',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
});