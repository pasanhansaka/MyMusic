import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { Plus, ListMusic, MoreVertical, Trash2, Import as ImportIcon } from 'lucide-react-native';
import api from '../src/api/musicApi';

interface Playlist {
  id: string;
  name: string;
  tracks: any[];
}

const PlaylistsScreen = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await api.get<Playlist[]>('/music/playlists/user-id-placeholder'); // Replace with real user ID
      setPlaylists(response.data);
    } catch (error) {
      console.error('Fetch playlists error:', error);
    }
  };


  const createPlaylist = async () => {
    if (!newPlaylistName) return;
    try {
      await api.post('/music/playlist', {
        userId: 'user-id-placeholder',
        name: newPlaylistName,
        tracks: []
      });
      setIsModalVisible(false);
      setNewPlaylistName('');
      fetchPlaylists();
    } catch (error) {
      Alert.alert('Error', 'Failed to create playlist');
    }
  };

  const handleImport = async () => {
    if (!importUrl) return;
    try {
      const response = await api.get('/music/playlist/import', { params: { url: importUrl } });
      await api.post('/music/playlist', {
        userId: 'user-id-placeholder',
        name: 'Imported Playlist',
        tracks: response.data
      });
      setIsImportModalVisible(false);
      setImportUrl('');
      fetchPlaylists();
    } catch (error) {
      Alert.alert('Error', 'Failed to import playlist');
    }
  };

  return (
    <View className="flex-1 bg-black p-6 pt-12">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-white text-3xl font-bold">Your Library</Text>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => setIsImportModalVisible(true)}>
            <ImportIcon size={24} color="#FF0000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Plus size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row items-center mb-4 bg-zinc-900/50 p-4 rounded-2xl">
            <View className="bg-red-600/10 p-3 rounded-lg">
              <ListMusic size={24} color="#FF0000" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-white font-bold text-lg">{item.name}</Text>
              <Text className="text-zinc-500 text-sm">{item.tracks?.length || 0} tracks</Text>
            </View>
            <TouchableOpacity>
              <Trash2 size={20} color="#555" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-20">
            <Text className="text-zinc-500 text-lg">No playlists yet.</Text>
            <Text className="text-zinc-600 text-sm mt-2">Create one or import from YouTube!</Text>
          </View>
        )}
      />

      {/* New Playlist Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/80 px-6">
          <View className="bg-zinc-900 p-6 rounded-3xl w-full border border-zinc-800">
            <Text className="text-white text-xl font-bold mb-4">New Playlist</Text>
            <TextInput
              className="bg-zinc-800 p-4 rounded-xl text-white mb-6"
              placeholder="Playlist name"
              placeholderTextColor="#555"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="px-4 py-2">
                <Text className="text-zinc-400 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createPlaylist} className="bg-red-600 px-6 py-2 rounded-full">
                <Text className="text-white font-bold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Import Modal */}
      <Modal visible={isImportModalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/80 px-6">
          <View className="bg-zinc-900 p-6 rounded-3xl w-full border border-zinc-800">
            <Text className="text-white text-xl font-bold mb-4">Import YouTube Playlist</Text>
            <TextInput
              className="bg-zinc-800 p-4 rounded-xl text-white mb-6"
              placeholder="Paste YouTube Playlist URL"
              placeholderTextColor="#555"
              value={importUrl}
              onChangeText={setImportUrl}
              autoFocus
            />
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity onPress={() => setIsImportModalVisible(false)} className="px-4 py-2">
                <Text className="text-zinc-400 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleImport} className="bg-red-600 px-6 py-2 rounded-full">
                <Text className="text-white font-bold">Import</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlaylistsScreen;
