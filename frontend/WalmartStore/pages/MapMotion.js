import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Svg, { Line, Circle } from 'react-native-svg';

const MAP_SIZE = 7; // Define the size of the map
const SECTIONS = {
  entry: { x: 3, y: 6 },
  food: { x: 0, y: 1 },
  clothing: { x: 3, y: 1 },
  home: { x: 6, y: 1 },
};

const STEPS_PER_CELL = 2; // Number of steps required to move from one grid cell to another

const StoreNavigator = () => {
  const [stepCounter, setStepCounter] = useState(0);
  const [direction, setDirection] = useState('up'); // Default direction is 'up'
  const [position, setPosition] = useState(SECTIONS.entry);
  const [path, setPath] = useState([SECTIONS.entry]);
  const [target, setTarget] = useState(SECTIONS.food);
  const [instructions, setInstructions] = useState('Move Forward for Food');

  useEffect(() => {
    const accelerometerSubscription = Accelerometer.addListener((data) => {
      handleAccelerometerData(data);
    });

    return () => {
      accelerometerSubscription.remove();
    };
  }, [stepCounter, direction]);

  const handleAccelerometerData = (data) => {
    // Only consider horizontal movement by ignoring z-axis
    const horizontalMagnitude = Math.sqrt(data.x * data.x + data.y * data.y);

    if (horizontalMagnitude > 1.2 && horizontalMagnitude < 2.5) {  // Adjust these thresholds based on testing
      setStepCounter((prevSteps) => prevSteps + 1);

      if (stepCounter + 1 >= STEPS_PER_CELL) {
        updatePosition();
        setStepCounter(0); // Reset step counter after moving to a new cell
      }
    }
  };

  const handleTurnLeft = () => {
    setDirection((prevDirection) => {
      switch (prevDirection) {
        case 'up': return 'left';
        case 'left': return 'down';
        case 'down': return 'right';
        case 'right': return 'up';
        default: return 'up';
      }
    });
  };

  const handleTurnRight = () => {
    setDirection((prevDirection) => {
      switch (prevDirection) {
        case 'up': return 'right';
        case 'right': return 'down';
        case 'down': return 'left';
        case 'left': return 'up';
        default: return 'up';
      }
    });
  };

  const updatePosition = () => {
    setPosition((prevPosition) => {
      let newPosition = { ...prevPosition };
      switch (direction) {
        case 'up':
          newPosition.y = Math.max(0, prevPosition.y - 1);
          break;
        case 'down':
          newPosition.y = Math.min(MAP_SIZE - 1, prevPosition.y + 1);
          break;
        case 'left':
          newPosition.x = Math.max(0, prevPosition.x - 1);
          break;
        case 'right':
          newPosition.x = Math.min(MAP_SIZE - 1, prevPosition.x + 1);
          break;
        default:
          break;
      }
      setPath((prevPath) => [...prevPath, newPosition]);

      if (newPosition.x === target.x && newPosition.y === target.y) {
        setInstructions('You have reached your destination');
      } else {
        updateInstructions(newPosition);
      }

      return newPosition;
    });
  };

  const updateInstructions = (newPosition) => {
    if (newPosition.x < target.x) {
      setInstructions('Move Right for Food');
    } else if (newPosition.x > target.x) {
      setInstructions('Move Left for Food');
    } else if (newPosition.y < target.y) {
      setInstructions('Move Down for Food');
    } else if (newPosition.y > target.y) {
      setInstructions('Move Forward for Food');
    }
  };

  const getGridBackgroundColor = (x, y) => {
    if (x === SECTIONS.food.x && y >= SECTIONS.food.y && y <= SECTIONS.food.y + 2) return '#FF6347';
    if (x === SECTIONS.clothing.x && y >= SECTIONS.clothing.y && y <= SECTIONS.clothing.y + 2) return '#4682B4';
    if (x === SECTIONS.home.x && y >= SECTIONS.home.y && y <= SECTIONS.home.y + 2) return '#32CD32';
    return 'white';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Map</Text>
      <View style={styles.map}>
        {Array.from({ length: MAP_SIZE }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Array.from({ length: MAP_SIZE }).map((_, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.cell,
                  { backgroundColor: getGridBackgroundColor(colIndex, rowIndex) },
                ]}
              >
                {colIndex === SECTIONS.entry.x && rowIndex === SECTIONS.entry.y && (
                  <Text style={styles.label}>Entry</Text>
                )}
                {colIndex === SECTIONS.food.x && rowIndex === SECTIONS.food.y && (
                  <Text style={styles.label}>Food</Text>
                )}
                {colIndex === SECTIONS.clothing.x && rowIndex === SECTIONS.clothing.y && (
                  <Text style={styles.label}>Clothing</Text>
                )}
                {colIndex === SECTIONS.home.x && rowIndex === SECTIONS.home.y && (
                  <Text style={styles.label}>Home appl.</Text>
                )}
              </View>
            ))}
          </View>
        ))}
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          {path.map((pos, index) => {
            if (index === 0) return null;
            const prevPos = path[index - 1];
            return (
              <Line
                key={index}
                x1={prevPos.x * 50 + 25}
                y1={prevPos.y * 50 + 25}
                x2={pos.x * 50 + 25}
                y2={pos.y * 50 + 25}
                stroke="blue"
                strokeWidth="3"
              />
            );
          })}
          <Circle cx={position.x * 50 + 25} cy={position.y * 50 + 25} r="10" fill="yellow" stroke="black" strokeWidth="2" />
        </Svg>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Turn Left" onPress={handleTurnLeft} />
        <Button title="Turn Right" onPress={handleTurnRight} />
      </View>
      <Text style={styles.instructions}>{instructions}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  map: {
    width: 350,
    height: 350,
    position: 'relative',
    borderColor: 'black',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  instructions: {
    fontSize: 18,
    marginVertical: 16,
    textAlign: 'center',
  },
});

export default StoreNavigator;
