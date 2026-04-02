import {useEffect, useState} from 'react';
import {isARSupportedOnDevice} from '@reactvision/react-viro';

export const useARSupport = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    let mounted = true;
    isARSupportedOnDevice()
      .then(result => {
        if (mounted) {
          setIsSupported(result.isARSupported);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsSupported(false);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsChecking(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return {isChecking, isSupported};
};
