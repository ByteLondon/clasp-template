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
        it('Should throw error when empty array people', () => {
            GasStubs.UrlFetchApp.addResponses({
                'https://api.hibob.com/v1/people?showInactive=true': ({content: JSON.stringify({employees:[]})})
            })
            const func = bobRequest
            const endpoint = 'people'
            const method = "get"
            expect(() => func(endpoint,method)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.hibob.com/v1/people?showInactive=true')
        })
        it('Should throw error when missing fields people', () => {
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
        it('Should throw error when incorrect fields people', () => {
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

        it('returns array from Bob Holidays', () => {
            GasStubs.UrlFetchApp.addResponses({
                'https://api.hibob.com/v1//timeoff/requests/changes?since=2021-07-01T12:30-02:00': ({content: JSON.stringify(require("../../src/testing/bobHolidays.json"))})
            })

            const func = bobRequest
            const endpoint = 'changes'
            const method = "get"
            const date = "2021-07-01T12:30-02:00"
            const {changes} = require("../../src/testing/bobHolidays.json")
            expect(func(endpoint,method,date)).to.deep.equal(changes)
            GasStubs.UrlFetchApp.removeResponse('https://api.hibob.com/v1//timeoff/requests/changes?since=2021-07-01T12:30-02:00')
        })
        it('Should throw error when empty array Holidays', () => {
            GasStubs.UrlFetchApp.addResponses({
                'https://api.hibob.com/v1//timeoff/requests/changes?since=2021-07-01T12:30-02:00': ({content: "{}"})
            })

            const func = bobRequest
            const endpoint = 'people'
            const method = "get"
            const date = "2021-07-01T12:30-02:00"
            expect(() => func(endpoint,method,date)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.hibob.com/v1//timeoff/requests/changes?since=2021-07-01T12:30-02:00')
        })
        it('Should throw error when missing fields Holidays', () => {
            GasStubs.UrlFetchApp.addResponses({
                'https://api.hibob.com/v1//timeoff/requests/changes?since=2021-07-01T12:30-02:00': ({content:JSON.stringify({employees:[{
                            changeType: "Deleted",
                            employeeId: "2240674456995365006",
                            employeeDisplayName: "Isabel Perry",
                        }]})
                })})
            const func = bobRequest
            const endpoint = 'people'
            const method = "get"
            expect(() => func(endpoint,method)).to.throw
            GasStubs.UrlFetchApp.removeResponse('https://api.hibob.com/v1/people?showInactive=true')
        })
        it('Should throw error when incorrect fields Holidays', () => {
            GasStubs.UrlFetchApp.addResponses({
                'https://api.hibob.com/v1/people?showInactive=true': ({content:JSON.stringify({employees:[{
                            "changeType": "Deleted",
                            "employeeId": 2240674456995365006,
                            "employeeDisplayName": "Isabel Perry",
                            "employeeEmail": "isabel@bytelondon.com",
                            "requestId": 4125836,
                            "policyTypeDisplayName": "Holiday",
                            "startDate": "2021-07-09",
                            "startPortion": "afternoon",
                            "endDate": "2021-07-12",
                            "endPortion": "morning",
                            "type": "days"
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


