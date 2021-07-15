import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

export const getSheet = (sheet: "people" | "changes", create: boolean = true): Sheet => {

    const mainDocument = SpreadsheetApp.getActiveSpreadsheet()

    // Check if sheet exists, if not create it
    let peopleSheet: Sheet | null = mainDocument.getSheetByName(sheet)

    if (create && !peopleSheet) {
        mainDocument.insertSheet('People')
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
                    ["Table ID", "Change Type", "Employee Email", "Bob Request Id", "Policy Type", "Start Date", "Start Portion", "End Date", "End Portion", "FloatStart", "FloatBody", "FloatEnd"]
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