import React, { useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const ProductDetails = ({ route, navigation }) => {
    const { product } = route.params;
    const { addToCart } = React.useContext(CartContext);
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
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24 }}>{product.name}</Text>

            {product.sale_price && product.discount_percentage ? (
                <View>
                    <Text style={{ fontSize: 18, textDecorationLine: 'line-through', color: 'red' }}>
                        Original Price: ${parseFloat(product.price).toFixed(2)}
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>
                        Sale Price: ${parseFloat(product.sale_price).toFixed(2)} ({product.discount_percentage}% OFF)
                    </Text>
                </View>
            ) : (
                <Text style={{ fontSize: 18 }}>Price: ${parseFloat(product.price).toFixed(2)}</Text>
            )}

            <Text style={{ fontSize: 18 }}>Total: ${totalPrice.toFixed(2)}</Text>
            <Text>{product.description}</Text>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Button title="-" onPress={decreaseQuantity} />
                <Text style={{ fontSize: 18, marginHorizontal: 10 }}>{quantity}</Text>
                <Button title="+" onPress={increaseQuantity} />
            </View>

            <Button title="Add to Cart" onPress={handleAddToCart} style={{ marginTop: 20 }} />
            <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} />

            {/* Display recommended products */}
            {product.recommendations && product.recommendations.length > 0 && (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Recommended Products</Text>
                    <FlatList
                        data={product.recommendations}
                        keyExtractor={(item) => item.recommended_product_id.toString()}
                        renderItem={({ item }) => (
                            <Text
                                style={{ fontSize: 16, color: 'blue', marginTop: 10 }}
                                onPress={() => {
                                    // Navigate to ProductDetails for the recommended product
                                    // Assuming your backend has a product lookup by ID
                                    axios.get(`http://192.168.10.8:8000/product/${item.recommended_product_id}`).then((response) => {
                                        navigation.navigate("ProductDetails", { product: response.data });
                                    });
                                }}
                            >
                                {item.recommended_prod_name}
                            </Text>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

export default ProductDetails;
