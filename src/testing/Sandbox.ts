// //import {Is, isString, isNumber, isStruct} from './guards'
//
// type Employee = {
//     firstName: string
//     surName: string
//     email: string
//     daysPerWeek: number
// }
//
// /*const isEmployee: Is<Employee> = isStruct({
//     firstName: isString,
//     surName: isString,
//     email: isString,
//     daysPerWeek: isNumber
// })*/
//
// const arrayOfEmployeesFromBob: Array<Employee> = [
//     {firstName: 'Richard',
//     surName: 'Coates', daysPerWeek: 5, email: 'richard.coates@bytelondon.com'},
//     {firstName: 'Alejandro', surName: 'Reinel', email: 'ale@bytelondon.com', daysPerWeek: 5},
//     {firstName: 'Isabel',
//         surName: 'Perry', daysPerWeek: 5, email: 'isabel@bytelondon.com'},
// ]
//
// const arrayOfEmployeesFromFloat: Array<Employee> = [
//     {firstName: 'Isabel',
//     surName: 'Perry', daysPerWeek: 5, email: 'isabel@bytelondon.com'},
//     {firstName: 'Lauren', surName: 'Chester', email: 'lauren.chester@bytelondon.com', daysPerWeek: 5}
// ]
//
//
//
//
// const arrayOfEmployeesAsArray = arrayOfEmployeesFromBob.map((emp) => [emp.firstName, emp.surName, emp.email, emp.daysPerWeek])
//
// const returnEmail = ([_firstName, _surName, email, _daysPerWeek]: Array<string | number>) => email
//
// // console.log(arrayOfEmployeesAsArray.map(returnEmail))
// // console.log(employeeFromFloatMap)
//
// const checkIfEmailNotInMap = (employee: Employee): boolean => {
//     return employeeFromFloatMap.has(employee.email) ? false : true
// }
//
// console.log(arrayOfEmployeesFromBob.filter(checkIfEmailNotInMap))