import {expect} from 'chai'
import FloatPeople from '../../src/main/FloatPeople'
import * as GasStubs from "../gasStubs";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {Employee} from "../../src/types/EmployeeType";

const fakeSheet = {
    Correct: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string|number>> => [
                [1,"Alejandro","Reinel","2021-01-01","London","email1@test.com","13546","212522"],
                [2,"Richard","Cotes","2020-01-01","London","email2@test.com","456456",""],
                [3,"Richard","Roche","2019-01-01","Berlin","email3@test.com","1345546",""]
            ]
        })
    },
    AllEmpty: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string|number>> => [
                [1,"Alejandro","Reinel","2021-01-01","London","email1@test.com","13546",""],
                [2,"Richard","Cotes","2020-01-01","London","email2@test.com","456456",""],
                [3,"Richard","Roche","2019-01-01","Berlin","email3@test.com","1345546",""]
            ]
        })
    },
    Incorrect: {
        getRange: (_: number,__: number,___: number,____: number) => ({
            getValues: (): Array<Array<string|number>> => [
                [1,11,"Reinel","2021-01-01","London","email1@test.com","13546","212522"],
                [2,"Richard",111,"2020-01-01","London","email2@test.com","456456",""],
                [3,"Richard","Roche",1111,"Berlin","email3@test.com","1345546",""]
            ]
        })
    }
}


const content = JSON.stringify(require("../../src/testing/floatPeopleSmall.json"))
const headers  = {"x-pagination-page-count": "1"}

GasStubs.UrlFetchApp.addResponses({
    'https://api.float.com/v3/people?per-page=200&page=1': {content: content ,headers: headers}
})


describe('floatPeople', () => {
    describe('getAndFilterEmployeesNoFloatID', () => {
        it('Should get an Array of EmployeesFromBob with one value filtered', () => {

            const func = FloatPeople.getAndFilterEmployeesNoFloatID
            const expectedV: Array<Employee> = [
                {tableID:2,firstName:"Richard",lastName:"Cotes",startDate:"2020-01-01",location:"London",email:"email2@test.com",bobID:"456456",floatID:""},
                {tableID:3,firstName:"Richard",lastName:"Roche",startDate:"2019-01-01",location:"Berlin",email:"email3@test.com",bobID:"1345546",floatID:""}
            ]
            expect(func(fakeSheet.Correct as unknown as Sheet)).to.deep.equal(expectedV)
        })
        it('Should get not filter out any employees', () => {
            const func = FloatPeople.getAndFilterEmployeesNoFloatID
            const expectedV: Array<Employee> = [
                {tableID:1,firstName:"Alejandro",lastName:"Reinel",startDate:"2021-01-01",location:"London",email:"email1@test.com",bobID:"13546",floatID:""},
                {tableID:2,firstName:"Richard",lastName:"Cotes",startDate:"2020-01-01",location:"London",email:"email2@test.com",bobID:"456456",floatID:""},
                {tableID:3,firstName:"Richard",lastName:"Roche",startDate:"2019-01-01",location:"Berlin",email:"email3@test.com",bobID:"1345546",floatID:""}
            ]
            expect(func(fakeSheet.AllEmpty as unknown as Sheet)).to.deep.equal(expectedV)
        })
        it('Throw an error when data is not correct type', () => {
            const func = FloatPeople.getAndFilterEmployeesNoFloatID
            expect(() => func(fakeSheet.Incorrect as unknown as Sheet)).to.throw
        })
    })
    describe('getFloatPeopleIds', () => {
        it('Should get an Map of Employees with Email ', () => {

            const expectedV: Map<string, string> = new Map()
            expectedV.set('email2@test.com', "404512")
            expectedV.set('email1@test.com', "404513")

            const func = FloatPeople.getFloatPeopleIds
            expect(func()).to.deep.equal(expectedV)
        })
    })
    describe('matchFloatToPeople', () => {
        it('Should Match two of the employees and return an array with them  ', () => {

            const employees : Array<Employee> = [
                {tableID:1,firstName:"Alejandro",lastName:"Reinel",startDate:"2021-01-01",location:"London",email:"email1@test.com",bobID:"13546",floatID:""},
                {tableID:2,firstName:"Richard",lastName:"Cotes",startDate:"2020-01-01",location:"London",email:"email2@test.com",bobID:"456456",floatID:""},
                {tableID:3,firstName:"Richard",lastName:"Roche",startDate:"2019-01-01",location:"Berlin",email:"email3@test.com",bobID:"1345546",floatID:""}
            ]

            const floatMap: Map<string, string> = new Map()
            floatMap.set('email2@test.com', "404512")
            floatMap.set('email1@test.com', "404513")

            const expectedV : Array<Employee> = [
                {tableID:1,firstName:"Alejandro",lastName:"Reinel",startDate:"2021-01-01",location:"London",email:"email1@test.com",bobID:"13546",floatID:"404513"},
                {tableID:2,firstName:"Richard",lastName:"Cotes",startDate:"2020-01-01",location:"London",email:"email2@test.com",bobID:"456456",floatID:"404512"}
            ]

            const func = FloatPeople.matchFloatToPeople
            expect(func(employees,floatMap)).to.deep.equal(expectedV)
        })
        it('Should Match none of the employees and throw an error  ', () => {

            const employees : Array<Employee> = [
                {tableID:1,firstName:"Alejandro",lastName:"Reinel",startDate:"2021-01-01",location:"London",email:"email11@test.com",bobID:"13546",floatID:""},
                {tableID:2,firstName:"Richard",lastName:"Cotes",startDate:"2020-01-01",location:"London",email:"email21@test.com",bobID:"456456",floatID:""},
                {tableID:3,firstName:"Richard",lastName:"Roche",startDate:"2019-01-01",location:"Berlin",email:"email31@test.com",bobID:"1345546",floatID:""}
            ]

            const floatMap: Map<string, string> = new Map()
            floatMap.set('email2@test.com', "404512")
            floatMap.set('email1@test.com', "404513")

            const func = FloatPeople.matchFloatToPeople
            expect(() => func(employees,floatMap)).to.throw
        })
    })
})


