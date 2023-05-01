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
    if (!checkUniqueness(sheet[0])) 
        throw "Sheet columns name is not unique"
    for (let i = 0; i < sheet[0].length; ++i) {
        if (sheet[0][i] === column) {
            index = i
            break
        }
    }
    if (index === undefined)
        throw "Fail to find column " + column + " in sheet " + sheet
    const res = []
    for (let key in sheet) {
        res.push(sheet[key].length > index ? sheet[key][index] : undefined)
    }
    return res;
}


const getDeveloperList = (sheet: any[][]) => {
    if (!sheet || sheet.length === 0 || sheet[0].length === 0 || sheet[0][0] !== "developers") {
        return undefined
    }
    return getValuesByColumn(sheet, "developers").slice(1)
}

const transposeTable = (sheet: any[][]) => {
    const res = Array.from(Array(sheet[0].length), _ => Array(sheet.length))
    for (let i in sheet) {
        for (let j in sheet[i]) {
            res[j][i] = sheet[i][j]
        }
    }
    return res;
}

const checkUniqueness = (column: any[]) => {
    const visited = new Set();
    for (let key in column) {
        if (visited.has(column[key]))
            return false
        visited.add(column[key])
    }
    return true
}

const getRoles = (sheet: any[][], email: string) => {
    const set = new Set();
    for (let i = 0; i < sheet.length; ++i) {
        for (let j = 0; j < sheet[i].length && j < sheet[0].length; ++j) {
            if (sheet[i][j] == email) {
                set.add(sheet[0][j])
            }
        }
    }
    return set;
}

export default {
    sheetUrlParser,
    getValuesByColumn,
    getDeveloperList,
    transposeTable,
    checkUniqueness,
    getRoles
}