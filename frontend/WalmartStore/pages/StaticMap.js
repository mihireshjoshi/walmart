import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const StoreMap = () => {
    const [shoppingList, setShoppingList] = useState([
        { id: 1, name: 'Milk', position: { x: 300, y: 200 }, completed: false }, // Dairy section
        { id: 2, name: 'Bread', position: { x: 120, y: 220 }, completed: false }, // Snacks section
        { id: 3, name: 'Eggs', position: { x: 580, y: 380 }, completed: false }, // Dairy section
        { id: 4, name: 'Cookies', position: { x: 120, y: 260 }, completed: false }, // Snacks section
        { id: 5, name: 'Shirt', position: { x: 750, y: 200 }, completed: false }, // Clothing section
    ]);

    const entrancePosition = { x: 100, y: 700 }; // Entrance position (assuming at the bottom left corner)

    const handleItemPress = (item) => {
        setShoppingList(prevList =>
            prevList.map(i => i.id === item.id ? { ...i, completed: true } : i)
        );
    };

    const generatePath = () => {
        let path = `${entrancePosition.x},${entrancePosition.y}`;
        shoppingList.forEach(item => {
            path += ` ${item.position.x},${item.position.y}`;
        });
        return path.trim();
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('/Users/mihiresh/Mihiresh/Work/Walmart/walmart/frontend/WalmartStore/assets/map.png')}
                style={styles.map}
            />
            <Svg style={styles.svg}>
                <Polyline
                    points={generatePath()}
                    fill="none"
                    stroke="blue"
                    strokeWidth="5"
                />
            </Svg>
            {shoppingList.map(item => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => handleItemPress(item)}
                    style={[
                        styles.marker,
                        {
                            left: item.position.x,
                            top: item.position.y,
                            backgroundColor: item.completed ? 'green' : 'orange',
                        }
                    ]}
                >
                    <Text style={styles.markerText}>{item.name}</Text>
                </TouchableOpacity>
            ))}
            <FlatList
                data={shoppingList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleItemPress(item)}
                        style={styles.listItem}
                    >
                        <Text style={item.completed ? styles.completedText : styles.itemText}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    map: {
        width: '100%',
        height: '60%',
        resizeMode: 'contain',
    },
    marker: {
        position: 'absolute',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '60%',
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
        color: '#333',
    },
    completedText: {
        fontSize: 18,
        color: '#aaa',
        textDecorationLine: 'line-through',
    },
});

export default StoreMap;
