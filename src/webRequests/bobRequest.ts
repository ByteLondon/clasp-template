import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import {isBobPeopleArray} from "../types/BobPeopleType";
// import {isBobChangesArray} from "../types/ChangeType";

export const bobRequest = (endpoint: 'people' | 'changes', method: 'get' | 'post', date?: string) : Array<any> => {

    const bobURLRequest =(url: string, options: URLFetchRequestOptions) => {
        const bobRaw: string = UrlFetchApp.fetch(url, options).getContentText()
        return JSON.parse(bobRaw)
    }

    const bobHeaders = () => {
        return {
            accept: "application/json",
            authorization: "FoWQdfq4QoVRCMwiOv0qv26zdQ8a6AhVlwU4c1Wc"
        }
    }

    const bobRequest = (): URLFetchRequestOptions => ({
        method: method,
        headers: bobHeaders(),
        muteHttpExceptions: true
    })


    const urlBase: string = "https://api.hibob.com/v1/"
    let url: string
    let response: Array<any>

    switch (endpoint) {
        case "people":
            url = urlBase + "people?showInactive=true"
            response = bobURLRequest(url, bobRequest()).employees
            console.log(response[0])
            if (!isBobPeopleArray(response)) {
                throw new Error("Bob People request Failed or is Corrupted")
            }
            break
        case "changes":
            url = urlBase + "/timeoff/requests/changes" + "?since=" + date
            response = bobURLRequest(url, bobRequest()).changes
            // if (!isBobChangesArray(response)) {
            //     throw new Error("Bob Changes request Failed or is Corrupted")
            // }
            break
        default:
            throw new Error("Please input a correct endpoint")
    }

    return response
}
