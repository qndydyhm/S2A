import { createContext, useContext, useState } from 'react'
import AuthContext from '../auth';
import api from './store-request-api';

export const GlobalStoreActionType = {
    //app section
    LOAD_APP_LIST: "LOAD_APP_LIST",
    OPEN_APP: "OPEN_APP",
    CLOSE_APP: "CLOSE_CURRENT_APP",
    UPDATE_APP: "UPDATE_APP",
    //data source section
    LOAD_DATA_SOURCE_LIST: "LOAD_DATA_SOURCE_LIST",
    CREATE_DATA_SOURCE: "CREATE_DATA_SOURCE",
    UPDATE_DATA_SOURCE: "UPDATE_DATA_SOURCE",
    SET_CURRENT_SELECTED_DATA_SOURCE: "SET_CURRENT_SELECTED_DATA_SOURCE",
    //detail of data source
    SET_CURRENT_SELECTED_COLUMN: "SET_CURRENT_SELECTED_COLUMN",
    //Return to the Login Page
    DEFAULT_LOGIN_SCREEN: "DEFAULT_LOGIN_SCREEN",
    //load different section menu
    CHANGE_SIDEBAR_SECTION: "CHANGE_SIDEBAR_SECTION",
    //Modal
    SHOW_MODAL: "SHOW_MODAL",
    HIDE_MODAL: "HIDE_MODAL",

    //view section
    LOAD_VIEW_LIST: "LOAD_VIEW_LIST",
    CREATE_VIEW: "CREATE_VIEW",
    UPDATE_VIEW: "UPDATE_VIEW",

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
    DATA_SOURCE_SECTION: "DATA_SOURCE_SECTION",
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
        idDataSourcePairs: [],//[{id,dataSource.name}]
        currentApp: null, //{id,name,creator,roleM,publish}if currentApp ! = null, then currently developer is in the editing page,
        currentSelectedDatasource: null,//{id,name,url,sheet_index,key}
        currentSelectedColumnIndex: null,
        currentModal: currentModal.NONE,
        //view
        viewPairs: [],//[{id,name}....]
        currentSelectedViewId: null,//the id of selected view,
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
                    currentAppSheetId: null,
                    currentSelectedViewId: null,

                });
            }
            case GlobalStoreActionType.LOAD_APP_LIST: {
                return setStore({
                    idAppPairs: payload.pairs,
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
                    currentSelectedDatasource: {
                        id: store.currentDatasource.id,
                        name: payload.data_source.name,
                        url: payload.data_source.url,
                        key: payload.data_source.key,
                        sheet_index: payload.data_source.sheet_index,
                        columns: payload.data_source.columns
                    },
                    currentModal: currentModal.NONE

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

            case GlobalStoreActionType.SET_CURRENT_SELECTED_COLUMN_INDEX: {
                return setStore({
                    currentSelectedColumnIndex: payload.index

                });
            }

            case GlobalStoreActionType.SHOW_MODAL: {
                return setStore({
                    modal: payload.modal
                });
            }
            case GlobalStoreActionType.HIDE_MODAL: {
                return setStore({
                    currentSelectedColumnIndex: null,
                    currentModal: currentModal.NONE
                });
            }
            case GlobalStoreActionType.LOAD_DATA_SOURCE_LIST: {
                return setStore({
                    idDataSourcePairs: payload.pairs
                });
            }
            case GlobalStoreActionType.SET_CURRENT_SELECTED_DATA_SOURCE: {
                return setStore({
                    currentSelectedDatasource: payload.pairs
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
            const response = await api.getIdAppPairs();
            // await api.createApp(null,null,null,null, []);
            if (response.data.success) {
                //create default datasource based on the app_id.
                app = response.data.app;
                storeReducer({
                    type: GlobalStoreActionType.OPEN_APP,
                    payload: { app: app }
                })
            }
            else {
                console.log("API FAILED TO CREATE APP");
            }
        }
        asyncCreateDefaultApp();
    }

    //argument app has the format {name,creator,roleM, publish}
    store.editCurrentApp = function (app) {
        async function asyncEditCurrentApp() {
            const response = await api.getIdAppPairs();
            // await api.updateApp(store.currentApp.id, app);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.UPDATE_APP,
                    payload: { app: app }
                })
                //Update the IdApppairs since app is edited
                store.loadIdAppPairs();

            }
            else {
                console.log("API FAIL TO UPDATE CURRENT APP");
            }
        }
        asyncEditCurrentApp();
    }
    store.loadIdDatasourcePair = function () {
        async function asyncLoadIdDataSourcePairs() {
            const response = await api.getIdDatsourcePairs();
            if (response.data.success) {
                let pairs = response.data.idAppPairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_DATA_SOURCE_LIST,
                    payload: { pairs: pairs }
                });
            }
            else {
                console.log("API FAILED TO GET THE DATA SOURCE PAIR");
            }
        }
        asyncLoadIdDataSourcePairs();
    }

    store.setCurrentSelectedDataSource = function (id) {
        async function asyncGetSelectedDataSource() {
            const response = await api.getIdAppPairs();
            //await api.getDataSource(id)
            if (response.data.success) {
                let ds = response.data.data_source;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_SELECTED_DATA_SOURCE,
                    payload: { pairs: ds }
                });
            }

        }
        asyncGetSelectedDataSource();
    }
    store.createNewColumn = function () {
        async function asyncCreateNewColumn() {
            const response = await api.getIdAppPairs();
            let value = store.currentSelectedDatasource;
            value.columns.push("", "", "", "", "");
            //await api.updateDataSource(value);
            if (response.data.success) {

                storeReducer({
                    type: GlobalStoreActionType.UPDATE_DATA_SOURCE,
                    payload: { data_source: value }
                });
            }
        }
        asyncCreateNewColumn();
    }
    store.createNewDataSource = function () {
        async function asyncCreateNewDataSource() {
            const response = await api.getIdAppPairs();
            //await api.createNewDataSource();
            if (response.data.success) {
                let value = store.idDataSourcePairs;
                value.push({id:response.data.data_source.id,name:response.data.data_source.name})
                storeReducer({
                    type: GlobalStoreActionType.LOAD_DATA_SOURCE_LIST,
                    payload: { pairs:value }
                });
            }
        }
        asyncCreateNewDataSource();
    }
    store.setCurrentSelectedColumnIndex = function (index) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_SELECTED_COLUMN,
            payload: { index: index }
        });
    }
    store.showModal = function (modal) {
        storeReducer({
            type: GlobalStoreActionType.SHOW_MODAL,
            payload: { modal: modal }
        });
    }

    store.hideModal = function () {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODAL
        })
    }

    store.updateColumn = async function (column) {
        let v = store.currentSelectedDatasource.columns.splice(store.currentSelectedColumnIndex, 1, column);
        const response = await api.getIdAppPairs();
        //await api.updateDataSource(v);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_DATA_SOURCE,
                payload: { appSource: store.currentDatasource }
            })
        }
    }

    //set the currentApp ==id, and also load the currentApp's i
    store.setCurrentApp = function (id) {
        async function asyncLoadCurrentApp() {
            const response = await api.getIdAppPairs();
            // await api.getAppById(id);
            if (response.data.success) {
                let app = response.data.app;
                storeReducer({
                    type: GlobalStoreActionType.OPEN_APP,
                    payload: { app: app }
                });
            }
            else {
                console.log("API FAILED TO GET THE APP INFO BY ID");
            }
        }
        asyncLoadCurrentApp();
    }

    store.changeSideBarSection = function (section) {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SIDEBAR_SECTION,
            payload: { section: section }
        })
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