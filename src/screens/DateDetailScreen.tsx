import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from '../navigation/Navigator.tsx';

type DateDetailScreenRouteProp = RouteProp<StackParamList, 'DateDetail'>;

const DateDetailScreen = ({ route }: { route: DateDetailScreenRouteProp }) => {
  const { selectedDate } = route.params;
  console.log(route.params);

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{selectedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DateDetailScreen;
