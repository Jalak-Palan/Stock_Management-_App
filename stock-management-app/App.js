import React, { useContext } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AppContext, AppContextProvider } from './src/context/AppContext';
import { CustomLightTheme, CustomDarkTheme } from './src/theme/theme';
import AppNavigator from './src/navigation/AppNavigator';

LogBox.ignoreLogs([
  '[Reanimated] Reduced motion setting is enabled on this device',
  'SafeAreaView has been deprecated',
]);

function MainApp() {
  const { isDarkMode } = useContext(AppContext);
  const activeTheme = isDarkMode ? CustomDarkTheme : CustomLightTheme;

  return (
    <PaperProvider theme={activeTheme}>
      <NavigationContainer>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContextProvider>
          <MainApp />
        </AppContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
