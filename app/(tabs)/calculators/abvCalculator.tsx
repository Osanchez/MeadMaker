import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Keyboard } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { getGlobalStyles } from '../../styles/globalStyles';
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { StatusBar } from 'expo-status-bar';
import { TextSizeContext } from '../../contexts/TextSizeContext';

const ABVCalculator = () => {
    const [key, setKey] = useState(0);
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    useEffect(() => {
        reloadScreen();
    }, [theme]);

    const reloadScreen = () => {
        setKey(prevkey => prevkey + 1);
    }

    // inputs
    const [equation, setEquation] = useState('standard');
    const [gravityUnit, setGravityUnit] = useState('SG');
    const [originalGravity, setOriginalGravity] = useState('1.050');
    const [finalGravity, setFinalGravity] = useState('1.010');

    // calculations
    const [alcoholByVolume, setAlcoholByVolume] = useState('');
    const [apparentAttenuation, setApparentAttenuation] = useState('');
    const [calories, setCalories] = useState('');
    const [originalGravities, setOriginalGravities] = useState('');
    const [finalGravities, setFinalGravities] = useState('');

    // formulas
    const standardABVFormula = () => {
        let originalGravityFloat = parseFloat(originalGravity);
        let finalGravityFloat = parseFloat(finalGravity);
        if (gravityUnit == 'Plato') {
            originalGravityFloat = parseFloat(PlatoToSGFormula(originalGravityFloat));
            finalGravityFloat = parseFloat(PlatoToSGFormula(finalGravityFloat));
        }
        return ((originalGravityFloat - finalGravityFloat) * 131.25).toFixed(2);
    };

    const alternateABVFormula = () => {
        let originalGravityFloat = parseFloat(originalGravity);
        let finalGravityFloat = parseFloat(finalGravity);
        if (gravityUnit == 'Plato') {
            originalGravityFloat = parseFloat(PlatoToSGFormula(originalGravityFloat));
            finalGravityFloat = parseFloat(PlatoToSGFormula(finalGravityFloat));
        }
        return ((76.08 * (originalGravityFloat - finalGravityFloat) / (1.775 - originalGravityFloat)) * (finalGravityFloat / 0.794)).toFixed(2);
    };

    const apparentAttenuationFormula = () => {
        let originalGravityFloat = parseFloat(originalGravity);
        let finalGravityFloat = parseFloat(finalGravity);
        if (gravityUnit == 'Plato') {
            originalGravityFloat = parseFloat(PlatoToSGFormula(originalGravityFloat));
            finalGravityFloat = parseFloat(PlatoToSGFormula(finalGravityFloat));
        }
        return ((((originalGravityFloat - 1) * 1000) - ((finalGravityFloat - 1) * 1000)) / ((originalGravityFloat - 1) * 1000) * 100).toFixed(0)
    };

    const caloriesFormula = () => {
        let originalGravityFloat = parseFloat(originalGravity);
        let finalGravityFloat = parseFloat(finalGravity);
        let ABV = parseFloat(standardABVFormula()) / 100;
        if (gravityUnit == 'Plato') {
            originalGravityFloat = parseFloat(PlatoToSGFormula(originalGravityFloat));
            finalGravityFloat = parseFloat(PlatoToSGFormula(finalGravityFloat));
        }
        return ((6.9 * ABV/1.25 * 100 + 4 * (( 0.1808 * (668.72 * originalGravityFloat - 463.37 - 205.347 * originalGravityFloat * originalGravityFloat) + 0.8192*(668.72*finalGravityFloat - 463.37 - 205.347 * finalGravityFloat * finalGravityFloat)) - 0.1)) * 3.55 * finalGravityFloat).toFixed(1);

    };

    const SGToPlatoFormula = (sg) => {
        sg = parseFloat(sg);
        return ((-1 * 616.868) + (1111.14 * sg) - (630.272 * sg ** 2) + (135.997 * sg ** 3)).toFixed(2);
    };

    const PlatoToSGFormula = (plato) => {
        plato = parseFloat(plato);
        return (1 + ( plato / (258.6 - ( (plato/258.2) * 227.1)))).toFixed(3)
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (equation == 'standard') {
            setAlcoholByVolume(standardABVFormula().toString());
        } else if (equation == 'alternate') {
            setAlcoholByVolume(alternateABVFormula().toString());
        }
        setApparentAttenuation(apparentAttenuationFormula().toString());
        setCalories(caloriesFormula().toString());

        // Convert SG to Plato if needed and vise versa
        if(gravityUnit == 'SG') {
            setOriginalGravities([SGToPlatoFormula(originalGravity) + " °P", parseFloat(originalGravity).toFixed(3)].join(', '));
            setFinalGravities([SGToPlatoFormula(finalGravity) + " °P", parseFloat(finalGravity).toFixed(3)].join(', '));
        } else if (gravityUnit == 'Plato') {   
            setOriginalGravities([parseFloat(originalGravity).toFixed(3) + " °P", PlatoToSGFormula(originalGravity)].join(', '));
            setFinalGravities([parseFloat(finalGravity).toFixed(3) + " °P", PlatoToSGFormula(finalGravity)].join(', '));
        }
        Keyboard.dismiss();
    };

    return ( 
        <View key={key} style={globalStyles.backgroundColor}>
            <StatusBar style={theme.statusBarStyle} />
            <View style={globalStyles.bodyContainer}>
                <Text style={globalStyles.fieldLabel}>Starting Gravity (OG):</Text>
                <TextInput
                    value={originalGravity}
                    onChangeText={setOriginalGravity}
                    style={globalStyles.input}
                    keyboardType="numeric"
                />
                <Text style={globalStyles.fieldLabel}>Final Gravity (FG):</Text>
                <TextInput
                    value={finalGravity}
                    onChangeText={setFinalGravity}
                    style={globalStyles.input}
                    keyboardType="numeric"
                />
                <Text style={globalStyles.fieldLabel}>Gravity Unit:</Text>
                <Picker
                    selectedValue={gravityUnit}
                    onValueChange={(itemValue) => {
                        setGravityUnit(itemValue)
                        if (itemValue == 'SG') {
                            setOriginalGravity('1.050');
                            setFinalGravity('1.010');
                        } else if (itemValue == 'Plato') { 
                            setOriginalGravity('12.5');
                            setFinalGravity('2.5');
                        }
                    }}
                    style={globalStyles.pickerInput}
                    itemStyle={globalStyles.pickerItem}
                >
                    <Picker.Item label="SG" value="SG" />
                    <Picker.Item label="Plato" value="Plato" />
                </Picker>
                <Text style={globalStyles.fieldLabel}>Equation:</Text>
                <Picker
                    selectedValue={equation}
                    onValueChange={(itemValue) => setEquation(itemValue)}
                    style={globalStyles.pickerInput}
                    itemStyle={globalStyles.pickerItem}
                >
                    <Picker.Item label="Standard" value="standard" />
                    <Picker.Item label="Alternate" value="alternate" />
                </Picker>
                <Pressable
                    onPress={handleSubmit}
                    style={({ pressed }) => [
                        globalStyles.submitButtonStyle,
                        pressed && {opacity: 0.8}
                    ]}
                >
                    <Text style={globalStyles.buttonText}>Calculate</Text>
                </Pressable>
                <View style={globalStyles.fieldContainerRow}>
                    <Text style={globalStyles.label}>Alcohol By Volume:</Text>
                    <Text style={globalStyles.bodyText}>{alcoholByVolume}%</Text>
                </View>
                <View style={globalStyles.fieldContainerRow}>
                    <Text style={globalStyles.label}>Apparent Attenuation:</Text>
                    <Text style={globalStyles.bodyText}>{apparentAttenuation}%</Text>
                </View>
                <View style={globalStyles.fieldContainerRow}>
                    <Text style={globalStyles.label}>Calories:</Text>
                    <Text style={globalStyles.bodyText}>{calories} per 12oz bottle</Text>
                </View>
                <View style={globalStyles.fieldContainerRow}>
                    <Text style={globalStyles.label}>Original Gravity:</Text>
                    <Text style={globalStyles.bodyText}>{originalGravities}</Text>
                </View>
                <View style={globalStyles.fieldContainerRow}>
                    <Text style={globalStyles.label}>Final Gravity:</Text> 
                    <Text style={globalStyles.bodyText}>{finalGravities}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    datePickerContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
        alignContent: 'center',
        alignItems: 'center'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
});

export default ABVCalculator;