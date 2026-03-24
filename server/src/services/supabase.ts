import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const savePlaylist = async (userId: string, name: string, tracks: any[]) => {
  const { data, error } = await supabase
    .from('playlists')
    .insert([{ user_id: userId, name, tracks }])
    .select();

  if (error) throw error;
  return data;
};

export const getPlaylists = async (userId: string) => {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

export const toggleLikeSong = async (userId: string, track: any) => {
  const { data: existing } = await supabase
    .from('liked_songs')
    .select('*')
    .eq('user_id', userId)
    .eq('track_id', track.id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('liked_songs')
      .delete()
      .eq('user_id', userId)
      .eq('track_id', track.id);
    if (error) throw error;
    return { liked: false };
  } else {
    const { error } = await supabase
      .from('liked_songs')
      .insert([{ user_id: userId, track_id: track.id, track_metadata: track }]);
    if (error) throw error;
    return { liked: true };
  }
};
