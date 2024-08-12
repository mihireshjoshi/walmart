import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QRCodeScanner = ({ route, navigation }) => {
    const { onScan } = route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleQRCodeScanned = ({ data }) => {
        if (!scanned) {
            setScanned(true);
            if (onScan) {
                onScan(data); // Pass the scanned data back to the previous screen
            }
            navigation.goBack();
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleQRCodeScanned}
                style={{ flex: 1 }}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]} // Specify QR code scanning
            />
        </View>
    );
};

export default QRCodeScanner;
