import { create } from 'zustand';
export interface Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  duration?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  sleepTimer: number | null; // in minutes
  
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (queue: Track[]) => void;
  addToQueue: (track: Track) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setSleepTimer: (minutes: number | null) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  sleepTimer: null,

  setCurrentTrack: (track: Track | null) => set({ currentTrack: track }),
  setQueue: (queue: Track[]) => set({ queue }),
  addToQueue: (track: Track) => set((state: PlayerState) => ({ queue: [...state.queue, track] })),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setProgress: (progress: number) => set({ progress }),
  setDuration: (duration: number) => set({ duration }),
  setSleepTimer: (minutes: number | null) => {
    set({ sleepTimer: minutes });
    if (minutes) {
      setTimeout(() => {
        set({ isPlaying: false, sleepTimer: null });
      }, minutes * 60000);
    }
  },
  
  nextTrack: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t: Track) => t.id === currentTrack.id);
    if (currentIndex < queue.length - 1) {
      set({ currentTrack: queue[currentIndex + 1] });
    }
  },
  
  previousTrack: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t: Track) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      set({ currentTrack: queue[currentIndex - 1] });
    }
  },
}));

