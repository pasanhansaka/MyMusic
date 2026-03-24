import axios from 'axios';

// A simple mock for lyrics retrieval. In a real app, you'd use Genius or Musixmatch API.
export const fetchLyrics = async (title: string, artist: string) => {
  try {
    // Attempting a public lyrics API or mock
    const response = await axios.get<{ lyrics: string }>(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    return response.data.lyrics;
  } catch (error) {
    console.warn('Lyrics fetch failed:', error);
    return "[Instrumental or Lyrics Not Found]";
  }
};

export const getFormattedLyrics = (lyrics: string) => {
  if (!lyrics) return [];
  return lyrics.split('\n').filter(line => line.trim() !== '');
};
