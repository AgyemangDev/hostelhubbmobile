import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import HostelhubbImage from "../../../assets/images/icon.png";

const ImageSection = ({ ImageUrl, setImageLoaded, availability }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.imageContainer}>
      {loading && <View style={styles.skeleton} />}
      <Image
        source={imageError || !ImageUrl ? HostelhubbImage : { uri: ImageUrl }}
        style={styles.image}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => { setLoading(false); setImageLoaded?.(true); }}
        onError={() => { setImageError(true); setLoading(false); setImageLoaded?.(true); }}
        resizeMode="cover"
      />
      <View style={[styles.badge, availability ? styles.badgeAvailable : styles.badgeUnavailable]}>
        <Text style={[styles.badgeText, availability ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
          {availability ? 'Available' : 'Unavailable'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
    backgroundColor: '#e5e5e5',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e5e5e5',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeAvailable: {
    backgroundColor: 'rgba(15, 110, 86, 0.88)',
  },
  badgeUnavailable: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  badgeTextAvailable: {
    color: '#9FE1CB',
  },
  badgeTextUnavailable: {
    color: '#e0e0e0',
  },
});

export default ImageSection;