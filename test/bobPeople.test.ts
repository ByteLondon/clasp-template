import {expect} from "chai"
import bobPeople from "../src/bobPeople"
import * as Sinon from "sinon"

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
        });
    });
});