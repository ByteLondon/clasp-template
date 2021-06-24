import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse
import URLFetchRequest = GoogleAppsScript.URL_Fetch.URLFetchRequest

/**
 * Stub various responses from specific urls
 * @param {Record<string, any>} responses
 */
const responses: Record<string, any> = {}

const urlFetchApp = (responsesInput: Record<string, any>) => {
  Object.assign(responses, responsesInput)
  global.UrlFetchApp = {
    fetch: (url: string) =>
      ({
        getContentText: () => {
          return responses[url] ? `${responses[url]}` : '{}'
        },
      } as HTTPResponse),
    fetchAll: () => {
      return []
    },
    getRequest: (url: string) => {
      console.log(url)
      return ({ url } as unknown) as URLFetchRequest
    },
  }
  return {
    addResponses: (responsesInput: Record<string, any>) => {
      Object.assign(responses, responsesInput)
    },
    removeResponse: (responseKey: string) => {
      delete responses[responseKey]
    }
  }
}

export default urlFetchApp
