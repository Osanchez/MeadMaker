import React, { useState, useEffect, useContext } from 'react';
import { Text, TextInput, View, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { createMead } from '../../utils/storageUtils';
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { getGlobalStyles } from '../../styles/globalStyles';
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { StatusBar } from 'expo-status-bar';
import { TextSizeContext } from '../../contexts/TextSizeContext';

const AddMead = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);
    
    const [isFormValid, setIsFormValid] = useState(false); 
    const [errors, setErrors] = useState({}); 

    const [title, setTitle] = useState('');
    const [dateStarted, setDateStarted] = useState(new Date());
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    useEffect(() => { 
        // Trigger form validation when name,  
        // email, or password changes 
        validateForm(); 
    }, [title, dateStarted, description, tags]);

    const validateForm = () => { 
        let errors = {}; 
        if (title === '') { 
            errors["title"] = 'Mead name is required.'; 
        }
        // Set the errors and update form validity 
        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0); 
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
            if (errors["title"] !== undefined) {
                alert(errors["title"]);
            } 
            return;
        }   
 
        //create mead, and navigate to it
        const tagsArray = tags.trim() !== '' ? tags.split(',').map(tag => tag.trim()) : []; // Split tags by comma and trim spaces
        const meadData = {
            "name": title,
            "dateStarted": dateStarted.toISOString(),
            "description": description,
            "recipe": [],
            "tags": tagsArray,
            "events": []
        };

        let meadId = await createMead(meadData); // Await the mead ID
        // Navigate to mead
        router.push({
            pathname: '/meads/[id]',
            params: { 
                "id": meadId
            },
        });
       
        // Clear form
        setTitle('');
        setDateStarted(new Date());
        setDescription('');
        setTags('');
    };

    return ( 
            <View>
                <StatusBar style={theme.statusBarStyle} />
                <TouchableWithoutFeedback onPress={closeKeyboard}>
                    <ScrollView style={globalStyles.backgroundColor} automaticallyAdjustKeyboardInsets={true}>
                        <View style={globalStyles.bodyContainer}>
                            <Text style={globalStyles.fieldLabel}>Name:</Text>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
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
                                <Text style={globalStyles.buttonText}>Create Mead</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>
    );
};

export default AddMead;