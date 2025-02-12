import React, { useContext, useState } from 'react';
import { Text, Platform, Pressable, TextInput, View  } from 'react-native';
import * as Calendar from 'expo-calendar'
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { TextSizeContext } from '../../contexts/TextSizeContext';
import { getGlobalStyles } from '../../styles/globalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { loadMead } from '../../utils/storageUtils';



const SetReminder = () => {
    var { meadId } = useLocalSearchParams<{ meadId: string }>();

    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    const [meadDetails, setMeadDetails] = useState({});
    const [calendar, setCalendar] = useState(null);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('reading');
    const [reminderDate, setReminderDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [isFocus, setIsFocus] = useState(false);

    const options = [
        {label: 'Take A Gravity Reading', value: 'reading'}, 
        {label: 'Add Nutrients', value: 'nutrients'}, 
        {label: 'Rack Mead', value: 'rack'}, 
        {label: 'Add Ingredients', value: 'add'},
        {label: 'Remove Ingredients', value: 'remove'},
        {label: 'Bottle Mead', value: 'bottle'},
        {label: 'Other', value: 'other'},
    ]

    useFocusEffect(
        React.useCallback(() => {
            fetchCalanders();
            fetchMeadDetails();
        }, [meadId])
    );

    const fetchMeadDetails = async () => {
        const meadDetails = await loadMead(meadId);
        setMeadDetails(meadDetails);
        setTitle("MeadMaker: " + meadDetails.name);
    };

    const fetchCalanders = async () => {
        // check calandar permission
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            // check if MeadMaker calendar exists
            const calendars = await Calendar.getCalendarsAsync();
            const calendarExists = calendars.find(calendar => calendar.title === 'MeadMaker Calendar');
            if (!calendarExists) {
                const newCalendar = await createCalendar();
                setCalendar(newCalendar);
            } else {
                setCalendar(calendarExists);
            }
        } else {
            await Calendar.requestCalendarPermissionsAsync();
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || reminderDate;
        setReminderDate(currentDate);
    };

    async function getDefaultCalendarSource() {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    }

    async function createCalendar() {
        const defaultCalendarSource = Platform.OS === 'ios' ? await getDefaultCalendarSource() : { isLocalAccount: true, name: 'MeadMaker Calendar' };
        await Calendar.createCalendarAsync({
            title: 'MeadMaker Calendar',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'MeadMaker',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
    }

    const getCalendarMessage = () => {
        switch (type) {
            case 'reading':
                return 'Take a gravity reading for your mead.';
            case 'nutrients':
                return 'Add nutrients to your mead.';
            case 'rack':
                return 'Rack your mead.';
            case 'add':
                return 'Add ingredients to your mead.';
            case 'remove':
                return 'Remove ingredients from your mead.';
            case 'bottle':
                return 'Bottle your mead.';
            case 'other':
                return 'Reminder for your mead.';
            default:
                return 'Reminder for your mead.';
        }
    }


    async function createCalandarEvent() {
        const calendarMessage = getCalendarMessage() + "\n\n" + notes;
        await Calendar.createEventAsync(calendar.id, {
            title: title,
            startDate: reminderDate,
            endDate: reminderDate,
            allDay: true,
            notes: calendarMessage,
            alarms: [{ relativeOffset: 60 * 6, method: Calendar.AlarmMethod.ALERT }],
        });
        alert('Calendar event created.')
        router.push({
            pathname: '/meads/[id]',
            params: { id: meadId },
        })
        setTitle('');
        setType('reading');
        setReminderDate(new Date());
        setNotes('');
    }

    return (
        <ScrollView style={globalStyles.backgroundColor}>
            <View style={globalStyles.bodyContainer}>
                <Text style={[globalStyles.label, globalStyles.smallSpacing]}>Reminder Title:</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    style={globalStyles.input}
                />
                <Text style={[globalStyles.label, globalStyles.smallSpacing]}>Type:</Text>
                <Dropdown
                    style={[globalStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={globalStyles.placeholderStyle}
                    selectedTextStyle={globalStyles.selectedTextStyle}
                    data={options}
                    value={type}
                    labelField="label"
                    valueField="value"
                    onChange={item => {
                        setType(item.value);
                    }}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                />
                <Text style={[globalStyles.label, globalStyles.smallSpacing]}>Date:</Text>
                <DateTimePicker
                    value={reminderDate}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    textColor={theme.color}
                    style={globalStyles.dateTimePicker}
                />
                <Text style={[globalStyles.label, globalStyles.smallSpacing]}>Notes:</Text>
                <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    style={[globalStyles.input, globalStyles.textArea]}
                />
                <Pressable 
                    onPress={createCalandarEvent}
                    style={({ pressed }) => [
                        globalStyles.buttonStyle,
                        pressed && {opacity: 0.8}
                    ]}>
                    <Text style={globalStyles.buttonText}>Create reminder</Text>
                </Pressable>
            </View>
        </ScrollView>
    );

}

export default SetReminder;