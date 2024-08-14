import React, { useContext, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CartContext } from '../context/CartContext';

const ProductDetails = ({ route, navigation }) => {
    const { product } = route.params;
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        Alert.alert('Success', `${quantity} ${product.name}(s) added to cart`);
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const effectivePrice = product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.price);
    const totalPrice = effectivePrice * quantity;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.detailsContainer}>
                <View style={styles.mainBox}>
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                    {product.sale_price && product.discount_percentage ? (
                        <View>
                            <View style={styles.priceView}>
                                <Text style={styles.originalPriceTxt}>
                                    Original Price:
                                </Text>
                                <Text style={styles.originalPrice}>
                                    ${parseFloat(product.price).toFixed(2)}
                                </Text>
                            </View>
                            <Text style={styles.salePrice}>
                                Sale Price: ${parseFloat(product.sale_price).toFixed(2)} ({product.discount_percentage}% OFF)
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.priceView}>
                            <Text style={styles.originalPriceTxt}>
                                Price:
                            </Text>
                            <Text style={styles.Price}>
                                ${parseFloat(product.price).toFixed(2)}
                            </Text>
                        </View>
                        
                    )}
                    <View style={styles.priceView}>
                        <Text style={styles.originalPriceTxt}>
                            Total:
                        </Text>
                        <Text style={styles.Price}>
                            ${totalPrice.toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={decreaseQuantity} style={styles.plusMinus}>
                            <Text style={styles.plusMinusTxt}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity onPress={increaseQuantity} style={styles.plusMinus}>
                            <Text style={styles.plusMinusTxt}>+</Text>
                        </TouchableOpacity>
                        
                        {/* <Button title="-" onPress={decreaseQuantity} />
                        <Text style={styles.quantity}>{quantity}</Text>
                        <Button title="+" onPress={increaseQuantity} /> */}
                    </View>

                    <View style={styles.cartOps}>
                        <TouchableOpacity onPress={handleAddToCart} style={styles.cartBtn}>
                            <Text style={styles.cartTxt}>Add to Cart</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBtn}>
                            <Text style={styles.cartTxt}>Go to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                

                {/* <Button title="Add to Cart" onPress={handleAddToCart} style={{ marginTop: 20 }} />
                <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} /> */}

                {/* Display recommended products */}
                {product.recommendations && product.recommendations.length > 0 && (
                    <View style={styles.recommendationsContainer}>
                        <Text style={styles.recommendationsTitle}>Recommended Products</Text>
                        <FlatList
                            data={product.recommendations}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.recommendedProductContainer}>
                                    <Text style={styles.recommendedProductName}>{item.Name}</Text>
                                    <Text style={styles.recommendedProductPrice}>Price: ${item.Price}</Text>
                                    <Text style={styles.recommendedProductDescription}>{item.Description}</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNavBar}>
                <TouchableOpacity
                    style={styles.bottomNavButton}
                    onPress={() => navigation.navigate('ProductNavigation')}
                >
                    <Text style={styles.bottomNavText}>Navigate Your Products</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.bottomNavButton}
                    onPress={() => navigation.navigate('BarcodeScanner')}
                >
                    <Text style={styles.bottomNavText}>Scan Your Products</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    detailsContainer: {
        padding: 10,
    },
    mainBox: {
        backgroundColor: "#E6E6FA",
        padding: 20,
        borderRadius: 12,
        elevation: 3
        // borderWidth: 2,
        // borderColor: "#fff"
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    originalPrice: {
        fontSize: 18,
        textDecorationLine: 'line-through',
        color: 'red',
    },
    salePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
    },
    price: {
        fontSize: 18,
    },
    totalPrice: {
        fontSize: 18,
        marginTop: 10,
    },
    description: {
        marginTop: 2,
        marginBottom: 20,
        fontSize: 16,
        color: '#513689',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    quantity: {
        fontSize: 18,
        paddingHorizontal: 10,
        backgroundColor: "#C3B5E2"
    },
    recommendationsContainer: {
        marginTop: 20,
    },
    recommendationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recommendedProductContainer: {
        marginTop: 10,
    },
    recommendedProductName: {
        fontSize: 16,
        color: 'blue',
        fontWeight: 'bold',
    },
    recommendedProductPrice: {
        fontSize: 14,
        color: 'green',
    },
    recommendedProductDescription: {
        fontSize: 14,
        color: '#555',
    },
    bottomNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
        backgroundColor: '#6200ea',
    },
    bottomNavButton: {
        padding: 10,
    },
    bottomNavText: {
        color: '#fff',
        fontSize: 16,
    },
    cartOps: {
        flexDirection: "column",
        marginTop: 20
        // justifyContent: "space-around"
    },
    cartBtn: {
        marginTop: 4,
        backgroundColor: "#4B0082",
        color: "white",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4
    },
    cartTxt: {
        color: "white",
        textAlign: "center"
    },
    priceView: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    originalPriceTxt: {
        fontSize: 18
    },
    plusMinus: {
        backgroundColor: "#4B0082",
        width: 24,
        height: 30,
        borderRadius: 4
    },
    plusMinusTxt: {
        fontSize: 20,
        textAlign: "center",
        color: "white"
    },
    Price: {
        color: "#4B0082",
        fontWeight: "bold"
    }
});

export default ProductDetails;
