import {Is, isArray, isLiteral, isNumber, isString, isStruct} from "../helper/guards";

export type BobHolidays = {
    holidayType: "created" | "deleted",
    employeeId:string,
    employeeDisplayName:string,
    employeeEmail:string,
    requestId:number,
    policyTypeDisplayName:string,
    type:string,
    startDate:string,
    startPortion:string,
    endDate:string,
    endPortion:string,
}


export const isBobHolidays: Is<BobHolidays> = isStruct({
    holidayType: isLiteral("created" ,"deleted"),
    employeeId: isString,
    employeeDisplayName:isString,
    employeeEmail:isString,
    requestId:isNumber,
    policyTypeDisplayName:isString,
    type:isString,
    startDate:isString,
    startPortion:isString,
    endDate:isString,
    endPortion:isString
})

export const isBobHolidaysArray: Is<Array<BobHolidays>> = isArray(isBobHolidays)