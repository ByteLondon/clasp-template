import {Is, isArray, isLiteral, isNumber, isString, isStruct} from "../helper/guards";

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

export const isBobHolidaysArray: Is<Array<BobHolidays>> = isArray(isBobHolidays)