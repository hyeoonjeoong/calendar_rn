import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackParamList } from '../navigation/Navigator.tsx';
import { MyAppText } from '../styles/typography.ts';
import theme from '../styles/theme.ts';
import Icon from 'react-native-vector-icons/Ionicons';
import { screenHeight, windowHeight } from '../libs/fun.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DateDetailScreenRouteProp = RouteProp<StackParamList, 'DateDetail'>;

const DateDetailScreen = ({ route }: { route: DateDetailScreenRouteProp }) => {
  const { selectedDate } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'ScheduleEnroll'>>();
  console.log(route.params);
  // const screenHeight = Dimensions.get('screen').height;
  // console.log(screenHeight, 'screenHeight');

  return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.dateContainer}>
            <MyAppText size="large" space="-1">
              {selectedDate}
            </MyAppText>
          </View>
          {/* 일정 없을 경우 */}
          <View style={styles.noScheduleContainer}>
            <Icon name="calendar-outline" size={26} color={theme.color.main} />
            <MyAppText marginTop={2}>등록된 일정이 없어요</MyAppText>
            <TouchableOpacity
                style={[styles.button, { marginTop: 5 }]}
                onPress={() => navigation.navigate('ScheduleEnroll')}
            >
              <MyAppText style={styles.buttonText}>일정 등록하기</MyAppText>
            </TouchableOpacity>
          </View>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <View>
                <MyAppText>2025-05-05</MyAppText>
                <MyAppText>종일</MyAppText>
              </View>
              <MyAppText>누워있기</MyAppText>
            </View>
          </View>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.color.white,
    height: screenHeight,
  },
  noScheduleContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    width: '100%',
  },
  dateContainer: {
    padding: 20,
    display: 'flex',
    alignItems: 'flex-start',
    textAlign: 'left',
    width: '100%',
  },
  button: {
    backgroundColor: theme.color.main,
    padding: 5,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.color.white,
  },
  listContainer: {
    // backgroundColor: theme.color.sub,
    marginTop: 20,
    width: '80%',
  },
  listItem: {
    backgroundColor: theme.color.sub,
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DateDetailScreen;
