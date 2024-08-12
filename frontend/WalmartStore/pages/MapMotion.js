import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions, View, ActivityIndicator } from 'react-native';
import Svg, { Line, Rect, Circle, Text as SvgText } from 'react-native-svg';
import { Camera } from 'expo-camera'; // Correct import statement
import { Accelerometer, Gyroscope } from 'expo-sensors';

const { width } = Dimensions.get('window');
const GRID_SIZE = 10;
const CELL_SIZE = width / GRID_SIZE;

const sections = {
  Entry: { x: 9, y: 3, color: 'purple', label: 'Entry' },
  Food: { x: 1, y: 0, color: 'red', label: 'Food' },
  Clothing: { x: 1, y: 4, color: 'blue', label: 'Clothing' },
  'Home appl.': { x: 1, y: 8, color: 'green', label: 'Home appl.' }
};

const StoreNavigator = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [userPosition, setUserPosition] = useState({ x: 9, y: 3 });
  const [userDirection, setUserDirection] = useState({ x: 0, y: -1 });
  const [path, setPath] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(true);
  const [accelSubscription, setAccelSubscription] = useState(null);
  const [gyroSubscription, setGyroSubscription] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setLoading(false);
    })();

    _subscribeSensors();
    return () => _unsubscribeSensors();
  }, []);

  const _subscribeSensors = () => {
    setAccelSubscription(
      Accelerometer.addListener(data => {
        handleMovement(data);
      })
    );

    setGyroSubscription(
      Gyroscope.addListener(data => {
        handleRotation(data);
      })
    );
  };

  const _unsubscribeSensors = () => {
    accelSubscription && accelSubscription.remove();
    gyroSubscription && gyroSubscription.remove();
    setAccelSubscription(null);
    setGyroSubscription(null);
  };

  const handleMovement = (data) => {
    const { y } = data;
    let newPosition = { ...userPosition };

    if (y < -0.1) {
      newPosition.x += userDirection.x;
      newPosition.y += userDirection.y;
      setInstruction('Moving Forward');
    } else if (y > 0.1) {
      newPosition.x -= userDirection.x;
      newPosition.y -= userDirection.y;
      setInstruction('Moving Backward');
    }

    if (newPosition.x !== userPosition.x || newPosition.y !== userPosition.y) {
      setUserPosition(newPosition);
      const target = sections.Food;
      const newPath = generatePath(newPosition, target);
      setPath(newPath);
    }
  };

  const handleRotation = (data) => {
    const { z } = data;
    let newDirection = { ...userDirection };

    if (z > 0.1) {
      newDirection = { x: -userDirection.y, y: userDirection.x };
      setInstruction('Turning Right');
    } else if (z < -0.1) {
      newDirection = { x: userDirection.y, y: -userDirection.x };
      setInstruction('Turning Left');
    }

    if (newDirection.x !== userDirection.x || newDirection.y !== userDirection.y) {
      setUserDirection(newDirection);
    }
  };

  const generatePath = (start, end) => {
    const path = [];
    let { x, y } = start;
    while (x !== end.x) {
      x += x < end.x ? 1 : -1;
      path.push({ x, y });
    }
    while (y !== end.y) {
      y += y < end.y ? 1 : -1;
      path.push({ x, y });
    }
    return path;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back} />

      <Svg height={width} width={width} style={styles.overlay}>
        {Array.from({ length: GRID_SIZE }).map((_, x) =>
          Array.from({ length: GRID_SIZE }).map((_, y) => (
            <Rect
              key={`rect-${x}-${y}`}
              x={y * CELL_SIZE}
              y={x * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill="transparent"
              stroke="gray"
            />
          ))
        )}

        {Object.values(sections).map((section, index) => (
          <Rect
            key={`section-${index}`}
            x={section.y * CELL_SIZE}
            y={section.x * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill={section.color}
          />
        ))}

        {userPosition && (
          <Circle
            cx={userPosition.y * CELL_SIZE + CELL_SIZE / 2}
            cy={userPosition.x * CELL_SIZE + CELL_SIZE / 2}
            r={CELL_SIZE / 4}
            fill="yellow"
            stroke="black"
            strokeWidth="2"
          />
        )}

        {path.map((node, index) =>
          index < path.length - 1 ? (
            <Line
              key={`line-${node.x}-${node.y}`}
              x1={node.y * CELL_SIZE + CELL_SIZE / 2}
              y1={node.x * CELL_SIZE + CELL_SIZE / 2}
              x2={path[index + 1].y * CELL_SIZE + CELL_SIZE / 2}
              y2={path[index + 1].x * CELL_SIZE + CELL_SIZE / 2}
              stroke="blue"
              strokeWidth="3"
            />
          ) : null
        )}

        {Object.values(sections).map((section, index) => (
          <SvgText
            key={`label-${index}`}
            x={section.y * CELL_SIZE + CELL_SIZE / 2}
            y={section.x * CELL_SIZE + CELL_SIZE / 2}
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            {section.label}
          </SvgText>
        ))}
      </Svg>

      <View style={styles.metricsContainer}>
        <Text style={styles.metricTitle}>Sensor Data</Text>
        <Text>Current Position: ({userPosition.x}, {userPosition.y})</Text>
        <Text>Current Direction: ({userDirection.x}, {userDirection.y})</Text>
        <Text>{instruction}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  metricsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    padding: 10,
    backgroundColor: '#000000aa',
    borderRadius: 10,
    zIndex: 3,
  },
  metricTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
});

export default StoreNavigator;
