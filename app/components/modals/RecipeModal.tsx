import React, { useContext, useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { getGlobalStyles } from '../../styles/globalStyles';
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { updateMead } from '../../utils/storageUtils';
import { TextSizeContext } from '../../contexts/TextSizeContext';
import { Dropdown } from 'react-native-element-dropdown';

const RecipeModal = ({ meadDetails, setMeadDetails, recipeModalVisible, setRecipeModalVisible }) => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);
    const [recipe, setRecipe] = useState([]); 

    const [ingredientName, setIngredientName] = useState('');
    const [ingredientTypeMetric, setIngredientTypeMetric] = useState('');
    const [ingredientMetric, setIngredientMetric] = useState(''); 
    const [ingredientAmount, setIngredientAmount] = useState('');
    const [metricTypeIsFocus, setMetricTypeIsFocus] = useState(false);
    const [metricIsFocus, setMetricIsFocus] = useState(false);

    const [isFormValid, setIsFormValid] = useState(false); 
    const [errors, setErrors] = useState({}); 

    const typeMetric = [
        {label: 'Weight', value: 'weight'}, 
        {label: 'Volume', value: 'volume'}, 
        {label: 'Amount', value: 'amount'}, 
    ]

    const weightMetrics = [
        {label: 'Pound(s)', value: 'Pound(s)'}, 
        {label: 'Gram(s)', value: 'Gram(s)'}, 
        {label: 'Ounce(s)', value: 'Ounce(s)'}, 
    ]

    const volumeMetrics = [
        {label: 'Gallon(s)', value: 'Gallon(s)'}, 
        {label: 'Liter(s)', value: 'Liter(s)'}, 
        {label: 'Fluid Ounce(s)', value: 'Fluid Ounce(s)'}, 
        {label: 'Cups(s)', value: 'Cup(s)'},
        {label: 'Tablespoon(s)', value: 'Tablespoon(s)'},
        {label: 'Teaspoon(s)', value: 'Teaspoon(s)'},
    ]

    const amountMetrics = [
        {label: 'Unit(s)', value: 'Units(s)'}, 
    ]

    useEffect(() => {
        // set recipe
        if (meadDetails?.recipe) {
            setRecipe(meadDetails["recipe"]);
        }
    }, [meadDetails]);

    
    useEffect(() => {
        validateForm();
    }, [ingredientName, ingredientTypeMetric, ingredientMetric, ingredientAmount]);

    const validateForm = () => { 
        let errors = {}; 
        
        if (ingredientName.trim() === '') {
            errors["name"] = 'Please enter an ingredient name.'; 
        }
        if (ingredientTypeMetric.trim() === '') {
            errors["type"] = 'Please select a metric type.'; 
        }
        if (ingredientMetric.trim() === '') {
            errors["metric"] = 'Please select a metric.'; 
        }
        if (ingredientAmount.trim() === '') { 
            errors["value"] = 'Please enter an ingredient amount.'; 
        }
        
        // Set the errors and update form validity 
        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0); 
    };

    const getMetricPicker = () => {
        switch (ingredientTypeMetric) {
            case 'weight':
                return (
                    <View>
                        <Text style={globalStyles.fieldLabel}>Metric:</Text>
                        <Dropdown
                            style={[globalStyles.dropdown, metricIsFocus && { borderColor: 'blue' }]}
                            search={true}
                            placeholderStyle={globalStyles.placeholderStyle}
                            selectedTextStyle={globalStyles.selectedTextStyle}
                            data={weightMetrics}
                            value={ingredientMetric}
                            labelField="label"
                            valueField="value"
                            onChange={item => {
                                setIngredientMetric(item.value);
                            }}
                            onFocus={() => setMetricIsFocus(true)}
                            onBlur={() => setMetricIsFocus(false)}
                        />
                    </View>
                );
            case 'volume':
                return (
                    <View>
                        <Text style={globalStyles.fieldLabel}>Metric:</Text>
                        <Dropdown
                            style={[globalStyles.dropdown, metricIsFocus && { borderColor: 'blue' }]}
                            placeholderStyle={globalStyles.placeholderStyle}
                            selectedTextStyle={globalStyles.selectedTextStyle}
                            data={volumeMetrics}
                            value={ingredientMetric}
                            labelField="label"
                            valueField="value"
                            onChange={item => {
                                setIngredientMetric(item.value);
                            }}
                            onFocus={() => setMetricIsFocus(true)}
                            onBlur={() => setMetricIsFocus(false)}
                        />
                    </View>
                );
            case 'amount':
                return (
                    <View>
                        <Text style={globalStyles.fieldLabel}>Metric:</Text>
                        <Dropdown
                            style={[globalStyles.dropdown, metricIsFocus && { borderColor: 'blue' }]}
                            placeholderStyle={globalStyles.placeholderStyle}
                            selectedTextStyle={globalStyles.selectedTextStyle}
                            data={amountMetrics}
                            value={ingredientMetric}
                            labelField="label"
                            valueField="value"
                            onChange={item => {
                                setIngredientMetric(item.value);
                            }}
                            onFocus={() => setMetricIsFocus(true)}
                            onBlur={() => setMetricIsFocus(false)}
                        />
                    </View>
                );
            default:
                return <></>;
        }
    }

    const saveMetricType = (metricType: string) => {
        setIngredientTypeMetric(metricType);
    }

    const saveMetric = (metric: string) => {
        setIngredientMetric(metric);
    }

    const onRecipeAdd = async () => {
        // check form validity
        if (!isFormValid) { 
            if (errors["name"] !== undefined) {
                alert(errors["name"]);
            } else if (errors["type"] !== undefined) {
                alert(errors["type"]);
            } else if (errors["metric"] !== undefined) {
                alert(errors["metric"]);
            } else if (errors["value"] !== undefined) {
                alert(errors["value"]);
            }
            return;
        }

        // add event to meadDetails
        const recipeDetails = {
            "name": ingredientName,
            "metric": ingredientMetric,
            "amount": ingredientAmount
        };

        // update recipe
        const updatedRecipe = [...recipe, recipeDetails];
        setRecipe(updatedRecipe);

        //update meadDetails
        meadDetails["recipe"] = updatedRecipe;

        // update mead in storage
        await updateMead(meadDetails["id"], meadDetails);
        setMeadDetails(meadDetails);

        //reset inputs
        setIngredientName('');
        setIngredientMetric('grams');
        setIngredientAmount('');

        // close modal
        setRecipeModalVisible(false);
    }

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={recipeModalVisible}
            onRequestClose={() => {
                setRecipeModalVisible(false);
            }}>
                <SafeAreaView>
                    <ScrollView style={globalStyles.modalViewDefaultBar} automaticallyAdjustKeyboardInsets={true}>
                        <View style={globalStyles.containerRowSpaceBetween}>
                            <Text style={globalStyles.label}>Add Ingredient</Text>
                            <Pressable
                                style={globalStyles.inlineButtonStyle}
                                onPress={() => setRecipeModalVisible(!recipeModalVisible)}>
                                <Text style={globalStyles.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                        <Text style={globalStyles.fieldLabel}>Name:</Text>
                        <TextInput
                            value={ingredientName}
                            onChangeText={setIngredientName}
                            style={globalStyles.input}
                        />
                        <Text style={globalStyles.fieldLabel}>Metric Type:</Text>
                        <Dropdown
                            style={[globalStyles.dropdown, metricTypeIsFocus && { borderColor: 'blue' }]}
                            placeholderStyle={globalStyles.placeholderStyle}
                            selectedTextStyle={globalStyles.selectedTextStyle}
                            data={typeMetric}
                            value={ingredientTypeMetric}
                            labelField="label"
                            valueField="value"
                            onChange={item => {
                                setIngredientTypeMetric(item.value);
                            }}
                            onFocus={() => setMetricTypeIsFocus(true)}
                            onBlur={() => setMetricTypeIsFocus(false)}
                        />
                        {getMetricPicker()}
                        <Text style={globalStyles.fieldLabel}>Amount:</Text>
                        <TextInput
                            value={ingredientAmount}
                            onChangeText={setIngredientAmount}
                            style={globalStyles.input}
                            keyboardType="numeric"
                        />
                        <Pressable 
                        style={({ pressed }) => [
                            globalStyles.buttonStyle,
                            pressed && {opacity: 0.8}
                        ]}
                        onPress={onRecipeAdd}>
                            <Text style={globalStyles.buttonText}>Add Ingredient</Text>
                        </Pressable>
                    </ScrollView>
                </SafeAreaView>
        </Modal>
  );
};

export default RecipeModal;