import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SelectedThemeContext } from '../contexts/SelectedThemeContext';
import { getGlobalStyles } from '../styles/globalStyles';
import { TextSizeContext } from '../contexts/TextSizeContext';


const CustomAddHeader = ({ title, addButtonText, onAddPress }) => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);

    const globalStyles = getGlobalStyles(theme, textSize);
    
    return (
        <View style={[globalStyles.backgroundColor, styles.container]}>
            <Text style={globalStyles.screenTitle}>{title}</Text>
            <Button
                onPress={onAddPress}
                title={addButtonText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', // Ensure the container takes the full width
    },
});

export default CustomAddHeader;