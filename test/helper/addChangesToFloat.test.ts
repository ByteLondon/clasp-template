import {expect} from 'chai';
import * as GasStubs from "../gasStubs";
import {floatChangeSplitter} from "../../src/helper/addChangesToFloat";
import {HolidaysBeforeFloat} from "../../src/types/HolidayType";

const content = JSON.stringify(require("../../src/testing/FloatHolidayFullDay.json"))

GasStubs.UrlFetchApp.addResponses({
    'https://api.float.com/v3/timeoffs': ({content: content, headers: {}})
})

const fakeHolidaysCreator =  (startPortion:string, endDate:string, endPortion:string,bobPolicy = "Sick",):HolidaysBeforeFloat => {
    return{holidayType: "Created",
    employeeEmail:"ale@reinel.com",
    bobID: "999999",
    floatID: "999999",
    bobRequestId: 99999,
    bobPolicy: bobPolicy,
    floatPolicy: 999999,
    startDate:"2020-01-01",
    startPortion:startPortion,
    endDate:endDate,
    endPortion: endPortion,
    bobId: "999999",
    floatId: "999999"}
}


describe('addChangesToFloat', () => {
    describe('floatChangeSplitter', () => {
        it('Should create only request in main body' ,() => {
            const input  = fakeHolidaysCreator("morning","2020-01-01","morning")
            const expected = {
                "bobID": 99999,
                "floatHolidaysBodyID": 6848981,
                "floatHolidaysEndID": 0,
                "floatHolidaysStartID": 0,
            }
            const func = floatChangeSplitter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should create a request in main body and end' ,() => {
            const input  = fakeHolidaysCreator("full_day","2020-01-02","morning")
            const expected = {
                "bobID": 99999,
                "floatHolidaysBodyID": 6848981,
                "floatHolidaysEndID": 6848981,
                "floatHolidaysStartID": 0,
            }
            const func = floatChangeSplitter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should create a request in main body and start' ,() => {
            const input  = fakeHolidaysCreator("afternoon","2020-01-02","full_day")
            const expected = {
                "bobID": 99999,
                "floatHolidaysBodyID": 6848981,
                "floatHolidaysEndID": 0,
                "floatHolidaysStartID": 6848981,
            }
            const func = floatChangeSplitter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should create a request in all fields' ,() => {
            const input  = fakeHolidaysCreator("afternoon","2020-01-05","morning")
            const expected = {
                "bobID": 99999,
                "floatHolidaysBodyID": 6848981,
                "floatHolidaysEndID": 6848981,
                "floatHolidaysStartID": 6848981,
            }
            const func = floatChangeSplitter
            expect(func(input)).to.deep.equal(expected)
        })

        it('Should throw an error if request id cannot be matched' ,() => {
            const input  = fakeHolidaysCreator("afternoon","2020-01-05","morning","Incorrect")
            const func = floatChangeSplitter
            expect(() => func(input)).to.throw
        })
    })
})