import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';

const GridPathFinder = () => {
  const [path, setPath] = useState([]);

  // The base map grid
  const grid = [
    [2, 2, 2, 0, 3, 3, 3, 0, 4, 4, 4],
    [2, 2, 2, 0, 3, 3, 3, 0, 4, 4, 4],
    [2, 2, 2, 0, 0, 0, 0, 0, 4, 4, 4],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 6],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5],
  ];

  // Calculate cell size dynamically based on the screen width and grid dimensions
  const screenWidth = Dimensions.get('window').width;
  const maxGridWidth = screenWidth - 60; // Consider some padding
  const cellSize = maxGridWidth / grid[0].length;

  // Create the pathway grid
  const pathwayGrid = grid.map(row => row.map(cell => (cell === 0 || cell === 6 ? 0 : 1)));

  const start = { row: 6, col: 5 };
  const end = { row: 3, col: 10 };

  // 8-directional movements including diagonals
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
    { row: -1, col: -1 }, // up-left
    { row: -1, col: 1 },  // up-right
    { row: 1, col: -1 }, // down-left
    { row: 1, col: 1 }   // down-right
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
          const isStart = start.row === rowIndex && start.col === colIndex;
          const isEnd = end.row === rowIndex && end.col === colIndex;
          return (
            <View
              key={colIndex}
              style={[
                styles.cell,
                { width: cellSize, height: cellSize },
                isStart ? styles.startCell : null,
                isEnd ? styles.endCell : null,
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

    return (
      <Svg height={cellSize * grid.length} width={cellSize * grid[0].length} style={styles.pathSvg}>
        {path.map((point, index) => {
          if (index === path.length - 1) return null;
          const startX = point.col * cellSize + cellSize / 2; // Center the line within the cell
          const startY = point.row * cellSize + cellSize / 2;
          const endX = path[index + 1].col * cellSize + cellSize / 2;
          const endY = path[index + 1].row * cellSize + cellSize / 2;

          return (
            <Line
              key={index}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#ffcc00"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        })}
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
      width: 0,
      height: 10,
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    margin: 1,
  },
  startCell: {
    backgroundColor: '#34c759',
    borderRadius: 10,
    borderColor: '#32a852',
    shadowColor: '#34c759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  endCell: {
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    borderColor: '#cc3232',
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  blockedCell: {
    backgroundColor: '#d1d1d6',
    borderRadius: 10,
  },
  foodSection: {
    backgroundColor: '#ff6f61',
    borderRadius: 10,
  },
  clothingSection: {
    backgroundColor: '#007aff',
    borderRadius: 10,
  },
  appliancesSection: {
    backgroundColor: '#5856d6',
    borderRadius: 10,
  },
  entrySection: {
    backgroundColor: '#5ac8fa',
    borderRadius: 10,
  },
  exitSection: {
    backgroundColor: '#ff9500',
    borderRadius: 10,
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
