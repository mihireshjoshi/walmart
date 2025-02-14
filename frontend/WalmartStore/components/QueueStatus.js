import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import SvgQRCode from 'react-native-qrcode-svg';
import { CartContext } from '../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QueueStatus = ({ route }) => {
    const queueInfo = route?.params?.queueInfo || {};  // Safe access to route.params
    const [timeRemaining, setTimeRemaining] = useState(queueInfo.estimated_time || 0);  // Use default value if undefined
    const navigation = useNavigation();
    const { cart, clearCart } = useContext(CartContext);

    useEffect(() => {
        const calculateRemainingTime = async () => {
            const allocationTime = await AsyncStorage.getItem('allocationTime');
            if (allocationTime) {
                const elapsed = Math.floor((Date.now() - parseInt(allocationTime, 10)) / 1000);
                const remaining = (queueInfo.estimated_time || 0) - elapsed;  // Use default value if undefined
                setTimeRemaining(remaining > 0 ? remaining : 0);
            }
        };

        calculateRemainingTime();

        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);

            return () => clearInterval(timer);
        } else {
            // When timeRemaining reaches 0, clear the stored queue info
            AsyncStorage.removeItem('queueInfo');
            AsyncStorage.removeItem('allocationTime');
        }
    }, [timeRemaining]);

    const handleDoneShopping = () => {
        clearCart();  // Clear the cart
        navigation.navigate('LandingPage');  // Redirect to home page
    };

    const radius = 60;
    const strokeWidth = 10;
    const circleLength = 2 * Math.PI * radius;
    const progress = (timeRemaining / (queueInfo.estimated_time || 1)) * circleLength;  // Avoid division by 0

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Prepare cart details in JSON format for the QR code
    const cartDetails = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));

    // Convert cart details to JSON string
    const cartDetailsJSON = JSON.stringify(cartDetails);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Queue Status</Text>
            <Text style={styles.infoText}>Queue Name: {queueInfo.queue_name || "Unknown"}</Text>

            {timeRemaining > 0 ? (
                <>
                    <View style={styles.timerContainer}>
                        <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
                            <Circle
                                cx={radius + strokeWidth / 2}
                                cy={radius + strokeWidth / 2}
                                r={radius}
                                stroke="#e0e0e0"
                                strokeWidth={strokeWidth}
                                fill="none"
                            />
                            <Circle
                                cx={radius + strokeWidth / 2}
                                cy={radius + strokeWidth / 2}
                                r={radius}
                                stroke="#00aaff"
                                strokeWidth={strokeWidth}
                                strokeDasharray={circleLength}
                                strokeDashoffset={circleLength - progress}
                                fill="none"
                                rotation="-90"
                                originX={radius + strokeWidth / 2}
                                originY={radius + strokeWidth / 2}
                            />
                            <SvgText
                                x={radius + strokeWidth / 2}
                                y={radius + strokeWidth / 2}
                                fontSize="20"
                                fill="#000"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                {formattedTime}
                            </SvgText>
                        </Svg>
                    </View>
                    <Text style={styles.infoText}>Estimated Wait Time: {formattedTime} minutes</Text>
                </>
            ) : (
                <View style={styles.doneContainer}>
                    <Text style={styles.doneText}>You can now proceed to the queue.</Text>
                    {/* Use cartDetailsJSON for the QR code */}
                    <SvgQRCode value={cartDetailsJSON} size={150} />
                    <Button title="Done Shopping" onPress={handleDoneShopping} />
                </View>
            )}

            {/* <Button title="Back to Home" onPress={() => navigation.navigate('LandingPage')} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        marginVertical: 10,
    },
    timerContainer: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    doneText: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default QueueStatus;
