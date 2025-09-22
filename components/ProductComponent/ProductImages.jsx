import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

const ProductImages = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const thumbnailScrollRef = useRef(null);

  // Ensure we have images to display
  const displayImages = images.length > 0 ? images : ['https://via.placeholder.com/400x300?text=No+Image'];

  useEffect(() => {
    // Auto-scroll thumbnail to center active item
    if (thumbnailScrollRef.current && displayImages.length > 1) {
      const thumbnailWidth = 80;
      const spacing = 12;
      const centerOffset = (screenWidth / 2) - (thumbnailWidth / 2);
      const scrollOffset = Math.max(0, (activeIndex * (thumbnailWidth + spacing)) - centerOffset);
      
      thumbnailScrollRef.current.scrollTo({
        x: scrollOffset,
        animated: true,
      });
    }
  }, [activeIndex]);

  const handleThumbnailPress = (index) => {
    setActiveIndex(index);
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      const threshold = screenWidth * 0.2;
      
      let newIndex = activeIndex;
      
      if (translationX > threshold || velocityX > 500) {
        // Swipe right - go to previous image
        newIndex = Math.max(0, activeIndex - 1);
      } else if (translationX < -threshold || velocityX < -500) {
        // Swipe left - go to next image
        newIndex = Math.min(displayImages.length - 1, activeIndex + 1);
      }
      
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const handleImageLoad = (index) => {
    setImageLoadStates(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleImageError = (index) => {
    console.warn(`Failed to load image at index ${index}`);
  };

  return (
    <View style={styles.container}>
      {/* Main Image Container */}
      <View style={styles.mainImageContainer}>
        <PanGestureHandler
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={[-20, 20]}
        >
          <View style={styles.mainImageWrapper}>
            <Image
              source={{ uri: displayImages[activeIndex] }}
              style={styles.mainImage}
              resizeMode="cover"
              onLoad={() => handleImageLoad(activeIndex)}
              onError={() => handleImageError(activeIndex)}
            />
            
            {/* Loading placeholder */}
            {!imageLoadStates[activeIndex] && (
              <View style={styles.loadingPlaceholder}>
                <View style={styles.loadingShimmer} />
              </View>
            )}
          </View>
        </PanGestureHandler>
        
        {/* Image Counter */}
        <View style={styles.imageCounter}>
          <View style={styles.counterBackground}>
            <Text style={styles.counterText}>
              {activeIndex + 1} / {displayImages.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Thumbnail Carousel */}
      {displayImages.length > 1 && (
        <View style={styles.thumbnailContainer}>
          <ScrollView
            ref={thumbnailScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailScrollContent}
            decelerationRate="fast"
            snapToInterval={92} // 80 (thumbnail width) + 12 (spacing)
            snapToAlignment="center"
          >
            {displayImages.map((imageUri, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnailWrapper,
                  activeIndex === index && styles.activeThumbnailWrapper
                ]}
                onPress={() => handleThumbnailPress(index)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.thumbnail,
                    activeIndex === index && styles.activeThumbnail
                  ]}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                  
                  {/* Active indicator overlay */}
                  {activeIndex === index && (
                    <View style={styles.activeOverlay}>
                      <View style={styles.activeIndicator} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  mainImageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 7,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mainImageWrapper: {
    flex: 1,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  imageCounter: {
    position: 'absolute',
    top: 260,
    right: 16,
  },
  counterBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailContainer: {
    height: 100,
    marginBottom: 16,
  },
  thumbnailScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  thumbnailWrapper: {
    marginRight: 12,
  },
  activeThumbnailWrapper: {
    transform: [{ scale: 1.1 }],
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeThumbnail: {
    borderColor: '#007AFF',
    borderWidth: 3,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  activeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.2 }],
  },
});

export default ProductImages;