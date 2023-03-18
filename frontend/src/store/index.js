import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth';
import api from './store-request-api';

export const GlobalStoreActionType = {
    //app section
    LOAD_APP_LIST: "LOAD_APP_LIST",
    OPEN_APP: "OPEN_APP",
    CLOSE_APP: "CLOSE_CURRENT_APP",
    CREATE_AND_OPEN_APP: "CREATE_AND_OPEN_APP",
    UPDATE_APP: "UPDATE_APP",
    //view section
    LOAD_VIEW_LIST: "LOAD_VIEW_LIST",
    CREATE_VIEW: "CREATE_VIEW",
    UPDATE_VIEW: "UPDATE_VIEW",
    //data source section
    LOAD_DATA_SOURCE_LIST: "LOAD_DATA_SOURCE_LIST",
    CREATE_DATA_SOURCE: "CREATE_DATA_SOURCE",
    UPDATE_DATA_SOURCE: "UPDATE_DATA_SOURCE",

    //detail of data source
    SET_CURRENT_SELECTED_COLUMN: "SET_CURRENT_SELECTED_COLUMN",


    //Return to the Login Page
    DEFAULT_LOGIN_SCREEN: "DEFAULT_LOGIN_SCREEN",

    //load different section menu
    CHANGE_SIDEBAR_SECTION: "CHANGE_SIDEBAR_SECTION",

    //Modal
    SHOW_MODAL: "SHOW_MODAL",
    HIDE_MODAL: "HIDE_MODAL",

}

//None:User is in non-app editing page
//APP_INFO_SECTION: User is in app-editing page, and in the app-info section trying to edit it
//VIEW_SECTION: User is in app-editing page, and in the view section trying to edit it
//DATA_SOURCE_SECTION: User is in app-editing page, and in the data source section trying to edit it
//PREVIEW_SECTION: User has already finished editing their info, it will show the result
const CurrentSideBar = {
    NONE: "NONE",
    APP_INFO_SECTION: "APP_INFO_SECTION",
    VIEW_SECTION: "VIEW_SECTION",
    DATA_SOURCE_SECTION: "EDIT_SONG",
    PREVIEW_SECTION: "PREVIEW_SECTION",
}

const currentModal = {
    NONE: "NONE",
    EDIT_COLUMN: "EDIT_COLUMN",
}

export const GlobalStoreContext = createContext({});
function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentSideBar: CurrentSideBar.NONE,
        idAppPairs: [],//[{id,title}....]
        viewPairs: [],//[{id,name}....]
        currentApp: null, //{id,name,creator,roleM,publish}if currentApp ! = null, then currently developer is in the editing page,
        currentDatasource: null,//{id,name,url,sheet_index,key}
        currentAppSheetId: null,
        currentSelectedViewId: null,//the id of selected view,
        currentSelectedColumn: null,
        modal: currentModal.NONE,

    });
    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };