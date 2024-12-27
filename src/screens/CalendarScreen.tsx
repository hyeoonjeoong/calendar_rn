import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../navigation/Navigator.tsx';

// export type StackParamList = {
//   // 이동할 화면의 이름을 선언: {화면에 넘길 변수의 타입 선언, 없다면 undefined}
//   DateDetail: { selectedDate: string };
// };

type CalendarScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'DateDetail'>;

const CalendarScreen = () => {
  // const navigation = useNavigation();
  const navigation = useNavigation<CalendarScreenNavigationProp>();

  // 일요일 0, 월요일 1, 화요일 2, 수요일 3, 목요일 4, 금요일 5, 토요일 6
  const DayHeader = ['일', '월', '화', '수', '목', '금', '토'];
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  const day = currentDate.getDay();

  // console.log(year, 'year');
  // console.log(month, 'month');
  // console.log(date, 'date');
  // console.log(day, 'day 요일');

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

  // 오늘 날짜 가져와서 시작일 찾기 > 요일
  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay;
  };

  // 오늘 날짜 가져와서 마지막일 찾기 > 날짜
  const getLastDateOfMonth = (year: number, month: number) => {
    const lastDate = new Date(year, month + 1, 0).getDate();
    return lastDate;
  };

  const getLastDayOfMonth = (year: number, month: number) => {
    const lastDay = new Date(year, month + 1, 0).getDay(); // 마지막 날짜의 요일
    return lastDay; // 0: 일요일, 1: 월요일, 2: 화요일, ...
  };

  const getCalendarDays = () => {
    // 월이 바뀌면 아래 함수가 실행되어서 계산되어야 함
    const firstDay = getFirstDayOfMonth(year, month);
    const lastDate = getLastDateOfMonth(year, month);
    const lastDay = getLastDayOfMonth(year, month);

    // let daysArray: number[] = [];
    let daysArray: {
      day: number;
      isCurrentMonth: boolean;
      isPrevMonth: boolean;
      isNextMonth: boolean;
    }[] = [];

    if (firstDay !== 0) {
      const prevLastDay = new Date(year, month - 2, 0).getDate();
      const lastDays = prevLastDay - firstDay + 1;
      for (let day = lastDays; day < prevLastDay + 1; day++) {
        // daysArray.push(day);
        daysArray.push({
          day,
          isCurrentMonth: false,
          isPrevMonth: true,
          isNextMonth: false,
        });
      }
    }

    for (let day = 1; day < lastDate + 1; day++) {
      // daysArray.push(day);
      daysArray.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
      });
    }

    if (lastDay !== 6) {
      const nextDays = 6 - lastDay;
      for (let day = 1; day < nextDays + 1; day++) {
        // daysArray.push(day);
        daysArray.push({
          day,
          isCurrentMonth: false,
          isPrevMonth: false,
          isNextMonth: true,
        });
      }
    }

    // console.log(daysArray.length % 7);

    return daysArray;
    // 앞에 이전 날짜를 넣어야 위치가 맞겠다

    // 주 단위로 끊겨야 하는데 어떻게 끊어야하지
    // 숫자만 넣은거라 저번달꺼인지 몰라. 그럼 날짜를 제대로 못쓰고 있다는건데
    // 여기서 지난달 배열, 다음달 배열 나누고? 불리언으로?
  };

  const createCalendar = getCalendarDays();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleMonth('prev')}>
            {/*<Text> &lt; </Text>*/}
            <Text>◀️ </Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {/*{year} {month + 1}*/}
            {year} {String(month + 1).padStart(2, '0')}
          </Text>
          <TouchableOpacity onPress={() => handleMonth('next')}>
            {/*<Text> &gt; </Text>*/}
            <Text> ▶️️️</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => handleMonth('now')}>
            <Text>Today</Text>
          </TouchableOpacity>
          {/*<Icon name="memo" />*/}
          {/*<Icon name="add-task" size={30} color="red" />*/}

          {/*<FontAwesome5IconButton name="memo" />*/}
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.row}>
          {DayHeader.map((day, index) => (
            <View style={styles.cell} key={index}>
              <Text style={{ fontWeight: '600' }}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.row}>
          {createCalendar.map((day, index) => {
            const isToday =
              currentDate.getFullYear() === new Date().getFullYear() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getDate() === day.day;
            // console.log(index);
            return (
              <TouchableOpacity
                onPress={() => {
                  const selectedDate = `${year} ${String(month + 1).padStart(2, '0')} ${String(
                    day.day,
                  ).padStart(2, '0')}`;
                  navigation.navigate('DateDetail', { selectedDate });
                }}
                style={[
                  styles.cell,
                  day.isCurrentMonth && isToday && { backgroundColor: 'darkgray' },
                ]}
              >
                <View key={index}>
                  <Text
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
                  </Text>
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
