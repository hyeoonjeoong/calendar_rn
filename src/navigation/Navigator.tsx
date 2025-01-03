import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '../screens/CalendarScreen.tsx';
import MemoScreen from '../screens/MemoScreen.tsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import BasicScreen from '../screens/BasicScreen.tsx';
import ScheduleModal from '../components/ScheduleModal.tsx';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../styles/theme.ts';
import ScheduleEnrollScreen from '../screens/ScheduleEnrollScreen.tsx';

export type StackParamList = {
    // 이동할 화면의 이름을 선언: {화면에 넘길 변수의 타입 선언, 없다면 undefined}
    CalendarMain: undefined;
    DateDetail: { selectedDate: string };
    ScheduleEnroll: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator();

const CalendarStack = () => {
    const navigation = useNavigation();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CalendarMain"
                component={CalendarScreen}
                options={{ headerShown: false }}
            />
            {/*<Stack.Screen*/}
            {/*    name="DateDetail"*/}
            {/*    component={ScheduleModal}*/}
            {/*    options={{*/}
            {/*        headerTitle: '',*/}
            {/*        headerLeft: () => (*/}
            {/*            <Icon*/}
            {/*                name="chevron-back"*/}
            {/*                size={24}*/}
            {/*                color={theme.color.main}*/}
            {/*                onPress={() => navigation.goBack()}*/}
            {/*            />*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
            <Stack.Screen
                name="ScheduleEnroll"
                component={ScheduleEnrollScreen}
                options={{
                    headerTitle: 'ScheduleEnroll',
                    headerLeft: () => (
                        <Icon
                            name="chevron-back"
                            size={24}
                            color={theme.color.main}
                            onPress={() => navigation.goBack()}
                        />
                    ),
                }}
            />
        </Stack.Navigator>
    );
};

const Navigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Calendar"
                screenOptions={{
                    tabBarActiveTintColor: theme.fontColor.basic,
                    tabBarStyle: { height: 60, paddingRight: 30, paddingLeft: 30 },
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
                                name={focused ? 'calendar-clear' : 'calendar-clear-outline'}
                                size={24}
                                color={focused ? theme.color.main : theme.color.sub}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Memo"
                    component={MemoScreen}
                    options={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <Icon
                                name={focused ? 'create' : 'create-outline'}
                                size={28}
                                color={focused ? theme.color.main : theme.color.sub}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="App"
                    component={BasicScreen}
                    options={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <Icon
                                name={focused ? 'clipboard' : 'clipboard-outline'}
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
