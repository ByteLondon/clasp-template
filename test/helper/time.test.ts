import {expect} from 'chai'
import {dateCalculator, getNumberOfDays} from "../../src/helper/time";
import * as GasStubs from "../gasStubs";

GasStubs.UrlFetchApp.addResponses({
    'https://api.hibob.com/v1/people?showInactive=true': JSON.stringify({ employees: [] }),
})

describe('utils', () => {
    describe('getNumberOfDays', () => {
        it('Should return 2 ' ,() => {
            const func = getNumberOfDays
            const startDate = "2021-01-01"
            const endDate = "2021-01-03"
            expect(func(startDate,endDate)).to.equal(2)
        })

        it('Should return 0 ' ,() => {
            const func = getNumberOfDays
            const startDate = "2021-01-01"
            const endDate = "2021-01-01"
            expect(func(startDate,endDate)).to.equal(0)
        })

        it('Should return -3 ' ,() => {
            const func = getNumberOfDays
            const startDate = "2021-01-01"
            const endDate = "2020-12-29"
            expect(func(startDate,endDate)).to.equal(-3)
        })

        it('should return Error if date format incorrect ' ,() => {
            const func = getNumberOfDays
            const startDate = "2021-01-01"
            const endDate = 10 as unknown as string
            expect(() => func(startDate,endDate)).to.throw
        })

        // it('should return 2 days after entered date' ,() => {
        //     const func = requestTypeDecoder
        //     const floatHolidayType = "not a valid request"
        //     expect(() => func(floatHolidayType)).to.throw
        // })
        //
        // it('should return Error if not found (Number) ' ,() => {
        //     const func = requestTypeDecoder
        //     const floatHolidayType = 2131313 as unknown as string
        //     expect(() => func(floatHolidayType)).to.throw
        // })
    })

    describe('dateCalculator', () => {
        it('Should return 2021-01-01 Going Back', () => {
            const func = dateCalculator
            const date = "2021-01-03"
            const change = -2
            expect(func(date, change)).to.equal('2021-01-01')
        })

        it('Should return 2021-01-01 Going Forward', () => {
            const func = dateCalculator
            const date = "2021-01-03"
            const change = 2
            expect(func(date, change)).to.equal('2021-01-05')
        })

        it('Should return 2021-01-01 No change', () => {
            const func = dateCalculator
            const date = "2021-01-03"
            const change = 0
            expect(func(date, change)).to.equal('2021-01-03')
        })

        it('Should throw Error, wrong Format', () => {
            const func = dateCalculator
            const date = "2021-01-03124"
            const change = 0
            expect(func(date, change)).to.throw
        })


    })
})