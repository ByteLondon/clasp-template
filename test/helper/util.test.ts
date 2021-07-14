import {expect} from 'chai'
import {getFirstEmptyRow} from "../../src/helper/util";
import {requestTypeDecoder} from "../../src/helper/util";



describe('utils', () => {
    describe('requestTypeDecoder', () => {
        it('should return correct Float ID', () => {
            const func = requestTypeDecoder
            const floatHolidayType = "Birthday Day"
            expect(func(floatHolidayType)).to.equal(197160)
        })

        it('should return Error if not found (Number) ', () => {
            const func = requestTypeDecoder
            const floatHolidayType = "not a valid request"
            expect(() => func(floatHolidayType)).to.throw
        })

        it('should return Error if not found (Number) ', () => {
            const func = requestTypeDecoder
            const floatHolidayType = 2131313 as unknown as string
            expect(() => func(floatHolidayType)).to.throw
        })
    })



    describe('getFirstEmptyRow', () => {
        it('Should Return 4 if 3 spaces are taken' ,() => {

            const dataSheet = {
                getRange: (_: string) => ({
                    getValues: (): string[][] => [["email1@test.com"],["email2test.com"],["email3@test.com"]]
                })
            }

            const func = getFirstEmptyRow
            expect(func(dataSheet as unknown as GoogleAppsScript.Spreadsheet.Sheet)).to.equal(4)
        })

        it('Should Return 1 if empty' ,() => {

            const dataSheet = {
                getRange: (_: string) => ({
                    getValues: (): string[][] => [[""],[""],[""]]
                })
            }

            const func = getFirstEmptyRow
            expect(func(dataSheet as unknown as GoogleAppsScript.Spreadsheet.Sheet)).to.equal(1)
        })
    })
})