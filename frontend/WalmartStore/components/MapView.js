import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Svg, Rect, Line, G, Path, Image } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
import { aStar } from './pathfindingUtils'; 
import { generateDirections } from './directionsUtils'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const buyerIconWidth = 40; // Width of the image
const buyerIconHeight = 43; // Heigh of Image
const locationIconWidth = 43; // Width of the image
const locationIconHeight = 43; // Height of the image
const gridSize = 30; // Adjusting grid size for larger layout

// Store layout
const storeLayout = [
  [2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 3, 3, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0],
  [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [6, 0, 7, 7, 7, 0, 8, 8, 8, 0, 9, 9, 9, 0, 10, 10, 10, 0, 11, 0, 12, 0],
  [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 12, 0],
  [6, 0, 13, 14, 0, 15, 16, 0, 17, 18, 0, 19, 20, 0, 21, 22, 0, 0, 0, 0, 0, 0],
  [6, 0, 13, 14, 0, 15, 16, 0, 17, 18, 0, 19, 20, 0, 21, 22, 0, 23, 23, 23, 23, 0],
  [6, 0, 13, 14, 0, 15, 16, 0, 17, 18, 0, 19, 20, 0, 21, 22, 0, 23, 23, 23, 23, 0],
  [6, 0, 13, 14, 0, 15, 16, 0, 17, 18, 0, 19, 20, 0, 21, 22, 0, 0, 0, 0, 0, 0],
  [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 99, 0, 99, 0, 0, 0, 0, 0],
  [6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 99, 0, 99, 0, 0, 0, 0, 0],
];

// Locations for sections and features
const locations = {
  "Entrance": { x: 3, y: 11 },
  "Checkout 1": { x: 13, y: 10 },
  "Checkout 2": { x: 15, y: 10 },
  "Checkout 3": { x: 17, y: 10 },
  "Section 2": { x: 0, y: 0 },
  "Section 3": { x: 7, y: 0 },
  "Section 4": { x: 13, y: 0 },
  "Section 6": { x: 0, y: 1 },
  "Section 7": { x: 2, y: 2 },
  "Section 8": { x: 6, y: 2 },
  "Section 9": { x: 10, y: 2 },
  "Section 10": { x: 14, y: 2 },
  "Section 11": { x: 18, y: 3 },
  "Section 12": { x: 20, y: 3 },
  "Section 13": { x: 2, y: 4 },
  "Section 14": { x: 3, y: 4 },
  "Section 15": { x: 5, y: 4 },
  "Section 16": { x: 6, y: 4 },
  "Section 17": { x: 8, y: 4 },
  "Section 18": { x: 9, y: 4 },
  "Section 19": { x: 11, y: 4 },
  "Section 20": { x: 12, y: 4 },
  "Section 21": { x: 14, y: 4 },
  "Section 22": { x: 15, y: 4 },
  "Section 23": { x: 18, y: 5 },
};

const sectionColors = {
  1: "#85A7D0",    // Updated color
  99: "#85A7D0",   // Updated color
  2: "#85A7D0",    // Updated color
  3: "#85A7D0",    // Updated color
  4: "#85A7D0",    // Updated color
  6: "#85A7D0",    // Updated color
  7: "#85A7D0",    // Updated color
  8: "#85A7D0",    // Updated color
  9: "#85A7D0",    // Updated color
  10: "#85A7D0",   // Updated color
  11: "#85A7D0",   // Updated color
  12: "#85A7D0",   // Updated color
  13: "#85A7D0",   // Updated color
  14: "#85A7D0",   // Updated color
  15: "#85A7D0",   // Updated color
  16: "#85A7D0",   // Updated color
  17: "#85A7D0",   // Updated color
  18: "#85A7D0",   // Updated color
  19: "#85A7D0",   // Updated color
  20: "#85A7D0",   // Updated color
  21: "#85A7D0",   // Updated color
  22: "#85A7D0",   // Updated color
  23: "#85A7D0",   // Updated color
};

const colors = {
  0: 'white',  // Walkable paths
};

const MapView = ({ navigation, route }) => {
  const { userPosition } = useSelector((state) => state.position);
  const [path, setPath] = useState([]);
  const [source, setSource] = useState(locations["Entrance"]);
  const [destination, setDestination] = useState(locations["Section 2"]); // Default destination
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    const getProductSectionFromAsyncStorage = async () => {
      try {
        const productSection = await AsyncStorage.getItem('product_section');
        if (productSection && locations[productSection]) {
          setSource(locations[productSection]);
        }
      } catch (error) {
        console.error("Failed to get product section from AsyncStorage:", error);
      }
    };

    getProductSectionFromAsyncStorage();
  }, [route.params]);

  useEffect(() => {
    const start = source ? source : { x: 0, y: 0 };
    const newPath = aStar(start, destination, storeLayout);
    setPath([start, ...newPath]);
    setDirections(generateDirections(newPath));
  }, [source, destination]);

  const handleSourceChange = (itemValue) => {
    setSource(locations[itemValue]);
  };

  const handleDestinationChange = (itemValue) => {
    setDestination(locations[itemValue]);
  };

  const markerIcon = (
    <Path
      d="M12 2C7.588 2 4 5.588 4 10c0 6.082 7.347 11.908 7.623 12.123a1 1 0 0 0 1.153 0C13.653 21.908 21 16.082 21 10c0-4.412-3.588-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
      fill="red"
    />
  );

  const lastPathBlock = path.length > 0 ? path[path.length - 1] : source;

  return (
    <View>
      <ScrollView horizontal style={styles.container}>
        <ScrollView style={styles.container}>
        
          <Svg
            height={storeLayout.length * gridSize}
            width={storeLayout[0].length * gridSize}
            viewBox={`0 0 ${storeLayout[0].length * gridSize} ${storeLayout.length * gridSize}`}
          >
            {storeLayout.map((row, y) =>
              row.map((cell, x) => {
                let fillColor = colors[cell];
                if (sectionColors[cell]) {
                  fillColor = sectionColors[cell];
                }
                return (
                  <Rect
                    key={`${x}-${y}`}
                    x={x * gridSize}
                    y={y * gridSize}
                    width={gridSize}
                    height={gridSize}
                    fill={fillColor}
                    stroke="grey"
                  />
                );
              })
            )}

            {path.map((point, index) => (
              index > 0 && (
                <Line
                  key={`${index}-${point.x}-${point.y}`}
                  x1={path[index - 1].x * gridSize + gridSize / 2}
                  y1={point.y * gridSize + gridSize / 2}
                  x2={point.x * gridSize + gridSize / 2}
                  y2={point.y * gridSize + gridSize / 2}
                  stroke="#0B2D56"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            ))}

            {/* Start Marker */}
            <G
              transform={`translate(${source.x * gridSize + gridSize / 2 - buyerIconWidth / 2}, ${source.y * gridSize + gridSize / 2 - buyerIconHeight / 2})`}
            >
              <Image
                href={require('../assets/buyer.png')} // Path to the image
                width={buyerIconWidth} 
                height={buyerIconHeight}
              />
            </G>

            {/* Destination Marker on the last path block */}
            <G
              transform={`translate(${lastPathBlock.x * gridSize + gridSize / 2 - locationIconWidth / 2}, ${lastPathBlock.y * gridSize + gridSize / 2 - locationIconHeight / 2})`}
            >
              <Image
                href={require('../assets/location.png')} // Path to the image
                width={locationIconWidth} 
                height={locationIconHeight}
              />
            </G>
          </Svg>
        </ScrollView>
      </ScrollView>
      <View>
        <View style={styles.topPop}>
          <View style={styles.optPop}>
            <View style={styles.select}>

              <Text>Source</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={Object.keys(locations).find(key => locations[key] === source)}
                  onValueChange={handleSourceChange}
                >
                  {Object.keys(locations).map((key) => (
                    <Picker.Item label={key} value={key} key={key} />
                  ))}
                </Picker>
              </View>

            </View>

            <View style={styles.select}>

              <Text>Destination</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={Object.keys(locations).find(key => locations[key] === destination)}
                  onValueChange={handleDestinationChange}
                >
                  {Object.keys(locations).map((key) => (
                    <Picker.Item label={key} value={key} key={key} />
                  ))}
                </Picker>
              </View>

            </View>

          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('QRScanner');
            }}
            style={styles.qrButton}
          >
            <Text style={styles.qrTxt}>Scan your current location QR</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "auto",
    zIndex: -1
  },
  topPop: {
    width: Dimensions.get('window').width,
    backgroundColor: "#eeeeee",
    zIndex: 1,
    elevation: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  optPop: {
    flexDirection: "row",
    padding: 10,
  },
  select: {
    width: 160,
    margin: 4,
    padding: 6,
    marginHorizontal: "auto",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2
  },
  picker: {
    padding: 0,
    backgroundColor: "#CFDDEF",
    borderRadius: 4
  },
  qrButton: {
    marginHorizontal: 14,
    backgroundColor: "#266BBC",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 120,
    marginTop: 12,
    elevation: 1
  },
  qrTxt: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  }
});

export default MapView;
