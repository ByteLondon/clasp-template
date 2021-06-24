import {requestOptions} from "./config";

const BobPeople = () => {
    function getAllFloatPeople():Array<string> {
        const response = UrlFetchApp.fetch("https://api.hibob.com/v1/people?showInactive=true", requestOptions).getContentText()
        const parsed = JSON.parse(response).employees
        console.log(parsed)
        return parsed
    }

    function getAllPeopleNoFloat(data:Array<T>):Array<T> {
        // parsed data to sheets
        return data
    }

    function updateFloatID(data) {
        // Check if email matches Bob DB
            //If Match update
    }
}

export default BobPeople
