import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Update with your server IP for physical devices

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

