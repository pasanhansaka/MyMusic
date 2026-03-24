import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const searchMusic = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        videoCategoryId: '10', // Music category
        maxResults: 20,
        key: API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      description: item.snippet.description,
    }));
  } catch (error: any) {
    console.error('Error searching YouTube:', error.response?.data || error.message);
    throw new Error('Failed to fetch music from YouTube');
  }
};

export const getPlaylistTracks = async (playlistId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50,
        key: API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      artist: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
    }));
  } catch (error: any) {
    console.error('Error fetching playlist tracks:', error.response?.data || error.message);
    throw new Error('Failed to fetch playlist tracks');
  }
};
