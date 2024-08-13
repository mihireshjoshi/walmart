import * as React from 'react';
import 'react-native-gesture-handler'; // Ensure this is at the top
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './components/LandingPage';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import ProfilePage from './components/ProfilePage';
import { CartProvider } from './context/CartContext';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import QueueStatus from './components/QueueStatus';
import MapView from './components/MapView';
import QRScanner from './components/QRScanner';
import Search from './components/Search';
import BarcodeScanner from './components/BarcodeScanner';
import { LogBox } from 'react-native';
const Stack = createStackNavigator();
LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']); 

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LandingPage">
            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="Profile" component={ProfilePage} />
            <Stack.Screen name="MapView" component={MapView} />
            <Stack.Screen name="QRScanner" component={QRScanner} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
            <Stack.Screen name="QueueStatus" component={QueueStatus} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </Provider>
  );
}

export default App;
