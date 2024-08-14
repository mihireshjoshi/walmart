import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  Button,
} from "react-native";


import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';



import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

// Initialize Supabase client
const supabase = createClient(
  "https://lxtmuiyrxmtjgbpmptpd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dG11aXlyeG10amdicG1wdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1MzI4NjEsImV4cCI6MjAzOTEwODg2MX0.US3X7N7ngm71Hq5aVRZv1MKjk1MBiZYYwyiCLFU1TAo"
);

import { Keyboard } from "react-native";

const LandingPage = () => {
  const navigation = useNavigation(); // Use navigation hook

  // Search Funtion
  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [virtualCoins, setVirtualCoins] = useState(0);

  useEffect(() => {
    const fetchVirtualCoins = async () => {
      try {
        const storedCoins = await AsyncStorage.getItem("virtualCoins");
        setVirtualCoins(parseInt(storedCoins) || 0);
      } catch (error) {
        console.error("Error fetching virtual coins:", error);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      fetchVirtualCoins(); // Fetch coins when the screen is focused
    });

    fetchVirtualCoins(); // Fetch coins on initial load

    return unsubscribe; // Clean up the listener on unmount
  }, [navigation]);

  const searchProducts = async () => {
    if (productName.trim() === "") {
      setProducts([]);
      return; // Skip search if the input is empty
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select()
        .ilike("name", `%${productName}%`); // Use ilike for case-insensitive search

      if (error) {
        throw error;
      }

      setProducts(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setProducts([]);
    }
  };

  const [shoes, setshoes] = useState([]);

  useEffect(() => {
    const fetchshoes = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select()
          .eq("section", "Shoes"); // Use ilike for case-insensitive search

        if (error) {
          throw error;
        }

        setshoes(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setshoes([]);
      }
    };

    fetchshoes();
  }, []);

  const [food, setfood] = useState([]);
  useEffect(() => {
    const fetchfood = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select()
          .eq("section", "Drinks"); // Use ilike for case-insensitive search

        if (error) {
          throw error;
        }

        setfood(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setfood([]);
      }
    };

    fetchfood();
  }, []);

  const [snacks, setsnacks] = useState([]);
  useEffect(() => {
    const fetchsnacks = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select()
          .eq("section", "Snacks"); // Use ilike for case-insensitive search

        if (error) {
          throw error;
        }

        setsnacks(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setsnacks([]);
      }
    };

    fetchsnacks();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles2.card} onPress={() => handlePress(item)}>
      <Text style={styles2.cardTitle}>{item.name}</Text>
      <Text style={styles2.cardDescription}>{item.description}</Text>
      <Text style={styles2.cardPrice}>{item.price}/- Rs</Text>
    </TouchableOpacity>
  );
  


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchProducts();
    }, 500); // Debounce delay of 500ms

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on component unmount or productName change
  }, [productName]);

  const handlePress = (product) => {
    // Navigate to ProductDetails page and pass product data
    navigation.navigate("ProductDetails", { product });
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}

      <View style={stylesnav.topNavBar}>
        <Text style={stylesnav.pageTitle}>Hi Mohammed!</Text>
        <View style={stylesnav.iconContainer}>
          <TouchableOpacity
            style={stylesnav.iconButton}
            onPress={() => navigation.navigate("Cart")}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/1170/1170576.png",
              }}
              style={stylesnav.iconImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={stylesnav.iconButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={stylesnav.iconImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={stylesnav.iconButton}
            onPress={() => navigation.navigate("Rewards")}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
              }}
              style={stylesnav.iconImage}
            />
            <Text style={stylesnav.coinText}>{virtualCoins}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
  <View style={style.searchBarContainer}>
    <TextInput
      style={style.searchInput}
      value={productName}
      onChangeText={(text) => setProductName(text)}
      placeholder="Enter product name"
    />
    <TouchableOpacity
      style={style.clearButton}
      onPress={() => {
        setProductName(""); // Clear the text input
        Keyboard.dismiss(); // Close the keyboard
      }}
    >
      <Text style={style.clearButtonText}>X</Text>
    </TouchableOpacity>
  </View>
  {error && <Text style={style.searchError}>Error: {error}</Text>}
  <FlatList
    data={products}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={style.searchCard}
        onPress={() => handlePress(item)}
      >
        <Text style={style.searchCardTitle}>{item.name}</Text>
        <Text style={style.searchCardDescription}>
          {item.description}
        </Text>
        <Text style={style.searchCardPrice}>{item.price}/- Rs</Text>
      </TouchableOpacity>
    )}
    contentContainerStyle={style.searchContentContainer}
  />
</View>

      {/* Main Features */}

      <View style={stylesmainfeature.mainFeaturesContainer}>
      <TouchableOpacity
        style={stylesmainfeature.featureButton}
        onPress={() => navigation.navigate("MapView")}
      >
        <AntDesign name="qrcode" size={24} color="black" style={stylesmainfeature.icon} />
        <Text style={stylesmainfeature.featureText}>
          Navigate Your Products
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={stylesmainfeature.featureButton}
        onPress={() => navigation.navigate("BarcodeScanner")}
      >
        <Feather name="navigation" size={24} color="black" style={stylesmainfeature.icon} />
        <Text style={stylesmainfeature.featureText}>Scan Your Products</Text>
      </TouchableOpacity>
    </View>

    <View style={stylesmainfeature.createShoppingListContainer}>
      <TouchableOpacity
        style={stylesmainfeature.createShoppingListButton}
        onPress={() => navigation.navigate("CreateShoppingList")}
      >
        <Feather name="shopping-cart" size={24} color="black" style={stylesmainfeature.icon} />
        <Text style={stylesmainfeature.createShoppingListText}>
          Create Your Shopping List
        </Text>
      </TouchableOpacity>
    </View>
{/* Extra Displayed Products : Shoes, Food, Snacks */}
<ScrollView style={styles2.scrollView}>
      <View style={styles2.container}>
        <Text style={styles2.title}>Shoes</Text>
        {error && <Text style={styles2.errorText}>{error}</Text>}
        <FlatList
          data={shoes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles2.listContainer}
        />
      </View>

      <View style={styles2.container}>
        <Text style={styles2.title}>Food</Text>
        {error && <Text style={styles2.errorText}>{error}</Text>}
        <FlatList
          data={food}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles2.listContainer}
        />
      </View>

      <View style={styles2.container}>
        <Text style={styles2.title}>Snacks</Text>
        {error && <Text style={styles2.errorText}>{error}</Text>}
        <FlatList
          data={snacks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles2.listContainer}
          onPress={() => handlePress(item)}
        />
      </View>
    </ScrollView>

      {/* Bottom Navigation Bar */}
    </View>
  );
};

const stylesearch = StyleSheet.create({
  searchSection: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
    position: 'relative', // Positioning context for absolute positioning of search results
    marginTop: 10, // Space below the top navigation bar
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#888',
  },
  searchError: {
    color: 'red',
    marginTop: 8,
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'absolute', // Ensure the cards overlap other components
    left: 16, // Adjust to match the left padding of the search section
    right: 16, // Adjust to match the right padding of the search section
  },
  searchCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchCardDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  searchCardPrice: {
    fontSize: 16,
    color: '#27ae60',
  },
  searchContentContainer: {
    paddingBottom: 20,
  },
});


const stylesmainfeature = StyleSheet.create({
  mainFeaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  featureButton: {
    backgroundColor: '#E6E6FA', // Light purple background
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    flex: 1, // Ensures buttons take equal width
    marginHorizontal: 8, // Adds gap between the buttons
    flexDirection: 'row', // Aligns icon and text horizontally
    alignItems: 'center', // Centers icon and text vertically
  },
  featureText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082', // Darker purple text
    marginLeft: 8, // Space between icon and text
  },
  createShoppingListContainer: {
    marginTop: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center', // Centers button horizontally
  },
  createShoppingListButton: {
    backgroundColor: '#E6E6FA', // Light purple background
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    flex: 1, // Ensures button takes the same width as the upper buttons
    marginHorizontal: 8, // Adds gap on both sides
    flexDirection: 'row', // Aligns icon and text horizontally
    alignItems: 'center', // Centers icon and text vertically
  },
  createShoppingListText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082', // Darker purple text
    marginLeft: 8, // Space between icon and text
  },
  icon: {
    marginRight: 8, // Space between icon and text
  },
});

const stylesnav = StyleSheet.create({
  topNavBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  coinText: {
    fontSize: 14,
    color: "#FFD700",
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
  createShoppingListContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  createShoppingListButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  createShoppingListText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topNavBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#6200ea",
  },
  pageTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
    alignItems: "center",
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  coinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchBarContainer: {
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  searchBar: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  mainFeaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    padding: 15,
  },
  featureButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#6200ea",
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  horizontalScroll: {
    paddingLeft: 10,
  },
  productCard: {
    width: 140,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "green",
  },
  productDescription: {
    fontSize: 12,
    color: "#777",
  },
  bottomNavBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#6200ea",
  },
  bottomNavButton: {
    padding: 10,
  },
  bottomNavText: {
    color: "#fff",
    fontSize: 16,
  },
});

const style = StyleSheet.create({
  searchSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: '100%', // Ensure it takes full height if needed
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 8,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    marginBottom: 0, // Add margin below the search bar
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#007bff',
  },
  searchError: {
    color: 'red',
    marginTop: 10,
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
    padding: 15,
  },
  searchCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  searchCardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  searchCardPrice: {
    fontSize: 16,
    color: '#28a745',
  },
  searchContentContainer: {
    paddingBottom: 20,
  },
});
const styles2 = StyleSheet.create({
  scrollView: {
    flex: 1, // Ensure ScrollView takes full available space
  },
  container: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 5,
    padding: 10,
    width: 150,
    height: 120,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 10,
    color: '#666',
  },
  cardPrice: {
    fontSize: 12,
    color: '#28a745',
  },
});

export default LandingPage;
