import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Supabase client
const supabase = createClient('https://lxtmuiyrxmtjgbpmptpd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dG11aXlyeG10amdicG1wdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1MzI4NjEsImV4cCI6MjAzOTEwODg2MX0.US3X7N7ngm71Hq5aVRZv1MKjk1MBiZYYwyiCLFU1TAo');

const CreateShoppingList = () => {
    const [productName, setProductName] = useState('');
    const [products, setProducts] = useState([]);
    const [shoppingList, setShoppingList] = useState([]);
    const [error, setError] = useState(null);

    const searchProducts = async () => {
        if (productName.trim() === '') {
            setProducts([]);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('products')
                .select()
                .ilike('name', `%${productName}%`); // Case-insensitive search

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
        }, 500); // Debounce delay

        return () => clearTimeout(delayDebounceFn);
    }, [productName]);

    const addToShoppingList = (product) => {
        setShoppingList((prevList) => {
            const existingProduct = prevList.find((item) => item.id === product.id);
            if (existingProduct) {
                return prevList.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevList, { ...product, quantity: 1 }];
            }
        });
    };

    const renderProductItem = ({ item }) => (
        <TouchableOpacity style={styles.productItem} onPress={() => addToShoppingList(item)}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price} Rs</Text>
        </TouchableOpacity>
    );

    const renderShoppingListItem = ({ item }) => (
        <View style={styles.shoppingListItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
        </View>
    );

    const saveShoppingList = async () => {
        try {
            const sections = shoppingList.map(item => item.section);
            await AsyncStorage.setItem('List_sections', JSON.stringify(sections));
            Alert.alert('List Saved', 'Your shopping list has been saved!');
            const listvals = await AsyncStorage.getItem('List_sections');
            console.log(listvals);
        } catch (error) {
            Alert.alert('Error', 'Failed to save your shopping list.');
            console.error('Error saving shopping list:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Your Shopping List</Text>

            <View style={styles.searchSection}>
                <TextInput
                    style={styles.searchInput}
                    value={productName}
                    onChangeText={(text) => setProductName(text)}
                    placeholder="Search for products"
                />
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                        setProductName('');
                        Keyboard.dismiss();
                    }}
                >
                    <Text style={styles.clearButtonText}>X</Text>
                </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>Error: {error}</Text>}

            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderProductItem}
                style={styles.productList}
                contentContainerStyle={styles.productListContainer}
            />

            <Text style={styles.listTitle}>Your Shopping List</Text>
            {shoppingList.length > 0 ? (
                <FlatList
                    data={shoppingList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderShoppingListItem}
                    style={styles.shoppingList}
                    contentContainerStyle={styles.shoppingListContainer}
                />
            ) : (
                <Text style={styles.emptyListText}>Your shopping list is empty.</Text>
            )}

            <Button title="Save List" onPress={saveShoppingList} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginRight: 10,
    },
    clearButton: {
        padding: 5,
    },
    clearButtonText: {
        fontSize: 18,
        color: 'grey',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    productList: {
        maxHeight: 200,
        marginBottom: 20,
    },
    productListContainer: {
        paddingBottom: 10,
    },
    productItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: 'green',
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    shoppingList: {
        maxHeight: 200,
    },
    shoppingListContainer: {
        paddingBottom: 10,
    },
    shoppingListItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    productQuantity: {
        fontSize: 14,
    },
    emptyListText: {
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
});

export default CreateShoppingList;
