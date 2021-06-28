import {bobPeopleRequest} from "./config";
import {getFirstEmptyRow} from "./util";
import {Employee} from "./EmployeeType";
import {peopleSheet} from "./peopleSheet";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

const filterPeopleAlreadyInSheet = (ArrEmp: Array<Employee>, dataSheet: Sheet): Array<Array<string|number>> => {

    let lastRow = getFirstEmptyRow(dataSheet) - 1

    const peopleAlreadyInRaw : Array<Array<string>> = dataSheet.getRange(1, 6, lastRow, 1).getValues()

    const peopleAlreadyIn :Array<string> = peopleAlreadyInRaw.map(([email]:Array<string>) => email)

    const alreadyInMap: Map<string, string> = peopleAlreadyIn.reduce((acc: Map<string, string>, curr: string) => {
        acc.set(curr, curr)
        return acc
    }, new Map())

    const checkIfEmailNotInMap = (employee: Employee): boolean => {
        return !alreadyInMap.has(employee.email)
    }

    const filteredArrayOfEmployees = ArrEmp.filter(checkIfEmailNotInMap)

    return filteredArrayOfEmployees.map((emp: Employee) => {
        lastRow += 1
        return [
            lastRow,
            emp.firstName,
            emp.lastName,
            emp.startDate,
            emp.location,
            emp.email,
            emp.bobID,
            emp.floatID
        ]
    })
}

const getAndCleanBobPeople = (dataSheet:Sheet):Array<Array<string|number>> => {

    const bobPeopleRaw = UrlFetchApp.fetch("https://api.hibob.com/v1/people?showInactive=true", bobPeopleRequest).getContentText()
    const bobPeopleParsed = JSON.parse(bobPeopleRaw).employees

    const arrayOfEmployeesFromBob: Array<Employee> = bobPeopleParsed.employees.map((emp: any) => {
        return {
            tableID: null,
            firstName: emp.firstName,
            lastName: emp.surname,
            startDate: emp.work.startDate,
            location: emp.work.site,
            email: emp.email,
            bobID: emp.id,
            floatID: null
        }
    })

    return filterPeopleAlreadyInSheet(arrayOfEmployeesFromBob, dataSheet);
}

const updateBobPeople = () => {
    const dataSheet:Sheet = peopleSheet()
    const cleanPeople:Array<Array<string|number>> = getAndCleanBobPeople(dataSheet)

    dataSheet.getRange(getFirstEmptyRow(dataSheet),1,cleanPeople.length,cleanPeople[0].length).setValues(cleanPeople)
}

export default BobPeople
