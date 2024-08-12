import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const ProductNavigation = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const navigation = useNavigation();

    const handleNavigate = () => {
        if (source && destination) {
            Alert.alert('Navigation', `Navigating from ${source} to ${destination}`);
        } else {
            Alert.alert('Error', 'Please select both source and destination');
        }
    };

    const handleQRCodeScan = () => {
        navigation.navigate('QRCodeScanner', {
            onScan: (scannedData) => setSource(scannedData),
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Navigate Your Products</Text>

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Source:</Text>
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={handleQRCodeScan}
                >
                    <Text style={styles.scanButtonText}>Scan QR Code</Text>
                </TouchableOpacity>
                <Picker
                    selectedValue={source}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSource(itemValue)}
                >
                    <Picker.Item label="Select Source" value="" />
                    <Picker.Item label="Entrance" value="entrance" />
                    <Picker.Item label="Aisle 1" value="aisle1" />
                    <Picker.Item label="Aisle 2" value="aisle2" />
                </Picker>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Destination:</Text>
                <Picker
                    selectedValue={destination}
                    style={styles.picker}
                    onValueChange={(itemValue) => setDestination(itemValue)}
                >
                    <Picker.Item label="Select Destination" value="" />
                    <Picker.Item label="Exit" value="exit" />
                    <Picker.Item label="Checkout" value="checkout" />
                    <Picker.Item label="Aisle 3" value="aisle3" />
                </Picker>
            </View>

            <TouchableOpacity
                style={styles.navigateButton}
                onPress={handleNavigate}
            >
                <Text style={styles.navigateButtonText}>Navigate</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    pickerContainer: {
        marginVertical: 15,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    scanButton: {
        backgroundColor: '#6200ea',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    navigateButton: {
        backgroundColor: '#6200ea',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    navigateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProductNavigation;
