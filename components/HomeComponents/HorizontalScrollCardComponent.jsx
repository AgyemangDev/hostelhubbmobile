import { View, SafeAreaView, Text } from "react-native";
import HorizontalScrollCardList from "../../components/Cards/HorizontalScroll/HorizontalScrollCardList";
import { useContext } from "react";
import { AccommodationContext } from "../../context/AccommodationContext";

export default function HorizontalScrollCardComponent() {
  const { randomAccommodations, randomLoading } = useContext(AccommodationContext);

  if (randomLoading) {
    return <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>;
  }

  if (!randomAccommodations || randomAccommodations.length === 0) {
    return <Text style={{ textAlign: "center", marginTop: 20 }}>No accommodations available on this campus. </Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HorizontalScrollCardList accommodations={randomAccommodations} loading={randomLoading} />
    </SafeAreaView>
  );
}