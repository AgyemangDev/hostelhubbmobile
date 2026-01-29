import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import COLORS from "../../constants/Colors";
import Button from "../../components/ButtonComponents/ButtonComponent";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Find Your Perfect Accommodation",
    description:
      "Discover comfortable, affordable hostels near your campus with all the amenities you need.",
    image: require("../../assets/images/Building.gif"),
  },
  {
    id: "2",
    title: "Store with Ease",
    description:
      "Securely store your items during breaks with Hostelhubb's trusted Storage System.",
    image: require("../../assets/images/Storage.gif"),
  },
  {
    id: "3",
    title: "Shop Student Essentials",
    description:
      "Get all your student must-haves from verified sellers right within the app.",
    image: require("../../assets/images/Shopping.gif"),
  },
  {
    id: "4",
    title: "Travel Between Cities",
    description:
      "Book intercity trips during vacation and resumption easily and stay connected wherever you go.",
    image: require("../../assets/images/Bus.gif"),
  },
];

const FirstWelcomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push("/WelcomeScreen");
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={slidesRef}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Pagination */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Full-width Button with spacing */}
      <View style={styles.buttonWrapper}>
        <Button
          buttonText={currentIndex === slides.length - 1 ? "Sign Up" : "Next"}
          onPressFunction={handleNext}
        />
      </View>
    </View>
  );
};

export default FirstWelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.background,
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.textMuted,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.placeholder,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: COLORS.background,
  },
  buttonWrapper: {
    paddingHorizontal: 24, 
    marginTop: 24,
    marginBottom: 32,
  },
});
