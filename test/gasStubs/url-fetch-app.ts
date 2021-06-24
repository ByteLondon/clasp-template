import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse
import URLFetchRequest = GoogleAppsScript.URL_Fetch.URLFetchRequest

/**
 * Stub various responses from specific urls
 * @param {Record<string, any>} responses
 */
const urlFetchApp = (responses: Record<string, any>) => {
  const urlFetchAppStub: typeof UrlFetchApp = {
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
  global.UrlFetchApp = urlFetchAppStub
}

export default urlFetchApp
