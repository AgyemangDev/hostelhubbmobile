import { Stack } from 'expo-router';
import { ProductsProvider } from '../../../context/ProductContext'; 
import { CartProvider } from '../../../context/CartContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
        <GestureHandlerRootView style={{ flex: 1 }}>
    <ProductsProvider>
      <CartProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#610b0c',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      </CartProvider>
    </ProductsProvider>
  </GestureHandlerRootView>
  );
}
