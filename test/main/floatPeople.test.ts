import {expect} from 'chai'
import FloatPeopleU from '../../src/main/FloatPeople'
// import {EmployeeFromBob} from "../../src/types/EmployeeType"
import * as GasStubs from "../gasStubs";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;


const fakeSheet = {
    getRange: (_: string) => ({
        getValues: (): Array<Array<string|number>> => [
            [1,"Alejandro","Reinel","2021-01-01","London","email1@test.com","13546","212522"],
            [2,"Richard","Cotes","2020-01-01","London","email2@test.com","456456",""],
            [3,"Richard","Roche","2019-01-01","Berlin","email3@test.com","1345546",""]
        ]
    })
}

GasStubs.UrlFetchApp.addResponses({
    'https://api.hibob.com/v1/people?showInactive=true': {content: JSON.stringify(require("../../src/testing/bobPeople.json")),headers: {}},
    'https://api.hibob.com/v1/people?showInacdtive=true': {content: JSON.stringify(require("../../src/testing/bobPeople.json"))}
})


describe('floatPeople', () => {

    describe('getAndFilterEmployeesNoFloatID', () => {

        it('Should get an Array of EmployeesFromBob', () => {
            const func = FloatPeopleU.getAndFilterEmployeesNoFloatID
            expect(func(fakeSheet as unknown as Sheet)).to.exist
        })

    })
    //
    // describe('checkIfEmailNotInMap', () => {
    //
    //     const mapToCheck: Map<string, string> = new Map()
    //     mapToCheck.set('test@hello.com', 'test@hello.com')
    //     mapToCheck.set('test2@hello.com', 'test2@hello.com')
    //
    //     it('should detect email not in map', () => {
    //         const func = BobPeople.checkIfEmailNotInMap(mapToCheck)
    //         const fakeEmployee = {} as EmployeeFromBob
    //         expect(func(fakeEmployee)).to.equal(true)
    //     })
    //
    //     it('should detect email in in map', () => {
    //         const func = BobPeople.checkIfEmailNotInMap(mapToCheck)
    //         const fakeEmployee = {
    //             tableID: 1,
    //             firstName: "Ale",
    //             lastName: "Reinel",
    //             startDate: "2021/02/02",
    //             location: "London",
    //             email: 'test2@hello.com',
    //             bobID: "123456",
    //             floatID: "654321"
    //         } as EmployeeFromBob
    //         expect(func(fakeEmployee)).to.equal(false)
    //     })
    //
    //
    //     it('should return false when email is not string', () => {
    //         const func = BobPeople.checkIfEmailNotInMap(mapToCheck)
    //         const fakeEmployee = {
    //             tableID: 1,
    //             firstName: "Ale",
    //             lastName: "Reinel",
    //             startDate: "2021/02/02",
    //             location: "London",
    //             email: 12345,
    //             bobID: "123456",
    //             floatID: "654321"
    //         } as unknown as EmployeeFromBob
    //         expect(func(fakeEmployee)).to.equal(true)
    //     })
    //
    //     it('should error when mapToCheck is not a Map', () => {
    //         const func = BobPeople.checkIfEmailNotInMap([] as unknown as Map<string, string>)
    //         const fakeEmployee = {
    //             tableID: 1,
    //             firstName: "Ale",
    //             lastName: "Reinel",
    //             startDate: "2021/02/02",
    //             location: "London",
    //             email: 12345,
    //             bobID: "123456",
    //             floatID: "654321"
    //         } as unknown as EmployeeFromBob
    //         expect(() => func(fakeEmployee)).to.throw
    //     })
    //
    //
    //     it('should error when mapToCheck is not a Map', () => {
    //         const func = BobPeople.checkIfEmailNotInMap([] as unknown as Map<string, string>)
    //         const fakeEmployee = {
    //             tableID: 1,
    //             firstName: "Ale",
    //             lastName: "Reinel",
    //             startDate: "2021/02/02",
    //             location: "London",
    //             email: 12345,
    //             bobID: "123456",
    //             floatID: "654321"
    //         } as unknown as EmployeeFromBob
    //         expect(() => func(fakeEmployee)).to.throw
    //     })
    // })
    //
    // describe('filterPeopleAlreadyInSheet', () => {
    //     const arrayEmployees: Array<EmployeeFromBob> = [{
    //         firstName: "ale",
    //         lastName: "reinel",
    //         startDate: "2021-01-04",
    //         location: "london",
    //         email: "ale.reinel@something.com",
    //         bobID: "123456"
    //     },
    //         {
    //             firstName: "Richard",
    //             lastName: "Cotes",
    //             startDate: "2019-01-04",
    //             location: "london",
    //             email: "email1@test.com",
    //             bobID: "123456"
    //         }]
    //
    //
    //     it('should filter out one of the employees that matches the provided map', () => {
    //         const func = BobPeople.filterPeopleAlreadyInSheet
    //
    //         const expectedValue: Array<Array<string | number>> = [[
    //             4,
    //             "ale",
    //             "reinel",
    //             "2021-01-04",
    //             "london",
    //             "ale.reinel@something.com",
    //             "123456"
    //         ]]
    //
    //         expect(func(arrayEmployees, fakeSheet as unknown as Sheet)).to.deep.equal(expectedValue)
    //     })
    //
    //     it('should filter out none of the employees if no matches', () => {
    //         const func = BobPeople.filterPeopleAlreadyInSheet
    //
    //         arrayEmployees[1].email = "ricahrd@test.com"
    //
    //         const expectedValue: Array<Array<string | number>> = [[
    //             4,
    //             "ale",
    //             "reinel",
    //             "2021-01-04",
    //             "london",
    //             "ale.reinel@something.com",
    //             "123456"
    //         ],
    //             [
    //                 5,
    //                 "Richard",
    //                 "Cotes",
    //                 "2019-01-04",
    //                 "london",
    //                 "ricahrd@test.com",
    //                 "123456"
    //             ]]
    //
    //         expect(func(arrayEmployees, fakeSheet as unknown as Sheet)).to.deep.equal(expectedValue)
    //     })
    //
    //     it('should should throw error if all employees filtered out', () => {
    //         const func = BobPeople.filterPeopleAlreadyInSheet
    //
    //         arrayEmployees[0].email = "email1@test.com"
    //         arrayEmployees[1].email = "email2@test.com"
    //
    //         expect(() => func(arrayEmployees, fakeSheet as unknown as Sheet)).to.throw
    //     })
    // })

})


