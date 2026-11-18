// src/components/ProductCard.jsx
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { useRouter } from 'expo-router';
import { useCart } from '../../../context/CartContext';
import { Button, PressableScale } from "../../ui";
import { colors } from "../../../constants/theme";

const { width: screenWidth } = Dimensions.get('window');

const ProductCard = ({ product }) => {
  if (!product) return null;
  const router = useRouter();
  const { addToCart } = useCart();

  const dynamicWidth = (screenWidth - 32) / 2;
  const imageHeight = dynamicWidth * 0.9;

  const handlePress = () => {
    router.push({
      pathname: '/ProductDetails',
      params: { product: JSON.stringify(product) },
    });
  };

  const handleAddToCart = () => {
    // If product has color or size, route to details page instead
    if ((product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)) {
      handlePress();
    } else {
      addToCart({ ...product, quantity: 1 });
    }
  };

  return (
    <View style={[styles.card, { width: dynamicWidth }]}>
      {/* Product clickable area */}
      <PressableScale style={[styles.imageContainer, { height: imageHeight }]} onPress={handlePress} accessibilityRole="imagebutton" accessibilityLabel={product.name}>
        <Image
          source={{ uri: product.mainImage }}
          style={styles.image}
          resizeMode="cover"
        />
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
      </PressableScale>

      {/* Product info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>

        {/* Price + Add button */}
        <View style={styles.priceAddRow}>
          {product.originalPrice && product.originalPrice > product.price ? (
            <>
              <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.price}>GHC {product.price}</Text>
          )}

          <Button
            title={(product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0) ? "Select" : "Add"}
            icon="cart-outline"
            size="sm"
            compact
            onPress={handleAddToCart}
          />
        </View>
      </View>
    </View>
  );
};

export default ProductCard;

// styles remain the same as your previous code


const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: colors.fill,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.fill,
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: colors.textInverse,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  newBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#2ed573',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newText: {
    color: colors.textInverse,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  info: {
    padding: 8,
    paddingBottom: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  priceAddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 👈 keeps price left, button right
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  originalPrice: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  addText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
