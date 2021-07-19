import {Is, isArray, isNumber, isString, isStruct} from "../helper/guards";

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
    start_date: string,
    end_date: string,
    people_ids: Array<string>
}

export const isFloatHolidays: Is<FloatHolidays> = isStruct({
    timeoff_id: isNumber,
    timeoff_type_id: isString,
    start_date: isString,
    end_date: isString,
    people_ids: isArray(isString)
})
export const isFloatHolidaysArray: Is<Array<FloatHolidays>> = isArray(isFloatHolidays)


