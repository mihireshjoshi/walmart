
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
// import { useSelector } from 'react-redux';
// import { Svg, Rect, Line, G, Path } from 'react-native-svg';
// import { Picker } from '@react-native-picker/picker';
// import { aStar } from './pathfindingUtils'; 
// import { generateDirections } from './directionsUtils'; 

// const gridSize = 30; // Adjusting grid size for larger layout

// // Updated store layout
// const storeLayout = [
//   [2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 3, 3, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0],
//   [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [6, 0, 7, 7, 7, 0, 8, 8, 8, 0, 9, 9, 9, 0, 10, 10, 10, 0, 11, 0, 12, 0],
//   [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 12, 0],
//   [6, 0, 13, 14, 0, 15, 16, 0, 17, 18, 0, 19, 20, 0, 21, 22, 0, 0, 0, 0, 0, 0],
//   [6, 0, 13, 14, 0, 15, 16, 0, 17, 18, 0, 19, 20, 0, 21, 22, 0, 23, 23, 23, 23, 0],
//   [6, 0, 13, 14, 0, 15, 16, 0, 17, 18, 0, 19, 20, 0, 21, 22, 0, 23, 23, 23, 23, 0],
//   [6, 0, 13, 14, 0, 15, 16, 0, 17, 18, 0, 19, 20, 0, 21, 22, 0, 0, 0, 0, 0, 0],
//   [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 99, 0, 99, 0, 0, 0, 0, 0],
//   [6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 0, 99, 0, 99, 0, 0, 0, 0, 0],
// ];

// // Updated locations for sections and features
// const locations = {
//   "Entrance": { x: 2, y: 11 },
//   "Checkout 1": { x: 13, y: 10 },
//   "Checkout 2": { x: 15, y: 10 },
//   "Checkout 3": { x: 17, y: 10 },
//   "Section 2": { x: 0, y: 0 },
//   "Section 3": { x: 7, y: 0 },
//   "Section 4": { x: 13, y: 0 },
//   "Section 6": { x: 0, y: 1 },
//   "Section 7": { x: 2, y: 2 },
//   "Section 8": { x: 6, y: 2 },
//   "Section 9": { x: 10, y: 2 },
//   "Section 10": { x: 14, y: 2 },
//   "Section 11": { x: 18, y: 3 },
//   "Section 12": { x: 20, y: 3 },
//   "Section 13": { x: 2, y: 4 },
//   "Section 14": { x: 3, y: 4 },
//   "Section 15": { x: 5, y: 4 },
//   "Section 16": { x: 6, y: 4 },
//   "Section 17": { x: 8, y: 4 },
//   "Section 18": { x: 9, y: 4 },
//   "Section 19": { x: 11, y: 4 },
//   "Section 20": { x: 12, y: 4 },
//   "Section 21": { x: 14, y: 4 },
//   "Section 22": { x: 15, y: 4 },
//   "Section 23": { x: 18, y: 5 },
// };

// const sectionColors = {
//   1: "#FFFF99",    // Light Yellow (Entrance)
//   99: "#FF6666",   // Light Red (Checkout)
//   2: "#ADD8E6",    // Light Blue
//   3: "#90EE90",    // Light Green
//   4: "#F08080",    // Light Coral
//   6: "#FFFFE0",    // Light Yellow
//   7: "#FFB6C1",    // Light Pink
//   8: "#D3D3D3",    // Light Gray
//   9: "#B0C4DE",    // Light Steel Blue
//   10: "#20B2AA",   // Light Sea Green
//   11: "#FAFAD2",   // Light Goldenrod Yellow
//   12: "#FFA07A",   // Light Salmon
//   13: "#E0FFFF",   // Light Cyan
//   14: "#FFD700",   // Gold
//   15: "#98FB98",   // Pale Green
//   16: "#FF69B4",   // Hot Pink
//   17: "#87CEEB",   // Sky Blue
//   18: "#4682B4",   // Steel Blue
//   19: "#FFFFE0",   // Light Yellow
//   20: "#ADD8E6",   // Light Blue
//   21: "#FF6347",   // Tomato (Light Coral Alternative)
//   22: "#90EE90",   // Light Green
//   23: "#D3D3D3",   // Light Gray
// };

// const colors = {
//   0: 'white',  // Walkable paths
// };

// const MapView = ({ navigation }) => {
//   const { userPosition } = useSelector((state) => state.position);
//   const [path, setPath] = useState([]);
//   const [source, setSource] = useState(locations["Entrance"]);
//   const [destination, setDestination] = useState(locations["Section 2"]); // Default destination
//   const [directions, setDirections] = useState([]);

//   useEffect(() => {
//     const start = source ? source : { x: 0, y: 0 };
//     const newPath = aStar(start, destination, storeLayout);
//     setPath([start, ...newPath]);
//     setDirections(generateDirections(newPath));
//   }, [source, destination]);

//   const handleSourceChange = (itemValue) => {
//     setSource(locations[itemValue]);
//   };

//   const handleDestinationChange = (itemValue) => {
//     setDestination(locations[itemValue]);
//   };

//   const markerIcon = (
//     <Path
//       d="M12 2C7.588 2 4 5.588 4 10c0 6.082 7.347 11.908 7.623 12.123a1 1 0 0 0 1.153 0C13.653 21.908 21 16.082 21 10c0-4.412-3.588-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
//       fill="red"
//     />
//   );

//   const lastPathBlock = path.length > 0 ? path[path.length - 1] : source;

//   return (
//     <ScrollView horizontal style={styles.container}>
//       <ScrollView style={styles.container}>
//         <Text style={styles.header}>Store Map</Text>

//         <Text>Choose Source:</Text>
//         <Picker
//           selectedValue={Object.keys(locations).find(key => locations[key] === source)}
//           style={{ height: 50, width: 200 }}
//           onValueChange={handleSourceChange}
//         >
//           {Object.keys(locations).map((key) => (
//             <Picker.Item label={key} value={key} key={key} />
//           ))}
//         </Picker>

//         <Button
//           title="Scan QR Code for Source"
//           onPress={() => {
//             navigation.navigate('QRScanner');
//           }}
//         />

//         <Text>Choose Destination:</Text>
//         <Picker
//           selectedValue={Object.keys(locations).find(key => locations[key] === destination)}
//           style={{ height: 50, width: 200 }}
//           onValueChange={handleDestinationChange}
//         >
//           {Object.keys(locations).map((key) => (
//             <Picker.Item label={key} value={key} key={key} />
//           ))}
//         </Picker>

//         <Svg
//           height={storeLayout.length * gridSize}
//           width={storeLayout[0].length * gridSize}
//           viewBox={`0 0 ${storeLayout[0].length * gridSize} ${storeLayout.length * gridSize}`}
//         >
//           {storeLayout.map((row, y) =>
//             row.map((cell, x) => {
//               let fillColor = colors[cell];
//               if (sectionColors[cell]) {
//                 fillColor = sectionColors[cell];
//               }
//               return (
//                 <Rect
//                   key={`${x}-${y}`}
//                   x={x * gridSize}
//                   y={y * gridSize}
//                   width={gridSize}
//                   height={gridSize}
//                   fill={fillColor}
//                   stroke="grey"
//                 />
//               );
//             })
//           )}

//           {path.map((point, index) => (
//             index > 0 && (
//               <Line
//                 key={`${index}-${point.x}-${point.y}`}
//                 x1={path[index - 1].x * gridSize + gridSize / 2}
//                 y1={path[index - 1].y * gridSize + gridSize / 2}
//                 x2={point.x * gridSize + gridSize / 2}
//                 y2={point.y * gridSize + gridSize / 2}
//                 stroke="blue"
//                 strokeWidth="2"
//               />
//             )
//           ))}

//           {/* Start Marker */}
//           <G
//             transform={`translate(${source.x * gridSize + gridSize / 2 - 10}, ${source.y * gridSize + gridSize / 2 - 10})`}
//           >
//             {markerIcon}
//           </G>

//           {/* Destination Marker on the last path block */}
//           <G
//             transform={`translate(${lastPathBlock.x * gridSize + gridSize / 2 - 10}, ${lastPathBlock.y * gridSize + gridSize / 2 - 10})`}
//           >
//             {markerIcon}
//           </G>
//         </Svg>

//         <View style={styles.directions}>
//           {directions.map((instruction, index) => (
//             <Text key={index}>{instruction}</Text>
//           ))}
//         </View>
//       </ScrollView>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   header: {
//     fontSize: 20,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   directions: {
//     marginTop: 10,
//   },
// });

// export default MapView;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { Svg, Rect, Line, G, Path } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
import { aStar } from './pathfindingUtils'; 
import { generateDirections } from './directionsUtils'; 

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
  "Entrance": { x: 2, y: 11 },
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
  1: "#FFFF99",    // Light Yellow (Entrance)
  99: "#FF6666",   // Light Red (Checkout)
  2: "#ADD8E6",    // Light Blue
  3: "#90EE90",    // Light Green
  4: "#F08080",    // Light Coral
  6: "#FFFFE0",    // Light Yellow
  7: "#FFB6C1",    // Light Pink
  8: "#D3D3D3",    // Light Gray
  9: "#B0C4DE",    // Light Steel Blue
  10: "#20B2AA",   // Light Sea Green
  11: "#FAFAD2",   // Light Goldenrod Yellow
  12: "#FFA07A",   // Light Salmon
  13: "#E0FFFF",   // Light Cyan
  14: "#FFD700",   // Gold
  15: "#98FB98",   // Pale Green
  16: "#FF69B4",   // Hot Pink
  17: "#87CEEB",   // Sky Blue
  18: "#4682B4",   // Steel Blue
  19: "#FFFFE0",   // Light Yellow
  20: "#ADD8E6",   // Light Blue
  21: "#FF6347",   // Tomato (Light Coral Alternative)
  22: "#90EE90",   // Light Green
  23: "#D3D3D3",   // Light Gray
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
    if (route.params && route.params.scannedPosition) {
      setSource(route.params.scannedPosition);
    }
  }, [route.params?.scannedPosition]);

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
    <ScrollView horizontal style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Store Map</Text>

        <Text>Choose Source:</Text>
        <Picker
          selectedValue={Object.keys(locations).find(key => locations[key] === source)}
          style={{ height: 50, width: 200 }}
          onValueChange={handleSourceChange}
        >
          {Object.keys(locations).map((key) => (
            <Picker.Item label={key} value={key} key={key} />
          ))}
        </Picker>

        <Button
          title="Scan QR Code for Source"
          onPress={() => {
            navigation.navigate('QRScanner');
          }}
        />

        <Text>Choose Destination:</Text>
        <Picker
          selectedValue={Object.keys(locations).find(key => locations[key] === destination)}
          style={{ height: 50, width: 200 }}
          onValueChange={handleDestinationChange}
        >
          {Object.keys(locations).map((key) => (
            <Picker.Item label={key} value={key} key={key} />
          ))}
        </Picker>

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
                y1={path[index - 1].y * gridSize + gridSize / 2}
                x2={point.x * gridSize + gridSize / 2}
                y2={point.y * gridSize + gridSize / 2}
                stroke="blue"
                strokeWidth="2"
              />
            )
          ))}

          {/* Start Marker */}
          <G
            transform={`translate(${source.x * gridSize + gridSize / 2 - 10}, ${source.y * gridSize + gridSize / 2 - 10})`}
          >
            {markerIcon}
          </G>

          {/* Destination Marker on the last path block */}
          <G
            transform={`translate(${lastPathBlock.x * gridSize + gridSize / 2 - 10}, ${lastPathBlock.y * gridSize + gridSize / 2 - 10})`}
          >
            {markerIcon}
          </G>
        </Svg>

        <View style={styles.directions}>
          {directions.map((instruction, index) => (
            <Text key={index}>{instruction}</Text>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  directions: {
    marginTop: 10,
  },
});

export default MapView;
