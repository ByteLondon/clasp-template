import {Is, isArray, isNumber,  isString, isStruct} from "../helper/guards";

export type HolidaysIDFromFloat = {
    bobHolidayID: number,
    floatHolidaysStartID: number,
    floatHolidaysBodyID: number,
    floatHolidaysEndID: number
}
export const isHolidaysIDFromFloat: Is<HolidaysIDFromFloat> = isStruct({
    bobHolidayID: isNumber,
    floatHolidaysStartID: isNumber, // from Float
    floatHolidaysBodyID: isNumber, // from Float
    floatHolidaysEndID: isNumber // from Float
})
export const isHolidaysIDFromFloatArray: Is<Array<HolidaysIDFromFloat>> = isArray(isHolidaysIDFromFloat)


export type FloatHolidays = {
    timeoff_id: number,
    timeoff_type_id: string,
    timeoff_type_name: string,
    start_date: string,
    end_date: string,
    start_time: string,
    hours: number,
    people_ids: Array<string>
}
export const isFloatHolidays: Is<FloatHolidays> = isStruct({
    timeoff_id: isNumber,
    timeoff_type_id: isString,
    timeoff_type_name: isString,
    start_date: isString,
    end_date: isString,
    start_time: isString,
    hours: isNumber,
    people_ids: isArray(isString)
})
export const isFloatHolidaysArray: Is<Array<FloatHolidays>> = isArray(isFloatHolidays)