import {requestOptions} from "./config";

const BobPeople = () => {
    function getChanges24H() {
        const response = UrlFetchApp.fetch("https://api.hibob.com/v1/people?showInactive=true", requestOptions).getContentText()
        const parsed = JSON.parse(response).employees
        console.log(parsed)
        return parsed
    }

    function populateTimeoff(data) {
        // Check for changes and or additions
            //If any changed update relevant fields
            //If any new additions add a row with relevant fields
        // any changes or additions get FALSE on Float column
    }

    function updateOnFloat(data) {
        // for any rows with FALSE on Float column
            //If New then post time off
            //If Deleted remove from Float
            //IF succesfull change TRUE on Float
    }




}

export default BobPeople
