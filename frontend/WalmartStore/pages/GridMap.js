import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';

const GridPathFinder = () => {
  const [path, setPath] = useState([]);

  // Original base map grid
  const originalGrid = [
    [2, 2, 2, 0, 3, 3, 3, 0, 4, 4, 4],
    [2, 2, 2, 0, 3, 3, 3, 0, 4, 4, 4],
    [2, 2, 2, 0, 0, 0, 0, 0, 4, 4, 4],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5],
  ];

  // Scale factor
  const scaleFactor = 10;

  // Create the high-resolution grid by expanding each cell of the original grid
  const grid = [];
  for (let i = 0; i < originalGrid.length; i++) {
    for (let r = 0; r < scaleFactor; r++) {
      const newRow = [];
      for (let j = 0; j < originalGrid[i].length; j++) {
        for (let c = 0; c < scaleFactor; c++) {
          newRow.push(originalGrid[i][j]);
        }
      }
      grid.push(newRow);
    }
  }

  // Calculate cell size dynamically based on the screen width and grid dimensions
  const screenWidth = Dimensions.get('window').width;
  const maxGridWidth = screenWidth; // Full width with no padding
  const cellSize = maxGridWidth / grid[0].length;

  // Create the pathway grid
  const pathwayGrid = grid.map(row => row.map(cell => (cell === 0 || cell === 6 ? 0 : 1)));

  // Adjust the start and end positions to match the new grid
  const start = { row: 6 * scaleFactor + 5, col: 5 * scaleFactor + 5};
  const end = { row: 3 * scaleFactor + 5, col: 10 * scaleFactor + 5};

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
          const isPath = path.some(p => p.row === rowIndex && p.col === colIndex);
          return (
            <View
              key={colIndex}
              style={[
                styles.cell,
                { width: cellSize, height: cellSize },
                isStart || isEnd ? styles.highlightCell : null,
                isPath ? styles.pathCell : null,
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

          // Adjust the path coordinates to move through the center of each cell
          const startX = (point.col + 0.5) * cellSize;
          const startY = (point.row + 0.5) * cellSize;
          const endX = (path[index + 1].col + 0.5) * cellSize;
          const endY = (path[index + 1].row + 0.5) * cellSize;

          return (
            <Line
              key={index}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#000"
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}
        <Circle cx={(start.col + 0.5) * cellSize} cy={(start.row + 0.5) * cellSize} r={cellSize / 3} fill="yellow" />
        <Circle cx={(end.col + 0.5) * cellSize} cy={(end.row + 0.5) * cellSize} r={cellSize / 3} fill="yellow" />
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
  highlightCell: {
    borderRadius: 10,
  },
  pathCell: {
    backgroundColor: 'yellow',
  },
  startCell: {
    backgroundColor: '#34c759',
  },
  endCell: {
    backgroundColor: '#ff3b30',
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
