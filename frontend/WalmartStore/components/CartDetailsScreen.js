import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const CartDetailsScreen = ({ route }) => {
    const { cartDetails } = route.params;
    const navigation = useNavigation(); // Initialize navigation hook

    // Calculate the total amount in the cart
    const totalAmount = cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.qtyCost}>
                <Text style={styles.itemDetails}>Qty: <Text style={styles.valPrice}>{item.quantity}</Text></Text>
                <Text style={styles.valPriceBase}>Rs {item.price.toFixed(2)}/-</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.qtyCost}>
                <Text style={styles.itemDetailsBoss}>Subtotal:</Text>
                <Text style={styles.valPrice}>Rs {(item.price * item.quantity).toFixed(2)} /-</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <CustomHeader title="Scanner" />
            <View style={styles.itemsBox}>
                <FlatList
                    data={cartDetails}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderCartItem}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>

            {/* Total Amount */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalAmountText}>Total Amount:</Text>
                <Text style={styles.totalAmountValue}>Rs {totalAmount.toFixed(2)}/-</Text>
            </View>

            {/* Next Customer Button */}
            <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.navigate('ScanningCashier')}
            >
                <Text style={styles.buttonText}>Next Customer</Text>
            </TouchableOpacity>
        </View>
    );
};

// Common styles shared between Cart.js and CartDetailsScreen.js
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
    totalContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginVertical: 10,
        alignItems: 'center',
    },
    totalAmountText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    totalAmountValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#002E4F',
        marginTop: 5,
    },
    nextButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#002E4F',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    qtyCost: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    valPriceBase: {
        fontWeight: 'bold',
        color: '#6688A1',
    },
    valPrice: {
        fontWeight: 'bold',
        color: '#002E4F',
        fontSize: 16,
    },
    line: {
        height: 0.4,
        backgroundColor: '#002E4F',
        width: '100%',
        marginTop: 6,
    },
    itemsBox: {
        backgroundColor: 'white',
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderRadius: 12,
    },
});

export default CartDetailsScreen;
