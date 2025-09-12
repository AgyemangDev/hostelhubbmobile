import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, Alert, ScrollView, SafeAreaView } from "react-native";
import styles from "../../assets/Styles/StorageStyles";
import RenderConfirmation from "../../components/StoreComponent/RenderConfirmation";
import RenderPersonalInfoStep from "../../components/StoreComponent/RenderPersonalInfoStep";
import RenderReservationDetailsStep from "../../components/StoreComponent/RenderReservationDetailsStep";
import RenderItemInfoStep from "../../components/StoreComponent/RenderItemInfoStep";
import RenderReviewStep from "../../components/StoreComponent/RenderReviewStep";
import { UserContext } from "../../context/UserContext";

const StoreForm = () => {
  const { userInfo } = useContext(UserContext);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: "", // Will be "2025-04-24" or "2025-04-25"
    deliveryDate: "", // Will be "2025-05-24" or "2025-05-25"
    pickupLocation: "",
    deliveryLocation: "",
    itemCategories: [],
    agreeToTerms: false,
  });

  const scrollViewRef = useRef(null); // Ref for ScrollView

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        firstName: userInfo.firstName || "",
        lastName: userInfo.surname || "",
        phone: userInfo.phoneNumber || "",
        email: userInfo.email || "",
      }));
    }
  }, [userInfo]);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categoryOptions = [
    "Clothing & Textiles",
    "Furniture",
    "Electronics",
    "Books & Academic Materials",
    "Sports Equipment",
    "Kitchen Items",
    "Decorations",
    "Musical Instruments",
  ];

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const toggleItemCategory = (category) => {
    const items = formData.items || []; // ensure items is at least an empty array
    const exists = items.find((i) => i.category === category);

    if (exists) {
      const filtered = items.filter((item) => item.category !== category);
      setFormData({
        ...formData,
        items: filtered,
      });
    } else {
      const newItem = {
        id: Date.now().toString(),
        category,
        quantity: 1,
      };
      setFormData({
        ...formData,
        items: [...items, newItem], // no longer spreading undefined
      });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    Alert.alert(
      "Reservation Submitted!",
      "Your storage reservation has been successfully submitted. You will receive a confirmation email shortly.",
      [{ text: "OK", onPress: () => {} }]
    );
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        Alert.alert(
          "Missing Information",
          "Please fill in all required fields."
        );
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressTextContainer}>
        <Text
          style={[styles.progressText, step >= 1 && styles.activeProgressText]}
        >
          Info
        </Text>
        <Text
          style={[styles.progressText, step >= 2 && styles.activeProgressText]}
        >
          Items
        </Text>
        <Text
          style={[styles.progressText, step >= 3 && styles.activeProgressText]}
        >
          Details
        </Text>
        <Text
          style={[styles.progressText, step >= 4 && styles.activeProgressText]}
        >
          Review
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${(step / 4) * 100}%` }]}
        />
      </View>
    </View>
  );

  useEffect(() => {
    // Scroll to the top whenever the step changes
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [step]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef} // Set ref here
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>H. Storage Reservation</Text>

        {!submitted ? (
          <>
            {renderProgressBar()}

            {step === 1 && (
              <RenderPersonalInfoStep
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
                handleInputChange={handleInputChange}
              />
            )}

            {step === 2 && (
              <RenderItemInfoStep
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                categoryOptions={categoryOptions}
                toggleItemCategory={toggleItemCategory}
              />
            )}

            {step === 3 && (
              <RenderReservationDetailsStep
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                setShowStartDatePicker={setShowStartDatePicker}
                setShowEndDatePicker={setShowEndDatePicker}
                handleInputChange={handleInputChange}
              />
            )}

            {step === 4 && (
              <RenderReviewStep
                formData={formData}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
              />
            )}
          </>
        ) : (
          <RenderConfirmation />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoreForm;
