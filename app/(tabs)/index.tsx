import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList,
  TouchableOpacity, TextInput, ActivityIndicator,
  Alert, ScrollView
} from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JAMENDO_CLIENT_ID, JAMENDO_BASE_URL } from '../../config';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  url: string;
}

const GENRES = [
  { id: 'all', label: 'All' },
  { id: 'pop', label: 'Pop' },
  { id: 'rock', label: 'Rock' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'electronic', label: 'Electronic' },
  { id: 'classical', label: 'Classical' },
  { id: 'hiphop', label: 'Hip Hop' },
  { id: 'ambient', label: 'Ambient' },
];

export default function HomeScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isShuffle, setIsShuffle] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [elapsedTime, setElapsedTime] = useState('0:00');

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);
  const progressInterval = useRef<any>(null);

  useEffect(() => {
    fetchSongs('', 'all');
  }, []);

  // Update progress bar using status
  useEffect(() => {
    if (status && status.duration && status.duration > 0) {
      const percent = (status.currentTime / status.duration) * 100;
      setProgressPercent(percent);
      setElapsedTime(formatDuration(Math.floor(status.currentTime)));
    }
  }, [status]);

  // Auto play next song when current finishes
  useEffect(() => {
    if (status && status.didJustFinish) {
      playNext();
    }
  }, [status]);

  async function fetchSongs(query: string, genre: string) {
    setLoading(true);
    try {
      let url = `${JAMENDO_BASE_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=30&audioformat=mp32`;

      if (query) {
        url += `&search=${query}`;
      } else if (genre && genre !== 'all') {
        url += `&tags=${genre}&order=popularity_total`;
      } else {
        url += `&order=popularity_total`;
      }

      const response = await fetch(url);
      const data = await response.json();

      const formatted: Song[] = data.results.map((track: any) => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        duration: formatDuration(track.duration),
        durationSeconds: track.duration,
        url: track.audio,
      }));

      setSongs(formatted);
    } catch (error) {
      console.error('Failed to fetch songs:', error);
    }
    setLoading(false);
  }

  function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function handleSearch(text: string) {
    setSearchText(text);
    if (text.length === 0) {
      fetchSongs('', selectedGenre);
    } else if (text.length > 2) {
      fetchSongs(text, '');
    }
  }

  function handleGenre(genreId: string) {
    setSelectedGenre(genreId);
    setSearchText('');
    fetchSongs('', genreId);
  }

  function playSong(song: Song, index: number) {
    player.replace({ uri: song.url });
    player.play();
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
    setProgressPercent(0);
    setElapsedTime('0:00');
  }

  function togglePlayPause() {
    if (!currentSong) return;
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  }

  function playNext() {
    if (songs.length === 0) return;
    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }
    playSong(songs[nextIndex], nextIndex);
  }

  function playPrevious() {
    if (songs.length === 0) return;
    const prevIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    playSong(songs[prevIndex], prevIndex);
  }

  async function addToPlaylist(song: Song) {
    try {
      const stored = await AsyncStorage.getItem('playlists');
      const playlists = stored ? JSON.parse(stored) : [];
      if (playlists.length === 0) {
        Alert.alert('No playlists', 'Create a playlist first in the Playlists tab');
        return;
      }
      Alert.alert(
        'Add to Playlist',
        `Add "${song.title}" to:`,
        playlists.map((p: any) => ({
          text: p.name,
          onPress: async () => {
            const updated = playlists.map((pl: any) =>
              pl.id === p.id
                ? { ...pl, songs: [...pl.songs.filter((s: any) => s.id !== song.id), song] }
                : pl
            );
            await AsyncStorage.setItem('playlists', JSON.stringify(updated));
            Alert.alert('Added!', `"${song.title}" added to ${p.name}`);
          },
        }))
      );
    } catch (error) {
      console.error('Failed to add to playlist:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Music</Text>

      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search songs or artists..."
        placeholderTextColor="#7c7c8a"
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Genre pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreScroll}
        contentContainerStyle={styles.genreContainer}
      >
        {GENRES.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.genrePill,
              selectedGenre === genre.id && styles.genrePillActive,
            ]}
            onPress={() => handleGenre(genre.id)}
          >
            <Text style={[
              styles.genreText,
              selectedGenre === genre.id && styles.genreTextActive,
            ]}>
              {genre.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Song list */}
      {loading ? (
        <ActivityIndicator size="large" color="#534AB7" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.songCard,
                currentSong?.id === item.id && styles.activeSongCard,
              ]}
              onPress={() => playSong(item, index)}
              onLongPress={() => addToPlaylist(item)}
            >
              <View style={[
                styles.albumArt,
                currentSong?.id === item.id && styles.activeAlbumArt,
              ]}>
                <Text style={styles.albumArtText}>
                  {currentSong?.id === item.id && isPlaying ? '▶' : '♪'}
                </Text>
              </View>
              <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
              </View>
              <Text style={styles.duration}>{item.duration}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Player bar */}
      {currentSong && (
        <View style={styles.playerContainer}>

          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          {/* Time labels */}
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{elapsedTime}</Text>
            <Text style={styles.timeText}>{currentSong.duration}</Text>
          </View>

          {/* Song info + controls */}
          <View style={styles.playerRow}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerTitle} numberOfLines={1}>{currentSong.title}</Text>
              <Text style={styles.playerArtist} numberOfLines={1}>{currentSong.artist}</Text>
            </View>

            {/* Shuffle */}
            <TouchableOpacity
              style={[styles.controlButton, isShuffle && styles.controlButtonActive]}
              onPress={() => setIsShuffle(!isShuffle)}
            >
              <Text style={styles.controlButtonText}>⇄</Text>
            </TouchableOpacity>

            {/* Previous */}
            <TouchableOpacity style={styles.controlButton} onPress={playPrevious}>
              <Text style={styles.controlButtonText}>⏮</Text>
            </TouchableOpacity>

            {/* Play / Pause */}
            <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
              <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>

            {/* Next */}
            <TouchableOpacity style={styles.controlButton} onPress={playNext}>
              <Text style={styles.controlButtonText}>⏭</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}
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
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  genreScroll: {
    marginBottom: 16,
  },
  genreContainer: {
    gap: 8,
    paddingRight: 8,
  },
  genrePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  genrePillActive: {
    backgroundColor: '#534AB7',
    borderColor: '#534AB7',
  },
  genreText: {
    fontSize: 13,
    color: '#7c7c8a',
    fontWeight: '500',
  },
  genreTextActive: {
    color: '#ffffff',
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  activeSongCard: {
    backgroundColor: '#2a2a5e',
    borderWidth: 1,
    borderColor: '#534AB7',
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#534AB7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeAlbumArt: {
    backgroundColor: '#7F77DD',
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
  duration: {
    fontSize: 12,
    color: '#7c7c8a',
  },
  playerContainer: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#534AB7',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#2a2a4a',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#534AB7',
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 11,
    color: '#7c7c8a',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerInfo: {
    flex: 1,
  },
  playerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  playerArtist: {
    fontSize: 11,
    color: '#7c7c8a',
    marginTop: 2,
  },
  controlButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2a2a4a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#534AB7',
  },
  controlButtonText: {
    fontSize: 14,
    color: '#ffffff',
  },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#534AB7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});
