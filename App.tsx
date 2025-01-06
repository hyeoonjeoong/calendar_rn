import React from 'react';
import Navigator from './src/navigation/Navigator.tsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components';
import theme from './src/styles/theme.ts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { toastConfig } from './src/libs/toastConfig.tsx';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <GestureHandlerRootView>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <Navigator />
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
