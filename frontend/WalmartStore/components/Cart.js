import React, { useContext } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const { cart, clearCart } = useContext(CartContext);

    // Calculate the total price of all items in the cart
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const renderItem = ({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Total Price: {(item.price * item.quantity).toFixed(2)}</Text>
        </View>
    );

    const handleCheckout = () => {
        Alert.alert(
            'Checkout',
            `Total Price: ${totalPrice.toFixed(2)}\nProceed to checkout?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK', onPress: () => {
                        clearCart();
                        Alert.alert('Success', 'Your order has been placed!');
                    }
                },
            ]
        );
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
            <View style={{ marginVertical: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                    Total: {totalPrice.toFixed(2)}
                </Text>
            </View>
            <Button title="Checkout" onPress={handleCheckout} />
            <Button title="Clear Cart" onPress={clearCart} style={{ marginTop: 10 }} />
        </View>
    );
};

export default Cart;
