import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { TestComponent } from './components/TestComponent';

export const TestPage = () => {
  return (
    <>
        <View>
            <Text>HII Page A</Text>
            <TestComponent/>
        </View>
    </>
  )
}
