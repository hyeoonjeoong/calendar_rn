import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DateDetailScreen = ({ route }: { route: any }) => {
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
