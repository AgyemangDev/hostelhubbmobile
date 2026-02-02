import { Stack } from 'expo-router';
import { ProductsProvider } from '../../../context/ProductContext'; 
import { CartProvider } from '../../../context/CartContext';


export default function Layout() {
  return (

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

  );
}
