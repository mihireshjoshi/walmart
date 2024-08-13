
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

// Initialize Supabase client
const supabase = createClient('https://lxtmuiyrxmtjgbpmptpd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dG11aXlyeG10amdicG1wdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1MzI4NjEsImV4cCI6MjAzOTEwODg2MX0.US3X7N7ngm71Hq5aVRZv1MKjk1MBiZYYwyiCLFU1TAo');

const Search = () => {
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Use navigation hook

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
      
      <TextInput
        style={styles.input}
        value={productName}
        onChangeText={(text) => setProductName(text)}
        placeholder="Enter product name"
      />
      {/* <Button title="Search" onPress={searchProducts} /> */}

      {error && <Text style={styles.error}>Error: {error}</Text>}
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardPrice}>{item.price}/- Rs</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No products found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 16,
    marginVertical: 5,
  },
  cardPrice: {
    fontSize: 16,
    color: 'green',
  },
  empty: {
    fontSize: 18,
    color: 'gray',
  },
});

export default Search;
