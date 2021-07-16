import {getFirstEmptyRow} from "../helper/util";
import {EmployeeFromBob} from "../types/EmployeeType";
import {getSheet} from "../helper/getSheet";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {isString} from "../helper/guards";
import {bobRequest} from "../webRequests/bobRequest";
import {BobPeople} from "../types/BobPeopleType";

const getAndCleanBobPeople = (): Array<EmployeeFromBob> => {

    const bobPeopleParsed =  bobRequest("people","get")

    return bobPeopleParsed.map((emp:BobPeople) => {
        return {
            firstName: emp.firstName,
            lastName: emp.surname,
            startDate: emp.work.startDate,
            location: emp.work.site,
            email: emp.email,
            bobID: emp.id
        }
    })
}

const checkIfEmailNotInMap = (alreadyInMap: Map<string, string>) => (employee: EmployeeFromBob ): boolean => {
    return !alreadyInMap.has(employee.email)
}

const filterPeopleAlreadyInSheet = (ArrEmp: Array<EmployeeFromBob>, dataSheet: Sheet): Array<Array<string|number>> => {

    let lastRow: number = getFirstEmptyRow(dataSheet) - 1

    const peopleAlreadyInRaw = dataSheet.getRange(1, 6, lastRow, 1).getValues()

    const peopleAlreadyIn :Array<string> = peopleAlreadyInRaw.map(([email]:Array<string>) => email)


    const alreadyInMap: Map<string, string> = peopleAlreadyIn.reduce((acc: Map<string, string>, curr: string) => {

        if(!isString(curr)){
            throw new Error ("Email Key missing or Corrupt")
        }
        acc.set(curr, curr)
        return acc
    }, new Map())

    const filteredArrayOfEmployees = ArrEmp.filter(checkIfEmailNotInMap(alreadyInMap))

    if(filteredArrayOfEmployees.length<1){
        throw new Error ("No new Employees to update")
    }

    return filteredArrayOfEmployees.map((emp: EmployeeFromBob) => {
        lastRow += 1
        return [
            lastRow,
            emp.firstName,
            emp.lastName,
            emp.startDate,
            emp.location,
            emp.email.toLocaleLowerCase(),
            emp.bobID
        ]
    })
}

const updateBobPeople = () => {
    const dataSheet:Sheet = getSheet("people")
    const getPeople = getAndCleanBobPeople()
    const cleanPeople = filterPeopleAlreadyInSheet(getPeople,dataSheet)

    dataSheet.getRange(getFirstEmptyRow(dataSheet),1,cleanPeople.length,cleanPeople[0].length).setValues(cleanPeople)
}

export default {
    getSheet, filterPeopleAlreadyInSheet, getAndCleanBobPeople, updateBobPeople, checkIfEmailNotInMap
}
