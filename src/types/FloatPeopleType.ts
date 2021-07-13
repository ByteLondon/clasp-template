import {Is, isArray, isNull, isNumber, isString, isStruct, isUnion} from "../helper/guards";

export type FloatPeopleRaw = {
    people_id: number,
    email: string | null
}


export const isFloatPeopleRaw: Is<FloatPeopleRaw> = isStruct({
    people_id: isNumber,
    email: isUnion(isString,isNull)
})

export const isFloatPeopleRawArray: Is<Array<FloatPeopleRaw>> = isArray(isFloatPeopleRaw)



export type FloatPeople = {
    people_id: string,
    email: string
}

export const isFloatPeople: Is<FloatPeople> = isStruct({
    people_id: isString,
    email: isString
})

export const isFloatPeopleArray: Is<Array<FloatPeople>> = isArray(isFloatPeople)



