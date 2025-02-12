import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { getGlobalStyles } from "../styles/globalStyles";
import { ensurePredefinedData } from "../utils/storageUtils";
import {useContext, useEffect } from "react";
import { SelectedThemeContext } from "../contexts/SelectedThemeContext";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons'; 
import { TextSizeContext } from "../contexts/TextSizeContext";

const HomePage = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);
    
    useEffect(() => {
        ensurePredefinedData();
    }, []);
    
    return ( 
        <View style={globalStyles.backgroundColor}>
            <StatusBar style={theme.statusBarStyle} />
            <View style={globalStyles.bodyContainer}>
                <View style={globalStyles.imageContainer}>
                    {theme.varient === 'light' ? (
                        <Image source={require('../../assets/appLogo.png')} style={styles.logo} />
                    ) : (
                        <Image source={require('../../assets/appLogoDark.png')} style={styles.logo} />
                    )}
                </View>
                <Pressable
                    onPress={() => router.push({
                        pathname: '/learn/learn',
                    })}
                    style={({ pressed }) => [
                        globalStyles.buttonStyle,
                        pressed && {opacity: 0.8}
                    ]}>
                    <View style={globalStyles.iconTextContainer}>
                        <FontAwesome5 name="graduation-cap" size={24} color="black" />
                        <Text style={globalStyles.buttonText}>Learn</Text>
                    </View>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        globalStyles.buttonStyle,
                        pressed && {opacity: 0.8}
                    ]}>  
                    <View style={globalStyles.iconTextContainer}>
                        <FontAwesome5 name="book-open" size={24} color="black" />
                        <Text style={globalStyles.buttonText}>Recipes</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    logo: {
        height: 400,
        width: 400,
    },
});

export default HomePage;
