import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BarcodeScanner from './components/BarcodeScanner';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart'; // Import the Cart screen
import { CartProvider } from './context/CartContext'; // Import the CartProvider
import SensorTracking from './pages/MapMotion';

const Stack = createStackNavigator();

function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Scanner">
          <Stack.Screen name="Scanner" component={BarcodeScanner} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="MapMotion" component={SensorTracking} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

export default App;
