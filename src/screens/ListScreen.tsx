import { SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getItem, screenHeight, setItem } from '../libs/fun.ts';
import React, { useEffect, useState } from 'react';
import { TSchedule, TScheduleList } from '../type/schedule.ts';
import {
  addDays,
  differenceInDays,
  differenceInMinutes,
  format,
  isBefore,
  parse,
  startOfDay,
} from 'date-fns';
import theme from '../styles/theme.ts';
import { MyAppText } from '../styles/typography.ts';
import { ko } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/Ionicons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

const ListScreen = ({ navigation }) => {
  const [list, setList] = useState<TScheduleList>({});
  const [resultList, setResultList] = useState<TScheduleList>({});
  // const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState<TSchedule>();

  const fetchData = async () => {
    const data = await getItem('schedule');
    setList(data);
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

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 40 }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <TouchableOpacity
          style={styles.rightAction}
          onPress={() =>
            deleteSchedule(String(selectedItem?.scheduleStartDate), String(selectedItem?.id))
          }
        >
          <Icon name="trash-outline" size={24} color={theme.color.white} />
        </TouchableOpacity>
      </Reanimated.View>
    );
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (list === null) {
      return;
    }
    const data = Object.values(list).reduce(function (acc, cur) {
      if (!Array.isArray(cur)) {
        return acc;
      }
      return [...acc, ...cur];
    }, []);

    const resultData: TSchedule[] = [];
    data.forEach(info => {
      if (info.startDate === info.endDate) {
        resultData.push(info);
      } else {
        const diff = differenceInDays(info.endDate, info.startDate);
        for (let i = 0; i <= diff; i++) {
          resultData.push({
            ...info,
            startDate: format(addDays(info.startDate, i), 'yyyy-MM-dd'),
            startTime: i === 0 ? info.startTime : '00:00',
            endTime: i === diff ? info.endTime : '23:59',
          });
        }
      }
    });

    const today = startOfDay(new Date());
    const afterTodayData = resultData.filter(info => {
      const parsedDate = parse(info.startDate, 'yyyy-MM-dd', new Date());
      return !isBefore(parsedDate, today);
    });

    afterTodayData.sort((lv, rv) => {
      return differenceInMinutes(
        `${lv.startDate} ${lv.startTime}:00`,
        `${rv.startDate} ${rv.startTime}:00`,
      );
    });

    const result = {};
    afterTodayData.forEach(info => {
      if (result[info.startDate]) {
        result[info.startDate].push(info);
      } else {
        result[info.startDate] = [info];
      }
    });

    setResultList(result);
  }, [list]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.listContainer}>
          {resultList &&
            Object.entries(resultList).map(([date, items]) => (
              <View>
                <MyAppText size="medium" bold key={date}>
                  {format(date, 'yyyy-MM-dd (E)', { locale: ko })}
                </MyAppText>
                <View style={styles.card}>
                  {items.map((item, index) => (
                    <ReanimatedSwipeable
                      key={index}
                      friction={2}
                      enableTrackpadTwoFingerGesture
                      rightThreshold={40}
                      renderRightActions={RightAction}
                      onSwipeableWillOpen={() => setSelectedItem(item)}
                    >
                      <View key={index} style={styles.listItem}>
                        <View style={{ width: '100%' }}>
                          <View style={styles.flexRow}>
                            <MyAppText size="medium">{item.title || '날짜 없음'}</MyAppText>
                            <MyAppText color={theme.color.main}>
                              {!item.startTime ||
                              (item.startTime === '00:00' && item.endTime === '23:59')
                                ? '종일'
                                : `${item.startTime} ~ ${item.endTime}`}
                            </MyAppText>
                          </View>
                          {item.content && item.content !== '' && (
                            <View style={styles.contentBox}>
                              <MyAppText style={{ marginLeft: 4 }}>{item.content || ''}</MyAppText>
                            </View>
                          )}
                        </View>
                      </View>
                    </ReanimatedSwipeable>
                  ))}
                </View>
              </View>
            ))}
          {(list === null || Object.keys(list).length === 0) && (
            <View style={styles.noScheduleContainer}>
              <Icon name="calendar-outline" size={26} color={theme.color.main} />
              <MyAppText marginTop={6}>등록된 일정 리스트가 없어요</MyAppText>
              <TouchableOpacity
                style={[styles.button, { marginTop: 10 }]}
                onPress={() => {
                  navigation.navigate('ScheduleEnroll', {
                    selectedDate: format(new Date(), 'yyyy-MM-dd') as string,
                  });
                }}
              >
                <MyAppText style={styles.buttonText}>일정 등록하기</MyAppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
    padding: 0,
  },
  listContainer: {
    padding: 10,
  },
  card: {
    paddingLeft: 2,
    marginTop: 3,
    marginBottom: 20,
    backgroundColor: theme.color.white,
    borderColor: `${theme.color.main}50`,
    padding: 0,
    borderStyle: 'solid',
  },
  listItem: {
    marginTop: 6,
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.color.sub,
    paddingLeft: 8,
    paddingRight: 8,
    minHeight: 28,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.color.grey}90`,
    marginTop: 8,
    borderRadius: 6,
    padding: 3,
  },
  rightAction: {
    width: 40,
    height: 31,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: theme.color.red,
  },
  noScheduleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: theme.color.main,
    padding: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.color.white,
  },
});
export default ListScreen;
