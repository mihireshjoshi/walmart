import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
//import { API_URL } from '@env';
import { useFocusEffect } from '@react-navigation/native';

//console.log(API_URL);

const BarcodeScanner = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scanned, setScanned] = useState(false); // Add scanned state

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            setLoading(false);
        })();
    }, []);

    // Reset the scanned state when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            setScanned(false); // Reset scanned state when screen is focused
            return () => setScanned(false); // Optional cleanup if needed
        }, [])
    );

    const onBarcodeScanned = ({ data }) => {
        if (!scanned) { // Check if already scanned
            setScanned(true); // Mark as scanned
            setLoading(true);
            const requestUrl = `http://192.168.10.8:8000/product/${data}`;
            //console.log('Request URL:', requestUrl); // Log the URL
            //console.log('Barcode Data:', data);      // Log the barcode data

            axios.get(requestUrl)
                .then(response => {
                    const product = response.data;
                    console.log(response.data);
                    navigation.navigate("ProductDetails", { product }); // Directly navigate to ProductDetails
                })
                .catch(error => {
                    console.error('Error:', error); // Log the error to debug
                    Alert.alert('Error', 'Product not found');
                })
                .finally(() => setLoading(false));
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : onBarcodeScanned} // Disable scanning after first scan
                style={{ flex: 1 }}
            />
        </View>
    );
};

export default BarcodeScanner;
