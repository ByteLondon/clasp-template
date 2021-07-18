import {expect} from 'chai'
import holidayChanges from '../../src/main/holidayChanges'
import {Employee} from "../../src/types/EmployeeType"
import * as GasStubs from "../gasStubs";
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import {Holidays, HolidaysBeforeFloat} from "../../src/types/HolidayType";


const fakeSheet = {
    peopleCorrect: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string | number>> => [
                [1, "Alejandro", "Reinel", "2021-01-01", "London", "email1@test.com", "13546", "11111"],
                [2, "Richard", "Cotes", "2020-01-01", "London", "email2@test.com", "456456", "222222"],
                [3, "Richard", "Roche", "2019-01-01", "Berlin", "email3@test.com", "1345546", ""]
            ]
        })
    },
    peopleIncorrect: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string | number>> => [
                [1, 11, "Reinel", "2021-01-01", "London", "email1@test.com", "13546", "212522"],
                [2, "Richard", 111, "2020-01-01", "London", "email2@test.com", "456456", ""],
                [3, "Richard", "Roche", 1111, "Berlin", "email3@test.com", "1345546", ""]
            ]
        })
    },
    holidayCorrect: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string | number>> => [
                [1, 'Create', 'email1@test.com', 111, 'Sick', '2021-01-01', 'all_day', '2021-01-01', 'all_day', 1, 1, 11],
                [2, 'Create', 'email1@test.com', 222, 'Sick', '2021-01-01', 'all_day', '2021-01-02', 'all_day', 2, 2, 0],
                [3, 'Create', 'email2@test.com', 333, 'Sick', '2021-01-01', 'all_day', '2021-01-03', 'all_day', 0, 3, 33],
                [4, 'Create', 'email2@test.com', 444, 'Sick', '2021-01-01', 'all_day', '2021-01-04', 'all_day', 3, 0, 0],
                [5, 'Create', 'email3@test.com', 555, 'Sick', '2021-01-01', 'all_day', '2021-01-05', 'all_day', 0, 0, 55],
                [6, 'Delete', 'email3@test.com', 666, 'Sick', '2021-01-01', 'all_day', '2021-01-06', 'all_day', 0, 1111, 0],
            ]
        })
    },
    holidayIncorrect: {
        getRange: (_: string) => ({
            getValues: (): Array<Array<string | number>> => [
                [1, 2, 'email1@test.com', 111, 'Sick', '2021-01-01', 'all_day', '2021-01-01', 'all_day', 1, 1, 11],
                [2, 'Create', 5, 222, 'Sick', '2021-01-01', 'all_day', '2021-01-02', 'all_day', 2, 2, 0],
                [3, 'Create', 'email2@test.com', 333, 'Sick', '2021-01-01', 'all_day', '2021-01-03', 'all_day', 0, 3, 33],
                [4, 'Create', 'email2@test.com', 444, 5, '2021-01-01', 'all_day', '2021-01-04', 'all_day', 3, 0, 0],
                [5, 'Create', 'email3@test.com', 555, 'Sick', '2021-01-01', 'all_day', '2021-01-05', 'all_day', 0, 0, 55],
                [6, 'Delete', 'email3@test.com', 666, 'Sick', '2021-01-01', 'all_day', '2021-01-06', 'all_day', 0, 1111, 0],
            ]
        })
    }
}

const fakeEmployees: Array<Employee> = [
    {
        tableID: 1,
        firstName: "Alejandro",
        lastName: "Reinel",
        startDate: "2021-01-01",
        location: "London",
        email: "email1@test.com",
        bobID: "13546",
        floatID: "11111"
    },
    {
        tableID: 2,
        firstName: "Richard",
        lastName: "Cotes",
        startDate: "2020-01-01",
        location: "London",
        email: "email2@test.com",
        bobID: "456456",
        floatID: "222222"
    },
    {
        tableID: 3,
        firstName: "Richard",
        lastName: "Roche",
        startDate: "2019-01-01",
        location: "Berlin",
        email: "email3@test.com",
        bobID: "1345546",
        floatID: ""
    },
]

const fakeMapHolidaysForMap: Array<Holidays> = [
    {
        tableID: 1,
        holidayType: "Create",
        employeeEmail: "email1@test.com",
        bobRequestId: 111,
        bobPolicy: "Sick",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-01-01",
        endPortion: "all_day",
        floatRequestStartID: 1,
        floatRequestBodyID: 1,
        floatRequestEndID: 11
    },
    {
        tableID: 2,
        holidayType: "Create",
        employeeEmail: "email1@test.com",
        bobRequestId: 222,
        bobPolicy: "Sick",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-01-02",
        endPortion: "all_day",
        floatRequestStartID: 2,
        floatRequestBodyID: 2,
        floatRequestEndID: 0
    },
    {
        tableID: 3,
        holidayType: "Create",
        employeeEmail: "email2@test.com",
        bobRequestId: 333,
        bobPolicy: "Sick",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-01-03",
        endPortion: "all_day",
        floatRequestStartID: 0,
        floatRequestBodyID: 3,
        floatRequestEndID: 33
    },
    {
        tableID: 4,
        holidayType: "Create",
        employeeEmail: "email2@test.com",
        bobRequestId: 444,
        bobPolicy: "Sick",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-01-04",
        endPortion: "all_day",
        floatRequestStartID: 3,
        floatRequestBodyID: 0,
        floatRequestEndID: 0
    },
    {
        tableID: 5,
        holidayType: "Create",
        employeeEmail: "email3@test.com",
        bobRequestId: 555,
        bobPolicy: "Sick",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-01-05",
        endPortion: "all_day",
        floatRequestStartID: 0,
        floatRequestBodyID: 0,
        floatRequestEndID: 55
    },
    {
        tableID: 6,
        holidayType: "Delete",
        employeeEmail: "email3@test.com",
        bobRequestId: 666,
        bobPolicy: "Sick",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-01-06",
        endPortion: "all_day",
        floatRequestStartID: 0,
        floatRequestBodyID: 1111,
        floatRequestEndID: 0,
    }
]

const fakeMapHolidaysForFiltering: Array<Holidays> = [
    {
        tableID: 6,
        holidayType: "Created",
        employeeEmail: "CreatedInMap@bytelondon.com",
        bobRequestId: 1111,
        bobPolicy: "Holiday",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-07-26",
        endPortion: "all_day",
        floatRequestStartID: 0,
        floatRequestBodyID: 1111,
        floatRequestEndID: 0,
    },
    {
        tableID: 7,
        holidayType: "Created",
        employeeEmail: "CreatedNotInMap@bytelondon.com",
        bobRequestId: 2222,
        bobPolicy: "Holiday",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-07-26",
        endPortion: "all_day",
        floatRequestStartID: 0,
        floatRequestBodyID: 2222,
        floatRequestEndID: 0,
    },
    {
        tableID: 8,
        holidayType: "Created",
        employeeEmail: "DeltedNotInMap@bytelondon.com",
        bobRequestId: 3333,
        bobPolicy: "Holiday",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-07-26",
        endPortion: "all_day",
        floatRequestStartID: 0,
        floatRequestBodyID: 3333,
        floatRequestEndID: 0,
    },
    {
        tableID: 9,
        holidayType: "Created",
        employeeEmail: "DeletedInMap@bytelondon.com",
        bobRequestId: 4444,
        bobPolicy: "Holiday",
        startDate: "2021-01-01",
        startPortion: "all_day",
        endDate: "2021-07-26",
        endPortion: "all_day",
        floatRequestStartID: 0,
        floatRequestBodyID: 4444,
        floatRequestEndID: 0,
    }
]

const fakeFilteredEmployeesCheckAnswer: Array<HolidaysBeforeFloat> = [
    {
        "bobPersonId": "2403645128100020949",
        "bobPolicy": "Holiday",
        "bobRequestId": 1111,
        "employeeEmail": "email1@test.com",
        "endDate": "2021-07-26",
        "endPortion": "all_day",
        "floatPersonId": "11111",
        "floatPolicy": 46002,
        "floatRequestBodyID": undefined,
        "floatRequestEndID": undefined,
        "floatRequestStartID": undefined,
        "holidayType": "Created",
        "startDate": "2021-01-01",
        "startPortion": "all_day",
    },
    {
        "bobPersonId": "2240675962884718851",
        "bobPolicy": "Holiday",
        "bobRequestId": 2222,
        "employeeEmail": "email2@test.com",
        "endDate": "2021-01-01",
        "endPortion": "all_day",
        "floatPersonId": "222222",
        "floatPolicy": 46002,
        "floatRequestBodyID": 2222,
        "floatRequestEndID": 0,
        "floatRequestStartID": 0,
        "holidayType": "Deleted",
        "startDate": "2021-01-01",
        "startPortion": "all_day"
    }
]


const contentBobHoliday = JSON.stringify(require("../../src/testing/bobHolidays.json"))
const contentFloatHoliday = JSON.stringify(require("../../src/testing/FloatHolidayFullDay.json"))

GasStubs.UrlFetchApp.addResponses({
    'https://api.float.com/v3/timeoffs': ({content: contentFloatHoliday, headers: {}}),
    'https://api.hibob.com/v1//timeoff/requests/changes?since=2021-07-01T12:30-02:00': ({
        content: contentBobHoliday,
        headers: {}
    })
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

        const mapToCheck: Map<number, Holidays> = new Map()
        mapToCheck.set(111, fakeMapHolidaysForMap[0])
        mapToCheck.set(222, fakeMapHolidaysForMap[1])
        mapToCheck.set(333, fakeMapHolidaysForMap[2])
        mapToCheck.set(444, fakeMapHolidaysForMap[3])
        mapToCheck.set(555, fakeMapHolidaysForMap[4])
        mapToCheck.set(666, fakeMapHolidaysForMap[5])

        it('should create a map of BobRequestIds', () => {
            const func = holidayChanges.getMapOfHolidaysInSheet
            const out = func(fakeSheet.holidayCorrect as unknown as Sheet)
            expect(out).to.deep.equal(mapToCheck)
        })

        it('should throw if employee is malformed ', () => {
            const func = holidayChanges.getPeopleMap
            expect(() => func(fakeSheet.holidayIncorrect as unknown as Sheet)).to.throw
        })

    })

    describe('getAndFilterHolidayRequests', () => {
        it('should return an array with unmatched Created Request', () => {
            const mapToCheck: Map<number, Holidays> = new Map()
            mapToCheck.set(1111, fakeMapHolidaysForFiltering[0])

            const {changes} = require("../../src/testing/bobHolidaysFilterHolidasTesting.json")
            const func = holidayChanges.getAndFilterHolidayRequests
            const output = func(mapToCheck,changes)
           const expected = [fakeMapHolidaysForFiltering[1]]
            expect(output[0].requestId).to.deep.equal(expected[0].bobRequestId)
        })
        it('should return an array with Matched Delete Request', () => {
            const mapToCheck: Map<number, Holidays> = new Map()
            mapToCheck.set(1111, fakeMapHolidaysForFiltering[0])
            mapToCheck.set(3333, fakeMapHolidaysForFiltering[2])

            const {changes} = require("../../src/testing/bobHolidaysFilterHolidasTesting.json")
            const func = holidayChanges.getAndFilterHolidayRequests
            const output = func(mapToCheck,changes)
            const expected = [fakeMapHolidaysForFiltering[2]]
            expect(output[1].requestId).to.deep.equal(expected[0].bobRequestId)
        })
        it('should Throw an error when all are excluded', () => {
            const mapToCheck: Map<number, Holidays> = new Map()
            mapToCheck.set(1111, fakeMapHolidaysForFiltering[0])
            mapToCheck.set(2222, fakeMapHolidaysForFiltering[2])

            const {changes} = require("../../src/testing/bobHolidaysFilterHolidasTesting.json")
            const func = holidayChanges.getAndFilterHolidayRequests
            expect(() => func(mapToCheck,changes)).to.throw
        })
    })

    describe('createHolidayObjectArr', () => {
        it('should Filter Out Employee with no float ID ', () => {

            const holidayMapToCheck: Map<number, Holidays> = new Map()
            holidayMapToCheck.set(1111, fakeMapHolidaysForFiltering[0])
            holidayMapToCheck.set(2222, fakeMapHolidaysForFiltering[1])
            holidayMapToCheck.set(3333, fakeMapHolidaysForFiltering[2])

            const peopleMapToCheck: Map<string, Employee> = new Map()
            peopleMapToCheck.set('email1@test.com', fakeEmployees[0])
            peopleMapToCheck.set('email2@test.com', fakeEmployees[1])
            peopleMapToCheck.set('email3@test.com', fakeEmployees[2])

            const {changes} = require("../../src/testing/bobHolidaysFilterPeopleTesting.json")
            const func = holidayChanges.createHolidayObjectArr
            const output = func(changes, peopleMapToCheck,holidayMapToCheck)
            expect(output).to.deep.equal(fakeFilteredEmployeesCheckAnswer)
        })
    })


})