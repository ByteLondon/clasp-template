import {getFirstEmptyRow} from "../helper/util";
import {Employee, isEmployee, isEmployeeArray} from "../types/EmployeeType";
import {floatRequest} from "../webRequests/floatRequest";
import {getSheet} from "../helper/getSheet";
import {FloatPeople, FloatPeopleRaw} from "../types/FloatPeopleType"
import {isString} from "../helper/guards";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

const getAndFilterEmployeesNoFloatID = (peopleSheet:Sheet): Array<Employee> => {

    const peopleDataRaw = peopleSheet.getRange(2, 1, getFirstEmptyRow(peopleSheet) - 1, 8).getValues()

    const employeeArray: Array<Employee> = peopleDataRaw.flatMap(([tableID, firstName, lastName, startDate, location, email, bobID, floatID]: Array<string | number>) => {
        if (floatID==="") {
            const output = {
                tableID: tableID,
                firstName: firstName,
                lastName: lastName,
                startDate: startDate,
                location: location,
                email: email,
                bobID: bobID,
                floatID: floatID
            }
            if (isEmployee(output)) {
                return output
            }
            throw new Error('invalid / corrupt Employee object')
        }
        return []
    })

    return (employeeArray)
}

const getFloatPeopleIds = (): Map<string, string> => {
    const floatPeopleRaw: Array<FloatPeopleRaw> = floatRequest("people", "get")

    const floatPeopleFiltered: Array<FloatPeople> = floatPeopleRaw.flatMap((emp  ) => {
        if (isString(emp.email)) {
            return {
                email: emp.email,
                people_id: String(emp.people_id)
            }
        }
        return []
    })

    return floatPeopleFiltered.reduce((acc: Map<string, string>, curr: any) => {
        acc.set(curr.email, curr.people_id)
        return acc
    }, new Map());
}

const matchFloatToPeople = (employeesNoFloatID:Array<Employee>,floatIDMap: Map<string, string>): Array<Employee> => {

    const filteredEmployeesWithId =  employeesNoFloatID.flatMap((emp: Employee) => {
        const tempFloatID = floatIDMap.get(emp.email)
        if (tempFloatID) {
            emp.floatID = tempFloatID
            return emp
        }
        return []
    })

    if(!isEmployeeArray(filteredEmployeesWithId)){
        throw new Error("Float Employee Array Corrupt or Missing after Processing")
    }

    return filteredEmployeesWithId
}

const updateFloatIDs = () => {
    const peopleSheet: Sheet = getSheet("people")
    const filteredEmployees = getAndFilterEmployeesNoFloatID(peopleSheet)
    const floatIDMap = getFloatPeopleIds()
    const peopleToUpdate : Array<Employee> = matchFloatToPeople(filteredEmployees,floatIDMap)

    peopleToUpdate.forEach(function (emp) {
        const tempFloatID = [[emp.floatID]]
        peopleSheet.getRange(emp.tableID + 1, 8, 1, 1).setValues(tempFloatID)
    })

}


export default {
    FloatPeopleF: updateFloatIDs, getAndFilterEmployeesNoFloatID, getFloatPeopleIds, matchFloatToPeople
}

