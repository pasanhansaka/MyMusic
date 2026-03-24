import 'react-native-gesture-handler';
import './src/global.css';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from './src/services/TrackPlayerService';
import React from 'react';

// The entry point for Expo Router
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);

// Register the TrackPlayer playback service
TrackPlayer.registerPlaybackService(() => PlaybackService);
