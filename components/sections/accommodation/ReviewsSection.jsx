import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Icon, Section, StatusPill, Text } from "../../ui";
import studentHub from "../../../services/studentHub";
import { colors, radius, space } from "../../../constants/theme";

const date = (iso) => new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

/**
 * Verified badge, rating summary and the latest reviews from students who
 * paid for a room here, with the hostel's replies.
 */
export default function ReviewsSection({ accommodationId, verified }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    studentHub.trust(accommodationId).then((d) => alive && setData(d)).catch(() => {});
    return () => { alive = false; };
  }, [accommodationId]);

  const isVerified = data?.is_verified ?? verified;
  if (!data && !isVerified) return null;

  return (
    <Section title="Reviews" style={styles.section}>
      {isVerified ? (
        <View style={styles.verified}>
          <Icon name="shield-checkmark" size={20} tone="brand" />
          <View style={styles.flex}>
            <Text variant="bodyStrong">Verified by HostelHubb</Text>
            <Text variant="caption" tone="secondary">The owner's ID and right to let this property were checked.</Text>
          </View>
        </View>
      ) : null}

      {data?.rating_count ? (
        <View style={styles.summary}>
          <Text variant="display">{Number(data.rating_average).toFixed(1)}</Text>
          <View>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((n) => <Icon key={n} name={n <= Math.round(data.rating_average) ? "star" : "star-outline"} size={16} />)}
            </View>
            <Text variant="caption" tone="secondary">{data.rating_count} review{data.rating_count === 1 ? "" : "s"} from residents</Text>
          </View>
        </View>
      ) : data ? <Text tone="secondary">No reviews yet. Residents can review after paying for a room.</Text> : null}

      {data?.reviews?.map((r) => (
        <Card key={r.id} style={styles.card}>
          <View style={styles.head}>
            <Text variant="bodyStrong" style={styles.flex}>{r.author}</Text>
            <View style={styles.stars}>{[1, 2, 3, 4, 5].map((n) => <Icon key={n} name={n <= r.rating ? "star" : "star-outline"} size={12} />)}</View>
          </View>
          <Text variant="caption" tone="secondary">{date(r.created_at)}</Text>
          {r.comment ? <Text>{r.comment}</Text> : null}
          {r.owner_reply ? (
            <View style={styles.reply}>
              <StatusPill label="Reply from the hostel" tone="neutral" />
              <Text variant="caption">{r.owner_reply}</Text>
            </View>
          ) : null}
        </Card>
      ))}
    </Section>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: space.lg },
  verified: { flexDirection: "row", gap: space.sm, padding: space.sm, borderRadius: radius.md, backgroundColor: colors.brandSoft, alignItems: "center" },
  flex: { flex: 1 },
  summary: { flexDirection: "row", alignItems: "center", gap: space.sm },
  stars: { flexDirection: "row", gap: 1 },
  card: { gap: 4 },
  head: { flexDirection: "row", alignItems: "center" },
  reply: { backgroundColor: colors.fill, borderRadius: radius.md, padding: space.sm, gap: 4, marginTop: 4 },
});
