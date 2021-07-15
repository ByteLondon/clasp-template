import {expect} from 'chai'
import holidayChanges from '../../src/main/holidayChanges'
import {Employee} from "../../src/types/EmployeeType"
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import * as GasStubs from "../gasStubs";
import {BobHolidays} from "../../src/types/BobHoliday";

//import * as Sinon from 'sinon'

const fakeSheet = {
    peopleCorrect: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string|number>> => [
                [1, "Alejandro", "Reinel", "2021-01-01", "London", "email1@test.com", "13546", "11111"],
                [2, "Richard", "Cotes", "2020-01-01", "London", "email2@test.com", "456456", "222222"],
                [3, "Richard", "Roche", "2019-01-01", "Berlin", "email3@test.com", "1345546", "33333"]
            ]
        })
    },
    peopleIncorrect: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string|number>> => [
                [1,11,"Reinel","2021-01-01","London","email1@test.com","13546","212522"],
                [2,"Richard",111,"2020-01-01","London","email2@test.com","456456",""],
                [3,"Richard","Roche",1111,"Berlin","email3@test.com","1345546",""]
            ]
        })
    },
    holidayCorrect: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string|number>> => [
                ["1111"],["2222"],["3333"]
            ]
        })
    },
    holidayIncorrect: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string|number>> => [
                [1212],[3232],["13321"],["13321"],["13321"],["13321"]
            ]
        })
    }
}

const fakeEmployees: Array<Employee> = [
    {tableID:1,firstName:"Alejandro",lastName:"Reinel",startDate:"2021-01-01",location:"London",email:"email1@test.com",bobID:"13546",floatID:"11111"},
    {tableID:2,firstName:"Richard",lastName:"Cotes",startDate:"2020-01-01",location:"London",email:"email2@test.com",bobID:"456456",floatID:"222222"},
    {tableID:3,firstName:"Richard",lastName:"Roche",startDate:"2019-01-01",location:"Berlin",email:"email3@test.com",bobID:"1345546",floatID:"33333"},
]

const contentBobHoliday = JSON.stringify(require("../../src/testing/bobHolidays.json"))
const contentFloatHoliday = JSON.stringify(require("../../src/testing/FloatHolidayFullDay.json"))

GasStubs.UrlFetchApp.addResponses({
    'https://api.float.com/v3/timeoffs': ({content: contentFloatHoliday, headers: {}}),
    'https://api.hibob.com/v1//timeoff/requests/changes?since=2021-07-01T12:30-02:00': ({content: contentBobHoliday, headers: {}})
})


describe('holidayChanges', () => {

    describe('getPeopleMap', () => {

        const mapToCheck: Map<string, Employee> = new Map()
        mapToCheck.set('email1@test.com', fakeEmployees[0])
        mapToCheck.set('email2@test.com', fakeEmployees[1])
        mapToCheck.set('email3@test.com', fakeEmployees[2])

        it('should create a map of Employees with a email as Key', () => {
            const func = holidayChanges.getPeopleMap
            expect(func(fakeSheet.peopleCorrect as unknown as Sheet)).to.deep.equal(mapToCheck)
        })

        it('should throw if employee is malformed ', () => {
            const func = holidayChanges.getPeopleMap
            expect(() => func(fakeSheet.peopleIncorrect as unknown as Sheet)).to.throw
        })

    })

    describe('getMapOfHolidaysInSheet', () => {

        const mapToCheck: Map<string, string> = new Map()
        mapToCheck.set('1111', '1111')
        mapToCheck.set('2222', '2222')
        mapToCheck.set('3333', '3333')

        it('should create a map of BobRequestIds', () => {
            const func = holidayChanges.getMapOfHolidaysInSheet
            expect(func(fakeSheet.holidayCorrect as unknown as Sheet)).to.deep.equal(mapToCheck)
        })

        it('should throw if employee is malformed ', () => {
            const func = holidayChanges.getPeopleMap
            expect(() => func(fakeSheet.holidayIncorrect as unknown as Sheet)).to.throw
        })

    })

    describe('getAndFilterHolidayRequests', () => {
        it('should remove three matches from Array', () => {
            const mapToCheck: Map<string, string> = new Map()
            mapToCheck.set('1111', '1111')
            mapToCheck.set('2222', '2222')
            mapToCheck.set('3333', '3333')

            const {changes} = require("../../src/testing/bobHolidays.json")
            const func = holidayChanges.getAndFilterHolidayRequests
            const output = func(mapToCheck,changes).length
            const expected = changes.length-3
            expect(output).to.equal(expected)
        })
        it('should not filter out any ', () => {
            const mapToCheck: Map<string, string> = new Map()
            mapToCheck.set('aaaa', '1111')
            mapToCheck.set('bbbb', '2222')
            mapToCheck.set('cccc', '3333')

            const {changes} = require("../../src/testing/bobHolidays.json")
            const func = holidayChanges.getAndFilterHolidayRequests
            const output = func(mapToCheck,changes).length
            const expected = changes.length
            expect(output).to.equal(expected)
        })
        it('should throw if no holidays to update', () => {
            const mapToCheck: Map<string, string> = new Map()
            mapToCheck.set('1111', '1111')

            const holidays:Array<BobHolidays> = [{
                changeType: 'Created',
                employeeId: '2355341697421935293',
                employeeDisplayName: 'Marie Schu',
                employeeEmail: 'marie.schu@byteberlin.com',
                requestId: 1111,
                policyTypeDisplayName: 'Freedom Day',
                startDate: '2021-06-25',
                startPortion: 'all_day',
                endDate: '2021-06-25',
                endPortion: 'all_day',
                type: 'days'
            }
        ]

            const func = holidayChanges.getAndFilterHolidayRequests
            expect(() => func(mapToCheck,holidays)).to.throw
        })

    })



})


