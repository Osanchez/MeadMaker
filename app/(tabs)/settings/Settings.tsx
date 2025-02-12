import { Pressable, Text, View, ScrollView } from 'react-native';
import { createEvent, createMead, getValueFor, loadAllEvents, loadAllMeads, save } from '../../utils/storageUtils';
import { useContext, useEffect, useState } from 'react';
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { getGlobalStyles } from '../../styles/globalStyles';
import { StatusBar } from 'expo-status-bar';
import { TextSizeContext } from '../../contexts/TextSizeContext';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome5 } from '@expo/vector-icons'; 
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { shareAsync } from 'expo-sharing';
import Moment from 'moment';

const Settings = () => {
    const [key, setKey] = useState(0);
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const [selectedAppTheme, setSelectedAppTheme] = useState("system");
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const [selectedFontSize, setSelectedFontSize] = useState("default");
    const [themeIsFocus, setThemeIsFocus] = useState(false);
    const [FontIsFocus, setFontIsFocus] = useState(false);


    let globalStyles = getGlobalStyles(theme, textSize);

    const themeOptions = [
        {label: 'System Theme', value: 'system'}, 
        {label: 'Light Theme', value: 'light'}, 
        {label: 'Dark Theme', value: 'dark'}, 
    ]

    const fontSizeOptions = [
        {label: 'Default', value: 'default'}, 
        {label: 'Large', value: 'large'}, 
        {label: 'Extra Large', value: 'extraLarge'}, 
    ]

    useEffect(() => {
        // load app theme
        getValueFor('appTheme').then((theme) => {
            setSelectedAppTheme(theme);
        });
        // load font size
        getValueFor('fontSize').then((fontSize) => {
            setSelectedFontSize(fontSize);
        });
    }, []);

    const reloadScreen = () => {
        setKey(prevkey => prevkey + 1);
    }

    const saveTheme = (theme: string) => {
        save('appTheme', theme);
        setThemeHandler(theme);
        setSelectedAppTheme(theme);
        reloadScreen();
    }

    const saveFontSize = (fontSize: string) => {
        save('fontSize', fontSize);
        setTextSizeHandler(fontSize);
        setSelectedFontSize(fontSize);
        reloadScreen();
    }

    const onBackup = async () => {
        // get user settings
        const appTheme = await getValueFor('appTheme');
        const fontSize = await getValueFor('fontSize');
        const settings = {appTheme: appTheme, fontSize: fontSize};

        // get all meads
        const allUserMeads = [];
        const meads = await loadAllMeads();

        // if there are any meads, itterate them and add event details to each mead
        if (meads && meads.length > 0) {
            for (const mead of meads) {
                if (mead.events && mead.events.length > 0) {
                    // get event details and add it to the mead
                    const eventDetails = await loadAllEvents(mead.events);
                    // remove the id from each event
                    eventDetails.forEach((event) => {
                        delete event.id;
                    });
                    // add the event details to the mead
                    mead.events = eventDetails;
                }
                // remove the id from the mead
                delete mead.id;
                // add the mead to the array of meads
                allUserMeads.push(mead);
            }
        }

        // create a backup object
        const backup = {settings: settings, meads: allUserMeads};
        const backupgString = JSON.stringify(backup);

        // create a datetime object using moment and convert to string in the format YYYY-MM-DD
        const dateString = Moment().format('YYYY_MM_DD');
        const fileName = "meadmaker_backup_" + dateString + ".json";
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, backupgString)
        await shareAsync(fileUri, { UTI: '.json', mimeType: 'application/json' });
    }

    const onRestore = async () => {
        try {
            // select the file to read
            const backupFile = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
            if (backupFile.canceled !== false && backupFile.assets !== undefined || backupFile.assets !== null) {
                //read the file
                const file = backupFile.assets[0];
                const backupString = await FileSystem.readAsStringAsync(file.uri);
                
                // Parse the JSON content
                const backupObject = JSON.parse(backupString);

                // upload data to secure storage
                // first restore visual settings
                if (backupObject.settings) {
                    // save app theme
                    save('appTheme', backupObject.settings.appTheme);
                    setThemeHandler(backupObject.settings.appTheme);
                    // save font size
                    save('fontSize', backupObject.settings.fontSize);
                    setTextSizeHandler(backupObject.settings.fontSize);
                }
                // itterate meads and add them to secure storage
                // when adding the meads the events are itterated and added to secure storage. 
                // once all events are added the events section of the mead is updated with the UUID of the events
                if (backupObject.meads) {
                    for (const mead of backupObject.meads) {
                        let meadDataCopy = {...mead};
                        meadDataCopy.events = [];
                        // add the mead to secure storage
                        const meadId = await createMead(meadDataCopy);
                        // itterate the events
                        if (mead.events && mead.events.length > 0) {
                            for (const event of mead.events) {
                                await createEvent(meadId, event);
                            }
                        }
                    }
                }

                // backups of individual meads
                if (backupObject.name) {
                    let meadDataCopy = {...backupObject};
                        meadDataCopy.events = [];
                        // add the mead to secure storage
                        const meadId = await createMead(meadDataCopy);
                        // itterate the events
                        if (backupObject.events && backupObject.events.length > 0) {
                            for (const event of backupObject.events) {
                                await createEvent(meadId, event);
                            }
                        }
                }

            }
            alert("Backup restored.")
        } catch (error) {
            alert("Invalid backup file, error: " + error);
        }
        
    }; 
    
    return (
        <ScrollView key={key} style={globalStyles.backgroundColor}>
            <View style={[globalStyles.bodyContainer, globalStyles.thematicBreak]}>
                <View style={globalStyles.headerContainer}>
                    <Text style={globalStyles.header}>Apperance</Text>
                </View>
                <StatusBar style={theme.statusBarStyle} />
                <Text style={globalStyles.fieldLabel}>App Theme:</Text>
                <Dropdown
                    style={[globalStyles.dropdown, themeIsFocus && { borderColor: 'blue' }]}
                    placeholderStyle={globalStyles.placeholderStyle}
                    selectedTextStyle={globalStyles.selectedTextStyle}
                    data={themeOptions}
                    value={selectedAppTheme}
                    labelField="label"
                    valueField="value"
                    onChange={item => {
                        saveTheme(item.value);
                    }}
                    onFocus={() => setThemeIsFocus(true)}
                    onBlur={() => setThemeIsFocus(false)}
                />
                <Text style={globalStyles.fieldLabel}>Font Size:</Text>
                <Dropdown
                    style={[globalStyles.dropdown, FontIsFocus && { borderColor: 'blue' }]}
                    placeholderStyle={globalStyles.placeholderStyle}
                    selectedTextStyle={globalStyles.selectedTextStyle}
                    data={fontSizeOptions}
                    value={selectedFontSize}
                    labelField="label"
                    valueField="value"
                    onChange={item => {
                        saveFontSize(item.value);
                    }}
                    onFocus={() => setFontIsFocus(true)}
                    onBlur={() => setFontIsFocus(false)}
                />
            </View>
            <View style={globalStyles.bodyContainer}>
                <View style={globalStyles.headerContainer}>
                    <Text style={globalStyles.header}>Backup and Restore</Text>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        globalStyles.buttonStyle,
                        pressed && {opacity: 0.8}
                    ]}
                    onPress={onBackup}>
                    <View style={globalStyles.iconTextContainer}>
                        <FontAwesome5 name="file-export" size={24} color="black" />
                        <Text style={globalStyles.buttonText}>Backup Data</Text>
                    </View>    
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        globalStyles.buttonStyle,
                        pressed && {opacity: 0.8}
                    ]}
                    onPress={onRestore}>
                    <View style={globalStyles.iconTextContainer}>
                        <FontAwesome5 name="file-import" size={24} color="black" />
                        <Text style={globalStyles.buttonText}>Import Data</Text>
                    </View>    
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default Settings;
