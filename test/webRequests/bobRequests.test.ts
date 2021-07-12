import {expect} from 'chai'
import {bobRequest} from '../../src/webRequests/bobRequest'
import * as GasStubs from "../gasStubs";

describe('bobRequests', () => {
    describe('bobRequest', () => {

        it('returns array from Bob People', () => {
            GasStubs.UrlFetchApp.addResponses({
                'https://api.hibob.com/v1/people?showInactive=true': ({content: JSON.stringify(require("../../src/testing/bobPeople.json"))})
            })
            const func = bobRequest
            const endpoint = 'people'
            const method = "get"
            const {employees} = require("../../src/testing/bobPeople.json")
            const output = func(endpoint,method)
            expect(output).to.deep.equal(employees)
            GasStubs.UrlFetchApp.removeResponse('https://api.hibob.com/v1/people?showInactive=true')
        })

        it('shoud throw error when empty array', () => {
            GasStubs.UrlFetchApp.addResponses({
                'https://api.hibob.com/v1/people?showInactive=true': ({content: JSON.stringify({employees:[]})})
            })
            const func = bobRequest
            const endpoint = 'people'
            const method = "get"
            expect(() => func(endpoint,method)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.hibob.com/v1/people?showInactive=true')
        })

        it('shoud throw error when missing fields', () => {
            GasStubs.UrlFetchApp.addResponses({
                'https://api.hibob.com/v1/people?showInactive=true': ({content:JSON.stringify({employees:[{
                        id: "12121212",
                        firstName: "alejandro",
                        surname: "reinel",
                        email:"email@something.com",
                        displayName: "Alejandro Reinel"
                    }]})
            })})
            const func = bobRequest
            const endpoint = 'people'
            const method = "get"
            expect(() => func(endpoint,method)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.hibob.com/v1/people?showInactive=true')
        })

        it('shoud throw error when incorrect fields', () => {
            GasStubs.UrlFetchApp.addResponses({
                'https://api.hibob.com/v1/people?showInactive=true': ({content:JSON.stringify({employees:[{
                        id: 12121212,
                        firstName: "alejandro",
                        surname: "reinel",
                        email:"email@something.com",
                        displayName: "Alejandro Reinel",
                        work: {
                            title: "Dev",
                            site:  "London"
                        }
                    }]})
            })})
            const func = bobRequest
            const endpoint = 'people'
            const method = "get"
            expect(() => func(endpoint,method)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.hibob.com/v1/people?showInactive=true')
        })

    })
})


