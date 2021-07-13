import {memoize} from 'lodash/fp'
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;


export const camelize: (s: string) => string = memoize((s: string): string => {
    return s
        .replace(/([^A-z0-9 _])/g, ' ')
        .replace(/^[A-z]/, p => p.toLowerCase())
        .replace(/[_\s]([a-z0-9])/g, (_, p1) => p1.toUpperCase())
        .replace(/\s/g, '')
})

export const toCol = (col: number): string => {
    let letter = '',
        temp;
    while (col > 0) {
        temp = (col - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = (col - temp - 1) / 26;
    }
    return letter;
}

export const getSingleColumn = (dataSheet: Sheet, col: string) => {
    return dataSheet
        .getRange(`${col}:${col}`)
        .getValues()
        .map(e => e[0])
        .filter(e => e)
}


export const getFirstEmptyRow = (dataSheet: Sheet): number => {
    const values = dataSheet.getRange("A:A").getValues()
    let count = 0
    while (values[count] && values[count][0] != "") {
        count+=1
    }
    return (count + 1);
}

export const requestTypeDecoder = (targetType: string): number => {
    switch (targetType) {
        case "Birthday Day":
            return 197160
        case "Compassionate":
            return 46000
        case "Holiday":
            return 46002
        case "Maternity / Paternity":
            return 46000
        case "Medical Appointment":
            return 159856
        case "Personal Appointment (Paid)":
            return 159856
        case "Personal Appointment (Unpaid)":
            return 159856
        case "Sick":
            return 46001
        case "TOIL":
            return 46000
        case "Training":
            return 197161
        case "Unpaid Leave":
            return 159206
        case "WFH due to sickness":
            return 46001
        default:
            throw new Error("Leave Type incorrect/not found")
    }
}