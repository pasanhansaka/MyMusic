import 'react-native-gesture-handler';
import './src/global.css';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';

// The entry point for Expo Router
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);

// TrackPlayer service removed in favor of expo-av for Expo Go compatibility
