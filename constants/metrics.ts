
// Imperial to Metric
// volume base - liters
// mass base - grams

export const volumeMetricsDictionary = {
    'gallons': {"conversion": 3.78541, "label": "Gallon(s)"},
    'liters': {"conversion": 1, "label": "Liter(s)"},
    'quarts': {"conversion": 0.946353, "label": "Quart(s)"},
    'pints': {"conversion": 0.473176, "label": "Pint(s)"},
    'cups': {"conversion": 0.236588, "label": "Cup(s)"},
    'fluidOunces': {"conversion": 0.0295735, "label": "Fluid Ounce(s)"},
    'tablespoons': {"conversion": 0.0147868, "label": "Tablespoon(s)"},
    'teaspoons': {"conversion": 0.00492892, "label": "Teaspoon(s)"}
};

export const volumeMetricsArray = [
    { label: 'Gallon(s)', value: 'gallons', conversion: 3.78541 },
    { label: 'Liter(s)', value: 'liters', conversion: 1 },
    { label: 'Quart(s)', value: 'quarts', conversion: 0.946353 },
    { label: 'Pint(s)', value: 'pints', conversion: 0.473176 },
    { label: 'Cup(s)', value: 'cups', conversion: 0.236588 },
    { label: 'Fluid Ounce(s)', value: 'fluidOunces', conversion: 0.0295735 },
    { label: 'Tablespoon(s)', value: 'tablespoons', conversion: 0.0147868 },
    { label: 'Teaspoon(s)', value: 'teaspoons', conversion: 0.00492892 },
];

export const massMetricsDictionary = {
    'kilograms': {"conversion": 1000, "label": "Kilogram(s)"},
    'pounds': {"conversion": 453.592, "label": "Pound(s)"},
    'ounces': {"conversion": 28.3495, "label": "Ounce(s)"},
    'grams': {"conversion": 1, "label": "Gram(s)"},
    'milligrams': {"conversion": 0.001, "label": "Milligram(s)"}
};

export const massMetricsArray = [
    { label: 'Kilogram(s)', value: 'kilograms', conversion: 1000 },
    { label: 'Pound(s)', value: 'pounds', conversion: 453.592 },
    { label: 'Ounce(s)', value: 'ounces', conversion: 28.3495 },
    { label: 'Gram(s)', value: 'grams', conversion: 1 },
    { label: 'Milligram(s)', value: 'milligrams', conversion: 0.001 },
];

