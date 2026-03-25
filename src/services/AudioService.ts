import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

let sound: Audio.Sound | null = null;

export const setupAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    console.error('Error setting up audio mode:', error);
  }
};

export const playTrack = async (url: string, onUpdate?: (status: any) => void) => {
  try {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true },
      onUpdate
    );
    
    sound = newSound;
    return sound;
  } catch (error) {
    console.error('Error playing track:', error);
    throw error;
  }
};

export const pauseTrack = async () => {
  if (sound) {
    await sound.pauseAsync();
  }
};

export const resumeTrack = async () => {
  if (sound) {
    await sound.playAsync();
  }
};

export const stopTrack = async () => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
};

export const setVolume = async (volume: number) => {
  if (sound) {
    await sound.setVolumeAsync(volume);
  }
};

export const seekTo = async (millis: number) => {
  if (sound) {
    await sound.setPositionAsync(millis);
  }
};
