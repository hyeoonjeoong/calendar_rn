import React from 'react';
import Navigator from './src/navigation/Navigator.tsx';
// import {SafeAreaView} from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <Navigator />
    </SafeAreaProvider>
  );
};

export default App;
