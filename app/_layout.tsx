import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Modal, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import MiniPlayer from '../src/components/Player/MiniPlayer';
import NowPlaying from '../src/components/Player/NowPlaying';
import { useSetupPlayer } from '../src/hooks/useSetupPlayer';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Main Layout for the application.
 * This is the default export required by Expo Router.
 */
export default function Layout() {
  const colorScheme = useColorScheme();
  const isPlayerReady = useSetupPlayer();
  const [isNowPlayingVisible, setIsNowPlayingVisible] = useState(false);

  if (!isPlayerReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <MiniPlayer onOpenNowPlaying={() => setIsNowPlayingVisible(true)} />

        <Modal
          visible={isNowPlayingVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setIsNowPlayingVisible(false)}
        >
          <NowPlaying onClose={() => setIsNowPlayingVisible(false)} />
        </Modal>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


