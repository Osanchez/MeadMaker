import React, { useState, useEffect, useContext } from 'react';
import { useLocalSearchParams } from "expo-router";
import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import { loadMead } from "../../utils/storageUtils";
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { getGlobalStyles } from '../../styles/globalStyles';
import { StatusBar } from 'expo-status-bar';
import { TextSizeContext } from '../../contexts/TextSizeContext';
import Icons from '../../constants/icons';

const MeadPage = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    const { id } = useLocalSearchParams<{ id: string }>();
    const [meadDetails, setMeadDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeadDetails = async () => {
            try {
                const data = await loadMead(id);
                setMeadDetails(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchMeadDetails();
    }, [id]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error loading data: {error.message}</Text>;
    }

    return ( 
        <ScrollView style={globalStyles.backgroundColor}>
            <StatusBar style={theme.statusBarStyle} />
            <View style={globalStyles.headerContainer}>
                <Text style={globalStyles.header}>{meadDetails["name"]}</Text>
            </View>
            <View style={globalStyles.bodyContainer}>
                <Text style={globalStyles.bodyText}>{meadDetails["description"]}</Text>
            </View>
            <View style={globalStyles.imageContainer}>
                <Image source={Icons(meadDetails["image"])} style={styles.logo} />
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    logo: {
        height: 350,
        width: 350,
    },
});


export default MeadPage;