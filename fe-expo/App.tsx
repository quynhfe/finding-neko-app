import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppRoot} from './src/application/AppRoot';
import './src/global.css';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <AppRoot />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
