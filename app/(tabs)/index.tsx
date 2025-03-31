import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>Seoul</Text>
      </View>
      <View style={styles.weather}>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato'
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500'
  },
  weather: {
    flex: 3,
    backgroundColor: 'teal'
  },
  day: {
    flex: 1,
    alignItems: 'center'
  },
  temp: {
    marginTop: 50,
    fontSize: 178
  },
  description: {
    marginTop: -30,
    fontSize: 60
  }
});
