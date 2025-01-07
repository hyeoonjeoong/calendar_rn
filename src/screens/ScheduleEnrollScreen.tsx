import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { MyAppText } from '../styles/typography.ts';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackParamList } from '../navigation/Navigator.tsx';
import theme from '../styles/theme.ts';
import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { ko } from 'date-fns/locale';
import { getItem, setItem } from '../libs/fun.ts';
import { TSchedule } from '../type/schedule.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ScheduleEnrollScreenNavigationProps = RouteProp<StackParamList, 'ScheduleEnroll'>;
type CalendarScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'CalendarMain'>;

const ScheduleEnrollScreen = ({ route }: { route: ScheduleEnrollScreenNavigationProps }) => {
  const { selectedDate } = route.params;
  const navigation = useNavigation<CalendarScreenNavigationProp>();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const [startDate, setStartDate] = useState(new Date(selectedDate));
  const [endDate, setEndDate] = useState(new Date(selectedDate));
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isAllDay, setIsAllDay] = useState(false);

  const [isOpenStartModal, setIsOpenStartModal] = useState<boolean>(false);
  const [isOpenStartTimeModal, setIsOpenStartTimeModal] = useState<boolean>(false);
  const [isOpenEndModal, setIsOpenEndModal] = useState<boolean>(false);
  const [isOpenEndTimeModal, setIsOpenEndTimeModal] = useState<boolean>(false);

  const handleSubmit = () => {
    if (title.trim() === '') {
      Toast.show({
        type: 'info',
        text1: '일정 제목을 입력해주세요',
        visibilityTime: 1000,
      });
      return;
    }
    const data = {
      id: `${Date.now()}`,
      title,
      content,
      startDate: format(startDate, 'yyyy-MM-dd'),
      startTime: isAllDay ? '' : format(startTime, 'HH:mm'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      endTime: isAllDay ? '' : format(endTime, 'HH:mm'),
    };
    saveSchedule(data);
  };

  const saveSchedule = async (schedule: TSchedule) => {
    // console.log(schedule, 'schedule');
    const { startDate } = schedule;
    try {
      const originData = (await getItem('schedule')) ?? [];
      const updatedData = {
        ...originData,
        [startDate]: Array.isArray(originData[startDate])
          ? [{ ...schedule }, ...originData[startDate]]
          : [{ ...schedule }],
      };

      await setItem('schedule', updatedData);
      navigation.navigate('CalendarMain');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <TextInput
          onChangeText={e => {
            setTitle(e);
          }}
          value={title}
          style={styles.input}
          placeholder="제목을 입력해주세요"
        />
      </View>
      <View style={styles.sectionContainer}>
        <View style={[styles.dateContainer, { marginBottom: 8 }]}>
          <View style={styles.flexRow}>
            <Icon name="time-outline" size={20} color={theme.color.main} />
            <MyAppText>종일</MyAppText>
          </View>
          <View style={styles.flexRow}>
            <TouchableOpacity onPress={() => setIsAllDay(!isAllDay)}>
              <Icon
                name={isAllDay ? 'checkbox' : 'checkbox-outline'}
                size={24}
                color={theme.color.main}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <View style={styles.flexRow}>
            <MaterialIcon name="start" size={20} color={theme.color.red} />
            <MyAppText>시작</MyAppText>
          </View>
          <View style={styles.flexRow}>
            <TouchableOpacity onPress={() => setIsOpenStartModal(true)}>
              <View style={styles.dateItemBox}>
                <MyAppText>{format(startDate, 'yyyy-MM-dd EEEE', { locale: ko })}</MyAppText>
              </View>
            </TouchableOpacity>
            {!isAllDay && (
              <TouchableOpacity onPress={() => setIsOpenStartTimeModal(true)}>
                <View style={styles.dateItemBox}>
                  <MyAppText>{format(startTime, 'a HH:mm')}</MyAppText>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.flexRow}>
            <MaterialIcon
              name="start"
              size={20}
              color={theme.color.blue}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
            <MyAppText>종료 </MyAppText>
          </View>

          <View style={styles.flexRow}>
            <TouchableOpacity onPress={() => setIsOpenEndModal(true)}>
              <View style={styles.dateItemBox}>
                <MyAppText>{format(endDate, 'yyyy-MM-dd EEEE', { locale: ko })}</MyAppText>
              </View>
            </TouchableOpacity>
            {!isAllDay && (
              <TouchableOpacity onPress={() => setIsOpenEndTimeModal(true)}>
                <View style={styles.dateItemBox}>
                  <MyAppText>{format(endTime, 'a HH:mm')}</MyAppText>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <MyAppText>내용</MyAppText>
        <TextInput
          multiline
          onChangeText={e => {
            setContent(e);
          }}
          value={content}
          style={[styles.input, { height: 100 }]}
        />
      </View>
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={[styles.button, { marginTop: 5 }]} onPress={handleSubmit}>
          <MyAppText bold size="medium" style={styles.buttonText}>
            등록하기
          </MyAppText>
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        mode="date"
        title={null}
        locale="ko-KR"
        confirmText="확인"
        cancelText="취소"
        date={startDate}
        open={isOpenStartModal}
        onConfirm={date => {
          const formattedDate = format(new Date(date), 'yyyy-MM-dd');
          setIsOpenStartModal(false);
          setStartDate(new Date(formattedDate));
        }}
        onCancel={() => setIsOpenStartModal(false)}
      />
      <DatePicker
        modal
        mode="date"
        title={null}
        locale="ko-KR"
        confirmText="확인"
        cancelText="취소"
        date={endDate}
        open={isOpenEndModal}
        onConfirm={date => {
          const formattedDate = format(new Date(date), 'yyyy-MM-dd');
          setIsOpenEndModal(false);
          setEndDate(new Date(formattedDate));
        }}
        onCancel={() => setIsOpenEndModal(false)}
      />
      <DatePicker
        modal
        mode="time"
        title={null}
        locale="ko-KR"
        confirmText="확인"
        cancelText="취소"
        date={startTime}
        open={isOpenStartTimeModal}
        onConfirm={time => {
          setStartTime(time);
          setIsOpenStartTimeModal(false);
        }}
        onCancel={() => setIsOpenStartTimeModal(false)}
      />
      <DatePicker
        modal
        mode="time"
        title={null}
        locale="ko-KR"
        confirmText="확인"
        cancelText="취소"
        date={endTime}
        open={isOpenEndTimeModal}
        onConfirm={time => {
          setEndTime(time);
          setIsOpenEndTimeModal(false);
        }}
        onCancel={() => setIsOpenEndTimeModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    // textAlign: 'center',
    // alignItems: 'center',
    backgroundColor: theme.color.white,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  sectionContainer: {
    marginTop: 36,
    paddingHorizontal: 20,
    display: 'flex',
    gap: 6,
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingRight: 4,
    paddingLeft: 4,
  },
  dateItemBox: {
    backgroundColor: theme.color.grey,
    padding: 4,
    borderRadius: 6,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: `${theme.color.main}60`,
  },
  button: {
    backgroundColor: theme.color.sub,
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.color.white,
    textAlign: 'center',
  },
});

export default ScheduleEnrollScreen;
