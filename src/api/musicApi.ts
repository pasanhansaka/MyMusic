import axios from 'axios';

import Constants from 'expo-constants';

// Automatically detect the development server IP
const debuggerHost = Constants.expoConfig?.hostUri;
const ip = debuggerHost ? debuggerHost.split(':')[0] : '192.168.1.100';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

console.log('API Base URL:', API_BASE_URL);

export interface YouTubeItem {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  description?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const searchMusic = async (query: string): Promise<YouTubeItem[]> => {
  const response = await api.get('/music/search', { params: { q: query } });
  return response.data;
};

export const getStreamUrl = async (videoId: string): Promise<string> => {
  const response = await api.get(`/music/stream/${videoId}`);
  return response.data.streamUrl;
};

export const importPlaylist = async (url: string): Promise<YouTubeItem[]> => {
  const response = await api.get('/music/playlist/import', { params: { url } });
  return response.data;
};

export default api;

