// components/video/VideoTimeline.jsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Animated,
  ActivityIndicator,
  Platform
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TIMELINE_WIDTH = SCREEN_WIDTH - 40;
const THUMB_SIZE = 16;

const VideoTimeline = ({ 
  currentTime = 0, 
  duration = 0, 
  onSeek,
  bufferedTime = 0,
  isLoading = false,
  onScrollEnable // Add this prop to communicate with parent
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTime, setDraggedTime] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // Update position when currentTime changes (not during dragging)
  React.useEffect(() => {
    if (!isDragging && duration > 0) {
      const progress = currentTime / duration;
      const newPosition = progress * (TIMELINE_WIDTH - THUMB_SIZE);
      Animated.timing(translateX, {
        toValue: newPosition,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [currentTime, duration, isDragging]);

  // Create PanResponder for thumb dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (event) => {
        setIsDragging(true);
        translateX.setOffset(translateX._value);
        translateX.setValue(0);
        
        // Disable parent scrolling while dragging timeline
        onScrollEnable?.(false);
      },
      
      onPanResponderMove: (event, gesture) => {
        if (duration === 0) return;
        
        const currentOffset = translateX._offset || 0;
        const newX = Math.max(0, Math.min(currentOffset + gesture.dx, TIMELINE_WIDTH - THUMB_SIZE));
        const adjustedDx = newX - currentOffset;
        
        translateX.setValue(adjustedDx);
        
        // Calculate and show the time we're dragging to
        const progress = newX / (TIMELINE_WIDTH - THUMB_SIZE);
        const seekTime = progress * duration;
        setDraggedTime(seekTime);
        
        // Call onSeek immediately for responsive scrubbing
        onSeek?.(seekTime);
      },
      
      onPanResponderRelease: () => {
        translateX.flattenOffset();
        setIsDragging(false);
        setDraggedTime(0);
        
        // Re-enable parent scrolling
        onScrollEnable?.(true);
      },
      
      onPanResponderTerminate: () => {
        translateX.flattenOffset();
        setIsDragging(false);
        setDraggedTime(0);
        
        // Re-enable parent scrolling if gesture is terminated
        onScrollEnable?.(true);
      },
    })
  ).current;

  // Handle tap on timeline track
  const handleTrackPress = (event) => {
    if (duration === 0) return;
    
    const { locationX } = event.nativeEvent;
    const clampedX = Math.max(0, Math.min(locationX, TIMELINE_WIDTH - THUMB_SIZE));
    const progress = clampedX / (TIMELINE_WIDTH - THUMB_SIZE);
    const seekTime = progress * duration;
    
    // Animate thumb to new position
    Animated.timing(translateX, {
      toValue: clampedX,
      duration: 150,
      useNativeDriver: true,
    }).start();
    
    onSeek?.(seekTime);
  };

  const progressWidth = duration > 0 ? (currentTime / duration) * TIMELINE_WIDTH : 0;
  const bufferedWidth = duration > 0 ? (bufferedTime / duration) * TIMELINE_WIDTH : 0;

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const displayTime = isDragging ? draggedTime : currentTime;

  return (
    <>
      {/* Loading indicator - centered on screen */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
      
      {/* Timeline - always visible at bottom */}
      <View style={styles.container}>
        {/* Time display */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(displayTime)} / {formatTime(duration)}
          </Text>
        </View>

        {/* Timeline Track */}
        <TouchableOpacity 
          style={styles.timelineContainer}
          activeOpacity={1}
          onPress={handleTrackPress}
        >
          {/* Background Track */}
          <View style={styles.track} />
          
          {/* Buffered Track */}
          <View style={[styles.bufferedTrack, { width: bufferedWidth }]} />
          
          {/* Progress Track */}
          <View style={[styles.progressTrack, { width: progressWidth }]} />
          
          {/* Draggable Thumb */}
          <Animated.View 
            style={[
              styles.thumb, 
              { 
                backgroundColor: isDragging ? '#FF4444' : '#FF6B6B',
                transform: [
                  { translateX },
                  { scale: isDragging ? 1.2 : 1 }
                ]
              }
            ]}
            {...panResponder.panHandlers}
          />
          
          {/* Invisible larger touch area for thumb */}
          <Animated.View 
            style={[
              styles.thumbTouchArea, 
              { transform: [{ translateX }] }
            ]}
            {...panResponder.panHandlers}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 1000,
  },
  container: {
    position: 'absolute',
    bottom: 40, // Above bottom tabs
    left: 10,
    right: 20,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
     paddingBottom: Platform.OS === 'ios' ? 20 : 5,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: -10,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  timelineContainer: {
    height: 24,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
  },
  bufferedTrack: {
    position: 'absolute',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 1.5,
  },
  progressTrack: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#cc2020ff',
    borderRadius: 1.5,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: '#cc2020ff',
    borderRadius: THUMB_SIZE / 2,
    top: -6.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  thumbTouchArea: {
    position: 'absolute',
    width: 40, // Larger touch area
    height: 40,
    top: -18.5,
    left: -12,
    backgroundColor: 'transparent',
  },
});

export default VideoTimeline;