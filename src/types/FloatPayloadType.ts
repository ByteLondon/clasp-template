import {Is, isArray, isNumber, isOptional, isString, isStruct} from "../helper/guards";


export type FloatPayloadType = {
    timeoff_type_id: number,
    start_date: string,
    end_date: string,
    start_time?: string,
    hours: number,
    full_day: number,
    people_ids: Array<string>
}

export const isFloatPayload: Is<FloatPayloadType> = isStruct({
    timeoff_type_id: isNumber,
    start_date: isString,
    end_date: isString,
    start_time: isOptional(isString),
    hours: isNumber,
    full_day: isNumber,
    people_ids: isArray(isString)
})
