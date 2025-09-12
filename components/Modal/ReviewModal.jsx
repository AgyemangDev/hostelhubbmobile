import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Linking, 
  Platform, 
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons";
import * as StoreReview from "expo-store-review";
import COLORS from "../../constants/Colors";

// Replace with your actual app store URLs
const IOS_APP_STORE_URL = "https://apps.apple.com/us/app/hostelhubb/id6738483533";
const ANDROID_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.Hostelhubb.Hostelhubb";

const CustomStarRating = ({ rating, onRatingChange, size = 36 }) => {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          style={styles.starButton}
        >
          <FontAwesome
            name={rating >= star ? "star" : "star-o"}
            size={size}
            color={rating >= star ? "#FFD700" : "#DDDDDD"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ReviewModal = ({ visible, onClose, markAsRated }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const inputRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    dismissKeyboard();
    
    if (rating >= 4) {
      if (await StoreReview.isAvailableAsync()) {
        StoreReview.requestReview();
      } else {
        // Fallback: open store URL based on the platform
        const appStoreURL = Platform.OS === 'ios' ? IOS_APP_STORE_URL : ANDROID_PLAY_STORE_URL;
        Linking.openURL(appStoreURL);
      }
    } else {
      // Open email client with feedback message
      const email = "hostelhubbofficial@gmail.com";
      const subject = "HostelHubb Feedback";
      const body = `Hi HostelHubb Team,

This is how I think you can improve the app or a feature I suggest to include/remove:

[Please write your feedback below]

`;

      Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
    }
    markAsRated();
    onClose();
  };

  return (
    <Modal 
      isVisible={visible} 
      onBackdropPress={() => {
        dismissKeyboard();
      }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      style={styles.modalContainer}
      avoidKeyboard={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalContent}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Image 
                source={require('../../assets/images/icon.png')} 
                style={styles.logo} 
                resizeMode="contain"
              />
              
              <Text style={styles.title}>
                Enjoying HostelHubb?
              </Text>
              
              <Text style={styles.subtitle}>
                Your feedback helps us improve the hostel booking experience for students everywhere!
              </Text>
              
              <CustomStarRating 
                rating={rating} 
                onRatingChange={setRating} 
              />
              
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  placeholder="Tell us what you loved or how we can improve..."
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  style={styles.feedbackInput}
                  placeholderTextColor="#9EA0A4"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={dismissKeyboard}
                />
                {feedback.length > 0 && (
                  <TouchableOpacity 
                    style={styles.dismissButton}
                    onPress={dismissKeyboard}
                  >
                    <Text style={styles.dismissButtonText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity 
                style={[styles.submitButton, { opacity: rating > 0 ? 1 : 0.6 }]}
                onPress={handleSubmit}
                disabled={rating === 0}
              >
                <Text style={styles.submitButtonText}>Submit Review</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  scrollContent: {
    padding: 25,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 15,
    borderRadius:10
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1A202C",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  starButton: {
    marginHorizontal: 5,
  },
  inputContainer: {
    width: "100%",
    position: "relative",
  },
  feedbackInput: {
    width: "100%",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    height: 100,
    textAlignVertical: "top",
    fontSize: 16,
    backgroundColor: "#F7FAFC",
    color: "#2D3748",
  },
  dismissButton: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "#F7FAFC",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dismissButtonText: {
    color: COLORS.background,
    fontWeight: "600",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#3D5AF1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ReviewModal;