import React, { useContext, useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { getGlobalStyles } from '../../styles/globalStyles';
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { TextSizeContext } from '../../contexts/TextSizeContext';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { router } from 'expo-router';
import { duplicateMead, loadAllEvents } from '../../utils/storageUtils';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

const ActionModal = ({ meadDetails, setMeadDetails, actionModalVisible, setActionModalVisible }) => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    const [meadId, setMeadId] = useState('');
    const [eventDetails, setEventDetails] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState();

    useEffect(() => { 
        setMeadId(meadDetails.id);
        fetchEventDetails();
    }, [meadDetails]);

    // get event details
    const fetchEventDetails = async () => {
        if (meadDetails && meadDetails["events"]) {
            const eventData = await loadAllEvents(meadDetails["events"])
            setEventDetails(eventData);
        }
    };

    const onEdit = async () => {
        router.push({
            pathname: '/meads/editMead', 
            params: { meadId: meadId }});
    }

    const onDuplicate = async () => {
        await duplicateMead(meadDetails.id);
        router.push({
            pathname: '/meads/myMeads',
        })
    }

    const onReminder = async () => {
        router.push({
            pathname: '/meads/setReminder', 
            params: { meadId: meadId }});
    }

    const onShare = async () => {
        await printToFile();
        setActionModalVisible(!actionModalVisible);
    }

    const onExport = async () => {
        //create a copy of mead details and remove id
        const meadDetailsCopy = {...meadDetails};
        delete meadDetailsCopy.id;
        //create a copy of event details and remove id
        const eventDetailsCopy = [...eventDetails];
        eventDetailsCopy.forEach((event) => {
            delete event.id;
        });
        //add events to mead details
        meadDetailsCopy.events = eventDetailsCopy;
        const jsonDetailsString = JSON.stringify(meadDetailsCopy);
        //create a file and share it
        const fileName = meadDetails.name.replace(/ /g, '_') + ".json";
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, jsonDetailsString)
        await shareAsync(fileUri, { UTI: '.json', mimeType: 'application/json' });
        setActionModalVisible(!actionModalVisible);
    }

    const printToFile = async () => {
        //generate an html page based on mead details
        let html = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, 
                    minimum-scale=1.0, user-scalable=no" />
                </head>
                <body>
                    <h1>${meadDetails.name}</h1>
                    <div>
                        <h2>Recipe</h2>
                        <ul>
                            ${meadDetails?.recipe?.map((ingredient) => {
                                return `<li>${ingredient.amount} ${ingredient.metric} ${ingredient.name}</li>`;
                            }).join('')}
                        </ul>
                        <h2>Description</h2>
                        <p>${meadDetails.description}</p>
                        <h2>Events</h2>
                        <ul>
                            ${eventDetails?.map((event) => {
                                return `<li>${localizedDate(event.date)} ${event.type} ${event.value}</li>`;
                            }).join('')}
                        </ul>
                    </div>
                </body>
            </html>
        `;
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({ html });
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    };

    const localizedDate = (dateStr) => {
        const dateStarted = new Date(dateStr);
        const localizedDate = dateStarted.toLocaleDateString();
        return localizedDate
    };

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={actionModalVisible}
            onRequestClose={() => {
                setActionModalVisible(false);
            }}>
                <SafeAreaView>
                    <ScrollView style={globalStyles.modalViewDefaultBar} automaticallyAdjustKeyboardInsets={true}>
                        <View style={globalStyles.containerRowSpaceBetween}>
                            <Text style={globalStyles.label}>Select action</Text>
                            <Pressable
                                style={globalStyles.inlineButtonStyle}
                                onPress={() => setActionModalVisible(!actionModalVisible)}>
                                <Text style={globalStyles.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                        <Pressable 
                            style={({ pressed }) => [
                                globalStyles.buttonStyle,
                                pressed && {opacity: 0.8}
                            ]}
                            onPress={() => {
                                onEdit();
                                setActionModalVisible(!actionModalVisible);
                            }}>
                            <View style={globalStyles.iconTextContainer}>
                                <FontAwesome5 name="pencil-alt" size={24} color="black" />
                                <Text style={globalStyles.buttonText}>Edit</Text>
                            </View>
                        </Pressable>
                        <Pressable 
                            style={({ pressed }) => [
                                globalStyles.buttonStyle,
                                pressed && {opacity: 0.8}
                            ]}
                            onPress={() => {
                                onDuplicate();
                                setActionModalVisible(!actionModalVisible);
                            }}>
                            <View style={globalStyles.iconTextContainer}>
                                <FontAwesome5 name="copy" size={24} color="black" />
                                <Text style={globalStyles.buttonText}>Duplicate</Text>
                            </View>
                        </Pressable>
                        <Pressable 
                            style={({ pressed }) => [
                                globalStyles.buttonStyle,
                                pressed && {opacity: 0.8}
                            ]}
                            onPress={() => {
                                onReminder();
                                setActionModalVisible(!actionModalVisible);
                            }}>
                            <View style={globalStyles.iconTextContainer}>
                                <FontAwesome5 name="bell" size={24} color="black" />
                                <Text style={globalStyles.buttonText}>Set Reminder</Text>
                            </View>
                        </Pressable>
                        <Pressable 
                            style={({ pressed }) => [
                                globalStyles.buttonStyle,
                                pressed && {opacity: 0.8}
                            ]}
                            onPress={() => {
                                onShare();
                            }}>
                            <View style={globalStyles.iconTextContainer}>
                                <FontAwesome5 name="share-alt-square" size={24} color="black" />
                                <Text style={globalStyles.buttonText}>Share</Text>
                            </View>
                        </Pressable>
                        <Pressable 
                            style={({ pressed }) => [
                                globalStyles.buttonStyle,
                                pressed && {opacity: 0.8}
                            ]}
                            onPress={() => {
                                onExport();
                            }}>
                            <View style={globalStyles.iconTextContainer}>
                                <FontAwesome5 name="file-export" size={24} color="black" />
                                <Text style={globalStyles.buttonText}>Export</Text>
                            </View>
                        </Pressable>
                    </ScrollView>
                </SafeAreaView>
        </Modal>
  );
};

export default ActionModal;