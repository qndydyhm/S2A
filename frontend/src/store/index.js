import { createContext, useContext, useState } from 'react'
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
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CLOSE_APP: {
                return setStore({
                    currentApp: null,
                });
            }
            case GlobalStoreActionType.DEFAULT_LOGIN_SCREEN: {
                return setStore({
                    currentModal: currentModal.NONE,
                    idAppPairs: [],
                    viewPairs: [],
                    currentApp: null,
                    currentDatasource: null,
                    currentAppSheetId: null,
                    currentSelectedViewId: null,

                });
            }
            case GlobalStoreActionType.LOAD_APP_LIST: {
                return setStore({
                    idAppPairs: payload.pairs,
                });
            }
            case GlobalStoreActionType.CREATE_AND_OPEN_APP: {
                return setStore({
                    currentSideBar: CurrentSideBar.APP_INFO_SECTION,
                    currentApp: payload.app,
                    currentDatasource: payload.data_source,
                });
            }
            case GlobalStoreActionType.CHANGE_SIDEBAR_SECTION: {
                return setStore({
                    currentSideBar: payload.section,
                });
            }
            case GlobalStoreActionType.UPDATE_APP: {
                return setStore({
                    currentApp: {
                        id: store.currentApp.id,
                        name: payload.app.name,
                        creator: payload.app.creator,
                        roleM: payload.app.roleM,
                        publish: payload.app.publish
                    },
                });
            }
            case GlobalStoreActionType.UPDATE_DATA_SOURCE: {
                return setStore({
                    currentDatasource: {
                        id: store.currentDatasource.id,
                        name: payload.data_source.name,
                        url: payload.data_source.url,
                        key: payload.data_source.key,
                        sheet_index: payload.data_source.sheet_index,
                    }

                });
            }
            case GlobalStoreActionType.LOAD_VIEW_LIST: {
                return setStore({
                    viewPairs: payload.view,

                });
            }
            case GlobalStoreActionType.OPEN_APP: {
                return setStore({
                    app: payload.app,
                    currentSideBar: CurrentSideBar.APP_INFO_SECTION,

                });
            }

            case GlobalStoreActionType.SET_CURRENT_SELECTED_COLUMN_ID: {
                return setStore({
                    currentSelectedViewId: payload.id

                });
            }

            case GlobalStoreActionType.SHOW_MODAL: {
                return setStore({
                    modal: payload.modal
                });
            }
            case GlobalStoreActionType.HIDE_MODAL: {
                return setStore({
                    currentSelectedColumn: null,
                    currentModal: currentModal.NONE
                });
            }
            default:
                return store;
        }
    }
    //RETURN USER TO THE MAIN SCREEN OF THE APP
    store.returnToMainScreen = function () {
        storeReducer({
            type: GlobalStoreActionType.DEFAULT_LOGIN_SCREEN,
            payload: null
        })
    }
    //RESTORE EVERY STORE VALUE TO DEFAULT
    store.setStoreToDefault = function () {
        storeReducer({
            type: GlobalStoreActionType.DEFAULT_LOGIN_SCREEN,
            payload: null
        })
    }
    //LOAD ALL THE [{id,App}]
    store.loadIdAppPairs = function () {
        async function asyncLoadIdAppPairs() {
            const response = await api.getIdAppPairs(); 
            if (response.data.success) {
                let pairs = response.data.idAppPairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_APP_LIST,
                    payload: { pairs: pairs }
                });
            }
            else {
                console.log("API FAILED TO GET THE APP PAIR");
            }
        }
        asyncLoadIdAppPairs();
    }
    //create default App and Datasource with all values null
    store.createDefaultApp = function () {
        async function asyncCreateDefaultApp() {
            let app = null;
            const data_source = null;
            const response =  await api.getIdAppPairs(); 
            // await api.createDatasource(null,null,null,null, []);
            if (response.data.success) {
                data_source = response.data.app;
                //create default datasource based on the app_id.
                const response1 = await api.getIdAppPairs(); 
                // await api.createApp(null, null,response.data.id,null,[], false);
                if (response1.data.success) {
                    app = response1.data.data_source;
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_AND_OPEN_APP,
                        payload: { app: app, data_source: data_source }
                    })
                    //Update the IdApppairs since new app is added
                    store.loadIdAppPairs();
                }
                else {
                    console.log("API FAIL TO CREATE DATA SOURCE Base on AppId" );
                }
            }
            else {
                console.log("API FAILED TO CREATE APP");
            }
        }
        asyncCreateDefaultApp();
    }

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