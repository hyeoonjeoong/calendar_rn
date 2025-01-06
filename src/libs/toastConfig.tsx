import { View } from 'react-native';
import { MyAppText } from '../styles/typography.ts';
import React from 'react';
import { BaseToastProps } from 'react-native-toast-message';
import theme from '../styles/theme.ts';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const toastConfig = {
  success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <View
      style={{
        height: 40,
        width: '90%',
        backgroundColor: theme.color.success,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        marginTop: 30,
      }}
    >
      <MaterialIcon name="check-circle-outline" size={20} color={theme.color.white} />
      <MyAppText bold color={theme.color.white}>
        {props.text1}
      </MyAppText>
    </View>
    //   <BaseToast
    //     {...props}
    //     style={{ borderLeftColor: 'pink', backgroundColor: 'red', elevation: 99, zIndex: 99 }}
    //     contentContainerStyle={{ paddingHorizontal: 15 }}
    //     text1Style={{
    //       fontSize: 15,
    //       fontWeight: '400',
    //     }}
    //   />
  ),
  info: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <View
      style={{
        height: 40,
        width: '90%',
        backgroundColor: theme.color.info,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        marginTop: 30,
      }}
    >
      <MaterialIcon name="error-outline" size={20} color={theme.color.white} />
      <MyAppText bold color={theme.color.white}>
        {props.text1}
      </MyAppText>
    </View>
  ),
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <View
      style={{
        height: 40,
        width: '90%',
        backgroundColor: theme.color.warning,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        marginTop: 30,
      }}
    >
      <MaterialIcon name="warning-amber" size={20} color={theme.color.white} />
      <MyAppText color="white">{props.text1}</MyAppText>
    </View>
    // <ErrorToast
    //   {...props}
    //   text1Style={{
    //     fontSize: 17,
    //   }}
    //   text2Style={{
    //     fontSize: 15,
    //   }}
    // />
  ),
  // tomatoToast: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
  //   <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
  //     <MyAppText>{props.text1}</MyAppText>
  //   </View>
  // ),
};
