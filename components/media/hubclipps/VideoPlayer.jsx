import React, { useRef, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useIsFocused } from "@react-navigation/native"; // 👈

export default function VideoPlayer({ uri, onLike, isActive, onPlayerReady }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = false;
  });

  const lastTap = useRef(0);

  // ✅ detect if this screen/component is in focus
  const isFocused = useIsFocused();

  // Expose player to parent
  useEffect(() => {
    onPlayerReady?.(player);
  }, [player]);

  // Play / pause based on scroll focus AND component focus
  useEffect(() => {
    if (isActive && isFocused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isFocused]);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) onLike?.();
    lastTap.current = now;
  };

  return (
    <Pressable onPress={handleTap} style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});