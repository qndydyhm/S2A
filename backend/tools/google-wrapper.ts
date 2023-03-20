import { auth, oauth2 } from '@googleapis/oauth2'

import dotenv from 'dotenv'
dotenv.config();


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
 * @returns {
 *      refresh_token,  // This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
 *      access_token,   // A token that can be sent to a Google API.
 *      expiry_date     // The time in ms at which this token is thought to expire.
 * }
 */
const getToken = async (code: string) => await (await oauth2Client.getToken(code)).tokens;

/**
 * Get basic user info from google
 * @param tokens Oauth2 token from user, must have at least userinfo scope
 * @returns 
 */
const getUserInfo = async (tokens: any) => {
    const tempClient = new auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.PROTOCOL + "://" + process.env.DOMAIN_NAME + "/auth/google-callback"
    );
    tempClient.setCredentials(tokens);
    const Oauth2 = oauth2({
        auth: tempClient,
        version: 'v2'
    });
    return (await Oauth2.userinfo.get()).data
}



export default {
    getAuthUrl,
    getToken,
    getUserInfo
}