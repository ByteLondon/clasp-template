import Logger = GoogleAppsScript.Base.Logger

/**
 * Stub Logger to console.lof
 * @param {Record<string, any>} responses
 */
const logger = () => {
  const loggerStub: typeof Logger = {
    clear: () => {},
    getLog(): string {
      return ''
    },
    log(data: any): Logger {
      console.log(data)
      return {} as Logger
    },
  }
  global.Logger = loggerStub
}

export default logger
