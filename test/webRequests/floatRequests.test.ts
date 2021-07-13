import {expect} from 'chai'
import * as GasStubs from "../gasStubs";
import {floatPost, floatRequests} from "../../src/webRequests/floatRequests";
import {FloatPayloadType} from "../../src/types/FloatPayloadType";


const payloadExample: FloatPayloadType = {
    "timeoff_type_id": 1111111,
    "start_date": "2020-01-01",
    "end_date": "2020-01-10",
    "hours": 7,
    "full_day": 1,
    "people_ids": ["111111"]
}


describe('floatRequests', () => {
    describe('floatGet', () => {

        it('returns array of Employees Float', () => {

            const content = JSON.stringify(require("../../src/testing/floatPeople.json"))
            const headers  = {"X-Pagination-Page-Count": 1}

            GasStubs.UrlFetchApp.addResponses({
                'https://api.float.com/v3/people': ({content: content,headers: headers})
            })

            const func = floatRequests
            const endpoint = 'people'
            const method = "get"
            const expected = require("../../src/testing/floatPeople.json")
            const output = func(endpoint,method)
            expect(output).to.deep.equal(expected)
            GasStubs.UrlFetchApp.removeResponse('https://api.float.com/v3/people')
        })
        it('returns array of Employees Float when 3 pages', () => {

            const content = JSON.stringify(require("../../src/testing/floatPeopleSmall.json"))
            const headers  = {"X-Pagination-Page-Count": 3}

            GasStubs.UrlFetchApp.addResponses({
                'https://api.float.com/v3/people': ({content: content,headers: headers})
            })

            const func = floatRequests
            const endpoint = 'people'
            const method = "get"
            const expected = require("../../src/testing/floatPeopleSmall.json").length*3
            const output = func(endpoint,method).length
            expect(output).to.deep.equal(expected)
            GasStubs.UrlFetchApp.removeResponse('https://api.float.com/v3/people')
        })
        it('Should trow an error when incorrect headers ', () => {

            const content = JSON.stringify(require("../../src/testing/floatPeopleSmall.json"))
            const headers  = {"incorrect": 3}

            GasStubs.UrlFetchApp.addResponses({
                'https://api.float.com/v3/people': ({content: content,headers: headers})
            })

            const func = floatRequests
            const endpoint = 'people'
            const method = "get"
            expect(() => func(endpoint,method)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.float.com/v3/people')
        })
        it('Should trow an error when data is in incorrect format ', () => {

            const content = "[{name: 1231, email: 131313}]"
            const headers  = {"incorrect": 3}

            GasStubs.UrlFetchApp.addResponses({
                'https://api.float.com/v3/people': ({content: content,headers: headers})
            })

            const func = floatRequests
            const endpoint = 'people'
            const method = "get"
            expect(() => func(endpoint,method)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.float.com/v3/people')
        })
        it('Should trow an error when data is empty ', () => {

            const content = "[{}]"
            const headers  = {"X-Pagination-Page-Count": 3}

            GasStubs.UrlFetchApp.addResponses({
                'https://api.float.com/v3/people': ({content: content,headers: headers})
            })

            const func = floatRequests
            const endpoint = 'people'
            const method = "get"
            expect(() => func(endpoint,method)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.float.com/v3/people')
        })

    })
    describe('floatPost', () => {

        it('Uploads change and returns FloatChange object', () => {

            const content = JSON.stringify(require("../../src/testing/FloatHolidayFullDay.json"))

            GasStubs.UrlFetchApp.addResponses({
                'https://api.float.com/v3/timeoffs': ({content: content})
            })

            const func = floatPost
            const endpoint = 'timeoffs'
            const method = "post"
            const expected = require("../../src/testing/FloatHolidayFullDay.json")
            const output = func(endpoint,method,payloadExample)
            expect(output).to.deep.equal(expected)
            GasStubs.UrlFetchApp.removeResponse('https://api.float.com/v3/people')
        })

        it('Error in uploading changes', () => {

            const content = '{someErrorMessage: "Error!!"}'

            GasStubs.UrlFetchApp.addResponses({
                'https://api.float.com/v3/timeoffs': ({content: content})
            })

            const func = floatPost
            const endpoint = 'timeoffs'
            const method = "post"
            expect(() => func(endpoint,method,payloadExample)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.float.com/v3/people')
        })

    })
})


