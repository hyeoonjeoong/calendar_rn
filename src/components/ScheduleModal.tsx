import React from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackParamList } from '../navigation/Navigator.tsx';
import { MyAppText } from '../styles/typography.ts';
import theme from '../styles/theme.ts';
import Icon from 'react-native-vector-icons/Ionicons';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CalendarScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'ScheduleEnroll'>;

type CalendarModalProps = {
  isViewModalOpen: boolean;
  onClose: () => void;
  selectDate: string | undefined;
};

const ScheduleModal: React.FC<CalendarModalProps> = ({ isViewModalOpen, onClose, selectDate }) => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isViewModalOpen}
      onRequestClose={onClose}
    >
      <Pressable style={{ flex: 1, backgroundColor: 'transparent' }} onPress={onClose} />
      <View style={styles.modalContainer}>
        <View style={styles.dateContainer}>
          <MyAppText size="large" space="-1">
            {selectDate}
          </MyAppText>

          <TouchableOpacity
            onPress={() => {
              onClose();
              navigation.navigate('ScheduleEnroll', { selectedDate: selectDate as string });
            }}
          >
            <Icon name="add-circle-outline" size={24} color={theme.color.main} />
          </TouchableOpacity>
        </View>
        {/* ----- 일정 없을 경우 ----- */}
        {/*<View style={styles.noScheduleContainer}>*/}
        {/*  <Icon name="calendar-outline" size={26} color={theme.color.main} />*/}
        {/*  <MyAppText marginTop={2}>등록된 일정이 없어요</MyAppText>*/}
        {/*  <TouchableOpacity*/}
        {/*    style={[styles.button, { marginTop: 5 }]}*/}
        {/*    onPress={() => {*/}
        {/*      onClose();*/}
        {/*      navigation.navigate('ScheduleEnroll', { selectedDate: selectDate as string });*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <MyAppText style={styles.buttonText}>일정 등록하기</MyAppText>*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}
        {/* ---------------------- */}
        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <View>
              <MyAppText size="medium">2025-05-05</MyAppText>
              <MyAppText color={theme.color.main}>종일</MyAppText>
            </View>
            <MyAppText>누워있기</MyAppText>
          </View>
          <View style={styles.listItem}>
            <View>
              <MyAppText size="medium">2025-05-07</MyAppText>
              <MyAppText color={theme.color.main}>17:00 - 18:00</MyAppText>
            </View>
            <MyAppText>누워있기 딩굴딩굴딩굴</MyAppText>
          </View>
          <View style={styles.listItem}>
            <View>
              <MyAppText size="medium">2025-05-07</MyAppText>
              <MyAppText color={theme.color.main}>17:00 - 18:00</MyAppText>
            </View>
            <MyAppText>test data</MyAppText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: 240,
    alignItems: 'center',
    backgroundColor: theme.color.white,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderTopColor: theme.color.main,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: theme.color.main,
    padding: 10,
    borderTopRightRadius: 20,
    borderStyle: 'solid',
  },
  noScheduleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    width: '100%',
  },
  dateContainer: {
    padding: 10,
    paddingBottom: 4,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: theme.color.main,
    padding: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.color.white,
  },
  listContainer: {
    width: '96%',
  },
  listItem: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.color.sub,
    paddingLeft: 8,
  },
});

export default ScheduleModal;
