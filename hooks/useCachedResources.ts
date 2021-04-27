import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome5.font,
          ...FontAwesome.font,
          // 'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
          // ignore harmless error
      } finally {
        setLoadingComplete(true);
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          // ignore harmless error
        }
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
