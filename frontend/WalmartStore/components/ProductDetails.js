import React, { useContext, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CartContext } from '../context/CartContext';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icons

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
            <ScrollView style={styles.detailsContainer}>
                <View style={styles.mainBox}>
                    <View style={{flexDirection: "row", alignItems: "start", justifyContent: "space-between"}}>
                        <View style={{flexDirection: "column"}}>
                            <Text style={styles.title}>{product.name}</Text>
                            <Text style={styles.description}>{product.description}</Text>
                        </View>
                        <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={decreaseQuantity} style={styles.plusMinus}>
                            <Icon name="minus" size={12} color="#fff" />
                            {/* <Text style={styles.plusMinusTxt}>-</Text> */}
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity onPress={increaseQuantity} style={styles.plusMinus}>
                            <Icon name="plus" size={12} color="#fff" />
                            {/* <Text style={styles.plusMinusTxt}>+</Text> */}
                        </TouchableOpacity>
                        
                        {/* <Button title="-" onPress={decreaseQuantity} />
                        <Text style={styles.quantity}>{quantity}</Text>
                        <Button title="+" onPress={increaseQuantity} /> */}
                    </View>
                    </View>
                    


                    

                    

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

                    

                    <View style={styles.cartOps}>
                        <TouchableOpacity onPress={handleAddToCart} style={styles.goCartBtn}>
                            <Text style={styles.goCartTxt}>Add to Cart</Text>
                            <Icon name="shopping-cart" size={16} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBtn}>
                            <Text style={styles.cartTxt}>Go to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Display recommended products */}
                {product.recommendations && product.recommendations.length > 0 && (
                    <View style={styles.recommendationsContainer}>
                        <Text style={styles.recommendationsTitle}>Recommended Products</Text>
                        <FlatList
                            data={product.recommendations}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.recContain}>
                                    <View style={styles.recommendedProductContainer}>
                                        <Text style={styles.recommendedProductName}>{item.Name}</Text>
                                        <Text style={styles.recommendedProductDescription}>{item.Description}</Text>
                                    </View>
                                    <Text style={styles.recommendedProductPrice}>${item.Price}</Text>
                                </View>
                            )}
                            horizontal={true} // Enables horizontal scrolling
                            showsHorizontalScrollIndicator={false} // Hides the scroll bar (optional)
                        />
                    </View>
                )}
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
            </ScrollView>
            
            {/* Bottom Navigation Bar */}
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'space-between',
        backgroundColor: "#E7ECEF"
    },
    detailsContainer: {
        padding: 10,
    },
    mainBox: {
        // backgroundColor: "#E6E6FA",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 12,
        shadowOpacity: 0.15
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
        color: '#415B6E',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    quantity: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: "#C9D7DF",
        color: "#002E4F",
        fontWeight: "bold"
    },
    recommendationsContainer: {
        marginTop: 8,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 12,
        shadowOpacity: 0.15
    },
    recommendationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recContain: {
        flexDirection: "row",
        margin: 10,
        width: 240,
        justifyContent: "space-between",
        backgroundColor: "#D7E7F3",
        padding: 12,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#000000",
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 0.15
    },
    recommendedProductContainer: {
        // marginTop: 10,
        flexDirection: "column",
        flex: 1
    },
    recommendedProductName: {
        fontSize: 16,
        color: '#002E4F',
        fontWeight: 'bold',
    },
    recommendedProductPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#2581C4',
    },
    recommendedProductDescription: {
        fontSize: 14,
        color: '#555',
        flexShrink: 1
    },
    bottomNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12
        // padding: 12,
    },
    bottomNavButton: {
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 8,
        backgroundColor: "#002E4F"
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
    goCartBtn: {
        flexDirection: "row",
        marginTop: 4,
        backgroundColor: "#002E4F",
        color: "white",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
        justifyContent: "center",
        gap: 6
    },
    cartBtn: {
        flexDirection: "row",
        marginTop: 4,
        borderWidth: 2,
        borderColor: "#002E4F",
        // backgroundColor: "#4B0082",
        color: "#4B0082",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
        justifyContent: "center",
        gap: 6
    },
    goCartTxt: {
        color: "white",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold"
    },
    cartTxt: {
        color: "#002E4F",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold"
    },
    priceView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4
    },
    originalPriceTxt: {
        fontSize: 18
    },
    plusMinus: {
        backgroundColor: "#002E4F",
        width: 24,
        height: 30,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center"
    },
    plusMinusTxt: {
        fontSize: 20,
        textAlign: "center",
        color: "white"
    },
    Price: {
        color: "#002E4F",
        fontWeight: "bold"
    }
});

export default ProductDetails;
