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
import  { useState , useEffect} from 'react';

import { createClient } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

// Initialize Supabase client
const supabase = createClient('https://lxtmuiyrxmtjgbpmptpd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dG11aXlyeG10amdicG1wdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1MzI4NjEsImV4cCI6MjAzOTEwODg2MX0.US3X7N7ngm71Hq5aVRZv1MKjk1MBiZYYwyiCLFU1TAo');


import { Keyboard } from 'react-native';



const LandingPage = () => {

  const sections = [
    {
      id: "1",
      title: "Clothing",
      products: [
        {
          id: "1",
          name: "T-Shirt",
          price: "₹300",
          description: "Comfortable cotton t-shirt",
        },
        {
          id: "2",
          name: "Jeans",
          price: "₹1200",
          description: "Stylish denim jeans",
        },
        {
          id: "3",
          name: "Jacket",
          price: "₹2500",
          description: "Warm winter jacket",
        },
      ],
    },
    {
      id: "2",
      title: "Electronics",
      products: [
        {
          id: "4",
          name: "Smartphone",
          price: "₹15000",
          description: "Latest Android smartphone",
        },
        {
          id: "5",
          name: "Laptop",
          price: "₹50000",
          description: "High-performance laptop",
        },
        {
          id: "6",
          name: "Headphones",
          price: "₹2000",
          description: "Noise-cancelling headphones",
        },
      ],
    },
    {
      id: "3",
      title: "Cooking",
      products: [
        {
          id: "7",
          name: "Non-stick Pan",
          price: "₹500",
          description: "Durable non-stick pan",
        },
        {
          id: "8",
          name: "Spatula Set",
          price: "₹150",
          description: "Heat-resistant spatulas",
        },
      ],
    },
    {
      id: "4",
      title: "Daily Essentials",
      products: [
        {
          id: "9",
          name: "Toothpaste",
          price: "₹90",
          description: "Teeth whitening toothpaste",
        },
        {
          id: "10",
          name: "Shampoo",
          price: "₹150",
          description: "Anti-dandruff shampoo",
        },
        {
          id: "11",
          name: "Soap",
          price: "₹30",
          description: "Moisturizing bath soap",
        },
      ],
    },
  ];

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
    </View>
  );


 

  const navigation = useNavigation(); // Use navigation hook

// Search Funtion
const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const searchProducts = async () => {
    if (productName.trim() === '') {
      setProducts([]);
      return; // Skip search if the input is empty
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select()
        .ilike('name', `%${productName}%`); // Use ilike for case-insensitive search

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchProducts();
    }, 500); // Debounce delay of 500ms

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on component unmount or productName change
  }, [productName]);

  const handlePress = (product) => {
    // Navigate to ProductDetails page and pass product data
    navigation.navigate('ProductDetails', { product });
  };




  return (
    <View style={styles.container}>
    {/* Top Navigation Bar */}
    <View style={styles.topNavBar}>
      <Text style={styles.pageTitle}>Hi Mohammed!</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1170/1170576.png",
            }}
            style={styles.iconImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.iconImage}
          />
        </TouchableOpacity>
      </View>
    </View>
            
    {/* Search Section */}
    <View style={style.searchSection}>
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
        setProductName(''); // Clear the text input
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
      <TouchableOpacity style={style.searchCard} onPress={() => handlePress(item)}>
        <Text style={style.searchCardTitle}>{item.name}</Text>
        <Text style={style.searchCardDescription}>{item.description}</Text>
        <Text style={style.searchCardPrice}>{item.price}/- Rs</Text>
      </TouchableOpacity>
    )}
    contentContainerStyle={style.searchContentContainer}
  />
</View>


    {/* Main Features */}
    <View style={styles.mainFeaturesContainer}>
      <TouchableOpacity
        style={styles.featureButton}
        onPress={() => navigation.navigate("MapView")}
      >
        <Text style={styles.featureText}>Navigate Your Products</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.featureButton}
        onPress={() => navigation.navigate("BarcodeScanner")}
      >
        <Text style={styles.featureText}>Scan Your Products</Text>
      </TouchableOpacity>
    </View>

    {/* Sections */}
    <ScrollView style={styles.content}>
      {sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <FlatList
            data={section.products}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            horizontal={true} // Horizontal scroll
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          />
        </View>
      ))}
    </ScrollView>

    {/* Bottom Navigation Bar */}
  </View>
  );
};

const styles = StyleSheet.create({
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
  },
  iconImage: {
    width: 30,
    height: 30,
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
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  searchSection: {
    top: 20, // Adjust as needed
    left: 0,
    right: 0,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10, // Space between input and clear button
    paddingHorizontal: 8,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: 'grey', // Or any color of your choice
  },
  searchError: {
    color: 'red',
    marginBottom: 10,
  },
  searchCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchCardDescription: {
    fontSize: 16,
    marginVertical: 5,
  },
  searchCardPrice: {
    fontSize: 16,
    color: 'green',
  },
  searchEmpty: {
    fontSize: 18,
    color: 'gray',
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


export default LandingPage;
