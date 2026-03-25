import { useEffect, useState } from 'react';
import { setupAudio } from '../services/AudioService';

export const useSetupPlayer = () => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await setupAudio();
      if (unmounted) return;
      setIsPlayerReady(true);
    })();
    return () => {
      unmounted = true;
    };
  }, []);

  return isPlayerReady;
};
