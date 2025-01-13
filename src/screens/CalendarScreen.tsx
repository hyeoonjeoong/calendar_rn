import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getCalendarDays } from '../libs/date.ts';
import Icon from 'react-native-vector-icons/Ionicons';
import { MyAppText } from '../styles/typography.ts';
import theme from '../styles/theme.ts';
import ScheduleModal from '../components/ScheduleModal.tsx';
import { addDays, differenceInDays, differenceInMinutes, format } from 'date-fns';
import { getItem, setItem } from '../libs/fun.ts';
import { TSchedule, TScheduleList } from '../type/schedule.ts';
import FloatButton from '../components/FloatButton.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarScreen = props => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectDate, setSelectDate] = useState<string>();
  const [scheduleList, setScheduleList] = useState<TScheduleList>();
  const [initScheduleData, setInitScheduleData] = useState<TScheduleList>({});
  const [scheduleResultData, setScheduleResultData] = useState<TSchedule[]>();

  // 일요일 0, 월요일 1, 화요일 2, 수요일 3, 목요일 4, 금요일 5, 토요일 6
  const DayHeader = ['일', '월', '화', '수', '목', '금', '토'];
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
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

  // useEffect(() => {
  //   if (String(month + 1).padStart(2, '0') === format(new Date(), 'MM')) {
  //     console.log('jjjjjj');
  //     const nowMoth = new Date();
  //
  //     setCurrentDate(nowMoth);
  //     return;
  //   }
  // }, []);

  const fetchData = async () => {
    const data = await getItem('schedule');
    // setScheduleList(data);
    setInitScheduleData(data);
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
    const unsubscribe = props.navigation.addListener('transitionEnd', e => {
      fetchData();
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (initScheduleData === null) {
      return;
    }
    const data = Object.values(initScheduleData)?.reduce((acc, cur) => {
      if (!Array.isArray(cur)) {
        return acc;
      }
      return [...acc, ...cur];
    }, []);

    let allSchedules: TSchedule[] = [];

    data.forEach(item => {
      if (item.startDate === item.endDate) {
        allSchedules.push(item);
      } else {
        const diff = differenceInDays(item.endDate, item.startDate);
        for (let i = 0; i <= diff; i++) {
          allSchedules.push({
            ...item,
            startTime: i === 0 ? item.startTime : '00:00',
            endTime: i === diff ? item.endTime : '23:59',
            startDate: format(addDays(item.startDate, i), 'yyyy-MM-dd'),
            isMultipleSchedule: true,
            scheduleStartDate: item.startDate,
            title: i === 0 ? item.title : '',
            id: item.id,
          });
        }
      }
    });

    allSchedules.sort((lv, rv) => {
      // 시작일,시간 기준으로 정렬
      return differenceInMinutes(
        `${lv.startDate} ${lv.startTime}`,
        `${rv.startDate} ${rv.startTime}`,
      );
    });

    const result = {};
    allSchedules.forEach(item => {
      if (result[item.startDate]) {
        result[item.startDate].push({ ...item, order: result[item.startDate].length });
      } else {
        result[item.startDate] = [{ ...item, order: 0 }];
      }
    });

    setScheduleList(result);
    setScheduleResultData(allSchedules);
  }, [initScheduleData]);

  return (
    <SafeAreaView style={styles.container}>
      <ScheduleModal
        isViewModalOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectDate(undefined);
        }}
        selectDate={selectDate}
        scheduleData={scheduleList ?? {}}
        deleteAction={(date: string, id: string) => deleteSchedule(date, id)}
      />
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => handleMonth('prev')}>
              <Icon
                name="chevron-back-sharp"
                size={14}
                color="#4C585B"
                style={{ marginRight: 4, padding: 6 }}
              />
            </TouchableOpacity>
            <MyAppText size="extraLarge" bold space="-1px">
              {year} {String(month + 1).padStart(2, '0')}
            </MyAppText>
            <TouchableOpacity onPress={() => handleMonth('next')}>
              <Icon
                name="chevron-forward-sharp"
                size={14}
                color="#4C585B"
                style={{ marginLeft: 4, padding: 6 }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => AsyncStorage.clear()}>
            <MyAppText>Storage Clean</MyAppText>
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

              const formattedMonth = day.isPrevMonth
                ? month - 1
                : day.isNextMonth
                ? month + 1
                : month;
              const formattedDate = format(new Date(year, formattedMonth, day.day), 'yyyy-MM-dd');

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectDate(formattedDate);
                    setIsViewModalOpen(true);
                  }}
                  style={[
                    styles.cell,
                    isToday && day.isCurrentMonth && styles.today,
                    selectDate === formattedDate && styles.selectDay,
                  ]}
                >
                  <View>
                    <MyAppText
                      style={[
                        isToday && styles.todayText,
                        (day.isPrevMonth || day.isNextMonth) && styles.disabledText,
                        selectDate === formattedDate && styles.selectText,
                      ]}
                    >
                      {day.day}
                    </MyAppText>
                  </View>

                  <View style={styles.scheduleItemContainer}>
                    {scheduleResultData
                      ?.filter(info => info.startDate === formattedDate)
                      .slice(0, 2)
                      .map((item, index) => {
                        const scheduleStartDate = item.scheduleStartDate as string;
                        const startDate = item.startDate as string;

                        const orderNum = scheduleList?.[scheduleStartDate]?.find(
                          el => el.id === item.id,
                        )?.order;
                        const scheduleLength = scheduleList?.[startDate]?.length;

                        return (
                          <View
                            key={index}
                            style={[
                              !item.isMultipleSchedule && styles.scheduleItem,
                              item.isMultipleSchedule && styles.continuousSchedule,
                              orderNum === 1 &&
                                scheduleLength === 1 && {
                                  marginTop: 23,
                                },
                            ]}
                          >
                            {item.startDate === formattedDate && (
                              <MyAppText
                                numberOfLines={1}
                                // style={[
                                //   {
                                //     // flexWrap: item.isMultipleSchedule ? 'nowrap' : 'wrap',
                                //     // overflow: 'visible',
                                //   },
                                //   item.isMultipleSchedule &&
                                //     {
                                //       // width: 80,
                                //       // textAlign: 'center',
                                //     },
                                // ]}
                                // style={{
                                //   flexWrap: 'wrap', // 줄바꿈 허용
                                //   textAlign: 'left', // 필요 시 정렬
                                // }}
                              >
                                {item.title}
                                {/*{item.scheduleStartDate}*/}
                                {/*{*/}
                                {/*  scheduleList[item.scheduleStartDate]?.find(*/}
                                {/*    info => info.id === item.id,*/}
                                {/*  ).order*/}
                                {/*}*/}
                              </MyAppText>
                            )}
                          </View>
                        );
                      })}

                    {scheduleResultData &&
                    scheduleResultData?.filter(info => info.startDate === formattedDate).length >
                      2 ? (
                      <View style={styles.noItem}>
                        <MyAppText size="small" bold space="1">
                          ...
                        </MyAppText>
                        {/*<Icon name="ellipsis-horizontal-sharp" size={12} color="red" />*/}
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <FloatButton
          selectedDate={
            selectDate ??
            `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
          }
        />
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
    padding: 16,
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

    padding: 2,
    borderWidth: 0.3,
    borderColor: `${theme.color.sub}40`,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  scheduleItemContainer: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  scheduleItem: {
    width: 46,
    padding: 1,
    height: 19,
    // borderRadius: 3,
    alignItems: 'center',
    backgroundColor: `${theme.color.sub}40`,
  },
  noItem: {
    width: 46,
    borderRadius: 3,
    height: 12,
    display: 'flex',
    marginTop: -10,
    alignItems: 'center',
  },
  today: {
    backgroundColor: theme.color.main,
    width: '14%',
    borderRadius: 3,
    textAlign: 'center',
    alignItems: 'center',
    height: 21,
  },
  selectDay: {
    backgroundColor: `${theme.color.main}25`,
    // borderWidth: 1,
    // borderColor: `${theme.color.main}50`,
    width: '14%',
    borderRadius: 3,
    textAlign: 'center',
    alignItems: 'center',
    height: 75,
  },
  continuousSchedule: {
    // backgroundColor: theme.color.sub,
    backgroundColor: `${theme.color.main}25`,
    width: 50,
    padding: 1,
    borderWidth: 0,
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderRadius: 3,
  },
  todayText: {
    color: theme.color.white,
  },
  selectText: {
    color: theme.color.main,
  },
  disabledText: {
    color: 'darkgray',
  },
});

export default CalendarScreen;
