import React from 'react';
import Navigator from './src/navigation/Navigator.tsx';
// import {SafeAreaView} from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components';
import theme from './src/styles/theme.ts';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <Navigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
