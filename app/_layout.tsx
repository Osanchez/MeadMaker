import { Stack } from "expo-router";
import { SelectedThemeContext, themes } from "./contexts/SelectedThemeContext";
import { useColorScheme} from "react-native";
import { useEffect, useState } from "react";
import { getValueFor } from "./utils/storageUtils";
import { getGlobalStyles } from "./styles/globalStyles";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { TextSizeContext, sizes } from "./contexts/TextSizeContext";
import { ActionModalContext } from "./contexts/ActionModalContext";


const RootLayout = () => {
    const [selectedTheme, setSelectedTheme] = useState("system");
    const [theme, setTheme] = useState(themes.light);

    const [selectedTextSize, setSelectedTextSize] = useState("default"); 
    const [textSize, setTextSize] = useState(sizes.default);
    
    const [systemTheme, setSystemTheme] = useState(useColorScheme());
    let globalStyles = getGlobalStyles(theme, textSize);

    const [actionModalVisible, setActionModalVisible] = useState(false);
    
    useEffect(() => {
        getValueFor('appTheme').then((theme) => {
            setSelectedTheme(theme);
        });
        getValueFor('fontSize').then((fontSize) => {
            setSelectedTextSize(fontSize);
        });
    }, []);

    useEffect(() => {
        // set the application theme
        if (selectedTheme === "system") {
            if (systemTheme === "dark") {
                setTheme(themes.dark);
                setStatusBarStyle("light");
            } else {
                setTheme(themes.light);
                setStatusBarStyle("dark");
            }
        } else if (selectedTheme === "light") {
            setTheme(themes.light);
            setStatusBarStyle("dark");
        } else if (selectedTheme === "dark") {
            setTheme(themes.dark);
            setStatusBarStyle("light");
        }

        // set the application text size
        if (selectedTextSize === "default") {
            setTextSize(sizes.default);
        } else if (selectedTextSize === "large") {
            setTextSize(sizes.large);
        } else if (selectedTextSize === "extraLarge") {
            setTextSize(sizes.extraLarge);
        }
    }, [selectedTheme, selectedTextSize]);

    const setThemeHandler = (theme) => {
        setSelectedTheme(theme);
    } 

    const setTextSizeHandler = (size) => {
        setSelectedTextSize(size);
    }

    return <TextSizeContext.Provider value={{textSize, setTextSizeHandler}}>
        <SelectedThemeContext.Provider value={{theme, setThemeHandler}}>
            <ActionModalContext.Provider value={{actionModalVisible, setActionModalVisible}}>
                <StatusBar style={theme.statusBarStyle} />
                <Stack>
                    <Stack.Screen name = "(tabs)" options={{
                        headerShown: false
                    }} />
                </Stack>
            </ActionModalContext.Provider>
        </SelectedThemeContext.Provider>
    </TextSizeContext.Provider>
}

export default RootLayout;