import { StyleSheet } from 'react-native';


export function getGlobalStyles(theme, textSize) {

    const globalStyles = StyleSheet.create({
        contentContainer: {
            margin: 5,
        },
        imageContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        fieldContainerRow: {
            marginTop: 10,
            paddingLeft: 10,
            paddingRight: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        containerRow: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
        },
        searchBarRow: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        dateTimeContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 5,
        },
        dateTimePicker: {
            marginLeft: -10,
            marginRight: 10,
        },
        containerRowSpaceBetween: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        swipedConfirmationContainer: {
            flex: 1,
        },
        swipedRow: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            paddingLeft: 5,
            margin: 20,
            minHeight: 50,
        },
        containerBorder: {
            borderWidth: 1,
            borderColor: theme.borderColor,
            padding: 10,
            minHeight: 60,
            marginBottom: 10,
        },
        tagContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        shaded: {
            padding: 20,
            backgroundColor: '#fcda7f',
            borderRadius: 5,
        },
        smallSpacing: {
            marginTop: 10,
        },
        mediumSpacing: {
            marginTop: 20,
        },
        largeSpacing: {
            marginTop: 40,
        },
        fieldLabel: {
            marginTop: 10,
            fontSize: textSize.labelFontSize,
            color: theme.color,
        },
        buttonLabel: {
            fontSize: textSize.labelFontSize,
            fontWeight: 'bold',
        },
        label: {
            fontSize: textSize.labelFontSize,
            fontWeight: 'bold',
            color: theme.color,
        },
        value: {
            fontSize: textSize.textFontSize,
        },
        linkText: {
            fontSize: textSize.textFontSize,
            color: "#007AFF",
            fontWeight: 'bold',
            fontStyle: 'italic',
        },
        buttonText: {
            fontSize: textSize.labelFontSize,
            marginLeft: 10,
        },
        containerText: {
            fontSize: textSize.textFontSize,
            fontWeight: 'bold',
        },
        submitButtonStyle: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
            margin: 10,
            height: 50,
            backgroundColor: '#fcda7f',
            borderRadius: 5,
        },
        buttonStyle: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
            height: 80,
            backgroundColor: '#fcda7f',
            borderRadius: 5,
        },
        inlineButtonStyle: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
            height: 40,
            width: 150,
            backgroundColor: '#fcda7f',
            borderRadius: 5,
        },
        input: {
            height: 45,
            borderWidth: 1,
            borderColor: theme.borderColor,
            padding: 10,
            color: theme.color,
        },
        pickerInput: {
            height: 50,
        },
        pickerItem: {
            height: 50,
            width: "100%",
            margin: 0,
            color: theme.color,
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        screenTitle: {
            fontSize: textSize.titleFontSize,
            fontWeight: 'bold',
            color: theme.color,
        },
        header: {
            fontWeight: 'bold',
            fontSize: textSize.headerFontSize,
            marginTop: 20,
            marginBottom: 10,
            color: theme.color,
        },
        backgroundColor: {
            backgroundColor: theme.backgroundColor,
            height: "100%",
            width: "100%",
        },
        tabBarStyle: {
            backgroundColor: theme.tabColor,
        },
        bodyContainer: {
            display: 'flex',
            margin: 10,
        },
        eventContainer: {
            display: 'flex',
            height: 70,
            justifyContent: 'center',
        },
        bodyContainerRow: {
            marginBottom: 20,
        },
        centerBodyContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        },
        iconTextContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        bodyTextCenter: {
            fontSize: textSize.textFontSize,
            textAlign: 'center',
            color: theme.color,
        },
        bodyText: { 
            fontSize: textSize.textFontSize,
            color: theme.color
        },
        textArea: {
            height: 100,
            textAlignVertical: 'top',
        },
        modalContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalView: {
            marginTop: 60,
            margin: 20,
            backgroundColor: theme.modalColor,
            borderRadius: 5,
            padding: 35,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },
        modalViewDefaultBar: {
            marginTop: 100,
            margin: 20,
            backgroundColor: theme.modalColor,
            borderRadius: 5,
            padding: 35,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },
        deleteButton: {
            backgroundColor: '#b60000',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            height: '80%',
            width: '25%'
        },
        deleteButtonText: {
            fontSize: textSize.labelFontSize,
            color: '#fcfcfc',
            fontWeight: 'bold',
            padding: 3,
        },
        dropdown: {
            borderColor: theme.borderColor,
            borderWidth: 1,
            padding: 5,
        },
        placeholderStyle: {
            color: theme.color,
            fontSize: textSize.textFontSize,
        },
        selectedTextStyle: {
            color: theme.color,
            fontSize: textSize.textFontSize,
        },
        thematicBreak: {
            borderBottomColor: theme.tabBorderColor,
            borderBottomWidth: 1,
            paddingBottom: 50,
        },
        searchBar: {
            height: 40,
            width: "86%",   
            borderColor: theme.borderColor,
            borderWidth: 1,
            padding: 10,
            marginBottom: 10,
            color: theme.color,
            marginRight: 10,
            marginTop: 10,
        },
    });

    return globalStyles;

}
