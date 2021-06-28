import {getFirstEmptyRow} from "./util";
import {EmployeeFromBob, isEmployeeFromBobArray} from "./EmployeeType";
import {peopleSheet} from "./peopleSheet";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {BobPeople} from "./BobPeopleType";
import {isString} from "./guards";
import {bobRequest} from "./bobChangeRequest";

const getAndCleanBobPeople = (dataSheet:Sheet):Array<Array<string|number>> => {


    const bobPeopleParsed =  bobRequest("people","get")

    const arrayOfEmployeesFromBob: Array<EmployeeFromBob> = bobPeopleParsed.map((emp: BobPeople) => {
        return {
            firstName: emp.firstName,
            lastName: emp.surname,
            startDate: emp.work.startDate,
            location: emp.work.site,
            email: emp.email,
            bobID: emp.id
        }
    })

    if(!isEmployeeFromBobArray(arrayOfEmployeesFromBob)){
        throw new Error ("Bob Employee Array Corrupt or Missing after Parsing")
    }

    return filterPeopleAlreadyInSheet(arrayOfEmployeesFromBob, dataSheet);
}

const filterPeopleAlreadyInSheet = (ArrEmp: Array<EmployeeFromBob>, dataSheet: Sheet): Array<Array<string|number>> => {

    let lastRow = getFirstEmptyRow(dataSheet) - 1

    const peopleAlreadyInRaw : Array<Array<string>> = dataSheet.getRange(1, 6, lastRow, 1).getValues()
    const peopleAlreadyIn :Array<string> = peopleAlreadyInRaw.map(([email]:Array<string>) => email)

    const alreadyInMap: Map<string, string> = peopleAlreadyIn.reduce((acc: Map<string, string>, curr: string) => {

        if(!isString(curr)){
            throw new Error ("Email Key missing or Corrupt")
        }
        acc.set(curr, curr)
        return acc
    }, new Map())

    const checkIfEmailNotInMap = (employee: EmployeeFromBob): boolean => {
        return !alreadyInMap.has(employee.email)
    }

    const filteredArrayOfEmployees = ArrEmp.filter(checkIfEmailNotInMap)

    return filteredArrayOfEmployees.map((emp: EmployeeFromBob) => {
        lastRow += 1
        return [
            lastRow,
            emp.firstName,
            emp.lastName,
            emp.startDate,
            emp.location,
            emp.email,
            emp.bobID
        ]
    })
}

const updateBobPeople = () => {
    const dataSheet:Sheet = peopleSheet()
    const cleanPeople:Array<Array<string|number>> = getAndCleanBobPeople(dataSheet)

    dataSheet.getRange(getFirstEmptyRow(dataSheet),1,cleanPeople.length,cleanPeople[0].length).setValues(cleanPeople)
}

export default BobPeople
