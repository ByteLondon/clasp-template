import * as GasStubs from './gasStubs'
import { expect } from 'chai'
import bobPeople from '../src/bobPeople'
import * as Sinon from 'sinon'

GasStubs.UrlFetchApp.addResponses({
  'https://api.hibob.com/v1/people?showInactive=true': JSON.stringify({ employees: [] }),
})

describe('bobPeople', function () {
  describe('getBobPeople', function () {
    let sandbox: Sinon.SinonSandbox
    beforeEach(() => {
      sandbox = Sinon.createSandbox()
    })
    afterEach(() => {
      sandbox.restore()
    })

    it('shouldReturnPeople ', function () {
      const output = bobPeople.getAllBobPeople()
      expect(output).to.exist
    })
  })
})
