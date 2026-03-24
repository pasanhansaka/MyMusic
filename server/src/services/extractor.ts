import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export const getStreamUrl = async (videoId: string): Promise<string> => {
  try {
    // Using yt-dlp to get the best audio URL
    const { stdout } = await execPromise(`yt-dlp -f "bestaudio" -g https://www.youtube.com/watch?v=${videoId}`);
    return stdout.trim();
  } catch (error: any) {
    console.error('Error extracting stream URL:', error.message);
    throw new Error('Failed to extract audio stream');
  }
};

export const getTrackInfo = async (videoId: string) => {
  try {
    const { stdout } = await execPromise(`yt-dlp --print "%(title)s|%(uploader)s|%(duration)s|%(thumbnail)s" https://www.youtube.com/watch?v=${videoId}`);
    const [title, artist, duration, thumbnail] = stdout.trim().split('|');
    return { title, artist, duration, thumbnail };
  } catch (error: any) {
    console.error('Error getting track info:', error.message);
    throw new Error('Failed to get track info');
  }
};
