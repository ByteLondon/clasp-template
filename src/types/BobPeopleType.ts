import {Is, isArray, isString, isStruct} from "../helper/guards";

export type BobPeople = {
    id: string,
    firstName: string,
    surname: string,
    email: string,
    displayName: string,
    work: {
        title: string,
        site: string,
        startDate:string
    }
}


export const isBobPeople: Is<BobPeople> = isStruct({
    id: isString,
    firstName: isString,
    surname: isString,
    email: isString,
    displayName: isString,
    work: isStruct({
        title: isString,
        site: isString,
        startDate: isString
    })
})

export const isBobPeopleArray: Is<Array<BobPeople>> = isArray(isBobPeople)