import {Is, isNumber, isOptional, isString, isStruct} from "../helper/guards";


export type FloatPayloadType = {
    timeoff_type_id: string,
    start_date: string,
    end_date: string,
    start_time?: string,
    hours: number,
    full_day: string,
    people_ids: string
}

export const isFloatPayload: Is<FloatPayloadType> = isStruct({
    timeoff_type_id: isString,
    start_date: isString,
    end_date: isString,
    start_time: isOptional(isString),
    hours: isNumber,
    full_day: isString,
    people_ids: isString
})
