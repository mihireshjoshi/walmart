import * as React from "react";
import "react-native-gesture-handler"; // Ensure this is at the top
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "./components/LandingPage";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import ProfilePage from "./components/ProfilePage";
import { CartProvider } from "./context/CartContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import QueueStatus from "./components/QueueStatus";
import MapView from "./components/MapView";
import QRScanner from "./components/QRScanner";
import Search from "./components/Search";
import BarcodeScanner from "./components/BarcodeScanner";
import { LogBox } from "react-native";
import CreateShoppingList from "./components/CreateShoppingList";
import RewardSplashScreen from "./components/RewardSplashScreen";
import { useEffect } from "react";
import { clearAsyncStorage } from "./components/storageUtils"; // Import the clearAsyncStorage function
import ScanningCashier from "./components/ScanningCashier";
const Stack = createStackNavigator();
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);
LogBox.ignoreLogs([
  "BarCodeScanner has been deprecated and will be removed in a future SDK version.",
]);
function App() {
  useEffect(() => {
    // Clear AsyncStorage when the app is opened
    clearAsyncStorage();
  }, []);

  return (
    <Provider store={store}>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LandingPage">
            <Stack.Screen
              name="LandingPage"
              component={LandingPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Profile" component={ProfilePage} />
            <Stack.Screen name="MapView" component={MapView} />
            <Stack.Screen name="QRScanner" component={QRScanner} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
            <Stack.Screen name="QueueStatus" component={QueueStatus} />
            <Stack.Screen name="ScanningCashier" component={ScanningCashier} />
            <Stack.Screen
              name="CreateShoppingList"
              component={CreateShoppingList}
            />
            <Stack.Screen
              name="RewardSplashScreen"
              component={RewardSplashScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </Provider>
  );
}

export default App;
