import React, { useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, 
  Platform, KeyboardAvoidingView, StatusBar, Linking, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FormInput from '../../../components/InputFields/FormInput';
import FormDropdown from '../../../components/InputFields/FormDropDown';
import CheckoutButton from '../../../components/CheckoutComponents/CheckoutButton';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../../context/UserContext';
import OverlayLoader from '../../../components/Animation/OverlayLoader';
import axios from 'axios';

const PaymentScreen = () => {
  const { userInfo } = useContext(UserContext);
  const { total, cartItems } = useLocalSearchParams();
  const router = useRouter();
  const parsedCartItems = cartItems ? JSON.parse(cartItems) : [];

  const userBalance = userInfo?.balance || 0.00;
  const userId = userInfo?.id;
  const [loading, setLoading] = useState(false);

  // Prefill user info
  const [name, setName] = useState(userInfo?.firstName || '');
  const [contact, setContact] = useState(userInfo?.phoneNumber || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deliverySchool, setDeliverySchool] = useState('');

  const schools = [{ label: 'KNUST', value: 'KNUST' }];

  const validateForm = () => {
    if (!name.trim()) return Alert.alert('Missing Information', 'Please enter your name');
    if (!contact.trim()) return Alert.alert('Missing Information', 'Please enter your contact number');
    if (!email.trim()) return Alert.alert('Missing Information', 'Please enter your email');
    if (!deliveryLocation.trim()) return Alert.alert('Missing Information', 'Please enter delivery location');
    if (!deliverySchool) return Alert.alert('Missing Information', 'Please select a delivery school');
    return true;
  };

  // ✅ Deposit / Top-up Function
  const handleDeposit = async (amountToAdd) => {
    try {
      setLoading(true);
      const response = await axios.post('https://hostelhubbbackend.onrender.com/api/deposit', {
        amount: amountToAdd * 100, // Paystack expects amount in kobo/pesewas
        email: email,
        id: userId,
        role: 'user',
      });

      const { authorization_url } = response.data;
      Linking.openURL(authorization_url);
    } catch (error) {
      Alert.alert("Error", "Could not initiate deposit. Please try again.");
      console.error("Deposit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!validateForm()) return;

    const numericTotal = parseFloat(total);
    const fullDeliveryAddress = `${deliveryLocation} - ${deliverySchool}`;

    // 🧮 Balance check
    if (userBalance < numericTotal) {
      const amountNeeded = numericTotal - userBalance;
      Alert.alert(
        'Insufficient Balance',
        `Your current balance (GHC ${userBalance.toFixed(2)}) is not enough to complete this order.\n\nYou need to add at least GHC ${amountNeeded.toFixed(2)}.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Top Up', onPress: () => handleDeposit(amountNeeded) }
        ]
      );
      return;
    }

    // ✅ Proceed with payment if balance is enough
    const orderInfo = {
      name,
      contact,
      email,
      deliveryAddress: fullDeliveryAddress,
      cartItems: parsedCartItems,
      total,
      timestamp: new Date().toISOString(),
    };

    console.log('Order Information:', orderInfo);

    Alert.alert(
      'Payment Successful',
      `Your order has been placed successfully!\n\nName: ${name}\nDelivery: ${fullDeliveryAddress}\nTotal: GHC ${numericTotal.toFixed(2)}`,
      [{ text: 'OK', onPress: () => router.replace('/orders') }]
    );
  };

  const formattedTotal = parseFloat(total).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f7fb' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7fb" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#100101ff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Details</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>

            <FormInput placeholder="Full Name" value={name} onChangeText={setName} />
            <FormInput placeholder="Phone Number" value={contact} onChangeText={setContact} keyboardType="phone-pad" />
            <FormInput placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <FormInput placeholder="Delivery Location" value={deliveryLocation} onChangeText={setDeliveryLocation} />
            <FormDropdown label="Delivery School" value={deliverySchool} onValueChange={setDeliverySchool} items={schools} />
          </View>

          <View style={styles.deliveryNoteContainer}>
            <Text style={styles.deliveryNote}>Delivery will be charged by CPS on delivery</Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.bottomButton}>
          <CheckoutButton 
            onPress={handlePay} 
            text={loading ? 'Processing...' : `Pay Now (GHC ${formattedTotal})`} 
            disabled={loading} 
          />
          {loading && (
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#9a0b0d" />
              <Text style={{ color: '#555', fontSize: 13, marginTop: 5 }}>Redirecting to payment...</Text>
            </View>
          )}
        </View>
        <OverlayLoader visible={loading} message="Payment is processing, please wait..." />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#100101ff' },
  scrollContainer: { padding: 20, paddingBottom: 0 },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    ...Platform.select({ android: { elevation: 3 } }),
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#444' },
  deliveryNoteContainer: { marginBottom: 20, alignItems: 'center' },
  deliveryNote: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  balanceCard: { marginBottom: 10, alignItems: 'center' },
  balanceText: { fontSize: 16, color: '#333', fontWeight: '600' },
  bottomButton: { position: 'absolute', bottom: -10, left: 0, right: 0 },
});
