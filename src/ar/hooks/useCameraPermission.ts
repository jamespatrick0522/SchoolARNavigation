import {useCallback, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';

export const useCameraPermission = () => {
  const [granted, setGranted] = useState(false);

  const requestPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setGranted(false);
      return false;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    const allowed = status === PermissionsAndroid.RESULTS.GRANTED;
    setGranted(allowed);
    return allowed;
  }, []);

  return {granted, requestPermission};
};
