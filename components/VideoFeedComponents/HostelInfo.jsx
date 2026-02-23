import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapPin, Eye, Heart } from 'lucide-react-native';
import { FontAwesome, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { formatPrice } from '../../utils/helpers';
import BookingButton from './BookingButton';

const HostelInfo = ({ hostel, onBookNow }) => {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const storageKey = `liked-${hostel.id || hostel.frontImage}`; // Use unique ID or fallback

  useEffect(() => {
    const checkLiked = async () => {
      const storedLike = await AsyncStorage.getItem(storageKey);
      setLiked(storedLike === 'true');
    };
    checkLiked();
  }, []);

  const toggleLike = async () => {
    const newState = !liked;
    setLiked(newState);
    await AsyncStorage.setItem(storageKey, newState.toString());
  };

  return (
    <View style={styles.container}>
      {/* Main content area with fixed positions */}
      <View style={styles.contentWrapper}>
        {/* Left side content - TikTok style */}
        <View style={styles.leftContent}>
          <Text style={styles.roomType}>{hostel.roomType}</Text>
          
          {hostel.roomDescription && (
            <TouchableOpacity onPress={() => setExpanded(prev => !prev)} activeOpacity={0.7}>
              <Text
                style={styles.roomDescription}
                numberOfLines={expanded ? undefined : 3}
              >
                {hostel.roomDescription}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.locationRow}>
  <Feather name="map-pin" size={14} color="#FF6B6B" />
  <Text style={styles.locationText}>
    {hostel.location?.address || 'Unknown'}{hostel.institution ? ` - ${hostel.institution}` : ''}
  </Text>
</View>
        </View>

        {/* Right side - Fixed distance from bottom */}
        {hostel.frontImage && (
          <View style={styles.rightContent}>
            <View style={styles.rightContentInner}>
              <Image source={{ uri: hostel.frontImage }} style={styles.circleImage} />
              <TouchableOpacity onPress={toggleLike} style={styles.heartIcon}>
                <FontAwesome
                  name="heart"
                  size={30}
                  color={liked ? '#FF4D4D' : '#aaa'}
                  solid={liked}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Bottom section with price and button - equal spacing */}
      <View style={styles.bottomSection}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Available At</Text>
          <Text style={styles.price}>
            {formatPrice(hostel.price)}<Text style={styles.perYear}>/year</Text>
          </Text>
        </View>
        
        <View style={styles.buttonSection}>
          <BookingButton onPress={onBookNow} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 0,
    minHeight: 150, 
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  leftContent: {
    flex: 1,
    paddingRight: 80, 
    justifyContent: 'flex-start',
  },
  rightContent: {
    position: 'absolute',
    right: 0,
    bottom: 10, // Fixed distance from bottom (equivalent to your 5cm from button)
    width: 70,
    alignItems: 'center',
  },
  rightContentInner: {
    alignItems: 'center',
  },
  roomType: {
    color: '#E5E5E5',
    fontSize: 16, // Slightly larger like TikTok
    marginBottom: 4,
    fontWeight: '600',
    opacity: 0.95,
  },
  roomDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.9,
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  circleImage: {
    width: 50, // Slightly larger
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  heartIcon: {
    marginTop: 12,
    alignItems: 'center',
    // Removed marginBottom to prevent layout shifts
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    flexWrap: 'wrap',
  },
  locationText: {
    color: '#cc2020ff',
    fontSize: 13.5,
    marginLeft: 6,
    fontWeight: '500',
    flexShrink: 1,
    flex: 1,
  },
  // Bottom section with equal spacing
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 0,
  },
  priceSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  buttonSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  priceLabel: {
    color: '#B0B0B0',
    fontSize: 11,
    marginBottom: 2,
  },
  price: {
    color: '#4ADE80',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  perYear: {
    fontSize: 12,
    color: '#B0B0B0',
  },
});

export default HostelInfo;