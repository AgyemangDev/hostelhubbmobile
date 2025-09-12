// RenderItemInfoStep.jsx
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { BackButton, ContinueButton } from "./NavigationButton";
import CategoryList from "./CategoryList";
import SelectedItemsList from "./SelectedItemList";
import TotalCostDisplay from "./TotalCostDisplay";
import { itemPricing } from "../../assets/data/itemData";

const RenderItemInfoStep = ({ formData, setFormData, nextStep, prevStep }) => {
  const [totalCost, setTotalCost] = useState(0);
  useEffect(() => {
    calculateTotalCost();
  }, [formData.items]);

const toggleItemCategory = (category) => {
  // Initialize items as an empty array if it's undefined
  const currentItems = formData.items || [];
  
  const exists = currentItems.find((i) => i.category === category);
 
  if (exists) {
    const filtered = currentItems.filter((item) => item.category !== category);
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
      items: [...currentItems, newItem],
    });
  }
};

  const calculateTotalCost = () => {
    let cost = 0;
    (formData.items || []).forEach((item) => {
      const unitPrice = itemPricing[item.category] || 0;
      cost += unitPrice * item.quantity;
    });
    setTotalCost(cost);
  };
  const updateItemQuantity = (id, change) => {
    const updatedItems = (formData.items || []).map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };
  const removeItem = (id) => {
    const filtered = (formData.items || []).filter((item) => item.id !== id);
    setFormData({ ...formData, items: filtered });
  };
  const handleContinue = () => {
    if ((formData.items || []).length === 0) {
      Alert.alert(
        "No items selected",
        "Please select at least one item before continuing."
      );
      return;
    }
    nextStep();
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.header}>Select Items</Text>
<Text style={styles.subText}>Choose the items you want to include</Text>
<Text style={styles.deliveryNote}>
  😊 We’ll deliver your items to your next hostel at no extra cost!
</Text>
          <CategoryList 
            categories={Object.keys(itemPricing)}
            pricing={itemPricing}
            onSelectCategory={toggleItemCategory}
            selectedCategories={(formData.items || []).map(item => item.category)}
          />
          {(formData.items || []).length > 0 && (
            <SelectedItemsList 
              items={formData.items || []}
              pricing={itemPricing}
              onUpdateQuantity={updateItemQuantity}
              onRemoveItem={removeItem}
            />
          )}
          <TotalCostDisplay totalCost={totalCost} />
          <View style={styles.infoBox}>
  <Text style={styles.infoText}>
    The total cost shown is an estimate. Additional charges may apply if 
    the actual price exceeds the estimate due to incorrect selection or 
    extra items. If the final cost is lower, the difference will be refunded.
  </Text>
</View>
          <View style={styles.navigationButtons}>
            <BackButton onPress={prevStep} />
            <ContinueButton onPress={handleContinue} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RenderItemInfoStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    width:"100%"
  },
  contentContainer: {
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a2b4b",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },
  deliveryNote: {
  fontSize: 14,
  color: "green",
  marginBottom: 20,
  fontWeight: "500",
},
infoBox: {
  marginTop: 12,
  backgroundColor: "#EBF4FF",
  borderRadius: 8,
  padding: 12,
  borderWidth: 1,
  borderColor: "#BFDBFE",
},
infoText: {
  fontSize: 13,
  color: "#1E40AF",
  lineHeight: 18,
  fontWeight: "500",
},
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});