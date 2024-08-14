import React, { useEffect, useState } from "react";
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
import { MaterialIcons } from "@expo/vector-icons";

// Constants for dimensions
const buyerIconWidth = 40;
const buyerIconHeight = 43;
const locationIconWidth = 43;
const locationIconHeight = 43;
const windowWidth = Dimensions.get("window").width;
const gridSize = 30;

// Store layout with real section names
const storeLayout = [
  [
    "Clothing",
    "Clothing",
    "Clothing",
    "Clothing",
    "Clothing",
    "Clothing",
    0,
    "Grocery",
    "Grocery",
    "Grocery",
    "Grocery",
    "Grocery",
    0,
    "Electronics",
    "Electronics",
    "Electronics",
    "Electronics",
    "Electronics",
    "Electronics",
    "Electronics",
    "Electronics",
    0,
  ],
  ["Pharmacy", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [
    "Pharmacy",
    0,
    "Home Decor",
    "Home Decor",
    "Home Decor",
    0,
    "Toys",
    "Toys",
    "Toys",
    0,
    "Furniture",
    "Furniture",
    "Furniture",
    0,
    "Sporting Goods",
    "Sporting Goods",
    "Sporting Goods",
    0,
    "Outdoor",
    0,
    "Automotive",
    0,
  ],
  [
    "Pharmacy",
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    "Outdoor",
    0,
    "Automotive",
    0,
  ],
  [
    "Pharmacy",
    0,
    "Appliances",
    "Books",
    0,
    "Beauty",
    "Cosmetics",
    0,
    "Bakery",
    "Dairy",
    0,
    "Produce",
    "Meat",
    0,
    "Household Essentials",
    "Cleaning Supplies",
    0,
    0,
    0,
    0,
    0,
    0,
  ],
  [
    "Pharmacy",
    0,
    "Appliances",
    "Books",
    0,
    "Beauty",
    "Cosmetics",
    0,
    "Bakery",
    "Dairy",
    0,
    "Produce",
    "Meat",
    0,
    "Household Essentials",
    "Cleaning Supplies",
    0,
    "Checkout",
    "Checkout",
    "Checkout",
    "Checkout",
    0,
  ],
  [
    "Pharmacy",
    0,
    "Appliances",
    "Books",
    0,
    "Beauty",
    "Cosmetics",
    0,
    "Bakery",
    "Dairy",
    0,
    "Produce",
    "Meat",
    0,
    "Household Essentials",
    "Cleaning Supplies",
    0,
    "Checkout",
    "Checkout",
    "Checkout",
    "Checkout",
    0,
  ],
  [
    "Pharmacy",
    0,
    "Appliances",
    "Books",
    0,
    "Beauty",
    "Cosmetics",
    0,
    "Bakery",
    "Dairy",
    0,
    "Produce",
    "Meat",
    0,
    "Household Essentials",
    "Cleaning Supplies",
    0,
    0,
    0,
    0,
    0,
    0,
  ],
  ["Pharmacy", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Pharmacy", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [
    "Pharmacy",
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    "Entrance",
    0,
    "Entrance",
    0,
    "Entrance",
    0,
    0,
    0,
    0,
    0,
  ],
  [
    "Pharmacy",
    "Pharmacy",
    "Entrance",
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    "Entrance",
    0,
    "Entrance",
    0,
    "Entrance",
    0,
    0,
    0,
    0,
    0,
  ],
];

// Locations for sections and features
const locations = {
  Entrance: { x: 3, y: 11 },
  "Checkout 1": { x: 13, y: 10 },
  "Checkout 2": { x: 15, y: 10 },
  "Checkout 3": { x: 17, y: 10 },
  Clothing: { x: 2, y: 1 },
  Grocery: { x: 9, y: 1 },
  Electronics: { x: 16, y: 1 },
  Pharmacy: { x: 1, y: 6 },
  "Home Decor": { x: 2, y: 3 },
  Toys: { x: 7, y: 3 },
  Furniture: { x: 11, y: 3 },
  "Sporting Goods": { x: 15, y: 3 },
  Outdoor: { x: 18, y: 3 },
  Automotive: { x: 20, y: 3 },
  Appliances: { x: 2, y: 5 },
  Books: { x: 3, y: 5 },
  Beauty: { x: 5, y: 5 },
  Cosmetics: { x: 6, y: 5 },
  Bakery: { x: 8, y: 5 },
  Dairy: { x: 9, y: 5 },
  Snacks: { x: 11, y: 5 },
  Meat: { x: 12, y: 5 },
  "Household Essentials": { x: 13, y: 5 },
  "Cleaning Supplies": { x: 16, y: 5 },
  Checkout: { x: 18, y: 5 },
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
  Books: "#8A2BE2", // Blue Violet - Intellectual and creative.
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
  0: "white", // Walkable paths
};

const MapView = ({ navigation, route }) => {
  const { userPosition } = useSelector((state) => state.position);
  const [path, setPath] = useState([]);
  const [source, setSource] = useState(locations["Entrance"]);
  const [destination, setDestination] = useState(locations["Clothing"]); // Default destination
  const [directions, setDirections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

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
          setShoppingList(["Grocery", "Electronics", "Pharmacy"]);
        }
      } catch (error) {
        console.error("Failed to load shopping list from AsyncStorage", error);
      }
    };
    loadShoppingList();
  }, []);

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

  // const handleCheckItem = (item) => {
  //   setCheckedItems({ ...checkedItems, [item]: !checkedItems[item] });
    
  //   // Remove the item from the shopping list
  //   setShoppingList((prevList) => prevList.filter((listItem) => listItem !== item));
  // };

  // const handleCheckItem = (item) => {
  //   setCheckedItems({ ...checkedItems, [item]: !checkedItems[item] });
  //   if (!checkedItems[item]) {
  //     setSource(locations[item]);
  //   }
  // };

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
    <ScrollView>
    <ScrollView horizontal style={styles.container}>
      <ScrollView style={styles.container}>
        <Svg
          height={storeLayout.length * gridSize}
          width={storeLayout[0].length * gridSize}
          viewBox={`0 0 ${storeLayout[0].length * gridSize} ${
            storeLayout.length * gridSize
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
                  {offers[cell] && (
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
                  )}
                </G>
              );
            })
          )}

            {/* Manually placed labels */}
            <SvgText
              x={90} // X coordinate
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
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(-90, 466, 180)`}
            >
              Cleaning
            </SvgText>

            <SvgText
              x={436} // X coordinate
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(90, 436, 180)`}
            >
              Household
            </SvgText>

            <SvgText
              x={570}
              y={180}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Checkout
            </SvgText>

            <SvgText
              x={16}
              y={200}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(-90, 16, 200)`}
            >
              Pharmacy
            </SvgText>

            <SvgText
              x={286}
              y={16}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Grocery
            </SvgText>

            <SvgText
              x={510}
              y={16}
              fontSize={16}
              fontWeight={"bold"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              Electronics
            </SvgText>

            <SvgText
              x={554}
              y={90}
              fontSize={14}
              fontWeight={"500"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(90, 554, 90)`}
            >
              Outdoor
            </SvgText>

            <SvgText
              x={616}
              y={90}
              fontSize={10}
              fontWeight={"500"}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(90, 616, 90)`}
            >
              Automotive
            </SvgText>

            <SvgText
              x={226} // X coordinate
              y={76} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"bold"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
            >
              Toys
            </SvgText>

            <SvgText
              x={104} // X coordinate
              y={76} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"bold"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
            >
              Decor
            </SvgText>

            <SvgText
              x={346} // X coordinate
              y={76} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"bold"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
            >
              Furniture
            </SvgText>

            <SvgText
              x={466} // X coordinate
              y={76} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"bold"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
            >
              Sports
            </SvgText>

            <SvgText
              x={106} // X coordinate
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(-90, 106, 180)`}
            >
              Books
            </SvgText>

            <SvgText
              x={76} // X coordinate
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(90, 76, 180)`}
            >
              Appliances
            </SvgText>

            <SvgText
              x={196} // X coordinate
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(-90, 196, 180)`}
            >
              Cosmetics
            </SvgText>

            <SvgText
              x={166} // X coordinate
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(90, 166, 180)`}
            >
              Beauty
            </SvgText>

            <SvgText
              x={286} // X coordinate
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(-90, 286, 180)`}
            >
              Dairy
            </SvgText>

            <SvgText
              x={256} // X coordinate
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(90, 256, 180)`}
            >
              Bakery
            </SvgText>

            <SvgText
              x={376} // X coordinate
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(-90, 376, 180)`}
            >
              Meat
            </SvgText>

            <SvgText
              x={346} // X coordinate
              y={180} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"500"}
              fill="white" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
              transform={`rotate(90, 346, 180)`}
            >
              Snacks
            </SvgText>

            <SvgText
              x={376} // X coordinate
              y={330} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"bold"}
              fill="#0B2D56" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
            >
              A
            </SvgText>

            <SvgText
              x={436} // X coordinate
              y={330} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"bold"}
              fill="#0B2D56" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
            >
              B
            </SvgText>

            <SvgText
              x={496} // X coordinate
              y={330} // Y coordinate
              fontSize={16} // Font size
              fontWeight={"bold"}
              fill="#0B2D56" // Text color
              textAnchor="middle" // Text alignment
              alignmentBaseline="middle"
            >
              C
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
              transform={`translate(${
                source.x * gridSize + gridSize / 2 - buyerIconWidth / 2
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
                transform={`translate(${
                  lastPathBlock.x * gridSize +
                  gridSize / 2 -
                  locationIconWidth / 2
                }, ${
                  lastPathBlock.y * gridSize +
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
              <Text>Source</Text>
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

            <View style={styles.select}>
              <Text>Destination</Text>
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
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "auto",
    zIndex: -1,
  },

  topPop: {
    width: windowWidth,
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
    elevation: 2,
  },
  picker: {
    padding: 0,
    backgroundColor: "#CFDDEF",
    borderRadius: 4,
  },
  qrButton: {
    marginHorizontal: 14,
    backgroundColor: "#266BBC",
    paddingHorizontal: "auto",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    elevation: 1,
  },
  qrTxt: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#266BBC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  productListContainer: {
    margin: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    elevation: 3,
  },
  productListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productListText: {
    fontSize: 16,
    color: "#555",
  },
});

export default MapView;
