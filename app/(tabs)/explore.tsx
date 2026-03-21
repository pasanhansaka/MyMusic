import { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList,
  TouchableOpacity, TextInput, Alert, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export default function PlaylistsScreen() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Load playlists from storage when screen opens
  useEffect(() => {
    loadPlaylists();
  }, []);

  async function loadPlaylists() {
    try {
      const stored = await AsyncStorage.getItem('playlists');
      if (stored) {
        setPlaylists(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
    }
  }

  async function savePlaylists(updated: Playlist[]) {
    try {
      await AsyncStorage.setItem('playlists', JSON.stringify(updated));
      setPlaylists(updated);
    } catch (error) {
      console.error('Failed to save playlists:', error);
    }
  }

  function createPlaylist() {
    if (!newPlaylistName.trim()) {
      Alert.alert('Please enter a playlist name');
      return;
    }
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      songs: [],
    };
    savePlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
    setModalVisible(false);
  }

  function deletePlaylist(id: string) {
    Alert.alert(
      'Delete Playlist',
      'Are you sure you want to delete this playlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = playlists.filter((p) => p.id !== id);
            savePlaylists(updated);
            if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
          },
        },
      ]
    );
  }

  function removeSongFromPlaylist(playlistId: string, songId: string) {
    const updated = playlists.map((p) =>
      p.id === playlistId
        ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
        : p
    );
    savePlaylists(updated);
    if (selectedPlaylist?.id === playlistId) {
      const refreshed = updated.find((p) => p.id === playlistId) || null;
      setSelectedPlaylist(refreshed);
    }
  }

  // Showing songs inside a playlist
  if (selectedPlaylist) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedPlaylist(null)} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>{selectedPlaylist.name}</Text>
        <Text style={styles.subheading}>{selectedPlaylist.songs.length} songs</Text>

        {selectedPlaylist.songs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No songs yet</Text>
            <Text style={styles.emptySubText}>Add songs from the Home screen</Text>
          </View>
        ) : (
          <FlatList
            data={selectedPlaylist.songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.songCard}>
                <View style={styles.albumArt}>
                  <Text style={styles.albumArtText}>♪</Text>
                </View>
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
                </View>
                <TouchableOpacity onPress={() => removeSongFromPlaylist(selectedPlaylist.id, item.id)}>
                  <Text style={styles.removeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    );
  }

  // Showing playlist list
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Playlists</Text>

      <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.createButtonText}>+ Create New Playlist</Text>
      </TouchableOpacity>

      {playlists.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No playlists yet</Text>
          <Text style={styles.emptySubText}>Create your first playlist above</Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.playlistCard}
              onPress={() => setSelectedPlaylist(item)}
            >
              <View style={styles.playlistIcon}>
                <Text style={styles.playlistIconText}>♫</Text>
              </View>
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistName}>{item.name}</Text>
                <Text style={styles.playlistCount}>{item.songs.length} songs</Text>
              </View>
              <TouchableOpacity onPress={() => deletePlaylist(item.id)}>
                <Text style={styles.deleteButton}>🗑</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Create playlist modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Playlist</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Playlist name..."
              placeholderTextColor="#7c7c8a"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => { setModalVisible(false); setNewPlaylistName(''); }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCreate} onPress={createPlaylist}>
                <Text style={styles.modalCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: '#7c7c8a',
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#534AB7',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#534AB7',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  playlistIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistIconText: {
    fontSize: 22,
    color: '#9FE1CB',
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playlistName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  playlistCount: {
    fontSize: 13,
    color: '#7c7c8a',
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 18,
    padding: 4,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#534AB7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumArtText: {
    fontSize: 22,
    color: '#CECBF6',
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  artistName: {
    fontSize: 13,
    color: '#7c7c8a',
    marginTop: 2,
  },
  removeButton: {
    color: '#7c7c8a',
    fontSize: 16,
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#7c7c8a',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: '#4a4a6a',
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    borderWidth: 1,
    borderColor: '#534AB7',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#534AB7',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#534AB7',
    fontWeight: '600',
  },
  modalCreate: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#534AB7',
    alignItems: 'center',
  },
  modalCreateText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
