import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { getCalendarDays } from '../libs/date.ts';
import Icon from 'react-native-vector-icons/Ionicons';
import { MyAppText } from '../styles/typography.ts';
import theme from '../styles/theme.ts';
import { GestureEvent, PanGestureHandler } from 'react-native-gesture-handler';
import ScheduleModal from '../components/ScheduleModal.tsx';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem, setItem } from '../libs/fun.ts';
import { TSchedule } from '../type/schedule.ts';

// type CalendarScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'DateDetail'>;

const CalendarScreen = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectDate, setSelectDate] = useState<string>();
  // const navigation = useNavigation<CalendarScreenNavigationProp>();
  const [scheduleList, setScheduleList] = useState<TSchedule[]>();

  // 일요일 0, 월요일 1, 화요일 2, 수요일 3, 목요일 4, 금요일 5, 토요일 6
  const DayHeader = ['일', '월', '화', '수', '목', '금', '토'];
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  // const date = currentDate.getDate();
  // const day = currentDate.getDay();

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

  const panGesture = (e: GestureEvent) => {
    const { translationX } = e.nativeEvent;
    // console.log(typeof translationX);
    if ((translationX as number) > 50) {
      handleMonth('prev');
    } else if ((translationX as number) > -50) {
      handleMonth('next');
    }
  };

  const fetchData = async () => {
    const data = await getItem('schedule');
    setScheduleList(data);
  };

  const deleteSchedule = async (startDate: string, scheduleId: string) => {
    const data = await getItem('schedule');
    const updatedSchedule = data[startDate].filter(el => el.id !== scheduleId);

    try {
      if (updatedSchedule.length === 0) {
        delete data[startDate];
      } else {
        data[startDate] = updatedSchedule;
      }
      setItem('schedule', data);
    } catch (e) {
      console.log(e);
    }
    fetchData();
  };

  const createCalendar = getCalendarDays(year, month);

  useEffect(() => {
    // 여기가 안되네. 바로바로 안불러와짐
    console.log('main render');
    fetchData();
  }, []);

  useEffect(() => {
    console.log(
      scheduleList && Array.isArray(scheduleList['2025-01-07'])
        ? scheduleList['2025-01-07'].map(el => el.content)
        : 'no',
      'scheduleList',
    );
  }, [scheduleList]);

  return (
    <SafeAreaView style={styles.container}>
      <ScheduleModal
        isViewModalOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          fetchData();
        }}
        selectDate={selectDate}
        scheduleData={scheduleList ?? []}
        deleteAction={(date: string, id: string) => deleteSchedule(date, id)}
      />
      <PanGestureHandler onGestureEvent={panGesture}>
        <View>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              {/*<TouchableOpacity onPress={() => handleMonth('prev')}>*/}
              {/*  <Icon name="chevron-back-sharp" size={16} color="#4C585B" />*/}
              {/*</TouchableOpacity>*/}
              <MyAppText size="extraLarge" bold space="-1px">
                {year} {String(month + 1).padStart(2, '0')}
              </MyAppText>
              {/*<TouchableOpacity onPress={() => handleMonth('next')}>*/}
              {/*  <Icon name="chevron-forward-sharp" size={16} color="#4C585B" />*/}
              {/*</TouchableOpacity>*/}
            </View>
            <TouchableOpacity onPress={() => AsyncStorage.clear()}>
              <MyAppText>AsyncStorage clean</MyAppText>
            </TouchableOpacity>
            <View>
              <TouchableOpacity onPress={() => handleMonth('now')}>
                <Icon name="today" size={25} color={theme.color.main} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.row}>
              {DayHeader.map((day, index) => (
                <View style={styles.headerCell} key={index}>
                  <MyAppText bold color={theme.color.main}>
                    {day}
                  </MyAppText>
                </View>
              ))}
            </View>

            <View style={styles.row}>
              {createCalendar?.map((day, index) => {
                const isToday =
                  currentDate.getFullYear() === new Date().getFullYear() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getDate() === day.day;

                const formattedDate = format(new Date(year, month, day.day), 'yyyy-MM-dd');

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      const date = `${String(month + 1).padStart(2, '0')}월 ${String(
                        day.day,
                      ).padStart(2, '0')}일`;
                      // const formattedDate = format(new Date(year, month, day.day), 'yyyy-MM-dd');
                      setSelectDate(formattedDate);
                      setIsViewModalOpen(true);
                      fetchData();
                    }}
                    style={[styles.cell, isToday && day.isCurrentMonth && styles.today]}
                  >
                    <View>
                      <MyAppText
                        style={[
                          {
                            // marginTop: 4,
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
                    <View style={styles.scheduleItemContainer}>
                      {scheduleList && Array.isArray(scheduleList[formattedDate])
                        ? scheduleList[formattedDate]
                            .slice(0, 2)
                            .map((item: TSchedule, i: string) => (
                              <View key={i} style={styles.scheduleItem}>
                                <MyAppText>{item.title}</MyAppText>
                              </View>
                            ))
                        : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </PanGestureHandler>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: theme.color.white,
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
  headerCell: {
    backgroundColor: theme.color.white,
    width: '14%',
    textAlign: 'center',
    alignItems: 'center',
    height: 40,
  },
  table: {
    paddingTop: 20,
    alignItems: 'center',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 350,
    flexWrap: 'wrap',
  },
  cell: {
    backgroundColor: theme.color.white,
    width: '14%',
    textAlign: 'center',
    alignItems: 'center',
    height: 80,

    // padding: 2,
    // borderWidth: 0.3,
    // borderColor: `${theme.color.sub}40`,
  },
  scheduleItemContainer: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  scheduleItem: {
    // borderWidth: 1,
    // borderColor: `${theme.color.sub}70`,
    width: 46,
    padding: 1,
    borderRadius: 3,
    alignItems: 'center',
    backgroundColor: `${theme.color.sub}20`,
  },
  today: {
    backgroundColor: theme.color.main,
    width: '14%',
    borderRadius: 3,
    textAlign: 'center',
    alignItems: 'center',
    height: 21,
  },
});

export default CalendarScreen;
