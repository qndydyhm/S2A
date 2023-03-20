const sheetUrlParser = (URL: string) => {
    const re = new RegExp("^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\/edit#gid=([0-9]+)$")
    const res = re.exec(URL)
    if (!res) return null
    return {
        spreadsheetId: res[1],
        sheetId: parseInt(res[2])
    }
}

const getValuesByColumn = (sheet: any[][], column: string, type?: string): any[] => {
    // TODO: add type checking
    if (!sheet || sheet.length === 0)
        throw "Empty sheet"
    let index = undefined;
    for (let i = 0; i < sheet[0].length; ++ i) {
        if (sheet[0][i] === column){
            index = i
            break
        }
    }
    if (index === undefined)
        throw "Fail to find column " + column + " in sheet " + sheet
    const res = []
    for (let i = 1; i < sheet.length; ++ i) {
        res.push(sheet[i].length > index ? sheet[i][index] : "")
    }
    return res;
}

export default {
    sheetUrlParser,
    getValuesByColumn
}