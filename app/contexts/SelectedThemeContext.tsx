import { createContext } from 'react';

export const themes = {
    light: {
        varient: "light",
        statusBarStyle: 'dark',
        tabColor: 'white',
        tabBorderColor: 'black',
        backgroundColor: 'white',
        color: 'black',
        borderColor: 'black',
        modalColor: '#f2f2f2',
        pickerColor: '#efefef',
        honeyColor: '#fcda7f',
        selectedHoneyColor: "#ffbb05"
    },
    dark: {
        varient: "dark",
        statusBarStyle: 'light',
        tabColor: 'black',
        tabBorderColor: '#3c3c3c',
        backgroundColor: '#121212',
        color: 'white',
        borderColor: 'white',
        modalColor: '#1f1f1f',
        pickerColor: '#2b2b2b',
        honeyColor: '#fcda7f',
        selectedHoneyColor: "#ffbb05"
    },
}

export const SelectedThemeContext = createContext({
    theme: themes.light,
    setThemeHandler: (theme) => {},
});
