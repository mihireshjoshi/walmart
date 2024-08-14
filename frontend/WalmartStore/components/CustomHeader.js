
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CustomHeader = ({ title }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#002E4F', // Background color
        borderBottomWidth: 1,
        borderBottomColor: '#DCDCDC', // Bottom border color
        borderRadius: 10, // Rounded corners
        elevation: 5,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18, // Font size for title
        color: 'white', // Title text color
        fontWeight: 'bold',
        flex: 1, // Takes up remaining space
    },
});

export default CustomHeader;
