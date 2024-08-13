import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const GridPathFinder = () => {
  const [path, setPath] = useState([]);

  // Original base map grid (no scaling)
  const grid = [
    [2, 2, 2, 0, 3, 3, 3, 0, 4, 4, 4],
    [2, 2, 2, 0, 3, 3, 3, 0, 4, 4, 4],
    [2, 2, 2, 0, 0, 0, 0, 0, 4, 4, 4],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5],
  ];

  // Calculate cell size dynamically based on the screen width and grid dimensions
  const screenWidth = Dimensions.get('window').width;
  const maxGridWidth = screenWidth; // Full width with no padding
  const cellSize = maxGridWidth / grid[0].length;

  // Create the pathway grid
  const pathwayGrid = grid.map(row => row.map(cell => (cell === 0 || cell === 6 ? 0 : 1)));

  // Define the start and end positions
  const start = { row: 6, col: 5 };
  const end = { row: 3, col: 10 };

  // 4-directional movements (no diagonals)
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
    // { row: -1, col: -1 }, // up-left
    // { row: -1, col: 1 },  // up-right
    // { row: 1, col: -1 },  // down-left
    // { row: 1, col: 1 }    // down-right
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
  }, []);

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
                cell === 1 ? styles.blockedCell : null,
                cell === 2 ? styles.foodSection : null,
                cell === 3 ? styles.clothingSection : null,
                cell === 4 ? styles.appliancesSection : null,
                cell === 5 ? styles.entrySection : null,
                cell === 6 ? styles.exitSection : null,
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
          source={require('/Users/mihiresh/Mihiresh/Work/Walmart/walmart/frontend/WalmartStore/assets/start.png')} // Replace with your user standing icon
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
          source={require('/Users/mihiresh/Mihiresh/Work/Walmart/walmart/frontend/WalmartStore/assets/end.png')} // Replace with your pin icon
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
  foodSection: {
    backgroundColor: '#ff6f61',
  },
  clothingSection: {
    backgroundColor: '#007aff',
  },
  appliancesSection: {
    backgroundColor: '#5856d6',
  },
  entrySection: {
    backgroundColor: '#5ac8fa',
  },
  exitSection: {
    backgroundColor: '#ff9500',
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
