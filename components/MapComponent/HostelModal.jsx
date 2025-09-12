import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HostelModal = ({ hostel, onClose, onDirectMe, showStopDirectionsButton, onStopDirections }) => {
  const router = useRouter();
  const hostelId = hostel.id;
  
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modal}>
        {/* Image with gradient overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: hostel.frontImage }} 
            style={styles.image} 
            resizeMode="cover" 
          />
          <View style={styles.imageOverlay} />
          <Text style={styles.hostelName}>{hostel.hostelName}</Text>
        </View>
        
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={22} color="#333" />
        </TouchableOpacity>
        
        {/* Content area */}
        <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, showStopDirectionsButton ? styles.stopButton : styles.directButton]}
              onPress={showStopDirectionsButton ? onStopDirections : onDirectMe}
            >
              <MaterialIcons
                name={showStopDirectionsButton ? "cancel" : "directions"}
                size={20}
                color="white"
              />
              <Text style={styles.buttonText}>
                {showStopDirectionsButton ? "Stop" : "Direct Me"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.detailsButton]} 
              onPress={() => router.push({
                pathname: '/(Details)/[id]', // The dynamic route pattern
                params: { hostelId: hostelId }, // Pass the hostelId as a query parameter
              })}
            >
              <MaterialIcons name="info-outline" size={20} color="white" />
              <Text style={styles.buttonText}>View More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "32%",
    backgroundColor: "transparent",
  },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    height: "100%",
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  hostelName: {
    position: "absolute",
    bottom: 20,
    left: 20,
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  contentContainer: {
    padding: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  directButton: {
    backgroundColor: "#4F46E5",
  },
  stopButton: {
    backgroundColor: "#EF4444",
  },
  detailsButton: {
    backgroundColor: "#18181B",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default HostelModal;