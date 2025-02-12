export function BrixToSG (brix: number) {
    let calculatedSG = 1 + (brix / (258.6-((brix / 258.2)*227.1)));
    return calculatedSG
}

export function SGToBrix (sg: number) {
    let calculatedBrix = (((182.4601 * sg -775.6821) * sg +1262.7794) * sg -669.5622);
    return calculatedBrix
}