import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../../context/CartContext';
import CheckoutHeader from '../../../components/CheckoutComponents/CheckoutHeader';
import CheckoutItem from '../../../components/CheckoutComponents/CheckoutItem';
import EmptyCart from '../../../components/CheckoutComponents/EmptyCart';
import CheckoutButton from '../../../components/CheckoutComponents/CheckoutButton';
import { useRouter } from 'expo-router';

const CheckoutScreen = () => {
  const { cartItems } = useCart();
  const router = useRouter();

  if (!cartItems || cartItems.length === 0) return <EmptyCart />;

  // Calculate total cost
  const getTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  // Format number with commas and 2 decimals
  const formatCurrency = (num) =>
    Number(num).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const total = getTotal(cartItems);

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CheckoutItem item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={<CheckoutHeader />}
      />

      <CheckoutButton
        onPress={() =>
          router.push({
            pathname: '/PaymentScreen',
            params: {
              total, // send raw number
              cartItems: JSON.stringify(cartItems),
            },
          })
        }
        text={`Proceed to Checkout (GHC ${formatCurrency(total)})`}
      />
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
