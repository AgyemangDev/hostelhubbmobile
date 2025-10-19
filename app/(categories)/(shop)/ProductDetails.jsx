import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
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

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  if (!product) return <Text>No product found</Text>;

  const handleAddToCart = () => {
    // If product has colors/sizes, ensure user has selected
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      Alert.alert('Select Color', 'Please select a color before adding to cart.');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      Alert.alert('Select Size', 'Please select a size before adding to cart.');
      return;
    }

    // Add selected options to product object
    const productWithOptions = {
      ...product,
      selectedColor,
      selectedSize,
    };

    addToCart(productWithOptions);
  };

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
        <ProductInfo
          product={product}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />
        <ProductReviews reviews={product.reviews} />
      </ScrollView>
      
      <AddToCartButton onPress={handleAddToCart} />
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 10,
  },
  cartWrapper: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    elevation: 1000,
  },
});
