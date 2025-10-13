import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCart } from '../../../context/CartContext';
import ProductImages from '../../../components/ProductComponent/ProductImages';
import ProductInfo from '../../../components/ProductComponent/ProductInfo';
import ProductReviews from '../../../components/ProductComponent/ProductReviews';
import AddToCartButton from '../../../components/ProductComponent/AddToCartButton';
import CartHeader from '../../../components/ProductComponent/CartHeader';

const ProductDetails = () => {
  const params = useLocalSearchParams();
  const { addToCart } = useCart();
  const product = params.product ? JSON.parse(params.product) : null;

  if (!product) return <Text>No product found</Text>;

  return (
    <View style={styles.mainContainer}>
      {/* Floating cart at upper right */}
      <View style={styles.cartWrapper}>
        <CartHeader />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProductImages images={product.gallery} />
        <ProductInfo product={product} />
        <ProductReviews reviews={product.reviews} />
      </ScrollView>
      
      <AddToCartButton onPress={() => addToCart(product)} />
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative', // Enable absolute positioning for children
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 120, // Space for AddToCartButton
    paddingTop: 10, // Some top padding to avoid overlap with cart
  },
  cartWrapper: {
    position: 'absolute',
    top: 50, // Position from top (adjust based on your status bar)
    right: 20, // Position from right edge
    zIndex: 1000, // Ensure it's above all other content
    elevation: 1000, // For Android shadow layering
  },
});