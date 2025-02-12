import React, { useContext, useState } from 'react';
import { View, Text, Pressable, ScrollView } from "react-native";
import { loadAllMeadStyles } from "../../../utils/storageUtils";
import { router, useFocusEffect } from 'expo-router';
import { SelectedThemeContext } from '../../../contexts/SelectedThemeContext';
import { getGlobalStyles } from '../../../styles/globalStyles';
import { StatusBar } from 'expo-status-bar';
import { TextSizeContext } from '../../../contexts/TextSizeContext';

const MyMeads = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);
    
    const [meadStyles, setMeadStyles] = useState([]);

    // load all meads when component is focused
    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        const allMeads = await loadAllMeadStyles();
        setMeadStyles(allMeads);
    };

    return ( 
        <ScrollView style={globalStyles.backgroundColor}>
            <StatusBar style={theme.statusBarStyle} />
            <View style={globalStyles.headerContainer}>
                <Text style={globalStyles.header}>Types of Mead</Text>
            </View>
            <View style={globalStyles.centerBodyContainer}>
                <Text style={globalStyles.bodyTextCenter}>
                    Mead is an alcoholic beverage created by fermenting honey with water. 
                    It can include various fruits, spices, grains, or hops. 
                    The flavors of mead can vary greatly depending on the source of the honey, additives (like fruits or spices), and fermentation process. 
                    Mead is one of the oldest known alcoholic drinks, with a history that dates back thousands of years across various cultures. 
                    Its taste can range from sweet to dry, and it can be still, carbonated, or naturally sparkling.
                    Select a type of mead to learn more about it.
                </Text>
            </View>
            {meadStyles.map((meadStyle, index) => (
                <Pressable 
                key={meadStyle}
                onPress={() => 
                    router.push({
                        pathname: '/learn/[id]',
                        params: { id: meadStyle },
                    })
                }
                style={({ pressed }) => [
                    globalStyles.buttonStyle,
                    pressed && {opacity: 0.8}
                ]}>
                    <Text style={globalStyles.buttonText}>{meadStyle.replace(/_/g, ' ')}</Text>
                </Pressable>
            ))}
        </ScrollView>
    );
};

export default MyMeads;