import { createContext } from 'react';

export const sizes = {
    default: {
        varient: "default",
        headerFontSize: 24,
        titleFontSize: 18,
        labelFontSize: 18,
        textFontSize: 16,
    },
    large: {
        varient: "large",
        headerFontSize: 26,
        titleFontSize: 20,
        labelFontSize: 20,
        textFontSize: 18,
    },
    extraLarge: {
        varient: "extraLarge",
        headerFontSize: 28,
        titleFontSize: 22,
        labelFontSize: 22,
        textFontSize: 18,
    }
}

export const TextSizeContext = createContext({
    textSize: sizes.default,
    setTextSizeHandler: (size) => {},
});
