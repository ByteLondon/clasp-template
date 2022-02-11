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

import {BobHolidays, BobHolidaysFraction, isBobHolidaysArray, isBobHolidaysFraction} from "../types/BobHoliday";
import {getSheet} from "../helper/getSheet";


const getPeopleMap = (peopleSheet:Sheet): Map<string, Employee> => {

    const peopleDataRaw: Array<Array<string | number>> = peopleSheet.getRange(2, 1, getFirstEmptyRow(peopleSheet) - 2, 8).getValues()

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

    const holidaysIDSInSheetRaw : Array<Array<string>> = holidaysSheet.getRange(2, 1, getFirstEmptyRow(holidaysSheet) - 2, 12).getValues()
    const holidaysInSheetArray: Array<Holidays> = holidaysIDSInSheetRaw.map(([tableID, holidayType, employeeEmail, bobRequestId, bobPolicy, startDate, startPortion, endDate, endPortion, floatHolidaysStartID, floatHolidaysBodyID, floatHolidaysEndID]: Array<string | number>) => {
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
            floatHolidaysStartID: floatHolidaysStartID,
            floatHolidaysBodyID: floatHolidaysBodyID,
            floatHolidaysEndID: floatHolidaysEndID,


        }
        if (isHolidays(output)) {
            return output
        }
        throw new Error('invalid / corrupt Holiday object for Map')
    })

    return holidaysInSheetArray.reduce((acc: Map<number, Holidays>, curr: Holidays) => {
        acc.set(curr.bobRequestId, curr)
        return acc
    }, new Map())
}

const getAndFilterHolidayRequests = (holidaysInSheetMap: Map<number, Holidays>, holidaysFromBobs: Array<BobHolidays|BobHolidaysFraction>): Array<BobHolidays|BobHolidaysFraction> => {

    const filterHolidaysByTypeAndMap = (inMap :boolean, type: "Created" | "Deleted") => (holidaysFromBobs: BobHolidays|BobHolidaysFraction): boolean => {
        const typeMatch:boolean = holidaysFromBobs.changeType === type
        const mapMatchRaw:boolean = holidaysInSheetMap.get(holidaysFromBobs.requestId)?.holidayType === "Created"
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

const createHolidayObjectArr =(filteredHolidays:Array<BobHolidays|BobHolidaysFraction>, peopleMap: Map<string, Employee>, holidaysInSheetMap: Map<number, Holidays>):Array<HolidaysBeforeFloat> =>{

    return filteredHolidays.flatMap((change:BobHolidays|BobHolidaysFraction) =>{
        const floatID:string|undefined = peopleMap.get(change.employeeEmail)?.floatID
        let output
        if(floatID){
            if(isBobHolidaysFraction(change)){
                output = {
                    holidayType: change.changeType,
                    hours: change.hoursOnDate,
                    employeeEmail:change.employeeEmail,
                    bobPersonId: change.employeeId,
                    floatPersonId: floatID,
                    bobRequestId: change.requestId,
                    bobPolicy:change.policyTypeDisplayName,
                    floatPolicy: requestTypeDecoder(change.policyTypeDisplayName),
                    startDate: change.date,
                    startPortion:"morning",
                    endDate: change.date,
                    endPortion: "morning",
                    floatHolidaysStartID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.floatHolidaysStartID : undefined),
                    floatHolidaysBodyID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.floatHolidaysBodyID : undefined),
                    floatHolidaysEndID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.floatHolidaysEndID : undefined),
                    tableID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.tableID : undefined),
                }
            }
            else {
                output = {
                    holidayType: change.changeType,
                    hours: 0,
                    employeeEmail:change.employeeEmail,
                    bobPersonId: change.employeeId,
                    floatPersonId: floatID,
                    bobRequestId: change.requestId,
                    bobPolicy:change.policyTypeDisplayName,
                    floatPolicy: requestTypeDecoder(change.policyTypeDisplayName),
                    startDate: change.startDate,
                    startPortion:change.startPortion,
                    endDate: change.endDate,
                    endPortion: change.endPortion,
                    floatHolidaysStartID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.floatHolidaysStartID : undefined),
                    floatHolidaysBodyID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.floatHolidaysBodyID : undefined),
                    floatHolidaysEndID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.floatHolidaysEndID : undefined),
                    tableID: ( change.changeType === "Deleted"? holidaysInSheetMap.get(change.requestId)?.tableID : undefined),
                }
            }

            if (isHolidaysBeforeFloat(output)) {
                return output
            }
        }
            return []
    })
}

const addHolidayToGoogle = (holidayToUpdate: Holidays, holidaysSheet:Sheet )  => {

        const singeHoliday:Array<Array<number|string>> =  [[
            holidayToUpdate.tableID,
            holidayToUpdate.holidayType,
            holidayToUpdate.employeeEmail,
            holidayToUpdate.bobRequestId,
            holidayToUpdate.bobPolicy,
            holidayToUpdate.startDate,
            holidayToUpdate.startPortion,
            holidayToUpdate.endDate,
            holidayToUpdate.endPortion,
            holidayToUpdate.floatHolidaysStartID,
            holidayToUpdate.floatHolidaysBodyID,
            holidayToUpdate.floatHolidaysEndID,
        ]]

        holidaysSheet.getRange(holidayToUpdate.tableID+1,1,1,singeHoliday[0].length).setValues(singeHoliday)
}

const addToFloat = (changesToUpdate: Array<HolidaysBeforeFloat>, holidaysSheet:Sheet )  => {



    let lastRow = getFirstEmptyRow(holidaysSheet) - 1

    return changesToUpdate.map((holidays:HolidaysBeforeFloat) =>{
        Logger.log(holidays)

        const holidayIds =  holidays.holidayType === "Created"? floatHolidaySplitter(holidays) : floatHolidayDeleter(holidays)

        const output = {
            tableID: ( holidays.holidayType === "Deleted"? holidays.tableID : lastRow),
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

        if(output.holidayType === "Created"){
            lastRow += 1
        }

        if(!isHolidays(output)){
            throw new Error ("Failed to convert Float Update to GS format")
        }

        addHolidayToGoogle(output,holidaysSheet)
    })
}



const updateGoogleWithChanges = () =>  {
    const holidaySheet = getSheet("changes")
    const peopleSheet = getSheet("people")
    const peopleMap= getPeopleMap(peopleSheet)
    const holidayMap = getMapOfHolidaysInSheet(holidaySheet)
    const holidaysFromBobs = bobRequest("changes", "get",dateDaysAgo(3))
    const filteredHolidays = getAndFilterHolidayRequests(holidayMap,holidaysFromBobs)
    const holidaysToUpdate = createHolidayObjectArr(filteredHolidays,peopleMap,holidayMap)
    addToFloat(holidaysToUpdate,holidaySheet)

}

export default {
     createHolidayObjectArr,addToFloat, getPeopleMap, getMapOfHolidaysInSheet, getAndFilterHolidayRequests,updateGoogleWithChanges
}

