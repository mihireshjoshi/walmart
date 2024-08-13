import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const QueueStatus = ({ route }) => {
    const { queueInfo } = route.params;
    const [timeRemaining, setTimeRemaining] = useState(queueInfo.estimated_time);
    const navigation = useNavigation();

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

    const handleBackToHome = () => {
        navigation.navigate('Home'); // Assuming 'Home' is your landing page
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Queue Status</Text>
            <Text style={styles.infoText}>Queue Name: {queueInfo.queue_name}</Text>
            {timeRemaining > 0 ? (
                <Text style={styles.infoText}>Estimated Wait Time: {timeRemaining} seconds</Text>
            ) : (
                <Text style={styles.infoText}>You can now proceed to the queue.</Text>
            )}
            <Button title="Back to Home" onPress={handleBackToHome} />
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
});

export default QueueStatus;
