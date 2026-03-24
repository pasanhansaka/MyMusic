import { Router } from 'express';
import { searchMusic, getPlaylistTracks } from '../services/youtube';
import { getStreamUrl, getTrackInfo } from '../services/extractor';
import { savePlaylist, getPlaylists } from '../services/supabase';

const router = Router();

// Search music
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

  try {
    const results = await searchMusic(q as string);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get streaming URL for a video
router.get('/stream/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const streamUrl = await getStreamUrl(id);
    res.json({ streamUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Import YouTube playlist
router.get('/playlist/import', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Playlist URL is required' });

  try {
    const playlistId = (url as string).split('list=')[1]?.split('&')[0];
    if (!playlistId) throw new Error('Invalid YouTube playlist URL');

    const tracks = await getPlaylistTracks(playlistId);
    res.json(tracks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get track info
router.get('/info/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const info = await getTrackInfo(id);
    res.json(info);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Playlist
router.post('/playlist', async (req, res) => {
  const { userId, name, tracks } = req.body;
  try {
    const data = await savePlaylist(userId, name, tracks);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Playlists
router.get('/playlists/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const data = await getPlaylists(userId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
