import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QueueStatus = ({ route }) => {
    const { queueInfo } = route.params;
    const [remainingTime, setRemainingTime] = useState(queueInfo.estimated_time);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(timer);
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Queue Name: {queueInfo.queue_name}</Text>
            <Text style={styles.subtitle}>Estimated Time: {queueInfo.estimated_time} seconds</Text>
            <Text style={styles.timer}>Time Remaining: {remainingTime} seconds</Text>
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
    },
    subtitle: {
        fontSize: 18,
        marginVertical: 10,
    },
    timer: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
        color: 'red',
    },
});

export default QueueStatus;
