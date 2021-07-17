import {expect} from 'chai';
import * as GasStubs from "../gasStubs";
import {floatHolidayDeleter, floatHolidaySplitter} from "../../src/helper/addChangesToFloat";
import {HolidaysBeforeFloat} from "../../src/types/HolidayType";

const content = JSON.stringify(require("../../src/testing/FloatHolidayFullDay.json"))
GasStubs.UrlFetchApp.addResponses({
    'https://api.float.com/v3/timeoffs': ({content: content, headers: {},response: 204}),
    'https://api.float.com/v3/timeoffs/8888': ({content: "{}",headers: {}, response: 204})
})

const fakeHolidaysCreator = (startPortion: string, endDate: string, endPortion: string, bobPolicy = "Sick",floatRequestStartID?: number|undefined,floatRequestBodyID?: number|undefined,floatRequestEndID?: number|undefined,): HolidaysBeforeFloat => {
    return {
        holidayType: "Created",
        employeeEmail: "ale@reinel.com",
        bobPersonId: "11111",
        floatPersonId: "999999",
        bobRequestId: 11111,
        bobPolicy: bobPolicy,
        floatPolicy: 999999,
        startDate: "2020-01-01",
        startPortion: startPortion,
        endDate: endDate,
        endPortion: endPortion,
        floatRequestStartID: floatRequestStartID,
        floatRequestBodyID: floatRequestBodyID,
        floatRequestEndID: floatRequestEndID
    }
}


describe('addChangesToFloat', () => {
    describe('floatChangeSplitter', () => {
        it('Should create only request in main body', () => {
            const input = fakeHolidaysCreator("morning", "2020-01-01", "morning")
            const expected = {
                "bobHolidayID": 11111,
                "floatHolidaysBodyID": 6848981,
                "floatHolidaysEndID": 0,
                "floatHolidaysStartID": 0
            }
            const func = floatHolidaySplitter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should create a request in main body and end', () => {
            const input = fakeHolidaysCreator("full_day", "2020-01-02", "morning")
            const expected = {
                "bobHolidayID": 11111,
                "floatHolidaysBodyID": 6848981,
                "floatHolidaysEndID": 6848981,
                "floatHolidaysStartID": 0,
            }
            const func = floatHolidaySplitter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should create a request in main body and start', () => {
            const input = fakeHolidaysCreator("afternoon", "2020-01-02", "full_day")
            const expected = {
                "bobHolidayID": 11111,
                "floatHolidaysBodyID": 6848981,
                "floatHolidaysEndID": 0,
                "floatHolidaysStartID": 6848981,
            }
            const func = floatHolidaySplitter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should create a request in all fields', () => {
            const input = fakeHolidaysCreator("afternoon", "2020-01-05", "morning")
            const expected = {
                "bobHolidayID": 11111,
                "floatHolidaysBodyID": 6848981,
                "floatHolidaysEndID": 6848981,
                "floatHolidaysStartID": 6848981,
            }
            const func = floatHolidaySplitter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should throw an error if request id cannot be matched', () => {
            const input = fakeHolidaysCreator("afternoon", "2020-01-05", "morning", "Incorrect")
            const func = floatHolidaySplitter
            expect(() => func(input)).to.throw
        })
    })
    describe('floatHolidayDeleter', () => {
        it('Should create only request in main body', () => {
            const input = fakeHolidaysCreator("morning", "2020-01-01", "morning","Sick",undefined,8888,undefined)
            const expected = {
                "bobHolidayID": 11111,
                "floatHolidaysBodyID": 9999,
                "floatHolidaysEndID": 0,
                "floatHolidaysStartID": 0,
            }
            const func = floatHolidayDeleter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should create a delete in main body and end', () => {
            const input = fakeHolidaysCreator("morning", "2020-01-01", "morning","Sick",undefined,8888,8888)
            const expected = {
                "bobHolidayID": 11111,
                "floatHolidaysBodyID": 9999,
                "floatHolidaysEndID": 9999,
                "floatHolidaysStartID": 0,
            }
            const func = floatHolidayDeleter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should create a delete in main body and start', () => {
            const input = fakeHolidaysCreator("morning", "2020-01-01", "morning","Sick",8888,8888,undefined)
            const expected = {
                "bobHolidayID": 11111,
                "floatHolidaysBodyID": 9999,
                "floatHolidaysEndID": 0,
                "floatHolidaysStartID": 9999,
            }
            const func = floatHolidayDeleter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should create a delete in all fields', () => {
            const input = fakeHolidaysCreator("morning", "2020-01-01", "morning","Sick",8888,8888,8888)
            const expected = {
                "bobHolidayID": 11111,
                "floatHolidaysBodyID": 9999,
                "floatHolidaysEndID": 9999,
                "floatHolidaysStartID": 9999,
            }
            const func = floatHolidayDeleter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should throw an error if request id cannot be matched', () => {
            const input = fakeHolidaysCreator("morning", "2020-01-01", "morning","Sick",undefined,2121,undefined)
            const func = floatHolidayDeleter
            expect(() => func(input)).to.throw
        })
    })
})