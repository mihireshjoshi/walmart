

// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Svg, { Circle, Text as SvgText } from 'react-native-svg';

// const QueueStatus = ({ route }) => {
//     const { queueInfo } = route.params;
//     const [timeRemaining, setTimeRemaining] = useState(queueInfo.estimated_time);
//     const navigation = useNavigation();

//     useEffect(() => {
//         if (timeRemaining > 0) {
//             const timer = setInterval(() => {
//                 setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//             }, 1000);

//             return () => clearInterval(timer);
//         }
//     }, [timeRemaining]);

//     const handleBackToHome = () => {
//         navigation.navigate('LandingPage'); // Assuming 'LandingPage' is your home screen
//     };

//     const radius = 60;
//     const strokeWidth = 10;
//     const circleLength = 2 * Math.PI * radius;
//     const progress = (timeRemaining / queueInfo.estimated_time) * circleLength;

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Queue Status</Text>
//             <Text style={styles.infoText}>Queue Name: {queueInfo.queue_name}</Text>
//             <View style={styles.timerContainer}>
//                 <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
//                     <Circle
//                         cx={radius + strokeWidth / 2}
//                         cy={radius + strokeWidth / 2}
//                         r={radius}
//                         stroke="#e0e0e0"
//                         strokeWidth={strokeWidth}
//                         fill="none"
//                     />
//                     <Circle
//                         cx={radius + strokeWidth / 2}
//                         cy={radius + strokeWidth / 2}
//                         r={radius}
//                         stroke="#00aaff"
//                         strokeWidth={strokeWidth}
//                         strokeDasharray={circleLength}
//                         strokeDashoffset={circleLength - progress}
//                         fill="none"
//                         rotation="-90"
//                         originX={radius + strokeWidth / 2}
//                         originY={radius + strokeWidth / 2}
//                     />
//                     <SvgText
//                         x={radius + strokeWidth / 2}
//                         y={radius + strokeWidth / 2}
//                         fontSize="20"
//                         fill="#000"
//                         textAnchor="middle"
//                         alignmentBaseline="middle"
//                     >
//                         {timeRemaining}s
//                     </SvgText>
//                 </Svg>
//             </View>
//             {timeRemaining > 0 ? (
//                 <Text style={styles.infoText}>Estimated Wait Time: {timeRemaining} seconds</Text>
//             ) : (
//                 <Text style={styles.infoText}>You can now proceed to the queue.</Text>
//             )}
//             <Button title="Back to Home" onPress={handleBackToHome} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     infoText: {
//         fontSize: 18,
//         marginVertical: 10,
//     },
//     timerContainer: {
//         marginVertical: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default QueueStatus;
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const QueueStatus = ({ route }) => {
    const { queueInfo } = route.params;
    const [timeRemaining, setTimeRemaining] = useState(queueInfo.estimated_time);
    const navigation = useNavigation();

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

    const handleBackToHome = () => {
        navigation.navigate('LandingPage'); // Assuming 'LandingPage' is your home screen
    };

    const radius = 60;
    const strokeWidth = 10;
    const circleLength = 2 * Math.PI * radius;
    const progress = (timeRemaining / queueInfo.estimated_time) * circleLength;

    // Convert seconds to mm:ss format
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Queue Status</Text>
            <Text style={styles.infoText}>Queue Name: {queueInfo.queue_name}</Text>
            <View style={styles.timerContainer}>
                <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
                    <Circle
                        cx={radius + strokeWidth / 2}
                        cy={radius + strokeWidth / 2}
                        r={radius}
                        stroke="#e0e0e0"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx={radius + strokeWidth / 2}
                        cy={radius + strokeWidth / 2}
                        r={radius}
                        stroke="#00aaff"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circleLength}
                        strokeDashoffset={circleLength - progress}
                        fill="none"
                        rotation="-90"
                        originX={radius + strokeWidth / 2}
                        originY={radius + strokeWidth / 2}
                    />
                    <SvgText
                        x={radius + strokeWidth / 2}
                        y={radius + strokeWidth / 2}
                        fontSize="20"
                        fill="#000"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                    >
                        {formattedTime}
                    </SvgText>
                </Svg>
            </View>
            {timeRemaining > 0 ? (
                <Text style={styles.infoText}>Estimated Wait Time: {formattedTime} minutes</Text>
            ) : (
                <Text style={styles.infoText}>You can now proceed to the queue.</Text>
            )}
            <Button title="Back to Home" onPress={handleBackToHome} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        marginVertical: 10,
    },
    timerContainer: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default QueueStatus;
