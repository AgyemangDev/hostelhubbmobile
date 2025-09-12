// ImageSection.js
import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import HostelhubbImage from "../../../assets/images/icon.png";

const ImageSection = ({ ImageUrl, setImageLoaded }) => {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={ImageUrl}
        style={styles.image}
        defaultSource={HostelhubbImage}
        onLoad={() => setImageLoaded(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 180,
    width: "100%",
    position: "relative",
  },
  image: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export default ImageSection;