import { Dimensions } from 'react-native';

// 디바이스 화면의 크기
export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;

// 현재 앱의 창에서 보여지는 부분의 크기
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
