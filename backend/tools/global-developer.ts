import googleWrapper from './google-wrapper'
import sheetParser from './sheet-parser'
import globalLogger from './logger'

export default class GlobalDevelopers {
    private static globalDevelopers = new Set()

    public static async loadGlobalDeveloper() {
        const sheet = await googleWrapper.getSheet(process.env.GLOBAL_DEVELOPER_LIST || "")
        if (!sheet || sheet.length === 0) {
            globalLogger.error("Empty global developer sheet or fail to access it")
            throw "Empty global developer sheet or fail to access it"
        }
        const developers = sheetParser.getDeveloperList(sheet)
        if (!developers) {
            globalLogger.error("First row in column A is not “developers”")
        }
        let developerlist = ""
        developers?.forEach((developer) => {
            if (developer) {
                developerlist += ", " + developer
                this.globalDevelopers.add(developer)
            }
        })
        globalLogger.debug("Global developers: " + developerlist)
    }

    public static isInGlobalDevelopers(email: string) {
        return this.globalDevelopers.has(email)
    }
}