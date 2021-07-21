import {Is, isArray, isLiteral, isNumber, isString, isStruct, isUnion} from "../helper/guards";

export type BobHolidays = {
    changeType: "Created" | "Deleted",
    employeeId:string,
    employeeDisplayName:string,
    employeeEmail:string,
    requestId:number,
    policyTypeDisplayName:string,
    type:string,
    startDate:string,
    startPortion:"all_day" | "afternoon" | "morning",
    endDate:string,
    endPortion:string,
}

export const isBobHolidays: Is<BobHolidays> = isStruct({
    changeType: isLiteral("Created" ,"Deleted"),
    employeeId: isString,
    employeeDisplayName:isString,
    employeeEmail:isString,
    requestId:isNumber,
    policyTypeDisplayName:isString,
    type:isString,
    startDate:isString,
    startPortion:isLiteral("all_day" , "afternoon","morning"),
    endDate:isString,
    endPortion:isString
})

export type BobHolidaysFraction = {
    changeType: "Created" | "Deleted",
    employeeId:string,
    employeeDisplayName:string,
    employeeEmail:string,
    requestId:number,
    policyTypeDisplayName:string,
    type:string,
    date:string,
    hoursOnDate:number,
}

export const isBobHolidaysFraction: Is<BobHolidaysFraction> = isStruct({
    changeType: isLiteral("Created" ,"Deleted"),
    employeeId: isString,
    employeeDisplayName:isString,
    employeeEmail:isString,
    requestId:isNumber,
    policyTypeDisplayName:isString,
    type:isString,
    date:isString,
    hoursOnDate:isNumber
})


export const isBobHolidaysArray: Is<Array<BobHolidays|BobHolidaysFraction>> = isArray(isUnion(isBobHolidays,isBobHolidaysFraction))