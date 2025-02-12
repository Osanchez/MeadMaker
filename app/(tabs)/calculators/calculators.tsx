import { router } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { useContext} from "react";
import { getGlobalStyles } from "../../styles/globalStyles";
import { SelectedThemeContext } from "../../contexts/SelectedThemeContext";
import { StatusBar } from "expo-status-bar";
import { TextSizeContext } from "../../contexts/TextSizeContext";

const Calculators = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);
    
    return ( 
        <View style={globalStyles.backgroundColor}>
            <StatusBar style={theme.statusBarStyle} />
            <Pressable 
                onPress={() => 
                    router.push({
                        pathname: '/calculators/recipeCalculator',
                    })
                }
                style={({ pressed }) => [
                    globalStyles.buttonStyle,
                    pressed && {opacity: 0.8}
            ]}>
                <Text style={globalStyles.buttonText}>Recipe Calculator</Text>
            </Pressable>
            <Pressable 
                onPress={() => 
                    router.push({
                        pathname: '/calculators/abvCalculator',
                    })
                }
                style={({ pressed }) => [
                    globalStyles.buttonStyle,
                    pressed && {opacity: 0.8}
            ]}>
                <Text style={globalStyles.buttonText}>ABV Calculator</Text>
            </Pressable>
            <Pressable 
                onPress={() => 
                    router.push({
                        pathname: '/calculators/stabalizingCalculator',
                    })
                }
                style={({ pressed }) => [
                    globalStyles.buttonStyle,
                    pressed && {opacity: 0.8}
            ]}>
                <Text style={globalStyles.buttonText}>Stabalizing Calculator</Text>
            </Pressable>
            <Pressable 
                onPress={() => 
                    router.push({
                        pathname: '/calculators/backsweeteningCalculator',
                    })
                }
                style={({ pressed }) => [
                    globalStyles.buttonStyle,
                    pressed && {opacity: 0.8}
            ]}>
                <Text style={globalStyles.buttonText}>Backsweetening Calculator</Text>
            </Pressable>
        </View>
    );
};

export default Calculators;