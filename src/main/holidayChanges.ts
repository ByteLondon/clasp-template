import {getFirstEmptyRow, requestTypeDecoder} from "../helper/util";
import {Employee, isEmployee} from "../types/EmployeeType";
import { isString} from "../helper/guards";
import {
    Holidays,
    HolidaysBeforeFloat,
    isHolidaysBeforeFloat
} from "../types/HolidayType";
import {bobRequest} from "../webRequests/bobRequest";
import {dateDaysAgo} from "../helper/time";
import {floatChangeSplitter} from "../helper/addChangesToFloat";
import {isHolidays} from "../types/HolidayType";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

import {BobHolidays} from "../types/BobHoliday";
import {getSheet} from "../helper/getSheet";

const getPeopleMap = (peopleSheet:Sheet): Map<string, Employee> => {

    const peopleDataRaw: Array<Array<string | number>> = peopleSheet.getRange(2, 1, getFirstEmptyRow(peopleSheet) - 1, 8).getValues()
    const employeeArray: Array<Employee> = peopleDataRaw.map(([tableID, firstName, lastName, startDate, location, email, bobID, floatID]: Array<string | number>) => {
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
    })



    return employeeArray.reduce((acc: Map<string, Employee>, emp:Employee) => {
        acc.set(emp.email, emp)
        return acc
    }, new Map());
}

const getMapOfHolidaysInSheet = (holidaysSheet:Sheet): Map<string,string> => {
    /// NEED TO CHECK THIS COL

    const holidaysIDSInSheetRaw : Array<Array<string>> = holidaysSheet.getRange(1, 3, getFirstEmptyRow(holidaysSheet) - 1, 1).getValues()

    const holidaysInSheetArray :Array<string> = holidaysIDSInSheetRaw.map(([id]:Array<string>) => id)

    return holidaysInSheetArray.reduce((acc: Map<string, string>, curr: string) => {
        if(!isString(curr)){
            throw new Error ("Id Key missing or Corrupt")
        }
        acc.set(curr, curr)
        return acc
    }, new Map())
}

const getAndFilterHolidayRequests = (holidaysInSheetMap: Map<string,string>, holidaysFromBobs: Array<BobHolidays>): Array<BobHolidays> => {

    const checkIfNotInMap = (holidaysFromBobs: BobHolidays): boolean => {
        return !holidaysInSheetMap.has(String(holidaysFromBobs.requestId))
    }

    const filteredHolidays =  holidaysFromBobs.filter(checkIfNotInMap)

    if(filteredHolidays.length<1){
        throw new Error ("No new holidays to update")
    }

    return filteredHolidays
}

const createHolidayObjectArr =(filteredHolidays:Array<BobHolidays>, peopleMap: Map<string, Employee>):Array<HolidaysBeforeFloat> =>{

    return filteredHolidays.map((change:BobHolidays) =>{
        const output = {
            holidayType: change.changeType,
            employeeEmail:change.employeeEmail,
            bobRequestId: change.requestId,
            bobPolicy:change.policyTypeDisplayName,
            floatPolicy: requestTypeDecoder(change.policyTypeDisplayName),
            startDate: change.startDate,
            startPortion:change.startPortion,
            endDate: change.endDate,
            endPortion: change.endPortion,
            fullDaysOnly: (change.startPortion === "all_day" && change.endPortion === "all_day") ,
            bobId: change.employeeId,
            floatId: peopleMap.get(change.employeeId)
        }
        if (isHolidaysBeforeFloat(output)) {
            return output
        } else{
            throw new Error("Error in processing Filtered Changes")
        }
    })
}

const addToFloat = (changesToUpdate: Array<HolidaysBeforeFloat>, holidaysSheet:Sheet ) : Array<Holidays> => {

    let lastRow = getFirstEmptyRow(holidaysSheet) - 1

    return changesToUpdate.map((holidays:HolidaysBeforeFloat) =>{

        const holidayIds =  floatChangeSplitter(holidays)

        const output = {
            tableID: lastRow,
            holidayType: holidays.holidayType ,
            employeeEmail:holidays.employeeEmail,
            bobRequestId:holidays.bobRequestId,
            bobPolicy:holidays.bobPolicy,
            startDate:holidays.startDate,
            startPortion:holidays.startPortion,
            endDate:holidays.endDate,
            endPortion:holidays.endPortion,
            floatHolidaysStartID:holidayIds.floatHolidaysStartID,
            floatHolidaysBodyID:holidayIds.floatHolidaysBodyID,
            floatHolidaysEndID:holidayIds.floatHolidaysEndID,
        }

        lastRow += 1

        if(isHolidays(output)){
            return output
        } else{
            throw new Error ("Failed to convert Float Update to GS format")
        }
    })
}

const updateGoogleWithChanges = () =>  {
    const holidaySheet = getSheet("changes")
    const peopleSheet = getSheet("people")
    const peopleMap= getPeopleMap(peopleSheet)
    const holidayMap = getMapOfHolidaysInSheet(holidaySheet)
    const holidaysFromBobs = bobRequest("changes", "get",dateDaysAgo(1))
    const filteredHolidays = getAndFilterHolidayRequests(holidayMap,holidaysFromBobs)
    const holidaysToUpdate  = createHolidayObjectArr(filteredHolidays,peopleMap)
    const addedToFloat = addToFloat(holidaysToUpdate,holidaySheet)

    const formattedHolidaysToAdd = addedToFloat.map((hols: Holidays) => {
        return [
            hols.tableID,
            hols.holidayType,
            hols.employeeEmail,
            hols.bobRequestId,
            hols.bobPolicy,
            hols.startDate,
            hols.endDate,
            hols.endPortion,
            hols.floatRequestStartID,
            hols.floatRequestBodyID,
            hols.floatRequestEndID,
        ]
    })

    holidaySheet.getRange(getFirstEmptyRow(holidaySheet),1,formattedHolidaysToAdd.length,formattedHolidaysToAdd[0].length).setValues(formattedHolidaysToAdd)
}

export default {
    holidayChanges: createHolidayObjectArr,addToFloat, getPeopleMap, getMapOfHolidaysInSheet, getAndFilterHolidayRequests,updateGoogleWithChanges
}

