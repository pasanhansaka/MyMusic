import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { Heart, Flame, Play, Disc } from 'lucide-react-native';
import { searchMusic, getStreamUrl, YouTubeItem } from '../../src/api/musicApi';
import { usePlayerStore, Track } from '../../src/store/usePlayerStore';
import { playTrack } from '../../src/services/AudioService';

const CATEGORIES = ['Trending', 'Chill', 'Workout', 'Party', 'Focus', 'Sleep'];

export default function HomeScreen() {
  const [trending, setTrending] = useState<YouTubeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentTrack, setQueue, setIsPlaying, setProgress, setDuration } = usePlayerStore();

  useEffect(() => {
    fetchDiscovery();
  }, []);

  const fetchDiscovery = async () => {
    setLoading(true);
    try {
      const results = await searchMusic('Top Hits 2024');
      setTrending(results);
    } catch (error) {
      console.error('Discovery error:', error);
    } finally {
      setLoading(false);
    }
  };

  const playSong = async (item: YouTubeItem) => {
    try {
      const streamUrl = await getStreamUrl(item.id);
      const track: Track = {
        id: item.id,
        url: streamUrl,
        title: item.title,
        artist: item.artist,
        artwork: item.thumbnail,
      };

      await playTrack(streamUrl, (status) => {
        if (status.isLoaded) {
          setProgress(status.positionMillis / 1000);
          setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
          setIsPlaying(status.isPlaying);
        }
      });
      
      setCurrentTrack(track);
      setQueue([track]);
      setIsPlaying(true);
    } catch (error) {
      console.error('Playback error:', error);
    }
  };


  return (
    <ScrollView className="flex-1 bg-black pt-12">
      <View className="px-6 mb-8 flex-row justify-between items-center">
        <View>
          <Text className="text-zinc-500 text-sm font-medium">Welcome to</Text>
          <Text className="text-white text-3xl font-bold">Thorn <Text className="text-red-600">Music</Text></Text>
        </View>
        <TouchableOpacity className="bg-zinc-900 p-3 rounded-full">
          <Heart size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        className="px-6 mb-8"
        contentContainerStyle={{ gap: 12 }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat} className="bg-zinc-900 px-6 py-2 rounded-full border border-zinc-800">
            <Text className="text-white font-medium">{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-6 mb-6">
        <View className="flex-row items-center mb-4">
          <Flame size={20} color="#FF0000" />
          <Text className="text-white text-xl font-bold ml-2">Trending Now</Text>
        </View>
        
        <FlatList
          data={trending.slice(0, 5)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="w-40"
              onPress={() => playSong(item)}
            >
              <View className="relative">
                <Image 
                  source={{ uri: item.thumbnail }} 
                  className="w-40 h-40 rounded-2xl"
                />
                <View className="absolute bottom-2 right-2 bg-red-600 p-2 rounded-full shadow-lg shadow-red-500">
                  <Play size={16} color="#FFF" fill="#FFF" />
                </View>
              </View>
              <Text className="text-white font-bold mt-2 text-sm" numberOfLines={1}>{item.title}</Text>
              <Text className="text-zinc-500 text-xs" numberOfLines={1}>{item.artist}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View className="px-6 mb-20">
        <View className="flex-row items-center mb-4">
          <Disc size={20} color="#FF0000" />
          <Text className="text-white text-xl font-bold ml-2">Recommended for You</Text>
        </View>
        
        {trending.slice(5).map((item) => (
          <TouchableOpacity 
            key={item.id} 
            className="flex-row items-center mb-4 bg-zinc-900/40 p-2 rounded-xl"
            onPress={() => playSong(item)}
          >
            <Image source={{ uri: item.thumbnail }} className="w-14 h-14 rounded-lg" />
            <View className="flex-1 ml-3">
              <Text className="text-white font-bold text-sm" numberOfLines={1}>{item.title}</Text>
              <Text className="text-zinc-500 text-xs" numberOfLines={1}>{item.artist}</Text>
            </View>
            <Play size={18} color="#FF0000" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
