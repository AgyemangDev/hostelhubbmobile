import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import NotificationItem from "../components/NotificationComponent/NotificationItem";
import EmptyState from "../components/NotificationComponent/EmptyState";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  // Original notifications data
  const originalNotifications = [
    {
      id: "3",
      type: "warning",
      title: "⚠️ Scam Alert – Stay Protected",
      message:
        "Avoid paying random people from WhatsApp groups! Many students have been scammed by fake agents. Only use verified Hostelhubb agents who are trained to help you find genuine, affordable hostels — safely.",
      time: "Today",
      read: false,
    },
    {
      id: "1",
      type: "info",
      title: "📢 Stay Updated – Join Our WhatsApp Channel",
      message:
        "Be the first to hear about new hostels, exclusive offers, and important updates. Tap to join our official WhatsApp Channel: https://www.whatsapp.com/channel/0029VavI8Yv5fM5e7ydw7i1W",
      time: "Just now",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "One-Time Access Fee – Unlock Unlimited Bookings!",
      message:
        "Every student gets one-time free access to book a hostel through our platform. To continue enjoying unlimited bookings for 6 months, support HostelHubb with just GHC 30. Your contribution helps us keep the service running smoothly and scam-free for everyone.",
      time: "Today",
      read: false,
    },
    {
      id: "5",
      type: "warning",
      title: "Always Pay Through Official Channels",
      message:
        "To secure your booking, always pay through our app directly to the hostel manager or via our bank account: NAG HOSTELHUBB, GT Bank, 3302001049665. Contact Hostelhubb for support if unsure.",
      time: "Today",
      read: false,
    },
    {
      id: "6",
      type: "info",
      title: "Book Your Hostel Safely with Hostelhubb",
      message:
        "Hostelhubb helps you book your hostel. Book through our platform online or offline by contacting our receptionist on our official WhatsApp channel. Don't pay money directly into any MoMo account.",
      time: "Today",
      read: false,
    },
    {
      id: "4",
      type: "info",
      title: "🤝 Verified Hostel Agents At Your Service",
      message:
        "Our certified agents are here to help you find your preferred and budget-friendly accommodation on or near campus. Fast, affordable, and 100% legit — no risk of being duped.",
      time: "Few minutes ago",
      read: false,
    },
    {
      id: "7",
      type: "info",
      title: "🛒 Shop Now at Hostelhubb",
      message:
        "Shop now on Hostelhubb and have it delivered to you — no stress!",
      time: "Just now",
      read: false,
    },
    {
      id: "8",
      type: "info",
      title: "🚌 Transport Coming Soon",
      message:
        "Transport upcoming! We are introducing transport to take you home on vacations and bring you back to school with no stress on your end.",
      time: "Just now",
      read: false,
    },
  ];

  // Shuffle function using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array]; // Create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Randomize notifications on component mount
  useEffect(() => {
    const randomizedNotifications = shuffleArray(originalNotifications);
    setNotifications(randomizedNotifications);
  }, []);

  const handleNotificationPress = (item) => {
    // Optionally handle press
  };

  // Function to re-randomize (you can call this if needed)
  const reshuffleNotifications = () => {
    const randomizedNotifications = shuffleArray(originalNotifications);
    setNotifications(randomizedNotifications);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleNotificationPress} />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 48,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
});

export default NotificationsScreen;