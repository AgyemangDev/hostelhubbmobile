import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import StepOneFormScreen from './StepOneFormScreen';
import StepTwoSelectRoomScreen from './StepTwoSelectRoomScreen';
import StepThreeAgentScreen from './StepThreeAgentScreen';
import BookingProgressBar from './BookingProgressBar'; // 👈 import new component
import COLORS from '../../constants/Colors';

const BookingStepper = ({
  step,
  setStep,
  hostelData,
  formData,
  handleInputChange,
  handleSelectPaymentRange,
  isStepOneComplete,
  handleBooking,
}) => {
  const handleNext = () => {
    if (step === 1 && !isStepOneComplete()) {
      alert('Please fill in all required fields.');
      return;
    }

if (step < 2) {
  setStep(step + 1);
} else {
  handleBooking();
}
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOneFormScreen
            formData={formData}
            handleInputChange={handleInputChange}
            hostelData={hostelData}
            handleSelectPaymentRange={handleSelectPaymentRange}
          />
        );
      case 2:
        return (
          <StepTwoSelectRoomScreen
            formData={formData}
            hostelData={hostelData}
            handleSelectPaymentRange={handleSelectPaymentRange}
          />
        );
      // case 3:
      //   return (
      //     <StepThreeAgentScreen
      //       formData={formData}
      //       handleInputChange={handleInputChange}
      //     />
      //   );
      default:
        return null;
    }
  };

  return (
<View style={styles.container}>
  {/* Booking Title */}
  <Text style={styles.title}>Booking {hostelData?.hostelName}</Text>

  {/* KeyboardAvoidingView for inputs only */}
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
  >
    {/* Progress Bar */}
    <BookingProgressBar step={step} />

    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      {renderStep()}
    </ScrollView>
  </KeyboardAvoidingView>

  {/* Button OUTSIDE KeyboardAvoidingView */}
  <TouchableOpacity style={styles.button} onPress={handleNext}>
    <Text style={styles.buttonText}>
      {step < 2 ? 'Continue' : 'Confirm Booking'}
    </Text>
  </TouchableOpacity>
</View>

  );
};

export default BookingStepper;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.button,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});
