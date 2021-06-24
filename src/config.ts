import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

const bobHeaders = {
    accept: "application/json",
    authorization: "FoWQdfq4QoVRCMwiOv0qv26zdQ8a6AhVlwU4c1Wc",
    Cookie: "GCLB=CJyk7J-CoN73UA"
}

export const bobRequest : URLFetchRequestOptions = {
    method: 'get',
    headers: bobHeaders,
    muteHttpExceptions: true
};

// const floatHeaders = {
//     method: 'POST',
//     muteHttpExceptions: true,
//     headers:
//         { Authorization: 'Bearer 1483dea8f827bdfaT+0li76ao6d4yRD0apWNGdHtkGv4K2Mu9oT+BeAxCtg=' },
//     payload: formData
// }