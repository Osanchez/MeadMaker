import React, { useContext, useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getGlobalStyles } from '../../styles/globalStyles';
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { createEvent } from '../../utils/storageUtils';
import { TextSizeContext } from '../../contexts/TextSizeContext';

const EventModal = ({ meadDetails, setMeadDetails, eventModalVisible, setEventModalVisible }) => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    const [dateTime, setDateTime] = useState(new Date());
    const [eventType, setEventType] = useState("Gravity Reading");
    const [eventValue, setEventValue] = useState("");

    const [isFormValid, setIsFormValid] = useState(false); 
    const [errors, setErrors] = useState({}); 

    useEffect(() => {
        validateForm();
    }, [dateTime, eventType, eventValue]);

    const validateForm = () => { 
        let errors = {}; 
        if (eventType === 'Gravity Reading') {
            if (eventValue.trim() === '') { 
                errors["value"] = 'Please enter a gravity reading.'; 
            }
        }
        
        // Set the errors and update form validity 
        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0); 
    };

    const renderContent = () => {
        switch (eventType) {
            case "Gravity Reading":
                return (
                    <View>
                        <Text style={globalStyles.fieldLabel}>Gravity:</Text>
                        <TextInput
                            value={eventValue}
                            onChangeText={setEventValue}
                            style={globalStyles.input}
                            keyboardType="numeric"
                        />
                    </View>
                );
            default:
                return ( 
                    <View>
                        <Text style={globalStyles.fieldLabel}>Note:</Text>
                        <TextInput
                            value={eventValue}
                            onChangeText={setEventValue}
                            multiline
                            style={[globalStyles.input, globalStyles.textArea]}
                        />
                    </View>
                );
        }
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateTime;
        setDateTime(currentDate);
    };

    const onEventAdd = async () => {
        // check form validity
        if (!isFormValid) { 
            if (errors["value"] !== undefined) {
                alert(errors["value"]);
            } 
            return;
        }

        // add event to meadDetails
        const eventDetails = {
            "date": dateTime,
            "type": eventType,
            "value": eventValue
        };

        //createEvent with event data
        let eventID = await createEvent(meadDetails["id"], eventDetails);

        // copy meadDetails and add eventID to events array, then set the new meadDetails
        let updatedMeadDetails = {...meadDetails};
        updatedMeadDetails["events"].push(eventID);
        setMeadDetails(updatedMeadDetails);

        // reset values
        setDateTime(new Date());
        setEventType("Gravity Reading");
        setEventValue("");

        // close modal
        setEventModalVisible(false);
    }

    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={() => {
            setEventModalVisible(!eventModalVisible);
        }}>
            <SafeAreaView>
                <ScrollView style={globalStyles.modalViewDefaultBar} automaticallyAdjustKeyboardInsets={true}>
                    <View style={globalStyles.containerRowSpaceBetween}>
                        <Text style={globalStyles.label}>Add Event</Text>
                        <Pressable
                            style={globalStyles.inlineButtonStyle}
                            onPress={() => setEventModalVisible(false)}> 
                            <Text style={globalStyles.buttonText}>Close</Text>
                        </Pressable>
                    </View>
                    <Text style={globalStyles.fieldLabel}>Date:</Text>
                    <View style={globalStyles.dateTimeContainer}>
                        <DateTimePicker
                            value={dateTime}
                            mode="date"
                            display="spinner"
                            onChange={onDateChange}
                            textColor={theme.color}
                            style={globalStyles.dateTimePicker}
                        />
                    </View>
                    <Text style={globalStyles.fieldLabel}>Event Type:</Text>
                    <Picker
                        selectedValue={eventType}
                        onValueChange={setEventType}
                        style={globalStyles.pickerInput}
                        itemStyle={globalStyles.pickerItem}>
                        <Picker.Item label="Started Primary" value="Started Primary"/>
                        <Picker.Item label="Started Secondary" value="Started Secondary"/>
                        <Picker.Item label="Gravity Reading" value="Gravity Reading"/>
                        <Picker.Item label="Racking" value="Racking"/>
                        <Picker.Item label="Feeding" value="Feeding"/>
                        <Picker.Item label="Conditioning" value="Conditioning"/>
                        <Picker.Item label="Bottled" value="Bottled"/>
                        <Picker.Item label="Cold Crashing" value="Cold Crashing"/>
                        <Picker.Item label="Pasteurizing" value="Pasteurizing"/>
                        <Picker.Item label="Stabalizing" value="Stabalizing"/>
                        <Picker.Item label="Back Sweetening" value="Back Sweetening"/>
                        <Picker.Item label="Tasting" value="Tasting"/>
                        <Picker.Item label="Discarded" value="Discarded"/>
                        <Picker.Item label="Note" value="Note"/>
                    </Picker>
                    {renderContent()}
                    <Pressable 
                        style={({ pressed }) => [
                            globalStyles.buttonStyle,
                            pressed && {opacity: 0.8}
                        ]}
                        onPress={() => onEventAdd()}>
                        <Text style={globalStyles.buttonText}>Add Event</Text>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </Modal>
  );
};

export default EventModal;