import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import OpenBook3D from "../../assets/icons/open_book.png";
import CloseBook3D from "../../assets/icons/closed_book.png";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DESCRIPTION_LIMIT = 100;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

// "2026-10-13" -> local Date (avoids timezone shifts)
const parseDate = (str) => {
  if (!str) return null;
  const [y, m, d] = String(str).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

// "2026-10-13" -> "13 Oct 2026"
const formatDate = (date) =>
  date ? `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}` : "Not set";

const startOfToday = () => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
};

const daysBetween = (a, b) => Math.round((b - a) / 86400000);

// Small status line under each date, e.g. "In 10 days" / "Today" / "Passed"
const relativeLabel = (date, verb) => {
  if (!date) return "Awaiting dates";
  const diff = daysBetween(startOfToday(), date);
  if (diff === 0) return `${verb} today`;
  if (diff === 1) return `${verb} tomorrow`;
  if (diff > 1) return `In ${diff} days`;
  return "Completed";
};

// 2026-10-13 -> 2027-09-03  =>  "11 mo stay"
const stayLabel = (from, to) => {
  if (!from || !to) return null;
  const days = daysBetween(from, to);
  if (days <= 0) return null;
  if (days < 45) return `${days} days`;
  return `${Math.round(days / 30.4)} months`;
};

// One tile: image icon, label, formatted date, and a status hint
const ScheduleTile = ({ image, title, date, hint, anim }) => (
  <Animated.View
    style={[
      styles.tile,
      {
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }),
          },
          {
            scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }),
          },
        ],
      },
    ]}
  >
    <View style={styles.tileHeader}>
      <Image source={image} style={styles.tileImage} resizeMode="contain" />
      <Text style={styles.tileTitle}>{title}</Text>
    </View>
    <Text style={[styles.tileDate, !date && styles.muted]}>{formatDate(date)}</Text>
    <Text style={styles.tileHint}>{hint}</Text>
  </Animated.View>
);

// moveInImage / moveOutImage: optionally pass require("./assets/open-book-3d.png") etc.
const HostelInfo = ({
  hostel,
  hostelDescription,
  moveInImage,
  moveOutImage,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Entrance: header fades in, then tiles stagger in, then the stay pill pops
  const headerAnim = useRef(new Animated.Value(0)).current;
  const inAnim = useRef(new Animated.Value(0)).current;
  const outAnim = useRef(new Animated.Value(0)).current;
  const pillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 260, easing: ease, useNativeDriver: true }),
      Animated.stagger(90, [
        Animated.timing(inAnim, { toValue: 1, duration: 320, easing: ease, useNativeDriver: true }),
        Animated.timing(outAnim, { toValue: 1, duration: 320, easing: ease, useNativeDriver: true }),
      ]),
      Animated.spring(pillAnim, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
    ]).start();
  }, [headerAnim, inAnim, outAnim, pillAnim]);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  const isLong = hostelDescription?.length > DESCRIPTION_LIMIT;
  const shortDescription = isLong
    ? hostelDescription.slice(0, DESCRIPTION_LIMIT).trimEnd()
    : hostelDescription;

  const category = capitalize(hostel?.category) || "Accommodation";
  const location = hostel?.location || "an unknown location";
  const schedule = hostel?.accommodation_schedule;

  const moveIn = parseDate(schedule?.move_in_date);
  const moveOut = parseDate(schedule?.move_out_date);
  const stay = stayLabel(moveIn, moveOut);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            { translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) },
          ],
        }}
      >
        <Text style={styles.title}>
          {hostel?.accommodation_name || "Hostel Name"}
        </Text>
        <Text style={styles.subtitle}>
          {category} at {location}
        </Text>
      </Animated.View>

      <View style={styles.divider} />

      {/* Move-in / Move-out */}
      {schedule ? (
        <View>
          <View style={styles.tileRow}>
            <ScheduleTile
              image={moveInImage || OpenBook3D}
              title="Move-in"
              date={moveIn}
              hint={relativeLabel(moveIn, "Move in")}
              anim={inAnim}
            />
            <ScheduleTile
              image={moveOutImage || CloseBook3D}
              title="Move-out"
              date={moveOut}
              hint={relativeLabel(moveOut, "Move out")}
              anim={outAnim}
            />
          </View>

          {/* Stay length sits below the tiles, joined by a line, so it never covers a date */}
          {stay && (
            <Animated.View
              style={[
                styles.stayRow,
                {
                  opacity: pillAnim,
                  transform: [
                    { scaleX: pillAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                  ],
                },
              ]}
            >
              <View style={styles.stayLine} />
              <Text style={styles.stayText}>{stay} stay</Text>
              <View style={styles.stayLine} />
            </Animated.View>
          )}
        </View>
      ) : (
        <Text style={styles.scheduleMissing}>
          Move-in and move-out dates haven't been set for this institution yet.
        </Text>
      )}

      <View style={styles.divider} />

      {/* Description */}
      <Text style={styles.description}>
        {expanded ? hostelDescription : shortDescription}
        {!expanded && isLong && "..."}
      </Text>

      {isLong && (
        <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.6} hitSlop={8}>
          <Text style={styles.showMore}>
            {expanded ? "Show less" : "Show more"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  title: {
    fontSize: 21,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: "#6A6A6A",
    fontWeight: "400",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#DDDDDD",
    marginVertical: 14,
  },
  tileRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  tile: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFA",
    marginHorizontal: 4,
  },
  tileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tileImage: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#484848",
  },
  tileDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 2,
  },
  tileHint: {
    fontSize: 12,
    color: "#8A8A8A",
  },
  muted: {
    color: "#A0A0A0",
  },
  stayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 4,
  },
  stayLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#D0D0D0",
  },
  stayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6A6A6A",
    marginHorizontal: 10,
  },
  scheduleMissing: {
    fontSize: 13,
    lineHeight: 18,
    color: "#717171",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#484848",
    marginBottom: 8,
  },
  showMore: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222222",
    textDecorationLine: "underline",
  },
});

export default HostelInfo;