import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { CheckCircle, Trash2, Download } from 'lucide-react-native';
import { getAllOfflineTracks, deleteOfflineTrack, OfflineTrack } from '../src/services/OfflineService';
import { usePlayerStore, Track } from '../src/store/usePlayerStore';
import { playTrack } from '../src/services/AudioService';

const DownloadsScreen = () => {
  const [downloads, setDownloads] = useState<OfflineTrack[]>([]);
  const { setCurrentTrack, setQueue, setIsPlaying, setProgress, setDuration } = usePlayerStore();

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    const tracks = await getAllOfflineTracks();
    setDownloads(tracks);
  };

  const playOfflineTrack = async (item: OfflineTrack) => {
    const track: Track = {
      id: item.videoId,
      url: item.localUri,
      title: item.metadata.title,
      artist: item.metadata.artist,
      artwork: item.metadata.artwork,
    };


    await playTrack(item.localUri, (status) => {
      if (status.isLoaded) {
        setProgress(status.positionMillis / 1000);
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
        setIsPlaying(status.isPlaying);
      }
    });
    
    setCurrentTrack(track);
    setQueue([track]);
    setIsPlaying(true);
  };

  const removeDownload = async (videoId: string) => {
    await deleteOfflineTrack(videoId);
    fetchDownloads();
  };

  return (
    <View className="flex-1 bg-black p-6 pt-12">
      <Text className="text-white text-3xl font-bold mb-8">Downloads</Text>

      <FlatList
        data={downloads}
        keyExtractor={(item) => item.videoId}
        renderItem={({ item }) => (
          <View className="flex-row items-center mb-4 bg-zinc-900/40 p-3 rounded-2xl">
            <TouchableOpacity 
              className="flex-1 flex-row items-center"
              onPress={() => playOfflineTrack(item)}
            >
              <Image 
                source={{ uri: item.metadata.artwork }} 
                className="w-14 h-14 rounded-xl"
              />
              <View className="ml-3 flex-1">
                <Text className="text-white font-bold text-base" numberOfLines={1}>
                  {item.metadata.title}
                </Text>
                <Text className="text-zinc-500 text-sm" numberOfLines={1}>
                  {item.metadata.artist}
                </Text>
              </View>
            </TouchableOpacity>
            
            <View className="flex-row items-center gap-4">
              <CheckCircle size={20} color="#22c55e" />
              <TouchableOpacity onPress={() => removeDownload(item.videoId)}>
                <Trash2 size={20} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-20">
            <Download size={48} color="#222" />
            <Text className="text-zinc-500 text-lg mt-4">No downloads yet.</Text>
          </View>
        )}
      />
    </View>
  );
};

export default DownloadsScreen;
