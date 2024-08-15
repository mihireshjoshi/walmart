
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, SectionList, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import API_URL from './apiurl';
import CustomHeader from '../components/CustomHeader';

const Cart = () => {
    const { cart, totalAmount } = useContext(CartContext);
    const [queueInfo, setQueueInfo] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const checkQueueStatus = async () => {
            const storedQueueInfo = await AsyncStorage.getItem('queueInfo');
            if (storedQueueInfo) {
                setQueueInfo(JSON.parse(storedQueueInfo));
            }
        };
        checkQueueStatus();
    }, []);

    const handleStripeCheckout = async () => {
        try {
            navigation.navigate('RewardSplashScreen');
        } catch (error) {
            console.error('Stripe payment error:', error);
            Alert.alert('Payment Error', 'Something went wrong with the payment.');
        }
    };

    // const handleCounterCheckout = async () => {
    //     if (queueInfo && queueInfo.estimated_time > 0) {
    //         Alert.alert('Queue Already Allocated', `You are already in ${queueInfo.queue_name} with an estimated wait time of ${queueInfo.estimated_time} seconds.`);
    //         navigation.navigate('QueueStatus', { queueInfo });
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(`${API_URL}/allocate_queue`);
    //         const queueData = response.data;
    //         setQueueInfo(queueData);

    //         // Save queue info and allocation time in AsyncStorage
    //         await AsyncStorage.setItem('queueInfo', JSON.stringify(queueData));
    //         await AsyncStorage.setItem('allocationTime', Date.now().toString());

    //         if (queueData.estimated_time === 0) {
    //             Alert.alert('Queue Allocated', `You have been directly allocated to ${queueData.queue_name}.`);
    //         } else {
    //             Alert.alert('Queue Allocated', `You have been allocated to ${queueData.queue_name} with an estimated wait time of ${queueData.estimated_time} seconds.`);
    //         }
    //         navigation.navigate('QueueStatus', { queueInfo: queueData });
    //     } catch (error) {
    //         console.error('Error during checkout:', error);
    //         Alert.alert('Error', 'Could not allocate queue. Please try again later.');
    //     }
    // };
    const handleCounterCheckout = async () => {
        if (queueInfo && queueInfo.estimated_time > 0) {
            Alert.alert('Queue Already Allocated', `You are already in ${queueInfo.queue_name} with an estimated wait time of ${queueInfo.estimated_time} seconds.`);
            navigation.navigate('QueueStatus', { queueInfo });
            return;
        }
    
        try {
            const response = await axios.post(`${API_URL}/allocate_queue`);
            const queueData = response.data;
            setQueueInfo(queueData);
    
            // Save queue info and allocation time in AsyncStorage
            await AsyncStorage.setItem('queueInfo', JSON.stringify(queueData));
            await AsyncStorage.setItem('allocationTime', Date.now().toString());
    
            if (queueData.estimated_time === 0) {
                Alert.alert('Queue Allocated', `You have been directly allocated to ${queueData.queue_name}.`);
            } else {
                Alert.alert('Queue Allocated', `You have been allocated to ${queueData.queue_name} with an estimated wait time of ${queueData.estimated_time} seconds.`);
            }
    
            // Navigate to MapView and pass the queue info
            navigation.navigate('MapView', { queueInfo: queueData });
        } catch (error) {
            console.error('Error during checkout:', error);
            Alert.alert('Error', 'Could not allocate queue. Please try again later.');
        }
    };
    
    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.qtyCost}>
                <Text style={styles.itemDetails}>Qty: <Text style={styles.valPrice}>{item.quantity}</Text></Text>
                <Text style={styles.valPriceBase}>Rs {item.price.toFixed(2)}/-</Text>
            </View>
            <View style={styles.line}/>
            <View style={styles.qtyCost}>
                <Text style={styles.itemDetailsBoss}>Subtotal:</Text>
                <Text style={styles.valPrice}>Rs { (item.price * item.quantity).toFixed(2) }/-</Text>
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <CustomHeader title="Your Cart" />
            {cart && cart.length > 0 ? (
                <View>
                    <View style={styles.itemsBox}>
                        <FlatList
                            data={cart}
                            keyExtractor={(item, index) => index.toString()}  // Ideally, use a unique key like item.id
                            renderItem={renderCartItem}
                            // ListFooterComponent={renderFooter}  // Renders the footer at the bottom
                            contentContainerStyle={{ flexGrow: 1 }}
                        />
                    </View>
                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.totalAmount}>Total Amount:</Text>
                            <Text style={styles.finalePrice}>Rs {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}/-</Text>
                        </View>
                        <View style={styles.payUse}>
                            <Text style={{fontSize: 14, fontWeight: "600"}}>Pay using</Text>
                            <View style={styles.payOps}>
                                <TouchableOpacity style={styles.button} onPress={handleStripeCheckout}>
                                    <Text style={styles.buttonText}>Stripe</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handleCounterCheckout}>
                                    <Text style={styles.buttonText}>Counter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                
                
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
        backgroundColor: '#E7ECEF',
    },
    cartItem: {
        padding: 8,
        marginVertical: 4,
        borderRadius: 10,
        backgroundColor: '#E6EDF2',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        // elevation: 3,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemDetails: {
        fontSize: 16,
        marginTop: 5,
        color: '#666',
    },
    itemDetailsBoss: {
        fontSize: 16,
        marginTop: 5,
        color: '#666',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    footer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginVertical: 10,
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
    button: {
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 60,
        backgroundColor: '#002E4F',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 4
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    qtyCost: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    valPriceBase: {
        fontWeight: "bold",
        color: "#6688A1"
    },
    valPrice: {
        fontWeight: "bold",
        color: "#002E4F",
        fontSize: 16
    },
    line: {
        height: 0.4,
        backgroundColor: "#002E4F",
        width: "100%",
        marginTop: 6
    },
    itemsBox: {
        backgroundColor: "white",
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderRadius: 12,
    },
    finalePrice: {
        fontSize: 36,
        fontWeight: "900",
        textAlign: "center",
        color: "#002E4F",
        marginVertical: 12
    },
    payUse: {
        padding: 6,
        backgroundColor: "#E6EDF2",
        borderRadius: 6
    },
    payOps: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
});

export default Cart;
