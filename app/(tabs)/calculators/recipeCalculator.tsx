import React, { useState, useEffect, useContext } from 'react';
import { Text, TextInput, View, Pressable, Animated, TouchableOpacity, Modal, SafeAreaView } from "react-native";
import { ScrollView, Swipeable } from 'react-native-gesture-handler';
import { getGlobalStyles } from '../../../styles/globalStyles';
import { SelectedThemeContext } from '../../../contexts/SelectedThemeContext';
import { StatusBar } from 'expo-status-bar';
import { TextSizeContext } from '../../../contexts/TextSizeContext';
import { Dropdown } from 'react-native-element-dropdown';
import { yeastsArray } from '../../../constants/yeasts';
import { ingredientsArray, ingredientsDictionary } from '../../../constants/ingredients';
import { massMetricsArray, massMetricsDictionary, volumeMetricsArray, volumeMetricsDictionary } from '../../../constants/metrics';
import { BrixToSG, SGToBrix } from '../../../utils/conversionUtils';
import { v4 as uuidv4 } from 'uuid';


const recipeCalculator = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);
    const [isFormValid, setIsFormValid] = useState(false); 
    const [errors, setErrors] = useState({}); 
    const [ingredients, setIngredients] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [addIngredientModalVisible, setAddIngredientModalVisible] = useState(false);
    const [measurementScale, setMeasurementScale] = useState("sg");
    const [batchMetric, setBatchMetric] = useState("gallons");
    const [batchSize, setBatchSize] = useState("1");
    const [validBatchSize, setValidBatchSize] = useState(true);
    const [yeastBrand, setYeastBrand] = useState("");
    const [yeast, setYeast] = useState("");
    const [recipeModalVisible, setRecipeModalVisible] = useState(false);
    const uniqueYeastBrands = yeastsArray.reduce((unique, item) => {
        return unique.some(uniqueItem => uniqueItem.brand === item.brand) ? unique : [...unique, item];
    }, []);
    const [filteredYeasts, setFilteredYeasts] = useState(yeastsArray.filter((yeast) => yeast.brand === yeastBrand));
    const [amountToAdd, setAmountToAdd] = useState("");
    const [metric, setMetric] = useState("kilograms");
    const [ingredientToAdd, setIngredientToAdd] = useState("Honey");
    const[selectedNutrients, setSelectedNutrients] = useState("fermaidO");
    const[numberAdditions, setNumberAdditions] = useState(1);
    const measurementScaleArray = [
        {label: "Specific Gravity", value: "sg"},
        {label: "Brix", value: "brix"}
    ]
    const nutrientsArray = [
        {label: "Fermaid O (TONSA)", value: "fermaidO"},
        {label: "Fermaid K", value: "fermaidK"},
        {label: "DAP", value: "DAP"},
        {label: "Fermaid O+K", value: "fermaidOK"},
        {label: "Fermaid O+DAP", value: "fermaidODAP"},
        {label: "Fermaid K+DAP", value: "fermaidKDAP"},
        {label: "Fermaid O+K+DAP", value: "fermaidOKDAP"},
    ]
    const numberOfAdditionsArray = [
        {label: "1", value: 1},
        {label: "2", value: 2},
        {label: "3", value: 3},
        {label: "4", value: 4},
    ]

    useEffect(() => { 
        validateForm(); 
    }, [batchMetric, batchSize, ingredients, ingredientToAdd, metric, amountToAdd]);

    useEffect(() => {
        setFilteredYeasts(yeastsArray.filter((yeast) => yeast.brand === yeastBrand));
    }, [yeastBrand]);

    const validateForm = () => { 
        let errors = {}; 
        if (!batchSize || isNaN(Number(batchSize))) {
            errors["batchSize"] = "You must enter a valid batch size.";
        }
        if (!ingredientToAdd) {
            errors["ingredientToAdd"] = "You must select an ingredient.";
        }
        if (!amountToAdd || isNaN(Number(amountToAdd))) {
            errors["amountToAdd"] = "You must enter a valid ingredient amount.";
        }
        // check if batch size is larger than total volume
        if (batchSize && calculateTotalVolume() > Number(batchSize)) {
            setValidBatchSize(false);
        } else {
            setValidBatchSize(true)
        }
        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0); 
    };

    const onAddIngredients = async () => {
        //check if form is valid before adding
        // add alert with error
        if (!isFormValid) {
            if (errors["batchSize"]) {
                alert(errors["batchSize"]);
            }   
            else if (errors["ingredientToAdd"]) {
                alert(errors["ingredientToAdd"]);
            }   
            else if (errors["amountToAdd"]) {
                alert(errors["amountToAdd"]);
            }
            return;
        }

        let ingredientsCopy = [...ingredients];
        let selectedIngredient = ingredientsDictionary[ingredientToAdd];
        let selectedMetric = massMetricsDictionary[metric];
        let ingredientID = uuidv4();

        selectedIngredient["id"] = ingredientID;
        selectedIngredient["metric"] = metric;
        selectedIngredient["conversion"] = selectedMetric.conversion;
        selectedIngredient["amount"] = amountToAdd;
        selectedIngredient["waterContent"] = selectedIngredient.volumeContribution;
        selectedIngredient["sugarPercentage"] = selectedIngredient.sugarPercentage;
        selectedIngredient["SG"] = BrixToSG(Number(selectedIngredient.sugarPercentage));
        ingredientsCopy.push(selectedIngredient);
        
        setIngredients(ingredientsCopy);
        setAddIngredientModalVisible(false);
        setIngredientToAdd("Honey");
        setMetric("kilograms");
        setAmountToAdd("");
    }

    const onDeleteIngredient = async (index) => {
        let ingredientsCopy = [...ingredients];
        ingredientsCopy.splice(index, 1);
        setIngredients(ingredientsCopy);
    }

    const renderIngredientRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragAnimatedValue: Animated.AnimatedInterpolation<number>, 
        index: number) => {
            const opacity = dragAnimatedValue.interpolate({
                inputRange: [-150, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
                });
                    
            return (
                <View style={globalStyles.swipedRow}>
                    <View style={globalStyles.swipedConfirmationContainer}>
                    <Text style={globalStyles.label}>Are you sure?</Text>
                    </View>
                    <Animated.View style={[globalStyles.deleteButton, {opacity}]}>
                    <TouchableOpacity 
                    onPress={() => {
                        onDeleteIngredient(index)
                    }}>
                        <Text style={globalStyles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    </Animated.View>
                </View>
            );
      };

    const getVolumeContribution = (ingredient) => {
        // formula - (amount added in kg *2.20462)/8.345/SG)
        // the key `conversion` in ingredient dict is the conversion from the added metric to the base metric (gram)
        // so to keep the math similar to the MeadTools calculator, we need to convert it to kg
        let conversionAmount = ingredient.conversion;
        let amountAdded = ingredient.amount;
        let sg = ingredient.SG;

        let totalAddedGrams = amountAdded * conversionAmount;
        let totalAddedKg = totalAddedGrams / 1000;

        // calculate result in gallons, then convert gallons to base metric liters
        let resultGallons = (totalAddedKg * 2.20462) / 8.345 / sg;
        let resultLiters = resultGallons * volumeMetricsDictionary["gallons"].conversion;

        // now we convert it to whatever the batch metric is
        let batchMetricResult = resultLiters / volumeMetricsDictionary[batchMetric].conversion;

        return batchMetricResult
    }

    const calculateWaterNeeded = () => {
        let totalVolume = 0;
        ingredients?.forEach((ingredient) => {
            totalVolume += getVolumeContribution(ingredient);
        });
        // now subtract the total volume from the batch size
        let waterNeeded = Number(batchSize) - totalVolume;
        if (waterNeeded < 0) {
            waterNeeded = 0;
        }
        return waterNeeded;
    }

    const calculateTotalVolume = () => {
        let totalVolume = 0;
        ingredients?.forEach((ingredient) => {
            totalVolume += getVolumeContribution(ingredient);
        });
        totalVolume += calculateWaterNeeded();
        return totalVolume;
    }

    const calculateOG = (batchIngredients) => {
        // https://help.grainfather.com/hc/en-us/articles/360014617198-Calculation-Original-Gravity-OG-Final-Gravity-FG-
        // Cane sugar sucrose, 1lb in 1 gal of water has a density of 1.046 PPG = 46
        const PPGSucrose = 46;
        let totalGravityUnits = 0;

        batchIngredients?.forEach((ingredient) => {
            // multipy PPGSucrose by %FGDB and use it in calcualation
            // we we have sugar percentage, use that in the calculation
            let ingredientPPG = PPGSucrose * (ingredient.sugarPercentage / 100);
            // calculate gravity units
            // pounds of ingredient * PPG of ingredient
            let ingredientAmountGrams = ingredient.amount * massMetricsDictionary[ingredient.metric].conversion;
            let ingredientAmountPounds = ingredientAmountGrams / massMetricsDictionary["pounds"].conversion;

            let ingredientGravityUnits = ingredientAmountPounds * ingredientPPG;
            totalGravityUnits += ingredientGravityUnits;
        })

        // now we have total gravity units, we divide this by the batch size in gallons to get the OG
        let batchSizeLiters = Number(batchSize) * volumeMetricsDictionary[batchMetric].conversion;
        let batchSizeGallons = batchSizeLiters / volumeMetricsDictionary["gallons"].conversion;

        let OGGravityUnits = totalGravityUnits / batchSizeGallons;
        let OG = 1 + (OGGravityUnits / 1000);

        return OG;
    }

    const calculateFG = (batchIngredients) => {
        // https://help.grainfather.com/hc/en-us/articles/360014617198-Calculation-Original-Gravity-OG-Final-Gravity-FG-
        // FG = OG - (OG -1) x Attenuation
        const attenuation = 0.75; // average yeast ateenuation
        let originalGravity = calculateOG(batchIngredients);
        let finalGravity = originalGravity - (originalGravity - 1) * attenuation;
        return finalGravity;
    }

    const calculateABV = () => {
        // https://www.homebrewersassociation.org/attachments/0000/2497/Math_in_Mash_SummerZym95.pdf
        // A%w = (76.08 * (OG - FG)) / (1.775 - OG)
        // A%v = A%w (FG / 0.794)

        let originalGravity = calculateOG(ingredients);
        let finalGravity = calculateFG(ingredients);
        let AlcoholByWeight = (76.08 * (originalGravity - finalGravity)) / (1.775 - originalGravity);
        let ABV = AlcoholByWeight * (finalGravity / 0.794);
        return ABV
    }
    
    const calculateDelleUnits = () => {
        // https://meadmaking.wiki/en/process/stabilization
        // https://winemakermag.com/wine-wizard/calculating-residual-sugar
        // Delle Units = 4.5 * ABV + RS
        // RS = grams per liter of remaining sugar, divided by 10
        // The issue is this value cannot be calculated, so we must use a value of 0 for now
        // which assumes all sugar is fermented out, of course this is dependent on the yeast used
        let ABV = calculateABV();
        let RS = 0;
        let delleUnits = 4.5 * ABV + RS;
        return delleUnits
    }

    const calculateRecipe = () => {
        if (!validBatchSize) {
            alert("Batch size must be larger than total volume.");
            return;
        }
        setRecipeModalVisible(true)
    }



    return ( 
            <ScrollView style={globalStyles.backgroundColor} automaticallyAdjustKeyboardInsets={true}>
                <StatusBar style={theme.statusBarStyle} />
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={addIngredientModalVisible}
                    onRequestClose={() => {setAddIngredientModalVisible(false);}}
                >
                    <SafeAreaView>
                        <ScrollView style={globalStyles.modalViewDefaultBar} automaticallyAdjustKeyboardInsets={true}>
                            <View style={globalStyles.containerRowSpaceBetween}>
                                <Text style={globalStyles.label}>Add Ingredient</Text>
                                <Pressable
                                    style={({ pressed }) => [
                                        globalStyles.inlineButtonStyle,
                                        pressed && {opacity: 0.8}
                                    ]}
                                    onPress={() => setAddIngredientModalVisible(false)}>
                                    <Text style={globalStyles.buttonText}>Close</Text>
                                </Pressable>
                            </View>
                            <Text style={globalStyles.label}>Ingredient:</Text>
                            <Dropdown
                                style={[globalStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={globalStyles.placeholderStyle}
                                selectedTextStyle={globalStyles.selectedTextStyle}
                                data={ingredientsArray}
                                value={ingredientToAdd}
                                search={true}
                                labelField="name"
                                valueField="name"
                                onChange={(item) => setIngredientToAdd(item.name)}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                            />
                            <Text style={[globalStyles.label, globalStyles.smallSpacing]}>Metric:</Text>
                            <Dropdown
                                style={[globalStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={globalStyles.placeholderStyle}
                                selectedTextStyle={globalStyles.selectedTextStyle}
                                data={massMetricsArray}
                                value={metric}
                                labelField="label"
                                valueField="value"
                                onChange={(item) => setMetric(item.value)}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                            />

                            <Text style={[globalStyles.label, globalStyles.smallSpacing]}>Amount:</Text>
                            <TextInput
                                value={amountToAdd}
                                onChangeText={setAmountToAdd}
                                style={globalStyles.input}
                                keyboardType="numeric"
                            />
                            <Pressable
                                style={({ pressed }) => [
                                    globalStyles.buttonStyle,
                                    pressed && {opacity: 0.8}
                                ]}
                                onPress={() => {
                                    onAddIngredients();
                                }}>
                                <Text style={globalStyles.buttonText}>Add Ingredient</Text>
                            </Pressable>
                        </ScrollView>
                    </SafeAreaView>

                </Modal>
                <View style={globalStyles.bodyContainer}>
                    <Text style={globalStyles.label}>Measurement Scale:</Text>
                    <Dropdown
                        style={[globalStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={globalStyles.placeholderStyle}
                        selectedTextStyle={globalStyles.selectedTextStyle}
                        data={measurementScaleArray}
                        value={measurementScale}
                        labelField="label"
                        valueField="value"
                        onChange={(item) => setMeasurementScale(item.value)}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                    />
                    <View style={globalStyles.smallSpacing}>
                        <Text style={globalStyles.label}>Batch Volume Metric:</Text>
                        <Dropdown
                            style={[globalStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={globalStyles.placeholderStyle}
                            selectedTextStyle={globalStyles.selectedTextStyle}
                            data={volumeMetricsArray}
                            value={batchMetric}
                            labelField="label"
                            valueField="value"
                            onChange={(item) => setBatchMetric(item.value)}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                        />
                    </View>
                    <Text style={[globalStyles.label, globalStyles.smallSpacing]}>Batch Size {volumeMetricsDictionary[batchMetric].label}:</Text>
                    <TextInput
                        value={batchSize}
                        onChangeText={setBatchSize}
                        // style conditional on batchSizeValid
                        style={[globalStyles.input, !validBatchSize && {borderColor: "red"}]}
                        keyboardType="numeric"
                    />
                    <View style={[globalStyles.smallSpacing]}>
                        <Text style={globalStyles.label}>Yeast Brand:</Text>
                        <Dropdown
                            style={[globalStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={globalStyles.placeholderStyle}
                            selectedTextStyle={globalStyles.selectedTextStyle}
                            data={uniqueYeastBrands}
                            value={yeastBrand}
                            labelField="brand"
                            valueField="brand"
                            search={true}
                            onChange={(item) => setYeastBrand(item.brand)}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                        />
                    </View>
                    <View style={[globalStyles.smallSpacing]}>
                        <Text style={globalStyles.label}>Yeast:</Text>
                        <Dropdown
                            style={[globalStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={globalStyles.placeholderStyle}
                            selectedTextStyle={globalStyles.selectedTextStyle}
                            data={filteredYeasts}
                            value={yeast}
                            labelField="yeast"
                            valueField="yeast"
                            search={true}
                            onChange={(item) => setYeast(item.yeast)}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                        />
                    </View>
                    <View style={globalStyles.smallSpacing}>
                        <Text style={globalStyles.label}>Nutrient(s):</Text>
                        <Dropdown
                            style={[globalStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={globalStyles.placeholderStyle}
                            selectedTextStyle={globalStyles.selectedTextStyle}
                            data={nutrientsArray}
                            value={selectedNutrients}
                            labelField="label"
                            valueField="value"
                            onChange={(item) => setSelectedNutrients(item.value)}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                        />
                    </View>
                    <View style={globalStyles.smallSpacing}>
                        <Text style={globalStyles.label}># of Additions:</Text>
                        <Dropdown
                            style={[globalStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={globalStyles.placeholderStyle}
                            selectedTextStyle={globalStyles.selectedTextStyle}
                            data={numberOfAdditionsArray}
                            value={numberAdditions}
                            labelField="label"
                            valueField="value"
                            onChange={(item) => setNumberAdditions(item.value)}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                        />
                    </View>
                    <View style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing]}>
                                <Text style={globalStyles.label}>Ingredients:</Text>
                                <Pressable
                                    onPress={() => setAddIngredientModalVisible(true)}>
                                    <Text style={globalStyles.linkText}>Add Ingredient</Text>
                                </Pressable>
                    </View>                    
                    {ingredients?.map((ingredient, index) =>
                    <Swipeable key={ingredient.id} renderRightActions={(progress, dragX) => renderIngredientRightActions(progress, dragX, index)}>
                        <View style={[globalStyles.smallSpacing, globalStyles.shaded]}>
                            <View style={globalStyles.containerRowSpaceBetween}>
                                <Text style={globalStyles.buttonLabel}>{ingredient.name}</Text>
                                <Text style={globalStyles.value}>{ingredient.amount} {massMetricsDictionary[ingredient.metric].label}</Text>
                            </View>
                            <View style={globalStyles.containerRowSpaceBetween}>
                                <Text style={globalStyles.buttonLabel}>Sugar Percentage:</Text>
                                <Text style={globalStyles.value}>{ingredient.sugarPercentage}</Text>
                            </View>
                            <View style={globalStyles.containerRowSpaceBetween}>
                                <Text style={globalStyles.buttonLabel}>Water Content:</Text>
                                <Text style={globalStyles.value}>{ingredient.waterContent}</Text>
                            </View>
                            <View style={globalStyles.containerRowSpaceBetween}>
                                <Text style={globalStyles.buttonLabel}>Volume (Minus Solids):</Text>
                                <Text style={globalStyles.value}>{getVolumeContribution(ingredient).toFixed(3)} {volumeMetricsDictionary[batchMetric].label}</Text>
                            </View>
                        </View>
                    </Swipeable>
                    )}
                    <View style={globalStyles.mediumSpacing}>
                        <Pressable
                            style={({ pressed }) => [
                                globalStyles.buttonStyle,
                                pressed && {opacity: 0.8}
                            ]}
                            onPress={() => calculateRecipe()}
                        >
                            <Text style={globalStyles.buttonText}>Calculate Recipe</Text>
                        </Pressable>
                    </View>   
                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={recipeModalVisible}
                        onRequestClose={() => {setRecipeModalVisible(false);}}
                    >
                        <SafeAreaView>
                            <ScrollView style={globalStyles.modalViewDefaultBar} automaticallyAdjustKeyboardInsets={true}>
                                <View style={globalStyles.containerRowSpaceBetween}>
                                    <Text style={globalStyles.label}>Recipe</Text>
                                    <Pressable
                                        style={({ pressed }) => [
                                            globalStyles.inlineButtonStyle,
                                            pressed && {opacity: 0.8}
                                        ]}
                                        onPress={() => setRecipeModalVisible(false)}>
                                        <Text style={globalStyles.buttonText}>Close</Text>
                                    </Pressable>
                                </View>
                                <View style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing]}>
                                    <Text style={globalStyles.label}>Water Needed:</Text>
                                    <Text style={globalStyles.label}>{calculateWaterNeeded().toFixed(2)} {volumeMetricsDictionary[batchMetric].label}</Text>
                                </View>
                                <View style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing]}>
                                    <Text style={globalStyles.label}>Total Volume:</Text>
                                    {ingredients.length > 0 && (<Text style={globalStyles.label}>{calculateTotalVolume().toFixed(2)} {volumeMetricsDictionary[batchMetric].label}</Text>)}
                                </View>
                                {measurementScale == "sg" ? (
                                    <View style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing]}>
                                        <Text style={globalStyles.label}>Estimated OG (SG):</Text>
                                        {ingredients.length > 0 && (<Text style={globalStyles.label}>{calculateOG(ingredients).toFixed(3)}</Text>)}
                                    </View>
                                ) : (
                                    <View style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing]}>
                                        <Text style={globalStyles.label}>Estimated OG (Brix):</Text>
                                        {ingredients.length > 0 && (<Text style={globalStyles.label}>{SGToBrix(calculateOG(ingredients)).toFixed(2)}</Text>)}
                                    </View>
                                )}
                                {measurementScale == "sg" ? (
                                    <View style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing]}>
                                        <Text style={globalStyles.label}>Estimated FG (SG):</Text>
                                        {ingredients.length > 0 && (<Text style={globalStyles.label}>{calculateFG(ingredients).toFixed(3)}</Text>)}
                                    </View>
                                ) : (
                                    <View style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing]}>
                                        <Text style={globalStyles.label}>Estimated FG (Brix):</Text>
                                        {ingredients.length > 0 && (<Text style={globalStyles.label}>{SGToBrix(calculateFG(ingredients)).toFixed(2)}</Text>)}
                                    </View>
                                )}
                                <View style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing]}>
                                    <Text style={globalStyles.label}>Estimated ABV:</Text>
                                    {ingredients.length > 0 && (<Text style={globalStyles.label}>{calculateABV().toFixed(2)}%</Text>)}
                                </View>
                                <View style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing]}>
                                    <Text style={globalStyles.label}>Preservative Index:</Text>
                                    {ingredients.length > 0 && (<Text style={globalStyles.label}>{Math.floor(calculateDelleUnits()).toFixed(0)} Delle Units</Text>)}
                                </View>
                            </ScrollView>
                        </SafeAreaView>
                    </Modal>
                </View>
            </ScrollView>
    );
};

export default recipeCalculator;