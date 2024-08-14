import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const RewardSplashScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = new Animated.Value(0);
    const { clearCart } = useContext(CartContext);

    useEffect(() => {
        const handleRewardsAndNavigation = async () => {
            // Animate the splash screen
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start(async () => {
                // Wait for 2 seconds
                setTimeout(async () => {
                    // Clear the cart
                    clearCart();

                    // Add 15 coins to the virtual rewards
                    const storedCoins = await AsyncStorage.getItem('virtualCoins');
                    const newCoinBalance = (parseInt(storedCoins) || 30) + 15;
                    await AsyncStorage.setItem('virtualCoins', newCoinBalance.toString());

                    // Navigate back to the home screen
                    navigation.navigate('LandingPage');
                }, 2000);  // Show splash screen for 2 seconds
            });
        };

        handleRewardsAndNavigation();
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ ...styles.splash, opacity: fadeAnim }}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' }}  // Coin icon
                    style={styles.coinImage}
                />
                <Text style={styles.splashText}>You've earned 15 coins!</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6200ea',
        alignItems: 'center',
        justifyContent: 'center',
    },
    splash: {
        alignItems: 'center',
    },
    coinImage: {
        width: 100,
        height: 100,
    },
    splashText: {
        fontSize: 24,
        color: '#fff',
        marginTop: 20,
    },
});

export default RewardSplashScreen;
