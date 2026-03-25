import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import { usePlayerStore } from '../../store/usePlayerStore';
import { pauseTrack, resumeTrack, playTrack } from '../../services/AudioService';

const MiniPlayer = ({ onOpenNowPlaying }: { onOpenNowPlaying: () => void }) => {
  const { currentTrack, isPlaying, setIsPlaying, setProgress, setDuration } = usePlayerStore();

  if (!currentTrack) return null;

  const togglePlayback = async () => {
    if (isPlaying) {
      await pauseTrack();
      setIsPlaying(false);
    } else {
      await resumeTrack();
      setIsPlaying(true);
    }
  };

  return (
    <Pressable 
      onPress={onOpenNowPlaying}
      className="absolute bottom-0 left-0 right-0 bg-dark/95 border-t border-red-900/30 flex-row items-center px-4 py-2"
    >
      <Image 
        source={{ uri: currentTrack.artwork }} 
        className="w-12 h-12 rounded-md"
      />
      <View className="flex-1 ml-3">
        <Text className="text-white font-bold text-sm" numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text className="text-gray-400 text-xs" numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={togglePlayback}>
          {isPlaying ? (
            <Pause size={24} color="#FF0000" fill="#FF0000" />
          ) : (
            <Play size={24} color="#FF0000" fill="#FF0000" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => {
          const { nextTrack } = usePlayerStore.getState();
          nextTrack();
          const { currentTrack: newTrack } = usePlayerStore.getState();
          if (newTrack) await playTrack(newTrack.url, (status) => {
            if (status.isLoaded) {
              setProgress(status.positionMillis / 1000);
              setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
              setIsPlaying(status.isPlaying);
            }
          });
        }}>
          <SkipForward size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default MiniPlayer;

