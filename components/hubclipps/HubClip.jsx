import React, { useRef, useEffect, useContext } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { AddHubclippsContext } from "../../context/AddHubclippsContext";
import { handleBookingProcess } from "../../services/bookingServices";
import { UserContext } from "../../context/UserContext";
import { useRouter } from "expo-router";

import VideoPlayer from "./VideoPlayer";
import RightActions from "./RightActions";
import LeftInfo from "./LeftInfo";
import ReservationButton from "./ReservationButton";

export default function HubClip({ item, height, isActive }) {

  const router = useRouter();
  const playerRef = useRef(null);
  const isFocused = useIsFocused();
  const { incrementView } = useContext(AddHubclippsContext);

  const { user, userInfo, patchUserData, currentExpoToken } =
  useContext(UserContext);

  const viewTimerRef = useRef(null);
  const hasCountedViewRef = useRef(false);

  useEffect(() => {
    if (!playerRef.current) return;

    if (isActive && isFocused) {
      playerRef.current.play();

      // ⏱️ Start view timer
      if (!hasCountedViewRef.current) {
        viewTimerRef.current = setTimeout(() => {
          incrementView(item.id);
          hasCountedViewRef.current = true;
        }, 5000); // 10 seconds
      }

    } else {
      // Pause + reset playback
      playerRef.current.pause();
      playerRef.current.currentTime = 0;

      // ❌ Cancel timer if user scrolls away
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current);
        viewTimerRef.current = null;
      }
    }

    return () => {
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current);
        viewTimerRef.current = null;
      }
    };
  }, [isActive, isFocused, item.id, incrementView]);

  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 83 : 60;

const handleReserve = async () => {
  try {
    // ✅ Get fresh Firebase token inside async function
    const firebaseToken = await user.getIdToken(true);

    await handleBookingProcess({
      user,
      userInfo,
      formData: {
        selectedRoomType: item.room_type,
        selectedPayment: item.price,
      },
      hostelId: item.id,
      bookingSource: "hubclip",
      router,
      patchUserData,
      currentExpoToken,
      firebaseToken, // 👈 pass it here
      onSuccess: () => router.push("/bookings"),
      onError: () => {},
    });
  } catch (err) {
    console.error("Booking failed:", err);
  }
};

  return (
    <View style={[styles.container, { height }]}>
      <VideoPlayer
        uri={item.video_url}
        onPlayerReady={(player) => {
          playerRef.current = player;
        }}
      />

      <View style={styles.overlay}>
        <LeftInfo item={item} />
        <RightActions
          frontImage={item.front_image_url}
          views={item.views}
        />
      </View>

      <View style={[styles.bottom, { bottom: TAB_BAR_HEIGHT + 10 }]}>
       <ReservationButton onPress={handleReserve}price={item.price}/>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
  },
  overlay: {
    position: "absolute",
    bottom: 170,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  bottom: {
    position: "absolute",
    left: 15,
    right: 15,
  },
});