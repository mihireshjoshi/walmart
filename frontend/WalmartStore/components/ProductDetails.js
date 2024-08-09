import React, { useContext, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
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
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    const totalPrice = product.price * quantity;

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24 }}>{product.name}</Text>
            <Text style={{ fontSize: 18 }}>Price: {totalPrice.toFixed(2)}</Text>
            <Text>{product.description}</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Button title="-" onPress={decreaseQuantity} />
                <Text style={{ fontSize: 18, marginHorizontal: 10 }}>{quantity}</Text>
                <Button title="+" onPress={increaseQuantity} />
            </View>
            <Button title="Add to Cart" onPress={handleAddToCart} style={{ marginTop: 20 }} />
            <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} />
        </View>
    );
};

export default ProductDetails;
