import { ScrollView, StyleSheet, View } from 'react-native';
import { MyAppText } from '../styles/typography.ts';

const ScheduleEnrollScreen = () => {
    return (
        <ScrollView>
            <View>
                <MyAppText>ScheduleEnrollScreen</MyAppText>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 300,
        backgroundColor: 'white',
    },
});

export default ScheduleEnrollScreen;
