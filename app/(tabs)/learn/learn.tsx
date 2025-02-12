import { router } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { useContext } from "react";
import { SelectedThemeContext } from "../../contexts/SelectedThemeContext";
import { getGlobalStyles } from "../../styles/globalStyles";
import { StatusBar } from "expo-status-bar";
import { TextSizeContext } from "../../contexts/TextSizeContext";

const Learn = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    return ( 
        <View style={globalStyles.backgroundColor}>
            <StatusBar style={theme.statusBarStyle} />
            <Pressable 
            onPress={() => 
                router.push({
                    pathname: '/learn/meadStyles',
                })
            }
            style={({ pressed }) => [
                globalStyles.buttonStyle,
                pressed && {opacity: 0.8}
            ]}>
            <Text style={globalStyles.buttonText}>Mead Styles</Text>
            </Pressable>
        </View>
    );
};

export default Learn;