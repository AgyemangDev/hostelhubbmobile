import { Stack } from 'expo-router';
import { ProductsProvider } from '../../../context/ProductContext'; 
import { CartProvider } from '../../../context/CartContext';
import { colors } from "../../../constants/theme";


export default function Layout() {
  return (

    <ProductsProvider>
      <CartProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.brand,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      </CartProvider>
    </ProductsProvider>

  );
}
