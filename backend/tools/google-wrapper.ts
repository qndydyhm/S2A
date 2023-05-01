import { auth, oauth2 } from '@googleapis/oauth2'
import { sheets } from '@googleapis/sheets';
import sheetParser from './sheet-parser';
import globalLogger from './logger';

const APIKEY = process.env.API_KEY

const sheet = sheets("v4");

const oauth2Client = new auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.PROTOCOL + "://" + process.env.DOMAIN_NAME + "/auth/google-callback"
);

const scopes = [
    "email",
    "profile",
    "openid",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    // include_granted_scopes: true
});

/**
 * Get authorization URL for google login
 * @returns string of login URL
 */
const getAuthUrl = (): string => authorizationUrl;

/**
 * Get token from code
 * @param code parameter from callback query
 * @returns
 *      refresh_token,  // This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
 *      access_token,   // A token that can be sent to a Google API.
 *      expiry_date     // The time in ms at which this token is thought to expire.
 */
const getToken = async (code: string) => await (await oauth2Client.getToken(code)).tokens;

/**
 * Get basic user info from google
 * @param tokens Oauth2 token from user, must have at least userinfo scope
 * @returns 
 */
const getUserInfo = async (tokens: any) => {
    try {
        oauth2Client.setCredentials(tokens);
        const Oauth2 = oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        return (await Oauth2.userinfo.get()).data
    }
    catch (e) {
        globalLogger.error(e)
        return null
    }
}
/**
 * Get auth client from tokens if defined else APIKEY
 * @param refresh_token This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
 * @param access_token A token that can be sent to a Google API.
 * @param expiry_date The time in ms at which this token is thought to expire.
 * @returns auth client
 */
const getClient = (refresh_token?: string, access_token?: string, expiry_date?: number) => {
    try {
        let client: any = APIKEY
        if (refresh_token || access_token) {
            oauth2Client.setCredentials({
                refresh_token: refresh_token,
                access_token: access_token,
                expiry_date: expiry_date
            })
            return oauth2Client
        }
        return client;
    }
    catch (e) {
        globalLogger.error(e)
        return null
    }
}

/**
 * Get name of sheet from a google sheet URL
 * @param URL The URL of a google sheet https://docs.google.com/spreadsheetsId/d/aBC-123_xYz/edit#gid=sheetId
 * @param refresh_token This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
 * @param access_token A token that can be sent to a Google API.
 * @param expiry_date The time in ms at which this token is thought to expire.
 * @returns name of sheet or undefined
 */
const getSheetName = async (URL: string, refresh_token?: string, access_token?: string, expiry_date?: number) => {
    try {
        let client = getClient(refresh_token, access_token, expiry_date);
        const sheetInfo = sheetParser.sheetUrlParser(URL)
        if (!sheetInfo) return undefined
        const sheetProp = await sheet.spreadsheets.get({
            auth: client,
            spreadsheetId: sheetInfo.spreadsheetId
        })
        let sheetName = undefined
        for (let key in sheetProp.data.sheets) {
            if (sheetProp.data.sheets[key as any].properties?.sheetId === sheetInfo.sheetId) {
                sheetName = sheetProp.data.sheets[key as any].properties?.title || "";
                break;
            }
        }
        return sheetName;
    }
    catch (e) {
        globalLogger.error(e)
        return undefined
    }
}

/**
 * Get sheet from a google sheet URL
 * @param URL The URL of a google sheet https://docs.google.com/spreadsheetsId/d/aBC-123_xYz/edit#gid=sheetId
 * @param refresh_token This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
 * @param access_token A token that can be sent to a Google API.
 * @param expiry_date The time in ms at which this token is thought to expire.
 * @returns 2d array of the sheet or undefined
 */
const getSheet = async (URL: string, refresh_token?: string, access_token?: string, expiry_date?: number) => {
    try {
        let client: any = getClient(refresh_token, access_token, expiry_date);
        const sheetInfo = sheetParser.sheetUrlParser(URL)
        const sheetName = await getSheetName(URL, refresh_token, access_token, expiry_date);
        if (!sheetName || !sheetInfo) return undefined
        const sheetData = await sheet.spreadsheets.values.get({
            auth: client,
            spreadsheetId: sheetInfo.spreadsheetId,
            range: sheetName
        })
        return sheetData.data.values
    }
    catch (e) {
        globalLogger.error(e)
        return undefined
    }
}

/**
 * Get sheet from a google sheet URL
 * @param URL The URL of a google sheet https://docs.google.com/spreadsheetsId/d/aBC-123_xYz/edit#gid=sheetId
 * @param refresh_token This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
 * @param access_token A token that can be sent to a Google API.
 * @param expiry_date The time in ms at which this token is thought to expire.
 * @returns 2d array of the sheet or undefined
 */
const updateSheet = async (URL: string, data: any[][], refresh_token?: string, access_token?: string, expiry_date?: number) => {
    try {
        let client: any = getClient(refresh_token, access_token, expiry_date);
        const sheetInfo = sheetParser.sheetUrlParser(URL)
        const sheetName = await getSheetName(URL, refresh_token, access_token, expiry_date);
        if (!sheetName || !sheetInfo) return undefined
        await sheet.spreadsheets.values.clear({
            auth: client,
            spreadsheetId: sheetInfo.spreadsheetId,
            range: sheetName
        })
        const result = await sheet.spreadsheets.values.update({
            auth: client,
            spreadsheetId: sheetInfo.spreadsheetId,
            range: sheetName,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: data
            }
        })
        return result
    }
    catch (e) {
        globalLogger.error(e)
        return undefined
    }
}

export default {
    getAuthUrl,
    getToken,
    getUserInfo,
    getSheet,
    getSheetName,
    updateSheet,
}