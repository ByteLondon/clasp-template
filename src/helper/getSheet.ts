import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

export const getSheet = (sheet: "people" | "changes", create: boolean = true): Sheet => {

    const mainDocument = SpreadsheetApp.getActiveSpreadsheet()

    // Check if sheet exists, if not create it
    let peopleSheet: Sheet | null = mainDocument.getSheetByName(sheet)

    if (create && !peopleSheet) {
        mainDocument.insertSheet(sheet)
        peopleSheet = mainDocument.getSheetByName(sheet)
        if (!peopleSheet) {
            throw new Error('Error Creating Sheet')
        }
        const colNames = []
        switch (sheet) {
            case "people":
                colNames.push(
                    ["TableID", "First Name", "Last Name", "Start Date", "Location", "Email", "Bob ID","Float ID"]
                )
                break
            case "changes":
                colNames.push(
                    ["TableID", "Type", "Email", "Bob RequestId", "Bob Policy", "Start Date", "Start Portion", "End Date", "End Portion", "Float Request Start ID", "Float Request Body ID", "Float Request End ID"]
                )
                break
            default:
                throw new Error("Please input a correct endpoint")
        }

        peopleSheet.getRange(1, 1, 1, colNames[0].length).setValues(colNames)
    }

    if (!peopleSheet) {
        throw new Error('Error Getting Sheet')
    }

    return peopleSheet
}

