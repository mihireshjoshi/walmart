import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import RNPickerSelect from 'react-native-picker-select';

const GridPathFinder = () => {
  const [path, setPath] = useState([]);
  const [start, setStart] = useState({ row: 11, col: 2 }); // Default start position (Entry)
  const [end, setEnd] = useState({ row: 10, col: 12 }); // Default end position (Exit)

  // Original base map grid (no scaling)
  const grid = [
    [1, 2, 2, 2, 2, 2, 0, 3, 3, 3, 3, 3, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0],
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
    [6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 99, 100, 99, 100, 99, 100, 0, 0, 0, 0],
  ];

  // Calculate cell size dynamically based on the screen width and grid dimensions
  const screenWidth = Dimensions.get('window').width;
  const maxGridWidth = screenWidth; // Full width with no padding
  const cellSize = maxGridWidth / grid[0].length;

  // Create the pathway grid
  const pathwayGrid = grid.map(row => row.map(cell => (cell === 0 || cell === 6 ? 0 : 1)));

  // 4-directional movements (no diagonals)
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
  ];

  // BFS to find the shortest path
  const findPath = () => {
    const queue = [];
    const visited = new Set();
    queue.push({ position: start, path: [start] });
    visited.add(`${start.row},${start.col}`);

    while (queue.length > 0) {
      const { position, path } = queue.shift();

      if (position.row === end.row && position.col === end.col) {
        setPath(path);
        console.log("Path found:", path);
        return;
      }

      for (const direction of directions) {
        const newRow = position.row + direction.row;
        const newCol = position.col + direction.col;

        if (isValidMove(newRow, newCol) && !visited.has(`${newRow},${newCol}`)) {
          visited.add(`${newRow},${newCol}`);
          queue.push({
            position: { row: newRow, col: newCol },
            path: [...path, { row: newRow, col: newCol }]
          });
        }
      }
    }

    setPath([]); // If no path is found
    console.log("No path found");
  };

  const isValidMove = (row, col) => {
    return row >= 0 && col >= 0 && row < pathwayGrid.length && col < pathwayGrid[0].length && pathwayGrid[row][col] === 0;
  };

  useEffect(() => {
    findPath();
  }, [start, end]);

  const handleStartChange = (value) => {
    const closestPath = findClosestPathway(value);
    setStart(closestPath);
  };

  const handleEndChange = (value) => {
    const closestPath = findClosestPathway(value);
    setEnd(closestPath);
  };


  const findClosestPathway = (section) => {
   
    const { row, col } = section;
    
  
    // Check bounds and ensure the section is within the grid.
    if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length) {
      console.error("Invalid section coordinates");
      return { row: 0, col: 0 }; // Fallback to a default location, e.g., (0, 0)
    }
  
    const queue = [{ row, col }];
    const visited = new Set();
  
    while (queue.length > 0) {
      const { row: curRow, col: curCol } = queue.shift();
      if (pathwayGrid[curRow][curCol] === 0) {
        return { row: curRow, col: curCol };
      }
      visited.add(`${curRow},${curCol}`);
      directions.forEach(({ row: dRow, col: dCol }) => {
        const newRow = curRow + dRow;
        const newCol = curCol + dCol;
        if (
          newRow >= 0 &&
          newCol >= 0 &&
          newRow < grid.length &&
          newCol < grid[0].length
        ) {
          if (!visited.has(`${newRow},${newCol}`)) {
            queue.push({ row: newRow, col: newCol });
          }
        }
      });
    }
    return section; // Return original section coordinates if no path found
  };
  

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => {
          return (
            <View
              key={colIndex}
              style={[
                styles.cell,
                { width: cellSize, height: cellSize },
                cell === 1 ? styles.blockedCell : null,           // Blocked
                cell === 2 ? styles.section2 : null,              // Section 2
                cell === 3 ? styles.section3 : null,              // Section 3
                cell === 4 ? styles.section4 : null,              // Section 4
                cell === 6 ? styles.aisle : null,                 // Aisle
                cell === 7 ? styles.section7 : null,              // Section 7
                cell === 8 ? styles.section8 : null,              // Section 8
                cell === 9 ? styles.section9 : null,              // Section 9
                cell === 10 ? styles.section10 : null,            // Section 10
                cell === 11 ? styles.section11 : null,            // Section 11
                cell === 12 ? styles.section12 : null,            // Section 12
                cell === 13 ? styles.section13 : null,            // Section 13
                cell === 14 ? styles.section14 : null,            // Section 14
                cell === 15 ? styles.section15 : null,            // Section 15
                cell === 16 ? styles.section16 : null,            // Section 16
                cell === 17 ? styles.section17 : null,            // Section 17
                cell === 18 ? styles.section18 : null,            // Section 18
                cell === 19 ? styles.section19 : null,            // Section 19
                cell === 20 ? styles.section20 : null,            // Section 20
                cell === 21 ? styles.section21 : null,            // Section 21
                cell === 22 ? styles.section22 : null,            // Section 22
                cell === 23 ? styles.section23 : null,            // Section 23
                cell === 98 ? styles.entrySection : null,         // Entry
                cell === 99 ? styles.cashCounter : null,          // Cash Counter
                cell === 100 ? styles.exitSection : null,         // Exit
              ]}
            />
          );
        })}
      </View>
    ));
  };

  const renderPathLine = () => {
    if (path.length === 0) return null;

    let pathData = `M ${(path[0].col + 0.5) * cellSize},${(path[0].row + 0.5) * cellSize}`;

    path.forEach((point, index) => {
      if (index > 0) {
        pathData += ` L ${(point.col + 0.5) * cellSize},${(point.row + 0.5) * cellSize}`;
      }
    });

    return (
      <Svg height={cellSize * grid.length} width={cellSize * grid[0].length} style={styles.pathSvg}>
        <Path
          d={pathData}
          fill="none"
          stroke="#4A90E2"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Image
          source={require('../assets/start.png')} // Replace with your user standing icon
          style={{
            position: 'absolute',
            width: cellSize,
            height: cellSize,
            left: (start.col + 0.5) * cellSize - cellSize / 2,
            top: (start.row + 0.5) * cellSize - cellSize / 2,
            resizeMode: 'contain',
          }}
        />
        <Image
          source={require('../assets/end.png')} // Replace with your pin icon
          style={{
            position: 'absolute',
            width: cellSize,
            height: cellSize,
            left: (end.col + 0.5) * cellSize - cellSize / 2,
            top: (end.row + 0.5) * cellSize - cellSize, // Shifted up by half the cell size
            resizeMode: 'contain',
          }}
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text>Select Start Point:</Text>
        <RNPickerSelect
          onValueChange={handleStartChange}
          items={[
            { label: 'Entry (10, 2)', value: { row: 10, col: 2 } },
            { label: 'Section 13 (5, 2)', value: { row: 5, col: 2 } },
            { label: 'Section 14 (5, 3)', value: { row: 5, col: 3 } },
            { label: 'Section 7 (3, 2)', value: { row: 3, col: 2 } },
            { label: 'Cash Counter (11, 13)', value: { row: 11, col: 13 } },
            // Add all other sections here...
          ]}
        />

        <Text>Select End Point:</Text>
        <RNPickerSelect
          onValueChange={handleEndChange}
          items={[
            { label: 'Exit (2, 17)', value: { row: 2, col: 19 } },
            { label: 'Section 7 (3, 7)', value: { row: 3, col: 7 } },
            { label: 'Section 23 (5, 20)', value: { row: 5, col: 20 } },
            { label: 'Cash Counter (11, 12)', value: { row: 11, col: 12 } },
            // Add all other sections here...
          ]}
        />
      </View>

      <View style={[styles.gridContainer, { width: cellSize * grid[0].length, height: cellSize * grid.length }]}>
        {renderGrid()}
        {renderPathLine()}
      </View>
      <Text style={styles.info}>Path: {path.length > 0 ? "Path found" : "No path found"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0, height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownContainer: {
    marginBottom: 20,
    width: '100%',
  },
  gridContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: '#e0e0e0',
  },
  blockedCell: {
    backgroundColor: '#d1d1d6',
  },
  section2: {
    backgroundColor: '#ff6f61',
  },
  section3: {
    backgroundColor: '#ffab40',
  },
  section4: {
    backgroundColor: '#ffeb3b',
  },
  aisle: {
    backgroundColor: '#b0bec5', // Light gray for aisle
  },
  section7: {
    backgroundColor: '#66bb6a',
  },
  section8: {
    backgroundColor: '#42a5f5',
  },
  section9: {
    backgroundColor: '#5c6bc0',
  },
  section10: {
    backgroundColor: '#ab47bc',
  },
  section11: {
    backgroundColor: '#ec407a',
  },
  section12: {
    backgroundColor: '#8d6e63',
  },
  section13: {
    backgroundColor: '#d4e157',
  },
  section14: {
    backgroundColor: '#9ccc65',
  },
  section15: {
    backgroundColor: '#4db6ac',
  },
  section16: {
    backgroundColor: '#26c6da',
  },
  section17: {
    backgroundColor: '#29b6f6',
  },
  section18: {
    backgroundColor: '#7e57c2',
  },
  section19: {
    backgroundColor: '#ff7043',
  },
  section20: {
    backgroundColor: '#8bc34a',
  },
  section21: {
    backgroundColor: '#cddc39',
  },
  section22: {
    backgroundColor: '#ffc107',
  },
  section23: {
    backgroundColor: '#ff5722',
  },
  entrySection: {
    backgroundColor: '#34c759',
  },
  cashCounter: {
    backgroundColor: '#616161',
  },
  exitSection: {
    backgroundColor: '#ff3b30',
  },
  info: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  pathSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default GridPathFinder;
