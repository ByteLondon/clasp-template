import {Is, isArray, isNumber, isString, isStruct} from "../helper/guards";

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
    floatRequestStartID:number, // from Float
    floatRequestBodyID:number, // from Float
    floatRequestEndID:number, // from Float
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
    floatRequestStartID:isNumber, // from Float
    floatRequestBodyID:isNumber, // from Float
    floatRequestEndID:isNumber, // from Float
})

export const isHolidaysArray: Is<Array<Holidays>> = isArray(isHolidays)

export type HolidaysBeforeFloat = {
    holidayType: string, // from Bob
    employeeEmail:string, // from Bob
    bobID:string,
    floatID:string,
    bobRequestId:number, // from Bob
    bobPolicy:string, // from Bob
    floatPolicy:number, // from Process
    startDate:string, // from Bob
    startPortion:string, // from Bob
    endDate:string, // from Bob
    endPortion:string, // from Bob
    bobId: string, // from Employee
    floatId: string // from Employee
}

export const isHolidaysBeforeFloat: Is<HolidaysBeforeFloat> = isStruct({
    holidayType: isString, // from Bob
    employeeEmail:isString, // from Bob
    bobID:isString,
    floatID:isString,
    bobRequestId:isNumber, // from Bob
    bobPolicy:isString, // from Bob
    floatPolicy:isNumber, // from Process
    startDate:isString, // from Bob
    startPortion:isString, // from Bob
    endDate:isString, // from Bob
    endPortion:isString, // from Bob
    bobId: isString, // from Employee
    floatId: isString // from Employee
})

export const isHolidaysBeforeFloatArray: Is<Array<HolidaysBeforeFloat>> = isArray(isHolidaysBeforeFloat)

