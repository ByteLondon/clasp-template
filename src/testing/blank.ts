// import {getNumberOfDays} from "./util";
// import {ChangeID} from "../types/ChangeType";

//const peopleFloat = require("./floatPeople.json");



// const floatIDmap: Map<string, string> = peopleFloat.reduce((acc: Map<string, string>, curr: any) => {
//     acc.set(curr.email, curr.people_id)
//     return acc
// }, new Map())
//
// let result  = String(floatIDmap.get("ashley@bytelondon.com"))
//
// console.log(result)

//
// const parsed = peopleBob
//
// const alreadyIn = ["ashley@bytelondon.com","richard@bytelondon.com"]
//
// type Employee = {
//     firstName: string
//     lastName: string
//     startDate: string
//     location: string
//     email: string
//     bobID: string
// }
//
// const arrayOfEmployeesFromBob: Array<Employee> = parsed.employees.map((emp:any) => {
//     return {
//         "firstName": emp.firstName,
//         "lastName": emp.surname,
//         "startDate": emp.work.startDate,
//         "location": emp.work.site,
//         "email": emp.email,
//         "bobID": emp.id,
//     }
// })
//
// const alreadyInMap: Map<string, string> = alreadyIn.reduce((acc: Map<string, string>, curr: string) => {
//     acc.set(curr, curr)
//     return acc
// }, new Map())
//
// const checkIfEmailNotInMap = (employee: Employee): boolean => {
//     return !alreadyInMap.has(employee.email)
// }
//
// arrayOfEmployeesFromBob.filter(checkIfEmailNotInMap)
//
//
// const arrayOfEmployeesAsArray = arrayOfEmployeesFromBob.map((emp) => [emp.firstName, emp.lastName, emp.startDate, emp.location, emp.email, emp.bobID])
//
// // find last emptyRow and populate with employees
//
//
//
//
//
// import {Employee} from "../types/EmployeeType";
// import {Is, isArray, isNumber, isString, isUnion} from "../helper/guards";
//
// type Test = [number, string, number, number]
//
// function isSpecificArray<T, U, V, W>(isT: Is<T>, isU: Is<U>, isV: Is<V>, isW: Is<W>){
//     return (u: unknown): u is [T, U, V, W] => {
//         if(!Array.isArray(u)) return false
//         const len = u.length
//         if(len !== 4) return false
//         return isT(u[0]) && isU(u[1]) && isV(u[2]) && isW(u[3])
//     }
// }
//
// export const isTestNew: Is<Test> = isSpecificArray(isNumber, isString, isNumber, isNumber)
//
//
// //// option A Daisy Chaining
// const somefunctionA = (a)=> {
//      return a + 10
// }
//
// const anotherfunctionA = () => {
//     const b = 10
//     return somefunctionA(b)
// }
//
//
// //// option B Puzzle Pieces
//
// const somefunctionB = (a)=> {
//     return a + 10
// }
//
// const anotherfunctionB = () => {
//     return 10
// }
//
// const runnerB = ()=> {
//     const out = anotherfunctionB()
//     return somefunctionB(out)
// }





// import {isBobHolidays} from "../types/BobHoliday";
//
// const content : Array<any>= require("./bobHolidays.json").changes
//
// for (let i = 0; i < content.length; i++) {
//
//     const t  = content[i]
//
//     if (!isBobHolidays(t)) {
//         console.log(String(i))
//         console.log(t)
//         throw new Error("Float People Array Corrupt or Missing after Parsing")
//     }
//
// }
// //
// let endpoint = "PEOPEL"
// endpoint
// // console.log(endpoint)
// const bool = true
// const inmap = true
// const ans  =  bool ? true : !true;
//
// console.log(ans)



// const originalArray = [
//     ["FirstName","LastName","Born"],
//     ["Ale","Reinel","CO"],
//     ["Rich","Coates","UK"],
//     ["Joan","Arc","FR"]
// ]
//
// const func = <T extends string | number | symbol>(input: T[][]) => {
//     const firstRow = input.shift()
//     return input.flatMap((e, i, arr): Record<T, T>[] => {
//         return e.reduce((acc, curr, i): Record<T, T> => {
//             acc[firstRow[i]] = curr
//             return acc
//         }, {})
//     })
//
// let string = "2021-07-18T01:00:00.000+0100"
//
// console.log(result)

//
// const a = 245
// const b = a ? 999:0
//
// console.log(String(b))
