import {bobRequest} from "./config";
import {UrlFetchApp} from 'google-apps-script'

const BobPeople = {
    getAllBobPeople:()=>{
        const response = UrlFetchApp.fetch("https://api.hibob.com/v1/people?showInactive=true", bobRequest).getContentText()
        const parsed = JSON.parse(response).employees
        Logger.log(parsed)
        return parsed
    }

    // fillAllBobPeople:(data)=>{
    //     // parsed data to sheets
    // },
    //
    // updateBobPeople:(data)=>{
    //     // Check for changes and or additions
    //         //If any changed update relevant fields
    //         //If any new additions add a row with relevant fields
    // }
}

export default BobPeople
