import { Paths, Directory, File } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DOWNLOAD_DIR = new Directory(Paths.document, 'music');

export interface OfflineTrack {
  videoId: string;
  localUri: string;
  metadata: {
    title: string;
    artist: string;
    artwork: string;
  };
}

export const ensureDirExists = async () => {
  if (!DOWNLOAD_DIR.exists) {
    DOWNLOAD_DIR.create({ intermediates: true, idempotent: true });
  }
};

export const downloadTrack = async (videoId: string, streamUrl: string, metadata: OfflineTrack['metadata']) => {
  await ensureDirExists();
  const targetFile = new File(DOWNLOAD_DIR, `${videoId}.mp3`);
  
  try {
    const downloadedFile = await File.downloadFileAsync(streamUrl, targetFile, { idempotent: true });
    
    if (downloadedFile) {
      const offlineData: OfflineTrack = {
        videoId,
        localUri: downloadedFile.uri,
        metadata,
      };
      await AsyncStorage.setItem(`offline_${videoId}`, JSON.stringify(offlineData));
      return downloadedFile.uri;
    }
  } catch (e) {
    console.error('Download error:', e);
    throw e;
  }
};

export const getOfflineTrack = async (videoId: string): Promise<OfflineTrack | null> => {
  const data = await AsyncStorage.getItem(`offline_${videoId}`);
  return data ? JSON.parse(data) : null;
};

export const deleteOfflineTrack = async (videoId: string) => {
  const data = await getOfflineTrack(videoId);
  if (data?.localUri) {
    const file = new File(data.localUri);
    if (file.exists) {
      file.delete();
    }
    await AsyncStorage.removeItem(`offline_${videoId}`);
  }
};

export const getAllOfflineTracks = async (): Promise<OfflineTrack[]> => {
  const keys = await AsyncStorage.getAllKeys();
  const offlineKeys = keys.filter(key => key.startsWith('offline_'));
  const tracks = await Promise.all(
    offlineKeys.map(async key => {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    })
  );
  return tracks.filter((t): t is OfflineTrack => t !== null);
};


