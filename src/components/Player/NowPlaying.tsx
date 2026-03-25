import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, ChevronDown, Music2, Clock } from 'lucide-react-native';
import { usePlayerStore } from '../../store/usePlayerStore';
import { pauseTrack, resumeTrack, seekTo, playTrack } from '../../services/AudioService';
import Slider from '@react-native-community/slider';
import { fetchLyrics, getFormattedLyrics } from '../../services/LyricsService';


const { width, height } = Dimensions.get('window');

const WaveformBar = ({ index }: { index: number }) => {
  return (
    <View 
      className="bg-red-600 w-1 mx-0.5 rounded-full"
      style={{ height: 20 }} // Static height for now
    />
  );
};

const NowPlaying = ({ onClose }: { onClose: () => void }) => {
  const { 
    currentTrack, isPlaying, setIsPlaying, progress, duration, 
    setSleepTimer, sleepTimer, nextTrack, previousTrack, setProgress, setDuration
  } = usePlayerStore();
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string[]>([]);

  useEffect(() => {
    if (currentTrack) {
      loadLyrics();
    }
  }, [currentTrack]);

  const loadLyrics = async () => {
    if (!currentTrack) return;
    const raw = await fetchLyrics(currentTrack.title, currentTrack.artist);
    setLyrics(getFormattedLyrics(raw));
  };

  const handleSleepTimer = () => {
    Alert.alert(
      'Sleep Timer',
      'Stop playback after:',
      [
        { text: 'Off', onPress: () => setSleepTimer(null) },
        { text: '15 min', onPress: () => setSleepTimer(15) },
        { text: '30 min', onPress: () => setSleepTimer(30) },
        { text: '1 hour', onPress: () => setSleepTimer(60) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

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
    <View style={{ flex: 1 }} className="bg-dark px-6 pt-12">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={onClose} className="mb-4">
            <ChevronDown size={32} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSleepTimer}>
            <Clock size={24} color={sleepTimer ? "#FF0000" : "#FFF"} />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center gap-1 mt-4 mb-4">
          {[...Array(20)].map((_, i) => (
            <WaveformBar key={i} index={i} />
          ))}
        </View>

        {showLyrics ? (
          <ScrollView className="flex-1 mt-4">
            {lyrics.map((line, i) => (
              <Text key={i} className="text-zinc-400 text-lg mb-4 text-center">
                {line}
              </Text>
            ))}
          </ScrollView>
        ) : (
          <View className="items-center mt-8">
            <Image 
              source={{ uri: currentTrack.artwork }} 
              style={{ width: width * 0.8, height: width * 0.8 }}
              className="rounded-2xl shadow-2xl shadow-red-500/50"
            />
          </View>
        )}

        <View className="mt-8">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-white text-2xl font-bold" numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text className="text-red-500 text-lg mt-1" numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowLyrics(!showLyrics)}>
              <Music2 size={24} color={showLyrics ? "#FF0000" : "#FFF"} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={progress}
            minimumTrackTintColor="#FF0000"
            maximumTrackTintColor="#333333"
            thumbTintColor="#FF0000"
            onSlidingComplete={async (value) => {
              await seekTo(value * 1000); // conversion to millis
            }}
          />
          <View className="flex-row justify-between px-1">
            <Text className="text-gray-400 text-xs">{Math.floor(progress / 60)}:{Math.floor(progress % 60).toString().padStart(2, '0')}</Text>
            <Text className="text-gray-400 text-xs">{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-8 mb-10">
          <TouchableOpacity>
            <Shuffle size={24} color="#555555" />
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
            previousTrack();
            const { currentTrack: newTrack } = usePlayerStore.getState();
            if (newTrack) await playTrack(newTrack.url, (status) => {
              if (status.isLoaded) {
                setProgress(status.currentTime);
                setDuration(status.duration);
                setIsPlaying(status.playing);
              }
            });
          }}>
            <SkipBack size={32} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={togglePlayback}
            className="bg-red-600 w-20 h-20 rounded-full items-center justify-center shadow-lg shadow-red-500"
          >
            {isPlaying ? (
              <Pause size={40} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={40} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
            nextTrack();
            const { currentTrack: newTrack } = usePlayerStore.getState();
            if (newTrack) await playTrack(newTrack.url, (status) => {
              if (status.isLoaded) {
                setProgress(status.currentTime);
                setDuration(status.duration);
                setIsPlaying(status.playing);
              }
            });
          }}>
            <SkipForward size={32} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Repeat size={24} color="#555555" />
          </TouchableOpacity>
        </View>
    </View>
  );
};

export default NowPlaying;



