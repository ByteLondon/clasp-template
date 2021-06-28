import {Is, isArray, isString, isStruct} from "./guards";

export type BobPeople = {
    id: string,
    firstName: string,
    surname: string,
    email: string,
    displayName: string,
    personal: {
        honorific: string,
        shortBirthDate: string,
        gender: string
    },
    about: {
        avatar: string
    },
    work: {
        title: string,
        department: string,
        site: string,
        startDate: string
    }
}



export const isBobPeople: Is<BobPeople> = isStruct({
    id: isString,
    firstName: isString,
    surname: isString,
    email: isString,
    displayName: isString,
    personal: isStruct({
        honorific: isString,
        shortBirthDate: isString,
        gender: isString
    }),
    about: isStruct({
        avatar: isString
    }),
    work: isStruct({
        title: isString,
        department: isString,
        site: isString,
        startDate: isString
    })
})

export const isBobPeopleArray: Is<Array<BobPeople>> = isArray(isBobPeople)