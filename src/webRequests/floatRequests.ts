import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import {FloatPayloadType} from "../types/FloatPayloadType";
import {isFloatHeaders} from "../types/FloatHeadersType";
import {isFloatPeopleRawArray} from "../types/FloatPeopleType";
import {FloatHolidays, isFloatHolidays} from "../types/FloatHolidaysType";

export const floatGet = (endpoint:'people', method: 'get')=> {

    const floatHeaders = () => { return {
        accept: "application/json",
        authorization: "Bearer 1483dea8f827bdfaT+0li76ao6d4yRD0apWNGdHtkGv4K2Mu9oT+BeAxCtg="
    }}

     const floatRequestOptions = (): URLFetchRequestOptions => ({
        method: method,
        headers: floatHeaders(),
        muteHttpExceptions: true
    })

    let url = "https://api.float.com/v3/" + endpoint + "?per-page=200&page="

    const floatResponse = UrlFetchApp.fetch(url+1, floatRequestOptions())

    const requestHeaders = floatResponse.getHeaders()

    if(!isFloatHeaders(requestHeaders)){
        throw new Error('Error in Float Headders')
    }

    const totalPages:number = + requestHeaders["x-pagination-page-count"]

    const rawResponse: Array<any> = JSON.parse(floatResponse.getContentText())

    if(totalPages>1){
        for (let i = 2; i <= totalPages; i++) {
            const floatResponse = UrlFetchApp.fetch(url+i, floatRequestOptions())
            rawResponse.push(...JSON.parse(floatResponse.getContentText()))
        }
    }

    if (endpoint === "people" &&!isFloatPeopleRawArray(rawResponse)) {
        throw new Error("Float People Array Corrupt or Missing after Parsing")
    }

    return rawResponse
}

export const floatPost = (endpoint:'timeoffs', method: 'post' , payloadData:FloatPayloadType) :FloatHolidays=> {

    const floatHeaders = () => {
        return {
            accept: "application/json",
            authorization: "Bearer 1483dea8f827bdfaT+0li76ao6d4yRD0apWNGdHtkGv4K2Mu9oT+BeAxCtg="
        }
    }

    const floatRequestOptions = (): URLFetchRequestOptions => ({
        method: method,
        headers: floatHeaders(),
        muteHttpExceptions: true,
        payload: payloadData && payloadData
    })

    let url = "https://api.float.com/v3/" + endpoint

    const floatResponse = UrlFetchApp.fetch(url, floatRequestOptions())

    const rawResponse: Array<any> = JSON.parse(floatResponse.getContentText())

    if (!isFloatHolidays(rawResponse)) {
        throw new Error("Error in creating Float Response")
    }
    return rawResponse
}

export const floatDelete = (endpoint:'timeoffs', method:  'delete',  deleteID: number):number => {

    const floatHeaders = () => {
        return {
            accept: "application/json",
            authorization: "Bearer 1483dea8f827bdfaT+0li76ao6d4yRD0apWNGdHtkGv4K2Mu9oT+BeAxCtg="
        }
    }

    const floatRequestOptions = (): URLFetchRequestOptions => ({
        method: method,
        headers: floatHeaders(),
        muteHttpExceptions: true,
    })

    let url = "https://api.float.com/v3/" + endpoint + "/" + String(deleteID)

    const floatResponse = UrlFetchApp.fetch(url, floatRequestOptions())

    const responseCode: number = floatResponse.getResponseCode()

    if (!(responseCode===204)) {
        throw new Error("Error in Deleting holiday from Float")
    }

    return 9999
}
