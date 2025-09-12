import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import VideoControls from './VideoControls';
import VideoTimeline from './VideoTimeline';
import { useIsFocused } from '@react-navigation/native';

// Custom hook to store previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const VideoPlayer = ({ videoUrl, isActive }) => {
  const isFocused = useIsFocused();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [justPaused, setJustPaused] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSeekTime, setLastSeekTime] = useState(null);

  const prevIsActive = usePrevious(isActive);

  // 🔁 Restart video when it becomes active
  useEffect(() => {
    if (isActive && !prevIsActive && videoRef.current) {
      videoRef.current.setPositionAsync(0); // restart
      videoRef.current.playAsync(); // auto play
      setIsPlaying(true);
    }
  }, [isActive, prevIsActive]);

  // 🔄 Sync play/pause with isActive
  useEffect(() => {
    if (isActive && isFocused && videoRef.current) {
      videoRef.current.playAsync();
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }, [isActive, isFocused]);

  const handlePlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) {
      setIsLoading(true);
      return;
    }

    const newCurrentTime = status.positionMillis / 1000;
    const newDuration = status.durationMillis / 1000;
    const newBufferedTime = (status.playableDurationMillis || 0) / 1000;

    setCurrentTime(newCurrentTime);
    setDuration(newDuration);
    setBufferedTime(newBufferedTime);
    setIsPlaying(status.isPlaying);

    if (status.isBuffering) {
      setIsLoading(true);
    } else if (lastSeekTime !== null && Math.abs(newCurrentTime - lastSeekTime) > 1) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setLastSeekTime(null);
    }
  };

  const handleVideoPress = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
      setIsPlaying(false);
      setJustPaused(true);
    } else {
      await videoRef.current?.playAsync();
      setIsPlaying(true);
      setJustPaused(false);
    }
  };

  const handleSeek = async (seekTime) => {
    setLastSeekTime(seekTime);
    setIsLoading(true);
    try {
      await videoRef.current?.setPositionAsync(seekTime * 1000);
      setTimeout(() => {
        if (lastSeekTime === seekTime) {
          setIsLoading(false);
          setLastSeekTime(null);
        }
      }, 1000);
    } catch (error) {
      console.error('Seek error:', error);
      setIsLoading(false);
      setLastSeekTime(null);
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleVideoPress}>
      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={isActive}
          isLooping
          isMuted={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          progressUpdateIntervalMillis={100}
        />
      </View>

      <VideoControls isPlaying={isPlaying} justPaused={justPaused} />

      <VideoTimeline
        currentTime={currentTime}
        duration={duration}
        bufferedTime={bufferedTime}
        onSeek={handleSeek}
        isLoading={isLoading}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayer;
