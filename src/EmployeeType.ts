import {Is, isArray, isNumber, isString, isStruct} from "./guards";

export type Employee = {
    tableID: number,
    firstName: string
    lastName: string
    startDate: string
    location: string
    email: string
    bobID: string
    floatID: string
}

export const isEmployee: Is<Employee> = isStruct({
    tableID: isNumber,
    firstName: isString,
    lastName: isString,
    startDate: isString,
    location: isString,
    email: isString,
    bobID: isString,
    floatID: isString,
})

export const isEmployeeArray: Is<Array<Employee>> = isArray(isEmployee)


export type EmployeeFromBob = Omit<Employee, "tableID" | "floatID">

export const isEmployeeFromBob: Is<EmployeeFromBob> = isStruct({
    firstName: isString,
    lastName: isString,
    startDate: isString,
    location: isString,
    email: isString,
    bobID: isString
})

export const isEmployeeFromBobArray: Is<Array<EmployeeFromBob>> = isArray(isEmployeeFromBob)

