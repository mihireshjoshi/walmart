import React, { useContext, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, SectionList } from 'react-native';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
    const { cart, totalAmount } = useContext(CartContext);
    const [queueInfo, setQueueInfo] = useState(null);
    const navigation = useNavigation();

    const handleStripeCheckout = () => {
        Alert.alert('Stripe Checkout', 'Stripe payment integration coming soon!');
    };

    const handleCounterCheckout = async () => {
        try {
            const response = await axios.post('http://192.168.169.78:8000/allocate_queue');
            const queueData = response.data;
            setQueueInfo(queueData);

            if (queueData.estimated_time === 0) {
                Alert.alert('Queue Allocated', `You have been directly allocated to ${queueData.queue_name}.`);
                navigation.navigate('QueueStatus', { queueInfo: queueData });
            } else {
                Alert.alert('Queue Allocated', `You have been allocated to ${queueData.queue_name} with an estimated wait time of ${queueData.estimated_time} seconds.`);
                navigation.navigate('QueueStatus', { queueInfo: queueData });
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            Alert.alert('Error', 'Could not allocate queue. Please try again later.');
        }
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemDetails}>Price: ${item.price.toFixed(2)}</Text>
            <Text style={styles.itemDetails}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {cart && cart.length > 0 ? (
                <SectionList
                    sections={[
                        { title: 'Cart Items', data: cart },
                        { title: 'Footer', data: [{ key: 'footer' }] }
                    ]}
                    renderItem={({ item, section }) =>
                        section.title === 'Cart Items' ? renderCartItem({ item }) : null
                    }
                    renderSectionFooter={({ section }) =>
                        section.title === 'Footer' ? (
                            <View style={styles.footer}>
                                <Text style={styles.totalAmount}>Total Amount: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</Text>
                                <Button title="Checkout using Stripe" onPress={handleStripeCheckout} />
                                <View style={styles.spacer} />
                                <Button title="Checkout using Counter" onPress={handleCounterCheckout} />
                            </View>
                        ) : null
                    }
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ flexGrow: 1 }}  // Ensures SectionList takes up full height
                />
            ) : (
                <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>Your cart is empty.</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    cartItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemDetails: {
        fontSize: 16,
        marginTop: 5,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    footer: {
        paddingTop: 20,
    },
    spacer: {
        height: 10,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 18,
        color: '#555',
    },
});

export default Cart;
