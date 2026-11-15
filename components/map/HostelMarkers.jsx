import { Marker } from "react-native-maps";
import { Text, View, StyleSheet } from "react-native";

const HostelMarkers = ({ hostels, onMarkerPress }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case "hotel":
        return "#6366F1"; // Indigo
      case "apartment":
        return "#EC4899"; // Pink
      case "guest house":
        return "#10B981"; // Green
      case "homestel":
        return "#F59E0B"; // Amber
      default:
        return "#3B82F6"; // Blue
    }
  };

  return (
    <>
      {hostels.map((hostel) => {
        const color = getCategoryColor(hostel.category);
        const namePreview = hostel.hostelName?.split(" ").slice(0, 2).join(" ");

        return (
          <Marker
            key={hostel.id}
            coordinate={{
              latitude: parseFloat(hostel.latitude),
              longitude: parseFloat(hostel.longitude),
            }}
            title={null}
            description={null}
            onPress={() => onMarkerPress(hostel)}
          >
            <View style={styles.container}>
              {/* Modern Price/Name Bubble */}
              <View style={[styles.bubble, { backgroundColor: color }]}>
                <Text style={styles.text} numberOfLines={1}>
                  {namePreview}
                </Text>
              </View>
              
              {/* Pointer Triangle */}
              <View style={[styles.arrow, { borderTopColor: color }]} />
            </View>
          </Marker>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    maxWidth: 120,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 0,
    borderLeftWidth: 6,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
});

export default HostelMarkers;