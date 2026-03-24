import { useEffect, useState } from 'react';
import { setupPlayer } from '../services/TrackPlayerService';

export const useSetupPlayer = () => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await setupPlayer();
      if (unmounted) return;
      setIsPlayerReady(true);
    })();
    return () => {
      unmounted = true;
    };
  }, []);

  return isPlayerReady;
};
