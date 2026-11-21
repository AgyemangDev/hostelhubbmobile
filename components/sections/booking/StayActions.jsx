import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Card, ListRow, Rating } from "../../ui";
import RateStaySheet from "../../sheets/booking/RateStaySheet";
import studentHub from "../../../services/studentHub";
import { space } from "../../../constants/theme";

/**
 * After paying: report a problem to the hostel, see reported problems,
 * and rate the stay. Shown on a paid room booking.
 */
export default function StayActions({ bookingId, hostelName }) {
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(false);

  useEffect(() => {
    studentHub.myReviews().then(({ reviews }) => setReview(reviews.find((r) => r.booking_id === bookingId) || null)).catch(() => {});
  }, [bookingId]);

  return (
    <View style={styles.wrap}>
      <Card padded={false}>
        <ListRow
          title="Report a problem"
          subtitle="Repairs, water, power, security. The hostel is notified."
          icon="construct-outline"
          onPress={() => router.push({ pathname: "/complaints/new", params: { bookingId, hostel: hostelName } })}
          style={styles.row}
        />
        <ListRow title="Problems I've reported" icon="chatbubbles-outline" onPress={() => router.push("/complaints")} style={styles.row} />
        <ListRow
          title={review ? "Your review" : "Rate your stay"}
          subtitle={review ? (review.owner_reply ? "The hostel replied" : "Tap to edit") : "Help other students choose"}
          icon="star-outline"
          right={review ? <Rating value={review.rating} /> : undefined}
          last
          onPress={() => setRating(true)}
          style={styles.row}
        />
      </Card>
      <RateStaySheet visible={rating} onClose={() => setRating(false)} bookingId={bookingId} hostelName={hostelName} existing={review} onSaved={setReview} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: space.md },
  // Long-hand: ListRow's own paddingLeft/Right would override paddingHorizontal.
  row: { paddingLeft: space.md, paddingRight: space.md },
});
