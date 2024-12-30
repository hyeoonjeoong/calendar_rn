import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../navigation/Navigator.tsx';
import { getCalendarDays } from '../libs/date.ts';
// import Icon from 'react-native-vector-icons/AntDesign.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { MyAppText } from '../styles/typography.ts';
import theme from '../styles/theme.ts';

type CalendarScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'DateDetail'>;

const CalendarScreen = () => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();

  // 일요일 0, 월요일 1, 화요일 2, 수요일 3, 목요일 4, 금요일 5, 토요일 6
  const DayHeader = ['일', '월', '화', '수', '목', '금', '토'];
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  const day = currentDate.getDay();

  const handleMonth = (type: 'prev' | 'next' | 'now') => {
    if (type === 'prev') {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      setCurrentDate(prevMonth);
    } else if (type === 'next') {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      setCurrentDate(nextMonth);
    } else {
      const nowMoth = new Date();
      setCurrentDate(nowMoth);
    }
  };

  const createCalendar = getCalendarDays(year, month);
  // const myIcon2 = <Icon name="comments" size={30} color="#900" iconStyle="solid" />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleMonth('prev')}>
            <Icon name="chevron-back-sharp" size={16} color="#4C585B" />
          </TouchableOpacity>
          <MyAppText size="large" bold>
            {/*{year} {month + 1}*/}
            {year} {String(month + 1).padStart(2, '0')}
          </MyAppText>
          <TouchableOpacity onPress={() => handleMonth('next')}>
            <Icon name="chevron-forward-sharp" size={16} color="#4C585B" />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => handleMonth('now')}>
            {/*<View>*/}
            <Icon name="today" size={25} color={theme.color.main} />
            {/*</View>*/}
            {/*<Text>Today</Text>*/}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.row}>
          {DayHeader.map((day, index) => (
            <View style={styles.cell} key={index}>
              <MyAppText bold>{day}</MyAppText>
            </View>
          ))}
        </View>

        <View style={styles.row}>
          {createCalendar?.map((day, index) => {
            const isToday =
              currentDate.getFullYear() === new Date().getFullYear() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getDate() === day.day;
            // console.log(index);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  const selectedDate = `${year} ${String(month + 1).padStart(2, '0')} ${String(
                    day.day,
                  ).padStart(2, '0')}`;
                  navigation.navigate('DateDetail', { selectedDate });
                }}
                style={[
                  styles.cell,
                  isToday && day.isCurrentMonth && { backgroundColor: 'darkgray' },
                ]}
              >
                <View>
                  <MyAppText
                    style={[
                      {
                        color: day.isCurrentMonth
                          ? isToday
                            ? 'white'
                            : 'black'
                          : day.isPrevMonth || day.isNextMonth
                          ? 'darkgray'
                          : 'black',
                      },
                    ]}
                  >
                    {day.day}
                  </MyAppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  table: {
    paddingTop: 20,
    // borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 350,
    flexWrap: 'wrap',
  },
  cell: {
    backgroundColor: 'white',
    width: '14%',
    textAlign: 'center',
    alignItems: 'center',
    height: 70,
  },
  text: {},
  today: {
    backgroundColor: 'skyblue',
    width: '14%',
    textAlign: 'center',
    alignItems: 'center',
    height: 70,
  },
});

export default CalendarScreen;
