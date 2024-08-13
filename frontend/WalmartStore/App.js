import * as React from 'react';
import 'react-native-gesture-handler'; // Ensure this is at the top
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './components/LandingPage';
import BarcodeScanner from './components/BarcodeScanner';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import ProfilePage from './components/ProfilePage';
import ProductNavigation from './components/ProductNavigation';
import { CartProvider } from './context/CartContext';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import MapView from './components/MapView';
import QRScanner from './components/QRScanner';
import GridPathFinder from './pages/GridMap';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LandingPage">
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="MapView" component={MapView} />
          <Stack.Screen name="QRScanner" component={QRScanner} />
          <Stack.Screen name="ProductNavigation" component={ProductNavigation} />
          <Stack.Screen name="GridMap" component={GridPathFinder} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
    </Provider>
  );
}

export default App;
