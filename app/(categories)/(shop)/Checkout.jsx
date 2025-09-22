import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Better than RN core SafeAreaView
import { useCart } from '../../../context/CartContext';
import CheckoutHeader from '../../../components/CheckoutComponents/CheckoutHeader';
import CheckoutItem from '../../../components/CheckoutComponents/CheckoutItem';
import EmptyCart from '../../../components/CheckoutComponents/EmptyCart';
import CheckoutButton from '../../../components/CheckoutComponents/CheckoutButton';

const CheckoutScreen = () => {
  const { cartItems } = useCart();

  if (!cartItems || cartItems.length === 0) return <EmptyCart />;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CheckoutItem item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }} // leave room for button
        ListHeaderComponent={<CheckoutHeader />}
      />

      <CheckoutButton onPress={() => console.log('Go to payment screen')} />
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
