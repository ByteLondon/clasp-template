import * as GasStubs from './gasStubs'
import { expect } from 'chai'
import {bobRequest} from "../src/webRequests/bobRequest";



describe('bobPeople', function () {
  describe('getBobPeople', function () {

    it('shouldReturnPeople ', function () {
      const output = bobRequest()
      expect(output).to.exist
    })
  })
})
