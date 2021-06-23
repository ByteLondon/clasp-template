//  Read 'JoinSplit' for info on how to update cache point
type QueryType = 'people' | 'projects' | 'clients' | 'logged-time' | 'tasks'

// UI Maker
import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Float Tools')
    .addItem('Step 1: Get Clients', 'PullClients')
    .addItem('Step 2: Get People', 'PullPeople')
    .addItem('Step 3: Get Projects', 'PullProjects')
    .addItem('Step 4: Get LoggedTime', 'PullLoggedTime')
    .addItem('Delete Outdated Rows', 'deleteOutdatedRows')
    .addToUi()
}

// Main function takes in the type of report and finds the total number of pages in that report. Loops through the pages, calling on 'Call URL' to get the response for each, and passing that response to 'Write to Sheet'

function PullFromFloat(type: QueryType) {
  const baseURL = 'https://api.float.com/v3/' + type
  const targetSheetName = type === 'logged-time' ? 'LoggedTime' : type
  switch (type) {
    case 'people':
      sortSheet(targetSheetName, 'MostRecentLogged', 'MostRecentLogged', false, false)
      break
    case 'projects':
      sortPeopleSheet()
      sortSheet(targetSheetName, 'modified', 'project_id')
      break
    default:
      sortPeopleSheet()
      sortSheet(targetSheetName, 'modified', type.replace('-', '_') + '_id')
  }
  deleteOutdatedRows(targetSheetName)

  let subResponse: HTTPResponse
  let totalPages = 0

  if (type === 'logged-time') {
    const peopleIDs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('People')?.getRange('B2:B').getValues() || []
    for (let p = 0; p <= peopleIDs.length; p++) {
      try {
        const personID: string = `${peopleIDs[p][0]}`
        const response = callUrl(baseURL, 1, type, Number(personID))
        const headers: Record<string, unknown> = (response?.getHeaders() as Record<string, unknown>) || {}
        totalPages = Number(headers['x-pagination-page-count']) || 1
        for (let i = 1; i <= totalPages; i++) {
          const rawResponse = callUrl(baseURL, i, type, Number(personID))
          if (rawResponse) {
            subResponse = rawResponse
            const startRow = getStartRow(targetSheetName)
            writeLoggedTimeToSheet(subResponse, targetSheetName, startRow)
            writePersonLastUpdated(personID)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  } else {
    /// These have been moved from the top of the 'Pull from Float' function
    const response = callUrl(baseURL, 1, type) // Calls the first page of the results to find the headers and length
    const headers: Record<string, number> = (response?.getHeaders() as Record<string, number>) || {}
    totalPages = headers['x-pagination-page-count']

    for (let i = 1; i <= totalPages; i++) {
      try {
        subResponse = callUrl(baseURL, i, type)
        var startRow = getStartRow(targetSheetName)
        var skipDedupe
        if (type === 'projects') {
          skipDedupe = true
        }
        writeToSheet(subResponse, targetSheetName, startRow, i, skipDedupe)
      } catch (err) {
        Logger.log(err)
      }
    }
  }
}

// Is given the base url (i.e. report endpoint) and the pagenumber (for pagination) and returns the response as a JSON

function callUrl(baseURL: string, pageNumber: number, type: QueryType, PeopleID?: number): HTTPResponse {
  // Time functions
  const MILLIS_PER_90D = 1000 * 60 * 60 * 24 * 90 // Gets 90 days in Mili
  const MILLIS_PER_10D = 1000 * 60 * 60 * 24 * 10 // Gets 10 days in Mili
  const now = new Date()
  const NinetyDaysAgo = new Date(now.getTime() - MILLIS_PER_90D)
  const From = Utilities.formatDate(NinetyDaysAgo, 'GMT', 'yyyy-MM-dd')
  const TenDaysFuture = new Date(now.getTime() + MILLIS_PER_10D)
  const To = Utilities.formatDate(TenDaysFuture, 'GMT', 'yyyy-MM-dd')

  // Looping functions
  const params = {
    method: 'get' as const,
    qs: { 'User-Agent': 'JDavis%20Byte%20Test%20%28Jack@bytelondon.com%29' },
    headers: { Authorization: 'Bearer 1483dea8f827bdfaT+0li76ao6d4yRD0apWNGdHtkGv4K2Mu9oT+BeAxCtg=' },
  }
  if (type === 'tasks') {
    const url =
      baseURL +
      '?User-Agent=JDavis%20Byte%20Test%20%28Jack@bytelondon.com%29&per-page=200&start_date=' +
      From +
      '&sort=-modified&page=' +
      pageNumber // add in modified=
    return UrlFetchApp.fetch(url, params)
  }
  if (type === 'logged-time') {
    const url =
      baseURL +
      '?User-Agent=JDavis%20Byte%20Test%20%28Jack@bytelondon.com%29&per-page=200&sort=-modified&page=' +
      pageNumber +
      '&start_date=' +
      From +
      '&end_date=' +
      To +
      '&people_id=' +
      PeopleID
    try {
      return UrlFetchApp.fetch(url, params)
    } catch (err) {
      Logger.log('People ID: ' + PeopleID + 'Error: ' + err)
    }
  }
  const url =
    baseURL +
    '?User-Agent=JDavis%20Byte%20Test%20%28Jack@bytelondon.com%29&per-page=200&sort=-modified&page=' +
    pageNumber
  return UrlFetchApp.fetch(url, params)
}

function writePersonLastUpdated(personID: string) {
  const person = personID //|| '17455491'
  const readSheet = SpreadsheetApp.getActive().getSheetByName('People')
  if (readSheet) {
    const headerRow = readSheet.getRange('1:1').getValues()
    const idCol = headerRow[0].indexOf('people_id') + 1
    const writeCol = headerRow[0].indexOf('MostRecentLogged') + 1
    const peopleIDs = readSheet.getRange(1, idCol, readSheet.getLastRow(), 1)
    const find = peopleIDs.createTextFinder(person).findNext()

    if (find != null) {
      const writeRow = find.getRowIndex()
      const writeCell = readSheet.getRange(writeRow, writeCol, 1, 1)
      const now = new Date()
      writeCell.setValue(now)
    }
  } else {
    throw new Error('People sheet not found.')
  }
}

const getStartRow = (targetSheetName: string): number => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(targetSheetName)
  if (sheet) {
    return sheet.getLastRow() + 1
  } else {
    throw new Error(`Sheet ${targetSheetName} not found.`)
  }
}

// Is given a JSON response, finds the text and then writes that to the sheet
function writeToSheet(
  subResponse: HTTPResponse,
  targetSheetName: string,
  startRow: number,
  _: unknown,
  skipDedupe?: boolean
) {
  try {
    const jsonString = subResponse.getContentText()
    const dataObject: Record<string, { name: string }>[] = JSON.parse(jsonString)

    const targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(targetSheetName)

    let results = []
    results.push(Object.keys(dataObject[0]))
    const dataRows = dataObject.map(function (row) {
      return Object.keys(dataObject[0]).map(function (col) {
        return String(row[col])
      })
    })
    const modifiedCol = results[0].lastIndexOf('modified')
    results[0].unshift('CODE')

    for (let d = 0; d <= dataRows.length - 1; d++) {
      dataRows[d].unshift(dataRows[d][0] + dataRows[d][modifiedCol])
    }

    if (targetSheetName === 'people') {
      for (var dep = 0; dep <= dataRows.length - 1; dep++) {
        try {
          dataRows[dep][5] = dataObject[dep].department.name
        } catch (err) {
          //
        }
      }
    }

    results = results.concat(dataRows)
    let resultsFiltered: string[][]
    if (skipDedupe === undefined) {
      resultsFiltered = results.filter(function (row) {
        const completedCodes = SpreadsheetApp.getActive()
          .getSheetByName(targetSheetName)
          ?.getRange('A:A')
          .getValues()
          .join()
        return completedCodes && completedCodes.indexOf(row[0]) < 0
      })
    } else {
      results.shift()
      resultsFiltered = results
    }
    if (resultsFiltered.length && targetSheet) {
      startRow = getStartRow(targetSheetName)
      const range = targetSheet.getRange(startRow, 1, resultsFiltered.length, resultsFiltered[0].length)
      range.setValues(resultsFiltered)
    }
  } catch (err) {
    Logger.log('Error: ' + err)
    return
  }
}

function sortSheet(sheetName: string, sortOne: string, sortTwo: string, ascOne = true, ascTwo = true) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)
  if (sheet) {
    const headers = sheet.getRange('1:1').getValues()[0]
    const sortCol1 = headers.indexOf(sortOne) + 1
    const sortCol2 = headers.indexOf(sortTwo) + 1
    if (sortCol1 > 0 && sortCol2 > 0) {
      sheet.sort(sortCol1, ascOne).sort(sortCol2, ascTwo)
    }
  } else {
    throw new Error(`Sheet ${sheetName} not found`)
  }
}

function sortPeopleSheet() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('People')
  if (!sheet) {
    throw new Error('People sheet not found')
  }
  const headers = sheet.getRange('1:1').getValues()[0]
  const sortCol1 = headers.indexOf('CODE') + 1
  const sortCol2 = headers.indexOf('MostRecentLogged') + 1
  const ascOne = false
  const ascTwo = true

  sheet.sort(sortCol1, ascOne).sort(sortCol2, ascTwo)
  ZeroInPeople()
  sheet.sort(sortCol1, ascOne).sort(sortCol2, ascTwo)
}

function ZeroInPeople() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('People')
  if (!sheet) {
    throw new Error('People sheet not found')
  }
  const headers = sheet.getRange('1:1').getValues()[0]
  const col = headers.indexOf('MostRecentLogged') + 1

  const values = sheet.getRange(2, col, sheet.getLastRow(), 1).getValues()
  const colFilter = values.filter((e) => !!e)
  const numRows = colFilter.length
  if (numRows != sheet.getLastRow() - 1) {
    var blankRange = sheet.getRange(numRows + 2, col, sheet.getLastRow() - numRows - 1, 1)
    blankRange.setValue('0')
  }
}

////////// A seperate WriteToSheet function for LoggedTime
function writeLoggedTimeToSheet(subResponse: HTTPResponse, targetSheetName: string, startRow: number) {
  var jsonString = subResponse.getContentText()
  var isEmptyJSONString = jsonString === '[]'
  var dataObject = JSON.parse(jsonString)
  var results: string[][] = []

  if (isEmptyJSONString || dataObject === null) {
    Logger.log('Subresponse Empty')
  } else {
    for (let r = 0; r < dataObject.length; r++) {
      results = results.concat([
        [
          dataObject[r].logged_time_id + dataObject[r].modified,
          dataObject[r].logged_time_id,
          dataObject[r].date,
          dataObject[r].billable,
          dataObject[r].created,
          dataObject[r].created_by,
          dataObject[r].hours,
          dataObject[r].people_id,
          dataObject[r].project_id,
          dataObject[r].task_id,
          dataObject[r].task_name,
          dataObject[r].modified,
          dataObject[r].modified_by,
          dataObject[r].notes,
        ],
      ])
    }
    const targetSheet = SpreadsheetApp.getActive().getSheetByName(targetSheetName)
    if (!targetSheet) {
      throw new Error(`Sheet ${targetSheet} not found.`)
    }
    const completedCodes = targetSheet.getRange('A:A').getValues().join()
    const resultsFiltered = results.filter(function (row) {
      return completedCodes.indexOf(row[0]) < 0
    })
    if (resultsFiltered.length > 0) {
      const range = targetSheet.getRange(startRow, 1, resultsFiltered.length, 14)
      range.setValues(resultsFiltered)
    }
  }
}

function deleteOutdatedRows(targetSheetName?: string) {
  if (targetSheetName === null || targetSheetName === undefined) {
    targetSheetName = SpreadsheetApp.getUi().prompt('Which sheet?').getResponseText()
  }
  const sheet = SpreadsheetApp.getActive().getSheetByName(targetSheetName)
  if (!sheet) {
    throw new Error(`Sheet ${targetSheetName} not found.`)
  }
  const find = sheet.createTextFinder('OUTDATED!').findAll()
  let deleteList: number[] = []
  find.forEach((e) => {
    const row = e.getRow()
    deleteList = deleteList.concat(row)
  })
  const dlLength = deleteList.length

  for (let d = dlLength - 1; d >= 0; d--) {
    const rowIndex = deleteList[d]
    sheet.deleteRow(rowIndex)
  }
}

// Formula / Log Writing functions

function addFormulaToTasks() {
  var formula =
    '=if(isblank(B2),,join("",ArrayFormula(if(left(text(TO_DATE(row(indirect("c"&D2):indirect("d"&if(E2>44197,44197,E2)))),"Dddd"),1)="S",,text(TO_DATE(row(indirect("c"&D2):indirect("d"&if(E2>44197,44197,E2)))),"dd-mmm-yy")&"(t:"&B2&");"))))'
  var range = SpreadsheetApp.getActive().getSheetByName('Tasks')?.getRange('T2:T')
  if (!range) {
    throw new Error(`Could not get range T2:T on sheet Tasks`)
  }
  range.setFormula(formula)
}

function addFormulaToLoggedTimeWithInfo() {
  const formula =
    '=switch(AA2,"Quarterly Retainer",sumifs(W:W,F:F,F2,A:A,"<="&A2,AB:AB,AB2), "Monthly Retainer",sumifs(W:W,F:F,F2,A:A,"<="&A2,AC:AC,AC2), "Project",sumifs(W:W,F:F,F2,A:A,"<="&A2),)'
  const range = SpreadsheetApp.getActive().getSheetByName('LoggedTimeWithInfo')?.getRange('AE2:AE')
  if (!range) {
    throw new Error(`Could not get range AE2:AE on sheet LoggedTimeWithInfo`)
  }
  range.setFormula(formula)
}

function writeTimeToLog(a1array: string) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Error Checker')
  const range = sheet?.getRange(a1array)
  if (!range) {
    throw new Error(`Could not get range ${a1array} on sheet Error Checker`)
  }
  const dateTime = new Date()
  range.setValue(dateTime)
}

// Splits out tasks by day, from the main 'JOINED' column

function SplitJoin() {
  const readSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks')
  const readRange = readSheet?.getRange(2, readSheet.getLastColumn() - 1, readSheet.getLastRow() - 1, 1)
  if (!readRange) {
    throw new Error(`Could not get range from SplitJoin on sheet Tasks`)
  }
  const values = readRange.getValues() as string[][]
  const cachedToRow = 2
  const result = []
  Logger.clear()

  for (let a = 0; a < values.length; a++) {
    for (let b = 0; b < values[a].length; b++) {
      var intoArray = values[a][b].split(';')
      for (let c = 0; c < intoArray.length; c++) {
        var value = intoArray[c]
        if (value !== '') {
          result.push([value])
        }
      }
    }
  }

  var writeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Daily Task Breakdown')
  var writeRange = writeSheet?.getRange(cachedToRow, 1, result.length, 1)
  if (!writeRange) {
    throw new Error(`Could not get writeRange on sheet Daily Task Breakdown`)
  }
  writeRange.setValues(result)
}

// UI Maker Functions

function PullTasks() {
  PullFromFloat('tasks')
  addFormulaToTasks()
  writeTimeToLog('C14')
}

function PullProjects() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Projects')
  var range = sheet?.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
  range?.clear()
  PullFromFloat('projects')
  writeTimeToLog('C12')
}

function PullClients() {
  PullFromFloat('clients')
  writeTimeToLog('C10')
}

function PullPeople() {
  PullFromFloat('people')
  writeTimeToLog('C11')
}

function PullLoggedTime() {
  PullFromFloat('logged-time')
  writeTimeToLog('C13')
  addFormulaToLoggedTimeWithInfo()
}

function PullTasksPeopleAndProjects() {
  //PullFromFloat('tasks')
  PullFromFloat('projects')
  PullFromFloat('people')
  PullFromFloat('clients')
}
