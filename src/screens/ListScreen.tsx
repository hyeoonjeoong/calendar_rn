import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { getItem } from '../libs/fun.ts';
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

const ListScreen = ({ navigation }) => {
  const [list, setList] = useState<TScheduleList>({});
  const [resultList, setResultList] = useState<TScheduleList>({});
  // const navigation = useNavigation();

  const fetchData = async () => {
    const data = await getItem('schedule');
    // console.log(data, 'origin data');
    setList(data);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('ListScreenPage render');
    fetchData();
  }, []);

  useEffect(() => {
    const data = Object.values(list).reduce(function (acc, cur) {
      if (!Array.isArray(cur)) {
        return acc;
      }
      return [...acc, ...cur];
    }, []);

    // console.log(data, 'data 배열로 변경');
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

    // console.log(afterTodayData, 'afterTodayData');
    afterTodayData.sort((lv, rv) => {
      return differenceInMinutes(
        `${lv.startDate} ${lv.startTime}:00`,
        `${rv.startDate} ${rv.startTime}:00`,
      );
    });

    // console.log(resultData, 'resultData');

    const result = {};
    afterTodayData.forEach(info => {
      if (result[info.startDate]) {
        result[info.startDate].push(info);
      } else {
        result[info.startDate] = [info];
      }
    });

    // console.log(result, '최종 result');
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
                            {/*<Icon name="chatbubble-ellipses-outline" size={18} color="grey" />*/}
                            <MyAppText style={{ marginLeft: 4 }}>{item.content || ''}</MyAppText>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
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
});
export default ListScreen;
