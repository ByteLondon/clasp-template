import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;
import URLFetchRequest = GoogleAppsScript.URL_Fetch.URLFetchRequest;

type FakeResponse = {
    content: string
    headers?: object
}

/**
 * Stub various responses from specific urls
 * @param {Record<string, any>} responses
 */
const responses: Record<string, any> = {}

global.UrlFetchApp = {
    fetch: (url: string) =>
    ({
        getContentText: () => {
            return responses[url]?.content ? `${responses[url].content}` : '{}'
        },
        getHeaders: (): object | undefined => {
            return responses[url]?.headers ? responses[url].headers : {}
        }
    } as HTTPResponse),
    fetchAll: () => {
        return []
    },
    getRequest: (url: string) => {
        console.log(url)
        return ({url} as unknown) as URLFetchRequest
    },
}
export default {
    addResponses: (responsesInput: Record<string, FakeResponse>) => {
        Object.assign(responses, responsesInput)
    },
    removeResponse: (responseKey: string) => {
        delete responses[responseKey]
    },

}
