import Utilities = GoogleAppsScript.Utilities.Utilities
import * as moment from "moment"

global.Utilities  = {
    formatDate: (date: Date, _timeZone: string, format: string) :string => {
        let validFormat: string

        switch (format) {
            case 'yyyy-MM-dd':
                validFormat = 'YYYY-MM-DD'
                break
            case "yyyy-MM-dd'T'HH:mm:ss.SSSZ":
                validFormat = 'YYYY-MM-DDTHH:MM:SS.SSS+0100'
                break
            default:
                throw new Error ("Date formatting not compatible in Gas")

        }
        return moment(date).format(validFormat)
    }

} as unknown as Utilities

export default global.Utilities