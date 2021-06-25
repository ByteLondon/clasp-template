import {memoize} from 'lodash/fp'
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

export const camelize: (s: string) => string = memoize((s: string): string => {
  return s
    .replace(/([^A-z0-9 _])/g, ' ')
    .replace(/^[A-z]/, p => p.toLowerCase())
    .replace(/[_\s]([a-z0-9])/g, (_, p1) => p1.toUpperCase())
    .replace(/\s/g, '')
})

export const toCol = (col: number): string =>
{
  let letter = '',
    temp;
  while(col > 0)
  {
    temp 	= (col - 1) % 26;
    letter 	= String.fromCharCode(temp + 65) + letter;
    col 	= (col - temp - 1) / 26;
  }
  return letter;
}

export const getSingleColumn = (dataSheet: Sheet, col: string) => {
  return dataSheet
    .getRange(`${col}:${col}`)
    .getValues()
    .map(e => e[0])
    .filter(e => e)
}

export const getFirstEmptyRow = (dataSheet: Sheet): number => {
  const values = dataSheet.getRange('A:A').getValues()
  let count = 0
  while ( values[count] && values[count][0] != "" ) {
    count;
  }
  return (count+1);
}

