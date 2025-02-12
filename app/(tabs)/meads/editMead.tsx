import React, { useState, useEffect, useContext } from 'react';
import { Text, TextInput, View, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { loadMead, updateMead } from '../../../utils/storageUtils';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { getGlobalStyles } from '../../../styles/globalStyles';
import { SelectedThemeContext } from '../../../contexts/SelectedThemeContext';
import { StatusBar } from 'expo-status-bar';
import { TextSizeContext } from '../../../contexts/TextSizeContext';

const EditMead = () => {
    var { meadId } = useLocalSearchParams<{ meadId: string }>();

    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);
    
    const [isFormValid, setIsFormValid] = useState(false); 
    const [errors, setErrors] = useState({}); 

    const [meadData, setMeadData] = useState({});
    const [name, setName] = useState('');
    const [dateStarted, setDateStarted] = useState(new Date());
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            fetchMeadDetails();
        }, [meadId])
    );

    useEffect(() => { 
        validateForm(); 
    }, [name]);

    const validateForm = () => { 
        let errors = {}; 
        if (name === '') { 
            errors["name"] = 'Mead name is required.';
        }
        // Set the errors and update form validity 
        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0); 
    };

    // reload mead info when event is added
    const fetchMeadDetails = async () => {
        const meadDetails = await loadMead(meadId);
        setMeadData(meadDetails);
        setName(meadDetails.name);
        setDateStarted(new Date(meadDetails.dateStarted));
        setDescription(meadDetails.description);
        setTags(meadDetails.tags.join(', '));
    };

    const closeKeyboard = () => {
        Keyboard.dismiss();
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateStarted;
        setDateStarted(currentDate);
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (!isFormValid) { 
            if (errors["name"] !== undefined) {
                alert(errors["name"]);
            } 
            return;
        }   
 
        const tagsArray = tags.trim() !== '' ? tags.split(',').map(tag => tag.trim()) : []; // Split tags by comma and trim spaces
        
        meadData["name"] = name;
        meadData["dateStarted"] = dateStarted;
        meadData["description"] = description;
        meadData["tags"] = tagsArray;
    
        try {
            await updateMead(meadId, meadData); // Await the mead ID
            // Navigate to mead
            router.push({
                pathname: '/meads/[id]',
                params: { 
                    "id": meadId 
                },
            });
        } catch (error) {
            alert("Failed to create mead");
            console.error("Failed to create mead:", error);
        }
    };

    return ( 
            <View>
                <StatusBar style={theme.statusBarStyle} />
                <TouchableWithoutFeedback onPress={closeKeyboard}>
                    <ScrollView style={globalStyles.backgroundColor} automaticallyAdjustKeyboardInsets={true}>
                        <View style={globalStyles.bodyContainer}>
                            <Text style={globalStyles.fieldLabel}>Name:</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                style={globalStyles.input}
                            />
                            <Text style={globalStyles.fieldLabel}>Date Started:</Text>
                            <View style={globalStyles.dateTimeContainer}>
                                <DateTimePicker
                                    value={dateStarted}
                                    mode="date"
                                    display="spinner"
                                    onChange={onDateChange}
                                    textColor={theme.color}
                                    style={globalStyles.dateTimePicker}
                                />
                            </View>
                            <Text style={globalStyles.fieldLabel}>Description:</Text>
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                style={[globalStyles.input, globalStyles.textArea]}
                            />
                            <Text style={globalStyles.fieldLabel}>Tags:</Text>
                            <TextInput
                                value={tags}
                                onChangeText={setTags}
                                style={globalStyles.input}
                            />
                            <Pressable
                                onPress={handleSubmit}
                                style={({ pressed }) => [
                                    globalStyles.buttonStyle,
                                    pressed && {opacity: 0.8}
                                ]}
                            >
                                <Text style={globalStyles.buttonText}>Save Mead</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>
    );
};

export default EditMead;