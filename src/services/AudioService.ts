import { useAudioPlayer, AudioMode, setAudioModeAsync, createAudioPlayer } from 'expo-audio';

let player: any = null;

export const setupAudio = async () => {
  try {
    await setAudioModeAsync({
      shouldPlayInBackground: true,
      playsInSilentMode: true,
      interruptionMode: 'doNotMix',
      shouldRouteThroughEarpiece: false,
    });
  } catch (error) {
    console.error('Error setting up audio mode:', error);
  }
};

export const playTrack = async (url: string, onUpdate?: (status: any) => void) => {
  try {
    if (player) {
      player.pause();
    }

    player = createAudioPlayer(url);
    
    // Add status listener for updates
    if (onUpdate) {
      player.addListener('playbackStatusUpdate', onUpdate);
    }

    player.play();
    return player;
  } catch (error) {
    console.error('Error playing track:', error);
    throw error;
  }
};

export const pauseTrack = async () => {
  if (player) {
    player.pause();
  }
};

export const resumeTrack = async () => {
  if (player) {
    player.play();
  }
};

export const stopTrack = async () => {
  if (player) {
    player.pause();
    player = null;
  }
};

export const setVolume = async (volume: number) => {
  if (player) {
    player.setVolume(volume);
  }
};

export const seekTo = async (millis: number) => {
  if (player) {
    await player.seekTo(millis / 1000);
  }
};
