import React, { useState, useContext } from "react";
import { TouchableOpacity, Text, Modal, ActivityIndicator, View } from "react-native";
import { UserContext } from "../../context/UserContext";
import ClientLogIn from "../../app/(Client)/ClientLogIn";

export default function ReservationButton({ onPress, price, onBookingComplete }) {
  const total = Math.round(price * 1.05);
  const formatted = total.toLocaleString("en-GH");
  const { user, userInfo } = useContext(UserContext);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (!user || !userInfo) {
      setShowAuth(true);
      return;
    }
    setLoading(true);
    try {
      await onPress();
      // Notify parent that booking completed so it can refresh user data
      await onBookingComplete?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#ff7a93" : "#ff385c",
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#ff385c",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={{ color: "white", fontWeight: "700", fontSize: 18, letterSpacing: 0.1 }}>
              Reservation in progress...
            </Text>
          </View>
        ) : (
          <Text style={{ color: "white", fontWeight: "700", fontSize: 18, letterSpacing: 0.1 }}>
            GHS {formatted} · Make Reservation
          </Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={showAuth}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAuth(false)}
      >
        <ClientLogIn onClose={() => setShowAuth(false)} />
      </Modal>
    </>
  );
}