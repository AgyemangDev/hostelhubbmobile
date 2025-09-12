import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { UserContext } from "../../../../context/UserContext";
import { auth,db } from "../../../firebase/FirebaseConfig";
import COLORS from "../../../../constants/Colors";
import { doc, setDoc, collection } from "firebase/firestore";

export default function PremiumIndex() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const { userInfo } = useContext(UserContext);
  const user = auth.currentUser.uid;

  const access_fee = 30

  const handlePress = (serviceRoute) => {
    if (!userInfo.paymentStatus) {
      if (userInfo.balance < access_fee) {
        Alert.alert(
          "Subscription Required",
          `Your balance is insufficient. You need GHc ${access_fee} to subscribe to Hostelhubb Premium. Please deposit money into your wallet to proceed.`,
          [
            {
              text: "Deposit",
              onPress: () => router.push("/transactions"), // Navigate to the transaction screen
            },
            {
              text: "Cancel",
              style: "cancel", // Keep the alert open unless dismissed
            },
          ]
        );
      } else {
        Alert.alert(
          "Subscribe to Hostelhubb Premium",
          `Subscription costs GHc ${access_fee}. Would you like to proceed?`,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Subscribe Now",
              onPress: async () => {
                setIsLoading(true);
                const newBalance = userInfo.balance - access_fee;
                const transactionId = new Date().getTime();
                const transactionRef = doc(
                  collection(db, "transaction"),
                  transactionId.toString()
                );
  
                try {
                  // Add transaction to database
                  await setDoc(transactionRef, {
                    userId: userInfo.id,
                    amount: access_fee,
                    status: "completed",
                    createdAt: new Date(),
                    method: "HostelHubb Payment",
                    reference: "Premium Access",
                  });
  
                  // Update user balance and payment status
                  const userRef = doc(db, "Student_Users", user);
                  await setDoc(
                    userRef,
                    {
                      balance: newBalance,
                      paymentStatus: true,
                      paymentDate: new Date(),
                    },
                    { merge: true }
                  );
  
                  Alert.alert(
                    "Payment Successful",
                    "Enjoy your bookings. Hostel Bookings Just Got Easier",
                    [{ text: "OK", onPress: () => setIsLoading(false) }]
                  );
  
                  router.push(`/premium/${serviceRoute}`); // Navigate to the premium service
                } catch (error) {
                  console.error(
                    "Error updating transaction or user balance:",
                    error
                  );
                  Alert.alert(
                    "Payment Failed",
                    "Something went wrong while processing your subscription. Please try again."
                  );
                  setIsLoading(false);
                }
              },
            },
          ]
        );
      }
    } else {
      router.push(`/premium/${serviceRoute}`); // Navigate to the premium service if already subscribed
    }
  };
  

  const premiumServices = [
    {
      name: "MovieHubb",
      description:
        "Enjoy the latest movies, shows, and exclusive content right from your device.",
      route: "cinemaplus",
      image:
        "https://img.freepik.com/premium-photo/happy-young-couple-watching-film_13339-301164.jpg?ga=GA1.1.307588626.1711624851&semt=ais_hybrid",
      iconName: "movie-open",
    },
    {
      name: "Services",
      description:
        "Discover premium services curated to enhance your experience. ",
      route: "services",
      image:
        "https://media.licdn.com/dms/image/v2/C4E12AQHICVvwrSFv4A/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1620613215246?e=2147483647&v=beta&t=NZcJ3qs3azgupE3xj-koUSrvdFgBQ7LqvuVzPRZr_iY",
      iconName: "account-cog",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Premium Services</Text>
      {premiumServices.map((service, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => handlePress(service.route)}
        >
          <Image source={{ uri: service.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Icon
                name={service.iconName}
                size={28}
                color={COLORS.background}
                style={styles.icon}
              />
              <Text style={styles.cardTitle}>{service.name}</Text>
            </View>
            <Text style={styles.cardDescription}>{service.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6, // Android shadow
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  cardDescription: {
    fontSize: 16,
    color: "#555",
  },
});
