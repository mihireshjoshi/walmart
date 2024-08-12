import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
    const navigation = useNavigation();

    const sections = [
        {
            id: '1',
            title: 'Clothing',
            products: [
                { id: '1', name: 'T-Shirt', price: '₹300', description: 'Comfortable cotton t-shirt' },
                { id: '2', name: 'Jeans', price: '₹1200', description: 'Stylish denim jeans' },
                { id: '3', name: 'Jacket', price: '₹2500', description: 'Warm winter jacket' },
            ],
        },
        {
            id: '2',
            title: 'Electronics',
            products: [
                { id: '4', name: 'Smartphone', price: '₹15000', description: 'Latest Android smartphone' },
                { id: '5', name: 'Laptop', price: '₹50000', description: 'High-performance laptop' },
                { id: '6', name: 'Headphones', price: '₹2000', description: 'Noise-cancelling headphones' },
            ],
        },
        {
            id: '3',
            title: 'Cooking',
            products: [
                { id: '7', name: 'Non-stick Pan', price: '₹500', description: 'Durable non-stick pan' },
                { id: '8', name: 'Spatula Set', price: '₹150', description: 'Heat-resistant spatulas' },
            ],
        },
        {
            id: '4',
            title: 'Daily Essentials',
            products: [
                { id: '9', name: 'Toothpaste', price: '₹90', description: 'Teeth whitening toothpaste' },
                { id: '10', name: 'Shampoo', price: '₹150', description: 'Anti-dandruff shampoo' },
                { id: '11', name: 'Soap', price: '₹30', description: 'Moisturizing bath soap' },
            ],
        },
    ];

    const renderProductItem = ({ item }) => (
        <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Top Navigation Bar */}
            <View style={styles.topNavBar}>
                <Text style={styles.pageTitle}>Hi Mohammed!</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1170/1170576.png' }}
                            style={styles.iconImage}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                            style={styles.iconImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for products..."
                />
            </View>

            {/* Main Features */}
            <View style={styles.mainFeaturesContainer}>
                <TouchableOpacity
                    style={styles.featureButton}
                    onPress={() => navigation.navigate('ProductNavigation')}
                >
                    <Text style={styles.featureText}>Navigate Your Products</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.featureButton}
                    onPress={() => navigation.navigate('BarcodeScanner')}
                >
                    <Text style={styles.featureText}>Scan Your Products</Text>
                </TouchableOpacity>
            </View>

            {/* Sections */}
            <ScrollView style={styles.content}>
                {sections.map((section) => (
                    <View key={section.id} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <FlatList
                            data={section.products}
                            keyExtractor={(item) => item.id}
                            renderItem={renderProductItem}
                            horizontal={true} // Horizontal scroll
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalScroll}
                        />
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Navigation Bar */}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#6200ea',
    },
    pageTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 15,
    },
    iconImage: {
        width: 30,
        height: 30,
    },
    searchBarContainer: {
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    searchBar: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    mainFeaturesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        padding: 15,
    },
    featureButton: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: '#6200ea',
        paddingVertical: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    horizontalScroll: {
        paddingLeft: 10,
    },
    productCard: {
        width: 140,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: 'green',
    },
    productDescription: {
        fontSize: 12,
        color: '#777',
    },
    bottomNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
        backgroundColor: '#6200ea',
    },
    bottomNavButton: {
        padding: 10,
    },
    bottomNavText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default LandingPage;
