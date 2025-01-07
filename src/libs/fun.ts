import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 디바이스 화면의 크기
export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;

// 현재 앱의 창에서 보여지는 부분의 크기
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const setItem = async (key: string, value: any) => {
  try {
    // console.log('gg');
    // console.log(JSON.stringify(value), 'setitem vale');
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

export const getItem = async (key: string) => {
  try {
    const res = await AsyncStorage.getItem(key);
    return res ? JSON.parse(res) : null;
  } catch (e) {
    console.log(e);
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
