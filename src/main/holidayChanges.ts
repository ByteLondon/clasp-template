import {getFirstEmptyRow, requestTypeDecoder} from "../helper/util";
import {Employee, isEmployee} from "../types/EmployeeType";
import {
    Holidays,
    HolidaysBeforeFloat,
    isHolidaysBeforeFloat
} from "../types/HolidayType";
import {bobRequest} from "../webRequests/bobRequest";
import {dateDaysAgo} from "../helper/time";
import {floatHolidayDeleter, floatHolidaySplitter} from "../helper/addChangesToFloat";
import {isHolidays} from "../types/HolidayType";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

import {BobHolidays,  isBobHolidaysArray} from "../types/BobHoliday";
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

const getMapOfHolidaysInSheet = (holidaysSheet:Sheet): Map<number, Holidays> => {

    const holidaysIDSInSheetRaw : Array<Array<string>> = holidaysSheet.getRange(1, 1, getFirstEmptyRow(holidaysSheet) - 1, 8).getValues()

    const holidaysInSheetArray: Array<Holidays> = holidaysIDSInSheetRaw.map(([tableID, holidayType, employeeEmail, bobRequestId, bobPolicy, startDate, startPortion, endDate, endPortion, floatRequestStartID, floatRequestBodyID, floatRequestEndID]: Array<string | number>) => {
        const output = {
            tableID: tableID,
            holidayType: holidayType,
            employeeEmail : employeeEmail,
            bobRequestId: bobRequestId,
            bobPolicy: bobPolicy,
            startDate: startDate,
            startPortion: startPortion,
            endDate: endDate,
            endPortion: endPortion,
            floatRequestStartID: floatRequestStartID,
            floatRequestBodyID: floatRequestBodyID,
            floatRequestEndID: floatRequestEndID,
        }
        if (isHolidays(output)) {
            return output
        }
        throw new Error('invalid / corrupt Employee object')
    })

    return holidaysInSheetArray.reduce((acc: Map<number, Holidays>, curr: Holidays) => {
        acc.set(curr.bobRequestId, curr)
        return acc
    }, new Map())
}

const getAndFilterHolidayRequests = (holidaysInSheetMap: Map<number, Holidays>, holidaysFromBobs: Array<BobHolidays>): Array<BobHolidays> => {

    const filterHolidaysByTypeAndMap = (inMap :boolean, type: "Created" | "Deleted") => (holidaysFromBobs: BobHolidays): boolean => {
        const typeMatch:boolean = holidaysFromBobs.changeType === type
        const mapMatchRaw:boolean = holidaysInSheetMap.has(holidaysFromBobs.requestId)
        const mapMatch:boolean  =  inMap ? mapMatchRaw : !mapMatchRaw
        return typeMatch && mapMatch
    }

    const filteredCreatedHolidays =  holidaysFromBobs.filter(filterHolidaysByTypeAndMap(false, 'Created'))
    const filteredDeletedHolidays =  holidaysFromBobs.filter(filterHolidaysByTypeAndMap(true, 'Deleted'))

    const holidaysToUpdate = filteredCreatedHolidays.concat(filteredDeletedHolidays)

    if(!isBobHolidaysArray(holidaysToUpdate)){
        throw new Error ("Error creating Bob Holiday Object")
    }

    if(holidaysToUpdate.length<1){
        throw new Error ("No new holidays to update")
    }

    return holidaysToUpdate
}

const createHolidayObjectArr =(filteredHolidays:Array<BobHolidays>, peopleMap: Map<string, Employee>, holidaysInSheetMap: Map<number, Holidays>):Array<HolidaysBeforeFloat> =>{

    return filteredHolidays.flatMap((change:BobHolidays) =>{
        const floatID:string|undefined = peopleMap.get(change.employeeId)?.floatID
        if(floatID){
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
                floatId: floatID,
                floatRequestStartID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.floatRequestStartID : undefined),
                floatRequestBodyID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.floatRequestBodyID : undefined),
                floatRequestEndID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.floatRequestEndID : undefined),
            }
            if (isHolidaysBeforeFloat(output)) {
                return output
            }
        }
            return []
    })
}

const addToFloat = (changesToUpdate: Array<HolidaysBeforeFloat>, holidaysSheet:Sheet ) : Array<Holidays> => {

    let lastRow = getFirstEmptyRow(holidaysSheet) - 1

    return changesToUpdate.map((holidays:HolidaysBeforeFloat) =>{

        const holidayIds =  holidays.holidayType === "Created"? floatHolidaySplitter(holidays) : floatHolidayDeleter(holidays)

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
    const holidaysToUpdate = createHolidayObjectArr(filteredHolidays,peopleMap,holidayMap)
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

