import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '../screens/CalendarScreen.tsx';
import MemoScreen from '../screens/MemoScreen.tsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import BasicScreen from '../screens/BasicScreen.tsx';
import DateDetailScreen from '../screens/DateDetailScreen.tsx';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../styles/theme.ts';

export type StackParamList = {
  // 이동할 화면의 이름을 선언: {화면에 넘길 변수의 타입 선언, 없다면 undefined}
  CalendarMain: undefined;
  DateDetail: { selectedDate: string };
};

const Stack = createNativeStackNavigator<StackParamList>();
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
      <Tab.Navigator
        initialRouteName="Calendar"
        screenOptions={{
          tabBarActiveTintColor: theme.color.text,
        }}
      >
        <Tab.Screen
          name="Calendar"
          component={CalendarStack}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Icon
                name="calendar-clear"
                size={24}
                // color={focused ? `${globalStyles.color_main}` : '#4C585B'}
                color={focused ? theme.color.main : theme.color.sub}
              />
            ),
          }}
        />
        {/*<Tab.Screen name="Memo" component={MemoScreen} options={{ headerShown: false }} />*/}
        <Tab.Screen
          name="App"
          component={BasicScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <Icon
                name="document-text-outline"
                size={24}
                color={focused ? theme.color.main : theme.color.sub}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
