import React, { useState, useEffect, useContext } from 'react';
import { Text, TextInput, View, Pressable } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { getGlobalStyles } from '../../../styles/globalStyles';
import { SelectedThemeContext } from '../../../contexts/SelectedThemeContext';
import { StatusBar } from 'expo-status-bar';
import { TextSizeContext } from '../../../contexts/TextSizeContext';

const backSweeteningCalculator = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);
    
    const [isFormValid, setIsFormValid] = useState(false); 
    const [errors, setErrors] = useState({}); 

    useEffect(() => { 
        validateForm(); 
    }, []);

    const validateForm = () => { 
        let errors = {}; 
        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0); 
    };


    return ( 
            <ScrollView style={globalStyles.backgroundColor}>
                <StatusBar style={theme.statusBarStyle} />
            </ScrollView>
    );
};

export default backSweeteningCalculator;