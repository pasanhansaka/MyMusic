import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Search as SearchIcon, Play } from 'lucide-react-native';
import { searchMusic, getStreamUrl, YouTubeItem } from '../../src/api/musicApi';
import { usePlayerStore } from '../../src/store/usePlayerStore';
import TrackPlayer, { Track } from 'react-native-track-player';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YouTubeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { setCurrentTrack, setQueue, setIsPlaying } = usePlayerStore();


  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await searchMusic(query);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
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

      await TrackPlayer.reset();
      await TrackPlayer.add([track]);
      await TrackPlayer.play();
      
      setCurrentTrack(track);
      setQueue([track]);
      setIsPlaying(true);
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  return (
    <View className="flex-1 bg-black p-4">
      <View className="flex-row items-center bg-zinc-900 rounded-full px-4 py-2 mt-4">
        <SearchIcon size={20} color="#888" />
        <TextInput
          className="flex-1 ml-2 text-white text-base"
          placeholder="Search songs, artists, albums..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator className="mt-10" color="#FF0000" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          className="mt-6"
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="flex-row items-center mb-4 bg-zinc-900/50 p-2 rounded-xl"
              onPress={() => playSong(item)}
            >
              <Image 
                source={{ uri: item.thumbnail }} 
                className="w-16 h-16 rounded-lg"
              />
              <View className="flex-1 ml-3">
                <Text className="text-white font-bold text-base" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-zinc-400 text-sm" numberOfLines={1}>
                  {item.artist}
                </Text>
              </View>
              <View className="bg-red-600/20 p-2 rounded-full">
                <Play size={20} color="#FF0000" fill="#FF0000" />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default SearchScreen;
