import { View, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';

import HostelhubbImage from "../../../assets/images/icon.png";

const ImageSection = ({ ImageUrl, setImageLoaded }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
    setImageLoaded?.(true);
  };

  const handleError = (error) => {
    console.log('Image load error:', error?.nativeEvent?.error);
    setImageError(true);
    setLoading(false);
    setImageLoaded?.(true);
  };

  return (
    <View style={styles.imageContainer}>
      {/* Static skeleton placeholder */}
      {loading && <View style={styles.skeleton} />}

      <Image
        source={imageError || !ImageUrl ? HostelhubbImage : { uri: ImageUrl }}
        style={styles.image}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 180,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#e5e5e5",
  },

  image: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e5e5e5",
  },
});

export default ImageSection;