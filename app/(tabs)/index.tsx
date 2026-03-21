import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const SONGS = [
  { id: '1', title: 'Summer Vibes', artist: 'Chill Artist', duration: '3:45' },
  { id: '2', title: 'Night Drive', artist: 'Lo-fi Band', duration: '4:12' },
  { id: '3', title: 'Morning Jazz', artist: 'Jazz Trio', duration: '5:01' },
  { id: '4', title: 'Ocean Waves', artist: 'Ambient Music', duration: '6:30' },
  { id: '5', title: 'City Lights', artist: 'Electronic', duration: '3:55' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Music</Text>
      <FlatList
        data={SONGS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.songCard}>
            <View style={styles.albumArt}>
              <Text style={styles.albumArtText}>♪</Text>
            </View>
            <View style={styles.songInfo}>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.artistName}>{item.artist}</Text>
            </View>
            <Text style={styles.duration}>{item.duration}</Text>
          </TouchableOpacity>
        )}
      />
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
    marginBottom: 24,
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
  duration: {
    fontSize: 12,
    color: '#7c7c8a',
  },
});
