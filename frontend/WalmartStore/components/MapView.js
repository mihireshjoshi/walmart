import React, { useEffect, useState } from "react";
import styles from "../customStyles/mapViewStyles";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import {
  Svg,
  Rect,
  Line,
  G,
  Image,
  Text as SvgText,
} from "react-native-svg";
import { Picker } from "@react-native-picker/picker";
import { aStar, findShortestPath } from "./pathfindingUtils";
import { generateDirections } from "./directionsUtils";
import {
  TouchableOpacity,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons
import QueueStatus from './QueueStatus'; // Ensure the correct relative path


// Constants for dimensions
const buyerIconWidth = 40;
const buyerIconHeight = 43;
const locationIconWidth = 43;
const locationIconHeight = 43;
const windowWidth = Dimensions.get("window").width;
const gridSize = 30;

const storeLayout = [
  [0, "Clothing", "Clothing", "Clothing", "Clothing", "Clothing", "Clothing", "Clothing", "Clothing", "Clothing", "Clothing", "Clothing", "Clothing", "Clothing", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "Entrance"],
  [0, "Shoes", "Shoes", "Shoes", "Shoes", "Shoes", "Shoes", 0, "Dairy", "Dairy", "Dairy", "Dairy", "Dairy", "Dairy", 0, 0, 0, "Entrance"],
  [0, "Toys", "Toys", "Toys", "Toys", "Toys", "Toys", 0, "Bakery", "Bakery", "Bakery", "Bakery", "Bakery", "Bakery", 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "Snacks", "Snacks", "Snacks", "Snacks", "Snacks", "Snacks", 0, "Meat", "Meat", "Meat", "Meat", "Meat", "Meat", 0, 0, 0, "Entrance"],
  [0, "Beauty", "Beauty", "Beauty", "Beauty", "Beauty", "Beauty", 0, "Sporting Goods", "Sporting Goods", "Sporting Goods", "Sporting Goods", "Sporting Goods", "Sporting Goods", 0, 0, 0, "Entrance"],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Entrance", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", "Electronics", 0, 0, 0]
];

// Locations for sections and features
const locations = {
  Entrance: { x: 0, y: 8 },
  "Checkout 1": { x: 16, y: 1 },
  "Checkout 2": { x: 16, y: 5 },
  Clothing: { x: 8, y: 0 },
  Electronics: { x: 8, y: 8 },
  Toys: { x: 3, y: 3 },
  "Sporting Goods": { x: 10, y: 6 },
  Shoes: { x: 3, y: 2 },
  Beauty: { x: 3, y: 6 },
  Bakery: { x: 10, y: 3 },
  Dairy: { x: 10, y: 2 },
  Snacks: { x: 3, y: 5 },
  Meat: { x: 10, y: 5 },
};

// Different shades of the same color
const sectionColors = {
  Entrance: "#1E90FF", // Dodger Blue - Bright and welcoming.
  Checkout: "#FF6347", // Tomato - Energetic and encouraging for the final step.
  Clothing: "#6A5ACD", // Slate Blue - Stylish and appealing.
  Grocery: "#20B2AA", // Light Sea Green - Fresh and natural.
  Electronics: "#FF4500", // Orange Red - Bold and dynamic.
  Pharmacy: "#369768", // Lime Green - Healthy and fresh.
  "Home Decor": "#FF8C00", // Dark Orange - Warm and comforting.
  Toys: "#D10032", // Hot Pink - Fun and lively.
  Furniture: "#57352A", // Steel Blue - Reliable and strong.
  "Sporting Goods": "#00BFFF", // Deep Sky Blue - Active and invigorating.
  Outdoor: "#2E8B57", // Sea Green - Natural and calming.
  Automotive: "#DC143C", // Gold - Bold and dependable.
  Appliances: "#DC143C", // Crimson - Strong and vibrant.
  Shoes: "#8A2BE2", // Blue Violet - Intellectual and creative.
  Beauty: "#FF1493", // Deep Pink - Bold and glamorous.
  Cosmetics: "#BA55D3", // Medium Orchid - Elegant and charming.
  Bakery: "#B8009B", // Light Pink - Warm and inviting.
  Dairy: "#256CAD", // Light Sky Blue - Fresh and light.
  Produce: "#32CD32", // Lime Green - Fresh and healthy (repeated from Pharmacy for freshness).
  Meat: "#CD5C5C", // Indian Red - Rich and robust.
  "Household Essentials": "#FF6347", // Tomato - Essential and supportive (repeated from Checkout).
  "Cleaning Supplies": "#4682B4", // Steel Blue - Clean and efficient (repeated from Furniture).
};

const colors = {
  0: "#E7ECEF", // Walkable paths
};

const MapView = ({ navigation, route }) => {
  const { userPosition } = useSelector((state) => state.position);
  const [path, setPath] = useState([]);
  const [source, setSource] = useState(locations["Entrance"]);
  // const [destination, setDestination] = useState(locations["Clothing"]); // Default destination
  const [directions, setDirections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  // const [queueInfo, setQueueInfo] = useState(null);
  const queueInfo = route?.params?.queueInfo || {};  // Get the dynamic queueInfo from the route
  const [destination, setDestination] = useState(
    queueInfo.queue_name === 'Queue1' ? locations['Checkout 1'] : locations['Checkout 2']
  );
  // Load queue info from AsyncStorage and determine destination
  useEffect(() => {
    const fetchQueueInfo = async () => {
      const storedQueueInfo = await AsyncStorage.getItem("queueInfo");
      if (storedQueueInfo) {
        const parsedQueueInfo = JSON.parse(storedQueueInfo);
        setQueueInfo(parsedQueueInfo);
        const checkoutDestination =
          parsedQueueInfo.queue_name === "queue1"
            ? locations["Checkout 1"]
            : locations["Checkout 2"];
        setDestination(checkoutDestination);
      }
    };
    fetchQueueInfo();
  }, []);

  // Load shopping list from AsyncStorage
  useEffect(() => {
    const loadShoppingList = async () => {
      try {
        const savedList = await AsyncStorage.getItem("List_sections");
        console.log(savedList);
        if (savedList) {
          setShoppingList(JSON.parse(savedList));
        } else {
          // If no saved list, use default values
          setShoppingList([]);
          // setShoppingList(["Grocery", "Electronics", "Pharmacy"]);
        }
      } catch (error) {
        console.error("Failed to load shopping list from AsyncStorage", error);
      }
    };
    loadShoppingList();
  }, []);
  //qr
  useEffect(() => {
    if (route.params?.scannedPosition) {
      setSource(route.params.scannedPosition);
    }
  }, [route.params?.scannedPosition]);
  // Update path when source, destination, or shopping list changes
  useEffect(() => {
    const start = source ? source : { x: 0, y: 0 };
    const selectedDestinations = shoppingList
      .filter((item) => !checkedItems[item])
      .map((item) => locations[item]);

    const newPath = findShortestPath(start, selectedDestinations, storeLayout);
    setPath([start, ...newPath]);
    setDirections(generateDirections(newPath));
  }, [source, destination, shoppingList, checkedItems]);

  const handleSourceChange = (itemValue) => {
    setSource(locations[itemValue]);
  };

  const handleDestinationChange = (itemValue) => {
    const selectedLocation = locations[itemValue];

    if (shoppingList.length > 0) {
      // If there's an existing shopping list, add the destination to it and recalculate the path
      setShoppingList((prevList) => {
        if (!prevList.includes(itemValue)) {
          return [...prevList, itemValue];
        }
        return prevList; // If the item is already in the list, don't add it again
      });
    } else {
      // If there's no shopping list, set the destination as the only item
      setShoppingList([itemValue]);
    }

    setSource((prevSource) => {
      const start = prevSource ? prevSource : { x: 0, y: 0 };
      const selectedDestinations = shoppingList
        .filter((item) => item !== itemValue)
        .map((item) => locations[item]);

      const newPath = findShortestPath(start, [selectedLocation, ...selectedDestinations], storeLayout);
      setPath([start, ...newPath]);
      setDirections(generateDirections(newPath));

      return prevSource;
    });
  };

  const handleCheckItem = async (item) => {
    const newSource = locations[item];
    setSource(newSource);

    const start = newSource;
    const selectedDestinations = shoppingList
      .filter((listItem) => listItem !== item)
      .map((listItem) => locations[listItem]);

    const newPath = findShortestPath(start, selectedDestinations, storeLayout);
    setPath([start, ...newPath]);
    setDirections(generateDirections(newPath));

    // Remove the item from the shopping list
    const updatedList = shoppingList.filter((listItem) => listItem !== item);
    setShoppingList(updatedList);

    // Update the AsyncStorage with the new list
    try {
      await AsyncStorage.setItem('List_sections', JSON.stringify(updatedList));
      console.log('AsyncStorage updated:', updatedList);
    } catch (error) {
      console.error('Error updating AsyncStorage:', error);
    }
  };

  const lastPathBlock = path.length > 0 ? path[path.length - 1] : source;

  const getLabelColor = (section) => {
    if (!sectionColors[section]) {
      return "black"; // Default to black if color is not defined
    }

    const color = sectionColors[section];
    const rgb = parseInt(color.substring(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b; // Standard luminance formula

    return brightness > 127.5 ? "black" : "white"; // Return black for light colors, white for dark colors
  };

  const [offers] = useState({
    Clothing: "Buy 1 Get 1 Free!",
    Electronics: "Up to 50% off on selected items",
    Outdoor: "20% off on all items",
    // Add more offers as needed
  });

  const handleCellPress = (section) => {
    if (offers[section]) {
      setCurrentOffer(offers[section]);
      setModalVisible(true);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#E7ECEF" }}>
      <ScrollView horizontal style={styles.container}>
        <ScrollView style={styles.container}>
          <Svg
            height={storeLayout.length * gridSize}
            width={storeLayout[0].length * gridSize}
            viewBox={`0 0 ${storeLayout[0].length * gridSize} ${storeLayout.length * gridSize
              }`}
          >
            {storeLayout.map((row, y) =>
              row.map((cell, x) => {
                let fillColor = colors[cell] || "white";
                if (sectionColors[cell]) {
                  fillColor = sectionColors[cell];
                }
                return (
                  <G key={`${x}-${y}`}>
                    <Rect
                      x={x * gridSize}
                      y={y * gridSize}
                      width={gridSize}
                      height={gridSize}
                      fill={fillColor}
                    />
                    {/* {offers[cell] && (
                      <TouchableOpacity
                        onPress={() => handleCellPress(cell)}
                        style={{
                          position: "absolute",
                          left: x * gridSize,
                          top: y * gridSize,
                          width: gridSize,
                          height: gridSize,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons name="star" size={20} color="gold" />
                      </TouchableOpacity>
                    )} */}
                  </G>
                );
              })
            )}

            {/* Manually placed labels */}
            <SvgText
              x={225} // X coordinate
              y={16} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"bold"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
            >
              Clothing
            </SvgText>

            <SvgText
              x={466} // X coordinate
              y={215} // Y coordinate
              fontSize={14} // Font size
              fontWeight={"bold"}
              fill="black" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(-90, 466, 180)`}
            >
              Checkout 2
            </SvgText>
            <SvgText
              x={588} // X coordinate
              y={215} // Y coordinate
              fontSize={14} // Font size
              fontWeight={"bold"}
              fill="black" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(-90, 466, 180)`}
            >
              Checkout 1
            </SvgText>

            <SvgText
              x={240} // X coordinate
              y={255} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"bold"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"

            >
              Electronics
            </SvgText>


            <SvgText
              x={325}
              y={195}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Sporting Goods
            </SvgText>
            <SvgText
              x={325}
              y={165}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Meat
            </SvgText>
            <SvgText
              x={125}
              y={105}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Toys
            </SvgText>
            <SvgText
              x={330}
              y={105}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Bakery
            </SvgText>
            <SvgText
              x={330}
              y={75}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Dairy
            </SvgText>
            <SvgText
              x={125}
              y={165}
              fontSize={16}
              fontWeight={"bold"}
              fill="black"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Snacks
            </SvgText>
            <SvgText
              x={125}
              y={195}
              fontSize={16}
              fontWeight={"bold"}
              fill="black"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Beauty
            </SvgText>
            <SvgText
              x={125}
              y={75}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Shoes
            </SvgText>
            <SvgText
              x={125}
              y={75}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Shoes
            </SvgText>
            <SvgText
              x={15}
              y={255}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              E
            </SvgText>

            {path.map(
              (point, index) =>
                index > 0 && (
                  <Line
                    key={`${index}-${point.x}-${point.y}`}
                    x1={path[index - 1].x * gridSize + gridSize / 2}
                    y1={path[index - 1].y * gridSize + gridSize / 2}
                    x2={point.x * gridSize + gridSize / 2}
                    y2={point.y * gridSize + gridSize / 2}
                    stroke="#0B2D56"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )
            )}

            {/* Start Marker */}
            <G
              transform={`translate(${source.x * gridSize + gridSize / 2 - buyerIconWidth / 2
                }, ${source.y * gridSize + gridSize / 2 - buyerIconHeight / 2})`}
            >
              <Image
                href={require("../assets/buyer.png")}
                width={buyerIconWidth}
                height={buyerIconHeight}
              />
            </G>

            {/* Destination Marker on the last path block */}
            {lastPathBlock && (
              <G
                transform={`translate(${lastPathBlock.x * gridSize +
                  gridSize / 2 -
                  locationIconWidth / 2
                  }, ${lastPathBlock.y * gridSize +
                  gridSize / 2 -
                  locationIconHeight / 2
                  })`}
              >
                <Image
                  href={require("../assets/location.png")}
                  width={locationIconWidth}
                  height={locationIconHeight}
                />
              </G>
            )}
          </Svg>
        </ScrollView>
      </ScrollView>

      <View style={styles.topPopContainer}>
        <ScrollView style={styles.topPop}>
          <View style={styles.optPop}>
            <View style={styles.select}>
              <Text style={styles.pickTxt}>Source</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={Object.keys(locations).find(
                    (key) => locations[key] === source
                  )}
                  onValueChange={handleSourceChange}
                >
                  {Object.keys(locations).map((key) => (
                    <Picker.Item label={key} value={key} key={key} />
                  ))}
                </Picker>
              </View>
            </View>
            <Icon name="double-arrow" size={24} color="#002E4F" />
            <View style={styles.select}>
              <Text style={styles.pickTxt}>Destination</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={Object.keys(locations).find(
                    (key) => locations[key] === destination
                  )}
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
              navigation.navigate("QRScanner");
            }}
            style={styles.qrButton}
          >
            <Text style={styles.qrTxt}>Scan your current location QR</Text>
          </TouchableOpacity>

          {/* Product List */}
          {shoppingList.length > 0 && (
            <View style={styles.productListContainer}>
              <Text style={styles.productListTitle}>Shopping List</Text>
              <FlatList
                data={shoppingList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productListItem}
                    onPress={() => handleCheckItem(item)}
                  >
                    <Text style={styles.productListText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* MODAL HERE */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Special Offer</Text>
            <Text style={styles.modalText}>{currentOffer}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Render QueueStatus component below the map */}
      {/* {queueInfo && // Inside your MapView component
<QueueStatus route={{ params: { queueInfo: { queue_name: 'Queue1', estimated_time: 120 } } }} />
} */}
{queueInfo.queue_name &&
  <QueueStatus route={{ params: { queueInfo } }} />
}
    </ScrollView>
  );
};

export default MapView;
