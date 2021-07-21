import {Is, isArray, isNumber, isOptional, isString, isStruct} from "../helper/guards";

export type Holidays = {
    tableID: number,
    holidayType: string, // from Bob
    employeeEmail:string, // from Bob
    bobRequestId:number, // from Bob
    bobPolicy:string, // from Bob
    startDate:string, // from Bob
    startPortion:string, // from Bob
    endDate:string, // from Bob
    endPortion:string, // from Bob
    floatHolidaysStartID:number, // from Float
    floatHolidaysBodyID:number, // from Float
    floatHolidaysEndID:number, // from Float
}

export const isHolidays: Is<Holidays> = isStruct({
    tableID: isNumber,
    holidayType: isString, // from Bob
    employeeEmail:isString, // from Bob
    bobRequestId:isNumber, // from Bob
    bobPolicy:isString, // from Bob
    startDate:isString, // from Bob
    startPortion:isString, // from Bob
    endDate:isString, // from Bob
    endPortion:isString, // from Bob
    floatHolidaysStartID:isNumber, // from Float
    floatHolidaysBodyID:isNumber, // from Float
    floatHolidaysEndID:isNumber, // from Float
})

export const isHolidaysArray: Is<Array<Holidays>> = isArray(isHolidays)

export type HolidaysBeforeFloat = {
    holidayType: string, // from Bob
    employeeEmail:string, // from Bob
    bobPersonId:string,
    floatPersonId:string,
    bobRequestId:number, // from Bob
    bobPolicy:string, // from Bob
    floatPolicy:string, // from Process
    startDate:string, // from Bob
    startPortion:string, // from Bob
    endDate:string, // from Bob
    endPortion:string, // from Bob
    floatHolidaysStartID?:number, // from Float
    floatHolidaysBodyID?:number, // from Float
    floatHolidaysEndID?:number, // from Float
}

export const isHolidaysBeforeFloat: Is<HolidaysBeforeFloat> = isStruct({
    holidayType: isString, // from Bob
    employeeEmail:isString, // from Bob
    bobPersonId:isString,
    floatPersonId:isString,
    bobRequestId:isNumber, // from Bob
    bobPolicy:isString, // from Bob
    floatPolicy:isString, // from Process
    startDate:isString, // from Bob
    startPortion:isString, // from Bob
    endDate:isString, // from Bob
    endPortion:isString, // from Bob
    floatHolidaysStartID:isOptional(isNumber), // from Float
    floatHolidaysBodyID:isOptional(isNumber), // from Float
    floatHolidaysEndID: isOptional(isNumber), // from Float
})

export const isHolidaysBeforeFloatArray: Is<Array<HolidaysBeforeFloat>> = isArray(isHolidaysBeforeFloat)

