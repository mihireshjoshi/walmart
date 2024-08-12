import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfilePage = () => {
    const userProfile = {
        name: 'John Doe',
        contact: '+91 9876543210',
        email: 'johndoe@example.com',
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.info}>{userProfile.name}</Text>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.info}>{userProfile.contact}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{userProfile.email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default ProfilePage;
