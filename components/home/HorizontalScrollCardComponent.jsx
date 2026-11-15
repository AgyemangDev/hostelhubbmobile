import React, { useContext, useMemo } from "react";
import { View } from "react-native";
import HorizontalScrollCardList from "../accommodation/cards/HorizontalScrollCardList";
import { AccommodationContext } from "../../context/AccommodationContext";
import EmptyHostelShimmer from "../accommodation/cards/EmptyHostelShimmer";
import { EmptyState } from "../ui/ds";

const LABEL = { hostel: "hostels", homestel: "homestels", apartment: "apartments" };

export default function HorizontalScrollCardComponent({ category = "all" }) {
  const { randomAccommodations, randomLoading } = useContext(AccommodationContext);

  const list = useMemo(() => {
    if (!randomAccommodations) return [];
    if (category === "all") return randomAccommodations;
    return randomAccommodations.filter((a) => String(a.category || "").toLowerCase() === category);
  }, [randomAccommodations, category]);

  if (randomLoading) return <EmptyHostelShimmer />;

  if (list.length === 0) {
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
        <EmptyState
          icon="home-outline"
          title={category === "all" ? "No places here yet" : `No ${LABEL[category]} here yet`}
          body="New places are added every week. Try another category or search all schools."
        />
      </View>
    );
  }

  return <HorizontalScrollCardList accommodations={list} />;
}
