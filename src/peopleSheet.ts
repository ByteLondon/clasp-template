import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

export const peopleSheet = (create: boolean = true): Sheet => {
    const mainDocument = SpreadsheetApp.getActiveSpreadsheet()

    // Check if sheet exists, if not create it
    let peopleSheet = mainDocument.getSheetByName('People')

    if (create) if (!peopleSheet) {
        mainDocument.insertSheet('People')
        peopleSheet = mainDocument.getSheetByName('People')
        if (!peopleSheet) {
            throw new Error('Error Creating Sheet')
        }
        const colNames = []
        colNames.push(
            ["TableID",
                "First Name",
                "Last Name",
                "Start Date",
                "Location",
                "Email",
                "Bob ID",
                "Float ID"]
        )
        peopleSheet.getRange(1, 1, 1, colNames[0].length).setValues(colNames)
    }

    if (!peopleSheet) {
        throw new Error('Error Getting People Sheet')
    }

    return peopleSheet
}