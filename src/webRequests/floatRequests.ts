import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import {FloatPayloadType} from "../types/FloatPayloadType";
import {isFloatHeaders} from "../types/FloatHeadersType";
import {isFloatPeopleRawArray} from "../types/FloatPeopleType";
import {FloatHolidays, isFloatHolidays} from "../types/FloatHolidaysType";

export const floatRequests = (endpoint:'people' | 'changes', method: 'get')=> {

    const floatHeaders = (page: number) => { return {
        accept: "application/json",
        authorization: "Bearer 1483dea8f827bdfaT+0li76ao6d4yRD0apWNGdHtkGv4K2Mu9oT+BeAxCtg=",
        page: String(page),
        'per-page': String(endpoint === 'people' && 200)
    }}

     const floatRequestOptions = (page: number): URLFetchRequestOptions => ({
        method: method,
        headers: floatHeaders(page),
        muteHttpExceptions: true
    })

    const url = "https://api.float.com/v3/" + endpoint

    const floatResponse = UrlFetchApp.fetch(url, floatRequestOptions(1))

    const requestHeaders = floatResponse.getHeaders()

    if(!isFloatHeaders(requestHeaders)){
        throw new Error('Error in Float Headders')
    }

    const totalPages:number = requestHeaders["X-Pagination-Page-Count"]

    const rawResponse: Array<any> = JSON.parse(floatResponse.getContentText())

    if(totalPages>1){
        for (let i = 2; i <= totalPages; i++) {
            const floatResponse = UrlFetchApp.fetch(url, floatRequestOptions(i))
            rawResponse.push(...JSON.parse(floatResponse.getContentText()))
        }
    }

    if (endpoint === "people" &&!isFloatPeopleRawArray(rawResponse)) {
        throw new Error("Float People Array Corrupt or Missing after Parsing")
    }

    return rawResponse
}

export const floatPost = (endpoint:'timeoffs', method: 'post' | 'delete', payloadData:FloatPayloadType) :FloatHolidays=> {

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

export const floatDelete = (endpoint:'timeoffs', method:  'delete',  deleteID: number) :FloatHolidays=> {

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

    const rawResponse: Array<any> = JSON.parse(floatResponse.getContentText())

    if (!isFloatHolidays(rawResponse)) {
        throw new Error("Error in creating Float Response")
    }
    return rawResponse
}