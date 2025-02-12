import { Tabs } from "expo-router"
import CustomAddHeader from '../components/CustomAddHeader';
import { router } from 'expo-router';
import { useContext } from "react";
import { SelectedThemeContext } from "../../contexts/SelectedThemeContext";
import { getGlobalStyles } from "../../styles/globalStyles";
import { FontAwesome5 } from '@expo/vector-icons'; 
import { TextSizeContext } from "../../contexts/TextSizeContext";
import { ActionModalContext } from "../../contexts/ActionModalContext";

const TabsLayout = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const {actionModalVisible, setActionModalVisible} = useContext(ActionModalContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    return <Tabs screenOptions={ 
        {
            headerTintColor: theme.color,
            headerStyle: {
                backgroundColor: theme.tabColor,
                shadowColor: theme.tabBorderColor,
            },
            tabBarStyle: {
                backgroundColor: theme.tabColor,
                borderTopColor: theme.tabBorderColor,
            },
        }
    }>
        <Tabs.Screen name = "index" options={{
            headerTitle: "Explore",
            title: "Explore",
            headerTitleStyle: globalStyles.screenTitle,
            tabBarIcon: (props) => <FontAwesome5 name="search" size={20} color={theme.color} />,
        }}/>
        <Tabs.Screen name = "meads/myMeads" options={{
            headerTitle: (props) => <CustomAddHeader title="My Meads" addButtonText="Add Mead" onAddPress={() => {
                router.push({
                    pathname: '/meads/addMead',
                })
            }}/>,
            title: "My Meads",
            headerTitleStyle: globalStyles.screenTitle,
            tabBarIcon: (props) => <FontAwesome5 name="wine-bottle" size={20} color={theme.color} />,
        }}/>
        <Tabs.Screen name = "meads/[id]" options={{ 
            headerTitle: (props) => <CustomAddHeader title="Mead Log" addButtonText="..." onAddPress={() => {
                setActionModalVisible(true);
            }} />,
            href: null
        }}/>
        <Tabs.Screen name = "meads/addMead" options={{
            headerTitle: "Edit Mead",
            href: null
        }}/>
        <Tabs.Screen name = "meads/editMead" options={{
            headerTitle: "Edit Mead",
            href: null
        }}/>
        <Tabs.Screen name = "meads/setReminder" options={{
            headerTitle: "Set Reminder",
            href: null
        }}/>
        <Tabs.Screen name = "calculators/calculators" options={{
            headerTitle: "Calculators",
            title: "Calculators",
            headerTitleStyle: globalStyles.screenTitle,
            tabBarIcon: (props) => <FontAwesome5 name="calculator" size={20} color={theme.color} />,
        }}/>
        <Tabs.Screen name = "calculators/abvCalculator" options={{
            headerTitle: "ABV Calculator",
            href: null
        }}/>
        <Tabs.Screen name = "calculators/backsweeteningCalculator" options={{
            headerTitle: "Backsweetening Calculator",
            href: null
        }}/>
        <Tabs.Screen name = "calculators/recipeCalculator" options={{
            headerTitle: "Recipe Calculator",
            href: null
        }}/>
        <Tabs.Screen name = "calculators/stabalizingCalculator" options={{
            headerTitle: "Stabalizing Calculator",
            href: null
        }}/>
        <Tabs.Screen name = "learn/learn" options={{
            headerTitle: "Learn",
            href: null
        }}/>
        <Tabs.Screen name = "learn/meadStyles" options={{
            headerTitle: "Mead Styles",
            href: null
        }}/>
        <Tabs.Screen name = "learn/[id]" options={{ 
            headerTitle: "Mead Information",
            href: null
        }}/>
        <Tabs.Screen name = "settings/Settings" options={{ 
            headerTitle: "Settings",
            title: "Settings",
            headerTitleStyle: globalStyles.screenTitle,
            tabBarIcon: (props) => <FontAwesome5 name="cog" size={20} color={theme.color} />,
        }}/>
    </Tabs>
}

export default TabsLayout;