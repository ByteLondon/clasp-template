import {bobRequest} from "./config";
import {getFirstEmptyRow} from "./util";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet
import {Employee} from "./EmployeeType";

const getPeopleSheet = (): Sheet => {
    const mainDocument = SpreadsheetApp.getActiveSpreadsheet()

    // Check if sheet exists, if not create it
    let peopleSheet = mainDocument.getSheetByName('People')
    if (!peopleSheet) {
        mainDocument.insertSheet('People')
        peopleSheet = mainDocument.getSheetByName('People')
        if (!peopleSheet) {
            throw new Error('Error Creating Sheet')
        }
        const colNames = []
        colNames.push([
            "First Name",
            "Last Name",
            "Start Date",
            "Location",
            "Email",
            "Bob ID"]
        )
        peopleSheet.getRange(1, 1, 1, colNames[0].length).setValues(colNames)
    }

    return peopleSheet
}

const filterPeopleAlreadyInSheet = (ArrEmp: Array<Employee>, dataSheet: Sheet): Array<any> => {

    const lastRow = getFirstEmptyRow(dataSheet) - 1

    const peopleAlreadyInRaw : Array<Array<string>> = dataSheet.getRange(1, 5, lastRow, 1).getValues()

    const peopleAlreadyIn :Array<string> = peopleAlreadyInRaw.map(([email]:Array<string>) => email)

    const alreadyInMap: Map<string, string> = peopleAlreadyIn.reduce((acc: Map<string, string>, curr: string) => {
        acc.set(curr, curr)
        return acc
    }, new Map())

    const checkIfEmailNotInMap = (employee: Employee): boolean => {
        return !alreadyInMap.has(employee.email)
    }

    return ArrEmp.filter(checkIfEmailNotInMap)
}

const getAndCleanBobPeople = (dataSheet:Sheet):Array<Array<string>> => {

    const bobPeopleRaw = UrlFetchApp.fetch("https://api.hibob.com/v1/people?showInactive=true", bobRequest).getContentText()
    const bobPeopleParsed = JSON.parse(bobPeopleRaw).employees

    const arrayOfEmployeesFromBob: Array<Employee> = bobPeopleParsed.employees.map((emp: any) => {
        return {
            "firstName": emp.firstName,
            "lastName": emp.surname,
            "startDate": emp.work.startDate,
            "location": emp.work.site,
            "email": emp.email,
            "bobID": emp.id,
        }
    })

    return filterPeopleAlreadyInSheet(arrayOfEmployeesFromBob, dataSheet);
}

const updateBobPeople = () => {
    const dataSheet:Sheet = getPeopleSheet()
    const cleanPeople:Array<Array<string>> = getAndCleanBobPeople(dataSheet)

    dataSheet.getRange(getFirstEmptyRow(dataSheet),1,cleanPeople.length,cleanPeople[0].length).setValues(cleanPeople)
}

export default BobPeople
