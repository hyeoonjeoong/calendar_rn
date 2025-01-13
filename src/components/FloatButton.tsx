import { View, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../styles/theme.ts';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackParamList } from '../navigation/Navigator.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type FloatButtonProps = {
  selectedDate: string | undefined;
};

type FloatButtonNavigationProps = NativeStackNavigationProp<StackParamList, 'ScheduleEnroll'>;

const FloatButton: React.FC<FloatButtonProps> = ({ selectedDate }) => {
  const navigation = useNavigation<FloatButtonNavigationProps>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ScheduleEnroll', { selectedDate: selectedDate as string });
        }}
      >
        <Icon name="add-circle" size={38} color={theme.color.sub} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 38,
    height: 38,
    right: 0,
    bottom: 70,
    margin: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
  },
});
export default FloatButton;
