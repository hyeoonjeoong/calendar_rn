import React from 'react';
import Navigator from './src/navigation/Navigator.tsx';
// import {SafeAreaView} from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components';
import theme from './src/styles/theme.ts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
    return (
        <GestureHandlerRootView>
            <ThemeProvider theme={theme}>
                <SafeAreaProvider>
                    <Navigator />
                </SafeAreaProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
};

export default App;
