import googleWrapper from './google-wrapper'
import sheetParser from './sheet-parser'

export default class GlobalDevelopers {
    private static globalDevelopers = new Set()

    public static async loadGlobalDeveloper() {
        const sheet = await googleWrapper.getSheet(process.env.GLOBAL_DEVELOPER_LIST || "")
        if (!sheet || sheet.length === 0)
            throw "Empty global developer sheet"
        if (sheet[0][0] !== "developers")
            throw "First row of column 1 of global developer sheet is not “developers”"
        const developers = sheetParser.getValuesByColumn(sheet, "developers")
        for (let key in developers) {
            this.globalDevelopers.add(developers[key])
        }
    }

    public static isInGlobalDevelopers(email: string) {
        return this.globalDevelopers.has(email)
    }
}