import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './components/LandingPage';
import BarcodeScanner from './components/BarcodeScanner';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import ProfilePage from './components/ProfilePage';
import ProductNavigation from './components/ProductNavigation';
import { CartProvider } from './context/CartContext';
import QRCodeScanner from './components/QRCodeScanner';

const Stack = createStackNavigator();

function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LandingPage">
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
          <Stack.Screen name="ProductNavigation" component={ProductNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

export default App;
