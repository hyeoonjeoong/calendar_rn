import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '../screens/CalendarScreen.tsx';
import MemoScreen from '../screens/MemoScreen.tsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import BasicScreen from '../screens/BasicScreen.tsx';
import DateDetailScreen from '../screens/DateDetailScreen.tsx';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CalendarStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CalendarMain"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="DateDetail" component={DateDetailScreen} />
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      {/*<Stack.Navigator>*/}
      {/*  <Stack.Screen name='HomeScreendd' component={HomeScreen} options={{title:'hey'}}></Stack.Screen>*/}
      {/*</Stack.Navigator>*/}
      <Tab.Navigator
        initialRouteName="Calendar"
        screenOptions={{
          tabBarActiveTintColor: 'cornflowerblue',
        }}
      >
        {/*<Tab.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false }} />*/}
        <Tab.Screen name="Calendar" component={CalendarStack} options={{ headerShown: false }} />
        <Tab.Screen name="Memo" component={MemoScreen} options={{ headerShown: false }} />
        <Tab.Screen name="App" component={BasicScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
